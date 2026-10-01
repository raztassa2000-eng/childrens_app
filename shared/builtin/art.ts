import { N, cast, ep, q, sc, series } from "./dsl";

export default series({
  id: "art.paint-party",
  category: "art",
  age: "6-8",
  title: "Luna & Pablo's Paint Party",
  tagline: "Mix colors, make music and draw anything!",
  emoji: "🎨",
  cast: [
    cast("luna", "Luna", "🦄", "high", "A unicorn artist who loves every color."),
    cast("pablo", "Pablo", "🐧", "silly", "A penguin who makes music out of everything."),
  ],
  episodes: [
    ep(
      "Mixing Magic",
      "Mixing colors",
      "Luna and Pablo mix primary colors to make orange, green and purple.",
      [
        sc("stage", ["luna:bounce", "pablo:dance"], ["🎨 air"], [
          N("Welcome to the Paint Party!"),
          ["luna", "Today we're making new colors with mixing magic!"],
        ]),
        sc("stage", ["luna:idle", "pablo:think"], ["🔴 air", "🟡 air", "🔵 air"], [
          ["luna", "Red, yellow and blue are primary colors. We can't make them by mixing other paints."],
        ], "Red, yellow, blue"),
        sc("stage", ["pablo:spin", "luna:idle"], ["🔴 air", "🟡 air"], [
          N("Pablo mixes red and yellow. Swirl, swirl!"),
          ["pablo", "Orange! Like a juicy orange!"],
        ], "Red + yellow = orange"),
        sc("stage", ["luna:spin", "pablo:idle"], ["🟡 air", "🔵 air"], [
          ["luna", "Yellow and blue make green, like leaves and frogs!"],
          ["pablo", "Green is my second favorite color, after penguin black and white!"],
        ], "Yellow + blue = green"),
        sc("stage", ["pablo:wiggle", "luna:bounce"], ["🔴 air", "🔵 air"], [
          ["pablo", "Red and blue make purple! Purple penguin party!"],
        ], "Red + blue = purple"),
        sc("stage", ["luna:think", "pablo:idle"], ["🟠 air", "🟢 air", "🟣 air"], [
          N("Orange, green and purple are called secondary colors. We make them by mixing two primary colors."),
        ], "Secondary colors"),
        sc("stage", ["luna:grow", "pablo:idle"], ["⚪ air", "🔴 air"], [
          ["luna", "Adding white makes colors lighter. Red and white make pink!"],
          ["pablo", "And adding black makes colors darker, like a stormy blue."],
        ], "Add white"),
        sc("stage", ["pablo:dance", "luna:dance"], ["🌈 air"], [
          N("Put the colors in a circle, and you get a color wheel, like a rainbow holding hands."),
          ["luna", "Colors across from each other, like red and green, make each other pop!"],
        ], "Color wheel"),
        sc("stage", ["luna:cheer", "pablo:cheer"], ["🎨 air"], [
          ["luna", "Grab some paints and try your own mixing magic!"],
          ["pablo", "And don't forget to wash your brushes!"],
        ]),
      ],
      [
        q("What are the three primary colors?", ["Red, yellow and blue", "Pink, brown and gray", "Green, orange and purple"], 0, "Red, yellow and blue can mix into lots of other colors."),
        q("What do yellow and blue make?", ["Green", "Orange", "Red"], 0, "Yellow plus blue makes green!"),
        q("What happens when you add white to a color?", ["It gets lighter", "It disappears", "It turns into music"], 0, "White makes colors lighter, like red into pink."),
      ],
      "Red, yellow and blue are primary colors, and mixing them makes orange, green and purple.",
    ),
    ep(
      "Music Is Everywhere",
      "Rhythm and instruments",
      "Pablo starts a kitchen band, and the friends learn about beats, high and low notes and instruments.",
      [
        sc("stage", ["pablo:dance", "luna:bounce"], ["🎵 air"], [
          N("Pablo has a surprise: a kitchen band!"),
          ["pablo", "Music is everywhere, even in the kitchen!"],
        ]),
        sc("home", ["pablo:bounce", "luna:idle"], ["🥁 air"], [
          ["pablo", "Tap a pot with a wooden spoon: boom, boom, boom. That steady pattern is a beat!"],
        ], "Beat"),
        sc("home", ["luna:dance", "pablo:bounce"], ["🎵 air"], [
          N("Clap along with the beat! Clap, clap, clap, clap!"),
          ["pablo", "Now stomp and clap! Stomp, clap, stomp, clap!"],
        ], "Clap the beat"),
        sc("home", ["luna:think", "pablo:idle"], ["🥛 ground", "🥛 ground"], [
          ["luna", "Glasses with different amounts of water make different notes when you tap them gently."],
          N("More water makes a lower sound. Less water makes a higher sound."),
        ], "High and low"),
        sc("stage", ["pablo:wiggle", "luna:idle"], ["🎸 air", "🎻 air"], [
          N("Guitars and violins have strings. When strings shake back and forth, or vibrate, they make sound."),
        ], "Strings"),
        sc("stage", ["luna:grow", "pablo:idle"], ["🎺 air", "🎷 air"], [
          ["pablo", "Trumpets and saxophones make music with air. Blow and toot!"],
        ], "Wind"),
        sc("stage", ["pablo:dance", "luna:dance"], ["🥁 air", "🪘 air"], [
          N("Drums are percussion instruments. You hit, shake or tap them."),
        ], "Drums"),
        sc("stage", ["luna:cheer", "pablo:cheer"], ["🎶 air"], [
          ["luna", "Let's play together! Pots for drums and glasses for bells!"],
          N("Boom, ting, toot! The kitchen band plays its very first song."),
        ], "Band time!"),
        sc("stage", ["pablo:wave", "luna:wave"], ["🎵 air"], [
          ["pablo", "Find things at home that make sounds, and start your own band!"],
          N("Just ask a grown-up which things are okay to tap."),
        ]),
      ],
      [
        q("What is a beat?", ["A steady pattern in music", "A kind of vegetable", "A sleeping sound"], 0, "A beat is the steady pulse you can clap along to."),
        q("What do strings do to make sound?", ["Vibrate", "Melt", "Glow"], 0, "Strings shake back and forth, or vibrate, to make sound."),
        q("Which instrument is a percussion instrument?", ["Drum", "Violin", "Trumpet"], 0, "You hit, shake or tap percussion instruments like drums."),
      ],
      "Music has beats and high and low notes, and we can make it with strings, air, drums, and even pots!",
    ),
    ep(
      "Shapes Make Pictures",
      "Drawing with shapes",
      "Pablo thinks he can't draw, until Luna shows him that every picture starts with simple shapes.",
      [
        sc("stage", ["luna:bounce", "pablo:idle"], ["✏️ air"], [
          N("Pablo wants to draw a cat, but he's worried."),
          ["pablo", "I can't draw! It's too hard."],
        ]),
        sc("classroom", ["luna:idle", "pablo:think"], ["✏️ air"], [
          ["luna", "Here's a secret: every picture is made of simple shapes!"],
        ], "Start with shapes"),
        sc("classroom", ["luna:idle", "pablo:bounce"], ["⚪ air"], [
          N("Draw a big circle for the cat's head."),
          ["pablo", "Okay, a circle!"],
        ], "Circle = head"),
        sc("classroom", ["pablo:idle", "luna:idle"], ["🔺 air"], [
          ["luna", "Now add two triangles on top for ears."],
          ["pablo", "Two triangles. Pointy ears, check!"],
        ], "Triangles = ears"),
        sc("classroom", ["pablo:jump", "luna:cheer"], ["🐱 air"], [
          N("Two dots for eyes, a tiny triangle nose, and lines for whiskers."),
          ["pablo", "Look! It's a cat! I did it!"],
        ], "Meow!"),
        sc("stage", ["luna:think", "pablo:idle"], ["🔵 air", "🟥 air"], [
          ["luna", "A painter named Wassily Kandinsky made famous paintings full of circles and squares."],
          ["luna", "He said colors made him think of music!"],
        ], "Kandinsky"),
        sc("stage", ["pablo:spin", "luna:idle"], ["✂️ air"], [
          N("Henri Matisse cut shapes out of painted paper to make art. He called it drawing with scissors."),
          ["pablo", "Snip, snip! I want to try that!"],
        ], "Matisse"),
        sc("stage", ["luna:dance", "pablo:dance"], ["🎨 air"], [
          ["luna", "In art, mistakes can turn into happy surprises!"],
          ["pablo", "Like when I made my cat purple!"],
        ], "Mistakes are okay!"),
        sc("stage", ["luna:wave", "pablo:wave"], ["🖍️ air"], [
          N("Grab a crayon and draw something using only circles, squares and triangles!"),
        ]),
      ],
      [
        q("What can we use to start any drawing?", ["Simple shapes", "Only glitter", "Nothing"], 0, "Circles, squares and triangles can build any picture."),
        q("Which shapes did Pablo use for the cat's ears?", ["Triangles", "Squares", "Stars"], 0, "Two triangles make great cat ears."),
        q("How did Henri Matisse make some of his art?", ["By cutting shapes from paper", "By building with snow", "By painting with his feet"], 0, "Matisse called it drawing with scissors."),
      ],
      "Every picture can start with simple shapes, and in art, mistakes can become happy surprises.",
    ),
  ],
});
