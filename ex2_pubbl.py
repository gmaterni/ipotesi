#!/usr/bin/env python
# coding: utf-8
import json
from pathlib import Path
from pdb import set_trace
import re
import sys

from bs4 import BeautifulSoup

def check_scheda(scheda):
    empty_fields = []
    for field, value in scheda.items():
        if not value:
            s=f"{field}: null"
            empty_fields.append(s)    
    if empty_fields:
        return ",\n".join(empty_fields)
    else:
        return None

def get_scheda(html):
    # Trova la prima riga che contiene l'etichetta "ARTICOLO"
    lines = html.split('\n')
    articolo_line = None
    for i, line in enumerate(lines):
        if 'ARTICOLO' in line:
            articolo_line = i
            break
    if articolo_line is None:
        raise ValueError("Nessuna riga contiene l'etichetta 'ARTICOLO'")
    try:
        # Assegna ad una variabile scheda il testo dall'inizio alla riga che contiene il tag ARTICOLO compresa
        scheda = '\n'.join(lines[:articolo_line + 1])
        # Ripulisce del markup il testo contenuto nella variabile scheda
        soup = BeautifulSoup(scheda, 'html.parser')
        scheda_ripulita = soup.get_text()
        # scheda_ripulita=scheda_ripulita.replace("<!--","").relace("-->")
    except Exception as e:
        sys.exit(e)    
    return scheda_ripulita

def pubbl_articoli(dir_src, dir_trg, num):
    num_str = f"{num:03}"
    source_dir=f"{dir_src}/n{num_str}/html"
    print(source_dir)
    target_dir = Path(dir_trg) / f"n{num_str}"
    print(target_dir)
    # set_trace()
    if target_dir.exists():
        conferma = input(f"{target_dir} esiste.\nVuoi ricrearla:(si/no)")
        if conferma.lower() == 'si':
            for item in target_dir.iterdir():
                if item.is_file():
                    item.unlink()
                elif item.is_dir():
                    item.rmdir()
        else:
            print("Operazione annullata.")
            return
    else:
        target_dir.mkdir(parents=True, exist_ok=True)
    # Legge i files nella directory dir_src
    src_files = sorted(Path(source_dir).glob('*'))
    schede= []
    art_id=90
    for file in src_files:
        if file.is_file():
            with file.open('r', encoding='utf-8') as f:
                ftxt = f.read()
            scheda=get_scheda(ftxt)
            articolo=ftxt
            # Estrai i dati della scheda
            try:
                titolo = re.search(r'TITOLO\s*(.*?)\s*SOTTOTITOLO', scheda, re.DOTALL).group(1).strip()
                sottotitolo = re.search(r'SOTTOTITOLO\s*(.*?)\s*AUTORE', scheda, re.DOTALL).group(1).strip()
                autore = re.search(r'AUTORE\s*(.*?)\s*DATA', scheda, re.DOTALL).group(1).strip()
                data = re.search(r'DATA\s*(.*?)\s*ARTICOLO', scheda, re.DOTALL).group(1).strip()                
                art_id+=10                
            except Exception as e:
                print("\n=========================")
                print(e)
                print(f"\n\nErrore nella scheda del file:\n{file}\n\n")
                sys.exit()
            scheda_json={
                "titolo": titolo,
                "sottotitolo": sottotitolo,
                "autore": autore,
                "data": data,
                "file": file.name,
                "id": str(art_id)
            }
            # art_id+=10
            msg=check_scheda(scheda_json)
            if msg is not None:
                print("================\n")
                print(f"Errore nella scheda del file:\n{file}")
                print("")
                print(msg)
                sys.exit()
            # Aggiungi la scheda alla lista
            schede.append(scheda_json)
            # Scrivi il testo dell'articolo nella directory target
            articolo_file = target_dir / file.name
            print(file.name)
            with articolo_file.open('w', encoding='utf-8') as f:
                f.write(articolo)
    # Scrivi il file sommario.json
    # sommario_file = target_dir / f"{num_str}_sommario.json"
    sommario_file = target_dir / f"sommario.json"
    with sommario_file.open('w', encoding='utf-8') as f:
        json.dump({"schede": schede}, f, ensure_ascii=False, indent=4)
    target_dir.chmod(0o777)
    for item in target_dir.iterdir():
        item.chmod(0o777)

# ./data
def write_num(dir_trg):
    dir_path = Path(dir_trg)
    # Ottieni l'elenco delle directory contenute in dir_trg
    dirs = [d for d in dir_path.iterdir() if d.is_dir()]
    # Crea una lista di numeri nel formato "001", "002", ...
    numeri = [f"n{i:03}" for i in range(1, len(dirs))]
    # Crea il dizionario JSON
    data = {
        "numeri": numeri
    }
    # Crea il percorso del file ipotesi.json
    file_path = dir_path / "ipotesi.json"
    # Scrivi il JSON nel file
    with open(file_path, 'w') as file:
        json.dump(data, file, indent=4)
    # Imposta i permessi del file in lettura e scrittura per tutti gli utenti
    file_path.chmod(0o777)


if __name__ == "__main__":
    if len(sys.argv)<2:
        print("\n\n")
        print("articoli_pubbl.py <num>")
        sys.exit()
    dir_src = "./articoli"
    dir_trg = "./data"
    n=sys.argv[1]
    n=int(n)
    pubbl_articoli(dir_src, dir_trg, n)
    # write_num(dir_trg)
