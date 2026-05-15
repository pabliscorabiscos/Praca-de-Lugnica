/* ============================================================
   DADOS DO SITE — Re:Zero+
   ============================================================

   ESTRUTURA DE ARQUIVOS RECOMENDADA:

     VÍDEOS  (.mp4) → GitHub Releases  (tag <video> não exige CORS)
     ÁUDIOS  (.aac) → GitHub Releases  (tag <audio> não exige CORS)
     LEGENDAS (.ass) → pasta legendas/  (fetch exige same-origin)

   ── Como funciona o sistema de áudio ──────────────────────────
   Campo "audioTracks": lista de faixas de áudio do episódio.

     • Faixa SEM "src" = usa o áudio do próprio vídeo (ex: JP original)
     • Faixa COM "src" = arquivo de áudio separado (.aac/.mp3/.m4a)
                         o vídeo é mutado e este arquivo toca em sincronia

   ── Como funciona o sistema de legendas ────────────────────────
   Campo "legendas": lista de faixas .ass na pasta legendas/.
   ============================================================ */

const SITE = {
  "nome":        "Re:Zero+",
  "titulo":      "Re:Zero — Starting Life in Another World",
  "ano":         2016,
  "temporadas":  2,
  "qualidade":   "FULL HD",
  "sinopse":     "Subaru Natsuki, um jovem hikikomori, é subitamente transportado para um mundo de fantasia. Lá, ele descobre que possui uma habilidade aterrorizante: morrer e retornar ao tempo.",
  "bannerUrl":   "",
  "logoEmoji":   "❄"
};

const EPISODIOS = [
  {
    "id":         "T1E01",
    "titulo":     "E01 - O Fim do Começo e o Começo do Fim",
    "temporada":  1,
    "episodio":   1,
    "duracao":    53,
    "thumb":      "https://i.imgur.com/Ozq1s06.jpeg",
    "sinopse":    "",
    "novo":       true,

    "sources": [
      {
        "quality": "1080p",
        "src":     "https://github.com/SEU-USUARIO/SEU-REPO/releases/download/v1.0/rezero-t1e01-1080p.mp4",
        "type":    "video/mp4"
      }
    ],

    "audioTracks": [
      {
        "label":   "Japonês (Original)",
        "lang":    "jp",
        "default": true
      },
      {
        "label":   "Português (Dublado)",
        "lang":    "pt",
        "src":     "https://github.com/SEU-USUARIO/SEU-REPO/releases/download/v1.0/rezero-t1e01-dub-pt.aac",
        "type":    "audio/aac"
      }
    ],

    "legendas": [
      {
        "label":   "Português",
        "lang":    "pt",
        "src":     "./legendas/rezero-t1e01-pt.ass",
        "default": true
      }
    ]
  }
];

const RECENTES = ["T1E01"];
