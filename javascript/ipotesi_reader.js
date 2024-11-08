/** @format */
let fontSize = 18;

const fh = (txt) => {
  return `
        <div class="text-reader" id="reader">
            <div class="toolbar">
                <button onclick="increaseFontSize()">A+</button>
                <button onclick="decreaseFontSize()">A-</button>
                <button onclick="openFullscreen()">⛶</button>
                <button onclick="closeReader()">X</button>
            </div>
            <div class="content" id="content">
            ${txt}
            </div>
        </div>
`;
};

const showReader = (text) => {
  const s = formatText(text);
  h = fh(s);
  const w = UaWindowAdm.create("id_reader");
  w.setZ(12);
  w.vw_vh().setXY(0.1, 10, -1);
  w.setHtml(h);
  w.show();
};

function openReader(url) {
  fetchText(url, showReader);
}

// function closeReader() {
//   UaWindowAdm.close("id_reader");
//   if (document.exitFullscreen) {
//     document.exitFullscreen();
//   }
// }

function closeReader() {
  UaWindowAdm.close("id_reader");
  // Verifica se si è in modalità a schermo intero
  if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
    // Esci dalla modalità a schermo intero
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
}



function formatText(text) {
  text = text.replace(/\s+/g, " ").trim();
  const sentences = text.split(/(?<!\.)\.(?!\.)|\?|\!/g);
  const sp = "&nbsp;&nbsp;&nbsp;";
  const list = sentences
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 0)
    .map((sentence) => `<span class="sentence">${sp}${sentence}</span>`);
  const result = list.join("");
  return result;
}

function increaseFontSize() {
  const content = document.getElementById("content");
  fontSize = Math.min(fontSize + 2, 32);
  content.style.fontSize = `${fontSize}px`;
}

function decreaseFontSize() {
  const content = document.getElementById("content");
  fontSize = Math.max(fontSize - 2, 12);
  content.style.fontSize = `${fontSize}px`;
}

function openFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}


function closeWindow() {
  alert("closeWindow()");
  const reader = document.getElementById("reader");
  reader.style.display = "none";
}
