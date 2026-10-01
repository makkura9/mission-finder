"""Tests automatiques (phase 7) de Mission Finder : examen blanc, badges, finitions.
Playwright, Chromium sans interface. Usage : python3 tests/test_phase7.py"""
import subprocess, sys, time, json, os, tempfile
from pathlib import Path
from playwright.sync_api import sync_playwright

SITE = str(Path(__file__).resolve().parent.parent)
CAPT = os.path.join(tempfile.gettempdir(), "mission-finder-captures")
os.makedirs(CAPT, exist_ok=True)
PORT = 8771
serveur = subprocess.Popen([sys.executable, "-m", "http.server", str(PORT), "--bind", "127.0.0.1"], cwd=SITE,
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(1.0)
BASE = f"http://127.0.0.1:{PORT}/index.html"
FILE = f"file://{SITE}/index.html"

echecs = []
def verifier(cond, msg):
    print(("  OK   " if cond else "  ÉCHEC ") + msg)
    if not cond: echecs.append(msg)

ETAT_JOUE = {"app": "missionFinder", "version": 1, "creeLe": "2026-09-01T10:00:00Z", "modifieLe": "2026-09-30T10:00:00Z", "pseudo": "", "points": 500,
             "objectifs": {}, "questions": {}, "jours": [],
             "activites": {a: {"parties": 1, "etoilesMax": 1, "records": {}} for a in ("qcm", "raccourcis", "bureau", "finder", "recherche")}}

def nouvelle_page(b, w=360, h=800, scheme="light", etat=None):
    ctx = b.new_context(viewport={"width": w, "height": h}, device_scale_factor=2, color_scheme=scheme, has_touch=True, is_mobile=True)
    if etat is not None:
        ctx.add_init_script("if (!sessionStorage.getItem('dejaInit')) { sessionStorage.setItem('dejaInit', '1'); localStorage.setItem('missionFinder.v1', %s); }" % json.dumps(json.dumps(etat)))
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
      document.querySelectorAll('button, .btn, .nav a, .carte-activite, .jeu-quitter, .fil a, .lien-badges a, summary, input, textarea, select').forEach(e => {
        const r = e.getBoundingClientRect(), st = getComputedStyle(e);
        if (r.width === 0 || r.height === 0 || st.visibility === 'hidden' || e.closest('[hidden]')) return;
        if (r.height < 44 || r.width < 44) res.push((e.className || e.tagName) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height));
      });
      return res;
    }""")

def stock(pg):
    return json.loads(pg.evaluate("localStorage.getItem('missionFinder.v1')"))

def aller(pg, route):
    pg.evaluate(f"location.hash = '{route}'"); pg.wait_for_timeout(80)

with sync_playwright() as p:
    b = p.chromium.launch()

    # ------------------------------------------------------------ 1. Examen verrouillé
    print("1. Examen blanc verrouillé au départ")
    ctx, pg = nouvelle_page(b)
    pg.goto(BASE + "#/accueil"); pg.wait_for_timeout(200)
    verifier("0 sur 5" in pg.locator(".carte-activite.est-inactive").last.inner_text(), "accueil : examen fermé (0 activité jouée sur 5)")
    verifier("Mes badges : 0 sur 8" in pg.locator(".lien-badges").inner_text(), "accueil : « Mes badges : 0 sur 8 »")
    aller(pg, "#/examen")
    verifier("Jouez d'abord au moins une fois chaque activité" in pg.locator(".page").inner_text() and pg.locator("[data-lancer]").count() == 0, "#/examen : message, pas de bouton")
    verifier(not pg._erreurs, f"aucune erreur ({pg._erreurs})")
    ctx.close()

    # ------------------------------------------------------------ 2. Examen complet
    print("2. Examen blanc complet")
    ctx, pg = nouvelle_page(b, etat=ETAT_JOUE)
    pg.goto(BASE + "#/accueil"); pg.wait_for_timeout(200)
    verifier(pg.locator('a.carte-activite[href="#/examen"]').count() == 1, "les 5 activités jouées : l'examen blanc s'ouvre")
    pg.screenshot(path=f"{CAPT}/80-accueil-examen.png", full_page=True)
    aller(pg, "#/examen")
    verifier(pg.locator(".carte-examen").count() == 3 and "chronomètre" in pg.locator(".intro").inner_text(), "3 parties, « Pas de chronomètre »")
    pg.screenshot(path=f"{CAPT}/81-examen.png", full_page=True)
    pg.click('[data-lancer="qcm"]'); pg.wait_for_timeout(80)
    info = pg.evaluate("(() => { const p = MF.qcm._etat(); return { n: p.items.length, mode: p.mode, obj: [...new Set(p.items.map(i => i.q.objectif))].length, ids: new Set(p.items.map(i => i.q.id)).size }; })()")
    verifier(info["n"] == 20 and info["mode"] == "examen" and info["ids"] == 20, "partie 1 : 20 questions différentes")
    verifier(info["obj"] == 19, f"les 19 objectifs sont couverts ({info['obj']})")
    pg.click(".jeu-quitter"); pg.wait_for_timeout(60)
    aller(pg, "#/examen")
    verifier("En cours" in pg.locator(".carte-examen").first.inner_text(), "quitter puis revenir : partie 1 « En cours »")
    pg.click('[data-lancer="qcm"]'); pg.wait_for_timeout(60)
    rate = False
    for k in range(20):
        q = pg.evaluate("MF.qcm._etat().items[MF.qcm._etat().index].q")
        if not rate and q["objectif"].startswith("REC") and q["type"] != "vraifaux":
            rate = True   # une question de recherche ratée au premier essai, puis juste
            faux = [i for i in range(len(q["propositions"])) if i not in q["bonnes"]][0]
            pg.click(f'.proposition[data-i="{faux}"]'); pg.click('[data-action="principal"]'); pg.wait_for_timeout(15)
            if q["type"] == "multiple": pg.click(f'.proposition[data-i="{faux}"]')
        for i in q["bonnes"]:
            if pg.locator(f'.proposition[data-i="{i}"]').get_attribute("aria-pressed") != "true": pg.click(f'.proposition[data-i="{i}"]')
        pg.click('[data-action="principal"]'); pg.wait_for_timeout(15)
        pg.click('[data-action="principal"]'); pg.wait_for_timeout(15)
    verifier(pg.locator('a.btn[href="#/examen"]').count() == 1 and pg.locator('[data-action="rejouer"]').count() == 0, "fin de la partie 1 : « Continuer l'examen blanc »")
    pg.click('a.btn[href="#/examen"]'); pg.wait_for_timeout(80)
    verifier("19 / 20" in pg.locator(".carte-examen").first.inner_text(), "partie 1 : « Fait : 19 / 20 justes du premier coup »")
    pg.click('[data-lancer="rangement"]'); pg.wait_for_timeout(80)
    s = pg.evaluate("({ examen: MF.atelier._session().examen, id: MF.atelier._session().mission.id, quitter: document.querySelector('.jeu-quitter').getAttribute('href') })")
    verifier(s["examen"] and s["id"] in ("m6", "m7", "m8") and s["quitter"] == "#/examen", f"partie 2 : mission courte du Grand rangement ({s['id']}), « Quitter » ramène à l'examen")
    pg.evaluate("(() => { const s = MF.atelier._session(); MF.atelierModele.solutions[s.mission.id](s.etat); MF.atelier.ecranMission(document.getElementById('app')); })()")
    pg.click('[data-action="verifier"]'); pg.wait_for_timeout(40)
    verifier(pg.locator('.barre-action a[href="#/examen"]').count() == 1, "mission réussie : « Continuer l'examen blanc »")
    pg.click('.barre-action a[href="#/examen"]'); pg.wait_for_timeout(80)
    verifier("réussie (sans indice)" in pg.locator(".carte-examen").nth(1).inner_text(), "partie 2 : « Mission réussie (sans indice) »")
    pg.click('[data-lancer="recherche"]'); pg.wait_for_timeout(80)
    verifier(pg.evaluate("MF.recherche._session().examen") and pg.evaluate("MF.recherche._session().mission.id") in ("s3", "s4", "s6", "s7", "s9"), "partie 3 : mission du Détective (deux critères)")
    aller(pg, "#/examen")
    pg.click('[data-passer="recherche"]'); pg.wait_for_timeout(40)
    verifier("Mission passée" in pg.locator(".carte-examen").nth(2).inner_text(), "« Passer » : partie 3 comptée comme non réussie")
    pg.click('[data-action="bilan"]'); pg.wait_for_timeout(80)
    txt = pg.locator(".page").inner_text()
    verifier("91 %" in txt, f"bilan : (19 + 1 + 0) / 22 = 91 %")
    verifier("Révisez en priorité : Recherche de documents" in txt, "recommandation : le thème le plus faible (recherche)")
    pg.screenshot(path=f"{CAPT}/82-examen-bilan.png", full_page=True)
    verifier(stock(pg)["activites"]["examen"]["records"]["blanc"] == 91, "meilleur résultat enregistré : 91 %")
    pg.click('[data-action="entrainer"]'); pg.wait_for_timeout(60)
    verifier(pg.evaluate("MF.qcm._etat().mode") == "REC", "le bouton lance le Quiz express sur ce thème")

    # ------------------------------------------------------------ 3. Badges
    print("3. Badges")
    aller(pg, "#/accueil")
    verifier("Nouveau badge : Prêt·e pour le TE1" in pg.locator(".page").inner_text(), "accueil : « Nouveau badge : Prêt·e pour le TE1 »")
    pg.screenshot(path=f"{CAPT}/83-nouveau-badge.png")
    aller(pg, "#/bilan"); aller(pg, "#/accueil")
    verifier(pg.locator(".carte-badge-nouveau").count() == 0, "le nouveau badge n'est annoncé qu'une fois")
    verifier("Mes badges : 1 sur 8" in pg.locator(".lien-badges").inner_text(), "« Mes badges : 1 sur 8 »")
    aller(pg, "#/badges")
    verifier(pg.locator(".badge.est-obtenu").count() == 1 and pg.locator(".badge").count() == 8, "écran des badges : 8 badges, 1 obtenu")
    verifier("Pas encore : 0 raccourcis sur 20" in pg.locator(".page").inner_text(), "badge non obtenu : progression affichée")
    pg.screenshot(path=f"{CAPT}/84-badges.png", full_page=True)
    verifier("examen" in stock(pg)["badges"], "badge enregistré avec sa date")
    aller(pg, "#/profil"); pg.click('[data-action="exporter"]')
    code = pg.input_value("#champ-export")
    pg.click('[data-action="reinitialiser"]'); pg.click('[data-action="reset-oui"]')
    pg.fill("#champ-import", code); pg.click('[data-action="importer"]'); pg.click('[data-conf="oui"]')
    verifier("examen" in stock(pg)["badges"], "export / import : les badges sont conservés")
    # badges calculés : raccourcis (tous réussis 2 fois) et rangement
    pg.evaluate("""(() => { const e = MF.stockage.etat(); RACCOURCIS.forEach(r => e.questions['clav-' + r.id] = { vues: 2, justes1: 2, boite: 3, derniere: '2026-09-30' });
      e.activites.finder = { parties: 9, etoilesMax: 3, records: Object.fromEntries(ATELIER.missions.map(m => [m.id, 3])) }; MF.stockage.enregistrer(); })()""")
    aller(pg, "#/accueil")
    verifier(pg.locator(".carte-badge-nouveau").count() == 2, "deux nouveaux badges d'un coup : Maître des raccourcis, As du rangement")
    verifier(not pg._erreurs, f"aucune erreur dans la console ({pg._erreurs})")
    ctx.close()

    # ------------------------------------------------------------ 4. Ancien état sans badges
    print("4. Compatibilité : progression enregistrée avant la phase 7")
    ancien = dict(ETAT_JOUE); ancien.pop("badges", None)
    ctx, pg = nouvelle_page(b, etat=ancien)
    pg.goto(BASE + "#/bilan"); pg.wait_for_timeout(150)
    verifier(pg.evaluate("MF.stockage.etat().points") == 500 and "Badges 0 / 8" in pg.locator(".bilan-activites").inner_text(), "un état sans « badges » se charge (points gardés)")
    verifier(not pg._erreurs, f"aucune erreur ({pg._erreurs})")
    ctx.close()

    # ------------------------------------------------------------ 5. Mise en page
    print("5. Mise en page (320, 360, 375, 390 px ; clair et sombre)")
    for scheme in ("light", "dark"):
        for (w, h) in [(320, 640), (360, 800), (375, 667), (390, 844)]:
            ctx, pg = nouvelle_page(b, w, h, scheme, etat=ETAT_JOUE)
            ko, cibles = [], set()
            def controler(nom):
                if not mise_en_page_ok(pg): ko.append(nom)
                cibles.update(petites_cibles(pg))
            pg.goto(BASE + "#/accueil"); pg.wait_for_timeout(150); controler("accueil")
            for r in ("#/examen", "#/badges", "#/bilan", "#/aide"):
                aller(pg, r)
                if r == "#/aide": pg.evaluate("document.querySelectorAll('details').forEach(d => d.open = true)")
                controler(r)
            aller(pg, "#/examen"); pg.click('[data-passer="rangement"]'); pg.click('[data-passer="recherche"]')
            pg.evaluate("MF.examen.finQcm(QUESTIONS.slice(0, 20).map((q, i) => ({ q, fin: { premierCoup: i % 3 !== 0 } })))")
            aller(pg, "#/accueil"); aller(pg, "#/examen"); pg.click('[data-action="bilan"]'); pg.wait_for_timeout(60); controler("bilan de l'examen")
            if w == 360 and scheme == "dark": pg.screenshot(path=f"{CAPT}/85-examen-bilan-sombre.png", full_page=True)
            verifier(not ko, f"{scheme} {w}×{h} : pas de débordement {ko if ko else ''}")
            verifier(not cibles, f"{scheme} {w}×{h} : cibles tactiles ≥ 44 px {sorted(cibles) if cibles else ''}")
            verifier(not pg._erreurs, f"{scheme} {w}×{h} : aucune erreur console {pg._erreurs if pg._erreurs else ''}")
            ctx.close()

    # ------------------------------------------------------------ 6. file://
    print("6. Ouverture locale (file://)")
    ctx, pg = nouvelle_page(b, etat=ETAT_JOUE)
    pg.goto(FILE + "#/examen"); pg.wait_for_timeout(200)
    pg.click('[data-lancer="qcm"]'); pg.wait_for_timeout(60)
    verifier(pg.locator(".proposition").count() >= 2, "l'examen blanc fonctionne ouvert par double-clic")
    verifier(not pg._erreurs, f"aucune erreur console en local ({pg._erreurs})")
    ctx.close()
    b.close()

serveur.terminate()
print("\nRÉSULTAT :", "TOUS LES TESTS RÉUSSIS" if not echecs else f"{len(echecs)} ÉCHEC(S)")
for e in echecs: print(" -", e)
sys.exit(1 if echecs else 0)
