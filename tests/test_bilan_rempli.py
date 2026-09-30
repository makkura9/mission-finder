import subprocess, sys, time, json, os, tempfile
from pathlib import Path
SITE = str(Path(__file__).resolve().parent.parent)
from playwright.sync_api import sync_playwright
srv=subprocess.Popen([sys.executable,"-m","http.server","8767","--bind","127.0.0.1"],cwd=SITE,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(0.8)
codes=["BUR1","BUR2","BUR3","BUR4","FIN1","FIN2","FIN3","FIN4","FIN5","FIN6","FIN7","FIN8","TYP1","TYP2","RAC","REC1","REC2","REC3","REC4"]
etat={"app":"missionFinder","version":1,"creeLe":"2026-09-28T10:00:00Z","modifieLe":"2026-09-30T10:00:00Z","pseudo":"Maximilienne","points":3300,
 "objectifs":{c:[1,1,1,1,1,1,1,1,1,1] for c in codes},"questions":{},"activites":{"qcm":{"parties":40,"etoilesMax":3,"records":{"melange":110}},"raccourcis":{"parties":12,"etoilesMax":3,"records":{"partie":110}},"bureau":{"parties":9,"etoilesMax":2,"records":{"visite":95}},"finder":{"parties":9,"etoilesMax":3,"records":{"m1":3,"m2":3,"m9":2}},"recherche":{"parties":11,"etoilesMax":3,"records":{"s0":3,"s1":2}}},"jours":["2026-09-30"]}
ok=True
with sync_playwright() as p:
    b=p.chromium.launch()
    for w,h in [(320,640),(360,800),(375,667),(390,844)]:
        ctx=b.new_context(viewport={"width":w,"height":h},device_scale_factor=2,is_mobile=True,has_touch=True)
        ctx.add_init_script("localStorage.setItem('missionFinder.v1', %s)" % json.dumps(json.dumps(etat)))
        pg=ctx.new_page(); pg.goto("http://127.0.0.1:8767/index.html#/bilan"); pg.wait_for_timeout(200)
        deb=pg.evaluate("[...document.querySelectorAll('.page-bilan *')].filter(e=>e.getBoundingClientRect().right>document.documentElement.clientWidth+0.5).length")
        sw=pg.evaluate("document.documentElement.scrollWidth<=document.documentElement.clientWidth")
        haut=pg.evaluate("document.querySelector('.page-bilan').getBoundingClientRect().height")
        # Une seule capture d'écran : ≤ 600 px dès 360 px de large (Safari sur iPhone 12 à 15, barre de navigation comprise)
        r = deb==0 and sw and (w < 360 or haut <= 600)
        ok &= r
        print(f"{w}x{h}: éléments qui dépassent = {deb}, défilement horizontal = {not sw}, hauteur = {round(haut)} px{' (max 600)' if w >= 360 else ''} -> {'OK' if r else 'ÉCHEC'}")
        if w==360: pg.screenshot(path=os.path.join(tempfile.gettempdir(), "bilan-plein.png"))
        ctx.close()
    b.close()
srv.terminate(); print("RÉSULTAT:", "OK" if ok else "ÉCHEC"); sys.exit(0 if ok else 1)
