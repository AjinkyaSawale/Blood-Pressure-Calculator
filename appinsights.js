// appinsights.js
// Lightweight Application Insights bootstrap for browser
// 


export function initAppInsights(connectionString) {
  if (typeof window === "undefined") return null;

  // Avoid double-loading
  if (window.appInsights) {
    return window.appInsights;
  }

  // Basic snippet from Azure (browser SDK)
  // We use dynamic import style so vitest won't break.
  (function (c, o, n, s, u, a) {
    var t;
    c[s] =
      c[s] ||
      function () {
        (c[s].queue = c[s].queue || []).push(arguments);
      };
    t = o.createElement("script");
    t.async = true;
    t.src =
      "https://js.monitor.azure.com/scripts/b/ai.2.min.js"; // latest browser script
    a = o.getElementsByTagName("script")[0];
    a.parentNode.insertBefore(t, a);
  })(window, document, "script", "appInsights");

  // Configure the SDK
  window.appInsights("cfg", {
    connectionString,
    enableAutoRouteTracking: false,
  });

  return window.appInsights;
}
