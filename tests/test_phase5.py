"""Tests automatiques (phase 5) de Mission Finder : « Le grand rangement » (atelier fichiers et dossiers).
Playwright, Chromium sans interface. Usage : python3 tests/test_phase5.py
La logique des 9 missions (solutions et erreurs typiques) est testée par : node tests/test-atelier.js"""
import subprocess, sys, time, json, os, tempfile
from pathlib import Path
from playwright.sync_api import sync_playwright

SITE = str(Path(__file__).resolve().parent.parent)
CAPT = os.path.join(tempfile.gettempdir(), "mission-finder-captures")
os.makedirs(CAPT, exist_ok=True)
PORT = 8769
serveur = subprocess.Popen([sys.executable, "-m", "http.server", str(PORT), "--bind", "127.0.0.1"], cwd=SITE,
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(1.0)
BASE = f"http://127.0.0.1:{PORT}/index.html"
FILE = f"file://{SITE}/index.html"

echecs = []
def verifier(cond, msg):
    print(("  OK   " if cond else "  ÉCHEC ") + msg)
    if not cond: echecs.append(msg)

def nouvelle_page(b, w=360, h=800, scheme="light"):
    ctx = b.new_context(viewport={"width": w, "height": h}, device_scale_factor=2, color_scheme=scheme, has_touch=True, is_mobile=True)
    pg = ctx.new_page()
    pg._erreurs = []
    pg.on("console", lambda m: pg._erreurs.append(f"[{m.type}] {m.text}") if m.type in ("error", "warning") else None)
    pg.on("pageerror", lambda e: pg._erreurs.append(f"[pageerror] {e}"))
    return ctx, pg

def mise_en_page_ok(pg):
    return pg.evaluate("""document.documentElement.scrollWidth <= document.documentElement.clientWidth + 0.5 &&
      ![...document.querySelectorAll('.carte, .fx, .feuille')].some(c => { const d = c.getBoundingClientRect().right + 0.5;
        return [...c.querySelectorAll('*')].some(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.right > d; }); })""")

def petites_cibles(pg):
    return pg.evaluate("""() => {
      const res = [];
      document.querySelectorAll('button, .btn, .nav a, .carte-activite, .jeu-quitter, .fil a, summary, input, textarea').forEach(e => {
        const r = e.getBoundingClientRect(), st = getComputedStyle(e);
        if (r.width === 0 || r.height === 0 || st.visibility === 'hidden' || e.closest('[hidden]')) return;
        if (r.height < 44 || r.width < 44) res.push((e.className || e.tagName) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height));
      });
      return res;
    }""")

def aller(pg, lieu):
    pg.click('[data-fx="emplacements"]')
    pg.click(f'.fx-emplacements button:has-text("{lieu}")'); pg.wait_for_timeout(20)

def ouvrir(pg, nom):
    pg.click(f'button.fx-el:has(.fx-nom:text-is("{nom}"))'); pg.wait_for_timeout(20)

def actions(pg, nom):
    pg.click(f'[aria-label="Actions pour « {nom} »"]'); pg.wait_for_timeout(20)

def verif(pg):
    pg.click('[data-action="verifier"]'); pg.wait_for_timeout(40)
    return pg.locator(".zone-retour").inner_text()

def stock(pg):
    return json.loads(pg.evaluate("localStorage.getItem('missionFinder.v1')"))

with sync_playwright() as p:
    b = p.chromium.launch()

    # ------------------------------------------------------------ 1. Accueil et liste des missions
    print("1. Accueil et liste des missions")
    ctx, pg = nouvelle_page(b)
    pg.goto(BASE + "#/accueil"); pg.wait_for_timeout(200)
    verifier(pg.locator('a.carte-activite[href="#/atelier"]').count() == 1, "carte « Le grand rangement » active")
    verifier(pg.locator('.carte-activite.est-inactive').count() == 1, "une seule activité encore « Bientôt disponible »")
    pg.goto(BASE + "#/atelier"); pg.wait_for_timeout(150)
    verifier(pg.locator(".carte-mission").count() == 9, "9 missions proposées")
    pg.screenshot(path=f"{CAPT}/60-atelier-missions.png", full_page=True)

    # ------------------------------------------------------------ 2. Mission 1 : nouveau dossier, « Presque », annuler, réussite
    print("2. Mission 1 : créer « Exercice_finder »")
    pg.click('[data-mission="0"]'); pg.wait_for_timeout(80)
    verifier(pg.locator(".fx-titre").inner_text() == "Bureau", "le Finder s'ouvre sur le Bureau")
    pg.click('[data-fx="nouveau"]'); pg.wait_for_timeout(30)
    verifier(pg.locator("#champ-nom").input_value() == "dossier sans titre", "« + » crée « dossier sans titre » et propose de le nommer")
    verifier(pg.evaluate("document.activeElement.id") == "champ-nom", "le champ du nom a le focus")
    pg.screenshot(path=f"{CAPT}/61-atelier-nommer.png")
    pg.fill("#champ-nom", "exercice_finder"); pg.click('[data-feuille="ok"]')
    txt = verif(pg)
    verifier("Presque : vérifiez les majuscules et les accents de « exercice_finder »" in txt, "minuscule : « Presque… »")
    pg.screenshot(path=f"{CAPT}/62-atelier-presque.png", full_page=True)
    pg.click('[data-fx="annuler"]'); pg.wait_for_timeout(20)
    verifier(pg.locator('.fx-nom:text-is("dossier sans titre")').count() == 1, "↶ annule le renommage")
    pg.click('[data-fx="annuler"]'); pg.wait_for_timeout(20)
    verifier(pg.locator('.fx-nom:text-is("dossier sans titre")').count() == 0, "↶ annule la création du dossier")
    verifier(pg.locator('[data-fx="annuler"]').is_disabled(), "plus rien à annuler : bouton désactivé")
    pg.click('[data-fx="nouveau"]'); pg.fill("#champ-nom", "  Exercice_finder "); pg.press("#champ-nom", "Enter"); pg.wait_for_timeout(20)
    txt = verif(pg)
    verifier("Mission réussie" in txt and "+100 points" in txt, "réussite : +100 points")
    verifier(pg.locator(".retour-juste .etoiles").get_attribute("aria-label").startswith("3"), "sans indice : 3 étoiles")
    s = stock(pg)
    verifier(s["points"] == 100 and s["activites"]["finder"]["records"]["m1"] == 3 and s["objectifs"]["FIN3"] == [1], "enregistré : points, étoiles de la mission, maîtrise FIN3")
    pg.screenshot(path=f"{CAPT}/63-atelier-reussi.png", full_page=True)
    pg.click('[data-action="suivante"]'); pg.wait_for_timeout(60)
    verifier(pg.locator(".jeu-compteur").inner_text() == "Mission 2 / 9" and pg.locator('.fx-nom:text-is("Exercice_finder")').count() == 1,
             "« Mission suivante » : mission 2, qui part de la solution de la mission 1")
    pg.goto(BASE + "#/atelier"); pg.wait_for_timeout(80)
    pg.click('[data-mission="0"]'); pg.wait_for_timeout(60)
    pg.click('[data-fx="nouveau"]'); pg.fill("#champ-nom", "Exercice_finder"); pg.click('[data-feuille="ok"]')
    txt = verif(pg)
    verifier("déjà réussie : pas de nouveaux points" in txt and stock(pg)["points"] == 100, "rejouer une mission réussie : pas de nouveaux points")

    # ------------------------------------------------------------ 3. Mission 4 : décompresser
    print("3. Mission 4 : décompresser l'archive")
    pg.evaluate("MF.atelier._commencer(3)"); pg.wait_for_timeout(60)
    aller(pg, "Téléchargements")
    verifier(pg.locator(".fx-titre").inner_text() == "Téléchargements", "Emplacements → Téléchargements")
    actions(pg, "Finder_Exercice1_2627.zip")
    verifier(pg.locator('[data-lancer="decompresser"]').count() == 1, "« Décompresser » proposé pour une archive .zip")
    pg.screenshot(path=f"{CAPT}/64-atelier-actions-zip.png")
    pg.click('[data-lancer="decompresser"]'); pg.wait_for_timeout(30)
    verifier(pg.locator('.fx-nom:text-is("Finder_Exercice1_2627")').count() == 1, "le dossier décompressé apparaît à côté de l'archive")
    verifier("Mission réussie" in verif(pg), "mission 4 réussie")

    # ------------------------------------------------------------ 4. Mission 5 : déplacer, renommer, informations, indice
    print("4. Mission 5 : actions et indices")
    pg.evaluate("MF.atelier._commencer(4)"); pg.wait_for_timeout(60)
    aller(pg, "Téléchargements"); ouvrir(pg, "Finder_Exercice1_2627")
    verifier(pg.locator(".fx-fil").inner_text().replace("\n", " ").startswith("Téléchargements"), "fil du chemin : Téléchargements › Finder_Exercice1_2627")
    ouvrir(pg, "IMG_4032.jpg")
    verifier(pg.locator(".feuille svg.fx-apercu").count() == 1 and "Image JPEG" in pg.locator(".feuille").inner_text(), "toucher une image : « Lire les informations » avec aperçu")
    pg.screenshot(path=f"{CAPT}/65-atelier-infos.png")
    pg.click('.feuille [data-feuille="fermer"]')
    actions(pg, "IMG_4032.jpg"); pg.click('[data-lancer="renommer"]')
    sel = pg.evaluate("[document.activeElement.selectionStart, document.activeElement.selectionEnd]")
    verifier(sel == [0, 8], "renommer : le nom est sélectionné sans l'extension")
    pg.fill("#champ-nom", "montagne"); pg.click('[data-feuille="ok"]')
    verifier("Gardez l'extension « .jpg »" in pg.locator(".feuille").inner_text(), "renommer sans l'extension : refusé avec explication")
    pg.click('.feuille [data-feuille="fermer"]')
    actions(pg, "IMG_4032.jpg"); pg.click('[data-lancer="deplacer"]')
    pg.screenshot(path=f"{CAPT}/66-atelier-destination.png")
    pg.click('button.fx-dest:has-text("Montagne")'); pg.wait_for_timeout(30)
    verifier(pg.locator('.fx-nom:text-is("IMG_4032.jpg")').count() == 0 and "déplacé dans « Montagne »" in pg.locator(".fx-message").inner_text(), "« Déplacer vers… » : le fichier quitte le dossier, message clair")
    txt = verif(pg)
    verifier("Pas encore" in txt and "Montagne : il manque 2 fichiers" in txt and "IMG_4032" not in txt, "vérification : ce qui manque, sans nommer les fichiers")
    pg.screenshot(path=f"{CAPT}/67-atelier-verif.png", full_page=True)
    pg.click('[data-action="indice"]'); pg.wait_for_timeout(20)
    verifier("Indice 1" in pg.locator(".indices").inner_text() and pg.locator('[data-action="indice"]').inner_text() == "Indice (1)", "indice 1 affiché, il en reste 1")
    pg.evaluate("(() => { const s = MF.atelier._session(); MF.atelierModele.solutions.m5(s.etat); MF.atelier.ecranMission(document.getElementById('app')); })()")
    txt = verif(pg)
    verifier("Mission réussie" in txt and pg.locator(".retour-juste .etoiles").get_attribute("aria-label").startswith("2"), "réussie avec un indice : 2 étoiles")

    # ------------------------------------------------------------ 5. Corbeille et refus
    print("5. Corbeille, refus, dernier indice")
    pg.evaluate("MF.atelier._commencer(5)"); pg.wait_for_timeout(60)
    ouvrir(pg, "Exercice_finder"); ouvrir(pg, "Documents"); ouvrir(pg, "Brochures")
    actions(pg, "brochure_journee_sportive (1).pdf"); pg.click('[data-lancer="corbeille"]'); pg.wait_for_timeout(20)
    aller(pg, "Corbeille")
    verifier(pg.locator('.fx-nom:text-is("brochure_journee_sportive (1).pdf")').count() == 1, "le fichier est dans la Corbeille")
    actions(pg, "brochure_journee_sportive (1).pdf")
    verifier(pg.locator('[data-lancer="corbeille"]').count() == 0 and pg.locator('[data-lancer="deplacer"]').count() == 1, "dans la Corbeille : on peut le déplacer ailleurs (le récupérer)")
    pg.click('.feuille [data-feuille="fermer"]')
    verifier(pg.locator('[data-fx="nouveau"]').is_disabled(), "pas de nouveau dossier dans la Corbeille")
    aller(pg, "Bureau"); actions(pg, "Exercice_finder"); pg.click('[data-lancer="deplacer"]')
    verifier(pg.locator('button.fx-dest:has-text("Images")').count() == 0, "déplacer un dossier : ses sous-dossiers ne sont pas proposés")
    pg.click('button.fx-dest:has-text("Bureau")'); pg.wait_for_timeout(20)
    verifier("déjà dans « Bureau »" in pg.locator(".feuille").inner_text(), "déplacer là où il est déjà : message")
    pg.keyboard.press("Escape"); pg.wait_for_timeout(20)
    verifier(pg.locator(".feuille").count() == 0, "Échap ferme la fenêtre")
    pg.click('[data-action="indice"]'); pg.click('[data-action="indice"]'); pg.wait_for_timeout(20)
    verifier(pg.locator('[data-action="indice"]').is_disabled(), "après le dernier indice, le bouton est désactivé")
    pg.evaluate("(() => { const s = MF.atelier._session(); MF.atelierModele.solutions.m6(s.etat); MF.atelier.ecranMission(document.getElementById('app')); })()")
    verif(pg)
    verifier(pg.locator(".retour-juste .etoiles").get_attribute("aria-label").startswith("1"), "réussie avec le dernier indice : 1 étoile")
    verifier(not pg._erreurs, f"aucune erreur dans la console ({pg._erreurs})")
    ctx.close()

    # ------------------------------------------------------------ 6. Mise en page : 4 tailles, clair et sombre
    print("6. Mise en page (320, 360, 375, 390 px ; clair et sombre)")
    for scheme in ("light", "dark"):
        for (w, h) in [(320, 640), (360, 800), (375, 667), (390, 844)]:
            ctx, pg = nouvelle_page(b, w, h, scheme)
            ko, cibles = [], set()
            def controler(nom):
                if not mise_en_page_ok(pg): ko.append(nom)
                cibles.update(petites_cibles(pg))
            pg.goto(BASE + "#/atelier"); pg.wait_for_timeout(120); controler("liste")
            pg.evaluate("MF.atelier._commencer(4)"); pg.wait_for_timeout(60); controler("mission 5")
            pg.click('[data-fx="emplacements"]'); controler("emplacements"); pg.click('[data-fx="emplacements"]')
            aller(pg, "Téléchargements"); ouvrir(pg, "Finder_Exercice1_2627"); controler("dossier décompressé")
            actions(pg, "copie de formulaire_inscription_cours_facultatif.pdf"); controler("feuille actions")
            pg.click('[data-lancer="renommer"]'); controler("feuille renommer"); pg.click('.feuille [data-feuille="fermer"]')
            actions(pg, "PIXNIO-592014-1200x800.jpg"); pg.click('[data-lancer="deplacer"]'); controler("feuille destination"); pg.click('.feuille [data-feuille="fermer"]')
            ouvrir(pg, "PIXNIO-592014-1200x800.jpg"); controler("feuille informations"); pg.click('.feuille [data-feuille="fermer"]')
            pg.click('[data-action="indice"]'); verif(pg); controler("vérification")
            pg.evaluate("(() => { const s = MF.atelier._session(); MF.atelierModele.solutions.m5(s.etat); MF.atelier.ecranMission(document.getElementById('app')); })()")
            verif(pg); controler("réussite")
            pg.goto(BASE + "#/accueil"); pg.wait_for_timeout(80); controler("accueil")
            if w == 360 and scheme == "dark":
                pg.goto(BASE + "#/atelier"); pg.wait_for_timeout(80); pg.evaluate("MF.atelier._commencer(4)"); pg.wait_for_timeout(60)
                aller(pg, "Téléchargements"); ouvrir(pg, "Finder_Exercice1_2627"); pg.screenshot(path=f"{CAPT}/68-atelier-sombre.png")
            verifier(not ko, f"{scheme} {w}×{h} : pas de débordement {ko if ko else ''}")
            verifier(not cibles, f"{scheme} {w}×{h} : cibles tactiles ≥ 44 px {sorted(cibles) if cibles else ''}")
            verifier(not pg._erreurs, f"{scheme} {w}×{h} : aucune erreur console {pg._erreurs if pg._erreurs else ''}")
            ctx.close()

    # ------------------------------------------------------------ 7. Ouverture locale et bilan
    print("7. Ouverture locale (file://), Mon bilan")
    ctx, pg = nouvelle_page(b)
    pg.goto(FILE + "#/atelier"); pg.wait_for_timeout(200)
    pg.click('[data-mission="0"]'); pg.wait_for_timeout(60)
    pg.click('[data-fx="nouveau"]'); pg.fill("#champ-nom", "Exercice_finder"); pg.click('[data-feuille="ok"]')
    verifier("Mission réussie" in verif(pg), "une mission se joue ouverte par double-clic")
    pg.goto(FILE + "#/bilan"); pg.wait_for_timeout(100)
    verifier(pg.locator(".bilan-act .etoiles").count() == 4, "Mon bilan : étoiles des 4 activités ouvertes")
    verifier(not pg._erreurs, f"aucune erreur console en local ({pg._erreurs})")
    ctx.close()
    b.close()

serveur.terminate()
print("\nRÉSULTAT :", "TOUS LES TESTS RÉUSSIS" if not echecs else f"{len(echecs)} ÉCHEC(S)")
for e in echecs: print(" -", e)
sys.exit(1 if echecs else 0)
