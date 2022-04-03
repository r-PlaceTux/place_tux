// ==UserScript==
// @name         r/PlaceTux Overlay
// @namespace    https://github.com/r-PlaceTux/place_tux
// @version      1.1.0
// @description  FLOSS forever!
// @author       r/PlaceTux
// @match        https://hot-potato.reddit.com/embed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @license      GPL-3.0
// ==/UserScript==

const checkDelay = 120000
const hashes = {}

// please only insert hash url, otherwise reload without checking hash
async function needsReload(src) {
  if (hashes[src] === undefined) {
    res = await fetch(src)
    text = await res.text()
    hashes[src] = text
    return true
  }
  res = await fetch(src)
  text = await res.text()
  if (hashes[src] !== text) {
    hashes[src] = text
    console.log("reloading image, hash has changed")
    return true
  }
  return false
}

function reload(id, src) {
  const oldI = document.getElementById(id)
  canvas = document
  .getElementsByTagName("mona-lisa-embed")[0]
  .shadowRoot.children[0].getElementsByTagName("mona-lisa-canvas")[0]
  .shadowRoot.children[0]
  if (oldI) {
    canvas.removeChild(oldI);
  }
  canvas.appendChild(
    (function () {
      const i = document.createElement("img");
      i.id = id
      i.src = src + "?nocache=" + + new Date();
      i.style =
        "position: absolute;left: 0;top: 0;image-rendering: pixelated;width: 1000px;height: 1000px;";
      console.log(i);
      return i;
    })()
  )
}

if (window.top !== window.self) {
  window.addEventListener(
    "load",
    () => {
      const reloader = () => {
        // if (needsReload("https://r-placetux.github.io/place_tux/bot_hash")) {
        //   reload("place-tux-overlay-0", "https://r-placetux.github.io/place_tux/tux_overlay.png")
        // }
        reload("place-tux-overlay-0", "https://r-placetux.github.io/place_tux/tux_overlay.png")
        setTimeout(reloader, checkDelay)
      }
      reloader()
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
