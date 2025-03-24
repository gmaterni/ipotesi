#!/usr/bin/env python
# coding: utf-8
import os
import pathlib as pt
import sys

from bs4 import BeautifulSoup
import pypandoc

# pip install pypandoc

def rlist(path: str, match: str = "*") -> list:
    return [str(x) for x in pt.Path(path).rglob(match)]

def make_dir(path: str, mode: int = 0o777):
    p = pt.Path(path)
    p.mkdir(parents=True, exist_ok=True, mode=mode)
    p.chmod(mode=mode)


def docx2html(docx_path, html_path):
    try:
        output = pypandoc.convert_file(docx_path, 'html', outputfile=html_path)
        assert output == ""
    except Exception as e:
        print(f"Errore: {e}")
        exit(1)

def add_scheda_articolo(hpath):
    with open(hpath,'r', encoding='utf-8') as f:
       html = f.read()
    # Trova la prima riga che contiene l'etichetta "ARTICOLO"
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
        # Assegna ad una variabile html tutto il testo successivo alla riga che contiene il tag ARTICOLO
        articolo_html = '\n'.join(lines[articolo_line + 1:])
        # Assegna ad una variabile scheda il testo dall'inizio alla riga che contiene il tag ARTICOLO compresa
        scheda_html = '\n'.join(lines[:articolo_line + 1])
        # Ripulisce del markup il testo contenuto nella variabile scheda
        soup = BeautifulSoup(scheda_html, 'html.parser')
        scheda_txt = soup.get_text()

    # commenta la scheda
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
        fname = fname.lower()
        fname = fname.replace(" ", "_")
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
