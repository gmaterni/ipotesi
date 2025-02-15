#!/usr/bin/env python
# coding: utf-8
import os
import sys

from articoli_docx2html import add_scheda_articolo, docx2html

def pathdocx2html(doc_path, html_path):
    docx2html(doc_path, html_path)
    add_scheda_articolo(html_path)

if __name__ == "__main__":
    if len(sys.argv)!=3:
        print("articolo_docx2htmlpy <num> <file_name")
        sys.exit()
    n=sys.argv[1]
    n=int(n)
    num_str = f"n{n:03}"
    doc_name=sys.argv[2]
    html_name = os.path.basename(doc_name).replace(".docx", ".html")
    path_src = f"./articoli/{num_str}/docx/{doc_name}"
    path_dst = f"./articoli/{num_str}/html/{html_name}"
    print(path_src)
    print(path_dst)
    pathdocx2html(path_src, path_dst)
