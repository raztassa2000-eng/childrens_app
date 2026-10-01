import { N, cast, ep, q, sc, series } from "./dsl";

export default series({
  id: "nature.nature-patrol",
  category: "nature",
  age: "6-8",
  title: "Fern & Nutty's Nature Patrol",
  tagline: "Two best friends, one amazing planet!",
  emoji: "🐸",
  cast: [
    cast("fern", "Fern", "🐸", "child", "A curious frog who loves weather and water."),
    cast("nutty", "Nutty", "🐿️", "silly", "A speedy squirrel who loves trees and jokes."),
  ],
  episodes: [
    ep(
      "Where Does Rain Come From?",
      "The water cycle",
      "Fern and Nutty follow a drop of water up into the clouds and back down as rain.",
      [
        sc("pond", ["fern:bounce", "nutty:idle"], ["☀️ sky"], [
          N("Welcome to the Nature Patrol!"),
          ["nutty", "Fern, where does rain come from?"],
          ["fern", "Let's follow a drop of water and find out!"],
        ]),
        sc("pond", ["fern:idle", "nutty:think"], ["☀️ sky", "💧 air"], [
          N("The sun warms the pond. Some water turns into an invisible gas and floats up."),
          ["nutty", "So puddles don't just disappear. They float away!"],
        ], "Evaporation"),
        sc("sky", ["fern:fly", "nutty:fly"], ["💧 air", "☁️ sky"], [
          ["fern", "High in the sky it's cold, so the water gas turns back into tiny drops."],
        ], "Up, up, up!"),
        sc("sky", ["nutty:think", "fern:fly"], ["☁️ sky", "☁️ air"], [
          N("Millions of tiny drops gather together and make a cloud. That's called condensation."),
          ["fern", "It's like when a cold glass of water gets wet on the outside!"],
        ], "Condensation"),
        sc("rainy", ["fern:jump", "nutty:shiver"], ["☁️ sky"], [
          N("When the drops get big and heavy, they fall as rain."),
          ["nutty", "Brr! That's called precipitation. What a big word!"],
        ], "Precipitation"),
        sc("rainy", ["fern:dance", "nutty:bounce"], ["💧 air"], [
          ["fern", "Rain fills rivers, lakes and oceans, and gives plants a drink."],
          ["nutty", "And snow and hail are made of water too!"],
        ]),
        sc("pond", ["fern:swim", "nutty:idle"], ["☀️ sky"], [
          N("Then the sun warms the water again, and it all starts over."),
          ["fern", "Round and round. That's the water cycle!"],
        ], "The water cycle"),
        sc("pond", ["fern:wave", "nutty:wave"], ["🌈 sky"], [
          ["nutty", "So the water I drink was once inside a cloud?"],
          ["fern", "Yes! Earth keeps using the same water again and again."],
        ]),
      ],
      [
        q("What makes water rise into the sky?", ["The sun warms it", "Frogs jump in it", "The wind pushes it sideways"], 0, "The sun's heat turns water into a gas that floats up."),
        q("What are clouds made of?", ["Tiny drops of water", "Cotton candy", "Smoke"], 0, "Clouds are millions of tiny water drops."),
        q("What is it called when rain falls from clouds?", ["Precipitation", "Celebration", "Construction"], 0, "Rain, snow and hail are all precipitation."),
      ],
      "In the water cycle, water rises, makes clouds, falls as rain, and starts all over again.",
    ),
    ep(
      "A Seed's Big Adventure",
      "How plants grow",
      "Nutty's buried acorn sprouts, and the friends learn what seeds need to grow into plants.",
      [
        sc("meadow", ["nutty:bounce", "fern:idle"], ["🌰 ground"], [
          ["nutty", "I buried an acorn last fall. Look, something is growing!"],
          N("A tiny green sprout pokes out of the ground."),
        ]),
        sc("meadow", ["fern:think", "nutty:idle"], ["🌱 ground"], [
          ["fern", "Every seed has a baby plant inside, waiting to grow."],
        ], "Seed"),
        sc("rainy", ["fern:jump", "nutty:idle"], ["💧 air", "🌱 ground"], [
          N("To grow, a seed needs water."),
          ["nutty", "A nice big drink!"],
          ["fern", "The water makes the seed swell up until its coat splits open."],
        ], "Water"),
        sc("meadow", ["nutty:dance", "fern:idle"], ["☀️ sky", "🌱 ground"], [
          ["fern", "Plants need sunlight too. Their leaves use sunlight to make food!"],
          ["nutty", "That's why plants on a windowsill lean toward the light!"],
        ], "Sunlight"),
        sc("forest", ["fern:think", "nutty:idle"], ["🌱 ground"], [
          N("Under the ground, roots grow down like tiny straws to drink water from the soil."),
        ], "Roots"),
        sc("forest", ["nutty:grow", "fern:bounce"], ["🌿 ground"], [
          ["nutty", "The stem grows up tall, and the leaves spread out to catch the sun."],
          ["fern", "Some trees, like giant redwoods, grow taller than a thirty-story building!"],
        ], "Stem and leaves"),
        sc("forest", ["fern:cheer", "nutty:cheer"], ["🌳 ground"], [
          N("Many years later, the little acorn becomes a giant oak tree!"),
          ["nutty", "And it will grow more acorns for squirrels like me!"],
        ], "Oak tree!"),
        sc("meadow", ["fern:wave", "nutty:wave"], ["🌈 sky"], [
          ["fern", "Seeds need water, sunlight and soil to grow."],
          N("Try planting a bean seed in a cup with a grown-up, and watch it grow!"),
        ]),
      ],
      [
        q("What does a seed need to grow?", ["Water, sunlight and soil", "Candy and toys", "Only darkness"], 0, "Seeds need water, sunlight and soil."),
        q("What do roots do?", ["Drink water from the soil", "Catch sunlight", "Make flowers smell nice"], 0, "Roots soak up water from the soil."),
        q("What does an acorn grow into?", ["An oak tree", "A pumpkin", "A rose"], 0, "Acorns are the seeds of oak trees."),
      ],
      "With water, sunlight and soil, a tiny seed can grow roots, a stem and leaves.",
    ),
    ep(
      "The Recycling Rescue",
      "Recycling",
      "Fern and Nutty clean up a beach and learn to reduce, reuse and recycle.",
      [
        sc("beach", ["fern:idle", "nutty:think"], ["☀️ sky", "🥤 ground"], [
          N("Fern and Nutty visit the beach."),
          ["nutty", "Oh no, look! Trash on the sand."],
        ]),
        sc("beach", ["fern:think", "🐢:walk:right"], ["🥤 ground"], [
          ["fern", "Trash can hurt animals like sea turtles. Let's help clean up!"],
          N("With gloves on and a grown-up nearby, they pick up the trash."),
        ]),
        sc("city", ["fern:bounce", "nutty:bounce"], ["♻️ air"], [
          ["nutty", "Lots of trash can be recycled. That means it gets made into something new!"],
          ["fern", "Old paper can become new paper, and old cans can become new cans!"],
        ], "Recycle"),
        sc("city", ["fern:think", "nutty:idle"], ["📦 ground", "🥫 ground"], [
          N("We sort it: paper, plastic, metal and glass each go in the right bin."),
          ["nutty", "Sorting is like a game. Cans in this bin, bottles in that one!"],
        ], "Sort it!"),
        sc("home", ["nutty:spin", "fern:idle"], ["📦 ground"], [
          ["fern", "We can reuse things too. This box can become a robot costume!"],
          ["nutty", "Or a squirrel house!"],
        ], "Reuse"),
        sc("home", ["fern:think", "nutty:idle"], ["🛍️ ground"], [
          N("Reduce means using less. A cloth bag can be used again and again."),
          ["nutty", "And turning off the tap while you brush your teeth saves water!"],
        ], "Reduce"),
        sc("beach", ["fern:cheer", "nutty:cheer", "🐢:swim"], ["☀️ sky"], [
          ["fern", "The beach is clean, and the turtle is happy!"],
        ], "Clean beach!"),
        sc("meadow", ["fern:wave", "nutty:wave"], ["🌈 sky"], [
          ["nutty", "Reduce, reuse, recycle!"],
          N("Little actions help our big planet. What can you recycle today?"),
        ], "Reduce, reuse, recycle"),
      ],
      [
        q("What does recycle mean?", ["Making old things into new things", "Throwing everything away", "Hiding trash"], 0, "Recycling turns used things into new things."),
        q("Why is trash on the beach a problem?", ["It can hurt animals", "It makes the sand softer", "Turtles like to eat it"], 0, "Trash can hurt sea animals like turtles."),
        q("What does reuse mean?", ["Using something again", "Breaking it", "Buying a new one"], 0, "Reusing means giving things another job."),
      ],
      "Reduce, reuse and recycle to keep our planet clean for people and animals.",
    ),
  ],
});
