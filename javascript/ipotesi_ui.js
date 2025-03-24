/** @format */

//XXX <button onclick="increaseFontSize()">A+</button>
//XXX <button onclick="decreaseFontSize()">A-</button>
const WndDiv = (id) => {
  return {
    w: UaWindowAdm.create(id),
    out: null,
    show(s) {
      const fh = (txt) => {
        return `
<div class="window-text">
<div class="btn-wrapper">
<button  class="tt-left" data-tt="chiudi" onclick="UaWindowAdm.closeThis(this)">X</button>
</div>
<div class="div-text">${txt}</div>
</div>
    `;
      };
      wnds.closeAll();
      const h = fh(s);
      this.w.drag();
      this.w.setZ(12);
      this.w.vw_vh().setXY(0, 10, -1);
      this.w.setHtml(h);
      this.w.show();
    },
    close() {
      this.w.close();
    },
    open(url) {
      fetchText(url, (s) => this.show(s));
    },
  };
};

const wnds = {
  wdiv: null,
  // wpre: null,
  init() {
    this.wdiv = WndDiv("id_w0");
    // this.wpre = WndPre("id_w1");
  },
  closeAll() {
    UaWindowAdm.close("id_w0");
    // UaWindowAdm.close("id_w1");
  },
};

// const sortSchede = (json) => {
//   json.schede.sort((a, b) => {
//     const idA = parseInt(a.id, 10);
//     const idB = parseInt(b.id, 10);
//     return idA - idB;
//   });
//   return json;
// };

const showSommario = function () {
  const item1 = document.getElementById("id_item1");
  const fn = (h) => {
    item1.innerHTML = h;
  };
  const url = "./data/indice.html";
  fetchText(url, fn);
};

const showIndici = function () {
  const item1 = document.getElementById("id_item1");
  const fn = (h) => {
    item1.innerHTML = h;
  };
  const url = "./data/archivio.html";
  fetchText(url, fn);
};
