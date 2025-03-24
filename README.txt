Struttura directory dov n001 sta per il numero di giornale

a) ./articoli/originali/n001/<articolo_originale.docx>
articoli originali

    articoli_rinomina.py <num>
    aggiusta i nome die files da a) a b)

b) ./articoli/rinominati/n001/<articolo_rinominato.docx>

-------------------------

1) ./ipotesi/articoli/n001/docx/<articolo+scheda>.docs
    articoli docx + scheda

articoli_docx2html.py <num>
- trasforma docx in html e scrive output in 2)

2) ./ipotesi/articoli/n001/html/<articolo+scheda>.html
    articolii html + scheda

articoli_pubbl.py <num>
- esamina articolo e scheda
- separa articolo dalla sheda
- scrive articolo in 4)
- aggiunge scheda in 3)

3) ./ipotesi/data/n001/sommario.json
4) ./ipotesi/data/n001/<articololo.html>

    





