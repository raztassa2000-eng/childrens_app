import type { SeriesText } from "../localize";

export default {
  title: "Les chiots de la sécurité",
  tagline: "Des choix malins et prudents avec Rex et Kiki !",
  cast: {
    rex: ["Rex", "Un chiot courageux qui connaît toutes les règles de sécurité."],
    kiki: ["Kiki", "Une chatonne curieuse qui apprend à être prudente."],
    rosa: ["Agente Rosa", "Une gentille policière qui aide tout le monde en ville."],
  },
  episodes: [
    {
      title: "Stop, je regarde, j'écoute",
      topic: "Traverser la rue",
      summary: "En allant au parc, Rex apprend à Kiki à traverser la rue en toute sécurité.",
      takeaway: "Avant de traverser, on tient la main d'un adulte, puis on s'arrête, on regarde et on écoute.",
      scenes: [
        ["", "Bienvenue chez les chiots de la sécurité !", "Salut ! Moi, c'est Rex. Kiki et moi, on va au parc."],
        ["Attends !", "Kiki voit le parc de l'autre côté de la rue et se met à courir.", "Attends, Kiki ! On s'arrête au bord du trottoir !"],
        ["La main", "D'abord, on tient la main d'un adulte.", "Je tiens la patte de mon adulte !"],
        ["Stop !", "Ensuite, on s'arrête, on regarde et on écoute."],
        ["Regarde des deux côtés", "Regarde à gauche. Regarde à droite. Et encore à gauche.", "Une voiture arrive ! On attend."],
        ["Écoute !", "Écoute aussi les voitures. Vroum, vroum, ça veut dire : on attend !"],
        ["On marche, sans courir", "Le bonhomme est vert, et aucune voiture n'arrive.", "Maintenant, on traverse. On marche, on ne court pas !"],
        ["", "On est arrivés au parc sans danger !", "N'oublie pas : la main, stop, je regarde et j'écoute !"],
      ],
      quiz: [
        ["Que fait-on au bord du trottoir ?", ["On s'arrête, on regarde et on écoute", "On court vite", "On ferme les yeux"], "Avant de traverser, on s'arrête toujours, on regarde et on écoute."],
        ["La main de qui faut-il tenir pour traverser ?", ["Celle d'un adulte", "Celle d'un ballon", "Celle de personne"], "On traverse toujours avec un adulte."],
      ],
    },
    {
      title: "Malins au soleil",
      topic: "Le soleil et l'eau",
      summary: "À la plage, Rex et Kiki apprennent à rester en sécurité au soleil et près de l'eau.",
      takeaway: "Les jours de soleil, on met un chapeau et de la crème solaire, on boit de l'eau, et on ne se baigne que si un adulte surveille.",
      scenes: [
        ["", "C'est une journée chaude et ensoleillée à la plage !", "Youpi ! On joue dans le sable !"],
        ["Chapeau", "D'abord, soyons malins au soleil ! Un chapeau protège notre visage du soleil."],
        ["Crème solaire", "Un adulte aide à mettre de la crème solaire pour protéger la peau.", "On frotte, on frotte, partout !"],
        ["Ombre", "Quand il fait très chaud, on se repose à l'ombre."],
        ["Boire de l'eau", "Et on boit beaucoup d'eau. Glou, glou !"],
        ["Un adulte surveille", "Avant de se baigner, il faut toujours un adulte qui nous surveille.", "Les petits nageurs portent un gilet de sauvetage pour flotter."],
        ["Plouf !", "Avec un adulte tout près, Rex et Kiki barbotent là où l'eau est peu profonde."],
        ["", "Chapeau, crème solaire, ombre, eau, et un adulte près de l'eau !", "Amuse-toi bien au soleil, et reste prudent !"],
      ],
      quiz: [
        ["Qu'est-ce qui protège ta peau du soleil ?", ["La crème solaire et un chapeau", "Une glace", "Le sable"], "La crème solaire et le chapeau protègent ta peau du soleil."],
        ["Qui doit surveiller quand tu te baignes ?", ["Un adulte", "Une mouette", "Personne"], "On se baigne toujours avec un adulte qui surveille."],
      ],
    },
    {
      title: "Qui peut m'aider ?",
      topic: "Se perdre",
      summary: "Quand Rex et Kiki perdent de vue leur adulte au marché, ils restent sur place et trouvent quelqu'un pour les aider.",
      takeaway: "Si tu te perds, reste où tu es, demande de l'aide à un vendeur ou à un policier, et connais le numéro de ton adulte.",
      scenes: [
        ["", "Rex et Kiki sont au marché plein de monde avec leur adulte.", "Oh, regarde tous ces fruits colorés !"],
        ["", "Ils s'arrêtent pour regarder les pastèques. Quand ils relèvent la tête, leur adulte a disparu !", "Oh non ! Où est passé notre adulte ?"],
        ["On ne bouge pas", "Quand on est perdu, on reste exactement où on est. On ne se promène pas !"],
        ["On respire", "Kiki respire lentement et profondément. On inspire, on expire. Elle se sent un peu plus calme."],
        ["Trouver de l'aide", "On peut demander à quelqu'un qui aide, comme un vendeur ou un policier."],
        ["De l'aide !", "Excusez-moi, on ne trouve plus notre adulte.", "Cherchons-le ensemble. Comment s'appelle ton adulte ?"],
        ["Connais ton numéro", "Kiki connaît le nom et le numéro de téléphone de son adulte, alors l'agente Rosa peut appeler.", "Entraîne-toi à la maison à dire le numéro de ton adulte !"],
        ["", "Dring, dring ! Leur adulte arrive tout de suite. Gros câlins !", "On ne bouge pas, on trouve de l'aide, et on connaît son numéro !"],
      ],
      quiz: [
        ["Que faire d'abord si tu te perds ?", ["Rester où tu es", "Courir partout", "Te cacher"], "Si tu restes sur place, ton adulte te retrouve plus facilement."],
        ["À qui peux-tu demander de l'aide ?", ["À un vendeur ou un policier", "À un pigeon", "À personne"], "Les vendeurs et les policiers peuvent t'aider à retrouver ton adulte."],
      ],
    },
  ],
} satisfies SeriesText;
