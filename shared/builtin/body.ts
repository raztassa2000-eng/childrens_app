import { N, cast, ep, q, sc, series } from "./dsl";

export default series({
  id: "body.dr-pandas-healthy-club",
  category: "body",
  age: "3-5",
  title: "Dr. Panda's Healthy Club",
  tagline: "Healthy habits that make you strong and happy!",
  emoji: "🐼",
  cast: [
    cast("panda", "Dr. Panda", "🐼", "gentle", "A friendly doctor who makes healthy habits fun."),
    cast("sam", "Sam", "👦", "child", "A boy who is learning healthy habits."),
    cast("toothy", "Toothy", "🦷", "silly", "A talking tooth who loves being clean."),
  ],
  episodes: [
    ep(
      "Brush, Brush, Brush!",
      "Brushing teeth",
      "Toothy shows Sam why and how to brush teeth twice a day.",
      [
        sc("home", ["panda:wave", "sam:bounce"], [], [
          N("Welcome to Dr. Panda's Healthy Club!"),
          ["panda", "Hello, Sam! Today let's talk about teeth."],
        ]),
        sc("home", ["toothy:bounce:top", "sam:jump"], ["✨ air"], [
          ["toothy", "Hi! I'm Toothy. I help you chew your food!"],
        ], "Toothy!"),
        sc("home", ["toothy:shiver", "panda:idle"], ["🍬 air"], [
          ["toothy", "Too many sweets can make little holes in teeth, called cavities."],
          ["panda", "That's why we take care of our teeth."],
        ], "Cavities"),
        sc("home", ["panda:idle", "sam:think"], ["🪥 air"], [
          ["panda", "We brush our teeth in the morning and at night."],
        ], "Twice a day"),
        sc("home", ["sam:wiggle", "toothy:dance"], ["🪥 air"], [
          N("Brush, brush, brush in little circles. Front teeth, back teeth, all the teeth!"),
        ], "Little circles"),
        sc("home", ["sam:bounce", "toothy:spin", "panda:idle"], ["🪥 air"], [
          ["panda", "Brush for two minutes. That's as long as a song!"],
          ["sam", "La la la, brush, brush, brush!"],
        ], "2 minutes"),
        sc("home", ["toothy:cheer", "sam:cheer"], ["✨ air"], [
          ["toothy", "I feel so clean and shiny! Thank you, Sam!"],
        ], "Shiny!"),
        sc("home", ["panda:wave", "sam:wave", "toothy:wave"], ["⭐ air"], [
          N("Brush your teeth twice a day to keep them strong!"),
          ["sam", "Let's brush, brush, brush!"],
        ]),
      ],
      [
        q("How many times a day should we brush our teeth?", ["Two times", "Never", "Ten times"], 0, "Brush in the morning and at night!"),
        q("How long should we brush?", ["Two minutes", "Two seconds", "Two hours"], 0, "Two minutes, about as long as a song."),
      ],
      "Brush your teeth twice a day for two minutes to keep them strong and shiny.",
    ),
    ep(
      "Eat a Rainbow",
      "Healthy food",
      "Dr. Panda helps Sam fill his plate with fruits and vegetables of every color.",
      [
        sc("home", ["panda:wave", "sam:idle"], [], [
          N("It's lunchtime at the Healthy Club!"),
          ["panda", "Sam, let's make a rainbow on your plate!"],
        ]),
        sc("home", ["sam:think", "panda:idle"], ["🍅 air", "🍓 air"], [
          ["panda", "Red foods like tomatoes and strawberries are full of goodness."],
        ], "Red"),
        sc("home", ["sam:bounce", "panda:idle"], ["🥕 air", "🍊 air"], [
          ["sam", "Orange carrots! Are they good for my eyes?"],
          ["panda", "Yes! Carrots help keep your eyes healthy."],
        ], "Orange"),
        sc("home", ["sam:wiggle", "panda:idle"], ["🍌 air", "🌽 air"], [
          N("Yellow bananas and corn give you energy to play."),
        ], "Yellow"),
        sc("home", ["sam:jump", "panda:idle"], ["🥦 air", "🥝 air"], [
          ["panda", "Green broccoli helps you grow big and strong."],
          ["sam", "Broccoli looks like tiny trees!"],
        ], "Green"),
        sc("home", ["sam:dance", "panda:dance"], ["🫐 air", "🍇 air"], [
          N("Blueberries and purple grapes finish our rainbow!"),
        ], "Blue and purple"),
        sc("home", ["panda:idle", "sam:cheer"], ["💧 air"], [
          ["panda", "And water is the best drink for your body."],
        ], "Water"),
        sc("home", ["panda:wave", "sam:wave"], ["🌈 air"], [
          ["sam", "I ate a rainbow today!"],
          N("Eat lots of colors every day. What color will you eat next?"),
        ]),
      ],
      [
        q("What is a rainbow plate?", ["Foods of many colors", "Only candy", "An empty plate"], 0, "Eating many colors gives your body lots of goodness."),
        q("What is the best drink for your body?", ["Water", "Soda", "Syrup"], 0, "Water helps every part of your body work."),
      ],
      "Eating fruits and vegetables of many colors helps your body grow strong.",
    ),
    ep(
      "Sleepy Time Superpowers",
      "Sleep",
      "Sam doesn't want to go to bed until Dr. Panda explains the superpowers of sleep.",
      [
        sc("home", ["sam:bounce", "panda:idle"], [], [
          N("It's evening, and Sam doesn't want to go to bed."),
          ["sam", "I'm not sleepy! I want to play more!"],
        ]),
        sc("home", ["panda:idle", "sam:think"], [], [
          ["panda", "Did you know sleep gives you superpowers?"],
          ["sam", "Superpowers? Really?"],
        ], "Sleep superpowers"),
        sc("night", ["panda:idle", "sam:grow"], ["⭐ sky", "🌙 sky"], [
          ["panda", "While you sleep, your body grows and gets stronger."],
        ], "Grow!"),
        sc("night", ["sam:think", "panda:idle"], ["⭐ sky"], [
          ["panda", "And your brain saves what you learned today, like a treasure box."],
        ], "Remember!"),
        sc("home", ["sam:bounce", "panda:idle"], ["🛁 ground"], [
          N("First a warm bath, then pajamas, then brush your teeth."),
        ], "Bedtime routine"),
        sc("home", ["sam:idle", "panda:idle"], ["📚 air"], [
          ["sam", "And a bedtime story!"],
          ["panda", "Then lights off, and a cozy hug."],
        ], "Story time"),
        sc("night", ["sam:sleep", "panda:idle"], ["🌙 sky", "⭐ sky"], [
          N("Children your age need lots of sleep, about ten hours or more each night."),
        ], "10 hours"),
        sc("night", ["sam:sleep", "panda:sleep"], ["🌙 sky", "⭐ sky"], [
          ["panda", "Goodnight, Sam. Sweet dreams!"],
          N("Sleep well, and wake up ready for adventures!"),
        ]),
      ],
      [
        q("What happens while you sleep?", ["Your body grows and your brain remembers", "Your toys come alive", "Nothing at all"], 0, "Sleep helps your body grow and your brain remember."),
        q("What is part of a good bedtime routine?", ["Bath, pajamas, teeth and a story", "Jumping on the bed all night", "Playing games until morning"], 0, "A calm routine helps you fall asleep."),
      ],
      "Sleep is a superpower: it helps your body grow and your brain remember.",
    ),
  ],
});
