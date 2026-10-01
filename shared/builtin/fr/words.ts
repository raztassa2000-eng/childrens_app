import { N, cast, ep, q, sc, series } from "../dsl";

/** Written natively in French: rhymes and letters don't survive translation, so this one has its own words. */
export default series({
  id: "words.ziggys-rhyme-time-fr",
  language: "fr",
  category: "words",
  age: "3-5",
  title: "Les rimes de Ziggy",
  tagline: "Des rimes, des contraires et des lettres avec un zèbre qui adore les mots !",
  emoji: "🦓",
  cast: [
    cast("ziggy", "Ziggy", "🦓", "silly", "Un zèbre rayé qui adore les rimes."),
    cast("shelly", "Shelly", "🐢", "gentle", "Une tortue réfléchie qui adore les nouveaux mots."),
  ],
  episodes: [
    ep(
      "Chat, plat, rat !",
      "Les mots qui riment",
      "Ziggy et Shelly cherchent des mots qui se terminent par le même son.",
      [
        sc("stage", ["ziggy:dance:left", "shelly:bounce"], ["✨ air"], [
          N("C'est l'heure des rimes avec Ziggy et Shelly !"),
          ["ziggy", "Les mots qui riment finissent par le même son. Écoute !"],
        ]),
        sc("stage", ["ziggy:idle", "🐈:bounce"], ["🍽️ air"], [
          ["ziggy", "Un chat dans un plat ! Chat, plat. Ça rime !"],
        ], "chat, plat"),
        sc("stage", ["shelly:think", "🐀:bounce"], [], [
          ["shelly", "Rat rime aussi ! Chat, plat, rat."],
        ], "rat"),
        sc("pond", ["ziggy:jump", "🐸:bounce"], ["💧 air"], [
          ["ziggy", "Une grenouille qui se mouille ! Grenouille, mouille !"],
        ], "grenouille, mouille"),
        sc("meadow", ["shelly:bounce", "🐝:fly"], ["☀️ sky"], [
          ["shelly", "Une abeille au soleil ! Abeille, soleil !"],
        ], "abeille, soleil"),
        sc("stage", ["ziggy:dance", "shelly:dance"], [], [
          N("Trouves-tu un mot qui rime avec chien ?"),
          ["ziggy", "Chien, copain, câlin ! Bravo !"],
        ], "À toi !"),
        sc("night", ["ziggy:spin", "shelly:wiggle"], ["⭐ sky", "⛵ ground"], [
          ["shelly", "Une étoile qui met les voiles ! Étoile, voiles !"],
        ], "étoile, voiles"),
        sc("stage", ["ziggy:cheer", "shelly:cheer"], ["✨ air"], [
          N("Les mots qui riment finissent par le même son. Continue à écouter les rimes !"),
          ["ziggy", "Les rimes, c'est rigolo comme tout !"],
        ]),
      ],
      [
        q("Quel mot rime avec chat ?", ["Rat", "Chien", "Soleil"], 0, "Chat et rat finissent tous les deux par « a »."),
        q("Quel mot rime avec abeille ?", ["Soleil", "Tasse", "Ballon"], 0, "Abeille et soleil finissent par le même son."),
      ],
      "Les mots qui riment finissent par le même son, comme chat, plat et rat.",
    ),
    ep(
      "Grand et petit",
      "Les contraires",
      "Ziggy et Shelly jouent au jeu des contraires : grand et petit, chaud et froid, vite et lentement.",
      [
        sc("meadow", ["ziggy:bounce", "shelly:idle"], ["☀️ sky"], [
          N("Aujourd'hui, Ziggy et Shelly jouent au jeu des contraires !"),
          ["shelly", "Les contraires sont des mots qui veulent dire des choses complètement différentes."],
        ]),
        sc("meadow", ["🐘:walk", "ziggy:idle", "🐭:bounce"], [], [
          ["ziggy", "L'éléphant est grand. La souris est petite. Grand et petit sont des contraires !"],
        ], "Grand / Petit"),
        sc("meadow", ["ziggy:jump", "shelly:idle"], ["🎈 sky", "⚽ ground"], [
          N("Le ballon monte en haut. La balle tombe en bas."),
        ], "En haut / En bas"),
        sc("snow", ["ziggy:shiver", "shelly:shiver"], ["❄️ air"], [
          ["shelly", "La neige est froide. Brrr !"],
          ["ziggy", "Et la soupe est chaude. Chaud et froid sont des contraires !"],
        ], "Chaud / Froid"),
        sc("meadow", ["ziggy:run", "shelly:walk"], [], [
          N("Ziggy court vite. Shelly marche lentement."),
          ["shelly", "Lentement mais sûrement, c'est moi !"],
        ], "Vite / Lentement"),
        sc("home", ["ziggy:idle", "shelly:bounce"], [], [
          ["ziggy", "On ouvre la porte. On ferme la porte. Ouvert, fermé !"],
        ], "Ouvert / Fermé"),
        sc("meadow", ["ziggy:cheer", "shelly:idle"], [], [
          N("Un sourire, c'est joyeux. Une grimace, c'est triste. Sais-tu faire les deux têtes ?"),
        ], "Joyeux / Triste"),
        sc("meadow", ["ziggy:wave", "shelly:wave"], ["🌈 sky"], [
          ["ziggy", "Grand, petit. En haut, en bas. Chaud, froid. Vite, lentement !"],
          N("Il y a des contraires partout. Au revoir ! Ou plutôt, bonjour ?"),
        ]),
      ],
      [
        q("Quel est le contraire de grand ?", ["Petit", "Haut", "Bleu"], 0, "Grand et petit sont des contraires."),
        q("Quel est le contraire de chaud ?", ["Froid", "Mouillé", "Bruyant"], 0, "Chaud et froid sont des contraires."),
      ],
      "Les contraires sont des mots qui veulent dire des choses complètement différentes, comme grand et petit ou chaud et froid.",
    ),
    ep(
      "Le défilé de l'alphabet",
      "Les lettres de A à E",
      "Ziggy et Shelly défilent et apprennent les sons des lettres de A à E.",
      [
        sc("park", ["ziggy:dance", "shelly:bounce"], ["🎈 sky"], [
          N("Voici le défilé de l'alphabet !"),
          ["ziggy", "Chaque lettre a son propre son. En avant, marche !"],
        ]),
        sc("park", ["ziggy:walk", "shelly:idle"], ["🍍 air"], [
          N("A comme ananas. A, a, ananas !"),
        ], "A"),
        sc("park", ["🐻:bounce", "shelly:walk"], ["⚽ ground"], [
          ["shelly", "B comme ballon. Bbb, ballon !"],
        ], "B"),
        sc("park", ["🐈:walk", "ziggy:walk"], [], [
          ["ziggy", "C comme chat. Ch, ch, chat ! Miaou !"],
        ], "C"),
        sc("park", ["🐉:jump", "ziggy:bounce"], [], [
          N("D comme dragon. Ddd, dragon ! Grrr !"),
        ], "D"),
        sc("park", ["🐘:walk", "shelly:bounce"], ["⭐ air"], [
          ["shelly", "E comme éléphant et étoile. É, é, éléphant !"],
        ], "E"),
        sc("park", ["ziggy:dance", "shelly:dance"], ["🎵 air"], [
          N("Disons-les toutes ensemble : A, B, C, D, E !"),
        ], "A B C D E"),
        sc("park", ["ziggy:wave", "shelly:wave"], ["🌈 sky"], [
          ["ziggy", "Et Z comme Ziggy ! Mais ce sera pour un autre jour."],
          N("Par quelle lettre commence ton prénom ?"),
        ]),
      ],
      [
        q("Quel mot commence par B ?", ["Ballon", "Ananas", "Chat"], 0, "Ballon commence par le son « b » : B !"),
        q("A comme... ?", ["Ananas", "Dragon", "Étoile"], 0, "A comme ananas !"),
      ],
      "Chaque lettre a un son : A comme ananas, B comme ballon, C comme chat, D comme dragon et E comme éléphant.",
    ),
  ],
});
