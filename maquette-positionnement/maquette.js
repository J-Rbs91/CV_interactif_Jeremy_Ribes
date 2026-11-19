/* Maquette éditoriale du CV : navigation et animation fidèles au site existant. */
(function () {
  "use strict";
  const root = document.documentElement;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const nav = [...document.querySelectorAll(".s-nav-item")];
  const sections = ["profil","experience","outils","competences","projet","formation"]
    .map(id => document.getElementById(id)).filter(Boolean);

  function select(id) {
    for (const item of nav) {
      const chosen = item.getAttribute("href") === "#" + id;
      item.classList.toggle("active", chosen);
      if (chosen) item.setAttribute("aria-current", "location");
      else item.removeAttribute("aria-current");
    }
  }
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      const current = entries.filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (current) select(current.target.id);
    }, {rootMargin:"-20% 0px -65% 0px", threshold:[0,0.01,0.2]});
    sections.forEach(item => observer.observe(item));
    const hero = document.querySelector(".s-hero");
    if (hero) new IntersectionObserver(([entry]) =>
      root.classList.toggle("hero-off", !entry.isIntersecting)
    ).observe(hero);
  }
  select(location.hash.replace("#","") || "profil");

  const rail = document.querySelector(".s-nav");
  const refreshRail = () => {
    if (rail) rail.classList.toggle("is-end",rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 4);
  };
  rail?.addEventListener("scroll", refreshRail, {passive:true});
  window.addEventListener("resize",refreshRail,{passive:true});
  refreshRail();

  function refreshToggle(section) {
    const button = section.querySelector("[data-toggle-all]");
    const items = [...section.querySelectorAll("details.s-row")];
    if (!button || !items.length) return;
    const allOpen = items.every(item => item.open);
    button.textContent = allOpen ? "Tout fermer" : "Tout ouvrir";
    button.setAttribute("aria-pressed",String(allOpen));
  }
  document.querySelectorAll("[data-toggle-all]").forEach(button=>{
    const section = document.getElementById(button.dataset.toggleAll);
    if (!section) return;
    button.addEventListener("click",()=>{
      const rows = [...section.querySelectorAll("details.s-row")];
      const shouldOpen = rows.some(item=>!item.open);
      rows.forEach(item=>{item.open=shouldOpen});
      refreshToggle(section);
    });
    section.querySelectorAll("details.s-row").forEach(item=>
      item.addEventListener("toggle",()=>refreshToggle(section))
    );
  });

  const finalize = () => {
    root.classList.remove("intro-lock","intro-wait");
    root.classList.add("intro-done");
    try {sessionStorage.setItem("cv-intro-played","1")} catch (_) {}
  };
  if (root.classList.contains("intro-lock")) {
    const start=()=>{
      root.classList.remove("intro-wait");
      window.setTimeout(finalize,3300);
    };
    document.getElementById("skip")?.addEventListener("click",()=>{
      root.classList.add("intro-skipped");
      finalize();
    });
    Promise.race([
      document.fonts?.ready || Promise.resolve(),
      new Promise(resolve=>setTimeout(resolve,2200))
    ]).then(start);
  }

  window.addEventListener("beforeprint",()=>{
    document.querySelectorAll("details").forEach(item=>{
      item.dataset.printWasOpen=String(item.open); item.open=true;
    });
  });
  window.addEventListener("afterprint",()=>{
    document.querySelectorAll("details[data-print-was-open]").forEach(item=>{
      item.open=item.dataset.printWasOpen==="true";
      delete item.dataset.printWasOpen;
    });
  });
})();
