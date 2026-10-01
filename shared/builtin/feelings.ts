import { N, cast, ep, q, sc, series } from "./dsl";

export default series({
  id: "feelings.bennys-big-feelings",
  category: "feelings",
  age: "3-5",
  title: "Benny's Big Feelings",
  tagline: "Big feelings are okay. Let's learn what to do with them!",
  emoji: "🐻",
  cast: [
    cast("benny", "Benny", "🐻", "child", "A cuddly bear cub with very big feelings."),
    cast("lulu", "Lulu", "🐨", "gentle", "A calm koala who knows lots of feelings tricks."),
  ],
  episodes: [
    ep(
      "Benny Feels Grumpy",
      "Feeling angry",
      "When his block tower falls, Benny feels angry, and Lulu teaches him a calm breathing trick.",
      [
        sc("forest", ["benny:idle", "lulu:wave"], ["☀️ sky", "🧱 ground"], [
          N("Benny Bear is building a tall tower of blocks."),
          ["benny", "Look how tall my tower is!"],
        ]),
        sc("forest", ["benny:shiver", "lulu:think"], ["🧱 ground"], [
          N("Oh no! The tower falls down. Crash!"),
          ["benny", "Grrr! I'm so mad!"],
        ], "Crash!"),
        sc("forest", ["benny:shiver", "lulu:idle"], [], [
          ["lulu", "Your face is red and your paws are tight. Are you feeling angry?"],
          ["benny", "Yes! I'm super angry!"],
        ], "Angry"),
        sc("forest", ["lulu:grow", "benny:idle"], ["🌸 air"], [
          ["lulu", "Let's try a calm trick. Smell the flower. Breathe in slowly."],
          N("Breathe in through your nose. Mmm."),
        ], "Smell the flower"),
        sc("forest", ["lulu:grow", "benny:grow"], ["🎂 air"], [
          ["lulu", "Now blow out the birthday candles. Breathe out slowly."],
          N("Whoo. Let's do it again together. In, and out."),
        ], "Blow the candles"),
        sc("forest", ["benny:idle", "lulu:idle"], ["🌸 air"], [
          ["benny", "I feel calmer now. My paws are soft."],
          ["lulu", "Angry feelings are okay. We can help our bodies calm down."],
        ]),
        sc("forest", ["benny:bounce", "lulu:bounce"], ["🧱 ground"], [
          ["benny", "Let's build the tower again, together!"],
          N("This time they make a wide bottom, so it stands strong."),
        ]),
        sc("forest", ["benny:cheer", "lulu:cheer"], ["🌈 sky"], [
          N("When you feel angry, smell the flower and blow out the candles."),
          ["benny", "Try it with me! In, and out."],
        ], "Breathe in, breathe out"),
      ],
      [
        q("How did Benny feel when his tower fell?", ["Angry", "Sleepy", "Hungry"], 0, "Benny felt angry when his tower crashed."),
        q("What helps us calm down?", ["Slow, deep breaths", "Shouting", "Kicking"], 0, "Slow breaths help our bodies feel calm."),
      ],
      "It's okay to feel angry. Slow breaths can help our bodies calm down.",
    ),
    ep(
      "It's Okay to Feel Sad",
      "Feeling sad",
      "Benny's balloon floats away, and Lulu shows him that sad feelings are okay to share.",
      [
        sc("park", ["benny:bounce", "lulu:idle"], ["🎈 air"], [
          N("Benny has a shiny red balloon."),
          ["benny", "My balloon is my favorite thing!"],
        ]),
        sc("park", ["benny:jump", "lulu:think"], ["🎈 sky"], [
          N("Whoosh! The wind pulls the balloon up, up and away."),
          ["benny", "Come back, balloon!"],
        ], "Whoosh!"),
        sc("park", ["benny:idle", "lulu:idle"], ["💧 air"], [
          N("Benny's eyes fill with tears."),
          ["benny", "I feel sad. My chest feels heavy."],
        ], "Sad"),
        sc("park", ["lulu:walk", "benny:idle"], [], [
          ["lulu", "It's okay to feel sad, Benny. Everybody feels sad sometimes."],
          ["benny", "Even you?"],
        ]),
        sc("park", ["lulu:idle", "benny:think"], [], [
          ["lulu", "Yes! I felt sad when my friend moved away. Talking about it helped me."],
        ]),
        sc("park", ["lulu:wave", "benny:bounce"], ["💖 air"], [
          ["lulu", "Would you like a hug?"],
          N("Squeeze! A warm hug helps Benny feel a little better."),
        ], "A big hug"),
        sc("meadow", ["benny:think", "lulu:idle"], ["☁️ sky", "🎈 sky"], [
          ["benny", "Maybe a bird will see my balloon way up high."],
          ["lulu", "What a nice thought!"],
        ]),
        sc("meadow", ["benny:wave", "lulu:wave"], ["🌈 sky"], [
          N("Sad feelings don't last forever. Telling a grown-up or a friend can help."),
          ["benny", "Thank you for listening, Lulu."],
        ]),
      ],
      [
        q("Why did Benny feel sad?", ["His balloon flew away", "He got a present", "He ate lunch"], 0, "The wind took Benny's balloon away."),
        q("What can help when we feel sad?", ["Talking and hugs", "Hiding forever", "Breaking toys"], 0, "Talking to someone and getting a hug can help."),
      ],
      "Everyone feels sad sometimes. Talking and hugs can help us feel better.",
    ),
    ep(
      "Brave Benny",
      "Feeling scared",
      "At bedtime Benny feels scared of the dark, and finds out that brave means trying even when scared.",
      [
        sc("home", ["benny:idle", "lulu:idle"], ["🧸 ground"], [
          N("It's bedtime at Benny's house."),
          ["benny", "Lulu, the room is dark. I feel scared."],
        ]),
        sc("home", ["benny:shiver", "lulu:idle"], [], [
          ["lulu", "Feeling scared is okay. Being brave means trying, even when we're scared."],
        ], "Scared"),
        sc("home", ["benny:shiver", "lulu:think"], [], [
          N("Creak! A noise comes from the window."),
          ["benny", "What was that?"],
        ], "Creak!"),
        sc("night", ["lulu:wave", "benny:think"], ["🌙 sky", "🍃 air"], [
          ["lulu", "Let's look together. It's just the wind moving the tree branches."],
          ["benny", "Oh! It's only the wind."],
        ], "Just the wind"),
        sc("home", ["lulu:idle", "benny:bounce"], ["💡 air"], [
          ["lulu", "A little night light can make your room feel cozy."],
        ], "Night light"),
        sc("home", ["benny:grow", "lulu:idle"], ["🧸 ground"], [
          ["benny", "And my teddy can keep me company!"],
          N("Benny takes a deep breath and feels a little braver."),
        ]),
        sc("home", ["benny:cheer", "lulu:cheer"], ["⭐ air"], [
          ["lulu", "You did it, Benny! You were brave."],
          ["benny", "Being brave feels good!"],
        ], "Brave!"),
        sc("night", ["benny:sleep", "lulu:sleep"], ["🌙 sky", "⭐ sky"], [
          N("Goodnight, Benny. Goodnight, Lulu. You can be brave too!"),
        ]),
      ],
      [
        q("What made the creaky noise?", ["The wind in the tree", "A dancing hippo", "A noisy truck"], 0, "It was just the wind moving the branches."),
        q("What does being brave mean?", ["Trying even when we're scared", "Never feeling scared", "Shouting loudly"], 0, "Brave means we try, even if we feel scared."),
      ],
      "Feeling scared is okay. Being brave means trying, even when we feel scared.",
    ),
  ],
});
