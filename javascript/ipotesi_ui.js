/** @format */

// const WndPre = (id) => {
//   return {
//     w: UaWindowAdm.create(id),
//     out: null,
//     show(s) {
//       const fh = (txt) => {
//         return `
// <div class="window-text">
// <div class="btn-wrapper">
// <button title="chiudi" onclick="UaWindowAdm.closeThis(this)">X</button>
// </div>
// <pre class="pre-text">${txt}</pre>
// </div>
//     `;
//       };
//       wnds.closeAll();
//       const h = fh(s);
//       this.w.drag();
//       this.w.setZ(12);
//       this.w.vw_vh().setXY(18.5, 10, -1);
//       this.w.setHtml(h);
//       this.w.show();
//     },
//     close() {
//       this.w.close();
//     },
//     open(url) {
//       fetchText(url, (s) => this.show(s));
//     },
//   };
// };
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

const sortSchede = (json) => {
  json.schede.sort((a, b) => {
    const idA = parseInt(a.id, 10);
    const idB = parseInt(b.id, 10);
    return idA - idB;
  });
  return json;
};

// const xsortSchede = (json) => {
//   const sortedSchede = json.schede.sort((a, b) => {
//       const idA = parseInt(a.id, 10);
//       const idB = parseInt(b.id, 10);
//       return idA - idB;
//   });
//   const sortedJson = {
//       schede: sortedSchede
//   };
//   return sortedJson;
// }

const MgrUi = {
  ipotesi: [],
  htmlIndici: null,
  htmlSommario: null,
  numeri: [],
  async init() {
    // lettura della lista dei numeri
    const url = "./data/ipotesi.json";
    const js = await getJson(url);
    this.setting(js.numeri);
  },
  async setting(nums) {
    this.ipotesi = [];
    this.numeri = nums;
    // AAA invertito ordine numeri
    for (const n of this.numeri.reverse()) {
      // lettura del sommario del numero
      const url = `./data/${n}/sommario.json`;
      const sommario = await getJson(url);
      //ordina le schede per id
      const schede = sortSchede(sommario);
      this.ipotesi.push(schede);
    }
    this.buildHtml();
    this.showSommario();
  },
  buildHtml() {
    const fh = (n, js) => {
      const fpath = `./data/${n}/${js.file}`;
      if (!!js.img)
        return `
        <div class="list-item">
        <a href="#" onclick="openReader('${fpath}')"><strong>${js.titolo}</strong></a>
        <p>${js.sottotitolo}</p>
        <p> <img src="${js.img}">   ${js.autore}  </p>
        </div>`;
      return `
        <div class="list-item">
        <a href="#" onclick="openReader('${fpath}')"><strong>${js.titolo}</strong></a>
        <p>${js.sottotitolo}</p>
        <p>${js.autore}</p>
        </div>`;
    };
    const fnum = (n) => {
      const s = n.replace(/^0+/, "");
      return `
      <div class="num">Numero: ${s}</div>
      `;
    };
    const jfh = UaJtfh();

    jfh.init();
    jfh.append('<div class="list">');
    for (let i = 0; i < this.ipotesi.length; i++) {
      const sommarioNumero = this.ipotesi[i];
      // numero
      const num = this.numeri[i];
      jfh.append(fnum(num));
      const schede = sommarioNumero.schede;
      for (const scheda of schede) {
        jfh.append(fh(num, scheda));
      }
    }
    jfh.append("</div>");
    //archivio
    this.htmlIndici = jfh.html();
    const last = this.ipotesi.length - 1;
    const num = this.numeri[last];
    const sommarioLast = this.ipotesi[last];
    //
    jfh.init();
    jfh.append('<div class="list">');
    const schede = sommarioLast.schede;
    for (const scheda of schede) {
      jfh.append(fh(num, scheda));
    }
    jfh.append("</div>");
    this.htmlSommario = jfh.html();
  },
  showSommario() {
    // const item1 = document.getElementById("id_item1");
    // item1.innerHTML = MgrUi.htmlSommario;
    const item1 = document.getElementById("id_item1");
    item1.innerHTML = MgrUi.htmlIndici;
  },
  showIndici() {
    const item1 = document.getElementById("id_item1");
    item1.innerHTML = MgrUi.htmlIndici;
  },
};
