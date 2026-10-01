import { N, cast, ep, q, sc, series } from "./dsl";

export default series({
  id: "values.kindness-garden",
  category: "values",
  age: "3-5",
  title: "The Kindness Garden",
  tagline: "Little bugs, big hearts!",
  emoji: "🐝",
  cast: [
    cast("bea", "Bea", "🐝", "high", "A busy little bee who loves helping."),
    cast("dot", "Dot", "🐞", "child", "A shy ladybug who is learning to be a good friend."),
    cast("gus", "Gus", "🐌", "gentle", "A slow and kind snail."),
  ],
  episodes: [
    ep(
      "Sharing Is Caring",
      "Sharing",
      "Dot finds lots of berries and learns how good it feels to share with hungry Gus.",
      [
        sc("meadow", ["bea:fly:top", "dot:idle"], ["☀️ sky", "🌸 ground"], [
          N("Welcome to the Kindness Garden!"),
          ["bea", "Buzz, buzz! I'm Bea. Kindness makes our garden grow!"],
        ]),
        sc("meadow", ["dot:bounce", "bea:fly"], ["🍓 ground", "🍓 ground"], [
          ["dot", "Look! I found lots of yummy berries."],
          ["bea", "Wow, Dot! That's so many!"],
        ]),
        sc("meadow", ["gus:walk:right", "dot:idle"], ["🍓 ground"], [
          N("Slowly, slowly, Gus the snail comes by."),
          ["gus", "Hello. I'm so hungry. I didn't find any berries today."],
        ]),
        sc("meadow", ["dot:think", "bea:fly"], ["🍓 ground"], [
          N("Dot thinks. Should she keep all the berries?"),
          ["dot", "Hmm. What would a good friend do?"],
        ], "Hmm..."),
        sc("meadow", ["dot:wave", "gus:bounce"], ["🍓 ground", "🍓 air"], [
          ["dot", "Gus, would you like some of my berries?"],
          ["gus", "Oh, thank you, Dot! That's so kind."],
        ], "Sharing!"),
        sc("meadow", ["dot:dance", "gus:dance", "bea:fly"], ["🍓 ground"], [
          N("Dot and Gus eat berries together. Yum, yum!"),
          ["dot", "Sharing makes me feel warm and happy inside!"],
        ]),
        sc("meadow", ["bea:cheer", "dot:cheer", "gus:cheer"], ["💖 air"], [
          ["bea", "When we share, everyone smiles. Buzz!"],
          N("What can you share with a friend today?"),
        ], "Sharing is caring"),
        sc("meadow", ["bea:wave", "dot:wave", "gus:wave"], ["🌈 sky"], [
          N("Sharing is caring. See you next time in the Kindness Garden!"),
        ]),
      ],
      [
        q("What did Dot share with Gus?", ["Berries", "Her shoes", "A car"], 0, "Dot shared her yummy berries with hungry Gus."),
        q("How did sharing make Dot feel?", ["Warm and happy", "Grumpy", "Sleepy"], 0, "Sharing made Dot feel warm and happy inside."),
      ],
      "Sharing is caring. When we share, everyone can be happy.",
    ),
    ep(
      "The Honest Ladybug",
      "Honesty",
      "Dot accidentally knocks over Bea's flower pot and finds the courage to tell the truth.",
      [
        sc("meadow", ["bea:fly", "dot:idle"], ["🌷 ground"], [
          N("Bea planted a beautiful tulip in a little pot."),
          ["bea", "I'm going to get water. Please keep my flower safe!"],
        ]),
        sc("meadow", ["dot:run", "gus:idle"], ["🌷 ground", "⚽ air"], [
          N("Dot plays with her ball. Bounce, bounce, bump!"),
        ]),
        sc("meadow", ["dot:shiver", "gus:think"], ["🌷 ground"], [
          N("Oops! The ball knocks over the flower pot."),
          ["dot", "Oh no! What will Bea say?"],
        ], "Oops!"),
        sc("meadow", ["dot:think", "gus:idle"], ["🌷 ground"], [
          ["gus", "You could tell Bea the truth."],
          ["dot", "But my tummy feels wobbly. I'm scared."],
        ]),
        sc("meadow", ["bea:fly:top", "dot:idle"], ["🌷 ground"], [
          ["bea", "I'm back! What happened to my tulip?"],
          N("Dot takes a big, brave breath."),
        ]),
        sc("meadow", ["dot:wave", "bea:fly"], ["🌷 ground"], [
          ["dot", "I bumped it with my ball. I'm sorry, Bea."],
          ["bea", "Thank you for telling me the truth, Dot."],
        ], "The truth"),
        sc("meadow", ["dot:bounce", "bea:fly", "gus:bounce"], ["🌷 ground", "💧 air"], [
          ["bea", "Let's fix it together!"],
          N("They put the tulip back in its pot and give it water."),
        ], "Let's fix it!"),
        sc("meadow", ["bea:cheer", "dot:cheer", "gus:cheer"], ["🌈 sky"], [
          ["dot", "Telling the truth made my wobbly tummy feel better!"],
          N("Being honest helps friends trust each other. Bye-bye!"),
        ]),
      ],
      [
        q("What did Dot do after the pot fell?", ["She told the truth", "She hid", "She ran away"], 0, "Dot was brave and told Bea the truth."),
        q("How did Dot feel after telling the truth?", ["Better", "Worse", "Hungry"], 0, "Telling the truth made Dot's wobbly tummy feel better."),
      ],
      "Telling the truth, even when it's hard, helps friends trust each other.",
    ),
    ep(
      "Thank You, Friends!",
      "Saying thank you",
      "Gus keeps his friends dry in the rain, and everyone discovers how good thank you feels.",
      [
        sc("rainy", ["bea:shiver", "dot:shiver"], ["☁️ sky"], [
          N("Pitter, patter! It's raining in the garden."),
          ["bea", "Brrr! My wings are getting wet!"],
        ]),
        sc("rainy", ["gus:walk:left", "bea:shiver", "dot:shiver"], ["🍃 air"], [
          ["gus", "Come under my big leaf, friends!"],
          N("Gus holds up a leaf like an umbrella."),
        ]),
        sc("rainy", ["gus:idle", "bea:bounce", "dot:bounce"], ["🍃 air"], [
          ["bea", "Thank you, Gus! You kept us dry."],
          ["dot", "Thank you, Gus!"],
        ], "Thank you!"),
        sc("rainy", ["gus:grow", "bea:fly"], ["🍃 air"], [
          ["gus", "You're welcome! Hearing thank you makes me so happy."],
        ]),
        sc("meadow", ["dot:think", "bea:fly"], ["🌈 sky", "☀️ sky"], [
          N("The rain stops and a rainbow appears."),
          ["dot", "What other things are we thankful for?"],
        ]),
        sc("meadow", ["bea:fly", "dot:dance"], ["🌸 ground", "☀️ sky"], [
          ["bea", "I'm thankful for flowers and sunshine!"],
          ["dot", "I'm thankful for my friends!"],
        ], "I'm thankful for..."),
        sc("meadow", ["dot:bounce", "gus:bounce", "bea:fly"], ["💌 air"], [
          N("The friends make a thank-you card for Gus."),
          ["gus", "A card for me? Thank you!"],
        ]),
        sc("meadow", ["bea:wave", "dot:wave", "gus:wave"], ["🌈 sky"], [
          N("Saying thank you spreads kindness. Who will you thank today?"),
        ], "Thank you!"),
      ],
      [
        q("How did Gus help his friends?", ["He kept them dry with a leaf", "He sang a song", "He found berries"], 0, "Gus held up a big leaf like an umbrella."),
        q("What magic words did Bea and Dot say?", ["Thank you", "Go away", "Hurry up"], 0, "Saying thank you shows we are grateful."),
      ],
      "Saying thank you shows we notice kindness, and it makes everyone feel good.",
    ),
  ],
});
