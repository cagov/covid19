! function(e) {
  var t = {};

  function s(a) {
      if (t[a]) return t[a].exports;
      var i = t[a] = {
          i: a,
          l: !1,
          exports: {}
      };
      return e[a].call(i.exports, i, i.exports, s), i.l = !0, i.exports
  }
  s.m = e, s.c = t, s.d = function(e, t, a) {
      s.o(e, t) || Object.defineProperty(e, t, {
          enumerable: !0,
          get: a
      })
  }, s.r = function(e) {
      "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
          value: "Module"
      }), Object.defineProperty(e, "__esModule", {
          value: !0
      })
  }, s.t = function(e, t) {
      if (1 & t && (e = s(e)), 8 & t) return e;
      if (4 & t && "object" == typeof e && e && e.__esModule) return e;
      var a = Object.create(null);
      if (s.r(a), Object.defineProperty(a, "default", {
              enumerable: !0,
              value: e
          }), 2 & t && "string" != typeof e)
          for (var i in e) s.d(a, i, function(t) {
              return e[t]
          }.bind(null, i));
      return a
  }, s.n = function(e) {
      var t = e && e.__esModule ? function() {
          return e.default
      } : function() {
          return e
      };
      return s.d(t, "a", t), t
  }, s.o = function(e, t) {
      return Object.prototype.hasOwnProperty.call(e, t)
  }, s.p = "", s(s.s = 0)
}([function(e, t, s) {
  s(1), e.exports = s(2)
}, function(e, t, s) {
  "use strict";
  s.r(t), t.default = s.p + "index.min.css"
}, function(e, t, s) {
  "use strict";
  s.r(t);
  var a = {
          i: 0,
          initialize: function(e, t) {
              for (a.i = 1; a.i < t.length; a.i++) t[a.i].style.display = "none";
              for (e[0].classList.add("active"), t[0].attributes["aria-hidden"].value = "false", a.i = 0; a.i < e.length; a.i++) e[a.i].addEventListener("click", (function(e) {
                  var t = document.querySelector("hero-stats").shadowRoot.querySelector(".hero-stats-tabs-item.active"),
                      s = e.target.parentElement,
                      a = t.children[0],
                      i = s.children[0],
                      r = document.querySelector("hero-stats").shadowRoot.querySelector('.hero-stats-slide[aria-labelledby="' + a.attributes["aria-controls"].value + '"]'),
                      n = document.querySelector("hero-stats").shadowRoot.querySelector('.hero-stats-slide[aria-labelledby="' + i.attributes["aria-controls"].value + '"]');
                  t.classList.remove("active"), s.classList.add("active"), r.attributes["aria-hidden"].value = "true", r.style.display = "none", n.attributes["aria-hidden"].value = "false", n.style.display = "block"
              }))
          }
      },
      i = a;
  customElements.define("hero-stats", class extends HTMLElement {
      constructor() {
          super();
          const e = document.getElementById("hero-stats").content;
          this.attachShadow({
              mode: "open"
          }).appendChild(e.cloneNode(!0))
      }
      connectedCallback() {
          const e = this.getData();
          this.shadowRoot.getElementById("hero-stats-slider").innerHTML = function(e) {
              return `\n    <div class="hero-stats-slider">\n\n      <div id="cumulative-panel" class="hero-stats-slide" aria-hidden="false" aria-labelledby="cumulative">\n\n        <div class="hero-stats-row">\n          <div class="hero-stats-row-label">\n            <span class="hero-stats-row-label-text">Cases</span>\n          </div>\n          <div class="hero-stats-row-figure">${e.cumulative.cases.figure}</div>\n          <div class="hero-stats-row-details">${e.cumulative.cases.details}</div>\n        </div>\n\n        <div class="hero-stats-row">\n          <div class="hero-stats-row-label">\n            <span class="hero-stats-row-label-text">Deaths</span>\n          </div>\n          <div class="hero-stats-row-figure">${e.cumulative.deaths.figure}</div>\n          <div class="hero-stats-row-details">${e.cumulative.deaths.details}</div>\n        </div>\n\n        <div class="hero-stats-row">\n          <div class="hero-stats-row-label">\n            <span class="hero-stats-row-label-text">Tests</span>\n          </div>\n          <div class="hero-stats-row-figure">${e.cumulative.tests.figure}</div>\n          <div class="hero-stats-row-details">${e.cumulative.tests.details}</div>\n        </div>\n\n      </div>\n\n      <div id="fortnite-panel" class="hero-stats-slide" aria-hidden="true" aria-labelledby="fortnite">\n\n        <div class="hero-stats-row">\n          <div class="hero-stats-row-label">\n            <span class="hero-stats-row-label-text">Cases</span>\n          </div>\n          <div class="hero-stats-row-figure">${e.fortnite.cases.figure}</div>\n          <div class="hero-stats-row-details">${e.fortnite.cases.details}</div>\n        </div>\n\n        <div class="hero-stats-row">\n          <div class="hero-stats-row-label">\n            <span class="hero-stats-row-label-text">Deaths</span>\n          </div>\n          <div class="hero-stats-row-figure">${e.fortnite.deaths.figure}</div>\n          <div class="hero-stats-row-details">${e.fortnite.deaths.details}</div>\n        </div>\n\n        <div class="hero-stats-row">\n          <div class="hero-stats-row-label">\n            <span class="hero-stats-row-label-text">Tests</span>\n          </div>\n          <div class="hero-stats-row-figure">${e.fortnite.tests.figure}</div>\n          <div class="hero-stats-row-details">${e.fortnite.tests.details}</div>\n        </div>\n\n      </div>\n\n    </div>\n  `
          }(e);
          const t = [this.shadowRoot.getElementById("cumulative-trigger"), this.shadowRoot.getElementById("fortnite-trigger")],
              s = [this.shadowRoot.getElementById("cumulative-panel"), this.shadowRoot.getElementById("fortnite-panel")];
          i.initialize(t, s)
      }
      getData() {
          return {
              cumulative: {
                  cases: {
                      figure: "184,951",
                      details: "186 today"
                  },
                  deaths: {
                      figure: "5,565",
                      details: "63 today"
                  },
                  tests: {
                      figure: "3,411,686",
                      details: "85,243 today"
                  }
              },
              fortnite: {
                  cases: {
                      figure: "109,910",
                      details: "+50.1%"
                  },
                  deaths: {
                      figure: "1,104",
                      details: "+18.6%"
                  },
                  tests: {
                      figure: "1,482,673",
                      details: "+36.5%"
                  }
              }
          }
      }
  })
}]);