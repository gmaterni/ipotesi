#!/usr/bin/env python
# coding: utf-8

import json
import os
import re

def minify_html(html):
    # Remove comments
    html = re.sub(r'<!--.*?-->', '', html, flags=re.DOTALL)
    # Remove whitespace between tags
    html = re.sub(r'>[\s]+<', '><', html)
    # Remove leading and trailing whitespace in text content
    html = re.sub(r'^\s+|\s+$', '', html, flags=re.MULTILINE)
    # Remove multiple spaces in text content
    html = re.sub(r'\s{2,}', ' ', html)
    return html


def listdir_reverse(directory):
    """List directories in reverse order that start with 'n'."""
    try:
        return sorted(
            (d for d in os.listdir(directory) if os.path.isdir(os.path.join(directory, d)) and d.startswith('n')),
            reverse=True
       )
    except Exception as e:
        print(f"Errore durante la lettura della directory: {e}")
        return []


def generate_indice_html(data_directory, output_file, directories):
    # AAA Numero di nueri visibile nella HOME 
    max_num=2
    indice_content = []
    try:
        directories_for_indice = directories[:max_num+1]
        for dir_name in directories_for_indice:
            dir_path = os.path.join(data_directory, dir_name)
            sommario_file = os.path.join(dir_path, 'sommario.json')
            if os.path.exists(sommario_file):
                with open(sommario_file, 'r', encoding='utf-8') as file:
                    sommario_data = json.load(file)
                numero = str(int(dir_name.lstrip('n')))
                indice_content.append(f'<div class="num">Numero: {numero}</div>')
                # Verifica se il campo 'ordine' esiste
                if 'ordine' in sommario_data:
                    ordine = sommario_data['ordine']
                    # Crea un dizionario per mappare il nome del file al suo indice nell'ordine
                    ordine_index = {nome: index for index, nome in enumerate(ordine)}
                    # Ordina le schede in base alla loro posizione nel campo 'ordine'
                    schede_sorted = sorted(sommario_data.get('schede', []), key=lambda x: ordine_index.get(x['file'], float('inf')))
                else:
                    # Se il campo 'ordine' non esiste, usa il codice originale
                    schede_sorted = sorted(sommario_data.get('schede', []), key=lambda x: x['id'])

                for scheda in schede_sorted:
                    titolo = scheda.get('titolo', '')
                    sottotitolo = scheda.get('sottotitolo', '')
                    autore = scheda.get('autore', '')
                    file_path = os.path.join(dir_path, scheda.get('file', ''))
                    st=f"<p>{sottotitolo}</p>"
                    if len(sottotitolo.strip())<=2:
                        st=""
                    indice_content.append(f'''
                    <div class="list-item">
                        <a href="#" onclick="openReader('{file_path}')">
                            <strong>{titolo}</strong>
                        </a>
                        {st}
                        <p class="autore">{autore}</p>
                    </div>
                    ''')
        indice_html = f'<div class="list">{" ".join(indice_content)}</div>'
        h=minify_html(indice_html)
        with open(output_file, 'w', encoding='utf-8') as file:
            file.write(h)
    except Exception as e:
        print(f"Errore durante la generazione del file indice HTML: {e}")

def generate_archivio_html(data_directory, output_file, directories):
    archivio_content = []
    try:
        for dir_name in directories:
            dir_path = os.path.join(data_directory, dir_name)
            sommario_file = os.path.join(dir_path, 'sommario.json')
            if os.path.exists(sommario_file):
                with open(sommario_file, 'r', encoding='utf-8') as file:
                    sommario_data = json.load(file)
                numero = str(int(dir_name.lstrip('n')))
                archivio_content.append(f'<div class="num">Numero: {numero}</div>')
                schede_sorted = sorted(sommario_data.get('schede', []), key=lambda x: x['id'])
                for scheda in schede_sorted:
                    titolo = scheda.get('titolo', '')
                    autore = scheda.get('autore', '')
                    file_path = os.path.join(dir_path, scheda.get('file', ''))
                    archivio_content.append(f'''
                    <div class="list-item2">
                        <a href="#" onclick="openReader('{file_path}')">
                            <strong>{titolo}</strong>
                        </a>
                       <span>{autore}</span></div>
                    ''')
        archivio_html = f'<div class="list">{" ".join(archivio_content)}</div>'
        h=minify_html(archivio_html)
        with open(output_file, 'w', encoding='utf-8') as file:
            file.write(h)
    except Exception as e:
        print(f"Errore durante la generazione del file archivio HTML: {e}")

if __name__ == "__main__":
    # Specify the data directory and output files
    data_directory = './data'
    indice_output = './data/indice.html'
    archivio_output = './data/archivio.html'
    # Get the list of directories in reverse order
    directories = listdir_reverse(data_directory)
    for d in directories:
        print(d)
    # Generate the HTML files
    generate_indice_html(data_directory, indice_output, directories)
    generate_archivio_html(data_directory, archivio_output, directories)
# 
