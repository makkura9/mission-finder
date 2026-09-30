"""Tests automatiques (phase 3) de Mission Finder : Révision du jour (boîtes de Leitner) et banque de questions.
Playwright, Chromium sans interface. Usage : python3 tests/test_phase3.py"""
import subprocess, sys, time, json, os, tempfile
from pathlib import Path
from playwright.sync_api import sync_playwright

SITE = str(Path(__file__).resolve().parent.parent)
CAPT = os.path.join(tempfile.gettempdir(), "mission-finder-captures")
os.makedirs(CAPT, exist_ok=True)
PORT = 8766
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

def question(pg):
    return pg.evaluate("MF.qcm._etat().items[MF.qcm._etat().index].q")

def repondre(pg, indices):
    for i in indices: pg.click(f'.proposition[data-i="{i}"]')
    pg.click('[data-action="principal"]'); pg.wait_for_timeout(20)

def mauvaises(q):
    return [i for i in range(len(q["propositions"])) if i not in q["bonnes"]]

def repondre_faux(pg, q):
    """Répond faux jusqu'au bout (deux essais, sauf vrai/faux)."""
    m = mauvaises(q)
    repondre(pg, [m[0]])
    if pg.locator('[data-action="principal"]').inner_text() == "Valider":
        if q["type"] == "multiple": repondre(pg, [])      # la sélection fausse reste cochée : on valide à nouveau
        else: repondre(pg, [m[1] if len(m) > 1 else m[0]])

def jouer(pg, juste):
    ids = []
    while "#/qcm/partie" in pg.url:
        q = question(pg); ids.append(q["id"])
        if juste: repondre(pg, q["bonnes"])
        else: repondre_faux(pg, q)
        pg.click('[data-action="principal"]'); pg.wait_for_timeout(30)
    return ids

with sync_playwright() as p:
    b = p.chromium.launch()

    # ------------------------------------------------------------ 1. Révision du jour, premier lancement
    print("1. Révision du jour : premier lancement")
    ctx, pg = nouvelle_page(b)
    pg.goto(BASE + "#/accueil"); pg.wait_for_timeout(200)
    carte = pg.locator(".carte-revision")
    verifier(carte.count() == 1 and "Répondez à quelques questions" in carte.inner_text(), "carte « Révision du jour » active, message de départ")
    verifier("5 questions" in pg.locator('[data-action="revision"]').inner_text(), "bouton « Commencer · 5 questions »")
    pg.screenshot(path=f"{CAPT}/20-accueil-revision.png")
    pg.click('[data-action="revision"]'); pg.wait_for_timeout(100)
    etat = pg.evaluate("({ mode: MF.qcm._etat().mode, ids: MF.qcm._etat().items.map(i => i.q.id), themes: MF.qcm._etat().items.map(i => MF.ui.themeDeObjectif(i.q.objectif)) })")
    verifier(etat["mode"] == "revision" and len(etat["ids"]) == 5, f"partie de 5 questions en mode révision ({etat['ids']})")
    verifier(len(set(etat["themes"])) == 5, f"tous thèmes mélangés ({etat['themes']})")
    rates = jouer(pg, juste=False)
    verifier("#/qcm/resultat" in pg.url, "écran de résultat")
    txt = pg.locator(".carte-resultat").inner_text()
    verifier("Encore 5 questions à revoir aujourd'hui" in txt, "résultat : « Encore 5 questions à revoir aujourd'hui »")
    verifier(pg.locator('[data-action="rejouer"]').inner_text() == "Nouvelle révision", "bouton « Nouvelle révision »")
    pg.screenshot(path=f"{CAPT}/21-resultat-revision.png", full_page=True)

    # ------------------------------------------------------------ 2. Les questions ratées reviennent
    print("2. Les questions ratées reviennent en priorité")
    pg.goto(BASE + "#/accueil"); pg.wait_for_timeout(150)
    verifier("5 questions à revoir aujourd'hui" in pg.locator(".carte-revision").inner_text(), "accueil : « 5 questions à revoir aujourd'hui »")
    pg.click('[data-action="revision"]'); pg.wait_for_timeout(100)
    ids2 = pg.evaluate("MF.qcm._etat().items.map(i => i.q.id)")
    verifier(sorted(ids2) == sorted(rates), "la nouvelle révision reprend exactement les 5 questions ratées")
    jouer(pg, juste=True)
    verifier("Plus aucune question à revoir aujourd'hui" in pg.locator(".carte-resultat").inner_text(), "tout juste : « Plus aucune question à revoir aujourd'hui »")
    stock = json.loads(pg.evaluate("localStorage.getItem('missionFinder.v1')"))
    verifier(all(stock["questions"][i]["boite"] == 2 for i in rates), "les 5 questions passent en boîte 2 (enregistré)")
    pg.reload(); pg.wait_for_timeout(150)
    pg.goto(BASE + "#/accueil"); pg.wait_for_timeout(150)
    verifier("Rien à revoir aujourd'hui" in pg.locator(".carte-revision").inner_text(), "après rechargement : « Rien à revoir aujourd'hui »")
    pg.screenshot(path=f"{CAPT}/22-accueil-rien-a-revoir.png")

    # ------------------------------------------------------------ 3. Quiz express : priorité aux questions jamais vues
    print("3. Quiz express et Leitner")
    pg.goto(BASE + "#/qcm"); pg.wait_for_timeout(100)
    pg.click('[data-mode="TYP"]'); pg.wait_for_timeout(80)
    ids = pg.evaluate("MF.qcm._etat().items.map(i => i.q.id)")
    vues = set(stock["questions"].keys())
    verifier(len(ids) == 10 and len(set(ids)) == 10, "thème TYP : 10 questions sans doublon")
    nb_typ_nouvelles = pg.evaluate("QUESTIONS.filter(q => q.objectif.startsWith('TYP')).length") - len([i for i in vues if i.startswith("typ")])
    verifier(len([i for i in ids if i not in vues]) == min(10, nb_typ_nouvelles), "les questions jamais vues passent avant les questions réussies récemment")
    verifier(not pg._erreurs, f"aucune erreur dans la console ({pg._erreurs})")
    ctx.close()

    # ------------------------------------------------------------ 4. Les 90 questions à 320 px (clair) et 390 px (sombre)
    print("4. Toutes les questions, petits écrans")
    for (w, h, scheme) in [(320, 640, "light"), (390, 844, "dark")]:
        ctx, pg = nouvelle_page(b, w, h, scheme)
        pg.goto(BASE + "#/qcm"); pg.wait_for_timeout(120)
        pg.click('[data-mode="melange"]'); pg.wait_for_timeout(60)
        ids = pg.evaluate("QUESTIONS.map(q => q.id)")
        ko, sans_retour, figures_ko = [], [], []
        for qid in ids:
            pg.evaluate("""(qid) => { const p = MF.qcm._etat(); const q = QUESTIONS.find(x => x.id === qid);
              p.items[p.index] = { q, ordre: q.propositions.map((_, i) => i), fin: null, premierChoix: null, phrase: '' };
              p.statut = 'attente'; p.selection = []; p.desactivees = []; p.essai = 1; MF.qcm.ecranPartie(document.getElementById('app')); }""", qid)
            q = question(pg)
            if q.get("figure") and pg.locator(".page-jeu .figure").count() != 1: figures_ko.append(qid)
            if pg.evaluate("document.documentElement.scrollWidth > innerWidth + 0.5"): ko.append(qid)
            fig_trop_large = pg.evaluate("[...document.querySelectorAll('.page-jeu .figure *')].some(e => e.getBoundingClientRect().right > innerWidth + 0.5)")
            if fig_trop_large: figures_ko.append(qid + " (déborde)")
            repondre_faux(pg, q)
            if pg.locator(".retour").count() != 1 or "Bonne réponse" not in pg.locator(".retour").inner_text(): sans_retour.append(qid)
            if pg.evaluate("document.documentElement.scrollWidth > innerWidth + 0.5"): ko.append(qid + " (retour)")
            if qid in ("fin-11", "fin-10", "bur-08") and w == 320:
                pg.screenshot(path=f"{CAPT}/23-{qid}-320.png", full_page=True)
        verifier(not ko, f"{scheme} {w}×{h} : {len(ids)} questions sans défilement horizontal {ko if ko else ''}")
        verifier(not figures_ko, f"{scheme} {w}×{h} : illustrations affichées et dans l'écran {figures_ko if figures_ko else ''}")
        verifier(not sans_retour, f"{scheme} {w}×{h} : bonne réponse affichée après deux erreurs {sans_retour if sans_retour else ''}")
        verifier(not pg._erreurs, f"{scheme} {w}×{h} : aucune erreur console {pg._erreurs if pg._erreurs else ''}")
        ctx.close()

    # ------------------------------------------------------------ 5. Ouverture locale (file://)
    print("5. Ouverture locale (file://)")
    ctx, pg = nouvelle_page(b)
    pg.goto(FILE + "#/accueil"); pg.wait_for_timeout(200)
    pg.click('[data-action="revision"]'); pg.wait_for_timeout(100)
    verifier(pg.locator(".proposition").count() >= 2, "Révision du jour fonctionne ouverte par double-clic")
    verifier(not pg._erreurs, f"aucune erreur console en local ({pg._erreurs})")
    ctx.close()
    b.close()

serveur.terminate()
print("\nRÉSULTAT :", "TOUS LES TESTS RÉUSSIS" if not echecs else f"{len(echecs)} ÉCHEC(S)")
for e in echecs: print(" -", e)
sys.exit(1 if echecs else 0)
