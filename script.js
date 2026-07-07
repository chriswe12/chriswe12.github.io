const analyticsConfig = {
  googleAnalyticsMeasurementId: "G-VHCEFKM1QC",
  trackLocalhost: false,
};

const hasAnalyticsConsent = () => {
  try {
    return window.localStorage.getItem("analytics-opt-out") !== "true";
  } catch {
    return true;
  }
};

const sendAnalyticsEvent = (eventName, params = {}) => {
  if (typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", eventName, params);
};

const initAnalytics = () => {
  const measurementId = analyticsConfig.googleAnalyticsMeasurementId.trim();
  const isConfigured = /^G-[A-Z0-9]+$/i.test(measurementId);
  const localHosts = new Set(["", "localhost", "127.0.0.1", "::1"]);

  if (!isConfigured || !hasAnalyticsConsent()) {
    return;
  }

  if (!analyticsConfig.trackLocalhost && localHosts.has(window.location.hostname)) {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag() {
      window.dataLayer.push(arguments);
    };

  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    page_location: window.location.href,
    page_path: `${window.location.pathname}${window.location.search}`,
    page_title: document.title,
  });

  const tag = document.createElement("script");
  tag.async = true;
  tag.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(tag);
};

const initInteractionAnalytics = () => {
  const startTime = Date.now();
  let maxScrollDepth = 0;
  let deepestSection = "";
  const fileExtensions = /\.(pdf|docx?|xlsx?|pptx?|zip|csv|mp4|mov|jpg|jpeg|png|svg|webp)$/i;

  const getLinkType = (link) => {
    const href = link.getAttribute("href") || "";

    if (href.startsWith("mailto:")) return "email";
    if (href.startsWith("tel:")) return "phone";
    if (fileExtensions.test(link.pathname)) return "file";
    if (link.host && link.host !== window.location.host) return "external";
    if (href.startsWith("#")) return "anchor";

    return "internal";
  };

  const recordScrollDepth = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;

    if (scrollable <= 0) {
      maxScrollDepth = 100;
      return;
    }

    const currentDepth = Math.round((window.scrollY / scrollable) * 100);
    maxScrollDepth = Math.max(maxScrollDepth, Math.min(currentDepth, 100));
  };

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a");

    if (!link) {
      return;
    }

    sendAnalyticsEvent("link_click", {
      link_url: link.href,
      link_text: link.textContent.trim().slice(0, 100),
      link_type: getLinkType(link),
      page_path: `${window.location.pathname}${window.location.search}`,
      transport_type: "beacon",
    });
  });

  window.addEventListener("scroll", recordScrollDepth, { passive: true });
  recordScrollDepth();

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visibleSection = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visibleSection) {
        deepestSection = visibleSection.target.id || deepestSection;
      }
    },
    { rootMargin: "-20% 0px -55%", threshold: [0.1, 0.35, 0.6] }
  );

  document.querySelectorAll("section[id]").forEach((section) => sectionObserver.observe(section));

  const sendTimeOnPage = () => {
    const secondsOnPage = Math.max(1, Math.round((Date.now() - startTime) / 1000));

    sendAnalyticsEvent("time_on_page", {
      engagement_time_msec: secondsOnPage * 1000,
      seconds_on_page: secondsOnPage,
      max_scroll_depth: maxScrollDepth,
      deepest_section: deepestSection,
      page_path: `${window.location.pathname}${window.location.search}`,
      transport_type: "beacon",
    });
  };

  window.addEventListener("pagehide", sendTimeOnPage, { once: true });
};

initAnalytics();
initInteractionAnalytics();

const yearElement = document.querySelector("[data-year]");

if (yearElement) {
  yearElement.textContent = String(new Date().getFullYear());
}

const navLinks = Array.from(document.querySelectorAll(".nav-link[data-target]"));
const sections = navLinks
  .map((link) => document.getElementById(link.dataset.target))
  .filter(Boolean);

if (navLinks.length && sections.length) {
  const setActive = (id) => {
    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.dataset.target === id);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible) {
        setActive(visible.target.id);
      }
    },
    { rootMargin: "-20% 0px -55%", threshold: [0.1, 0.35, 0.6] }
  );

  sections.forEach((section) => observer.observe(section));
  setActive(sections[0].id);
}
