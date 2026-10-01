"""Tests automatiques (phase 6) de Mission Finder : « Détective du Finder » (Spotlight, recherche avancée, photos mystères).
Playwright, Chromium sans interface. Usage : python3 tests/test_phase6.py
Le jeu de données et les 9 recherches (solutions, erreurs typiques) sont testés par : node tests/test-recherche.js"""
import subprocess, sys, time, json, os, tempfile
from pathlib import Path
from playwright.sync_api import sync_playwright

SITE = str(Path(__file__).resolve().parent.parent)
CAPT = os.path.join(tempfile.gettempdir(), "mission-finder-captures")
os.makedirs(CAPT, exist_ok=True)
PORT = 8770
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
      document.querySelectorAll('button, .btn, .nav a, .carte-activite, .jeu-quitter, .fil a, summary, input, textarea, select').forEach(e => {
        const r = e.getBoundingClientRect(), st = getComputedStyle(e);
        if (r.width === 0 || r.height === 0 || st.visibility === 'hidden' || e.closest('[hidden]')) return;
        if (r.height < 44 || r.width < 44) res.push((e.className || e.tagName) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height));
      });
      return res;
    }""")

def compte(pg):
    return pg.locator(".rs-compte").inner_text()

def verif(pg):
    pg.click('[data-action="verifier"]'); pg.wait_for_timeout(40)
    return pg.locator(".zone-retour").inner_text()

def ajouter(pg, critere, **v):
    pg.click('[data-action="ajouter"]'); i = pg.locator(".rs-ligne").count() - 1
    pg.select_option(f"#crit-{i}", critere); pg.wait_for_timeout(15)
    if "operateur" in v: pg.select_option(f"#op-{i}", v["operateur"]); pg.wait_for_timeout(15)
    if "valeur" in v:
        if critere == "Type": pg.select_option(f"#val-{i}", v["valeur"])
        else: pg.fill(f"#val-{i}", v["valeur"])
    if "nombre" in v: pg.fill(f"#val-{i}", str(v["nombre"]))
    if "unite" in v: pg.select_option(f"#unite-{i}", v["unite"])
    if "date" in v: pg.fill(f"#val-{i}", v["date"])
    pg.wait_for_timeout(20)

def stock(pg):
    return json.loads(pg.evaluate("localStorage.getItem('missionFinder.v1')"))

with sync_playwright() as p:
    b = p.chromium.launch()

    # ------------------------------------------------------------ 1. Accueil et liste
    print("1. Accueil et liste des missions")
    ctx, pg = nouvelle_page(b)
    pg.goto(BASE + "#/accueil"); pg.wait_for_timeout(200)
    verifier(pg.locator('a.carte-activite[href="#/recherche"]').count() == 1 and pg.locator('.liste-activites .est-inactive').count() == 0, "les 5 activités sont ouvertes")
    pg.goto(BASE + "#/recherche"); pg.wait_for_timeout(150)
    verifier(pg.locator(".carte-mission").count() == 11, "Spotlight + 10 missions")
    pg.screenshot(path=f"{CAPT}/70-recherche-missions.png", full_page=True)

    # ------------------------------------------------------------ 2. Spotlight
    print("2. Partie A : Spotlight")
    pg.click('[data-mission="0"]'); pg.wait_for_timeout(60)
    pg.fill("#champ-spotlight", "brochure"); pg.wait_for_timeout(20)
    verifier(pg.locator("[data-ouvrir]").count() >= 2, "résultats filtrés en direct (plusieurs brochures)")
    pg.click('[data-ouvrir="p4"]'); pg.wait_for_timeout(20)
    verifier("ce n'est pas ce qui est demandé" in pg.locator(".fx-message").inner_text(), "mauvais résultat : message, sans pénalité")
    pg.fill("#champ-spotlight", "FACULTATIFS"); pg.click('[data-ouvrir="g4"]'); pg.wait_for_timeout(20)
    verifier(pg.locator(".rs-etapes .est-fait").count() == 1, "étape 1 faite (majuscules ignorées)")
    pg.fill("#champ-spotlight", "calcul"); pg.press("#champ-spotlight", "Enter"); pg.wait_for_timeout(20)
    verifier(pg.locator(".rs-etapes .est-fait").count() == 2, "Entrée ouvre le premier résultat : Calculette")
    pg.fill("#champ-spotlight", "telech"); pg.wait_for_timeout(20)
    pg.screenshot(path=f"{CAPT}/71-recherche-spotlight.png", full_page=True)
    pg.click('[data-ouvrir="D2"]'); pg.wait_for_timeout(30)
    txt = pg.locator(".zone-retour").inner_text()
    verifier("Mission réussie" in txt and "+100 points" in txt and stock(pg)["activites"]["recherche"]["records"]["s0"] == 3, "Spotlight réussi : 3 étoiles, +100 points (accents ignorés)")

    # ------------------------------------------------------------ 3. Recherche avancée : mission 3
    print("3. Recherche avancée : PDF des deux dernières semaines")
    pg.evaluate("MF.recherche._commencer(3)"); pg.wait_for_timeout(60)
    verifier("Ajoutez un critère" in compte(pg), "sans critère : pas de résultat")
    verifier("Ajoutez au moins un critère" in verif(pg), "vérifier sans critère : message clair")
    ajouter(pg, "Type", valeur="PDF")
    n1 = int(compte(pg).split()[0])
    verifier(n1 > 4, f"Type est PDF : résultats en direct ({n1})")
    txt = verif(pg)
    verifier("ne correspondent pas" in txt and "combiné 2 critères" in txt, "un seul critère : « … ne correspondent pas » + « Avez-vous combiné 2 critères ? »")
    ajouter(pg, "Date de modification", operateur="dans les derniers", nombre=2, unite="semaines")
    verifier(compte(pg).startswith("4 "), f"deux critères combinés en ET : 4 résultats ({compte(pg)})")
    pg.screenshot(path=f"{CAPT}/72-recherche-criteres.png", full_page=True)
    pg.click('[data-portee="Documents"]'); pg.wait_for_timeout(20)
    txt = verif(pg)
    verifier("Ce Mac" in txt and not "Mission réussie" in txt, "étendue « Documents » : « Cherchez-vous bien dans « Ce Mac » ? »")
    pg.click('[data-portee="mac"]'); pg.wait_for_timeout(20)
    txt = verif(pg)
    verifier("Mission réussie" in txt, "étendue « Ce Mac » : mission 3 réussie")
    pg.screenshot(path=f"{CAPT}/73-recherche-reussie.png", full_page=True)

    # ------------------------------------------------------------ 4. Autres critères
    print("4. Autres critères, suppression d'une ligne, indice")
    pg.evaluate("MF.recherche._commencer(2)"); pg.wait_for_timeout(60)
    ajouter(pg, "Nom", valeur="gymnase")
    txt = verif(pg)
    verifier("« Nom » cherche dans le nom du fichier" in txt, "mission 2 : Nom au lieu de Contenu → indice ciblé")
    pg.click('[data-moins="0"]'); pg.wait_for_timeout(20)
    verifier(pg.locator(".rs-ligne").count() == 0, "« − » supprime la ligne")
    pg.click('[data-action="indice"]'); pg.wait_for_timeout(20)
    ajouter(pg, "Contenu", valeur="GYMNASE")
    verifier("Mission réussie" in verif(pg) and pg.locator(".retour-juste .etoiles").get_attribute("aria-label").startswith("2"), "réussie avec un indice : 2 étoiles")
    pg.evaluate("MF.recherche._commencer(8)"); pg.wait_for_timeout(60)
    ajouter(pg, "Date de modification", operateur="avant le", date="2010-01-01")
    verifier(compte(pg).startswith("3 ") and "Mission réussie" in verif(pg), "mission 8 : « avant le » 01.01.2010")
    pg.evaluate("MF.recherche._commencer(9)"); pg.wait_for_timeout(60)
    ajouter(pg, "Type", valeur="PDF"); ajouter(pg, "Nombre de pages", operateur="est supérieur à", nombre=9)
    verifier("ne correspond" in verif(pg), "mission 9 : « supérieur à 9 » refusé (PDF de 10 pages)")
    pg.fill("#val-1", "10"); pg.wait_for_timeout(20)
    verifier("Mission réussie" in verif(pg), "mission 9 : « supérieur à 10 » accepté")
    pg.evaluate("MF.recherche._commencer(7)"); pg.wait_for_timeout(60)
    ajouter(pg, "Auteur", valeur="al tes"); ajouter(pg, "Extension", valeur=".docx")
    verifier("Mission réussie" in verif(pg), "mission 7 : Auteur + Extension (« .docx », minuscules acceptés)")

    # ------------------------------------------------------------ 5. Photos mystères
    print("5. Mission 10 : photos mystères")
    pg.evaluate("MF.recherche._commencer(10)"); pg.wait_for_timeout(60)
    pg.click('[data-meta="m2"]'); pg.wait_for_timeout(20)
    verifier("Biarritz, France" in pg.locator(".feuille").inner_text() and pg.locator(".feuille svg.fx-apercu").count() == 1, "métadonnées : aperçu et lieu de prise de vue")
    pg.screenshot(path=f"{CAPT}/74-recherche-metadonnees.png")
    pg.click('.feuille [data-feuille="fermer"]')
    pg.click('[data-renommer="m1"]'); pg.fill("#champ-nom", "montagne"); pg.click('[data-feuille="ok"]')
    verifier("Gardez l'extension" in pg.locator(".feuille").inner_text(), "renommer sans .jpg : refusé")
    pg.fill("#champ-nom", "montagne.jpg"); pg.click('[data-feuille="ok"]')
    pg.click('[data-renommer="m2"]'); pg.fill("#champ-nom", "plage_biarritz.jpg"); pg.press("#champ-nom", "Enter")
    pg.click('[data-renommer="m3"]'); pg.fill("#champ-nom", "ville_de_Lausanne.jpg"); pg.press("#champ-nom", "Enter")
    txt = verif(pg)
    verifier("Pas encore" in txt and "ne dit pas où la photo a été prise" in txt, "nom sans le lieu : refusé avec explication")
    pg.click('[data-renommer="m1"]'); pg.fill("#champ-nom", "montagne_Zermatt.jpg"); pg.press("#champ-nom", "Enter")
    verifier("Mission réussie" in verif(pg), "trois noms explicites (contenu + lieu) : mission réussie")
    verifier(not pg._erreurs, f"aucune erreur dans la console ({pg._erreurs})")
    ctx.close()

    # ------------------------------------------------------------ 6. Mise en page
    print("6. Mise en page (320, 360, 375, 390 px ; clair et sombre)")
    for scheme in ("light", "dark"):
        for (w, h) in [(320, 640), (360, 800), (375, 667), (390, 844)]:
            ctx, pg = nouvelle_page(b, w, h, scheme)
            ko, cibles = [], set()
            def controler(nom):
                if not mise_en_page_ok(pg): ko.append(nom)
                cibles.update(petites_cibles(pg))
            pg.goto(BASE + "#/recherche"); pg.wait_for_timeout(120); controler("liste")
            pg.click('[data-mission="0"]'); pg.fill("#champ-spotlight", "e"); pg.wait_for_timeout(20); controler("spotlight")
            pg.evaluate("MF.recherche._commencer(3)"); pg.wait_for_timeout(60)
            ajouter(pg, "Date de modification", operateur="dans les derniers", nombre=2, unite="semaines"); controler("ligne date (derniers)")
            ajouter(pg, "Date de modification", operateur="après le", date="2026-01-01"); controler("ligne date (après)")
            ajouter(pg, "Nombre de pages", operateur="est inférieur à", nombre=5); ajouter(pg, "Auteur", valeur="Direction"); controler("4 lignes")
            verif(pg); controler("vérification")
            pg.evaluate("MF.recherche._commencer(10)"); pg.wait_for_timeout(60); controler("photos")
            pg.click('[data-meta="m1"]'); controler("métadonnées"); pg.click('.feuille [data-feuille="fermer"]')
            pg.click('[data-renommer="m3"]'); controler("renommer"); pg.click('.feuille [data-feuille="fermer"]')
            if w == 360 and scheme == "dark":
                pg.evaluate("MF.recherche._commencer(4)"); pg.wait_for_timeout(60); ajouter(pg, "Nom", valeur="mystere"); ajouter(pg, "Type", valeur="Image")
                pg.screenshot(path=f"{CAPT}/75-recherche-sombre.png", full_page=True)
            verifier(not ko, f"{scheme} {w}×{h} : pas de débordement {ko if ko else ''}")
            verifier(not cibles, f"{scheme} {w}×{h} : cibles tactiles ≥ 44 px {sorted(cibles) if cibles else ''}")
            verifier(not pg._erreurs, f"{scheme} {w}×{h} : aucune erreur console {pg._erreurs if pg._erreurs else ''}")
            ctx.close()

    # ------------------------------------------------------------ 7. file:// et bilan
    print("7. Ouverture locale (file://), Mon bilan")
    ctx, pg = nouvelle_page(b)
    pg.goto(FILE + "#/recherche"); pg.wait_for_timeout(200)
    pg.click('[data-mission="1"]'); pg.wait_for_timeout(60)
    ajouter(pg, "Type", valeur="Archive")
    verifier("Mission réussie" in verif(pg), "une recherche se joue ouverte par double-clic")
    pg.goto(FILE + "#/bilan"); pg.wait_for_timeout(100)
    verifier(pg.locator(".bilan-act .etoiles").count() == 5 and "bientôt" not in pg.locator(".bilan-activites").inner_text(), "Mon bilan : étoiles des 5 activités")
    verifier(not pg._erreurs, f"aucune erreur console en local ({pg._erreurs})")
    ctx.close()
    b.close()

serveur.terminate()
print("\nRÉSULTAT :", "TOUS LES TESTS RÉUSSIS" if not echecs else f"{len(echecs)} ÉCHEC(S)")
for e in echecs: print(" -", e)
sys.exit(1 if echecs else 0)
