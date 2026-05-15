/* ============================================================
   Re:Zero+ — app.js (home)
   ============================================================ */

const $ = (sel) => document.querySelector(sel);

/* ============================================================
   APLICA CUSTOMIZAÇÕES (cores, logo) DEFINIDAS NO PAINEL
   ============================================================ */
function aplicarAparencia() {
  const ap = (SITE && SITE.aparencia) || {};
  const root = document.documentElement;
  if (ap.corAccent)   root.style.setProperty("--accent",   ap.corAccent);
  if (ap.corAccent2)  root.style.setProperty("--accent-2", ap.corAccent2);
  if (ap.corBg) {
    root.style.setProperty("--bg",      ap.corBg);
    root.style.setProperty("--bg-soft", escurecer(ap.corBg, 0.4));
  }
  if (ap.corTexto)    root.style.setProperty("--text",  ap.corTexto);
  if (ap.corMuted)    root.style.setProperty("--muted", ap.corMuted);
}

/* Faz a cor um pouco mais clara — usado pra derivar bg-soft do bg */
function escurecer(hex, fator) {
  try {
    let h = hex.replace("#", "");
    if (h.length === 3) h = h.split("").map(c => c + c).join("");
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    const aclarar = (v) => Math.min(255, Math.round(v + (255 - v) * fator * 0.04));
    return `rgb(${aclarar(r)}, ${aclarar(g)}, ${aclarar(b)})`;
  } catch { return hex; }
}

/* ============================================================
   LOGO (emoji ou imagem)
   ============================================================ */
function renderLogo() {
  const ap = SITE.aparencia || {};
  const tipo = ap.logoTipo || "emoji";
  const conteudo = ap.logoConteudo || "❄";
  const nome = SITE.nome || "Re:Zero+";

  let html;
  if (tipo === "imagem" && conteudo) {
    html = `<img src="${conteudo}" alt="${nome}" class="logo-icon-img"><span>${nome}</span>`;
  } else {
    html = `<span>${conteudo}</span> ${nome}`;
  }

  document.getElementById("logo-home").innerHTML   = html;
  document.getElementById("logo-footer").innerHTML = html;

  /* Logo clicável → topo */
  document.getElementById("logo-home").onclick   = () => window.scrollTo({ top: 0, behavior: "smooth" });
  document.getElementById("logo-footer").onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ============================================================
   PROGRESSO SALVO
   ============================================================ */
function getProgress(epId) {
  try {
    const data = JSON.parse(localStorage.getItem(`rezeroplus:progress:${epId}`) || "null");
    if (!data || !data.duration) return 0;
    return Math.round((data.current / data.duration) * 100);
  } catch { return 0; }
}

function byId(id) {
  return EPISODIOS.find((e) => e.id === id);
}

/* ============================================================
   HERO
   ============================================================ */
function renderHero() {
  document.title = `${SITE.nome || "Re:Zero+"} — ${SITE.titulo || ""}`;

  if (SITE.bannerUrl) $("#hero-bg").style.backgroundImage = `url('${SITE.bannerUrl}')`;
  $("#hero-title").textContent   = SITE.titulo  || "";
  $("#hero-ano").textContent     = SITE.ano     || "";
  $("#hero-temp").textContent    = SITE.temporadas
    ? `${SITE.temporadas} TEMPORADA${SITE.temporadas > 1 ? "S" : ""}` : "";
  $("#hero-qual").textContent    = SITE.qualidade || "";
  $("#hero-sinopse").textContent = SITE.sinopse   || "";

  if (SITE.textoBotaoAssistir) {
    $("#btn-assistir-texto").textContent = SITE.textoBotaoAssistir;
  }

  $("#btn-assistir").addEventListener("click", () => {
    if (!EPISODIOS.length) {
      alert("Nenhum episódio cadastrado ainda.");
      return;
    }
    const epRetomar = EPISODIOS.find(
      (e) => getProgress(e.id) > 5 && getProgress(e.id) < 95
    );
    const alvo = epRetomar || EPISODIOS[0];
    abrirPlayer(alvo.id);
  });
}

/* ============================================================
   CARDS
   ============================================================ */
function criarCard(ep, { mostrarProgresso = false } = {}) {
  const progresso = mostrarProgresso ? getProgress(ep.id) : 0;
  const card = document.createElement("div");
  card.className = "card";
  card.onclick = () => abrirPlayer(ep.id);

  const tagNovo = ep.novo ? `<div class="card-badge">Novo</div>` : "";
  const progressoHtml = mostrarProgresso && progresso > 0
    ? `<div class="card-progress"><span style="width:${progresso}%"></span></div>` : "";

  card.innerHTML = `
    <div class="card-thumb">
      ${ep.thumb ? `<img src="${ep.thumb}" alt="${ep.titulo}" loading="lazy">` : ""}
      ${tagNovo}
      <div class="play-icon">
        <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
      </div>
      <div class="card-duration">${ep.duracao} min</div>
      ${progressoHtml}
    </div>
    <div class="card-info">
      <div class="card-ep">T${ep.temporada}E${String(ep.episodio).padStart(2, "0")}</div>
      <div class="card-title">${ep.titulo}</div>
    </div>
  `;
  return card;
}

/* ============================================================
   LINHAS
   ============================================================ */
function renderContinuar() {
  const row = $("#row-continuar");
  row.innerHTML = "";
  const lista = EPISODIOS
    .filter((e) => getProgress(e.id) > 5 && getProgress(e.id) < 95);

  if (!lista.length) {
    $("#continuar-section").style.display = "none";
    return;
  }
  $("#continuar-section").style.display = "";
  lista.forEach((ep) => row.appendChild(criarCard(ep, { mostrarProgresso: true })));
}

function renderRecentes() {
  const row = $("#row-recentes");
  row.innerHTML = "";
  const lista = (typeof RECENTES !== "undefined" && RECENTES.length)
    ? RECENTES.map(byId).filter(Boolean)
    : [...EPISODIOS].slice(-6).reverse();

  if (!lista.length) {
    $("#recentes-section").style.display = "none";
    return;
  }
  $("#recentes-section").style.display = "";
  lista.forEach((ep) => row.appendChild(criarCard(ep)));
}

function renderCatalogo(filtro = "") {
  const grid = $("#grid-catalogo");
  grid.innerHTML = "";

  let lista = [...EPISODIOS].sort(
    (a, b) => a.temporada - b.temporada || a.episodio - b.episodio
  );

  if (filtro) {
    const q = filtro.toLowerCase().trim();
    lista = lista.filter((ep) => {
      const codigo = `t${ep.temporada}e${String(ep.episodio).padStart(2, "0")}`;
      return (
        (ep.titulo || "").toLowerCase().includes(q) ||
        (ep.sinopse || "").toLowerCase().includes(q) ||
        codigo.includes(q)
      );
    });
  }

  if (!lista.length && filtro) {
    grid.innerHTML = `
      <div class="busca-vazia" style="grid-column: 1/-1;">
        <div class="busca-vazia-icon">🔍</div>
        Nada encontrado para "<strong>${filtro}</strong>"
      </div>`;
    return;
  }
  if (!lista.length) {
    grid.innerHTML = `
      <div class="busca-vazia" style="grid-column: 1/-1;">
        <div class="busca-vazia-icon">🎬</div>
        Nenhum episódio cadastrado ainda.
      </div>`;
    return;
  }

  lista.forEach((ep) => grid.appendChild(criarCard(ep)));

  $("#catalogo-titulo").textContent = filtro
    ? `Resultados (${lista.length})`
    : "Catálogo Completo";
}

/* ============================================================
   SOBRE
   ============================================================ */
function renderSobre() {
  const sobre = SITE.sobre || "";
  if (!sobre.trim()) {
    $("#sobre-section").style.display = "none";
    return;
  }
  $("#sobre-section").style.display = "";

  /* Suporta quebras de linha e links simples */
  let html = sobre
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

  $("#sobre-conteudo").innerHTML = html;
}

/* ============================================================
   BUSCA
   ============================================================ */
function setupBusca() {
  const wrap  = $("#search-wrap");
  const btn   = $("#search-btn");
  const input = $("#search-input");

  btn.onclick = (e) => {
    e.stopPropagation();
    wrap.classList.toggle("open");
    if (wrap.classList.contains("open")) {
      input.focus();
    } else {
      input.value = "";
      renderCatalogo("");
    }
  };

  input.oninput = () => {
    const v = input.value;
    renderCatalogo(v);
    if (v) {
      /* Rola até o catálogo */
      $("#catalogo-section").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  /* Fecha ao clicar fora */
  document.addEventListener("click", (e) => {
    if (!wrap.contains(e.target) && !input.value) {
      wrap.classList.remove("open");
    }
  });

  input.onkeydown = (e) => {
    if (e.key === "Escape") {
      input.value = "";
      renderCatalogo("");
      wrap.classList.remove("open");
    }
  };
}

/* ============================================================
   NAVEGAÇÃO INTERNA (smooth scroll)
   ============================================================ */
function setupNav() {
  const map = {
    "nav-inicio":   "hero",
    "nav-catalogo": "catalogo-section",
    "nav-sobre":    "sobre-section",
  };

  Object.entries(map).forEach(([navId, secId]) => {
    const link = document.getElementById(navId);
    if (!link) return;
    link.onclick = (e) => {
      e.preventDefault();
      document.querySelectorAll("nav a").forEach(a => a.classList.remove("active"));
      link.classList.add("active");
      const sec = document.getElementById(secId);
      if (sec) sec.scrollIntoView({ behavior: "smooth", block: "start" });
    };
  });
}

function setupHeader() {
  const header = $("#header");
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 40);
  });
}

function abrirPlayer(epId) {
  window.location.href = `player.html?ep=${encodeURIComponent(epId)}`;
}

/* ============================================================
   INÍCIO
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  aplicarAparencia();
  renderLogo();
  renderHero();
  renderContinuar();
  renderRecentes();
  renderCatalogo();
  renderSobre();
  setupBusca();
  setupNav();
  setupHeader();
});
