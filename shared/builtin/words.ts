import { N, cast, ep, q, sc, series } from "./dsl";

export default series({
  id: "words.ziggys-rhyme-time",
  category: "words",
  age: "3-5",
  title: "Ziggy's Rhyme Time",
  tagline: "Rhymes, opposites and letters with a zebra who loves words!",
  emoji: "🦓",
  cast: [
    cast("ziggy", "Ziggy", "🦓", "silly", "A stripy zebra who loves rhymes."),
    cast("shelly", "Shelly", "🐢", "gentle", "A thoughtful turtle who loves new words."),
  ],
  episodes: [
    ep(
      "Cat, Hat, Bat!",
      "Rhyming words",
      "Ziggy and Shelly find words that sound the same at the end.",
      [
        sc("stage", ["ziggy:dance:left", "shelly:bounce"], ["✨ air"], [
          N("It's Rhyme Time with Ziggy and Shelly!"),
          ["ziggy", "Rhyming words sound the same at the end. Listen!"],
        ]),
        sc("stage", ["ziggy:idle", "🐈:bounce"], ["🎩 air"], [
          ["ziggy", "A cat in a hat! Cat, hat. They rhyme!"],
        ], "cat, hat"),
        sc("stage", ["shelly:think", "🦇:fly"], [], [
          ["shelly", "Bat rhymes too! Cat, hat, bat."],
        ], "bat"),
        sc("pond", ["ziggy:jump", "🐸:bounce"], ["🪵 ground"], [
          ["ziggy", "A frog on a log! Frog, log!"],
        ], "frog, log"),
        sc("meadow", ["shelly:bounce", "🐝:fly"], ["🌳 ground"], [
          ["shelly", "A bee in a tree! Bee, tree!"],
        ], "bee, tree"),
        sc("stage", ["ziggy:dance", "shelly:dance"], [], [
          N("Can you think of a word that rhymes with dog?"),
          ["ziggy", "Dog, log, frog! Great job!"],
        ], "Your turn!"),
        sc("night", ["ziggy:spin", "shelly:wiggle"], ["⭐ sky", "🚗 ground"], [
          ["shelly", "Twinkle star, zoom zoom car. Star, car!"],
        ], "star, car"),
        sc("stage", ["ziggy:cheer", "shelly:cheer"], ["✨ air"], [
          N("Rhyming words sound the same at the end. Keep listening for rhymes!"),
          ["ziggy", "Rhyme time is fun time!"],
        ]),
      ],
      [
        q("Which word rhymes with cat?", ["Hat", "Dog", "Sun"], 0, "Cat and hat both end with 'at'."),
        q("Which word rhymes with tree?", ["Bee", "Cup", "Ball"], 0, "Tree and bee sound the same at the end."),
      ],
      "Rhyming words sound the same at the end, like cat, hat and bat.",
    ),
    ep(
      "Big and Small",
      "Opposites",
      "Ziggy and Shelly play the opposites game: big and small, hot and cold, fast and slow.",
      [
        sc("meadow", ["ziggy:bounce", "shelly:idle"], ["☀️ sky"], [
          N("Today Ziggy and Shelly are playing the opposites game!"),
          ["shelly", "Opposites are words that mean totally different things."],
        ]),
        sc("meadow", ["🐘:walk", "ziggy:idle", "🐭:bounce"], [], [
          ["ziggy", "An elephant is big. A mouse is small. Big and small are opposites!"],
        ], "Big / Small"),
        sc("meadow", ["ziggy:jump", "shelly:idle"], ["🎈 sky", "⚽ ground"], [
          N("The balloon goes up. The ball comes down."),
        ], "Up / Down"),
        sc("snow", ["ziggy:shiver", "shelly:shiver"], ["❄️ air"], [
          ["shelly", "Snow is cold. Brrr!"],
          ["ziggy", "And soup is hot. Hot and cold are opposites!"],
        ], "Hot / Cold"),
        sc("meadow", ["ziggy:run", "shelly:walk"], [], [
          N("Ziggy runs fast. Shelly walks slow."),
          ["shelly", "Slow and steady, that's me!"],
        ], "Fast / Slow"),
        sc("home", ["ziggy:idle", "shelly:bounce"], [], [
          ["ziggy", "Open the door. Close the door. Open, close!"],
        ], "Open / Close"),
        sc("meadow", ["ziggy:cheer", "shelly:idle"], [], [
          N("A smile is happy. A frown is sad. Can you make both faces?"),
        ], "Happy / Sad"),
        sc("meadow", ["ziggy:wave", "shelly:wave"], ["🌈 sky"], [
          ["ziggy", "Big, small. Up, down. Hot, cold. Fast, slow!"],
          N("Opposites are everywhere. Goodbye! Or should we say, hello?"),
        ]),
      ],
      [
        q("What is the opposite of big?", ["Small", "Tall", "Blue"], 0, "Big and small are opposites."),
        q("What is the opposite of hot?", ["Cold", "Wet", "Loud"], 0, "Hot and cold are opposites."),
      ],
      "Opposites are words that mean totally different things, like big and small or hot and cold.",
    ),
    ep(
      "The ABC Parade",
      "Letters A to E",
      "Ziggy and Shelly march in a parade and learn the sounds of the letters A to E.",
      [
        sc("park", ["ziggy:dance", "shelly:bounce"], ["🎈 sky"], [
          N("Here comes the ABC Parade!"),
          ["ziggy", "Every letter has its own sound. Let's march!"],
        ]),
        sc("park", ["ziggy:walk", "shelly:idle"], ["🍎 air"], [
          N("A is for apple. Ah, ah, apple!"),
        ], "A"),
        sc("park", ["🐻:bounce", "shelly:walk"], ["⚽ ground"], [
          ["shelly", "B is for bear and ball. Buh, buh, bear!"],
        ], "B"),
        sc("park", ["🐈:walk", "ziggy:walk"], [], [
          ["ziggy", "C is for cat. Cuh, cuh, cat!"],
        ], "C"),
        sc("park", ["🐶:jump", "ziggy:bounce"], [], [
          N("D is for dog. Duh, duh, dog! Woof!"),
        ], "D"),
        sc("park", ["🐘:walk", "shelly:bounce"], ["🥚 ground"], [
          ["shelly", "E is for egg and elephant. Eh, eh, egg!"],
        ], "E"),
        sc("park", ["ziggy:dance", "shelly:dance"], ["🎵 air"], [
          N("Let's say them all together: A, B, C, D, E!"),
        ], "A B C D E"),
        sc("park", ["ziggy:wave", "shelly:wave"], ["🌈 sky"], [
          ["ziggy", "And Z is for Ziggy! But that's for another day."],
          N("What letter does your name start with?"),
        ]),
      ],
      [
        q("Which word starts with B?", ["Bear", "Apple", "Cat"], 0, "Bear starts with the buh sound: B!"),
        q("A is for...?", ["Apple", "Dog", "Egg"], 0, "A is for apple!"),
      ],
      "Every letter has a sound: A for apple, B for bear, C for cat, D for dog, and E for egg.",
    ),
  ],
});
