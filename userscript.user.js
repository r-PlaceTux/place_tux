// ==UserScript==
// @name         r/PlaceTux Overlay
// @namespace    https://github.com/r-PlaceTux/place_tux
// @version      1.0.11
// @description  FLOSS forever!
// @author       r/PlaceTux
// @match        https://hot-potato.reddit.com/embed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @license      GPL-3.0
// @downloadURL  https://r-placetux.github.io/place_tux/userscript.user.js
// ==/UserScript==
if (window.top !== window.self) {
  window.addEventListener(
    "load",
    () => {
      document
        .getElementsByTagName("mona-lisa-embed")[0]
        .shadowRoot.children[0].getElementsByTagName("mona-lisa-canvas")[0]
        .shadowRoot.children[0].appendChild(
          (function () {
            const i = document.createElement("img");
            i.src = "https://r-placetux.github.io/place_tux/tux_overlay.png";
            i.style =
              "position: absolute;left: 0;top: 0;image-rendering: pixelated;width: 2000px;height: 1000px;";
            console.log(i);
            return i;
          })()
        );
    },
    false
  );
  window.addEventListener(
    "load",
    () => {
      document
        .getElementsByTagName("mona-lisa-embed")[0]
        .shadowRoot.children[0].getElementsByTagName("mona-lisa-canvas")[0]
        .shadowRoot.children[0].appendChild(
          (function () {
            const j = document.createElement("img");
            j.src = "https://github.com/Atkion/placeCosmereOverlay/raw/master/template.png";
            j.style =
              "position: absolute;left: 0;top: 0;image-rendering: pixelated;width: 2000px;height: 1000px;";
            console.log(j);
            return j;
          })()
        );
    },
    false
  );
}
