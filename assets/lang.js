// Shows one language at a time: English, 简体中文, 繁體中文.
// Order of choice: the link's #en / #zh-hans / #zh-hant, then the visitor's last pick, then the browser language.
(function () {
  var root = document.documentElement;
  root.classList.add("js");
  var codes = { "en": "en", "zh-hans": "zh-Hans", "zh-hant": "zh-Hant" };

  function fromHash() {
    var h = (location.hash || "").slice(1).toLowerCase();
    return codes[h] || null;
  }
  function fromBrowser() {
    var langs = navigator.languages || [navigator.language || "en"];
    for (var i = 0; i < langs.length; i++) {
      var l = String(langs[i]).toLowerCase();
      if (l.indexOf("zh") === 0) {
        return /hant|tw|hk|mo/.test(l) ? "zh-Hant" : "zh-Hans";
      }
      if (l.indexOf("en") === 0) return "en";
    }
    return "en";
  }
  function saved() {
    try { return localStorage.getItem("inkwell-lang"); } catch (e) { return null; }
  }

  function show(lang) {
    var secs = document.querySelectorAll("[data-lang]");
    for (var i = 0; i < secs.length; i++) {
      secs[i].classList.toggle("on", secs[i].getAttribute("data-lang") === lang);
    }
    var btns = document.querySelectorAll(".langs button");
    for (var j = 0; j < btns.length; j++) {
      btns[j].setAttribute("aria-pressed", btns[j].getAttribute("data-set") === lang ? "true" : "false");
    }
    root.setAttribute("lang", lang);
    var t = document.querySelector('[data-lang="' + lang + '"] [data-title]');
    if (t) document.title = t.getAttribute("data-title");
  }

  document.addEventListener("DOMContentLoaded", function () {
    show(fromHash() || saved() || fromBrowser());
    var btns = document.querySelectorAll(".langs button");
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener("click", function () {
        var lang = this.getAttribute("data-set");
        try { localStorage.setItem("inkwell-lang", lang); } catch (e) {}
        show(lang);
      });
    }
  });
  window.addEventListener("hashchange", function () {
    var h = fromHash();
    if (h) show(h);
  });
})();
