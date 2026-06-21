#!/usr/bin/env python3
"""
lead_finder.py — find local businesses with no real web presence (or a dated site),
score them by opportunity, and emit an observable HTML report + CSV.

Part of the "first real website" outreach pipeline. The pitch is NOT "your site is
old" — the data shows that's rare. It's "you have no real web presence and your
competitors do." See memory: lead-finder-pipeline.

Usage:
    GKEY=<google-api-key> python3 lead_finder.py --niche "auto repair and tire shops" \\
        --city "Indianapolis Indiana" --out ./out [--max 60]

Outputs (in --out dir):
    leads.csv    raw ranked data
    report.html  browsable ranked hit-list with presence badges (self-contained)

Billing note (Places API New, 2026): requesting websiteUri bumps the whole Text
Search request to Enterprise tier ($35/1k, 1k free/mo). For a small batch this is
fine; at scale, switch to the 2-step Essentials-IDs -> Place Details pattern.
TLS verification is intentionally disabled for the *scoring fetch* only: the tool
audits strangers' possibly-broken public HTML, and an expired cert is itself a
signal we want to score, not crash on. No secrets are ever sent to those hosts.
"""
import os, re, sys, csv, json, time, html, argparse, ssl, urllib.request
from urllib.parse import urlparse

UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/124 Safari/537.36")

# ---- fake / non-website presence: a "site" that is really a social/payment page ----
FAKE_HOSTS = {
    "facebook.com": "Facebook only", "m.facebook.com": "Facebook only",
    "instagram.com": "Instagram only", "linktr.ee": "Linktree",
    "linktree.com": "Linktree", "cash.app": "Cash App link",
    "venmo.com": "Venmo link", "yelp.com": "Yelp only",
    "google.com": "Google listing", "sites.google.com": "Google Sites stub",
    "business.site": "Google Business stub", "beacons.ai": "Beacons link",
    "square.site": "Square link", "wixsite.com": "Wix subdomain stub",
    "godaddysites.com": "GoDaddy stub",
}

def _ctx():
    c = ssl.create_default_context()
    c.check_hostname = False
    c.verify_mode = ssl.CERT_NONE  # see module docstring — intentional for audit fetch
    return c

def classify_presence(url):
    host = urlparse(url if "://" in url else "https://" + url).netloc.lower().replace("www.", "")
    for k, label in FAKE_HOSTS.items():
        if host == k or host.endswith("." + k):
            return label
    return None

def fetch(url, timeout=12):
    if not url.startswith(("http://", "https://")):
        url = "https://" + url
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=timeout, context=_ctx()) as r:
            return r.read(400_000).decode("utf-8", "ignore"), urlparse(r.geturl()).scheme, None
    except Exception as e:
        if url.startswith("https://"):
            try:
                u2 = "http://" + url[len("https://"):]
                req2 = urllib.request.Request(u2, headers={"User-Agent": UA})
                with urllib.request.urlopen(req2, timeout=timeout, context=_ctx()) as r:
                    return r.read(400_000).decode("utf-8", "ignore"), urlparse(r.geturl()).scheme, None
            except Exception as e2:
                return None, None, f"{type(e2).__name__}"
        return None, None, f"{type(e).__name__}"

def score_site(url):
    """Return dict: opportunity score (higher=better lead), badge, hit list."""
    fake = classify_presence(url)
    if fake:
        return {"score": 60, "badge": fake, "tier": "no-presence", "hits": [fake]}
    html_doc, scheme, err = fetch(url)
    if html_doc is None:
        return {"score": 45, "badge": "Parked / broken", "tier": "broken", "hits": [f"unreachable ({err})"]}
    h = html_doc.lower()
    pts, hits = 0, []
    if not re.search(r'<meta[^>]+name=["\']viewport["\']', h):
        pts += 30; hits.append("not mobile-friendly")
    if h.count("<table") >= 3 and "<td" in h:
        pts += 25; hits.append("table layout")
    if scheme != "https":
        pts += 25; hits.append("no HTTPS")
    dep = [t.strip("< ") for t in ("<frameset", "<marquee", "<blink", "<font", "<center") if t in h]
    if dep:
        pts += 20; hits.append("deprecated: " + ", ".join(dep))
    head = html_doc[:200].lower()
    if "<!doctype html>" not in head:
        pts += (15 if "<!doctype" in head else 8); hits.append("old/no doctype")
    years = re.findall(r'(?:©|&copy;|copyright)[^0-9]{0,12}(20[0-2][0-9])', h)
    if years and max(int(y) for y in years) <= 2021:
        pts += 12; hits.append(f"stale ©{max(int(y) for y in years)}")
    if ".swf" in h or "shockwave-flash" in h:
        pts += 15; hits.append("Flash")
    if re.search(r'jquery[-./][12]\.', h):
        pts += 8; hits.append("old jQuery")
    if not re.search(r'<meta[^>]+property=["\']og:', h):
        pts += 5; hits.append("no social tags")
    badge = ("Outdated site" if pts >= 30 else
             "Minor issues" if pts >= 10 else "Modern — skip")
    tier = ("outdated" if pts >= 30 else "minor" if pts >= 10 else "skip")
    return {"score": pts, "badge": badge, "tier": tier, "hits": hits or ["looks current"]}

# ---------------- Google Places (New) ----------------
def places_search(gkey, query, want=60):
    rows, token = [], None
    for _ in range((want + 19) // 20):
        body = {"textQuery": query, "maxResultCount": 20}
        if token:
            body["pageToken"] = token
        req = urllib.request.Request(
            "https://places.googleapis.com/v1/places:searchText",
            data=json.dumps(body).encode(), method="POST",
            headers={"Content-Type": "application/json", "X-Goog-Api-Key": gkey,
                     "X-Goog-FieldMask": ("places.displayName,places.websiteUri,"
                                          "places.formattedAddress,places.nationalPhoneNumber,"
                                          "nextPageToken")})
        with urllib.request.urlopen(req, timeout=25) as r:
            d = json.load(r)
        for p in d.get("places", []):
            rows.append({"name": p.get("displayName", {}).get("text", ""),
                         "site": p.get("websiteUri"),
                         "addr": p.get("formattedAddress", ""),
                         "phone": p.get("nationalPhoneNumber", "")})
        token = d.get("nextPageToken")
        if not token:
            break
        time.sleep(2)  # nextPageToken needs a moment to activate
    return rows

# ---------------- report rendering ----------------
TIER_COLOR = {"no-presence": "#c0392b", "broken": "#d35400", "outdated": "#e67e22",
              "minor": "#7f8c8d", "skip": "#bdc3c7"}

def render_html(leads, niche, city, generated):
    rows = []
    for L in leads:
        c = TIER_COLOR.get(L["tier"], "#888")
        site_cell = (f'<a href="{html.escape(L["site"])}" target="_blank">{html.escape(L["site"])}</a>'
                     if L["site"] else '<span style="color:#999">— none found —</span>')
        hits = ", ".join(html.escape(x) for x in L["hits"])
        rows.append(f"""<tr>
  <td class="sc" style="background:{c}">{L['score']}</td>
  <td><span class="badge" style="background:{c}">{html.escape(L['badge'])}</span></td>
  <td class="nm">{html.escape(L['name'])}</td>
  <td class="meta">{html.escape(L['phone'] or '')}<br><span class="addr">{html.escape(L['addr'])}</span></td>
  <td class="site">{site_cell}<div class="hits">{hits}</div></td>
</tr>""")
    strong = sum(1 for L in leads if L["score"] >= 60)
    n = len(leads)
    return f"""<!doctype html><html><head><meta charset="utf-8">
<title>Lead Finder — {html.escape(niche)} / {html.escape(city)}</title>
<style>
 body{{font:15px/1.5 -apple-system,Segoe UI,Roboto,sans-serif;margin:0;background:#f4f4f2;color:#1a1a2e}}
 header{{background:#1a1a2e;color:#fff;padding:22px 28px}}
 header h1{{margin:0 0 4px;font-size:20px}} header .sub{{opacity:.7;font-size:13px}}
 .stats{{display:flex;gap:28px;padding:16px 28px;background:#fff;border-bottom:1px solid #e0e0e0}}
 .stat b{{display:block;font-size:26px}} .stat span{{font-size:12px;color:#777}}
 table{{width:100%;border-collapse:collapse;background:#fff}}
 th{{text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:#999;padding:10px 14px;border-bottom:2px solid #eee}}
 td{{padding:11px 14px;border-bottom:1px solid #f0f0f0;vertical-align:top}}
 .sc{{color:#fff;font-weight:700;text-align:center;width:40px;border-radius:0}}
 .badge{{color:#fff;font-size:11px;font-weight:600;padding:3px 9px;border-radius:20px;white-space:nowrap}}
 .nm{{font-weight:600}} .meta{{font-size:13px;color:#555}} .addr{{color:#999;font-size:12px}}
 .site a{{color:#2563eb;text-decoration:none;font-size:13px;word-break:break-all}}
 .hits{{font-size:11px;color:#aaa;margin-top:3px}}
</style></head><body>
<header><h1>Lead Finder — {html.escape(niche)}</h1>
<div class="sub">{html.escape(city)} · generated {generated}</div></header>
<div class="stats">
 <div class="stat"><b>{n}</b><span>businesses scanned</span></div>
 <div class="stat"><b style="color:#c0392b">{strong}</b><span>strong leads (no real web presence)</span></div>
 <div class="stat"><b>{round(100*strong/n) if n else 0}%</b><span>opportunity rate</span></div>
</div>
<table><thead><tr><th>Score</th><th>Status</th><th>Business</th><th>Contact</th><th>Current site / issues</th></tr></thead>
<tbody>{''.join(rows)}</tbody></table>
<p style="padding:14px 28px;color:#999;font-size:12px">Higher score = better lead. 60+ = no real web presence (best). Facts pulled from Google Places; never reuse a business's logo/photos/copy — generate originals.</p>
</body></html>"""

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--niche", required=True)
    ap.add_argument("--city", required=True)
    ap.add_argument("--out", default="./out")
    ap.add_argument("--max", type=int, default=60)
    args = ap.parse_args()

    gkey = os.environ.get("GKEY")
    if not gkey:
        sys.exit("ERROR: set GKEY env var to the Google Places API key.")

    os.makedirs(args.out, exist_ok=True)
    query = f"{args.niche} in {args.city}"
    print(f"[1/3] Places search: {query!r}")
    rows = places_search(gkey, query, args.max)
    print(f"      pulled {len(rows)} businesses")

    print("[2/3] scoring web presence ...")
    leads = []
    for r in rows:
        if not r["site"]:
            s = {"score": 70, "badge": "No website at all", "tier": "no-presence", "hits": ["no website found"]}
        else:
            s = score_site(r["site"])
        leads.append({**r, **s})
    leads.sort(key=lambda L: L["score"], reverse=True)

    print("[3/3] writing report ...")
    generated = time.strftime("%Y-%m-%d %H:%M")
    with open(os.path.join(args.out, "leads.csv"), "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["score", "badge", "name", "phone", "address", "site", "issues"])
        for L in leads:
            w.writerow([L["score"], L["badge"], L["name"], L["phone"], L["addr"],
                        L["site"] or "", "; ".join(L["hits"])])
    report = os.path.join(args.out, "report.html")
    with open(report, "w") as f:
        f.write(render_html(leads, args.niche, args.city, generated))

    strong = sum(1 for L in leads if L["score"] >= 60)
    print(f"\nDONE. {len(leads)} businesses, {strong} strong leads ({round(100*strong/len(leads)) if leads else 0}% opportunity).")
    print(f"  report: {report}")
    print(f"  csv:    {os.path.join(args.out, 'leads.csv')}")

if __name__ == "__main__":
    main()
