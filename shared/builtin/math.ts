import { N, cast, ep, q, sc, series } from "./dsl";

export default series({
  id: "math.cocos-counting-garden",
  category: "math",
  age: "3-5",
  title: "Coco's Counting Garden",
  tagline: "Count, add and find shapes with a bouncy bunny!",
  emoji: "🐰",
  cast: [
    cast("coco", "Coco", "🐰", "child", "A bouncy bunny who loves to count everything."),
    cast("pip", "Pip", "🐥", "high", "A tiny chick who is just learning numbers."),
  ],
  episodes: [
    ep(
      "Five Little Carrots",
      "Counting to five",
      "Coco and Pip count the carrots in the garden, all the way up to five.",
      [
        sc("farm", ["coco:bounce:left", "pip:jump:right"], ["☀️ sky", "🥕 ground"], [
          N("Welcome to Coco's Counting Garden!"),
          ["coco", "Hi! I'm Coco. I love to count!"],
          ["pip", "Peep! I'm Pip. Can we count together?"],
        ]),
        sc("farm", ["coco:idle", "pip:think"], ["🥕 ground"], [
          ["coco", "Look, Pip! Carrots are growing in my garden."],
          ["pip", "How many carrots are there?"],
        ]),
        sc("farm", ["coco:grow", "pip:bounce"], ["🥕 ground"], [
          N("Let's count them! One carrot."),
          ["coco", "One! Can you hold up one finger?"],
        ], "1"),
        sc("farm", ["coco:bounce", "pip:bounce"], ["🥕 ground", "🥕 ground"], [
          N("Here's another carrot. One, two!"),
          ["pip", "Two carrots! Peep, peep!"],
        ], "1, 2"),
        sc("farm", ["coco:jump", "pip:wiggle"], ["🥕 ground", "🥕 ground", "🥕 air"], [
          N("One, two, three carrots!"),
          ["coco", "Three! Hold up three fingers!"],
        ], "1, 2, 3"),
        sc("farm", ["coco:dance", "pip:dance"], ["🥕 ground", "🥕 ground", "🥕 air", "🥕 air"], [
          N("Four carrots! Let's count: one, two, three, four."),
          ["pip", "Four! We're getting so good at this!"],
        ], "1, 2, 3, 4"),
        sc("farm", ["coco:cheer", "pip:cheer"], ["🥕 ground", "🥕 ground", "🥕 air", "🥕 air"], [
          N("And one more makes five! One, two, three, four, five!"),
          ["pip", "Five carrots! That's a whole hand!"],
        ], "5!"),
        sc("meadow", ["coco:wave", "pip:wave"], ["🌈 sky"], [
          ["coco", "We counted to five! You did it!"],
          N("Count your fingers tonight: one, two, three, four, five!"),
        ]),
      ],
      [
        q("How many carrots did Coco find in the end?", ["Five", "Two", "Ten"], 0, "Coco and Pip counted five carrots, one for each finger on a hand!"),
        q("What number comes after three?", ["Four", "One", "Seven"], 0, "One, two, three, four! Four comes after three."),
      ],
      "We can count things one by one: one, two, three, four, five!",
    ),
    ep(
      "The Shape Hunt",
      "Circles, squares and triangles",
      "Coco and Pip hunt for circles, squares and triangles all around them.",
      [
        sc("park", ["coco:bounce", "pip:bounce"], ["☀️ sky"], [
          N("Today Coco and Pip go on a shape hunt!"),
          ["coco", "Shapes are everywhere. Let's find them!"],
        ]),
        sc("park", ["coco:think", "pip:idle"], ["☀️ sky"], [
          ["pip", "Look up! The sun is round like a circle."],
          N("A circle is round, round, round, with no corners."),
        ], "Circle"),
        sc("park", ["coco:spin", "pip:jump"], ["⚽ ground"], [
          ["coco", "My ball is a circle too! It rolls and rolls."],
          ["pip", "Roll, roll, roll!"],
        ], "Circle"),
        sc("home", ["coco:idle", "pip:think"], [], [
          N("A square has four sides, all the same size."),
          ["pip", "The window is a square! One, two, three, four sides."],
        ], "Square"),
        sc("home", ["coco:bounce", "pip:wiggle"], ["🎁 ground"], [
          ["coco", "This present box has square sides too!"],
          ["pip", "Square, square, everywhere!"],
        ], "Square"),
        sc("park", ["coco:walk", "pip:walk"], ["⛺ ground"], [
          N("A triangle has three sides and three pointy corners."),
          ["pip", "The tent is a triangle! Like a slice of pizza!"],
        ], "Triangle"),
        sc("park", ["coco:dance", "pip:dance"], ["🍕 air", "⛺ ground"], [
          ["coco", "Let's draw a triangle in the air. Up, down, across!"],
          N("One, two, three corners!"),
        ], "3 corners"),
        sc("meadow", ["coco:cheer", "pip:cheer"], ["🌈 sky"], [
          N("Circles, squares and triangles. Shapes are everywhere!"),
          ["pip", "What shapes can you find at home?"],
        ]),
      ],
      [
        q("Which shape is round with no corners?", ["Circle", "Square", "Triangle"], 0, "A circle is round and has no corners at all."),
        q("How many sides does a triangle have?", ["Three", "Five", "One"], 0, "A triangle has three sides and three corners."),
      ],
      "A circle is round, a square has four equal sides, and a triangle has three sides.",
    ),
    ep(
      "One More, Please!",
      "Adding one more",
      "At a picnic, Coco and Pip discover that adding one more makes the number go up by one.",
      [
        sc("farm", ["coco:idle", "pip:bounce"], ["☀️ sky"], [
          N("Coco is having a picnic with her friends."),
          ["coco", "I have two apples for our picnic."],
        ]),
        sc("farm", ["coco:think", "pip:think"], ["🍎 ground", "🍎 ground"], [
          ["pip", "Two apples for two friends. Yum!"],
          N("But wait. Who is that waddling over?"),
        ], "2"),
        sc("farm", ["🦆:walk:right", "coco:wave", "pip:jump"], ["🍎 ground", "🍎 ground"], [
          N("Quack, quack! Ducky wants to join the picnic."),
          ["coco", "Welcome, Ducky! We need one more apple."],
        ]),
        sc("farm", ["coco:walk", "pip:walk"], ["🍎 air", "🌳 ground"], [
          N("Coco finds an apple under the tree. Plop!"),
          ["pip", "One more apple!"],
        ]),
        sc("farm", ["coco:bounce", "pip:bounce"], ["🍎 ground", "🍎 ground", "🍎 ground"], [
          ["coco", "Two apples and one more makes three!"],
          N("Two plus one equals three."),
        ], "2 + 1 = 3"),
        sc("farm", ["coco:jump", "pip:cheer", "🦆:dance"], ["🍎 ground", "🍎 ground", "🍎 ground"], [
          ["pip", "Three friends and three apples. Crunch, crunch!"],
        ], "3"),
        sc("farm", ["coco:think", "pip:idle"], ["🍓 ground", "🍓 ground", "🍓 ground", "🍓 air"], [
          N("Now let's try with berries. Three berries and one more?"),
          ["pip", "Four berries! One more makes the number grow!"],
        ], "3 + 1 = 4"),
        sc("meadow", ["coco:wave", "pip:wave", "🦆:wave"], ["🌈 sky"], [
          ["coco", "When we add one more, we count up one!"],
          N("Can you add one more toy to your pile?"),
        ]),
      ],
      [
        q("Coco had two apples and found one more. How many now?", ["Three", "Two", "Five"], 0, "Two plus one equals three!"),
        q("What happens when you add one more?", ["The number gets bigger", "The number gets smaller", "Nothing changes"], 0, "Adding one more makes the number go up by one."),
      ],
      "When we add one more, the number goes up by one. Two plus one is three!",
    ),
  ],
});
