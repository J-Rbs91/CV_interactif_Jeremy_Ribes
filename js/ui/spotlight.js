/* La lumière sous le pointeur (css/aurora.css, § « La lumière »).

   La tache suit la souris à l'intérieur de la carte : on n'écrit que deux
   propriétés, `--mx` et `--my`, et le CSS dessine. Une écriture par image au
   plus (`requestAnimationFrame`) — le pointeur émet bien plus d'évènements que
   l'écran n'a d'images, et chacun recalculerait un style pour rien.

   Souris seulement, et seulement là où le survol existe : au doigt il n'y a
   pas de pointeur à suivre, et l'origine d'un toucher posée au hasard ne
   dirait rien. Le CSS applique la même condition ; elle est répétée ici pour
   ne pas poser d'écouteur qui ne servirait jamais. */
const CARDS =
  ".content-body :is(.card, .card-sm, .comp-card, .formation-card), .mobile-main :is(.card, .card-sm, .comp-card, .formation-card)";

export function bindSpotlight() {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    return;
  }

  document.querySelectorAll(CARDS).forEach((card) => {
    let frame = 0;

    card.addEventListener("pointermove", (event) => {
      if (frame) {
        return;
      }

      frame = window.requestAnimationFrame(() => {
        frame = 0;

        const box = card.getBoundingClientRect();

        card.style.setProperty("--mx", `${Math.round(event.clientX - box.left)}px`);
        card.style.setProperty("--my", `${Math.round(event.clientY - box.top)}px`);
      });
    });
  });
}
