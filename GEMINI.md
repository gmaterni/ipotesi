# Project: IPOTESI

## Project Overview

This project, named "IPOTESI," is a static website for an online magazine. The content production workflow is managed by a set of Python scripts that convert articles from `.docx` format to `.html`, and then to `.pdf`. The website itself is built with HTML, CSS (using the Less preprocessor), and vanilla JavaScript.

The core functionalities are:
- **Article Conversion**: Scripts to process articles from `.docx` to `.html`.
- **Content Population**: Scripts to populate the website with the processed articles.
- **PDF Generation**: Scripts to convert the HTML articles into PDF files.
- **Index Generation**: A script to create and update the main and archive indexes of the magazine.
- **Web Interface**: A responsive web interface to display the articles, with features like a theme switcher (dark/light) and a dynamic content loader.

## Building and Running

The project does not have a conventional build system. The website is generated and updated by running the Python scripts in a specific order.

**Workflow:**

1.  **DOCX to HTML Conversion**:
    The `ex1_docx2html.py` script converts `.docx` files from the `articoli/n<number>/docx` directory to `.html` files in the `articoli/n<number>/html` directory.
    ```bash
    python ex1_docx2html.py <number>
    ```

2.  **Publish Articles**:
    The `ex2_pubbl.py` script processes the generated `.html` files, separates the article content from the metadata (scheda), and populates the `data/n<number>` directory with the final `.html` articles and a `sommario.json` file.
    ```bash
    python ex2_pubbl.py <number>
    ```

3.  **HTML to PDF Conversion**:
    The `ex3_html2pdf.py` script converts the `.html` articles from the `data/n<number>` directory into `.pdf` files, which are saved in `data/pdf/n<number>`.
    ```bash
    python ex3_html2pdf.py <number>
    ```

4.  **Build Indexes**:
    The `ex4_buildindexl.py` script generates the `data/indice.html` and `data/archivio.html` files, which are the main indexes for the website.
    ```bash
    python ex4_buildindexl.py
    ```

To view the website, open the `index.html` file in a web browser. This file will automatically redirect to `ipotesi.html`, which is the main page of the magazine.

## Development Conventions

- **Directory Structure**: The project follows a strict directory structure to manage the different stages of the article processing workflow. The `articoli` directory contains the source `.docx` files and the intermediate `.html` files. The `data` directory contains the final `.html` articles, the `sommario.json` files, and the generated `.pdf` files.
- **Styling**: The website uses Less for styling. The main Less file is `less/ipotesi.less`. For development, it's compiled in the browser by `less.js`. For production, it's recommended to pre-compile it to a static CSS file.
- **JavaScript**: The client-side logic is written in vanilla JavaScript and organized into ES6 modules. The main entry point is `javascript/app.js`. The code avoids polluting the global scope and uses event delegation for handling dynamic content.
- **Content Loading**: The website loads content dynamically using the `fetch` API. The articles and indexes are loaded from the `data` directory.
- **Dependencies**: The Python scripts have external dependencies like `python-docx`, `beautifulsoup4`, and `pdfkit`. These are not listed in a `requirements.txt` file and must be installed manually.
