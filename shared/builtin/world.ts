import { N, cast, ep, q, sc, series } from "./dsl";

export default series({
  id: "world.pollys-passport",
  category: "world",
  age: "6-8",
  title: "Polly's Passport Adventures",
  tagline: "Fly around the world with a parrot who speaks every language!",
  emoji: "🦜",
  cast: [
    cast("polly", "Polly", "🦜", "high", "A world-traveling parrot who can say hello in many languages."),
    cast("amara", "Amara", "👧🏾", "child", "A girl who loves meeting new friends everywhere."),
  ],
  episodes: [
    ep(
      "Hello Around the World",
      "Greetings in many languages",
      "Polly and Amara fly from country to country, learning how to say hello.",
      [
        sc("home", ["polly:fly", "amara:wave"], ["🌍 air"], [
          N("Polly the parrot and Amara are going on a passport adventure!"),
          ["amara", "Polly, can you teach me to say hello around the world?"],
          ["polly", "Squawk! Let's fly!"],
        ]),
        sc("city", ["polly:fly", "amara:bounce"], ["🇪🇸 sky"], [
          N("First stop: Spain!"),
          ["polly", "In Spanish, hello is hola! Hola, amigos!"],
          ["amara", "Hola! And gracias means thank you!"],
        ], "Hola!"),
        sc("city", ["polly:fly", "amara:wave"], ["🇫🇷 sky", "🥐 ground"], [
          N("Next stop: France, where people say bonjour."),
          ["amara", "Bonjour! These fresh croissants smell amazing!"],
        ], "Bonjour!"),
        sc("mountains", ["polly:fly", "amara:idle"], ["🇯🇵 sky"], [
          N("Now we're in Japan!"),
          ["polly", "Here we say konnichiwa. People often bow a little to say hello."],
          ["amara", "Konnichiwa! A little bow, like this!"],
        ], "Konnichiwa!"),
        sc("meadow", ["amara:dance", "polly:fly"], ["🇰🇪 sky", "🦒 ground"], [
          N("Welcome to Kenya!"),
          ["amara", "In Swahili, a friendly hello is jambo!"],
        ], "Jambo!"),
        sc("city", ["polly:fly", "amara:wave"], ["🇮🇳 sky"], [
          N("In India, many people say namaste, with their hands pressed together."),
          ["amara", "Namaste! It feels calm and kind."],
        ], "Namaste"),
        sc("city", ["polly:fly", "amara:cheer"], ["🇨🇳 sky"], [
          N("And in China, hello is ni hao!"),
          ["polly", "Ni hao! You're doing great, Amara!"],
        ], "Ni hao!"),
        sc("home", ["polly:fly", "amara:wave"], ["🌍 air"], [
          ["amara", "Hola, bonjour, konnichiwa, jambo, namaste, ni hao!"],
          N("There are thousands of languages in the world. How do you say hello?"),
        ]),
      ],
      [
        q("How do you say hello in Spanish?", ["Hola", "Bonjour", "Jambo"], 0, "Hola means hello in Spanish!"),
        q("Where do people say konnichiwa?", ["Japan", "Kenya", "France"], 0, "Konnichiwa means hello in Japanese."),
        q("What does jambo mean in Swahili?", ["Hello", "Goodbye", "Banana"], 0, "Jambo is a friendly hello in Swahili."),
      ],
      "People around the world speak different languages, and every one has a way to say hello.",
    ),
    ep(
      "Festivals of Light",
      "Festivals",
      "Polly and Amara visit three festivals where people light up the night with family and joy.",
      [
        sc("night", ["polly:fly", "amara:idle"], ["🌙 sky", "✨ air"], [
          N("It's a dark winter night."),
          ["amara", "Polly, why do people around the world love to light up the night?"],
          ["polly", "Let's visit some festivals of light!"],
        ]),
        sc("city", ["amara:bounce", "polly:fly"], ["🪔 ground", "🪔 ground"], [
          N("In India and around the world, families celebrate Diwali by lighting little clay lamps called diyas."),
          ["polly", "Diwali celebrates light winning over darkness, with sweets and fireworks too!"],
        ], "Diwali"),
        sc("city", ["amara:dance", "polly:fly"], ["🎨 air"], [
          ["amara", "They make colorful patterns on the ground called rangoli!"],
          ["polly", "So pretty! Squawk!"],
        ], "Rangoli"),
        sc("home", ["amara:idle", "polly:fly"], ["🕎 air"], [
          N("During Hanukkah, Jewish families light candles on a menorah, one more each night for eight nights."),
          ["amara", "Kids often play a spinning-top game called dreidel!"],
        ], "Hanukkah"),
        sc("home", ["amara:think", "polly:idle"], ["🥔 ground", "🍩 ground"], [
          ["amara", "And they eat yummy foods like potato pancakes and jelly donuts!"],
        ], "8 nights"),
        sc("night", ["amara:cheer", "polly:fly"], ["🏮 air", "🏮 sky"], [
          N("In China, the Lantern Festival ends the New Year celebrations with glowing lanterns."),
          ["polly", "Families share sweet, round rice balls called tangyuan."],
        ], "Lantern Festival"),
        sc("night", ["amara:wave", "polly:fly"], ["🏮 air", "🎆 sky"], [
          ["polly", "Some lanterns even have riddles written on them!"],
          ["amara", "I love riddles!"],
        ]),
        sc("night", ["amara:wave", "polly:wave"], ["✨ air", "⭐ sky"], [
          ["amara", "Different festivals, but they all share light, family and joy."],
          N("Does your family have a special celebration?"),
        ]),
      ],
      [
        q("What are the little clay lamps of Diwali called?", ["Diyas", "Lanterns", "Kites"], 0, "Families light diyas during Diwali."),
        q("How many nights does Hanukkah last?", ["Eight", "Two", "Twenty"], 0, "Hanukkah lasts for eight nights."),
        q("What glows during the Lantern Festival?", ["Lanterns", "Pumpkins", "Snowmen"], 0, "Glowing lanterns light up the Lantern Festival."),
      ],
      "Around the world, people celebrate with light, family and joy, in many different ways.",
    ),
    ep(
      "What's for Lunch?",
      "Foods around the world",
      "Polly and Amara taste their way around the world and find out what kids eat for lunch.",
      [
        sc("classroom", ["amara:bounce", "polly:fly"], ["🍎 ground"], [
          N("It's lunchtime at school."),
          ["amara", "Polly, what do kids eat for lunch around the world?"],
          ["polly", "Let's taste and see! Squawk!"],
        ]),
        sc("city", ["amara:idle", "polly:fly"], ["🇮🇹 sky", "🍝 ground"], [
          N("In Italy, pasta comes in many shapes, like spirals, shells and bows."),
          ["polly", "One pasta shape looks like little ears. It's called orecchiette!"],
        ], "Italy: pasta"),
        sc("mountains", ["amara:dance", "polly:fly"], ["🇯🇵 sky", "🍙 ground"], [
          ["amara", "In Japan, kids might bring onigiri, rice balls wrapped in seaweed!"],
        ], "Japan: rice balls"),
        sc("desert", ["polly:fly", "amara:bounce"], ["🇲🇽 sky", "🌮 ground"], [
          N("In Mexico, tacos are made with soft corn tortillas and tasty fillings."),
          ["amara", "People there have been making corn tortillas for thousands of years!"],
        ], "Mexico: tacos"),
        sc("meadow", ["amara:idle", "polly:fly"], ["🇪🇹 sky", "🫓 ground"], [
          N("In Ethiopia, people tear soft, spongy injera bread and use it to scoop up stews."),
          ["amara", "No spoon needed!"],
        ], "Ethiopia: injera"),
        sc("city", ["polly:fly", "amara:think"], ["🇰🇷 sky", "🥬 ground"], [
          ["polly", "In Korea, kimchi is spicy pickled cabbage. People eat it with lots of meals!"],
          ["amara", "Families sometimes make huge batches together. That's called kimjang!"],
        ], "Korea: kimchi"),
        sc("classroom", ["amara:cheer", "polly:fly"], ["🍎 ground"], [
          ["amara", "Every country has its own yummy food!"],
          N("Trying a new food is like a tiny adventure for your taste buds."),
        ]),
        sc("classroom", ["amara:wave", "polly:wave"], ["🌍 air"], [
          ["polly", "What is your family's favorite food?"],
          N("Bon appétit! That means enjoy your meal, in French."),
        ]),
      ],
      [
        q("What is onigiri?", ["A rice ball", "A noodle", "A drink"], 0, "Onigiri are rice balls, often wrapped in seaweed."),
        q("What do people in Ethiopia use to scoop up stews?", ["Injera bread", "A shovel", "A straw"], 0, "Soft injera bread works like a spoon!"),
        q("Which country do tacos come from?", ["Mexico", "Korea", "Italy"], 0, "Tacos come from Mexico."),
      ],
      "Every culture has delicious foods, and trying new ones is a tasty adventure.",
    ),
  ],
});
