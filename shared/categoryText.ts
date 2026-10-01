import { CATEGORY_BY_ID, type Category } from "./categories";

/** Category names, taglines and topic ideas in each app language (English lives in categories.ts). */
type CategoryText = Record<string, { name: string; tagline: string; topics: string[] }>;

const he: CategoryText = {
  animals: {
    name: "בעלי חיים",
    tagline: "שואגים, משכשכים ומרפרפים!",
    topics: ["חיות הג׳ונגל", "יצורי הים", "חיות המשק", "חרקים", "ציפורים", "דינוזאורים", "חיות הקוטב", "גורים", "בתים של בעלי חיים", "חיות לילה"],
  },
  math: {
    name: "מתמטיקה",
    tagline: "סופרים, מחברים ומגלים דפוסים",
    topics: ["ספירה", "חיבור", "חיסור", "צורות", "דפוסים", "מדידה", "שעון", "כסף", "שברים", "כפל"],
  },
  physics: {
    name: "פיזיקה",
    tagline: "דוחפים, מושכים, מבזיקים וזוהרים",
    topics: ["כוח המשיכה", "מגנטים", "אור וצל", "קול", "צף ושוקע", "דחיפה ומשיכה", "חשמל", "מכונות פשוטות", "חם וקר", "קשת בענן"],
  },
  values: {
    name: "טוב לב וערכים",
    tagline: "להיות נחמדים, אמיצים וכנים",
    topics: ["שיתוף", "כנות", "טוב לב", "אומץ", "סבלנות", "להגיד תודה", "עבודת צוות", "כבוד", "להגיד סליחה", "לעזור לאחרים"],
  },
  feelings: {
    name: "רגשות",
    tagline: "רגשות גדולים, כלים עדינים",
    topics: ["שמחה", "עצב", "כעס", "פחד", "נשימה רגועה", "להכיר חברים", "להרגיש בחוץ", "גאווה", "לנסות שוב", "געגוע"],
  },
  space: {
    name: "חלל",
    tagline: "ממריאים אל הכוכבים",
    topics: ["השמש", "הירח", "כוכבי הלכת", "כוכבים", "אסטרונאוטים", "חלליות", "יום ולילה", "שביטים ומטאורים", "כדור הארץ", "תחנות חלל"],
  },
  nature: {
    name: "טבע וכדור הארץ",
    tagline: "מגדלים, ממחזרים ומגלים",
    topics: ["מזג האוויר", "עונות השנה", "צמחים וזרעים", "עצים", "מיחזור", "מחזור המים", "הרי געש", "יערות גשם", "ים נקי", "דבורים ופרחים"],
  },
  body: {
    name: "גוף ובריאות",
    tagline: "חזקים, בריאים ושמחים",
    topics: ["אוכל בריא", "צחצוח שיניים", "שינה", "הלב", "עצמות ושרירים", "חמשת החושים", "שטיפת ידיים", "פעילות גופנית", "שתיית מים", "המוח"],
  },
  world: {
    name: "העולם ותרבויות",
    tagline: "אומרים שלום מסביב לעולם",
    topics: ["שלום בהרבה שפות", "חגים ופסטיבלים", "מאכלים מהעולם", "מוזיקה וריקוד", "בתים בעולם", "מקומות מפורסמים", "משחקי ילדים", "דגלים", "משפחות", "בגדים"],
  },
  words: {
    name: "מילים ואותיות",
    tagline: "אותיות, חרוזים ומילים חדשות",
    topics: ["האלף־בית", "מילים מתחרזות", "הפכים", "מילים חדשות", "צלילי אותיות", "צבעים", "לספר סיפור", "פעלים", "מילים שמתארות", "קולות של חיות"],
  },
  inventions: {
    name: "המצאות והיסטוריה",
    tagline: "רעיונות ששינו את העולם",
    topics: ["הגלגל", "הנורה", "מטוסים", "הטלפון", "הדפסת ספרים", "מצרים העתיקה", "רכבות", "מחשבים", "מדענים מפורסמים", "רפואה"],
  },
  art: {
    name: "אמנות ומוזיקה",
    tagline: "מציירים, שרים ויוצרים",
    topics: ["ערבוב צבעים", "ציור צורות", "כלי נגינה", "קצב", "ציורים מפורסמים", "מוזיקה מחפצים בבית", "ריקוד", "פיסול בחימר", "דפוסים באמנות", "שירה"],
  },
  coding: {
    name: "תכנות וחשיבה",
    tagline: "לחשוב כמו רובוט",
    topics: ["הוראות צעד אחר צעד", "לולאות", "אם־אז", "למצוא באגים", "רובוטים", "מיון", "רצפים", "קודים סודיים", "חידות היגיון", "איך מחשבים חושבים"],
  },
  safety: {
    name: "שומרים על עצמנו",
    tagline: "בחירות חכמות שומרות עלינו",
    topics: ["חציית כביש", "בטיחות באש", "בטיחות במים", "בטיחות בשמש", "לבקש עזרה ממבוגר", "קסדה באופניים", "בטיחות במטבח", "בטיחות ברשת", "להישאר קרוב בהמון", "להזעיק עזרה"],
  },
};

const fr: CategoryText = {
  animals: {
    name: "Animaux",
    tagline: "Rugir, barboter, voleter !",
    topics: ["Animaux de la jungle", "Créatures marines", "Animaux de la ferme", "Insectes", "Oiseaux", "Dinosaures", "Animaux polaires", "Bébés animaux", "Maisons des animaux", "Animaux de la nuit"],
  },
  math: {
    name: "Maths",
    tagline: "Compter, additionner, trouver des motifs",
    topics: ["Compter", "Additionner", "Soustraire", "Les formes", "Les motifs", "Mesurer", "Lire l'heure", "L'argent", "Les fractions", "La multiplication"],
  },
  physics: {
    name: "Physique",
    tagline: "Pousser, tirer, briller",
    topics: ["La gravité", "Les aimants", "Lumière et ombres", "Le son", "Flotter et couler", "Pousser et tirer", "L'électricité", "Les machines simples", "Chaud et froid", "L'arc-en-ciel"],
  },
  values: {
    name: "Gentillesse et valeurs",
    tagline: "Gentil, courageux et honnête",
    topics: ["Partager", "L'honnêteté", "La gentillesse", "Le courage", "La patience", "Dire merci", "Le travail d'équipe", "Le respect", "Demander pardon", "Aider les autres"],
  },
  feelings: {
    name: "Émotions",
    tagline: "De grandes émotions, de doux outils",
    topics: ["La joie", "La tristesse", "La colère", "La peur", "Respirer calmement", "Se faire des amis", "Se sentir mis à l'écart", "La fierté", "Réessayer", "Quelqu'un nous manque"],
  },
  space: {
    name: "Espace",
    tagline: "Décollage vers les étoiles",
    topics: ["Le Soleil", "La Lune", "Les planètes", "Les étoiles", "Les astronautes", "Les fusées", "Le jour et la nuit", "Comètes et météores", "La Terre", "Les stations spatiales"],
  },
  nature: {
    name: "Nature et planète",
    tagline: "Planter, recycler, explorer",
    topics: ["La météo", "Les saisons", "Plantes et graines", "Les arbres", "Le recyclage", "Le cycle de l'eau", "Les volcans", "Les forêts tropicales", "Des océans propres", "Abeilles et fleurs"],
  },
  body: {
    name: "Corps et santé",
    tagline: "Forts, en forme et heureux",
    topics: ["Bien manger", "Se brosser les dents", "Le sommeil", "Le cœur", "Os et muscles", "Les cinq sens", "Se laver les mains", "Bouger", "Boire de l'eau", "Le cerveau"],
  },
  world: {
    name: "Monde et cultures",
    tagline: "Bonjour tout autour du monde",
    topics: ["Bonjour dans plein de langues", "Les fêtes", "Cuisines du monde", "Musique et danse", "Maisons du monde", "Lieux célèbres", "Jeux d'enfants", "Les drapeaux", "Les familles", "Les vêtements"],
  },
  words: {
    name: "Mots et lettres",
    tagline: "Lettres, rimes et nouveaux mots",
    topics: ["L'alphabet", "Les rimes", "Les contraires", "Nouveaux mots", "Les sons des lettres", "Les couleurs", "Raconter une histoire", "Les verbes", "Les adjectifs", "Les cris des animaux"],
  },
  inventions: {
    name: "Inventions et histoire",
    tagline: "Des idées qui ont changé le monde",
    topics: ["La roue", "L'ampoule", "Les avions", "Le téléphone", "L'imprimerie", "L'Égypte ancienne", "Les trains", "Les ordinateurs", "Scientifiques célèbres", "La médecine"],
  },
  art: {
    name: "Art et musique",
    tagline: "Peindre, chanter, créer",
    topics: ["Mélanger les couleurs", "Dessiner des formes", "Les instruments", "Le rythme", "Tableaux célèbres", "Musique avec des objets", "La danse", "Sculpture et pâte à modeler", "Motifs en art", "Chanter"],
  },
  coding: {
    name: "Code et logique",
    tagline: "Penser comme un robot",
    topics: ["Instructions pas à pas", "Les boucles", "Si… alors", "Trouver les bugs", "Les robots", "Trier", "Les suites", "Codes secrets", "Énigmes logiques", "Comment pense un ordinateur"],
  },
  safety: {
    name: "Sécurité",
    tagline: "Les bons choix nous protègent",
    topics: ["Traverser la rue", "Le feu", "L'eau", "Le soleil", "Demander de l'aide à un adulte", "Le casque à vélo", "La cuisine", "Internet", "Rester proche dans la foule", "Appeler à l'aide"],
  },
};

const TEXT: Record<string, CategoryText> = { he, fr };

/** A category with its name, tagline and topics in `language` (falls back to English). */
export function localCategory(category: Category, language: string): Category {
  const text = TEXT[language]?.[category.id];
  return text ? { ...category, ...text } : category;
}

export function localCategoryById(id: string, language: string): Category | undefined {
  const category = CATEGORY_BY_ID[id];
  return category && localCategory(category, language);
}
