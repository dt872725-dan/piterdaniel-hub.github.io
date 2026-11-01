// ===== Réglages et corrections communes à tout le site =====
(function () {
  var SITE = {
    whatsapp: "243967811702",
    anciensNumeros: ["243898560667", "243970521444"],
    email: "piterdaniel604@gmail.com",
    urlIA: "" // adresse de ton Worker (étape IA). Laisse vide pour l'instant.
  };
  window.SITE = SITE;

  // 1. Remplace les anciens numéros dans les liens WhatsApp, même ceux créés plus tard
  function corriger(noeud) {
    if (!noeud || noeud.nodeType !== 1) return;
    var liens = [];
    if (noeud.matches && noeud.matches('a[href*="wa.me/"]')) liens.push(noeud);
    Array.prototype.forEach.call(noeud.querySelectorAll('a[href*="wa.me/"]'), function (a) { liens.push(a); });
    liens.forEach(function (a) {
      var h = a.getAttribute("href") || "";
      var nouveau = h;
      SITE.anciensNumeros.forEach(function (n) { nouveau = nouveau.split(n).join(SITE.whatsapp); });
      if (nouveau !== h) a.setAttribute("href", nouveau);
    });
  }
  corriger(document.body);
  new MutationObserver(function (lots) {
    lots.forEach(function (lot) {
      Array.prototype.forEach.call(lot.addedNodes, corriger);
    });
  }).observe(document.body, { childList: true, subtree: true });

  // 2. Menu (Tarifs, Payer) et pied de page, pages en français seulement
  if (document.documentElement.lang === "fr") {
    var menu = document.querySelector("header nav");
    if (menu) {
      var apropos = menu.querySelector('a[href="a-propos.html"]');
      [["tarifs.html", "Tarifs", false], ["paiement.html", "Payer", true]].forEach(function (x) {
        if (menu.querySelector('a[href="' + x[0] + '"]')) return;
        var l = document.createElement("a");
        l.href = x[0];
        l.textContent = x[2] ? "💳 " + x[1] : x[1];
        if (x[2]) l.style.cssText = "background:#ffa500;color:#111;font-weight:bold;";
        if (apropos) menu.insertBefore(l, apropos); else menu.appendChild(l);
      });
    }
    var pied = document.querySelector("footer");
    if (pied && !pied.querySelector('a[href="paiement.html"]')) {
      var p = document.createElement("p");
      [["tarifs.html", "Tarifs"], ["paiement.html", "Payer"]].forEach(function (x) {
        var l = document.createElement("a");
        l.href = x[0];
        l.textContent = x[1];
        p.appendChild(l);
      });
      pied.insertBefore(p, pied.firstChild);
    }
  }

  // 3. Assistant IA : se charge seulement si urlIA est rempli
  if (SITE.urlIA) {
    var s = document.createElement("script");
    s.src = "/ia.js";
    document.body.appendChild(s);
  }
})();
