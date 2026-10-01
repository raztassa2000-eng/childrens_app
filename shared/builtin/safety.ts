import { N, cast, ep, q, sc, series } from "./dsl";

export default series({
  id: "safety.safety-pups",
  category: "safety",
  age: "3-5",
  title: "The Safety Pups",
  tagline: "Smart, safe choices with Rex and Kiki!",
  emoji: "🐶",
  cast: [
    cast("rex", "Rex", "🐶", "child", "A brave puppy who knows all the safety rules."),
    cast("kiki", "Kiki", "🐱", "high", "A curious kitten who is learning to be safe."),
    cast("rosa", "Officer Rosa", "👮‍♀️", "gentle", "A kind police officer who helps everyone in town."),
  ],
  episodes: [
    ep(
      "Stop, Look, Listen",
      "Crossing the road",
      "On the way to the park, Rex teaches Kiki how to cross the road safely.",
      [
        sc("city", ["rex:bounce", "kiki:idle"], ["☀️ sky"], [
          N("Welcome to the Safety Pups!"),
          ["rex", "Hi! I'm Rex. Kiki and I are going to the park."],
        ]),
        sc("city", ["kiki:run", "rex:shiver"], [], [
          N("Kiki sees the park across the street and starts to run."),
          ["rex", "Wait, Kiki! Stop at the curb!"],
        ], "Wait!"),
        sc("city", ["rex:idle", "kiki:think"], [], [
          ["rex", "First, we hold a grown-up's hand."],
          ["kiki", "I'm holding my grown-up's paw!"],
        ], "Hold hands"),
        sc("city", ["rex:think", "kiki:idle"], ["🚗 ground"], [
          ["rex", "Then we stop, look and listen."],
        ], "Stop!"),
        sc("city", ["kiki:wiggle", "rex:idle"], ["🚗 ground"], [
          N("Look left. Look right. Look left again."),
          ["kiki", "A car is coming! We wait."],
        ], "Look left and right"),
        sc("city", ["rex:idle", "kiki:idle", "rosa:wave:right"], [], [
          ["rosa", "Listen for cars too. Vroom, vroom means wait!"],
        ], "Listen!"),
        sc("city", ["rex:walk", "kiki:walk", "rosa:idle"], [], [
          N("The walking light is on, and no cars are coming."),
          ["rex", "Now we cross. Walk, don't run!"],
        ], "Walk, don't run"),
        sc("park", ["rex:cheer", "kiki:cheer"], ["🌳 ground"], [
          ["kiki", "We made it safely to the park!"],
          N("Remember: hold hands, stop, look, and listen!"),
        ]),
      ],
      [
        q("What do we do at the curb?", ["Stop, look and listen", "Run fast", "Close our eyes"], 0, "Always stop, look and listen before crossing."),
        q("Whose hand should you hold when you cross the road?", ["A grown-up's", "A balloon's", "Nobody's"], 0, "Always cross with a grown-up."),
      ],
      "Before crossing the road, hold a grown-up's hand, then stop, look and listen.",
    ),
    ep(
      "Sunny Day Smarts",
      "Sun and water safety",
      "At the beach, Rex and Kiki learn how to stay safe in the sun and near water.",
      [
        sc("beach", ["rex:bounce", "kiki:jump"], ["☀️ sky"], [
          N("It's a hot, sunny day at the beach!"),
          ["kiki", "Hooray! Let's play in the sand!"],
        ]),
        sc("beach", ["rex:idle", "kiki:think"], ["🧢 air"], [
          ["rex", "First, sun smarts! A hat keeps the sun off our faces."],
        ], "Hat"),
        sc("beach", ["kiki:wiggle", "rex:idle"], ["🧴 air"], [
          N("A grown-up helps put on sunscreen to protect their skin."),
          ["kiki", "Rub, rub, all over!"],
        ], "Sunscreen"),
        sc("beach", ["rex:idle", "kiki:idle"], ["⛱️ ground"], [
          ["rex", "When it's very hot, we rest in the shade."],
        ], "Shade"),
        sc("beach", ["kiki:bounce", "rex:idle"], ["💧 air"], [
          ["kiki", "And we drink lots of water. Gulp, gulp!"],
        ], "Drink water"),
        sc("beach", ["rex:think", "kiki:idle"], ["🦺 air"], [
          ["rex", "Before swimming, we always need a grown-up watching us."],
          N("Little swimmers wear a life jacket to help them float."),
        ], "Grown-up watching"),
        sc("beach", ["kiki:swim", "rex:swim"], ["🌊 air"], [
          N("With a grown-up close by, Rex and Kiki splash in the shallow water."),
        ], "Splash!"),
        sc("beach", ["rex:wave", "kiki:wave"], ["🌈 sky"], [
          ["rex", "Hat, sunscreen, shade, water, and a grown-up by the water!"],
          N("Have fun in the sun, and stay safe!"),
        ]),
      ],
      [
        q("What protects your skin from the sun?", ["Sunscreen and a hat", "Ice cream", "Sand"], 0, "Sunscreen and hats keep the sun off your skin."),
        q("Who must watch when you swim?", ["A grown-up", "A seagull", "Nobody"], 0, "Always swim with a grown-up watching."),
      ],
      "On sunny days, wear a hat and sunscreen, drink water, and only swim with a grown-up watching.",
    ),
    ep(
      "Who Can Help?",
      "Getting lost",
      "When Rex and Kiki lose sight of their grown-up at the market, they stay put and find a helper.",
      [
        sc("city", ["kiki:bounce", "rex:idle"], ["🍎 ground"], [
          N("Rex and Kiki are at the busy market with their grown-up."),
          ["kiki", "Ooh, look at all the colorful fruit!"],
        ]),
        sc("city", ["kiki:think", "rex:idle"], ["🍉 ground"], [
          N("They stop to look at the watermelons. When they look up, their grown-up is gone!"),
          ["kiki", "Oh no! Where did our grown-up go?"],
        ]),
        sc("city", ["kiki:shiver", "rex:idle"], [], [
          ["rex", "When we're lost, we stay right where we are. No wandering!"],
        ], "Stay put"),
        sc("city", ["kiki:idle", "rex:think"], [], [
          N("Kiki takes a slow, deep breath. In, and out. She feels a little calmer."),
        ], "Breathe"),
        sc("city", ["rex:think", "kiki:idle"], [], [
          ["rex", "We can ask a helper, like a store worker or a police officer."],
        ], "Find a helper"),
        sc("city", ["rosa:wave:right", "kiki:wave", "rex:idle"], [], [
          ["kiki", "Excuse me, we can't find our grown-up."],
          ["rosa", "Let's find them together. What's your grown-up's name?"],
        ], "A helper!"),
        sc("city", ["kiki:bounce", "rosa:idle"], ["📞 air"], [
          N("Kiki knows her grown-up's name and phone number, so Officer Rosa can call."),
          ["kiki", "Practice your grown-up's phone number at home!"],
        ], "Know your number"),
        sc("city", ["kiki:cheer", "rex:cheer", "rosa:wave"], ["💖 air"], [
          N("Ring, ring! Their grown-up comes right away. Big hugs!"),
          ["rex", "Stay put, find a helper, and know your number!"],
        ]),
      ],
      [
        q("What should you do first if you get lost?", ["Stay where you are", "Run around", "Hide"], 0, "Staying put makes it easier for your grown-up to find you."),
        q("Who is a good helper to ask?", ["A store worker or police officer", "A pigeon", "Nobody"], 0, "Store workers and police officers can help you find your grown-up."),
      ],
      "If you get lost, stay put, ask a helper like a store worker or police officer, and know your grown-up's number.",
    ),
  ],
});
