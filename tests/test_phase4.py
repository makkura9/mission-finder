"""Tests automatiques (phase 4) de Mission Finder : « Clavier secret » et « Visite du Mac ».
Playwright, Chromium sans interface. Usage : python3 tests/test_phase4.py"""
import subprocess, sys, time, json, os, tempfile
from pathlib import Path
from playwright.sync_api import sync_playwright

SITE = str(Path(__file__).resolve().parent.parent)
CAPT = os.path.join(tempfile.gettempdir(), "mission-finder-captures")
os.makedirs(CAPT, exist_ok=True)
PORT = 8768
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

def pas_de_defilement_horizontal(pg):
    return pg.evaluate("document.documentElement.scrollWidth <= document.documentElement.clientWidth + 0.5")

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

def principal(pg):
    pg.click('[data-action="principal"]'); pg.wait_for_timeout(25)

def libelle_principal(pg):
    return pg.locator('[data-action="principal"]').inner_text()

# ---------------------------------------------------------------- Clavier secret : outils
def item_clavier(pg):
    return pg.evaluate("""(() => { const p = MF.clavier._etat(), it = p.items[p.index];
      return { sens: it.sens, id: it.r.id, touches: it.r.touches, puis: it.r.puis || null,
               bonne: it.propositions ? it.propositions.indexOf(it.r) : -1, statut: p.statut }; })()""")

def composer(pg, touches, puis=None):
    for t in touches: pg.click(f'[data-touche="{t}"]')
    if puis: pg.click('[data-touche="Espace"]')

def repondre_clavier_juste(pg, it):
    if it["sens"] == "composer": composer(pg, it["touches"], it["puis"])
    else: pg.click(f'.proposition[data-i="{it["bonne"]}"]')
    principal(pg)

def forcer_clavier(pg, rid, sens):
    pg.evaluate("""([rid, sens]) => { const p = MF.clavier._etat();
      const k = p.items.findIndex(it => it.r.id === rid);
      if (k >= 0 && p.items[k].sens === sens) { const t = p.items[p.index]; p.items[p.index] = p.items[k]; p.items[k] = t; }
      else { const autre = p.items.find(it => it.sens === sens && it !== p.items[p.index]);
             const r = RACCOURCIS.find(x => x.id === rid);
             p.items[p.index] = Object.assign({}, autre, { r: r, q: Object.assign({}, autre.q, { id: 'clav-' + rid, bonne: r.touches.join(' ') + (r.puis ? ' puis ' + r.puis : '') }) });
             if (sens === 'quefait') { p.items[p.index].propositions = [r].concat(RACCOURCIS.filter(x => x !== r).slice(0, 3)); p.items[p.index].desactivees = []; p.items[p.index].choix = null; } }
      p.statut = 'attente'; p.essai = 1; MF.clavier.ecranPartie(document.getElementById('app')); }""", [rid, sens])

# ---------------------------------------------------------------- Visite du Mac : outils
def item_bureau(pg):
    return pg.evaluate("""(() => { const p = MF.bureau._etat(), it = p.items[p.index];
      return { type: it.type, cible: it.cible ? it.cible.id : null, ouvertes: it.bureau.ouvertes, active: it.bureau.active,
               apps: it.bureau.apps.map(a => a.nom),
               bonne: it.type === 'nommer' ? it.propositions.indexOf(it.cible) : it.type === 'active' ? it.propositions.findIndex(a => a.nom === it.bureau.active) : -1 }; })()""")

def toucher_zone(pg, zone):
    """Toucher une zone du Bureau simulé (clic JavaScript : les fonds de zone sont recouverts par des icônes)."""
    pg.evaluate("(z) => document.querySelector('.mac [data-zone=\"' + z + '\"]').click()", zone); pg.wait_for_timeout(25)

def repondre_bureau_juste(pg, it):
    t = it["type"]
    if t == "toucher":
        pg.click(f'.mac [data-zone="{it["cible"]}"]') if it["cible"] in ("pomme", "disque", "depart", "corbeille") else toucher_zone(pg, it["cible"])
    elif t in ("nommer", "active"):
        pg.click(f'.proposition[data-i="{it["bonne"]}"]'); principal(pg)
    elif t == "ouvertes":
        for n in it["ouvertes"]: pg.click(f'.mac [data-app="{n}"]')
        principal(pg)
    elif t == "spotlight":
        pg.click('.mac [data-zone="loupe"]'); pg.fill('#champ-spotlight', 'Finder'); pg.wait_for_timeout(25)
        pg.click('[data-resultat="Finder"]'); pg.wait_for_timeout(25)

with sync_playwright() as p:
    b = p.chromium.launch()

    # ------------------------------------------------------------ 1. Accueil : activités ouvertes
    print("1. Accueil")
    ctx, pg = nouvelle_page(b)
    pg.goto(BASE + "#/accueil"); pg.wait_for_timeout(200)
    verifier(pg.locator('a.carte-activite[href="#/clavier"]').count() == 1, "carte « Clavier secret » active")
    verifier(pg.locator('a.carte-activite[href="#/bureau"]').count() == 1, "carte « Visite du Mac » active")
    verifier(pg.locator('.carte-activite.est-inactive').count() == 2, "2 activités encore « Bientôt disponible »")
    ctx.close()

    # ------------------------------------------------------------ 2. Clavier secret : partie parfaite
    print("2. Clavier secret : partie complète")
    ctx, pg = nouvelle_page(b)
    pg.goto(BASE + "#/clavier"); pg.wait_for_timeout(150)
    pg.evaluate("document.querySelector('details').open = true")
    verifier(pg.locator("table.fiche tbody tr").count() == 20, "la fiche affiche les 20 raccourcis")
    pg.screenshot(path=f"{CAPT}/30-clavier-accueil.png", full_page=True)
    pg.click('[data-action="commencer"]'); pg.wait_for_timeout(80)
    info = pg.evaluate("(() => { const p = MF.clavier._etat(); return { n: p.items.length, sens: p.items.map(i => i.sens), ids: p.items.map(i => i.r.id) }; })()")
    verifier(info["n"] == 10 and len(set(info["ids"])) == 10, "10 raccourcis différents")
    verifier(info["sens"].count("composer") == 6 and info["sens"].count("quefait") == 4, "6 à composer, 4 « Que fait… ? »")
    premiers = set(info["ids"])
    for k in range(10):
        it = item_clavier(pg)
        if k == 0 and it["sens"] == "composer": pg.screenshot(path=f"{CAPT}/31-clavier-composer.png", full_page=True)
        repondre_clavier_juste(pg, it)
        verifier("retour-juste" in (pg.locator(".retour").first.get_attribute("class") or ""), f"{it['id']} ({it['sens']}) : juste du premier coup")
        principal(pg)
    verifier("#/clavier/resultat" in pg.url, "écran de résultat")
    verifier(pg.locator(".resultat-score").inner_text() == "110 points", f"100 points + 10 de bonus de série ({pg.locator('.resultat-score').inner_text()})")
    verifier(pg.locator(".resultat-etoiles .etoiles").get_attribute("aria-label").startswith("3"), "3 étoiles")
    stock = json.loads(pg.evaluate("localStorage.getItem('missionFinder.v1')"))
    verifier(stock["activites"]["raccourcis"]["etoilesMax"] == 3 and stock["points"] == 110, "étoiles et points enregistrés")
    verifier(len(stock["objectifs"]["RAC"]) == 10 and all(stock["questions"][f"clav-{i}"]["boite"] == 2 for i in premiers), "maîtrise RAC et boîtes de Leitner mises à jour")

    # Seconde partie : les 10 raccourcis jamais vus passent d'abord
    pg.click('[data-action="rejouer"]'); pg.wait_for_timeout(80)
    ids2 = set(pg.evaluate("MF.clavier._etat().items.map(i => i.r.id)"))
    verifier(not (ids2 & premiers), "seconde partie : les 10 autres raccourcis (jamais vus) d'abord")

    # ------------------------------------------------------------ 3. Clavier secret : erreurs et séquence
    print("3. Clavier secret : erreurs, retours ciblés, séquence en deux temps")
    forcer_clavier(pg, "cmd-maj-n", "composer")
    pg.click('[data-touche="⌘"]'); pg.click('[data-touche="⌘"]')
    verifier(pg.locator('[data-touche="⌘"]').get_attribute("aria-pressed") == "false", "toucher deux fois ⌘ le relâche")
    composer(pg, ["⌘", "N"]); principal(pg)
    txt = pg.locator(".retour").inner_text()
    verifier("Vous avez composé ⌘ N" in txt and "Nouvelle fenêtre du Finder" in txt and "Il vous reste un essai" in txt, "1re erreur : ce que fait la combinaison composée")
    verifier("⌘ ⇧ N" not in txt, "1re erreur : la bonne combinaison n'est pas révélée")
    verifier("touche finale est juste" in txt, "indice : la touche finale est juste")
    pg.screenshot(path=f"{CAPT}/32-clavier-erreur.png", full_page=True)
    composer(pg, ["⌘", "T"]); principal(pg)
    verifier("Bonne réponse : ⌘ ⇧ N" in pg.locator(".retour").inner_text(), "2e erreur : bonne réponse affichée")
    verifier(pg.locator(".touche:disabled").count() == 22, "clavier désactivé après la réponse")
    principal(pg)
    forcer_clavier(pg, "cmd-maj-4-espace", "composer")
    composer(pg, ["⌘", "⇧", "4"]); principal(pg)
    verifier("deux temps" in pg.locator(".retour").inner_text(), "⌘ ⇧ 4 sans Espace : « cette capture se fait en deux temps »")
    composer(pg, ["⌘", "⇧", "4"], "Espace")
    verifier("puis" in pg.locator(".saisie").inner_text(), "la saisie affiche « ⌘ ⇧ 4 puis Espace »")
    principal(pg)
    verifier("+5 points" in pg.locator(".retour").inner_text(), "séquence juste au 2e essai : +5 points")
    principal(pg)
    forcer_clavier(pg, "cmd-q", "composer")
    composer(pg, ["Q"]); principal(pg)
    verifier("commencent par ⌘" in pg.locator(".retour").inner_text(), "sans ⌘ : « Tous les raccourcis de la fiche commencent par ⌘ »")
    principal(pg) if libelle_principal(pg) != "Valider" else None
    composer(pg, ["⌘", "Q"]); principal(pg); principal(pg)
    forcer_clavier(pg, "cmd-c", "quefait")
    faux = pg.evaluate("MF.clavier._etat().items[MF.clavier._etat().index].propositions.findIndex(x => x.id !== 'cmd-c')")
    pg.click(f'.proposition[data-i="{faux}"]'); principal(pg)
    txt = pg.locator(".retour").inner_text()
    verifier("c'est ⌘" in txt and "Il vous reste un essai" in txt, "« Que fait… ? » : l'erreur dit à quel raccourci correspond le choix")
    verifier(pg.locator(f'.proposition[data-i="{faux}"]').is_disabled(), "la réponse fausse est désactivée")
    pg.screenshot(path=f"{CAPT}/33-clavier-quefait.png", full_page=True)
    verifier(not pg._erreurs, f"aucune erreur dans la console ({pg._erreurs})")
    ctx.close()

    # ------------------------------------------------------------ 4. Visite du Mac : partie parfaite
    print("4. Visite du Mac : partie complète")
    ctx, pg = nouvelle_page(b)
    pg.goto(BASE + "#/bureau"); pg.wait_for_timeout(150)
    pg.click('[data-action="commencer"]'); pg.wait_for_timeout(80)
    types = pg.evaluate("MF.bureau._etat().items.map(i => i.type)")
    verifier(len(types) == 10 and types.count("toucher") == 3 and types.count("nommer") == 2 and types.count("active") == 2 and types.count("ouvertes") == 2 and types.count("spotlight") == 1,
             f"10 étapes : 3 toucher, 2 nommer, 2 active, 2 ouvertes, 1 Spotlight ({types})")
    cibles = pg.evaluate("MF.bureau._etat().items.filter(i => i.cible).map(i => i.cible.id)")
    verifier(len(set(cibles)) == 5, "5 éléments différents de la légende")
    bur = pg.evaluate("MF.bureau._etat().items.map(i => i.bureau)")
    verifier(all(x["apps"][0]["nom"] == "Finder" and "Finder" in x["ouvertes"] and x["active"] in x["ouvertes"] and len(x["apps"]) == 4 for x in bur),
             "Bureaux tirés au hasard cohérents (Finder ouvert, application active parmi les ouvertes)")
    for k in range(10):
        it = item_bureau(pg)
        pg.screenshot(path=f"{CAPT}/4{k}-bureau-{it['type']}.png", full_page=True) if k in (0, 3, 5, 6) else None
        repondre_bureau_juste(pg, it)
        verifier("retour-juste" in (pg.locator(".retour").first.get_attribute("class") or ""), f"étape {k + 1} ({it['type']}{' : ' + it['cible'] if it['cible'] else ''}) : juste du premier coup")
        if it["type"] == "spotlight":
            verifier(pg.locator(".mac-nomapp").inner_text() == "Finder", "Spotlight : le Finder devient l'application active")
        principal(pg)
    verifier(pg.locator(".resultat-score").inner_text() == "110 points", f"100 points + 10 de bonus ({pg.locator('.resultat-score').inner_text()})")
    stock = json.loads(pg.evaluate("localStorage.getItem('missionFinder.v1')"))
    verifier(all(len(stock["objectifs"].get(c, [])) >= 1 for c in ("BUR1", "BUR2", "BUR3", "BUR4")), "maîtrise BUR1 à BUR4 mise à jour")
    verifier(stock["activites"]["bureau"]["etoilesMax"] == 3, "3 étoiles enregistrées")

    # ------------------------------------------------------------ 5. Visite du Mac : erreurs
    print("5. Visite du Mac : erreurs et retours")
    pg.click('[data-action="rejouer"]'); pg.wait_for_timeout(80)
    it = item_bureau(pg)
    faux = "fond"
    toucher_zone(pg, faux)
    txt = pg.locator(".retour").inner_text()
    verifier("Vous avez touché le fond du Bureau" in txt and "Il vous reste un essai" in txt, "toucher : « Vous avez touché le fond du Bureau »")
    autre = "disque" if it["cible"] != "disque" else "pomme"
    toucher_zone(pg, autre)
    verifier(pg.locator(".mac .est-marque-juste").count() >= 1 and "Bonne réponse" in pg.locator(".retour").inner_text(), "2e erreur : l'élément demandé est entouré en vert (✓) et nommé")
    pg.screenshot(path=f"{CAPT}/50-bureau-toucher-erreur.png", full_page=True)
    principal(pg)
    # Aller à une étape « application active » et choisir une application ouverte mais pas active
    while item_bureau(pg)["type"] != "active":
        repondre_bureau_juste(pg, item_bureau(pg)); principal(pg)
    ok = pg.evaluate("""(() => { const p = MF.bureau._etat(), it = p.items[p.index];
      it.bureau.ouvertes = ['Finder', it.bureau.apps[1].nom]; it.bureau.active = it.bureau.apps[1].nom;
      it.propositions = it.bureau.apps.slice(); MF.bureau.ecranPartie(document.getElementById('app')); return true; })()""")
    pg.click('.proposition[data-i="0"]'); principal(pg)
    verifier("est ouverte (point sous son icône), mais son nom n'est pas en gras" in pg.locator(".retour").inner_text(), "active : le Finder est ouvert mais pas actif")
    pg.click('.proposition[data-i="1"]'); principal(pg); principal(pg)
    it = item_bureau(pg)
    verifier(it["type"] == "ouvertes", "étape suivante : applications ouvertes")
    pg.evaluate("""(() => { const it = MF.bureau._etat().items[MF.bureau._etat().index];
      it.bureau.ouvertes = ['Finder', it.bureau.apps[2].nom]; MF.bureau.ecranPartie(document.getElementById('app')); })()""")
    pg.click('.mac [data-app="Finder"]')
    verifier(pg.locator('.mac [data-app="Finder"]').get_attribute("aria-pressed") == "true", "toucher une icône la choisit (✓)")
    principal(pg)
    verifier("Il manque 1 application ouverte" in pg.locator(".retour").inner_text(), "ouvertes : « Il manque 1 application ouverte »")
    pg.screenshot(path=f"{CAPT}/51-bureau-ouvertes-erreur.png", full_page=True)
    pg.click('.mac [data-app="Finder"]'); pg.click('.mac [data-app="Finder"]')
    # Spotlight
    pg.evaluate("""(() => { const p = MF.bureau._etat(); p.index = p.items.length - 1; p.essai = 1; p.statut = 'attente'; MF.bureau.ecranPartie(document.getElementById('app')); })()""")
    verifier(item_bureau(pg)["type"] == "spotlight", "étape Spotlight")
    pg.click('.mac [data-app="Finder"]')
    verifier("utilisez Spotlight" in pg.locator(".info").inner_text() and pg.evaluate("MF.bureau._etat().essai") == 1, "Finder touché dans le Dock : conseil, sans perdre d'essai")
    pg.click('.mac [data-zone="disque"]')
    verifier("ce n'est pas Spotlight" in pg.locator(".retour").inner_text(), "Spotlight : toucher le disque est une erreur expliquée")
    pg.click('.mac [data-zone="loupe"]'); pg.wait_for_timeout(30)
    pg.fill('#champ-spotlight', 'TELECH'); pg.wait_for_timeout(25)
    verifier(pg.locator('[data-resultat="Téléchargements"]').count() == 1, "recherche sans tenir compte des majuscules ni des accents")
    pg.fill('#champ-spotlight', 'fin'); pg.wait_for_timeout(25)
    res = pg.locator(".mac-resultat b").all_inner_texts()
    verifier(res == ["Finder", "Finder_Exercice1_2627.zip", "tutoriel_finder.pdf"], f"résultats filtrés en direct ({res})")
    pg.press('#champ-spotlight', 'Enter'); pg.wait_for_timeout(30)
    verifier("+5 points" in pg.locator(".retour").inner_text() and pg.locator(".mac-nomapp").inner_text() == "Finder", "Entrée ouvre le 1er résultat : le Finder (2e essai : +5 points)")
    pg.screenshot(path=f"{CAPT}/52-bureau-spotlight.png", full_page=True)
    verifier(not pg._erreurs, f"aucune erreur dans la console ({pg._erreurs})")
    ctx.close()

    # ------------------------------------------------------------ 6. Mise en page : 4 tailles, clair et sombre
    print("6. Mise en page (320, 360, 375, 390 px ; clair et sombre)")
    for scheme in ("light", "dark"):
        for (w, h) in [(320, 640), (360, 800), (375, 667), (390, 844)]:
            ctx, pg = nouvelle_page(b, w, h, scheme)
            ko, cibles = [], set()
            def controler(nom):
                if not pas_de_defilement_horizontal(pg): ko.append(nom)
                deborde = pg.evaluate("""[...document.querySelectorAll('.carte, .mac')].some(c => {
                  const d = c.getBoundingClientRect().right + 0.5;
                  return [...c.querySelectorAll('*')].some(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.right > d; }); })""")
                if deborde: ko.append(nom + " (dépasse d'une carte)")
                cibles.update(petites_cibles(pg))
            pg.goto(BASE + "#/clavier"); pg.wait_for_timeout(120)
            pg.evaluate("document.querySelector('details').open = true"); controler("#/clavier")
            pg.click('[data-action="commencer"]'); pg.wait_for_timeout(60)
            for k in range(10):
                it = item_clavier(pg); controler(f"clavier {k + 1} ({it['sens']})")
                if it["sens"] == "composer": composer(pg, ["⌘", "⇧", "⌥", "Z"]); principal(pg); controler(f"clavier {k + 1} retour")
                repondre_clavier_juste(pg, item_clavier(pg)) if libelle_principal(pg) == "Valider" else None
                principal(pg)
            controler("#/clavier/resultat")
            pg.goto(BASE + "#/bureau"); pg.wait_for_timeout(120); controler("#/bureau")
            pg.click('[data-action="commencer"]'); pg.wait_for_timeout(60)
            for k in range(10):
                it = item_bureau(pg); controler(f"bureau {k + 1} ({it['type']})")
                if it["type"] == "spotlight":
                    pg.click('.mac [data-zone="loupe"]'); pg.fill('#champ-spotlight', 'o'); pg.wait_for_timeout(25); controler("spotlight ouvert")
                    pg.fill('#champ-spotlight', 'Finder'); pg.click('[data-resultat="Finder"]'); pg.wait_for_timeout(25)
                else:
                    repondre_bureau_juste(pg, it)
                controler(f"bureau {k + 1} retour")
                principal(pg)
            controler("#/bureau/resultat")
            pg.goto(BASE + "#/accueil"); pg.wait_for_timeout(80); controler("#/accueil")
            if w == 360 and scheme == "dark":
                pg.screenshot(path=f"{CAPT}/53-accueil-sombre.png", full_page=True)
            verifier(not ko, f"{scheme} {w}×{h} : pas de défilement horizontal {ko if ko else ''}")
            verifier(not cibles, f"{scheme} {w}×{h} : cibles tactiles ≥ 44 px {sorted(cibles) if cibles else ''}")
            verifier(not pg._erreurs, f"{scheme} {w}×{h} : aucune erreur console {pg._erreurs if pg._erreurs else ''}")
            ctx.close()

    # ------------------------------------------------------------ 7. Bilan et ouverture locale
    print("7. Mon bilan, ouverture locale (file://)")
    ctx, pg = nouvelle_page(b)
    pg.goto(FILE + "#/clavier"); pg.wait_for_timeout(200)
    pg.click('[data-action="commencer"]'); pg.wait_for_timeout(60)
    verifier(pg.locator(".touche").count() == 22 or pg.locator(".proposition").count() == 4, "Clavier secret fonctionne ouvert par double-clic")
    pg.goto(FILE + "#/bureau"); pg.wait_for_timeout(200)
    pg.click('[data-action="commencer"]'); pg.wait_for_timeout(60)
    verifier(pg.locator(".mac").count() == 1, "Visite du Mac fonctionne ouverte par double-clic")
    pg.goto(FILE + "#/bilan"); pg.wait_for_timeout(100)
    verifier(pg.locator(".bilan-act .etoiles").count() == 3, "Mon bilan : étoiles des 3 activités ouvertes")
    verifier(not pg._erreurs, f"aucune erreur console en local ({pg._erreurs})")
    ctx.close()
    b.close()

serveur.terminate()
print("\nRÉSULTAT :", "TOUS LES TESTS RÉUSSIS" if not echecs else f"{len(echecs)} ÉCHEC(S)")
for e in echecs: print(" -", e)
sys.exit(1 if echecs else 0)
