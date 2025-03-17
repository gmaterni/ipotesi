/** @format */ 

const UaJtfh = () => {
  return {
    rows: [],
    init() {
      this.rows = [];
      return this;
    },
    insert(s) {
      this.rows.unshift(s);
      return this;
    },
    append(s) {
      this.rows.push(s);
      return this;
    },
    text(ln = "") {
      return this.rows.join(ln);
    },
    html(ln = "") {
      const h = this.rows.join(ln).replace(/\s+|\[rn\]/g, " ");
      return h;
    },
  };
};


// const jfh = UaJtfh();

// const data = {
//     k0: "Valore k0 ",
//     k1: "Valore k1",
//     k2: "valore 4",
//     k3: "Non so",
//     k4: "3",
//   };

//   const fnh = (d) => `
//    <br/>
//    k0:${d.k0}
//    <br/>k1:${d.k1}
//    <br/>k3:${d.k3}
//    <br/>k4:${d.k4}
//    <br/>k5:${d.k5}
//    `;

//   jfh.init().append(fnh(data));
//   jfh.append("<H3>AAA</H3>");
//   html=jfh.html();
// };
  