/* Sets the saved (or OS-preferred) colour theme before the page first paints, so there is no flash.
   Kept as a separate file (not an inline script) so the Content-Security-Policy can forbid inline scripts. */
(function () {
  try {
    var t = localStorage.getItem("theme");
    if (t !== "light" && t !== "dark") {
      t = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    }
    document.documentElement.setAttribute("data-theme", t);
  } catch {
    /* storage blocked: the default theme stays */
  }
})();
