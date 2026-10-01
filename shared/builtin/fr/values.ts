import type { SeriesText } from "../localize";

export default {
  title: "Le jardin de la gentillesse",
  tagline: "Petites bêtes, grand cœur !",
  cast: {
    bea: ["Béa", "Une petite abeille très occupée qui adore aider."],
    dot: ["Pois", "Une coccinelle timide qui apprend à être une bonne amie."],
    gus: ["Gus", "Un escargot lent et gentil."],
  },
  episodes: [
    {
      title: "Partager, c'est aimer",
      topic: "Le partage",
      summary: "Pois trouve plein de baies et découvre comme c'est bon de partager avec Gus qui a faim.",
      takeaway: "Partager, c'est aimer. Quand on partage, tout le monde peut être heureux.",
      scenes: [
        ["", "Bienvenue au jardin de la gentillesse !", "Bzz, bzz ! Je suis Béa. La gentillesse fait pousser notre jardin !"],
        ["", "Regardez ! J'ai trouvé plein de bonnes baies.", "Ouah, Pois ! Il y en a tellement !"],
        ["", "Lentement, lentement, Gus l'escargot arrive.", "Bonjour. J'ai très faim. Je n'ai trouvé aucune baie aujourd'hui."],
        ["Hmm…", "Pois réfléchit. Doit-elle garder toutes les baies ?", "Hmm. Que ferait une bonne amie ?"],
        ["Partager !", "Gus, tu veux un peu de mes baies ?", "Oh, merci, Pois ! C'est tellement gentil."],
        ["", "Pois et Gus mangent des baies ensemble. Miam, miam !", "Partager me rend toute chaude et heureuse à l'intérieur !"],
        ["Partager, c'est aimer", "Quand on partage, tout le monde sourit. Bzz !", "Que peux-tu partager avec un ami aujourd'hui ?"],
        ["", "Partager, c'est aimer. À bientôt au jardin de la gentillesse !"],
      ],
      quiz: [
        ["Qu'a partagé Pois avec Gus ?", ["Des baies", "Ses chaussures", "Une voiture"], "Pois a partagé ses bonnes baies avec Gus qui avait faim."],
        ["Comment Pois s'est-elle sentie après avoir partagé ?", ["Heureuse", "Grognon", "Endormie"], "Partager a rendu Pois heureuse à l'intérieur."],
      ],
    },
    {
      title: "La coccinelle honnête",
      topic: "L'honnêteté",
      summary: "Pois renverse sans le faire exprès le pot de fleur de Béa et trouve le courage de dire la vérité.",
      takeaway: "Dire la vérité, même quand c'est difficile, aide les amis à se faire confiance.",
      scenes: [
        ["", "Béa a planté une jolie tulipe dans un petit pot.", "Je vais chercher de l'eau. Prenez soin de ma fleur !"],
        ["", "Pois joue avec son ballon. Boing, boing, bam !"],
        ["Oups !", "Oups ! Le ballon renverse le pot de fleur.", "Oh non ! Qu'est-ce que Béa va dire ?"],
        ["", "Tu pourrais dire la vérité à Béa.", "Mais j'ai le ventre tout noué. J'ai peur."],
        ["", "Je suis revenue ! Qu'est-il arrivé à ma tulipe ?", "Pois prend une grande respiration courageuse."],
        ["La vérité", "Je l'ai touchée avec mon ballon. Pardon, Béa.", "Merci de m'avoir dit la vérité, Pois."],
        ["Réparons-la !", "Réparons-la ensemble !", "Elles remettent la tulipe dans son pot et l'arrosent."],
        ["", "Dire la vérité a dénoué mon ventre !", "L'honnêteté aide les amis à se faire confiance. Au revoir !"],
      ],
      quiz: [
        ["Qu'a fait Pois après la chute du pot ?", ["Elle a dit la vérité", "Elle s'est cachée", "Elle s'est enfuie"], "Pois a été courageuse et a dit la vérité à Béa."],
        ["Comment s'est sentie Pois après avoir dit la vérité ?", ["Mieux", "Plus mal", "Affamée"], "Dire la vérité a dénoué le ventre de Pois."],
      ],
    },
    {
      title: "Merci, les amis !",
      topic: "Dire merci",
      summary: "Gus garde ses amis au sec sous la pluie, et tout le monde découvre comme c'est bon de dire merci.",
      takeaway: "Dire merci montre qu'on a remarqué la gentillesse, et ça fait du bien à tout le monde.",
      scenes: [
        ["", "Plic, ploc ! Il pleut dans le jardin.", "Brrr ! Mes ailes sont toutes mouillées !"],
        ["", "Venez sous ma grande feuille, les amis !", "Gus tient une feuille comme un parapluie."],
        ["Merci !", "Merci, Gus ! Tu nous as gardées au sec.", "Merci, Gus !"],
        ["", "De rien ! Quand on me dit merci, je suis si content."],
        ["", "La pluie s'arrête et un arc-en-ciel apparaît.", "Pour quoi d'autre on peut dire merci ?"],
        ["Je dis merci pour…", "Je dis merci pour les fleurs et le soleil !", "Je dis merci pour mes amis !"],
        ["", "Les amis fabriquent une carte de remerciement pour Gus.", "Une carte pour moi ? Merci !"],
        ["Merci !", "Dire merci répand la gentillesse. Qui vas-tu remercier aujourd'hui ?"],
      ],
      quiz: [
        ["Comment Gus a-t-il aidé ses amis ?", ["Il les a gardés au sec avec une feuille", "Il a chanté une chanson", "Il a trouvé des baies"], "Gus a tenu une grande feuille comme un parapluie."],
        ["Quels mots magiques ont dit Béa et Pois ?", ["Merci", "Va-t'en", "Dépêche-toi"], "Dire merci montre qu'on est reconnaissant."],
      ],
    },
  ],
} satisfies SeriesText;
