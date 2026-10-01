import type { AgeGroup } from "./types";

export interface Category {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  /** Used in AI prompts to explain what belongs in this category. */
  description: string;
  /** Gradient pair for cards, title cards and the player chrome. */
  colors: [string, string];
  /** Sub-topics offered in the Magic Studio and used by the seed script. */
  topics: string[];
}

export const CATEGORIES: Category[] = [
  {
    id: "animals",
    name: "Animals",
    emoji: "🦁",
    tagline: "Roar, splash & flutter!",
    description: "Real animals: how they look, move, eat, sleep, talk and where they live.",
    colors: ["#ffb347", "#ff7e5f"],
    topics: [
      "Jungle animals",
      "Ocean creatures",
      "Farm friends",
      "Bugs and insects",
      "Birds",
      "Dinosaurs",
      "Arctic animals",
      "Baby animals",
      "Animal homes",
      "Night animals",
    ],
  },
  {
    id: "math",
    name: "Math",
    emoji: "🔢",
    tagline: "Count, add & find patterns",
    description: "Numbers, counting, shapes, patterns, measuring and early arithmetic shown visually.",
    colors: ["#6dd5ed", "#2193b0"],
    topics: [
      "Counting",
      "Adding",
      "Taking away",
      "Shapes",
      "Patterns",
      "Measuring",
      "Telling time",
      "Money",
      "Fractions",
      "Multiplication",
    ],
  },
  {
    id: "physics",
    name: "Physics",
    emoji: "🧲",
    tagline: "Push, pull, zap & glow",
    description: "How the physical world works: forces, gravity, magnets, light, sound, energy and motion.",
    colors: ["#a18cd1", "#6a5acd"],
    topics: [
      "Gravity",
      "Magnets",
      "Light and shadows",
      "Sound",
      "Floating and sinking",
      "Push and pull",
      "Electricity",
      "Simple machines",
      "Hot and cold",
      "Rainbows",
    ],
  },
  {
    id: "values",
    name: "Kindness & Values",
    emoji: "💖",
    tagline: "Be kind, brave & honest",
    description: "Good values and social skills: kindness, sharing, honesty, courage, patience, gratitude, teamwork and respect.",
    colors: ["#ff9a9e", "#f6416c"],
    topics: [
      "Sharing",
      "Honesty",
      "Kindness",
      "Courage",
      "Patience",
      "Saying thank you",
      "Teamwork",
      "Respect",
      "Saying sorry",
      "Helping others",
    ],
  },
  {
    id: "feelings",
    name: "Feelings",
    emoji: "😊",
    tagline: "Big feelings, gentle tools",
    description: "Emotional literacy: naming feelings, calming down, empathy, friendship and resilience.",
    colors: ["#fddb92", "#f6a13b"],
    topics: [
      "Feeling happy",
      "Feeling sad",
      "Feeling angry",
      "Feeling scared",
      "Calm breathing",
      "Making friends",
      "Feeling left out",
      "Being proud",
      "Trying again",
      "Missing someone",
    ],
  },
  {
    id: "space",
    name: "Space",
    emoji: "🚀",
    tagline: "Blast off to the stars",
    description: "Astronomy and space exploration: the Sun, Moon, planets, stars, astronauts and rockets.",
    colors: ["#4b6cb7", "#182848"],
    topics: [
      "The Sun",
      "The Moon",
      "Planets",
      "Stars",
      "Astronauts",
      "Rockets",
      "Day and night",
      "Comets and meteors",
      "Planet Earth",
      "Space stations",
    ],
  },
  {
    id: "nature",
    name: "Nature & Planet",
    emoji: "🌱",
    tagline: "Grow, recycle & explore",
    description: "Weather, seasons, plants, ecosystems and caring for our planet.",
    colors: ["#96e6a1", "#3cb371"],
    topics: [
      "Weather",
      "Seasons",
      "Plants and seeds",
      "Trees",
      "Recycling",
      "The water cycle",
      "Volcanoes",
      "Rainforests",
      "Clean oceans",
      "Bees and flowers",
    ],
  },
  {
    id: "body",
    name: "Body & Health",
    emoji: "💪",
    tagline: "Strong, healthy & happy",
    description: "The human body and healthy habits: food, sleep, hygiene, exercise, senses and organs.",
    colors: ["#84fab0", "#21b68a"],
    topics: [
      "Healthy food",
      "Brushing teeth",
      "Sleep",
      "The heart",
      "Bones and muscles",
      "Five senses",
      "Washing hands",
      "Exercise",
      "Drinking water",
      "The brain",
    ],
  },
  {
    id: "world",
    name: "World & Cultures",
    emoji: "🌍",
    tagline: "Say hello around the world",
    description: "Countries, languages, foods, festivals, music and everyday life of children around the world, shown with respect.",
    colors: ["#43cea2", "#185a9d"],
    topics: [
      "Hello in many languages",
      "Festivals",
      "Foods around the world",
      "Music and dance",
      "Homes around the world",
      "Famous places",
      "Games kids play",
      "Flags",
      "Families",
      "Clothes",
    ],
  },
  {
    id: "words",
    name: "Words & Letters",
    emoji: "🔤",
    tagline: "Letters, rhymes & new words",
    description: "Early literacy and language: the alphabet, phonics, rhymes, opposites and new vocabulary.",
    colors: ["#f093fb", "#c445d8"],
    topics: [
      "The alphabet",
      "Rhyming words",
      "Opposites",
      "New words",
      "Letter sounds",
      "Colors",
      "Telling a story",
      "Action words",
      "Describing words",
      "Animal sounds",
    ],
  },
  {
    id: "inventions",
    name: "Inventions & History",
    emoji: "💡",
    tagline: "Ideas that changed the world",
    description: "Great inventions, inventors, scientists and history told as true adventures for kids.",
    colors: ["#f7971e", "#d4a106"],
    topics: [
      "The wheel",
      "The light bulb",
      "Airplanes",
      "The telephone",
      "Printing books",
      "Ancient Egypt",
      "Trains",
      "Computers",
      "Famous scientists",
      "Medicine",
    ],
  },
  {
    id: "art",
    name: "Art & Music",
    emoji: "🎨",
    tagline: "Paint, sing & make",
    description: "Creativity: colors, drawing, famous art, instruments, rhythm, singing and dance.",
    colors: ["#fbc2eb", "#a18cd1"],
    topics: [
      "Mixing colors",
      "Drawing shapes",
      "Musical instruments",
      "Rhythm and beat",
      "Famous paintings",
      "Music from things at home",
      "Dance",
      "Sculpture and clay",
      "Patterns in art",
      "Singing",
    ],
  },
  {
    id: "coding",
    name: "Coding & Logic",
    emoji: "🤖",
    tagline: "Think like a robot",
    description: "Computational thinking without screens: sequences, loops, conditions, debugging, sorting and puzzles.",
    colors: ["#5ee7df", "#3a7bd5"],
    topics: [
      "Step-by-step instructions",
      "Loops",
      "If-then choices",
      "Finding bugs",
      "Robots",
      "Sorting",
      "Patterns and sequences",
      "Secret codes",
      "Logic puzzles",
      "How computers think",
    ],
  },
  {
    id: "safety",
    name: "Staying Safe",
    emoji: "🦺",
    tagline: "Smart choices keep us safe",
    description: "Gentle, reassuring safety skills: roads, water, sun, fire, getting lost and asking trusted grown-ups for help.",
    colors: ["#ffe259", "#ffa751"],
    topics: [
      "Crossing the road",
      "Fire safety",
      "Water safety",
      "Sun safety",
      "Asking a grown-up for help",
      "Bike helmets",
      "Kitchen safety",
      "Online safety",
      "Staying close in crowds",
      "Calling for help",
    ],
  },
];

export const CATEGORY_BY_ID: Record<string, Category> = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));

export interface AgeProfile {
  label: string;
  range: string;
  emoji: string;
  /** Scenes per episode and spoken lines per scene; together they set the length. */
  scenes: number;
  linesPerScene: string;
  /** Typical episode length, for prompts and tests. */
  minutes: number;
  /** Human-readable length shown in the app. */
  length: string;
  quiz: number;
  maxWordsPerLine: number;
  guidance: string;
}

/**
 * Bite-sized episodes that grow with the child: about 1-2 minutes for
 * preschoolers, 2-3 for early readers and 3-4 for older kids. Each series is a
 * run of these short episodes, so kids can watch one or a few in a row, and
 * every episode ends at a natural stopping point (good for screen-time habits).
 */
export const AGE_PROFILES: Record<AgeGroup, AgeProfile> = {
  "3-5": {
    label: "Little Explorers",
    range: "Ages 3–5",
    emoji: "🐣",
    scenes: 8,
    linesPerScene: "2 or 3",
    minutes: 1.5,
    length: "1–2 min",
    quiz: 2,
    maxWordsPerLine: 12,
    guidance:
      "Preschoolers. Very short, simple sentences with everyday words. Lots of repetition, sound words, counting along and invitations to join in (\"Can you roar too?\"). One idea per scene.",
  },
  "6-8": {
    label: "Curious Kids",
    range: "Ages 6–8",
    emoji: "🦊",
    scenes: 10,
    linesPerScene: "2 or 3",
    minutes: 2.5,
    length: "2–3 min",
    quiz: 3,
    maxWordsPerLine: 18,
    guidance:
      "Early readers. Clear sentences, a few new words explained right away, simple cause and effect, jokes and playful wonder. Ask the viewer questions and give them a moment to think.",
  },
  "9-12": {
    label: "Big Thinkers",
    range: "Ages 9–12",
    emoji: "🦉",
    scenes: 12,
    linesPerScene: "2 to 4",
    minutes: 3.5,
    length: "3–4 min",
    quiz: 4,
    maxWordsPerLine: 25,
    guidance:
      "Older kids. Richer vocabulary, real numbers and names, why-and-how explanations, surprising facts, light humor and a bit of challenge. Never talk down to them.",
  },
};

export const LANGUAGES: Array<{ code: string; name: string }> = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "he", name: "עברית" },
  { code: "ar", name: "العربية" },
  { code: "pt", name: "Português" },
  { code: "it", name: "Italiano" },
  { code: "ru", name: "Русский" },
  { code: "zh", name: "中文" },
  { code: "hi", name: "हिन्दी" },
  { code: "ja", name: "日本語" },
];

export const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  he: "Hebrew",
  ar: "Arabic",
  pt: "Portuguese",
  it: "Italian",
  ru: "Russian",
  zh: "Simplified Chinese",
  hi: "Hindi",
  ja: "Japanese",
};
