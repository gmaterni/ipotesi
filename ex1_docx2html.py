#!/usr/bin/env python
# coding: utf-8
import base64
import os
import pathlib as pt
import sys

from bs4 import BeautifulSoup
import pypandoc

def rlist(path: str, match: str = "*") -> list:
    return [str(x) for x in pt.Path(path).rglob(match)]

def make_dir(path: str, mode: int = 0o777):
    p = pt.Path(path)
    p.mkdir(parents=True, exist_ok=True, mode=mode)
    p.chmod(mode=mode)

def process_images_in_html(html_path):
    """Sostituisce i riferimenti alle immagini con dati base64 incorporati"""
    html_dir = os.path.dirname(html_path)
    
    with open(html_path, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f, 'html.parser')
    
    mime_types = {
        '.gif': 'image/gif',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.svg': 'image/svg+xml',
        '.bmp': 'image/bmp',
        '.webp': 'image/webp'
    }
    
    for img in soup.find_all('img'):
        src = img.get('src', '')
        if src.startswith(('data:', 'http:', 'https:')):
            continue
        
        img_path = os.path.normpath(os.path.join(html_dir, src))
        
        if not os.path.isfile(img_path):
            print(f"Attenzione: file immagine non trovato '{img_path}'")
            continue
        
        try:
            with open(img_path, 'rb') as img_file:
                img_data = img_file.read()
                base64_str = base64.b64encode(img_data).decode('ascii')
                
            ext = os.path.splitext(img_path)[1].lower()
            mime = mime_types.get(ext, 'application/octet-stream')
            
            img['src'] = f"data:{mime};base64,{base64_str}"
        except Exception as e:
            print(f"Errore processando {img_path}: {str(e)}")
    
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(str(soup))

def docx2html(docx_path, html_path):
    try:
        output = pypandoc.convert_file(docx_path, 'html', outputfile=html_path)
        assert output == ""
        process_images_in_html(html_path)  # Aggiunta elaborazione immagini
    except Exception as e:
        print(f"Errore: {e}")
        exit(1)

# Il resto del codice rimane invariato
def add_scheda_articolo(hpath):
    with open(hpath,'r', encoding='utf-8') as f:
       html = f.read()
    lines = html.split('\n')
    articolo_line = None
    for i, line in enumerate(lines):
        if 'ARTICOLO' in line:
            articolo_line = i
            break
    if articolo_line is None:
        msg=f"\nSCHEDA VUOTA IN \n{hpath}\n"
        print(msg)
        while True:
            articolo_html = '\n'.join(lines)
            titolo=input("titolo:")
            sottotitolo=input("sottptitolo:")
            autore=input("autorre:")
            data=input("data:")
            scheda_txt=f"""
    TITOLO
    {titolo}
    SOTTOTITOLO
    {sottotitolo}
    AUTORE
    {autore}
    DATA
    {data}
    ARTICOLO
    """
            print(scheda_txt)
            sn=input("confermato:(s/n)")
            if sn.lower()=="s":
                break
            elif sn==".":
                sys.exit(0)
    else:
        articolo_html = '\n'.join(lines[articolo_line + 1:])
        scheda_html = '\n'.join(lines[:articolo_line + 1])
        soup = BeautifulSoup(scheda_html, 'html.parser')
        scheda_txt = soup.get_text()

    scheda_info=f"<!--\n{scheda_txt}\n-->"
    with open(hpath,"w") as f:
        f.write(scheda_info)
        f.write(os.linesep)
        f.write(os.linesep)
        f.write(articolo_html)

def dirdocx2html(src_dir, dest_dir):
    make_dir(dest_dir)
    path_lst = rlist(src_dir, "*.docx")
    for doc_path in path_lst:
        print(doc_path)
        fname = os.path.basename(doc_path).replace(".docx", ".html")
        fname = fname.lower().replace(" ", "_")
        html_path = os.path.join(dest_dir, fname)
        docx2html(doc_path, html_path)
        add_scheda_articolo(html_path)

if __name__ == "__main__":
    if len(sys.argv)!=2:
        print("articoli_docx2htmlpy <num>")
        sys.exit()
    n=sys.argv[1]
    n=int(n)
    num_str = f"n{n:03}"
    dir_src = f"./articoli/{num_str}/docx"
    dir_dst = f"./articoli/{num_str}/html"
    print(dir_src)
    print(dir_dst)
    dirdocx2html(dir_src, dir_dst)
