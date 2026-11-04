(function () {
  // ===== Réglages (tu peux les modifier) =====
  var NUMERO_WHATSAPP = "243967811702";
  var voixActive = true;
  var NOM = "Assistant Rwagaza Tech";

  // ===== Connaissances : ajoute tes propres sujets ici =====
  var sujets = [
    { mots: ["bonjour", "salut", "hello", "bonsoir", "coucou", "hey"],
      texte: "Bonjour ! Je suis l'assistant de Rwagaza Tech Solution. Je peux te parler des projets, des leçons, des outils, de Daniel ou de comment le contacter." },
    { mots: ["aide", "aider", "help", "que peux", "quoi faire", "possible"],
      texte: "Je peux t'orienter sur le site : les projets, les leçons pour apprendre, les outils gratuits, la galerie, le profil de Daniel, ou le contact. Pose-moi ta question." },
    { mots: ["projet", "realisation", "travail", "portfolio", "oeuvre"],
      texte: "Tu peux découvrir mes projets sur la page Projets.", lien: "projets.html", nom: "Voir les projets" },
    { mots: ["apprendre", "cours", "tutoriel", "article", "formation", "debutant", "etudier", "lecon"],
      texte: "Les 65 leçons pour débutants sont sur la page Apprendre, avec recherche et filtres.", lien: "apprendre.html", nom: "Aller à Apprendre" },
    { mots: ["outil", "mot de passe", "password", "convertisseur", "octet", "masque", "cidr", "calculatrice", "generateur", "bloc-notes", "notes"],
      texte: "Les outils gratuits : mot de passe, convertisseur d'octets, calculatrice réseau, calculatrice, bloc-notes et convertisseur de texte.", lien: "outils.html", nom: "Ouvrir les outils" },
    { mots: ["galerie", "image", "infographie", "schema"],
      texte: "La galerie rassemble des infographies sur l'IA, le web, Linux, les langages et la sécurité.", lien: "galerie.html", nom: "Ouvrir la galerie" },
    { mots: ["serveur", "dns", "proxy", "base de donnees", "hebergement"],
      texte: "J'explique les neuf types de serveurs : base de données, fichiers, DNS, application, impression, mail, web, proxy et jeux. Tu les trouves dans les leçons.", lien: "apprendre.html?q=serveur", nom: "Voir les leçons sur les serveurs" },
    { mots: ["algorithme", "programmation", "code", "developpeur", "programmer", "coder"],
      texte: "Mon article Maîtrise algorithme, la programmation et le code explique tout, de débutant à développeur.", lien: "article1.html", nom: "Lire l'article" },
    { mots: ["reseau", "wifi", "routeur", "lan", "wan", "internet"],
      texte: "Le réseau informatique fait partie des sujets du site. Tu peux lire les leçons et utiliser la calculatrice réseau.", lien: "apprendre.html?q=reseau", nom: "Voir les leçons réseau" },
    { mots: ["site", "creation", "creer", "web", "html", "css", "application"],
      texte: "Je crée des sites web simples, rapides et lisibles sur téléphone. Écris à Daniel sur WhatsApp pour en parler.", lien: "https://wa.me/" + NUMERO_WHATSAPP, nom: "Discuter sur WhatsApp" },
    { mots: ["prix", "tarif", "devis", "cout", "combien", "payer"],
      texte: "Les tarifs de départ sont sur la page Tarifs. Pour un devis précis, parles-en directement avec Daniel sur WhatsApp.", lien: "tarifs.html", nom: "Voir les tarifs" },
    { mots: ["qui", "daniel", "propos", "fondateur", "presentation", "createur"],
      texte: "Daniel est le fondateur de Rwagaza Tech Solution. Son profil est sur la page À propos.", lien: "a-propos.html", nom: "Voir À propos" },
    { mots: ["contact", "contacter", "whatsapp", "mail", "email", "facebook", "joindre", "numero", "appeler"],
      texte: "Le moyen le plus rapide de joindre Daniel est WhatsApp. Tu peux aussi utiliser le formulaire de contact.", lien: "https://wa.me/" + NUMERO_WHATSAPP, nom: "Ouvrir WhatsApp" },
    { mots: ["merci", "super", "parfait", "genial", "bravo"],
      texte: "Avec plaisir ! N'hésite pas si tu as d'autres questions." },
    { mots: ["au revoir", "bye", "a bientot", "salut a"],
      texte: "À bientôt sur Rwagaza Tech Solution !" }
  ];
  var defaut = "Je n'ai pas bien compris, mais je peux t'aider sur les projets, les leçons, les outils, Daniel ou le contact. Tu peux aussi écrire directement à Daniel.";

  function normaliser(t) {
    return t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  // ===== Voix : l'assistant parle =====
  var synthese = ("speechSynthesis" in window) ? window.speechSynthesis : null;

  function parler(texte) {
    if (!voixActive || !synthese) return;
    synthese.cancel();
    var u = new SpeechSynthesisUtterance(texte);
    u.lang = "fr-FR";
    u.rate = 1;
    var voix = synthese.getVoices().filter(function (v) {
      return v.lang && v.lang.toLowerCase().indexOf("fr") === 0;
    });
    if (voix.length) u.voice = voix[0];
    synthese.speak(u);
  }

  // ===== Voix : l'utilisateur parle =====
  var Reconnaissance = window.SpeechRecognition || window.webkitSpeechRecognition;
  var micro = null;
  if (Reconnaissance) {
    micro = new Reconnaissance();
    micro.lang = "fr-FR";
    micro.interimResults = false;
    micro.maxAlternatives = 1;
  }

  // ===== Style =====
  var css = document.createElement("style");
  css.textContent = `
    .ia-bouton{position:fixed;left:16px;bottom:16px;z-index:60;background:#ffa500;color:#111;border:0;font-weight:bold;padding:12px 18px;border-radius:30px;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.5)}
    .ia-panneau{position:fixed;left:16px;bottom:72px;z-index:60;width:min(360px,calc(100% - 32px));max-height:70vh;display:none;flex-direction:column;background:#1a1a1c;border:1px solid #ffa500;border-radius:14px;overflow:hidden}
    .ia-panneau.ouvert{display:flex}
    .ia-titre{background:#ffa500;color:#111;font-weight:bold;padding:10px 14px;display:flex;justify-content:space-between;align-items:center}
    .ia-outils button{background:transparent;border:0;font-size:1.1rem;cursor:pointer;margin-left:8px}
    .ia-messages{padding:12px;overflow-y:auto;flex:1;font-size:.95rem}
    .ia-msg{margin:6px 0;padding:8px 12px;border-radius:12px;max-width:90%;line-height:1.4}
    .ia-bot{background:#2b2b2e;color:#f2f2f2}
    .ia-moi{background:#ffa500;color:#111;margin-left:auto}
    .ia-choix{display:flex;flex-wrap:wrap;gap:6px;padding:0 12px 8px}
    .ia-choix button{background:transparent;color:#ffa500;border:1px solid #ffa500;border-radius:16px;padding:4px 10px;cursor:pointer}
    .ia-saisie{display:flex;border-top:1px solid #2b2b2e}
    .ia-saisie input{flex:1;background:#0c0c0d;color:#fff;border:0;padding:12px;font-size:1rem;min-width:0}
    .ia-saisie button{background:#ffa500;border:0;padding:0 14px;font-weight:bold;cursor:pointer}
    .ia-saisie .ia-micro{background:#2b2b2e;color:#fff;font-size:1.1rem}
    .ia-saisie .ia-micro.ecoute{background:#d93025;animation:ia-pouls 1s infinite}
    @keyframes ia-pouls{50%{opacity:.5}}
    .haut{position:fixed;right:16px;bottom:76px;z-index:60;width:44px;height:44px;border-radius:50%;border:1px solid #ffa500;background:#1a1a1c;color:#ffa500;font-size:1.3rem;cursor:pointer;display:none}
    .haut.visible{display:block}
    .progres{position:fixed;top:0;left:0;height:3px;width:0;background:#ffa500;z-index:300}
  `;
  document.head.appendChild(css);

  // ===== Construction de la fenêtre =====
  var bouton = document.createElement("button");
  bouton.className = "ia-bouton";
  bouton.textContent = "🤖 Assistant";
  bouton.setAttribute("aria-label", "Ouvrir l'assistant");

  var panneau = document.createElement("div");
  panneau.className = "ia-panneau";

  var titre = document.createElement("div");
  titre.className = "ia-titre";
  var titreTexte = document.createElement("div");
  titreTexte.textContent = NOM;
  var outils = document.createElement("div");
  outils.className = "ia-outils";
  var boutonVoix = document.createElement("button");
  boutonVoix.setAttribute("aria-label", "Activer ou couper la voix");
  var fermer = document.createElement("button");
  fermer.textContent = "✕";
  fermer.setAttribute("aria-label", "Fermer l'assistant");
  outils.appendChild(boutonVoix);
  outils.appendChild(fermer);
  titre.appendChild(titreTexte);
  titre.appendChild(outils);

  var messages = document.createElement("div");
  messages.className = "ia-messages";
  messages.setAttribute("aria-live", "polite");

  var choix = document.createElement("div");
  choix.className = "ia-choix";

  var saisie = document.createElement("div");
  saisie.className = "ia-saisie";
  var champ = document.createElement("input");
  champ.placeholder = "Écris ou parle...";
  var boutonMicro = document.createElement("button");
  boutonMicro.className = "ia-micro";
  boutonMicro.textContent = "🎤";
  boutonMicro.setAttribute("aria-label", "Parler à l'assistant");
  var envoyer = document.createElement("button");
  envoyer.textContent = "OK";
  if (micro) saisie.appendChild(boutonMicro);
  saisie.appendChild(champ);
  saisie.appendChild(envoyer);

  panneau.appendChild(titre);
  panneau.appendChild(messages);
  panneau.appendChild(choix);
  panneau.appendChild(saisie);
  document.body.appendChild(panneau);
  document.body.appendChild(bouton);

  function majBoutonVoix() {
    boutonVoix.textContent = voixActive ? "🔊" : "🔇";
  }
  majBoutonVoix();
  if (!synthese) boutonVoix.style.display = "none";

  // ===== Messages =====
  function ajouter(texte, classe, lien, nom) {
    var m = document.createElement("div");
    m.className = "ia-msg " + classe;
    m.textContent = texte;
    if (lien) {
      m.appendChild(document.createElement("br"));
      var a = document.createElement("a");
      a.href = lien;
      a.textContent = nom;
      a.style.color = "#ffa500";
      if (lien.indexOf("http") === 0) { a.target = "_blank"; a.rel = "noopener"; }
      m.appendChild(a);
    }
    messages.appendChild(m);
    messages.scrollTop = messages.scrollHeight;
    return m;
  }

  function meilleureReponse(question) {
    var q = normaliser(question);
    var meilleur = null;
    var score = 0;
    sujets.forEach(function (s) {
      var n = 0;
      s.mots.forEach(function (mot) {
        if (q.indexOf(normaliser(mot)) !== -1) n++;
      });
      if (n > score) { score = n; meilleur = s; }
    });
    return meilleur;
  }

  function poser(texte) {
    if (!texte.trim()) return;
    ajouter(texte, "ia-moi");
    champ.value = "";
    var attente = ajouter("...", "ia-bot");
    setTimeout(function () {
      messages.removeChild(attente);
      var r = meilleureReponse(texte);
      if (r) {
        ajouter(r.texte, "ia-bot", r.lien, r.nom);
        parler(r.texte);
      } else {
        ajouter(defaut, "ia-bot", "https://wa.me/" + NUMERO_WHATSAPP, "Écrire à Daniel");
        parler(defaut);
      }
    }, 500);
  }

  // ===== Actions =====
  ["Projets", "Apprendre", "Outils", "Galerie", "Qui est Daniel ?", "Contact"].forEach(function (t) {
    var b = document.createElement("button");
    b.textContent = t;
    b.onclick = function () { poser(t); };
    choix.appendChild(b);
  });

  envoyer.onclick = function () { poser(champ.value); };
  champ.onkeydown = function (e) { if (e.key === "Enter") poser(champ.value); };

  boutonVoix.onclick = function () {
    voixActive = !voixActive;
    if (!voixActive && synthese) synthese.cancel();
    majBoutonVoix();
  };

  if (micro) {
    boutonMicro.onclick = function () {
      if (synthese) synthese.cancel();
      try {
        micro.start();
        boutonMicro.classList.add("ecoute");
        champ.placeholder = "Je t'écoute...";
      } catch (e) { /* déjà en écoute */ }
    };
    micro.onresult = function (e) {
      poser(e.results[0][0].transcript);
    };
    micro.onerror = function () {
      ajouter("Je n'ai pas pu utiliser le micro. Vérifie l'autorisation du micro dans Chrome, ou écris ta question.", "ia-bot");
    };
    micro.onend = function () {
      boutonMicro.classList.remove("ecoute");
      champ.placeholder = "Écris ou parle...";
    };
  }

  bouton.onclick = function () { panneau.classList.toggle("ouvert"); };
  fermer.onclick = function () {
    panneau.classList.remove("ouvert");
    if (synthese) synthese.cancel();
  };

  ajouter("Bonjour ! Je suis l'assistant du site. Écris ta question ou appuie sur le micro pour me parler.", "ia-bot");

  // ===== Lien « Outils » ajouté au menu de toutes les pages =====
  var menu = document.querySelector("header nav");
  if (menu && !menu.querySelector('a[href="outils.html"]')) {
    var lienOutils = document.createElement("a");
    lienOutils.href = "outils.html";
    lienOutils.textContent = "Outils";
    var apropos = menu.querySelector('a[href="a-propos.html"]');
    if (apropos) menu.insertBefore(lienOutils, apropos);
    else menu.appendChild(lienOutils);
  }

  // ===== Bouton « Retour en haut » et barre de progression =====
  var haut = document.createElement("button");
  haut.className = "haut";
  haut.textContent = "↑";
  haut.setAttribute("aria-label", "Retour en haut de la page");
  haut.onclick = function () { window.scrollTo({ top: 0, behavior: "smooth" }); };
  document.body.appendChild(haut);

  var progres = document.createElement("div");
  progres.className = "progres";
  document.body.appendChild(progres);

  function majScroll() {
    var h = document.documentElement;
    var total = h.scrollHeight - h.clientHeight;
    var pct = total > 0 ? (h.scrollTop / total) * 100 : 0;
    progres.style.width = pct + "%";
    if (h.scrollTop > 500) haut.classList.add("visible");
    else haut.classList.remove("visible");
  }
  window.addEventListener("scroll", majScroll, { passive: true });
  majScroll();
})();

// ===== Mode clair / sombre =====
(function () {
  var CLE = "theme-rwagaza";
  function lire() {
    try { return localStorage.getItem(CLE); } catch (e) { return null; }
  }
  function ecrire(v) {
    try { localStorage.setItem(CLE, v); } catch (e) {}
  }
  var theme = lire() === "clair" ? "clair" : "sombre";

  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = "theme-btn";

  function appliquer(t) {
    document.documentElement.setAttribute("data-theme", t);
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute("content", t === "clair" ? "#f5f5f7" : "#0c0c0d");
    btn.textContent = t === "clair" ? "🌙" : "☀️";
    btn.setAttribute("aria-label", t === "clair" ? "Passer en mode sombre" : "Passer en mode clair");
  }

  btn.onclick = function () {
    theme = theme === "clair" ? "sombre" : "clair";
    ecrire(theme);
    appliquer(theme);
  };

  var entete = document.querySelector("header");
  if (entete) entete.appendChild(btn);
  appliquer(theme);
})();

// ===== Réglages communs du site (menu Tarifs, Payer, assistant IA) =====
(function () {
  if (document.querySelector('script[src$="site.js"]')) return;
  var s = document.createElement("script");
  s.src = "/site.js";
  document.body.appendChild(s);
})();
