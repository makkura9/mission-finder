"""Tests automatiques (écrits en phase 2) de Mission Finder (Playwright, Chromium sans interface)."""
import subprocess, sys, time, json, os, re, tempfile
from pathlib import Path
from playwright.sync_api import sync_playwright

SITE = str(Path(__file__).resolve().parent.parent)   # racine du dépôt
CAPT = os.path.join(tempfile.gettempdir(), "mission-finder-captures")   # hors du dépôt
os.makedirs(CAPT, exist_ok=True)
PORT = 8765
serveur = subprocess.Popen([sys.executable, "-m", "http.server", str(PORT), "--bind", "127.0.0.1"], cwd=SITE,
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(1.0)
BASE = f"http://127.0.0.1:{PORT}/index.html"
FILE = f"file://{SITE}/index.html"

echecs = []
def verifier(cond, msg):
    print(("  OK   " if cond else "  ÉCHEC ") + msg)
    if not cond: echecs.append(msg)

def nouvelle_page(b, w=360, h=800, scheme="light", bloquer_stockage=False):
    ctx = b.new_context(viewport={"width": w, "height": h}, device_scale_factor=2, color_scheme=scheme,
                        has_touch=True, is_mobile=True)
    if bloquer_stockage:
        ctx.add_init_script("""Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Bloqué', 'SecurityError'); } });""")
    pg = ctx.new_page()
    pg._erreurs = []
    pg.on("console", lambda m: pg._erreurs.append(f"[{m.type}] {m.text}") if m.type in ("error", "warning") else None)
    pg.on("pageerror", lambda e: pg._erreurs.append(f"[pageerror] {e}"))
    pg.on("requestfailed", lambda r: pg._erreurs.append(f"[requête échouée] {r.url}"))
    return ctx, pg

def aller(pg, route, base=BASE):
    if pg.url.startswith(base.split('#')[0]) and pg.url != "about:blank":
        pg.evaluate(f"location.hash = '{route}'")
    else:
        pg.goto(base + route)
    pg.wait_for_timeout(120)

def pas_de_defilement_horizontal(pg):
    return pg.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 0.5")

def petites_cibles(pg):
    # Cibles tactiles < 44 px (hors liens dans un paragraphe de texte)
    return pg.evaluate("""() => {
      const sel = 'button, .btn, .nav a, .carte-activite, .jeu-quitter, .fil a, summary, input, textarea';
      const res = [];
      document.querySelectorAll(sel).forEach(e => {
        const r = e.getBoundingClientRect();
        const st = getComputedStyle(e);
        if (r.width === 0 || r.height === 0 || st.visibility === 'hidden' || e.closest('[hidden]')) return;
        if (r.height < 44 || r.width < 44) res.push((e.className || e.tagName) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height));
      });
      return res;
    }""")

def forcer_question(pg, qid):
    pg.evaluate("""(qid) => {
      const p = MF.qcm._etat();
      const k = p.items.findIndex(it => it.q.id === qid);
      if (k < 0) { const q = QUESTIONS.find(x => x.id === qid); const ordre = q.propositions.map((_, i) => i);
                   p.items[p.index] = { q, ordre, fin: null, premierChoix: null, phrase: '' }; }
      else { const t = p.items[p.index]; p.items[p.index] = p.items[k]; p.items[k] = t; }
      MF.qcm.ecranPartie(document.getElementById('app'));
    }""", qid)

def repondre(pg, indices):
    for i in indices:
        pg.click(f'.proposition[data-i="{i}"]')
    pg.click('[data-action="principal"]')
    pg.wait_for_timeout(30)

def mauvais(q, n=1):
    return [i for i in range(len(q["propositions"])) if i not in q["bonnes"]][:n]

with sync_playwright() as p:
    b = p.chromium.launch()

    # ---------------------------------------------------------------- 1. Partie complète et calcul des points
    print("1. Partie complète (mode mélangé), calcul des points")
    ctx, pg = nouvelle_page(b)
    pg.goto(BASE + "#/accueil"); pg.wait_for_timeout(200)
    verifier(pg.locator("h1").inner_text().startswith("Bonjour"), "l'accueil s'affiche")
    aller(pg, "#/qcm")
    pg.click('[data-mode="melange"]'); pg.wait_for_timeout(100)
    n = pg.evaluate("MF.qcm._etat().items.length")
    verifier(n == 10, f"une partie compte 10 questions (obtenu : {n})")
    ids = pg.evaluate("MF.qcm._etat().items.map(it => it.q.id)")
    verifier(len(set(ids)) == 10, "aucune question en double dans la partie")
    # Stratégie : Q1-4 justes du 1er coup ; Q5 juste au 2e essai (ou 0 si vrai/faux) ; Q6-7 justes du 1er coup ; Q8 fausse deux fois ; Q9-10 justes
    base = bonus = serie = justes1 = 0
    for k in range(n):
        q = pg.evaluate("MF.qcm._etat().items[MF.qcm._etat().index].q")
        multiple = q["type"] == "multiple"
        if k in (4, 7):
            repondre(pg, mauvais(q, 1) if not multiple else [q["bonnes"][0]])  # 1re réponse fausse
            serie = 0
            if q["type"] == "vraifaux":
                pass  # un seul essai : 0 point
            elif k == 4:
                if multiple:  # compléter la sélection pour obtenir exactement les bonnes
                    for i in q["bonnes"][1:]: pg.click(f'.proposition[data-i="{i}"]')
                    pg.click('[data-action="principal"]')
                else:
                    repondre(pg, [q["bonnes"][0]])
                base += 5
            else:
                if multiple:
                    pg.click(f'.proposition[data-i="{mauvais(q,1)[0]}"]'); pg.click('[data-action="principal"]')
                else:
                    repondre(pg, mauvais(q, 2)[1:2] or mauvais(q, 1))
        else:
            repondre(pg, q["bonnes"])
            base += 10; serie += 1; justes1 += 1
            if serie >= 2 and bonus < 10: bonus += min(2, 10 - bonus)
        etat_retour = pg.locator(".retour").first.get_attribute("class")
        verifier(etat_retour is not None, f"Q{k+1} ({q['id']}, {q['type']}) : un retour est affiché")
        pg.click('[data-action="principal"]'); pg.wait_for_timeout(40)
    verifier("#/qcm/resultat" in pg.url, "l'écran de résultat s'affiche à la fin")
    score_txt = pg.locator(".resultat-score").inner_text()
    verifier(score_txt == f"{base + bonus} points", f"score affiché = {base}+{bonus} = {base+bonus} points (obtenu : {score_txt})")
    attendu_etoiles = 3 if base >= 100 else 2 if base >= 75 else 1 if base >= 50 else 0
    etoiles = pg.locator(".resultat-etoiles .etoiles").get_attribute("aria-label")
    verifier(etoiles.startswith(str(attendu_etoiles)), f"étoiles attendues : {attendu_etoiles} (obtenu : {etoiles})")
    pg.screenshot(path=f"{CAPT}/07-resultat.png", full_page=True)
    stock = json.loads(pg.evaluate("localStorage.getItem('missionFinder.v1')"))
    verifier(stock["points"] == base + bonus, f"points enregistrés dans le téléphone : {stock['points']}")
    verifier(stock["version"] == 1 and stock["app"] == "missionFinder", "clé missionFinder.v1 versionnée")
    verifier(stock["activites"]["qcm"]["records"]["melange"] == base + bonus, "record enregistré")
    verifier(len(stock["jours"]) == 1, "jour de révision enregistré")

    # ---------------------------------------------------------------- 2. Rechargement : la progression est relue
    print("2. Rechargement de la page")
    pg.reload(); pg.wait_for_timeout(200)
    aller(pg, "#/bilan")
    txt = pg.locator(".bilan-entete").inner_text()
    verifier(f"{base + bonus} points" in txt, f"le bilan relit les points après rechargement ({txt})")
    verifier(pas_de_defilement_horizontal(pg), "bilan : pas de défilement horizontal")
    haut = pg.evaluate("document.querySelector('.page-bilan').getBoundingClientRect().height")
    verifier(haut <= 600, f"bilan : hauteur ≤ 600 px, visible en entier dans Safari sur iPhone 12 à 15 ({round(haut)} px)")
    pg.screenshot(path=f"{CAPT}/08-bilan.png")
    aller(pg, "#/accueil")
    verifier(pg.locator(".semaine").count() == 1, "accueil : « 1 jour de révision cette semaine »")
    pg.screenshot(path=f"{CAPT}/01-accueil.png", full_page=True)

    # ---------------------------------------------------------------- 3. Export / réinitialisation / import
    print("3. Export, réinitialisation, import")
    aller(pg, "#/profil")
    pg.fill("#champ-pseudo", "Léa"); pg.click('[data-action="pseudo"]')
    pg.click('[data-action="exporter"]')
    code = pg.input_value("#champ-export")
    verifier(code.startswith("MF1-"), "le code commence par MF1-")
    pg.screenshot(path=f"{CAPT}/09-profil.png", full_page=True)
    pg.click('[data-action="reinitialiser"]'); pg.click('[data-action="reset-oui"]')
    verifier(pg.evaluate("MF.stockage.etat().points") == 0, "réinitialisation : 0 point")
    pg.fill("#champ-import", "ceci n'est pas un code"); pg.click('[data-action="importer"]')
    verifier("MF1-" in pg.locator('[data-message="import"]').inner_text(), "code invalide : message clair")
    pg.fill("#champ-import", "MF1-abc"); pg.click('[data-action="importer"]')
    verifier("abîmé" in pg.locator('[data-message="import"]').inner_text(), "code abîmé : message clair")
    pg.fill("#champ-import", "  " + code[:40] + "\n" + code[40:] + "  "); pg.click('[data-action="importer"]')
    verifier(pg.locator('[data-zone="confirmer-import"]').is_visible(), "code valide (même coupé par un retour à la ligne) : demande de confirmation")
    pg.click('[data-conf="oui"]')
    verifier(pg.evaluate("MF.stockage.etat().points") == base + bonus, "import : points restaurés")
    verifier(pg.evaluate("MF.stockage.etat().pseudo") == "Léa", "import : pseudo restauré (accents compris)")
    verifier(json.loads(pg.evaluate("localStorage.getItem('missionFinder.v1')"))["points"] == base + bonus, "import : enregistré dans le téléphone")
    verifier(not pg._erreurs, f"aucune erreur dans la console ({pg._erreurs})")
    ctx.close()

    # ---------------------------------------------------------------- 4. Tous les types de questions + captures
    print("4. Types de questions (captures)")
    ctx, pg = nouvelle_page(b)
    pg.goto(BASE + "#/qcm"); pg.wait_for_timeout(150)
    pg.screenshot(path=f"{CAPT}/02-choix-theme.png", full_page=True)
    pg.click('[data-mode="melange"]'); pg.wait_for_timeout(80)
    forcer_question(pg, "bur-01"); pg.screenshot(path=f"{CAPT}/03-question-image.png")
    q = pg.evaluate("MF.qcm._etat().items[MF.qcm._etat().index].q")
    repondre(pg, [1])  # Finder : distracteur
    txt = pg.locator(".retour").inner_text()
    verifier("Il vous reste un essai" in txt and "Finder" in txt, "1re erreur : explication ciblée + « Il vous reste un essai »")
    verifier(pg.locator('.proposition[data-i="1"]').is_disabled(), "1re erreur : la réponse choisie est désactivée")
    verifier(pg.locator(".est-juste").count() == 0, "1re erreur : la bonne réponse n'est PAS révélée")
    pg.screenshot(path=f"{CAPT}/04-premier-essai-faux.png", full_page=True)
    repondre(pg, [2])
    txt = pg.locator(".retour").inner_text()
    verifier("Bonne réponse : Excel" in txt, "2e erreur : la bonne réponse est affichée")
    pg.screenshot(path=f"{CAPT}/05-reponse-finale-fausse.png", full_page=True)
    pg.click('[data-action="principal"]')
    forcer_question(pg, "bur-02"); pg.screenshot(path=f"{CAPT}/06-question-multiple-dock.png", full_page=True)
    verifier(pg.locator(".puce-multiple").count() == 1, "choix multiple : « Plusieurs réponses possibles » affiché")
    repondre(pg, [0, 1, 2])
    verifier("+10 points" in pg.locator(".retour").inner_text(), "choix multiple juste du 1er coup : +10 points")
    pg.click('[data-action="principal"]')
    forcer_question(pg, "typ-03"); pg.screenshot(path=f"{CAPT}/06b-question-ranger.png", full_page=True)
    repondre(pg, [0]); pg.screenshot(path=f"{CAPT}/06c-reponse-juste.png", full_page=True)
    pg.click('[data-action="principal"]')
    forcer_question(pg, "fin-03")
    verifier(pg.locator(".proposition").nth(0).inner_text().startswith("Vrai"), "vrai/faux : « Vrai » toujours en premier")
    repondre(pg, [0])
    verifier("Bonne réponse : Faux" in pg.locator(".retour").inner_text(), "vrai/faux : un seul essai, puis la bonne réponse")
    # Reprise de partie
    aller(pg, "#/qcm")
    verifier(pg.locator('[data-action="reprendre"]').count() == 1, "quitter puis revenir : « Reprendre la partie »")
    pg.click('[data-action="reprendre"]'); pg.wait_for_timeout(80)
    verifier("#/qcm/partie" in pg.url, "la partie reprend")
    verifier(not pg._erreurs, f"aucune erreur dans la console ({pg._erreurs})")
    ctx.close()

    # ---------------------------------------------------------------- 5. Mise en page : 4 tailles × tous les écrans, clair et sombre
    print("5. Mise en page (320, 360, 375, 390 px ; clair et sombre)")
    for scheme in ("light", "dark"):
        for (w, h) in [(320, 640), (360, 800), (375, 667), (390, 844)]:
            ctx, pg = nouvelle_page(b, w, h, scheme)
            pg.goto(BASE + "#/accueil"); pg.wait_for_timeout(120)
            ko = []
            cibles = set()
            for route in ["#/accueil", "#/qcm", "#/bilan", "#/profil", "#/aide"]:
                aller(pg, route)
                if route == "#/aide": pg.evaluate("document.querySelectorAll('details').forEach(d => d.open = true)")
                if route == "#/profil": pg.click('[data-action="exporter"]')
                if not pas_de_defilement_horizontal(pg): ko.append(route)
                cibles.update(petites_cibles(pg))
            aller(pg, "#/qcm"); pg.click('[data-mode="melange"]'); pg.wait_for_timeout(60)
            for qid in ["bur-01", "bur-02", "typ-03", "rac-02", "fin-06"]:
                forcer_question(pg, qid)
                if not pas_de_defilement_horizontal(pg): ko.append("question " + qid)
                cibles.update(petites_cibles(pg))
                q = pg.evaluate("MF.qcm._etat().items[MF.qcm._etat().index].q")
                repondre(pg, mauvais(q, 1)); repondre(pg, mauvais(q, 2)[1:2] or mauvais(q,1))
                if not pas_de_defilement_horizontal(pg): ko.append("retour " + qid)
                pg.click('[data-action="principal"]')
            if scheme == "dark" and w == 360:
                aller(pg, "#/accueil"); pg.screenshot(path=f"{CAPT}/10-accueil-sombre.png", full_page=True)
            verifier(not ko, f"{scheme} {w}×{h} : pas de défilement horizontal {ko if ko else ''}")
            verifier(not cibles, f"{scheme} {w}×{h} : cibles tactiles ≥ 44 px {sorted(cibles) if cibles else ''}")
            verifier(not pg._erreurs, f"{scheme} {w}×{h} : aucune erreur console {pg._erreurs if pg._erreurs else ''}")
            ctx.close()

    # ---------------------------------------------------------------- 6. Stockage bloqué (navigation privée)
    print("6. Stockage bloqué")
    ctx, pg = nouvelle_page(b, bloquer_stockage=True)
    pg.goto(BASE + "#/accueil"); pg.wait_for_timeout(150)
    verifier(pg.locator("#bandeau-stockage").is_visible(), "bandeau « progression non enregistrée » visible")
    aller(pg, "#/qcm"); pg.click('[data-mode="TYP"]'); pg.wait_for_timeout(60)
    q = pg.evaluate("MF.qcm._etat().items[0].q"); repondre(pg, q["bonnes"])
    verifier(pg.evaluate("MF.stockage.etat().points") == 10, "le jeu fonctionne en mémoire (10 points)")
    pg.screenshot(path=f"{CAPT}/11-stockage-bloque.png")
    verifier(not [e for e in pg._erreurs if "pageerror" in e], f"aucune erreur JavaScript ({pg._erreurs})")
    ctx.close()

    # ---------------------------------------------------------------- 7. Ouverture par double-clic (file://)
    print("7. Ouverture locale (file://)")
    ctx, pg = nouvelle_page(b)
    pg.goto(FILE + "#/accueil"); pg.wait_for_timeout(200)
    verifier(pg.locator("h1").inner_text().startswith("Bonjour"), "le site fonctionne ouvert par double-clic")
    aller(pg, "#/qcm", FILE); pg.click('[data-mode="melange"]'); pg.wait_for_timeout(60)
    verifier(pg.locator(".proposition").count() >= 2, "une question s'affiche en local")
    verifier(not pg._erreurs, f"aucune erreur console en local ({pg._erreurs})")
    ctx.close()

    # ---------------------------------------------------------------- 8. Manifeste en ligne
    print("8. Manifeste")
    ctx, pg = nouvelle_page(b)
    pg.goto(BASE + "#/accueil"); pg.wait_for_timeout(200)
    href = pg.evaluate("document.querySelector('link[rel=manifest]') && document.querySelector('link[rel=manifest]').href")
    verifier(href and href.endswith("manifest.webmanifest"), "manifeste déclaré en ligne")
    r = pg.request.get(href); m = r.json()
    verifier(r.ok and m["name"] == "Mission Finder", "manifeste lisible")
    for ic in m["icons"]:
        verifier(pg.request.get(BASE.replace("index.html", ic["src"])).ok, f"icône présente : {ic['src']}")
    verifier(pg.request.get(BASE.replace("index.html", "img/apple-touch-icon.png")).ok, "apple-touch-icon présente")
    ctx.close()
    b.close()

serveur.terminate()
print("\nRÉSULTAT :", "TOUS LES TESTS RÉUSSIS" if not echecs else f"{len(echecs)} ÉCHEC(S)")
for e in echecs: print(" -", e)
sys.exit(1 if echecs else 0)
