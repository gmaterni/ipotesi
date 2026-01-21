#!/usr/bin/env python
# coding: utf-8
import json
from pathlib import Path
import re
import sys
from pdb import set_trace

def generate_ipotesi_index(num):
    """
    Generate an HTML index page for a specific issue of IPOTESI magazine
    with the same structure as index_ipotesi.html
    """
    num_str = f"n{num:03}"
    
    # Read the sommario.json file for this issue
    sommario_path = Path(f"data/{num_str}/sommario.json")
    
    if not sommario_path.exists():
        print(f"Error: sommario.json not found for issue {num_str}")
        sys.exit(1)
    
    with sommario_path.open('r', encoding='utf-8') as f:
        sommario_data = json.load(f)
    
    # Extract the article order and metadata
    ordine = sommario_data.get('ordine', [])
    schede = sommario_data.get('schede', [])
    
    # Create a mapping from filename to article metadata
    articles = {scheda['file']: scheda for scheda in schede}
    
    # Generate the HTML content
    html_content = f'''<!DOCTYPE html>
<html lang="it">

    <head>
        <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
        <meta http-equiv="Pragma" content="no-cache">
        <meta http-equiv="Expires" content="0">
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="IPOTESI - Periodico di approfondimento" />
        <meta name="keywords" content="IPOTESI, periodico, approfondimento" />
        <meta property="og:title" content="IPOTESI - Numero {num}" />
        <meta property="og:description" content="Periodico di approfondimento - Numero {num}" />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="http://www.ipotesi.eu" />
        <meta name="robots" content="index, follow" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'><path d='M12 2h1v20h-1z'/><path d='M9 5h6v1H9zM9 18h6v1H9z'/></svg>">
        <title>IPOTESI</title>
        <style>
            body {{
                font-family: Arial, sans-serif;
                margin: 5px;
                margin-left: 100px;
                margin-right: 100px;
            }}

            .ipotesi {{
                position: absolute;
                top: 0;
                left: 40%;
                width: 100%;
                margin: 0 auto;
                padding: 0;
                font-size: 70px;
                font-weight: bold;
                font-family: "Courier New", Courier, monospace;
                text-transform: uppercase;
                line-height: 1;
                letter-spacing: 9px;
            }}

            w h3 {{
                text-align: center;
                font-size: 40px;
                font-weight: bold;
                font-style: italic;
            }}

            .subtitle {{
                position: absolute;
                top: 60px;
                left: 5px;
                font-size: 30px;
                font-weight: bold;
                font-style: italic;
            }}

            .numero {{
                position: absolute;
                top: 90px;
                left: 45vw;
                font-size: 40px;
                font-weight: bold;
                font-style: italic;
                margin: 10 0 10 0;
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
                margin-top: 80px;
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
        <br>
        <div class="numero">
            Numero: {num}
        </div>


        <div class="content">
            <div class="list">
'''
    
    # Add each article to the HTML
    for filename in ordine:
        if filename in articles:
            article = articles[filename]
            titolo = article.get('titolo', '')
            sottotitolo = article.get('sottotitolo', '')
            autore = article.get('autore', '')
            
            # Create the article HTML
            html_content += f'''                <div class="list-item">
                    <a href="html/{num_str}/{filename}">
                        <strong>
                            {titolo}
                        </strong>
                    </a>
                    <p>{sottotitolo}</p>
                    <p class="autore">{autore}</p>
                </div>
'''
    
    # Close the HTML
    html_content += '''            </div>
        </div>

    </body>

</html>'''
    
    # Write the HTML file
    output_filename = f"index_ipotesi{num}.html"
    with open(output_filename, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print(f"Generated {output_filename}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("\n\n")
        print("Usage: ex6_buildipotesiindex.py <num>")
        print("Where <num> is the issue number (e.g., 10 for issue 10)")
        sys.exit(1)
    
    try:
        num = int(sys.argv[1])
        generate_ipotesi_index(num)
    except ValueError:
        print("Error: Issue number must be an integer")
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)