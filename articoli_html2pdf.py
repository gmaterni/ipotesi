#!/usr/bin/env python3
# coding: utf-8

import sys
import os
from pathlib import Path
import pdfkit

def build_html_page(html_content):
    """Build a complete HTML page with the given content."""
    page = f"""
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IPOTESI</title>
    <style>
        body {{
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 20px;
        }}
        .content {{
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ccc;
            background-color: #f9f9f9;
        }}
        p {{
            margin-bottom: 15px;
        }}
        strong {{
            font-weight: bold;
        }}
    </style>
</head>
<body>
    <div class="content">
        {html_content}
    </div>
</body>
</html>
    """
    return page

def list_html_files(directory):
    """List all HTML files in the given directory."""
    return list(directory.glob('*.html'))

def convert_html_to_pdf(html_content, output_path):
    """Convert HTML content to a PDF file."""
    try:
        pdfkit.from_string(html_content, output_path)
    except Exception as e:
        error_message = f"Errore durante la conversione in PDF: {e}"
        print(error_message)
        # Create an error file in the same directory as the PDF
        error_file_path = output_path.with_suffix('.err')
        with open(error_file_path, 'w', encoding='utf-8') as error_file:
            error_file.write(error_message)

def main(number):
    """Main function to process HTML files and convert them to PDF."""
    # Create the directory name
    directory_name = f"n00{number}"
    html_directory_path = Path(f"./data/{directory_name}")

    # Create the directory if it doesn't exist
    html_directory_path.mkdir(parents=True, exist_ok=True)

    # Get the list of HTML files
    html_files = list_html_files(html_directory_path)

    # Create the directory for PDFs if it doesn't exist
    pdf_directory_path = Path(f"./data/pdf/{directory_name}")
    pdf_directory_path.mkdir(parents=True, exist_ok=True)

    for html_file in html_files:
        print(html_file)
        try:
            # Read the content of the HTML file
            with open(html_file, 'r', encoding='utf-8') as file:
                html_content = file.read()

            # Build the HTML page
            complete_html_page = build_html_page(html_content)

            # Define the path for the PDF file
            pdf_file_path = pdf_directory_path / f"{html_file.stem}.pdf"

            # Convert HTML to PDF
            convert_html_to_pdf(complete_html_page, pdf_file_path)
        except Exception as e:
            print(f"Errore durante l'elaborazione del file {html_file}: {e}")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("htmldir2pdf.py <num>")
        sys.exit(1)
    try:
        number = int(sys.argv[1])
    except ValueError:
        print("L'argomento deve essere un numero intero.")
        sys.exit(1)
    main(number)
