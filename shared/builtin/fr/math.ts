import type { SeriesText } from "../localize";

export default {
  title: "Le jardin à compter de Coco",
  tagline: "Compte, additionne et trouve des formes avec une lapine bondissante !",
  cast: {
    coco: ["Coco", "Une lapine bondissante qui adore tout compter."],
    pip: ["Pip", "Un tout petit poussin qui apprend les nombres."],
  },
  episodes: [
    {
      title: "Cinq petites carottes",
      topic: "Compter jusqu'à cinq",
      summary: "Coco et Pip comptent les carottes du jardin, jusqu'à cinq.",
      takeaway: "On peut compter les choses une par une : un, deux, trois, quatre, cinq !",
      scenes: [
        ["", "Bienvenue dans le jardin à compter de Coco !", "Salut ! Je suis Coco. J'adore compter !", "Piou ! Je suis Pip. On compte ensemble ?"],
        ["", "Regarde, Pip ! Des carottes poussent dans mon jardin.", "Combien de carottes il y a ?"],
        ["1", "Comptons-les ! Une carotte.", "Une ! Tu peux lever un doigt ?"],
        ["1, 2", "Voici une autre carotte. Un, deux !", "Deux carottes ! Piou, piou !"],
        ["1, 2, 3", "Un, deux, trois carottes !", "Trois ! Lève trois doigts !"],
        ["1, 2, 3, 4", "Quatre carottes ! Comptons : un, deux, trois, quatre.", "Quatre ! On devient super forts !"],
        ["5 !", "Et une de plus, ça fait cinq ! Un, deux, trois, quatre, cinq !", "Cinq carottes ! Comme une main entière !"],
        ["", "On a compté jusqu'à cinq ! Bravo !", "Ce soir, compte tes doigts : un, deux, trois, quatre, cinq !"],
      ],
      quiz: [
        ["Combien de carottes Coco a-t-elle trouvées à la fin ?", ["Cinq", "Deux", "Dix"], "Coco et Pip ont compté cinq carottes, une pour chaque doigt !"],
        ["Quel nombre vient après trois ?", ["Quatre", "Un", "Sept"], "Un, deux, trois, quatre ! Quatre vient après trois."],
      ],
    },
    {
      title: "La chasse aux formes",
      topic: "Cercles, carrés et triangles",
      summary: "Coco et Pip cherchent des cercles, des carrés et des triangles tout autour d'eux.",
      takeaway: "Un cercle est rond, un carré a quatre côtés égaux et un triangle a trois côtés.",
      scenes: [
        ["", "Aujourd'hui, Coco et Pip partent à la chasse aux formes !", "Les formes sont partout. Trouvons-les !"],
        ["Cercle", "Regarde en haut ! Le soleil est rond comme un cercle.", "Un cercle est rond, rond, rond, sans aucun coin."],
        ["Cercle", "Mon ballon est un cercle aussi ! Il roule et il roule.", "Roule, roule, roule !"],
        ["Carré", "Un carré a quatre côtés, tous de la même taille.", "La fenêtre est un carré ! Un, deux, trois, quatre côtés."],
        ["Carré", "Cette boîte cadeau a des côtés carrés aussi !", "Carré, carré, partout !"],
        ["Triangle", "Un triangle a trois côtés et trois coins pointus.", "La tente est un triangle ! Comme une part de pizza !"],
        ["3 coins", "Dessinons un triangle dans l'air. En haut, en bas, en travers !", "Un, deux, trois coins !"],
        ["", "Des cercles, des carrés et des triangles. Les formes sont partout !", "Quelles formes trouves-tu à la maison ?"],
      ],
      quiz: [
        ["Quelle forme est ronde, sans coins ?", ["Le cercle", "Le carré", "Le triangle"], "Un cercle est rond et n'a aucun coin."],
        ["Combien de côtés a un triangle ?", ["Trois", "Cinq", "Un"], "Un triangle a trois côtés et trois coins."],
      ],
    },
    {
      title: "Encore un, s'il te plaît !",
      topic: "Ajouter un",
      summary: "Pendant un pique-nique, Coco et Pip découvrent qu'en ajoutant un, le nombre augmente de un.",
      takeaway: "Quand on ajoute un, le nombre augmente de un. Deux plus un, ça fait trois !",
      scenes: [
        ["", "Coco fait un pique-nique avec ses amis.", "J'ai deux pommes pour notre pique-nique."],
        ["2", "Deux pommes pour deux amis. Miam !", "Mais attends. Qui arrive en se dandinant ?"],
        ["", "Coin, coin ! Petit Canard veut venir au pique-nique.", "Bienvenue, Petit Canard ! Il nous faut une pomme de plus."],
        ["", "Coco trouve une pomme sous l'arbre. Plop !", "Une pomme de plus !"],
        ["2 + 1 = 3", "Deux pommes et une de plus, ça fait trois !", "Deux plus un égale trois."],
        ["3", "Trois amis et trois pommes. Croc, croc !"],
        ["3 + 1 = 4", "Essayons avec des fraises. Trois fraises et une de plus ?", "Quatre fraises ! Une de plus fait grandir le nombre !"],
        ["", "Quand on ajoute un, on compte un de plus !", "Tu peux ajouter un jouet de plus à ta pile ?"],
      ],
      quiz: [
        ["Coco avait deux pommes et en a trouvé une de plus. Combien maintenant ?", ["Trois", "Deux", "Cinq"], "Deux plus un égale trois !"],
        ["Que se passe-t-il quand on ajoute un ?", ["Le nombre grandit", "Le nombre rapetisse", "Rien ne change"], "Ajouter un fait augmenter le nombre de un."],
      ],
    },
  ],
} satisfies SeriesText;
