#!/usr/bin/env python
# coding: utf-8
import json
import re
import sys
from pathlib import Path


def check_scheda(scheda):
    empty_fields = []
    for field, value in scheda.items():
        if not value:
            s=f"{field} null"
            empty_fields.append(s)    
    if empty_fields:
        return ",\n".join(empty_fields)
    else:
        return None

def pubbl_articoli(dir_src, dir_trg, num):
    num_str = f"{num:03}"
    print(num_str)
    target_dir = Path(dir_trg) / f"n{num_str}"
    print(target_dir)
    if target_dir.exists():
        conferma = input(f"{target_dir} esiste.\nVuoi ricrearla.(si): ")
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
    source_dir=f"{dir_src}/n{num_str}"
    src_files = sorted(Path(source_dir).glob('*'))
    schede = []
    for file in src_files:
        if file.is_file():
            with file.open('r', encoding='utf-8') as f:
                content = f.read()
            # Estrai i dati della scheda
            try:
                titolo = re.search(r'TITOLO\s*(.*?)\s*SOTTOTITOLO', content, re.DOTALL).group(1).strip()
                sottotitolo = re.search(r'SOTTOTITOLO\s*(.*?)\s*AUTORE', content, re.DOTALL).group(1).strip()
                autore = re.search(r'AUTORE\s*(.*?)\s*DATA', content, re.DOTALL).group(1).strip()
                data = re.search(r'DATA\s*(.*?)\s*ARTICOLO', content, re.DOTALL).group(1).strip()
                articolo = re.search(r'ARTICOLO\s*(.*)', content, re.DOTALL).group(1).strip()
            except Exception as e:
                print("\n==================\n")
                print(e)
                print(f"Erroe nella scheda del file:\n{file}")
                sys.exit()

            scheda={
                "titolo": titolo,
                "sottotitolo": sottotitolo,
                "autore": autore,
                "data": data,
                "file": file.name,
                "id": str(num)
            }
            msg=check_scheda(scheda)
            if msg is not None:
                print("\n============\n")
                print(f"Errore nella scheda del file:\n{file}")
                print("")
                print(msg)
                sys.exit()

            # Aggiungi la scheda alla lista
            schede.append(scheda)
            # Scrivi il testo dell'articolo nella directory target
            articolo_file = target_dir / file.name
            with articolo_file.open('w', encoding='utf-8') as f:
                f.write(articolo)

    # Scrivi il file indice.json
    # indice_file = target_dir / f"{num_str}_indice.json"
    indice_file = target_dir / f"indice.json"
    with indice_file.open('w', encoding='utf-8') as f:
        json.dump({"schede": schede}, f, ensure_ascii=False, indent=4)

    # Imposta i permessi di lettura e scrittura per tutti gli utenti
    target_dir.chmod(0o777)
    for item in target_dir.iterdir():
        item.chmod(0o777)

def write_num(dir_trg):
    dir_path = Path(dir_trg)
    # Ottieni l'elenco delle directory contenute in dir_trg
    dirs = [d for d in dir_path.iterdir() if d.is_dir()]
    # Crea una lista di numeri nel formato "001", "002", ...
    numeri = [f"n{i:03}" for i in range(1, len(dirs) + 1)]
    # Crea il dizionario JSON
    data = {
        "numeri": numeri
    }
    # Crea il percorso del file indici.json
    file_path = dir_path / "indici.json"
    # Scrivi il JSON nel file
    with open(file_path, 'w') as file:
        json.dump(data, file, indent=4)
    # Imposta i permessi del file in lettura e scrittura per tutti gli utenti
    file_path.chmod(0o777)


if __name__ == "__main__":
    if len(sys.argv)<2:
        print("\n\n")
        print("pubbl_articoli.py <num>")
        sys.exit()
    dir_src = "./articoli"
    dir_trg = "./data"
    n=sys.argv[1]
    n=int(n)
    pubbl_articoli(dir_src, dir_trg, n)
    write_num(dir_trg)
    