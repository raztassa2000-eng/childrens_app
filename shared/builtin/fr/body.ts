import type { SeriesText } from "../localize";

export default {
  title: "Le club santé du Dr Panda",
  tagline: "De bonnes habitudes pour être fort et heureux !",
  cast: {
    panda: ["Dr Panda", "Une docteure sympathique qui rend les bonnes habitudes amusantes."],
    sam: ["Sam", "Un garçon qui apprend les bonnes habitudes."],
    toothy: ["Quenotte", "Une dent qui parle et qui adore être propre."],
  },
  episodes: [
    {
      title: "On brosse, on brosse !",
      topic: "Se brosser les dents",
      summary: "Quenotte montre à Sam pourquoi et comment se brosser les dents deux fois par jour.",
      takeaway: "Brosse-toi les dents deux fois par jour pendant deux minutes pour qu'elles restent fortes et brillantes.",
      scenes: [
        ["", "Bienvenue au club santé du Dr Panda !", "Bonjour, Sam ! Aujourd'hui, parlons des dents."],
        ["Quenotte !", "Coucou ! Je suis Quenotte. Je t'aide à mâcher ta nourriture !"],
        ["Les caries", "Trop de sucreries peuvent faire de petits trous dans les dents, qu'on appelle des caries.", "C'est pour ça qu'on prend soin de nos dents."],
        ["Deux fois par jour", "On se brosse les dents le matin et le soir."],
        ["Petits cercles", "On brosse, on brosse en petits cercles. Devant, au fond, toutes les dents !"],
        ["2 minutes", "Brosse pendant deux minutes. C'est la durée d'une chanson !", "La la la, on brosse, on brosse !"],
        ["Brillante !", "Je suis toute propre et brillante ! Merci, Sam !"],
        ["", "Brosse-toi les dents deux fois par jour pour qu'elles restent fortes !", "On brosse, on brosse, on brosse !"],
      ],
      quiz: [
        ["Combien de fois par jour faut-il se brosser les dents ?", ["Deux fois", "Jamais", "Dix fois"], "Le matin et le soir !"],
        ["Combien de temps faut-il se brosser les dents ?", ["Deux minutes", "Deux secondes", "Deux heures"], "Deux minutes, à peu près la durée d'une chanson."],
      ],
    },
    {
      title: "Mange un arc-en-ciel",
      topic: "Bien manger",
      summary: "Le Dr Panda aide Sam à remplir son assiette de fruits et légumes de toutes les couleurs.",
      takeaway: "Manger des fruits et des légumes de toutes les couleurs aide ton corps à devenir fort.",
      scenes: [
        ["", "C'est l'heure du déjeuner au club santé !", "Sam, faisons un arc-en-ciel dans ton assiette !"],
        ["Rouge", "Les aliments rouges comme les tomates et les fraises sont pleins de bonnes choses."],
        ["Orange", "Des carottes orange ! C'est bon pour mes yeux ?", "Oui ! Les carottes aident à garder des yeux en bonne santé."],
        ["Jaune", "Les bananes jaunes et le maïs te donnent de l'énergie pour jouer."],
        ["Vert", "Le brocoli vert t'aide à devenir grand et fort.", "Le brocoli ressemble à de petits arbres !"],
        ["Bleu et violet", "Les myrtilles et les raisins violets complètent notre arc-en-ciel !"],
        ["L'eau", "Et l'eau est la meilleure boisson pour ton corps."],
        ["", "J'ai mangé un arc-en-ciel aujourd'hui !", "Mange plein de couleurs chaque jour. Quelle couleur vas-tu manger ensuite ?"],
      ],
      quiz: [
        ["C'est quoi une assiette arc-en-ciel ?", ["Des aliments de toutes les couleurs", "Seulement des bonbons", "Une assiette vide"], "Manger plein de couleurs apporte plein de bonnes choses au corps."],
        ["Quelle est la meilleure boisson pour le corps ?", ["L'eau", "Le soda", "Le sirop"], "L'eau aide chaque partie du corps à fonctionner."],
      ],
    },
    {
      title: "Les super-pouvoirs du sommeil",
      topic: "Le sommeil",
      summary: "Sam ne veut pas aller au lit, jusqu'à ce que le Dr Panda lui explique les super-pouvoirs du sommeil.",
      takeaway: "Le sommeil est un super-pouvoir : il aide ton corps à grandir et ton cerveau à se souvenir.",
      scenes: [
        ["", "C'est le soir, et Sam ne veut pas aller au lit.", "Je n'ai pas sommeil ! Je veux encore jouer !"],
        ["Super-pouvoirs", "Tu savais que le sommeil te donne des super-pouvoirs ?", "Des super-pouvoirs ? C'est vrai ?"],
        ["On grandit !", "Pendant que tu dors, ton corps grandit et devient plus fort."],
        ["On retient !", "Et ton cerveau range ce que tu as appris aujourd'hui, comme dans un coffre au trésor."],
        ["Le rituel du soir", "D'abord un bain chaud, puis le pyjama, puis le brossage des dents."],
        ["L'histoire du soir", "Et une histoire !", "Puis on éteint la lumière, et un gros câlin."],
        ["10 heures", "Les enfants de ton âge ont besoin de beaucoup de sommeil, environ dix heures ou plus chaque nuit."],
        ["", "Bonne nuit, Sam. Fais de beaux rêves !", "Dors bien, et réveille-toi prêt pour l'aventure !"],
      ],
      quiz: [
        ["Que se passe-t-il quand tu dors ?", ["Ton corps grandit et ton cerveau se souvient", "Tes jouets se réveillent", "Rien du tout"], "Le sommeil aide le corps à grandir et le cerveau à se souvenir."],
        ["Qu'est-ce qui fait partie d'un bon rituel du soir ?", ["Bain, pyjama, dents et histoire", "Sauter sur le lit toute la nuit", "Jouer jusqu'au matin"], "Un rituel calme aide à s'endormir."],
      ],
    },
  ],
} satisfies SeriesText;
