/* The site is light only. This runs before the first paint so the page never flashes dark, and it also
   overrides any "dark" choice that an older visit may have saved in the browser.
   Kept as a separate file (not an inline script) so the Content-Security-Policy can forbid inline scripts. */
(function () {
  try {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.removeItem("theme");
  } catch {
    /* storage blocked: the light theme is already the default */
  }
})();
