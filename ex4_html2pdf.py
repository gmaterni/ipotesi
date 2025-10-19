#!/usr/bin/env python3
# coding: utf-8

import os
from pathlib import Path
import sys

import pdfkit

def build_html_page(html_content):
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
                margin: 5px;
                margin-left:100px;
                margin-right:100px;
            }} 
            .ipotesi {{
                position: absolute;
                top: 0;
                left: 40%;
                width:100%;
                margin: 0 auto;
                padding: 0;
                font-size: 70px;
                font-weight: bold;
                font-family: "Courier New", Courier, monospace;
                text-transform: uppercase;
                line-height: 1;
                letter-spacing: 9px;
            }}w
            h3 {{
              text-align: center;
              font-size: 40px;
              font-weight: bold;
              font-style: italic;
            }}

            .subtitle {{
                position: absolute;
                top:60px;
                left: 5px;
                font-size: 30px;
                font-weight: bold;
                font-style: italic;
            }}
            .link {{
                position: absolute;
                top: 60px;
                right: 10px;
                font-size: 25px;
                font-weight: bold;
            }}
            .link a {{
                color: #1a73e8;
                text-decoration: none;
                font-weight: bold;
                transition: color 0.3s ease;
            }}

            .link a:hover {{
                color: #d93025;
                text-decoration: underline;
            }}

            .link a:visited {{
                color: #4b0082;
            }}

            .content {{
                margin: 0 auto;
                margin-top:80px;
                padding: 10px;
                border: 1px solid #ccc;
                background-color: #f9f9f9;
                font-size: 28px;
                
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
    <br>
        <div class="ipotesi">
        IPOTESI 
        </div>
        <div class="subtitle">
        Periodico di approfondimento
        </div>
        <div class="link">
            <a href="http://www.ipotesi.eu" target="_blank">www.ipotesi.eu</a>
        </div>
        <div class="content">
            {html_content}
        </div>
    </body>

</html>

    """
    return page

def list_html_files(directory):
    return list(directory.glob('*.html'))

def convert_html_to_pdf(html_content, output_path):
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
            # Define the path for the PDF file
            pdf_file_path = pdf_directory_path / f"{html_file.stem}.pdf"

            # Check if the PDF file already exists
            if pdf_file_path.exists():
                print(f"\nIl file PDF {pdf_file_path} esiste già. Saltato.")
                continue

            # Read the content of the HTML file
            with open(html_file, 'r', encoding='utf-8') as file:
                html_content = file.read()

            # Build the HTML page
            complete_html_page = build_html_page(html_content)

            # Convert HTML to PDF
            convert_html_to_pdf(complete_html_page, pdf_file_path)
        except Exception as e:
            print(f"Errore durante l'elaborazione del file {html_file}: {e}")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("ex3_html2pdf.py <num>")
        sys.exit(1)
    try:
        number = int(sys.argv[1])
    except ValueError:
        print("L'argomento deve essere un numero intero.")
        sys.exit(1)
    main(number)
