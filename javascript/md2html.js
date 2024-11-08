/** @format */
class MD2HTML {
  md2html(md) {
    let html = md;
    html = html.trim();
    // Gestione dei paragrafi (migliore gestione degli spazi)
    html = html
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter((p) => p)
      .map((p) => `<p>${p}</p>`)
      .join("\n");
    // Headers
    html = html.replace(/^# (.*?)$/gm, '<div class="h1">$1</div>');
    html = html.replace(/^## (.*?)$/gm, '<div class="h2">$1</div>');
    html = html.replace(/^### (.*?)$/gm, '<div class="h3">$1</div>');
    // Formattazione in linea
    html = html.replace(/\*\*(.*?)\*\*/g, '<span class="bold">$1</span>');
    html = html.replace(/\*(.*?)\*/g, '<span class="italic">$1</span>');
    html = html.replace(/~~(.*?)~~/g, '<span class="strikethrough">$1</span>');
    html = html.replace(/`([^`]+)`/g, '<span class="code">$1</span>');
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a class="link" href="$2">$1</a>');
    // Blocchi di codice
    html = html.replace(/```([\s\S]*?)```/g, (match, code) => `<div class="codeblock">${code.trim()}</div>`);
    // Liste (migliorata la gestione degli spazi)
    html = html.replace(/^- (.*?)$/gm, (line) => `<div class="list-item">${line.replace(/^- /, "• ")}</div>`);
    html = html.replace(/^\d+\. (.*?)$/gm, (match, content) => `<div class="list-item">${content}</div>`);
    // Blockquotes (migliorata la gestione degli spazi)
    html = html.replace(/^> (.*?)$/gm, (match, content) => `<div class="blockquote">${content}</div>`);
    // Tabelle
    const tableRegex = /\|(.+)\|\n\|[-:\s]+\|\n((?:\|.+\|\n?)+)/g;
    html = html.replace(tableRegex, (match, header, rows) => {
      const headers = header
        .split("|")
        .map((h) => h.trim())
        .filter((h) => h);
      const tableRows = rows.trim().split("\n");
      let table = '<div class="table">\n';
      // Header
      table += '  <div class="table-row">\n';
      headers.forEach((h) => {
        table += `    <div class="table-cell table-header">${h}</div>\n`;
      });
      table += "  </div>\n";
      // Rows
      tableRows.forEach((row) => {
        const cells = row
          .split("|")
          .map((c) => c.trim())
          .filter((c) => c);
        table += '  <div class="table-row">\n';
        cells.forEach((c) => {
          table += `    <div class="table-cell">${c}</div>\n`;
        });
        table += "  </div>\n";
      });
      table += "</div>";
      return table;
    });
    // Line breaks (preserva quelli intenzionali)
    html = html.replace(/\n/g, "<br>\n");
    return html;
  }
}
