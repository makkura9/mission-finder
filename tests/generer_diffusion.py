"""Mission Finder — génère les documents de diffusion aux élèves (phase 8) :
  diffusion/qr-code-mission-finder.png   QR code vers l'adresse du site (PNG, 740 × 740 px)
  diffusion/fiche-eleve.html             fiche élève (source, QR code intégré, aucune ressource externe)
  diffusion/fiche-eleve.pdf              A4 avec deux fiches d'une demi-page (à découper)
Usage : pip install segno playwright==1.56.0 ; python3 tests/generer_diffusion.py
Vérification facultative du QR code : pip install opencv-python-headless (décodage de l'image)."""
import os
from pathlib import Path
import segno

RACINE = Path(__file__).resolve().parent.parent
SORTIE = RACINE / "diffusion"
ADRESSE = "https://makkura9.github.io/mission-finder/"

SORTIE.mkdir(exist_ok=True)
qr = segno.make(ADRESSE, error="m", micro=False)
png = SORTIE / "qr-code-mission-finder.png"
qr.save(str(png), scale=20, border=4)
svg = qr.svg_inline(scale=1, border=4, dark="#000", light="#fff", omitsize=True)

try:
    import cv2
    lu = cv2.QRCodeDetector().detectAndDecode(cv2.imread(str(png)))[0]
    assert lu == ADRESSE, f"QR code illisible : {lu!r}"
    print("QR code relu :", lu)
except ImportError:
    print("(opencv absent : QR code non relu automatiquement)")

PARTAGER = '<svg viewBox="0 0 24 24" class="ico"><path d="M8 9H6v11h12V9h-2" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M12 3v11M8.5 6.5L12 3l3.5 3.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
MENU = '<svg viewBox="0 0 24 24" class="ico"><circle cx="12" cy="5" r="2" fill="currentColor"/><circle cx="12" cy="12" r="2" fill="currentColor"/><circle cx="12" cy="19" r="2" fill="currentColor"/></svg>'

FICHE = f"""<section class="fiche">
  <header><p class="titre">Mission Finder</p><p class="sous-titre">Révisez le TE1 sur votre téléphone · Fichiers et dossiers sous macOS · Classe 1C</p></header>
  <div class="corps">
    <div class="qr">{svg}<p class="adresse">makkura9.github.io/<br>mission-finder</p></div>
    <div class="texte">
      <h2>1. Ouvrez le site</h2>
      <p>Visez le QR code avec l'appareil photo du téléphone, puis touchez le lien. Sinon, tapez l'adresse ci-contre.</p>
      <h2>2. Ajoutez-le à l'écran d'accueil</h2>
      <p><b>iPhone (Safari)</b> : touchez Partager {PARTAGER}, puis « Sur l'écran d'accueil » (ou « Ajouter à l'écran d'accueil »), puis « Ajouter ».</p>
      <p><b>Android (Chrome)</b> : touchez le menu {MENU} en haut à droite, puis « Ajouter à l'écran d'accueil » (ou « Installer l'application »).</p>
      <p>Ouvrez ensuite <b>toujours le site avec cette icône</b>.</p>
      <h2>3. Votre progression</h2>
      <p>Elle reste <b>uniquement sur ce téléphone</b> : rien n'est envoyé sur Internet, pas de compte. Si vous effacez les données du navigateur, elle disparaît. Pour changer de téléphone : onglet Profil, « Copier le code ».</p>
    </div>
  </div>
  <p class="contenu"><b>Au programme</b> : Quiz express et Révision du jour, Clavier secret (raccourcis), Visite du Mac, Le grand rangement, Détective du Finder, puis l'examen blanc. Gratuit, sans publicité, sans chronomètre.</p>
</section>"""

HTML = f"""<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><title>Mission Finder — fiche élève</title>
<style>
  @page {{ size: A4; margin: 0; }}
  * {{ box-sizing: border-box; }}
  body {{ margin: 0; font-family: "Liberation Sans", Arial, Helvetica, sans-serif; color: #1a1a1a; }}
  .page {{ width: 210mm; height: 297mm; display: flex; flex-direction: column; }}
  .fiche {{ height: 148.5mm; padding: 11mm 14mm 9mm; display: flex; flex-direction: column; }}
  .coupe {{ border-top: 1px dashed #777; position: relative; }}
  .coupe span {{ position: absolute; left: 12mm; top: -2.4mm; background: #fff; padding: 0 2mm; font-size: 8pt; color: #777; }}
  header {{ border-bottom: 2.5px solid #0D6B73; padding-bottom: 2mm; margin-bottom: 5mm; }}
  .titre {{ margin: 0; font-size: 22pt; font-weight: bold; color: #0D6B73; }}
  .sous-titre {{ margin: 1mm 0 0; font-size: 10pt; color: #444; }}
  .corps {{ display: flex; gap: 8mm; align-items: flex-start; }}
  .qr {{ flex: 0 0 55mm; text-align: center; }}
  .qr svg {{ width: 55mm; height: 55mm; display: block; }}
  .adresse {{ margin: 2mm 0 0; font-size: 9.5pt; font-weight: bold; }}
  .texte {{ flex: 1; font-size: 10.5pt; line-height: 1.35; }}
  .contenu {{ margin-top: auto; padding: 2.5mm 3.5mm; background: #E6F1F2; border-radius: 2mm; font-size: 10pt; line-height: 1.35; }}
  h2 {{ margin: 0 0 1mm; font-size: 11.5pt; color: #C03E0A; }}
  h2:not(:first-child) {{ margin-top: 3.5mm; }}
  p {{ margin: 0 0 1.5mm; }}
  .ico {{ width: 11pt; height: 11pt; vertical-align: -2pt; }}
</style></head>
<body><div class="page">
{FICHE}
<div class="coupe"><span>✂ découper ici</span></div>
{FICHE}
</div></body></html>
"""
(SORTIE / "fiche-eleve.html").write_text(HTML, encoding="utf-8")

from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    nav = p.chromium.launch()
    page = nav.new_page()
    page.goto((SORTIE / "fiche-eleve.html").as_uri())
    # La fiche doit tenir dans sa demi-page.
    deborde = page.evaluate("[...document.querySelectorAll('.fiche')].some(f => f.scrollHeight > f.clientHeight + 1)")
    assert not deborde, "la fiche déborde de sa demi-page"
    page.pdf(path=str(SORTIE / "fiche-eleve.pdf"), format="A4", print_background=True, prefer_css_page_size=True)
    nav.close()
print("Écrits :", ", ".join(sorted(os.listdir(SORTIE))))
