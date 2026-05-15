/* ============================================================
   Re:Zero+  —  app.js  (home)
   ============================================================ */

const $ = (sel) => document.querySelector(sel);
const byId = (id) => EPISODIOS.find((e) => e.id === id);

/* Lê progresso salvo pelo player no localStorage */
function getProgress(epId) {
  try {
    const data = JSON.parse(localStorage.getItem(`rezeroplus:progress:${epId}`) || "null");
    if (!data || !data.duration) return 0;
    return Math.round((data.current / data.duration) * 100);
  } catch { return 0; }
}

/* ----------------- HERO ----------------- */
function renderHero() {
  if (SITE.bannerUrl) $("#hero-bg").style.backgroundImage = `url('${SITE.bannerUrl}')`;
  $("#hero-title").textContent = SITE.titulo;
  $("#hero-ano").textContent   = SITE.ano;
  $("#hero-temp").textContent  = `${SITE.temporadas} TEMPORADA${SITE.temporadas > 1 ? "S" : ""}`;
  $("#hero-qual").textContent  = SITE.qualidade;
  $("#hero-sinopse").textContent = SITE.sinopse;
  document.title = `${SITE.nome} — ${SITE.titulo}`;

  $("#btn-assistir").addEventListener("click", () => {
    /* Se houver progresso, retoma o último ep visto. Senão, primeiro */
    const epRetomar = EPISODIOS.find((e) => getProgress(e.id) > 5 && getProgress(e.id) < 95);
    const alvo = epRetomar || EPISODIOS[0];
    if (alvo) abrirPlayer(alvo.id);
  });
}

/* ----------------- CARD ----------------- */
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

/* ----------------- LINHAS ----------------- */
function renderContinuar() {
  const row = $("#row-continuar");
  const ids = EPISODIOS
    .filter((e) => getProgress(e.id) > 5 && getProgress(e.id) < 95)
    .map((e) => e.id);

  if (!ids.length) {
    $("#continuar-section").style.display = "none";
    return;
  }
  ids.forEach((id) => {
    const ep = byId(id);
    if (ep) row.appendChild(criarCard(ep, { mostrarProgresso: true }));
  });
}

function renderRecentes() {
  const row = $("#row-recentes");
  const lista = (typeof RECENTES !== "undefined" && RECENTES.length) ? RECENTES : EPISODIOS.slice(-6).map((e) => e.id);
  lista.forEach((id) => {
    const ep = byId(id);
    if (ep) row.appendChild(criarCard(ep));
  });
}

function renderCatalogo() {
  const grid = $("#grid-catalogo");
  EPISODIOS.forEach((ep) => grid.appendChild(criarCard(ep)));
}

function abrirPlayer(epId) {
  window.location.href = `player.html?ep=${encodeURIComponent(epId)}`;
}

function setupHeader() {
  const header = $("#header");
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 40);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderHero();
  renderContinuar();
  renderRecentes();
  renderCatalogo();
  setupHeader();
});
