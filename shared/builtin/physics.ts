import { N, cast, ep, q, sc, series } from "./dsl";

export default series({
  id: "physics.professor-hoots-wonder-lab",
  category: "physics",
  age: "6-8",
  title: "Professor Hoot's Wonder Lab",
  tagline: "Where every question turns into an experiment!",
  emoji: "🦉",
  cast: [
    cast("hoot", "Professor Hoot", "🦉", "wise", "A curious owl scientist who loves experiments."),
    cast("mia", "Mia", "👧", "child", "A girl who always asks why."),
    cast("bolt", "Bolt", "🤖", "robot", "A helpful robot who measures everything."),
  ],
  episodes: [
    ep(
      "Why Do Things Fall?",
      "Gravity",
      "Mia and Professor Hoot discover gravity, air resistance and a famous experiment on the Moon.",
      [
        sc("lab", ["hoot:wave:left", "mia:bounce", "bolt:idle"], ["🍎 air"], [
          N("Welcome to Professor Hoot's Wonder Lab, where questions turn into discoveries!"),
          ["mia", "Professor Hoot, why do things always fall down?"],
          ["hoot", "Hoo! Let's find out with an experiment."],
        ]),
        sc("meadow", ["mia:think", "hoot:idle"], ["🍎 air", "🌳 ground"], [
          N("Mia drops an apple. It falls straight to the ground."),
          ["mia", "It never falls up. Why not?"],
        ]),
        sc("meadow", ["hoot:grow", "mia:idle"], ["🌍 sky"], [
          ["hoot", "A pulling force called gravity pulls things toward the Earth."],
          N("Gravity is an invisible pull. You can't see it, but it's always there."),
        ], "Gravity!"),
        sc("lab", ["bolt:spin", "mia:jump"], ["🪶 air", "⚽ air"], [
          ["bolt", "Test time! I will drop a feather and a ball. Beep!"],
          N("The ball lands first. The feather floats down slowly."),
        ], "Feather or ball?"),
        sc("lab", ["mia:think", "hoot:idle", "bolt:idle"], ["🪶 air"], [
          ["hoot", "Air pushes against the feather and slows it down. That's called air resistance."],
          ["mia", "So the air gets in the feather's way!"],
        ], "Air resistance"),
        sc("space", ["hoot:fly", "🧑‍🚀:fly"], ["🪶 air", "🔨 air"], [
          N("Long ago, an astronaut on the Moon tried this experiment too."),
          ["hoot", "With no air on the Moon, a hammer and a feather landed at the same time!"],
        ], "On the Moon"),
        sc("park", ["mia:jump", "bolt:jump", "hoot:cheer"], ["☀️ sky"], [
          ["mia", "When I jump, gravity pulls me back down!"],
          ["bolt", "Gravity keeps us on the ground, so we don't float away. Beep boop!"],
        ], "Jump!"),
        sc("lab", ["hoot:wave", "mia:wave", "bolt:wave"], ["⭐ air"], [
          ["hoot", "Gravity pulls everything toward Earth, from apples to you!"],
          N("Try it at home: drop a sock and a toy at the same time. Which lands first?"),
        ]),
      ],
      [
        q("What pulls things down to the ground?", ["Gravity", "Wind", "Magic"], 0, "Gravity is the invisible pull of the Earth."),
        q("Why does a feather fall slowly?", ["Air pushes against it", "It is heavier", "It is sleepy"], 0, "Air resistance slows the feather down."),
        q("What happened when a hammer and feather were dropped on the Moon?", ["They landed together", "The feather floated away", "The hammer went up"], 0, "With no air on the Moon, they landed at the same time!"),
      ],
      "Gravity pulls everything toward the Earth, and air can slow light things down.",
    ),
    ep(
      "The Magic of Magnets",
      "Magnets",
      "Bolt finds a magnet, and the team tests what it pulls and how its two poles push and pull.",
      [
        sc("lab", ["bolt:bounce", "mia:idle", "hoot:idle"], ["🧲 air"], [
          N("Bolt has found something exciting in a drawer."),
          ["bolt", "Beep! What is this red horseshoe?"],
          ["hoot", "That's a magnet!"],
        ]),
        sc("lab", ["mia:think", "hoot:idle"], ["🧲 air", "📎 ground"], [
          ["hoot", "A magnet can pull some things toward it without even touching them!"],
          ["mia", "Let's test it on a paper clip."],
        ], "Magnet"),
        sc("lab", ["mia:jump", "hoot:cheer"], ["🧲 air", "📎 air"], [
          N("Zip! The paper clip jumps onto the magnet."),
          ["mia", "Whoa! It pulled the clip right to it!"],
          ["hoot", "That pull is called magnetic force. It even works through the air!"],
        ], "Click!"),
        sc("lab", ["bolt:spin", "mia:think"], ["🪵 ground", "🔩 ground", "🧸 ground"], [
          ["bolt", "Testing more things: a wooden block, a steel bolt and a teddy bear."],
          N("Only the steel bolt sticks to the magnet."),
        ], "Which will stick?"),
        sc("lab", ["bolt:dance", "hoot:idle"], ["🔩 air"], [
          ["hoot", "Magnets pull things made of iron or steel, like this bolt."],
          ["bolt", "A bolt, like me! Beep beep!"],
        ], "Iron and steel"),
        sc("lab", ["mia:idle", "hoot:idle"], ["🧲 air"], [
          ["hoot", "Every magnet has two ends called poles: north and south."],
          N("Opposite poles pull together. The same poles push apart!"),
        ], "North and south"),
        sc("lab", ["mia:jump", "bolt:shiver"], ["🧲 air", "🧲 air"], [
          ["mia", "When I turn one magnet around, they push away. It feels like an invisible cushion!"],
          ["bolt", "Testing: north and north push away. North and south snap together. Beep!"],
        ], "Push! Pull!"),
        sc("home", ["mia:wave", "hoot:wave", "bolt:wave"], ["🧲 air"], [
          N("Magnets hold up drawings on fridges, and they hide inside toys and speakers."),
          ["hoot", "Look for magnets around your home!"],
          ["mia", "Even the Earth acts like a giant magnet. That's why a compass needle points north!"],
        ]),
      ],
      [
        q("What does a magnet pull?", ["Things made of iron or steel", "Wood", "Paper"], 0, "Magnets attract iron and steel."),
        q("What happens when two north poles meet?", ["They push apart", "They stick together", "They melt"], 0, "The same poles push each other away."),
        q("Where might you find a magnet at home?", ["On the fridge door", "Inside an apple", "In a cookie"], 0, "Fridge magnets hold up drawings!"),
      ],
      "Magnets pull things made of iron or steel, and their poles can pull together or push apart.",
    ),
    ep(
      "Shadow Play",
      "Light and shadows",
      "Mia meets her shadow and learns how blocked light makes shadows that grow and shrink.",
      [
        sc("park", ["mia:walk", "hoot:idle"], ["☀️ sky"], [
          N("It's a sunny morning in the park."),
          ["mia", "Professor, something dark is following me!"],
          ["hoot", "Hoo, hoo! That's your shadow."],
        ]),
        sc("park", ["hoot:idle", "mia:think"], ["☀️ sky"], [
          ["hoot", "Light travels in straight lines. Your body blocks the light, so a dark shape appears behind you."],
        ], "Shadow"),
        sc("park", ["mia:dance", "bolt:dance"], ["☀️ sky"], [
          N("Mia dances, and her shadow dances too!"),
          ["mia", "It copies everything I do!"],
          ["bolt", "My shadow is copying my robot dance! Beep boop!"],
        ]),
        sc("park", ["bolt:think", "hoot:idle"], ["☀️ sky"], [
          ["bolt", "In the morning, my shadow is long. Beep!"],
          ["hoot", "When the sun is low in the sky, shadows stretch out long."],
        ], "Morning: long"),
        sc("meadow", ["mia:idle", "bolt:idle"], ["☀️ sky"], [
          N("At lunchtime, the sun is high in the sky."),
          ["mia", "Now my shadow is short and small!"],
          ["bolt", "The sun is high above us, so our shadows stay close to our feet."],
        ], "Noon: short"),
        sc("home", ["mia:wave", "hoot:idle"], ["🔦 air"], [
          ["hoot", "Inside, we can make shadows with a flashlight."],
          ["mia", "Look! My hands make a bunny shadow on the wall."],
          N("Hands can make birds, dogs, and even dragons on the wall!"),
        ], "Shadow puppets"),
        sc("home", ["bolt:grow", "mia:jump"], ["🔦 air"], [
          ["bolt", "When I move closer to the light, my shadow grows bigger!"],
          N("Things close to the light make big shadows."),
        ], "Closer = bigger"),
        sc("park", ["hoot:wave", "mia:wave", "bolt:wave"], ["🌈 sky"], [
          ["hoot", "Shadows happen when something blocks the light. And never look straight at the sun!"],
          N("Go outside with a grown-up and find your shadow!"),
        ]),
      ],
      [
        q("How is a shadow made?", ["Something blocks the light", "The sun gets tired", "Rain falls"], 0, "When something blocks light, a shadow appears behind it."),
        q("When is your shadow shortest?", ["At lunchtime, when the sun is high", "Early in the morning", "In the evening"], 0, "When the sun is high in the sky, shadows are short."),
        q("How can you make a bigger shadow with a flashlight?", ["Move closer to the light", "Move far away", "Close your eyes"], 0, "Things closer to the light make bigger shadows."),
      ],
      "Shadows form when something blocks light, and they change size as the light moves.",
    ),
  ],
});
