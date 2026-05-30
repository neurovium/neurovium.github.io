/* Curated brand epigraphs — shown on the home hero. One picked at random
   each visit. Font size auto-scales by length (see hero-quote-class).

   Edit this list to add/remove quotes — it is the single source of truth
   for both preview/component-hero.html and ui_kits/website/Hero.jsx. */

window.QUOTES = [
  {
    text: "There is a fundamental error in separating the parts from the whole, the mistake of atomizing what should not be atomized. Unity and complementarity constitute reality.",
    who: "Werner Karl Heisenberg"
  },
  {
    text: "The irreversibility of time is the mechanism that brings order out of chaos.",
    who: "Ilya Prigogine"
  },
  {
    text: "A cloud is made of billows upon billows upon billows that look like clouds. As you come closer to a cloud you don't get something smooth, but irregularities at a smaller scale.",
    who: "Benoit Mandelbrot"
  },
  {
    text: "More is different.",
    who: "Philip Anderson"
  },
  {
    text: "The knowledge of anything, since all things have causes, is not acquired or complete unless it is known by its causes.",
    who: "Ibn Sina (Avicenna)"
  },
  {
    text: "In physics we have dealt hitherto only with periodic crystals.",
    who: "Erwin Schrödinger"
  },
  {
    text: "It is the harmony of the diverse parts, their symmetry, their happy balance; in a word it is all that introduces order, all that gives unity, that permits us to see clearly and to comprehend at once both the ensemble and the details.",
    who: "Henri Poincaré"
  },
  {
    text: "For it is the same whether you take it that the Earth is in motion or the Sky. For, in both the cases, it does not affect the Astronomical Science. It is just for the Physicist to see if it is possible to refute it.",
    who: "Abu-Rayhan Biruni"
  },
  {
    text: "Time forks perpetually toward innumerable futures.",
    who: "Jorge Luis Borges"
  },
  {
    text: "Calculemus! (Let us calculate!)",
    who: "Gottfried Wilhelm Leibniz"
  }
];

/* Return a CSS size class for a given quote, scaled to its character count.
   Buckets are tuned so each quote sits comfortably inside the hero's prose column. */
window.quoteSizeClass = function (text) {
  const n = text.length;
  if (n <= 30)  return "q--mega";   // "More is different."
  if (n <= 90)  return "q--lg";     // medium
  if (n <= 180) return "q--md";     // longer
  return "q--sm";                   // the Poincaré one
};

/* Stable random pick that varies per visit (uses Math.random — fresh each load). */
window.pickQuote = function () {
  const list = window.QUOTES;
  return list[Math.floor(Math.random() * list.length)];
};
