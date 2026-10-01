import type { SeriesText } from "../localize";

export default {
  title: "Les grandes émotions de Benny",
  tagline: "Les grandes émotions, c'est normal. Apprenons quoi en faire !",
  cast: {
    benny: ["Benny", "Un ourson câlin aux très grandes émotions."],
    lulu: ["Lulu", "Une koala calme qui connaît plein d'astuces pour les émotions."],
  },
  episodes: [
    {
      title: "Benny est grognon",
      topic: "La colère",
      summary: "Quand sa tour de cubes tombe, Benny est en colère, et Lulu lui apprend une astuce pour respirer calmement.",
      takeaway: "C'est normal d'être en colère. Respirer lentement aide notre corps à se calmer.",
      scenes: [
        ["", "Benny l'ourson construit une grande tour de cubes.", "Regardez comme ma tour est haute !"],
        ["Patatras !", "Oh non ! La tour tombe. Patatras !", "Grrr ! Je suis trop fâché !"],
        ["En colère", "Ton visage est tout rouge et tes pattes sont serrées. Tu es en colère ?", "Oui ! Je suis super en colère !"],
        ["Sens la fleur", "Essayons une astuce pour se calmer. Sens la fleur. Inspire doucement.", "On inspire par le nez. Mmm."],
        ["Souffle les bougies", "Maintenant, souffle les bougies d'anniversaire. Expire doucement.", "Fffff. Recommençons ensemble. On inspire, on expire."],
        ["", "Je me sens plus calme maintenant. Mes pattes sont toutes douces.", "La colère, c'est normal. On peut aider notre corps à se calmer."],
        ["", "Reconstruisons la tour, ensemble !", "Cette fois, ils font une base large pour qu'elle tienne bien."],
        ["On inspire, on expire", "Quand tu es en colère, sens la fleur et souffle les bougies.", "Essaie avec moi ! On inspire, on expire."],
      ],
      quiz: [
        ["Comment Benny s'est-il senti quand sa tour est tombée ?", ["En colère", "Fatigué", "Affamé"], "Benny était en colère quand sa tour s'est écroulée."],
        ["Qu'est-ce qui nous aide à nous calmer ?", ["Respirer lentement", "Crier", "Donner des coups de pied"], "Respirer lentement aide notre corps à se calmer."],
      ],
    },
    {
      title: "C'est normal d'être triste",
      topic: "La tristesse",
      summary: "Le ballon de Benny s'envole, et Lulu lui montre qu'on peut partager sa tristesse.",
      takeaway: "Tout le monde est triste parfois. Parler et faire un câlin peuvent nous aider à aller mieux.",
      scenes: [
        ["", "Benny a un beau ballon rouge et brillant.", "Mon ballon, c'est ce que je préfère !"],
        ["Fiouuu !", "Fiouuu ! Le vent emporte le ballon, haut, haut dans le ciel.", "Reviens, ballon !"],
        ["Triste", "Les yeux de Benny se remplissent de larmes.", "Je suis triste. J'ai le cœur tout lourd."],
        ["", "C'est normal d'être triste, Benny. Tout le monde est triste parfois.", "Même toi ?"],
        ["", "Oui ! J'étais triste quand mon amie a déménagé. En parler m'a aidée."],
        ["Un gros câlin", "Tu veux un câlin ?", "Un gros câlin bien chaud aide Benny à se sentir un peu mieux."],
        ["", "Peut-être qu'un oiseau verra mon ballon tout là-haut.", "Quelle jolie idée !"],
        ["", "La tristesse ne dure pas toujours. En parler à un adulte ou à un ami peut aider.", "Merci de m'avoir écouté, Lulu."],
      ],
      quiz: [
        ["Pourquoi Benny était-il triste ?", ["Son ballon s'est envolé", "Il a reçu un cadeau", "Il a mangé"], "Le vent a emporté le ballon de Benny."],
        ["Qu'est-ce qui peut aider quand on est triste ?", ["Parler et faire des câlins", "Se cacher pour toujours", "Casser ses jouets"], "Parler à quelqu'un et faire un câlin peut aider."],
      ],
    },
    {
      title: "Benny le courageux",
      topic: "La peur",
      summary: "À l'heure du coucher, Benny a peur du noir, et découvre qu'être courageux, c'est essayer même quand on a peur.",
      takeaway: "C'est normal d'avoir peur. Être courageux, c'est essayer même quand on a peur.",
      scenes: [
        ["", "C'est l'heure de dormir chez Benny.", "Lulu, la chambre est toute noire. J'ai peur."],
        ["Peur", "C'est normal d'avoir peur. Être courageux, c'est essayer, même quand on a peur."],
        ["Crrr !", "Crrr ! Un bruit vient de la fenêtre.", "C'était quoi, ça ?"],
        ["Juste le vent", "Regardons ensemble. C'est juste le vent qui fait bouger les branches.", "Oh ! C'est seulement le vent."],
        ["Veilleuse", "Une petite veilleuse rend ta chambre toute douce."],
        ["", "Et mon nounours peut me tenir compagnie !", "Benny respire profondément et se sent un peu plus courageux."],
        ["Courageux !", "Tu as réussi, Benny ! Tu as été courageux.", "C'est bon d'être courageux !"],
        ["", "Bonne nuit, Benny. Bonne nuit, Lulu. Toi aussi, tu peux être courageux !"],
      ],
      quiz: [
        ["Qu'est-ce qui faisait ce bruit ?", ["Le vent dans l'arbre", "Un hippopotame qui danse", "Un camion bruyant"], "C'était juste le vent qui faisait bouger les branches."],
        ["Que veut dire être courageux ?", ["Essayer même quand on a peur", "Ne jamais avoir peur", "Crier très fort"], "Être courageux, c'est essayer même si on a peur."],
      ],
    },
  ],
} satisfies SeriesText;
