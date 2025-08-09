# Project Overview

This project is a static website generator for the online periodical "IPOTESI". It uses a set of Python scripts to process articles written in DOCX format, convert them to HTML, and generate the necessary files for the website.

## Main Technologies

*   **Backend:** Python
*   **Frontend:** HTML, CSS (LESS), JavaScript
*   **Key Python Libraries:**
    *   `pypandoc`: For converting DOCX to HTML.
    *   `python-docx`: For extracting images from DOCX files.
    *   `beautifulsoup4`: For parsing and manipulating HTML.
    *   `pdfkit`: For converting HTML to PDF.

## Architecture

The project follows a clear workflow for processing and publishing articles:

1.  **Article Creation:** Articles are written in DOCX format and placed in the `./articoli/{issue_number}/docx` directory. Each article includes a "scheda" (card) with metadata such as title, subtitle, author, and date.
2.  **DOCX to HTML Conversion:** The `ex1_docx2html.py` script converts the DOCX files to HTML, embedding any images as base64 encoded strings. The "scheda" is included as a comment at the top of the HTML file.
3.  **Article Publication:** The `ex2_pubbl.py` script processes the HTML files, extracts the "scheda" metadata, and creates a `sommario.json` file that contains the metadata for all articles in that issue. The article content is saved as individual HTML files.
4.  **PDF Generation:** The `ex3_html2pdf.py` script converts the HTML articles to PDF format for download.
5.  **Index and Archive Generation:** The `ex4_buildindexl.py` script generates `indice.html` and `archivio.html` files, which are used to display the list of articles on the website.

The website itself is composed of a few key files:

*   `index.html`: A splash screen that redirects to the main page.
*   `ipotesi.html`: The main page of the periodical, which uses JavaScript to load and display the articles from the generated HTML and JSON files.
*   `javascript/`: This directory contains the client-side logic for the website, including fetching and displaying articles, theme switching, and UI interactions.
*   `less/`: This directory contains the LESS files that are compiled into CSS for styling the website.

# Building and Running

The project is run through a series of Python scripts. The following commands are used to process the articles and generate the website content. The `<num>` argument refers to the issue number of the periodical.

*   **Convert DOCX to HTML:**
    ```bash
    python ex1_docx2html.py <num>
    ```
*   **Publish Articles:**
    ```bash
    python ex2_pubbl.py <num>
    ```
*   **Convert HTML to PDF:**
    ```bash
    python ex3_html2pdf.py <num>
    ```
*   **Build Index and Archive:**
    ```bash
    python ex4_buildindexl.py
    ```

# Development Conventions

*   The project uses a consistent directory structure to organize the articles and generated files.
*   The Python scripts are well-documented and follow a clear, procedural style.
*   The website uses modern JavaScript (ES modules) and CSS (LESS) for the frontend.
*   The use of a `sommario.json` file to store article metadata is a good practice for separating data from presentation.
