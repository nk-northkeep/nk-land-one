/**
 * Carrega apenas as ferramentas cujo ID foi definido em site-config.js.
 * GTM tem precedência sobre GA4 (o GA4 deve ser configurado dentro do GTM).
 */
(function () {
  const cfg = window.NK_SITE_CONFIG || {};
  const gtmId = String(cfg.gtmContainerId || "").trim();
  const gaId = String(cfg.gaMeasurementId || "").trim();
  const clarityId = String(cfg.clarityProjectId || "").trim();
  const gscToken = String(cfg.searchConsoleVerification || "").trim();
  const bingToken = String(cfg.bingSiteVerification || "").trim();
  const pixelId = String(cfg.metaPixelId || "").trim();

  window.dataLayer = window.dataLayer || [];

  window.nkTrack = function nkTrack(eventName, params) {
    if (!eventName) return;
    const payload = Object.assign({ event: eventName }, params || {});
    window.dataLayer.push(payload);
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, params || {});
    }
    if (typeof window.fbq === "function") {
      window.fbq("trackCustom", eventName, params || {});
    }
  };

  function appendMeta(name, content) {
    if (!content || document.querySelector('meta[name="' + name + '"]')) return;
    const meta = document.createElement("meta");
    meta.setAttribute("name", name);
    meta.setAttribute("content", content);
    document.head.appendChild(meta);
  }

  function loadScript(src) {
    const script = document.createElement("script");
    script.async = true;
    script.src = src;
    document.head.appendChild(script);
    return script;
  }

  function preconnect(href, crossorigin) {
    if (document.querySelector('link[rel="preconnect"][href="' + href + '"]')) return;
    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = href;
    if (crossorigin) link.crossOrigin = "anonymous";
    document.head.appendChild(link);
  }

  appendMeta("google-site-verification", gscToken);
  appendMeta("msvalidate.01", bingToken);

  if (gtmId) {
    preconnect("https://www.googletagmanager.com");
    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    loadScript("https://www.googletagmanager.com/gtm.js?id=" + encodeURIComponent(gtmId));

    const injectNoscript = function () {
      if (!document.body || document.getElementById("nk-gtm-noscript")) return;
      const noscript = document.createElement("noscript");
      noscript.id = "nk-gtm-noscript";
      noscript.innerHTML =
        '<iframe src="https://www.googletagmanager.com/ns.html?id=' +
        encodeURIComponent(gtmId) +
        '" height="0" width="0" style="display:none;visibility:hidden"></iframe>';
      document.body.insertBefore(noscript, document.body.firstChild);
    };

    if (document.body) injectNoscript();
    else document.addEventListener("DOMContentLoaded", injectNoscript);
  } else if (gaId) {
    preconnect("https://www.googletagmanager.com");
    preconnect("https://www.google-analytics.com");
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", gaId, { anonymize_ip: true });
    loadScript("https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(gaId));
  }

  if (clarityId) {
    preconnect("https://www.clarity.ms");
    window.clarity =
      window.clarity ||
      function () {
        (window.clarity.q = window.clarity.q || []).push(arguments);
      };
    loadScript("https://www.clarity.ms/tag/" + encodeURIComponent(clarityId));
  }

  if (pixelId) {
    preconnect("https://connect.facebook.net");
    if (!window.fbq) {
      const fbq = function () {
        fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments);
      };
      fbq.push = fbq;
      fbq.loaded = true;
      fbq.version = "2.0";
      fbq.queue = [];
      window.fbq = fbq;
      window._fbq = fbq;
    }
    window.fbq("init", pixelId);
    window.fbq("track", "PageView");
    loadScript("https://connect.facebook.net/en_US/fbevents.js");
  }
})();
