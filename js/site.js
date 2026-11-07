const NAV = [["/home/", "Home"], ["/updates/", "Updates"], ["/info/", "Info"], ["/terms/", "Terms"]];
const API = location.hostname === "localhost" ? "http://localhost:8787" : "https://kestrel-server.nathanielmcnair3.workers.dev";

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function renderChrome() {
  const here = location.pathname.replace(/index\.html$/, "") || "/";
  const header = document.getElementById("site-header");
  const footer = document.getElementById("site-footer");

  if (header) {
    header.className = "site-header";
    const wrap = el("div", "wrap");
    const brand = el("a", "brand", "Kestrel");
    brand.href = "/";
    const nav = el("nav", "nav");
    for (const [href, label] of NAV) {
      const a = el("a", "", label);
      a.href = href;
      if (href === here) a.setAttribute("aria-current", "page");
      nav.append(a);
    }
    const actions = el("div", "header-actions");
    for (const [key, label, style] of [["download", "Download", "btn-primary"], ["discord", "Join the Discord", "btn-ghost"]]) {
      const a = el("a", "btn btn-sm " + style, label);
      a.dataset.link = key;
      a.href = "#";
      actions.append(a);
    }
    const right = el("div", "header-right");
    right.append(nav, actions);
    wrap.append(brand, right);
    header.append(wrap);
  }
  if (footer) {
    footer.className = "site-footer";
    footer.append(el("div", "wrap", "© 2026 Kestrel. All rights reserved."));
  }
}

function renderStatus(data) {
  const box = document.querySelector("[data-status]");
  if (!box) return;
  box.dataset.state = data.status;
  box.querySelector(".label").textContent =
    (data.status === "online" ? "Online" : "Offline") + " · Version " + data.version;
}

function renderLinks(data) {
  document.querySelectorAll("[data-link]").forEach(a => { a.href = data.links[a.dataset.link] || "#"; });
}

function renderChangelog(data) {
  const box = document.querySelector("[data-changelog]");
  if (!box) return;
  const limit = Number(box.dataset.limit) || Infinity;
  for (const item of data.changelog.slice(0, limit)) {
    const entry = el("article", "entry");
    entry.append(el("h3", "", item.version), el("time", "", item.date));
    const list = el("ul");
    item.changes.forEach(c => list.append(el("li", "", c)));
    entry.append(list);
    box.append(entry);
  }
}

function renderAnnouncements(data) {
  const box = document.querySelector("[data-announcements]");
  if (!box) return;
  const limit = Number(box.dataset.limit) || Infinity;
  if (!data.announcements.length) { box.append(el("p", "empty", "No announcements right now.")); return; }
  box.classList.add("timeline");   // same look as the changelog
  for (const item of data.announcements.slice(0, limit)) {
    const entry = el("article", "entry");
    entry.append(el("h3", "", item.title), el("time", "", item.date), el("p", "", item.body));
    box.append(entry);
  }
}

async function main() {
  renderChrome();
  try {
    const res = await fetch(`${API}/api/site`);
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    renderStatus(data); renderLinks(data); renderChangelog(data); renderAnnouncements(data);
  } catch {
    const s = document.querySelector("[data-status]");
    if (s) { s.dataset.state = "offline"; s.querySelector(".label").textContent = "Can’t reach the server. Try again shortly."; }
  }
}
main();
