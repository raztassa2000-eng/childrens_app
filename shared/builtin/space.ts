import { N, cast, ep, q, sc, series } from "./dsl";

export default series({
  id: "space.rocket-rosie",
  category: "space",
  age: "6-8",
  title: "Rocket Rosie's Space Club",
  tagline: "Buckle up for real space adventures!",
  emoji: "🚀",
  cast: [
    cast("rosie", "Rosie", "👩‍🚀", "child", "A young astronaut-in-training who loves exploring."),
    cast("zip", "Zip", "🤖", "robot", "The rocket's chatty robot, full of space facts."),
  ],
  episodes: [
    ep(
      "Hello, Moon!",
      "The Moon",
      "Rosie and Zip fly to the Moon to see its craters, feel its weak gravity and learn why it shines.",
      [
        sc("city", ["rosie:wave", "zip:bounce"], ["🌙 sky"], [
          N("Meet Rocket Rosie and her robot friend, Zip!"),
          ["rosie", "Tonight we're flying to the Moon!"],
          ["zip", "Beep! Engines ready!"],
        ]),
        sc("sky", ["rosie:fly", "zip:fly"], ["🚀 air", "☁️ sky"], [
          N("Three, two, one, blast off! The rocket zooms up through the clouds."),
        ], "3, 2, 1, blast off!"),
        sc("space", ["rosie:fly", "zip:fly"], ["🌍 air", "🌙 sky"], [
          ["rosie", "Look back, Zip! Earth looks like a blue marble."],
          ["zip", "The Moon is so far away, it takes about three days to get there by rocket!"],
        ]),
        sc("space", ["rosie:idle", "zip:think"], ["🌙 sky"], [
          N("The Moon is covered in bowl-shaped holes called craters."),
          ["rosie", "Space rocks crashed into the Moon long ago and made them."],
          ["zip", "Some craters are so big, a whole city could fit inside!"],
        ], "Craters"),
        sc("space", ["zip:spin", "rosie:jump"], [], [
          ["zip", "The Moon has no air, so astronauts wear space suits to breathe."],
          ["rosie", "And look how high I can jump! The Moon's gravity is much weaker."],
        ], "No air"),
        sc("space", ["rosie:think", "zip:idle"], ["☀️ sky", "🌙 sky"], [
          ["rosie", "The Moon doesn't make its own light."],
          N("It shines because sunlight bounces off it, like light off a mirror."),
        ], "Moonlight"),
        sc("space", ["rosie:walk", "zip:walk"], ["👣 ground"], [
          N("Footprints can stay on the Moon for a very long time, because there's no wind to blow them away."),
          ["rosie", "The first person to walk on the Moon was Neil Armstrong, in 1969."],
        ], "Footprints"),
        sc("city", ["rosie:wave", "zip:wave"], ["🌙 sky", "⭐ sky"], [
          ["rosie", "Tonight, look up at the Moon and wave hello!"],
          ["zip", "Beep boop! See you on our next mission!"],
        ]),
      ],
      [
        q("What are the bowl-shaped holes on the Moon called?", ["Craters", "Puddles", "Caves"], 0, "Craters were made by space rocks crashing into the Moon."),
        q("Why does the Moon shine?", ["Sunlight bounces off it", "It has light bulbs", "It is on fire"], 0, "The Moon reflects light from the Sun."),
        q("Why do astronauts wear space suits on the Moon?", ["There is no air to breathe", "It's a costume party", "It's too sunny"], 0, "The Moon has no air, so astronauts bring their own."),
      ],
      "The Moon has craters and no air, and it shines because sunlight bounces off it.",
    ),
    ep(
      "Our Sun Is a Star",
      "The Sun",
      "Rosie and Zip discover that the Sun is the closest star, huge and hot, with light that races to Earth.",
      [
        sc("meadow", ["rosie:wave", "zip:bounce"], ["☀️ sky"], [
          N("It's a bright, sunny day."),
          ["rosie", "Zip, did you know the Sun is a star?"],
          ["zip", "A star? But stars come out at night!"],
        ]),
        sc("space", ["rosie:fly", "zip:fly"], ["☀️ sky"], [
          ["rosie", "The Sun is a star, just like the twinkly ones. It's the closest star to us!"],
          ["zip", "Beep! It looks bigger and brighter only because it's so much closer."],
        ], "The Sun is a star"),
        sc("space", ["zip:grow", "rosie:fly"], ["☀️ sky", "🌍 air"], [
          ["zip", "The Sun is huge! About a million Earths could fit inside it."],
        ], "1 million Earths!"),
        sc("space", ["rosie:think", "zip:fly"], ["☀️ sky"], [
          N("The Sun is a giant ball of super hot, glowing gas."),
          ["rosie", "It gives us light and keeps Earth warm."],
          ["zip", "Without the Sun, Earth would be dark and frozen. Brrr!"],
        ], "Hot gas"),
        sc("space", ["zip:spin", "rosie:idle"], ["☀️ sky", "🌍 air"], [
          ["zip", "Sunlight takes about eight minutes to travel all the way to Earth!"],
        ], "8 minutes"),
        sc("night", ["rosie:idle", "zip:think"], ["⭐ sky", "🌙 sky"], [
          ["rosie", "The other stars are suns too, but they are so far away they look tiny."],
          ["zip", "Some stars are even bigger than our Sun!"],
        ]),
        sc("meadow", ["rosie:wave", "zip:idle"], ["🧢 air", "☀️ sky"], [
          ["rosie", "Remember, never look straight at the Sun. It can hurt your eyes."],
          ["zip", "Hats on and sunscreen on! Beep!"],
        ], "Never look at the Sun!"),
        sc("meadow", ["rosie:cheer", "zip:cheer"], ["🌻 ground", "☀️ sky"], [
          N("Plants grow and we stay warm, all thanks to our star, the Sun!"),
        ]),
      ],
      [
        q("What is the Sun?", ["A star", "A planet", "A cloud"], 0, "The Sun is the star closest to Earth."),
        q("About how long does sunlight take to reach Earth?", ["About eight minutes", "About one year", "No time at all"], 0, "Sunlight zooms to Earth in about eight minutes."),
        q("What should you never do?", ["Look straight at the Sun", "Wear a hat", "Play in the shade"], 0, "Looking straight at the Sun can hurt your eyes."),
      ],
      "The Sun is our closest star, a giant ball of hot gas that gives Earth light and warmth.",
    ),
    ep(
      "Planet Parade",
      "The eight planets",
      "Rosie and Zip visit all eight planets in order and learn a trick to remember them.",
      [
        sc("space", ["rosie:fly", "zip:fly"], ["☀️ sky"], [
          N("Today, Rosie and Zip will visit all eight planets!"),
          ["rosie", "Let's start near the Sun. Buckle up!"],
        ]),
        sc("space", ["rosie:fly", "zip:fly"], ["☀️ sky"], [
          ["zip", "Mercury is the closest to the Sun. Venus is the hottest planet, covered in thick clouds."],
          ["rosie", "Venus is even hotter than Mercury, because its thick clouds trap the heat like a blanket!"],
        ], "Mercury & Venus"),
        sc("space", ["rosie:cheer", "zip:fly"], ["🌍 air"], [
          ["rosie", "Earth, our home! It has water and air, and it's the only planet we know with life."],
          N("Earth is just the right distance from the Sun: not too hot, and not too cold."),
        ], "Earth"),
        sc("space", ["rosie:fly", "zip:think"], ["🔴 air"], [
          N("Next comes Mars, the red planet."),
          ["zip", "Mars looks red because its dust has rust in it!"],
        ], "Mars"),
        sc("space", ["zip:grow", "rosie:fly"], ["🟠 air"], [
          ["zip", "Jupiter is the biggest planet. It has a giant storm called the Great Red Spot!"],
          ["rosie", "That storm is bigger than the whole Earth!"],
        ], "Jupiter"),
        sc("space", ["rosie:spin", "zip:fly"], ["🪐 air"], [
          ["rosie", "Saturn has beautiful rings made of ice and rock!"],
          ["zip", "Saturn is so light for its size, it could float in a giant bathtub!"],
        ], "Saturn"),
        sc("space", ["rosie:fly", "zip:shiver"], ["🔵 air"], [
          ["zip", "Uranus spins tipped over on its side. Neptune is the farthest and the windiest planet!"],
        ], "Uranus & Neptune"),
        sc("space", ["rosie:wave", "zip:wave"], ["☀️ sky", "🌍 air"], [
          N("To remember the order, say: My Very Excellent Mother Just Served Us Noodles!"),
          ["rosie", "Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune!"],
        ], "8 planets"),
      ],
      [
        q("Which planet is our home?", ["Earth", "Mars", "Neptune"], 0, "Earth is our home planet, full of water and life."),
        q("Which planet is the biggest?", ["Jupiter", "Mercury", "Mars"], 0, "Jupiter is the biggest planet in our solar system."),
        q("Why does Mars look red?", ["Its dust has rust in it", "It is very angry", "It is covered in strawberries"], 0, "Rusty dust makes Mars look red."),
      ],
      "Eight planets circle our Sun: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus and Neptune.",
    ),
  ],
});
