/** @format */
let fontSize = 18;
const fsizeDef = 18;
const fsizeMax = 32;
const fsizeMin = 14;
const fsizeKey = "fsize_reader";

var textCurrent = "";
let urlCurrent = "";

const fh = (txt) => {
  return `
        <div class="text-reader" id="reader">
            <div class="toolbar">
                <span>chiudi:(Esc)</span>
                <button class="tt-bottom" data-tt="Apri pagina PDF"  onclick="readPDF()">PDF</button>
                <button class="tt-bottom" data-tt="Configura lettore "id="configButton" onclick="toggleSpeak()">⚙️</button>
                <button class="tt-bottom" data-tt="Start/Sop lettore" id="readButton" onclick="toggleReading()">▶</button>
                <button class="tt-bottom" data-tt="Font +" onclick="increaseFontSize()">A+</button>
                <button class="tt-bottom" data-tt="Font -" onclick="decreaseFontSize()">A-</button>
                <button class="tt-left" data-tt="Apri/Chiudi Schermo Intero" onclick="openFullscreen()">⛶</button>
                <button class="tt-left" data-tt="Chiudi" onclick="closeReader()">X</button>
            </div>
            <div class="content" id="content">
            ${txt}
            </div>
        </div>
`;
};

const showReader = (text) => {
  textCurrent = text;
  const s = text;
  // console.log("PAG_HTMn\n", s);
  h = fh(s);
  const w = UaWindowAdm.create("id_reader");
  w.setZ(12);
  // XXX posizione reader
  w.vw_vh().setXY(0.1, 10, -1);
  w.setHtml(h);
  w.show();
  defaultFontSize();
};

function openReader(url) {
  // console.log(url);
  urlCurrent = url;
  fetchText(url, showReader);
  enableEsc();
}

async function readPDF() {
  // ./data/n002/cittadini_nel_volontrarito.html
  // ./data/pdf/n002/cittadini_nel_volontrarito.pdf
  path = urlCurrent.replace("data/", "data/pdf/").replace(".html", ".pdf");
  // console.log(path);
  try {
    const arrayBuffer = await getPdf(path);
    const blob = new Blob([arrayBuffer], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    // console.log(url);
    // Apri il PDF in una nuova scheda
    window.open(url, "_blank");
  } catch (error) {
    console.error("Errore durante la lettura del PDF:", error);
  }
}

function closeReader() {
  disableEsc();
  closeSpeak();
  stopReading();
  UaWindowAdm.close("id_reader");
  if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
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
function defaultFontSize() {
  const s = localStorage.getItem(fsizeKey);
  let v = parseInt(s, 10);
  if (isNaN(v)) v = fsizeDef;
  fontSize = v;
  content.style.fontSize = `${fontSize}px`;
}

function increaseFontSize() {
  const content = document.getElementById("content");
  fontSize = Math.min(fontSize + 2, fsizeMax);
  content.style.fontSize = `${fontSize}px`;
  const s = fontSize.toString();
  localStorage.setItem(fsizeKey, s);
}

function decreaseFontSize() {
  const content = document.getElementById("content");
  fontSize = Math.max(fontSize - 2, fsizeMin);
  content.style.fontSize = `${fontSize}px`;
  const s = fontSize.toString();
  localStorage.setItem(fsizeKey, s);
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

// function formatText(text) {
//   // text = text.replace(/\s+/g, " ").trim();
//   const sentences = text.split(/(?<!\.)\.(?!\.)|\?|\!/g);
//   const list = sentences
//     .map((sentence) => sentence.trim())
//     .filter((sentence) => sentence.length > 0)
//     .map((sentence) => {
//       if (sentence.length > 20) {
//         return `<p>${sentence}</p>`;
//       } else {
//         return sentence;
//       }
//     });
//   const result = list.join(" ");
//   return result;
// }

// function md2html(text) {
//   let html = text;
//   // Escape HTML characters
//   html = html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
//   // Remove comments
//   html = html.replace(/<!--[\s\S]*?-->/g, "");
//   // Headers
//   html = html
//     .replace(/^#{6}\s+(.+)$/gm, "<h6>$1</h6>")
//     .replace(/^#{5}\s+(.+)$/gm, "<h5>$1</h5>")
//     .replace(/^#{4}\s+(.+)$/gm, "<h4>$1</h4>")
//     .replace(/^#{3}\s+(.+)$/gm, "<h3>$1</h3>")
//     .replace(/^#{2}\s+(.+)$/gm, "<h2>$1</h2>")
//     .replace(/^#{1}\s+(.+)$/gm, "<h1>$1</h1>");
//   // Horizontal rules
//   html = html.replace(/^(?:[-*_]){3,}$/gm, "<hr>");
//   // Blockquotes
//   html = html.replace(/^\>\s+(.+)/gm, "<blockquote>$1</blockquote>");
//   // Code blocks
//   html = html.replace(/```([a-z]*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>');
//   // Tables
//   html = html.replace(/^\|(.+)\|$/gm, function (match, content) {
//     const cells = content.split("|").map((cell) => cell.trim());
//     const row = cells.map((cell) => `<td>${cell}</td>`).join("");
//     return `<tr>${row}</tr>`;
//   });
//   html = html.replace(/<tr>.*?<\/tr>/s, function (match) {
//     return match.replace(/<td>/g, "<th>").replace(/<\/td>/g, "</th>");
//   });
//   html = html.replace(/(<tr>.*?<\/tr>\s*)+/s, "<table>$&</table>");
//   // Lists
//   // Ordered lists
//   html = html.replace(/^\d+\.\s+(.+)/gm, "<li>$1</li>");
//   html = html.replace(/(<li>.*<\/li>\s*)+/g, "<ol>$&</ol>");
//   // Unordered lists
//   html = html.replace(/^[-*+]\s+(.+)/gm, "<li>$1</li>");
//   html = html.replace(/(?<!<\/ol>)(<li>.*<\/li>\s*)+(?!<ol>)/g, "<ul>$&</ul>");
//   // Inline elements
//   // Bold
//   html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
//   html = html.replace(/__(.+?)__/g, "<strong>$1</strong>");
//   // Italic
//   html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
//   html = html.replace(/_(.+?)_/g, "<em>$1</em>");
//   // Strikethrough
//   html = html.replace(/~~(.+?)~~/g, "<del>$1</del>");
//   // Inline code
//   html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
//   // Links
//   html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
//   // Images
//   html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');
//   // Task lists
//   html = html.replace(/^\s*- \[ \]\s+(.+)/gm, '<li class="task-list-item"><input type="checkbox" disabled> $1</li>');
//   html = html.replace(/^\s*- \[x\]\s+(.+)/gm, '<li class="task-list-item"><input type="checkbox" checked disabled> $1</li>');
//   // Footnotes
//   html = html.replace(/\[\^(\d+)\](?!:)/g, '<sup><a href="#fn$1" id="ref$1">$1</a></sup>');
//   html = html.replace(/\[\^(\d+)\]:\s*(.+)$/gm, '<div class="footnote" id="fn$1"><sup>$1</sup> $2</div>');
//   // Paragraphs (must come last)
//   html = html.replace(/^(?!<[hbuol\s>]).+$/gm, "<p>$&</p>");
//   // Clean up empty lines
//   html = html.replace(/^\s*[\r\n]/gm, "");
//   return html;
// }
