"""Contrôles statiques de Mission Finder : vouvoiement, chemins relatifs, ressources externes, ⌘ Y, poids.
Usage : python3 tests/verifier_textes.py   (depuis la racine du dépôt ou ailleurs)"""
import re, glob, html, os, sys
from pathlib import Path
RACINE = Path(__file__).resolve().parent.parent
os.chdir(RACINE)
echecs = []

# 1. Vouvoiement : mots du tutoiement dans les chaînes des fichiers du site
fichiers = glob.glob("js/**/*.js", recursive=True) + glob.glob("data/*.js") + ["index.html", "diffusion/fiche-eleve.html"]
# Noms propres tirés des documents de cours, qui ressemblent à du tutoiement.
EXCEPTIONS = ["Al Tes"]   # auteur fictif de l'exercice 5
TUTOIEMENT = re.compile(r"\b(tu|ton|ta|tes|toi|te|tien|tienne|choisis|reviens|réponds|peux|veux|dois|sais|fais)\b", re.I)
# Impératifs du tutoiement en « -e » : identiques à la 3e personne (« ⌘ A sélectionne tout »),
# donc signalés seulement en début de phrase (« Clique… », « Touche… »).
IMPERATIF = re.compile(r"(?:^|[.!?:]\s+)(Clique|Touche|Essaie|Appuie|Regarde|Vérifie|Ajoute|Sélectionne|Glisse|Tape|Ouvre|Range|Renomme|Compresse|Supprime|Déplace|Copie|Colle|Efface|Recommence|Commence|Joue|Révise|Génère|Trouve|Lis|Écris)\b")
for f in fichiers:
    texte = open(f, encoding="utf-8").read()
    if f.endswith(".js"):
        texte = re.sub(r"/\*.*?\*/", " ", texte, flags=re.S)       # commentaires
        texte = re.sub(r"(?m)^\s*//.*$", " ", texte)
    chaines = re.findall(r'"((?:[^"\\]|\\.)*)"', texte) + re.findall(r"'((?:[^'\\]|\\.)*)'", texte)
    if f.endswith(".html"): chaines.append(re.sub(r"<[^>]+>", " ", texte))
    for c in chaines:
        c2 = html.unescape(re.sub(r"<[^>]+>", " ", c))
        for exception in EXCEPTIONS: c2 = c2.replace(exception, " ")
        for m in list(TUTOIEMENT.finditer(c2)) + list(IMPERATIF.finditer(c2.strip())):
            echecs.append(f"tutoiement possible dans {f} : « {m.group(0)} » → {c2.strip()[:80]}")

# 2. Chemins absolus et ressources externes
for f in glob.glob("**/*", recursive=True):
    if not f.endswith((".html", ".css", ".js", ".webmanifest")) or f.startswith(("tests/", "diffusion/")): continue
    t = open(f, encoding="utf-8").read()
    for m in re.finditer(r"""(?:href|src)\s*=\s*["']/|url\(\s*/|https?://""", t):
        extrait = t[m.start():m.start() + 60]
        if "www.w3.org/2000/svg" in extrait: continue
        echecs.append(f"chemin absolu ou ressource externe dans {f} : {extrait!r}")
    if re.search(r"\bfetch\s*\(|type\s*=\s*[\"']module", t): echecs.append(f"fetch ou module ES dans {f}")
    if re.search(r"⌘\s*Y\b", t): echecs.append(f"⌘ Y (exclu) dans {f}")

# 3. Poids du site (hors docs/, tests/ et diffusion/, non chargés par le site)
poids = sum(p.stat().st_size for p in RACINE.rglob("*") if p.is_file() and not any(x in p.parts for x in ("docs", "tests", "diffusion", ".git")))
print(f"Poids du site : {poids/1024:.0f} Ko (limite 1024 Ko)")
if poids > 1024 * 1024: echecs.append("poids du site > 1 Mo")

if echecs:
    print("À VÉRIFIER :"); [print(" -", e) for e in echecs]; sys.exit(1)
print("Vouvoiement, chemins relatifs, ressources externes, ⌘ Y : OK")
