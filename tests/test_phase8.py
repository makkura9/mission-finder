"""Tests automatiques (phase 8) de Mission Finder : message clair si data/questions.js contient une erreur
(les 3 erreurs du guide « Modifier une question »), documents de diffusion (QR code, fiche élève).
Playwright, Chromium sans interface. Usage : python3 tests/test_phase8.py"""
import subprocess, sys, time, os, shutil, tempfile
from pathlib import Path
from playwright.sync_api import sync_playwright

SITE = Path(__file__).resolve().parent.parent
echecs = []
def verifier(cond, msg):
    print(("  OK   " if cond else "  ÉCHEC ") + msg)
    if not cond: echecs.append(msg)

ORIGINAL = (SITE / "data/questions.js").read_text(encoding="utf-8")
ENONCE = 'enonce: "Dans cette barre des menus, quelle est l\'application active ?",'
FIN_BUR01 = '\n  },\n  {\n    id: "bur-02"'
assert ENONCE in ORIGINAL and FIN_BUR01 in ORIGINAL, "exemple bur-01 introuvable : adapter le test"
LIGNE_ENONCE = ORIGINAL[:ORIGINAL.index(ENONCE)].count("\n") + 1

CAS = [
    ("virgule oubliée", ORIGINAL.replace(FIN_BUR01, '\n  }\n  {\n    id: "bur-02"', 1), False),
    ("guillemet non fermé", ORIGINAL.replace(ENONCE, ENONCE.replace('?",', '?,'), 1), False),
    ("guillemets typographiques", ORIGINAL.replace(ENONCE, 'enonce: “Dans cette barre des menus, quelle est l\'application active ?”,', 1), False),
    ("apostrophe typographique dans le texte (permise)", ORIGINAL.replace(ENONCE, ENONCE.replace("l'application", "l’application"), 1), True),
]

tmp = Path(tempfile.mkdtemp(prefix="mf-phase8-"))
PORT = 8772
try:
    with sync_playwright() as p:
        b = p.chromium.launch()
        for nom, contenu, doitMarcher in CAS:
            dossier = tmp / nom.split()[0]
            shutil.copytree(SITE, dossier, ignore=shutil.ignore_patterns(".git", "tests", "docs", "diffusion"))
            (dossier / "data/questions.js").write_text(contenu, encoding="utf-8")
            serveur = subprocess.Popen([sys.executable, "-m", "http.server", str(PORT), "--bind", "127.0.0.1"], cwd=dossier,
                                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            time.sleep(0.8)
            try:
                for mode, url in (("http", f"http://127.0.0.1:{PORT}/index.html"), ("file://", (dossier / "index.html").as_uri())):
                    ctx = b.new_context(viewport={"width": 360, "height": 800}, is_mobile=True, has_touch=True)
                    pg = ctx.new_page()
                    pg.goto(url); pg.wait_for_timeout(300)
                    h1 = pg.locator("h1").first.inner_text()
                    texte = pg.locator("#app").inner_text()
                    if doitMarcher:
                        verifier(h1 != "Site momentanément indisponible" and "Quiz express" in texte, f"{nom} ({mode}) : le site s'affiche normalement")
                    else:
                        verifier(h1 == "Site momentanément indisponible" and "data/questions.js" in texte and "Prévenez votre enseignant" in texte,
                                 f"{nom} ({mode}) : message clair nommant data/questions.js")
                        if mode == "http":
                            print("         → " + texte.splitlines()[-1])
                    if nom.startswith("guillemet non") and mode == "http":
                        verifier(f"ligne {LIGNE_ENONCE}" in texte, f"guillemet non fermé : numéro de ligne {LIGNE_ENONCE} indiqué")
                    ctx.close()
            finally:
                serveur.terminate(); serveur.wait()
        # Site normal : pas de message d'erreur
        ctx = b.new_context(); pg = ctx.new_page(); erreurs = []
        pg.on("pageerror", lambda e: erreurs.append(str(e)))
        pg.goto((SITE / "index.html").as_uri()); pg.wait_for_timeout(300)
        verifier(pg.locator("h1").first.inner_text() != "Site momentanément indisponible" and not erreurs, "site intact : accueil normal, aucune erreur")
        ctx.close()
        b.close()
finally:
    shutil.rmtree(tmp, ignore_errors=True)

# Documents de diffusion
D = SITE / "diffusion"
for f in ("qr-code-mission-finder.png", "fiche-eleve.html", "fiche-eleve.pdf"):
    verifier((D / f).is_file(), f"diffusion/{f} présent")
try:
    import pymupdf
    doc = pymupdf.open(str(D / "fiche-eleve.pdf"))
    r = doc[0].rect
    verifier(doc.page_count == 1 and abs(r.width - 595) < 2 and abs(r.height - 842) < 2, "fiche élève : 1 page A4 (2 fiches d'une demi-page)")
    t = doc[0].get_text()
    verifier(t.count("makkura9.github.io/") == 2 and "écran d'accueil" in t and "uniquement sur ce téléphone" in t, "fiche élève : adresse, écran d'accueil, progression")
except ImportError:
    print("  (pymupdf absent : PDF non contrôlé)")
try:
    import cv2
    lu = cv2.QRCodeDetector().detectAndDecode(cv2.imread(str(D / "qr-code-mission-finder.png")))[0]
    verifier(lu == "https://makkura9.github.io/mission-finder/", "QR code relu : " + lu)
except ImportError:
    print("  (opencv absent : QR code non relu)")

print("\nRÉSULTAT :", "tout est OK" if not echecs else f"{len(echecs)} échec(s)")
sys.exit(1 if echecs else 0)
