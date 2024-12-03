#!/usr/bin/env python
# coding: utf-8
import os
import subprocess
from datetime import datetime


def push_github(prj_name):
    try:
        if not os.path.exists(prj_name):
            print(f"Errore: La directory {prj_name} non esiste")
            return False
        # Entra nella directory del progetto
        os.chdir(prj_name)
        # Verifica se è un repository git
        if not os.path.exists('.git'):
            print("Errore: La directory non è un repository Git")
            return False
        # Esegue git status per verificare modifiche
        status = subprocess.run(['git', 'status'], capture_output=True, text=True)
        if "nothing to commit" in status.stdout:
            print("Nessuna modifica da committare")
            return True
        # Aggiunge tutti i file modificati
        subprocess.run(['git', 'add', '.'])
        
        # Crea il commit con timestamp
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        commit_msg = f"Aggiornamento automatico - {timestamp}"
        subprocess.run(['git', 'commit', '-m', commit_msg])
        
        # Verifica di essere sul branch main
        current_branch = subprocess.run(['git', 'branch', '--show-current'], 
                                     capture_output=True, text=True).stdout.strip()
        if current_branch != 'main':
            subprocess.run(['git', 'checkout', 'main'])
            
        # Esegue il pull per evitare conflitti
        subprocess.run(['git', 'pull', 'origin', 'main'])
        
        # Esegue il push
        push_result = subprocess.run(['git', 'push', 'origin', 'main'], 
                                   capture_output=True, text=True)
        
        if push_result.returncode == 0:
            print("Push completato con successo")
            return True
        else:
            print(f"Errore durante il push: {push_result.stderr}")
            return False
            
    except Exception as e:
        print(f"Si è verificato un errore: {str(e)}")
        return False
    finally:
        # Torna alla directory originale
        os.chdir('..')

if __name__ == "__main__":
    # dir_src = "./articoli"
    dir_trg = "./data"
    # write_num(dir_trg)
    