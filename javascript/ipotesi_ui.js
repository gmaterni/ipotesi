/** @format */

const WndPre = (id) => {
  return {
    w: UaWindowAdm.create(id),
    out: null,
    show(s) {
      const fh = (txt) => {
        return `
<div class="window-text">
<div class="btn-wrapper">
<button title="chiudi" onclick="UaWindowAdm.closeThis(this)">X</button>
</div>
<pre class="pre-text">${txt}</pre>
</div>
    `;
      };
      wnds.closeAll();
      const h = fh(s);
      this.w.drag();
      this.w.setZ(12);
      this.w.vw_vh().setXY(18.5, 10, -1);
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
<button  title="chiudi" onclick="UaWindowAdm.closeThis(this)">X</button>
</div>
<div class="div-text">${txt}</div>
</div>
    `; 
      };
      wnds.closeAll();
      const h = fh(s);
      this.w.drag();
      this.w.setZ(12);
      this.w.vw_vh().setXY(20, 10, -1);
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
  wpre: null,
  init() {
    this.wdiv = WndDiv("id_w0");
    this.wpre = WndPre("id_w1");
  },
  closeAll() {
    UaWindowAdm.close("id_w0");
    UaWindowAdm.close("id_w1");
  },
};

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
    for (const n of this.numeri) {
      const url = `./data/${n}/sommario.json`;
      const sommario = await getJson(url);
      this.ipotesi.push(sommario);
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
    this.htmlIndici = jfh.html();
    // console.log("ipotesi", jfh.text());
    // sommario numero corrente
    const last = this.ipotesi.length - 1;
    const sommarioLast = this.ipotesi[last];
    const num = this.numeri[last];
    jfh.init();
    jfh.append('<div class="list">');
    const schede = sommarioLast.schede;
    for (const scheda of schede) {
      jfh.append(fh(num, scheda));
    }
    jfh.append("</div>");
    this.htmlSommario = jfh.html();
    // console.log("sommario",jfh.text())
  },
  showSommario() {
    const item1 = document.querySelector(".item1");
    item1.innerHTML = MgrUi.htmlSommario;
  },
  showIndici() {
    const item1 = document.querySelector(".item1");
    item1.innerHTML = MgrUi.htmlIndici;
  },
};
