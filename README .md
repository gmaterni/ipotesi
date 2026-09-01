
### ex1_docx2html.py

Converte articoli da DOCX a HTML.

- Estrae le immagini dal file DOCX e le codifica in base64 (con compressione JPEG)
- Converte il DOCX in HTML tramite pandoc
- Sostituisce i riferimenti alle immagini con versioni base64 inline
- Estrae la "scheda articolo" (TITOLO, SOTTOTITOLO, AUTORE, DATA) e la inserisce come commento HTML
- Centra la prima immagine dopo il titolo

**Uso:** `python ex1_docx2html.py <numero>`
**Esempio:** `python ex1_docx2html.py 11` processa `./articoli/n011/docx/` → `./articoli/n011/html/`

---

### ex2_pubbl.py

Pubblica gli articoli convertiti nella directory `data/`.

- Legge gli HTML generati da `ex1_docx2html.py`
- Estrae i metadati dalla scheda articolo (titolo, sottotitolo, autore, data)
- Genera il file `sommario.json` con l'ordine degli articoli e i relativi metadati
- Copia gli articoli HTML nella directory `data/{num}/`

**Uso:** `python ex2_pubbl.py <numero>`
**Esempio:** `python ex2_pubbl.py 11` pubblica in `./data/n011/`

---

### ex3_buildindexl.py

Genera gli indici HTML per la home page e l'archivio.

- `indice.html`: mostra gli articoli delle ultime 2 uscite (home page)
- `archivio.html`: mostra tutti gli articoli di tutte le uscite
- Legge i file `sommario.json` di ogni numero
- Ordina gli articoli secondo il campo `ordine` nel JSON
- Minifica l'HTML generato

**Uso:** `python ex3_buildindexl.py` (nessun parametro, processa tutti i numeri in `./data/`)

---

### ex4_html2pdf.py

Converte gli articoli HTML in PDF.

- Wrappa ogni articolo in una pagina HTML completa con stile e intestazione IPOTESI
- Utilizza `pdfkit` (wrapper di wkhtmltopdf) per la conversione
- Salva i PDF in `./data/pdf/{num}/`
- Salta i PDF già esistenti

**Uso:** `python ex4_html2pdf.py <numero>`
**Esempio:** `python ex4_html2pdf.py 11` genera PDF in `./data/pdf/n011/`

---

### ex5_html2html.py

Wrappa gli articoli HTML in pagine HTML complete con layout e stile IPOTESI.

- Simile a `ex4_html2pdf.py` ma genera HTML anziché PDF
- Aggiunge header, footer, meta tag e stili CSS
- Include meta tag OpenGraph e robots
- Salva in `./html/{num}/`

**Uso:** `python ex5_html2html.py <numero>`
**Esempio:** `python ex5_html2html.py 11` genera HTML completi in `./html/n011/`

---

### ex6_buildipotesiindex.py

Genera la pagina indice HTML per un singolo numero del periodico.

- Legge il `sommario.json` del numero specificato
- Genera `index_ipotesi{num}.html` con la lista degli articoli
- Include layout completo IPOTESI con stili e meta tag

**Uso:** `python ex6_buildipotesiindex.py <numero>`
**Esempio:** `python ex6_buildipotesiindex.py 11` genera `index_ipotesi11.html`

---

### ex7_build_index_txt.py

Genera un post di testo per Facebook per un singolo numero.

- Legge il `sommario.json` del numero specificato
- Genera `index_ipotesi{num}.txt` formattato per Facebook
- Include titolo, sottotitolo, autore e URL di ogni articolo
- Mostra un'anteprima del post nel terminale

**Uso:** `python ex7_build_index_txt.py <numero>`
**Esempio:** `python ex7_build_index_txt.py 11` genera `index_ipotesi11.txt`

---

## Dipendenze

- `python-docx` - lettura file DOCX
- `pypandoc` - conversione DOCX → HTML
- `beautifulsoup4` - parsing HTML
- `Pillow` - compressione immagini
- `pdfkit` - conversione HTML → PDF (richiede wkhtmltopdf)

## Pipeline di pubblicazione

```
1. ex1_docx2html     DOCX → HTML (con immagini inline)
2. ex2_pubbl         HTML → data/ (con sommario.json)
3. ex3_buildindexl   Genera indice.html e archivio.html
4. ex4_html2pdf      HTML → PDF
5. ex5_html2html     HTML → HTML completo
6. ex6_buildipotesiindex  Genera index per singolo numero
7. ex7_build_index_txt    Genera post Facebook
```
