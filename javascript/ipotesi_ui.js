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
<button class="btn-close" title="chiudi" onclick="UaWindowAdm.closeThis(this)">X</button>
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

const WndDiv = (id) => {
  return {
    w: UaWindowAdm.create(id),
    out: null,
    show(s) {
      const fh = (txt) => {
        return `
<div class="window-text">
<div class="btn-wrapper">
<button class="btn-close" title="chiudi" onclick="UaWindowAdm.closeThis(this)">X</button>
</div>
<div class="div-text">${txt}</div>
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
// {
//   "schede": [
//     {
//       "titolo": "IPOTESI:Un Nuovo Periodico di Approfondimento",
//       "sottotitolo": "La rivista IPOTESI si propone come un'importante\n\npiattaforma di divulgazione e approfondimento nel campo della",
//       "autore": "Archimede AI",
//       "data": "10-12-3034",
//       "file": "n1presentazione_ipotesi.txt",
//       "id": "1"
//
const MgrIndici = {
  indici: [],
  htmlIndici: null,
  htmlIndice: null,
  numeri: [],
  async init() {
    // lettura della lista dei numeri
    const url = "./data/indici.json";
    // const fn = (js) => {
    //   MgrIndici.setting(js);
    // };
    // fetchJson(url, fn);
    const js = await getJson(url);
    this.setting(js.numeri);
  },
  async setting(nums) {
    this.indici = [];
    this.numeri = nums;
    for (const n of this.numeri) {
      const url = `./data/${n}/indice.json`;
      const indice = await getJson(url);
      this.indici.push(indice);
    }
    // await Promise.all(
    //   this.numeri.map(async (n) => {
    //     const url = `./data/${n}/indice.json`;
    //     try {
    //       const response = await fetch(url);
    //       if (!response.ok) {
    //         throw new Error(`HTTP error ${response.status}\nfetchJson\nurl:${url}`);
    //       }
    //       const json = await response.json();
    //       this.indici.push(json);
    //     } catch (error) {
    //       console.error(`Error MgrIndici.setting() ${url}`, error);
    //       alert(`Error MgrIndici.setting() ${url}\n${error}`);
    //     }
    //   })
    // );
    this.buildHtml();
    this.showIndice();
  },

  //<a href="${url}" target="_blank">${url_name}</a>
  //<img class="img" src="${IMG}">

  buildHtml() {
    const fh = (n, js) => {
      const fpath = `./data/${n}/${js.file}`;
      return `
    <div class="list-item">
      <a href="#" onclick="openReader('${fpath}')"><strong>${js.titolo}</strong></a>
      <p>${js.sottotitolo}</p>
      <p>${js.autore}</p>
    </div>
      `;
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
    for (let i = 0; i < this.indici.length; i++) {
      const indiceNumero = this.indici[i];
      // numero
      const num = this.numeri[i];
      jfh.append(fnum(num));
      const schede = indiceNumero.schede;
      for (const scheda of schede) {
        jfh.append(fh(num, scheda));
      }
    }
    jfh.append("</div>");
    this.htmlIndici = jfh.html();
    // console.log("indici", jfh.text());

    // indice numero corrente
    const last = this.indici.length - 1;
    const indiceLast = this.indici[last];
    const num = this.numeri[last];
    jfh.init();
    jfh.append('<div class="list">');
    const schede = indiceLast.schede;
    for (const scheda of schede) {
      jfh.append(fh(num, scheda));
    }
    jfh.append("</div>");
    this.htmlIndice = jfh.html();
    // console.log("indice",jfh.text())
  },
  showIndice() {
    const item1 = document.querySelector(".item1");
    item1.innerHTML = MgrIndici.htmlIndice;
  },
  showIndici() {
    const item1 = document.querySelector(".item1");
    item1.innerHTML = MgrIndici.htmlIndici;
  },
};
