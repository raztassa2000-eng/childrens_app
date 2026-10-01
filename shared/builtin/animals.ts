import { N, cast, ep, q, sc, series } from "./dsl";

export default series({
  id: "animals.leo-jungle-club",
  category: "animals",
  age: "3-5",
  title: "Leo's Jungle Club",
  tagline: "A little lion meets the most amazing animals!",
  emoji: "🦁",
  cast: [
    cast("leo", "Leo", "🦁", "child", "A brave little lion cub who loves asking questions."),
    cast("tiki", "Tiki", "🐒", "silly", "A giggly monkey who knows every tree in the jungle."),
    cast("gigi", "Gigi", "🦒", "gentle", "A kind giraffe, the tallest friend in the grassland."),
    cast("ellie", "Ellie", "🐘", "deep", "A splashy elephant with a very useful trunk."),
    cast("olive", "Olive", "🦉", "wise", "A wise owl who stays up all night."),
  ],
  episodes: [
    ep(
      "The Tallest Friend",
      "Giraffes",
      "Leo and Tiki meet Gigi the giraffe and learn why giraffes have such long necks.",
      [
        sc("jungle", ["leo:wave:left", "tiki:bounce:right"], ["☀️ sky", "🦋 air"], [
          N("Welcome to the Jungle Club!"),
          ["leo", "Hi friends! I'm Leo, the little lion."],
          ["tiki", "And I'm Tiki! Let's meet a new animal today!"],
        ]),
        sc("meadow", ["leo:walk", "tiki:walk"], ["☁️ sky", "🌳 ground"], [
          N("Leo and Tiki walk to the big, sunny grassland."),
          ["leo", "Look! Yummy leaves, way up high!"],
          ["tiki", "Too high for us. Who can reach them?"],
        ]),
        sc("meadow", ["gigi:walk:right", "leo:jump", "tiki:wiggle"], ["🌳 ground", "☁️ sky"], [
          N("Stomp, stomp! Here comes someone very tall."),
          ["gigi", "Hello! I'm Gigi the giraffe."],
          ["leo", "Wow! Your neck is so long!"],
        ], "Giraffe"),
        sc("meadow", ["gigi:grow", "leo:think"], ["🌳 ground", "🏠 ground"], [
          ["gigi", "Giraffes are the tallest animals in the whole world!"],
          N("A grown-up giraffe is taller than a house."),
        ], "Tallest animal!"),
        sc("meadow", ["gigi:idle", "tiki:bounce"], ["🍃 air", "🌳 ground"], [
          ["tiki", "Gigi, can you get those leaves?"],
          ["gigi", "Easy! I stretch my long neck. Munch, munch!"],
        ]),
        sc("meadow", ["gigi:wave", "leo:cheer", "tiki:cheer"], ["🍃 air"], [
          ["gigi", "My tongue is long too. It helps me grab leaves!"],
          ["leo", "Can you stick out your tongue? Ha ha!"],
        ], "Long tongue!"),
        sc("meadow", ["gigi:bounce", "leo:jump", "tiki:jump"], ["☀️ sky"], [
          N("Let's stretch up tall like Gigi. One, two, three!"),
          ["tiki", "Stretch, stretch! I'm a giraffe too!"],
        ], "1, 2, 3!"),
        sc("jungle", ["leo:wave", "gigi:wave", "tiki:wave"], ["🌈 sky"], [
          ["leo", "Thank you, Gigi! Bye-bye!"],
          N("Giraffes have long necks to reach high leaves. See you next time!"),
        ]),
      ],
      [
        q("Which animal is the tallest in the world?", ["Giraffe", "Monkey", "Lion"], 0, "Giraffes are the tallest animals of all!"),
        q("What does Gigi eat from the tall trees?", ["Leaves", "Fish", "Cookies"], 0, "Giraffes stretch their long necks to munch leaves."),
      ],
      "Giraffes are the tallest animals, and their long necks help them reach high leaves.",
    ),
    ep(
      "Ellie's Terrific Trunk",
      "Elephants",
      "At the water hole, Ellie the elephant shows everything her trunk can do.",
      [
        sc("jungle", ["leo:shiver", "tiki:wiggle"], ["☀️ sky"], [
          N("It's a hot, hot day at the Jungle Club."),
          ["tiki", "Phew! I'm so hot, Leo!"],
          ["leo", "Let's go to the water hole!"],
        ]),
        sc("pond", ["leo:walk:left", "tiki:walk:left", "ellie:idle"], ["☀️ sky", "🌿 ground"], [
          N("At the water hole, they meet a big, gray friend."),
          ["ellie", "Hello! I'm Ellie the elephant."],
        ]),
        sc("pond", ["ellie:wave", "leo:think"], ["☁️ sky"], [
          ["leo", "Ellie, what is that long thing on your face?"],
          ["ellie", "This is my trunk! It's my nose and my helper."],
        ], "Trunk"),
        sc("pond", ["ellie:grow", "tiki:jump"], ["💧 air"], [
          N("Ellie sucks up water with her trunk. Slurp!"),
          ["ellie", "Then I squirt it into my mouth to drink."],
        ], "Slurp!"),
        sc("pond", ["ellie:dance", "leo:jump", "tiki:cheer"], ["💦 air"], [
          ["ellie", "Want a cool shower? Here comes the water!"],
          N("Splash! Leo and Tiki get nice and wet."),
          ["tiki", "Hee hee! That tickles!"],
        ], "Splash!"),
        sc("pond", ["ellie:idle", "leo:bounce"], ["🍉 ground"], [
          ["ellie", "My trunk can pick things up, like this yummy melon."],
          ["leo", "Wow! A nose that works like a hand!"],
        ]),
        sc("pond", ["ellie:wave", "leo:wave", "tiki:wave"], ["🌸 ground"], [
          N("Can you make a trunk with your arm? Swing it like Ellie!"),
          ["tiki", "Swing, swing! Toot, toot!"],
        ], "Swing!"),
        sc("jungle", ["leo:cheer", "ellie:bounce", "tiki:cheer"], ["🌈 sky"], [
          ["ellie", "I use my trunk to smell, drink and say hello."],
          ["leo", "Thank you, Ellie! See you soon, friends!"],
        ]),
      ],
      [
        q("What is an elephant's trunk?", ["A long nose", "A tail", "A hat"], 0, "The trunk is the elephant's nose, and it works like a helper hand!"),
        q("How does Ellie cool off on a hot day?", ["She sprays water with her trunk", "She eats ice cream", "She flies away"], 0, "Elephants spray water over their backs to cool down."),
      ],
      "An elephant's trunk is a long nose that helps it drink, smell, spray water and pick things up.",
    ),
    ep(
      "The Night Owls",
      "Nocturnal animals",
      "When the sun goes down, Leo and Tiki discover animals that wake up at night.",
      [
        sc("jungle", ["leo:idle", "tiki:bounce"], ["☁️ sky"], [
          N("The sun is going down in the jungle."),
          ["leo", "Yawn! It's almost bedtime, Tiki."],
          ["tiki", "But Leo, some animals are just waking up!"],
        ]),
        sc("night", ["leo:walk:left", "tiki:walk:left"], ["🌙 sky", "⭐ sky"], [
          N("The sky is dark. The moon is shining."),
          ["leo", "Who is awake at night?"],
        ]),
        sc("night", ["olive:fly:top", "leo:jump"], ["🌙 sky"], [
          ["olive", "Hoo, hoo! Hello! I'm Olive the owl."],
          N("Owls are awake at night. They sleep in the day."),
        ], "Hoo! Hoo!"),
        sc("night", ["olive:idle", "tiki:think"], ["🌙 sky"], [
          ["tiki", "Olive, how can you see in the dark?"],
          ["olive", "My big eyes help me see when it's dark."],
        ], "Big eyes"),
        sc("night", ["🦇:fly:right", "olive:idle", "leo:wave"], ["⭐ sky"], [
          N("Flap, flap! A little bat flies by."),
          ["olive", "Bats love the night too. They listen to find their way."],
        ], "Bat"),
        sc("night", ["🦔:walk:left", "tiki:bounce"], ["🍂 ground", "⭐ sky"], [
          N("Sniff, sniff! A hedgehog looks for bugs to eat."),
          ["tiki", "So many night friends!"],
        ], "Hedgehog"),
        sc("night", ["olive:wave", "leo:think", "tiki:bounce"], ["🌙 sky", "⭐ air"], [
          N("Animals that wake up at night are called nocturnal."),
          ["leo", "Noc, tur, nal! Can you say it too?"],
        ], "Nocturnal"),
        sc("night", ["leo:sleep", "tiki:sleep", "olive:idle"], ["🌙 sky", "✨ air"], [
          ["olive", "Good night, Jungle Club. Sweet dreams!"],
          N("Shh. Leo and Tiki are fast asleep. Good night!"),
        ]),
      ],
      [
        q("When is Olive the owl awake?", ["At night", "Only at lunch", "Never"], 0, "Owls are nocturnal, so they are awake at night."),
        q("What do we call animals that are awake at night?", ["Nocturnal", "Noodles", "Nibbles"], 0, "Nocturnal animals wake up when it gets dark."),
      ],
      "Some animals, like owls, bats and hedgehogs, are awake at night. We call them nocturnal.",
    ),
  ],
});
