#!/usr/bin/env python
# coding: utf-8
import json
from pathlib import Path
import sys


def generate_facebook_post(num):
    """
    Generate a Facebook-ready text post for a specific issue of IPOTESI magazine
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

    # Generate the Facebook post text
    post_text = f"IPOTESI - Numero {num}\n"
    post_text += "Periodico di approfondimento\n"
    post_text += "www.ipotesi.eu\n\n"

    # Add each article to the post
    for filename in ordine:
        if filename in articles:
            article = articles[filename]
            titolo = article.get('titolo', '')
            sottotitolo = article.get('sottotitolo', '')
            autore = article.get('autore', '')

            # Build the article URL
            article_url = f"http://www.ipotesi.eu/html/{num_str}/{filename}"

            # Add article to post
            post_text += f"📖 {titolo}\n"
            if sottotitolo:
                post_text += f"{sottotitolo}\n"
            if autore:
                post_text += f"{autore}\n"
            post_text += f"{article_url}\n\n"

    # Write to a text file
    output_filename = f"index_ipotesi{num}.txt"
    with open(output_filename, 'w', encoding='utf-8') as f:
        f.write(post_text)

    print(f"Post generato: {output_filename}")
    print("\n" + "="*60)
    print("ANTEPRIMA DEL POST:")
    print("="*60)
    print(post_text)
    print("="*60)
    print(f"\nCopia il contenuto dal file {output_filename}")
    print("e incollalo direttamente su Facebook!")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("\n")
        print("Usage: ex6_generate_facebook_post.py <num>")
        print("Where <num> is the issue number (e.g., 11 for issue 11)")
        sys.exit(1)

    try:
        num = int(sys.argv[1])
        generate_facebook_post(num)
    except ValueError:
        print("Error: Issue number must be an integer")
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)
