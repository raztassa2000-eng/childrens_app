import { N, cast, ep, q, sc, series } from "./dsl";

export default series({
  id: "inventions.time-travel-tinkerers",
  category: "inventions",
  age: "9-12",
  title: "The Time-Travel Tinkerers",
  tagline: "Zoom through history to meet the ideas that changed the world.",
  emoji: "⏳",
  cast: [
    cast("max", "Max", "👦", "child", "A boy who wants to know how everything works."),
    cast("lina", "Lina", "👧", "high", "A young inventor who takes everything apart to see inside."),
    cast("tock", "Tock", "🐢", "wise", "A two-hundred-year-old tortoise who pilots a time machine."),
  ],
  episodes: [
    ep(
      "The Wheel Rolls In",
      "The wheel and axle",
      "The Tinkerers travel more than five thousand years back to see how the wheel and axle were invented.",
      [
        sc("lab", ["max:idle", "lina:think", "tock:wave:left"], ["⚙️ air"], [
          N("Meet the Time-Travel Tinkerers: Max, Lina, and Tock, a two-hundred-year-old tortoise with a time machine."),
          ["tock", "Today's question: who invented the wheel?"],
        ]),
        sc("lab", ["max:jump", "lina:bounce", "tock:spin"], ["✨ air"], [
          N("Whirr! The time machine spins back more than five thousand years."),
          ["max", "Whoa, my stomach is doing somersaults!"],
        ], "3500 BC"),
        sc("desert", ["max:walk", "lina:walk", "tock:idle"], ["☀️ sky"], [
          ["tock", "We're in Mesopotamia, in what is now Iraq. It's one of the first places where people built cities."],
        ], "Mesopotamia"),
        sc("desert", ["lina:think", "max:idle"], ["🪵 ground"], [
          ["lina", "Look! Before wheels, people dragged heavy loads on sleds, or rolled them on logs."],
          ["max", "That looks exhausting!"],
          ["lina", "Rollers worked, but someone had to keep moving the back log to the front. So slow!"],
        ]),
        sc("desert", ["tock:idle", "max:think"], ["🏺 ground"], [
          ["tock", "Here's a surprise. Some of the earliest wheels weren't for moving at all. Potters spun clay on wheels to shape pots!"],
        ], "Potter's wheel"),
        sc("desert", ["lina:grow", "max:bounce"], ["⚙️ air"], [
          ["lina", "The genius part was the axle, a rod through the middle. The wheel turns around it while the cart stays steady."],
        ], "Wheel + axle"),
        sc("desert", ["max:run", "🐂:walk:right"], [], [
          N("Soon, oxen pulled carts on solid wooden wheels, carrying grain to market much faster than before."),
          ["max", "Go, ox, go!"],
          N("Much later, people invented wheels with spokes, which were lighter and faster."),
        ]),
        sc("city", ["lina:think", "max:idle", "tock:idle"], ["🚲 ground", "🚗 ground"], [
          ["max", "Bikes, cars, trains and even skateboards all roll on wheels and axles!"],
        ], "Wheels today"),
        sc("lab", ["tock:idle", "lina:bounce"], ["⚙️ air"], [
          ["tock", "Gears are wheels with teeth. They're hidden inside clocks, bikes and machines everywhere."],
          ["lina", "I knew I'd find wheels inside everything!"],
          ["tock", "Even a doorknob is a wheel and axle in disguise!"],
        ], "Gears"),
        sc("lab", ["max:wave", "lina:wave", "tock:wave"], ["⭐ air"], [
          N("One simple idea, a circle that turns, changed the whole world."),
          ["max", "Where should the time machine take us next?"],
        ]),
      ],
      [
        q("Where were some of the earliest wheels invented?", ["Mesopotamia", "Antarctica", "The Moon"], 0, "Some of the earliest wheels come from Mesopotamia, in what is now Iraq."),
        q("What were some of the first wheels used for?", ["Making pottery", "Racing cars", "Flying kites"], 0, "Potters spun clay on wheels to shape pots."),
        q("What is an axle?", ["A rod that a wheel turns around", "A type of horse", "A kind of road"], 0, "The axle lets the wheel turn while the cart stays steady."),
        q("About when did people start using wheels on carts?", ["More than 5,000 years ago", "100 years ago", "Last week"], 0, "Wheeled carts appeared more than five thousand years ago."),
      ],
      "The wheel and axle, invented more than five thousand years ago, made moving heavy things much easier.",
    ),
    ep(
      "Let There Be Light!",
      "The light bulb",
      "The Tinkerers discover how many inventors worked together to make the electric light bulb.",
      [
        sc("lab", ["max:think", "lina:idle", "tock:idle"], ["💡 air"], [
          N("Click! The lights in the lab flicker off."),
          ["max", "Without light bulbs, how did people see at night?"],
          ["tock", "Let's find out. To the time machine!"],
        ]),
        sc("night", ["max:idle", "lina:idle", "tock:idle"], ["🕯️ air", "🌙 sky"], [
          ["tock", "Long ago, people used candles and oil lamps. They were smoky and dim, and they could start fires."],
        ], "Before bulbs"),
        sc("lab", ["lina:bounce", "max:idle"], ["⚡ air"], [
          N("In 1879, in New Jersey, Thomas Edison's team made a light bulb that could glow for many hours."),
          ["lina", "They tested thousands of materials for the glowing part, even bamboo!"],
        ], "1879"),
        sc("lab", ["lina:think", "max:idle"], ["💡 air"], [
          ["lina", "But Edison wasn't alone! Joseph Swan was making light bulbs in England, and many inventors helped."],
        ], "Teamwork!"),
        sc("lab", ["tock:idle", "max:think"], ["💡 air"], [
          ["tock", "Inside the bulb is a thin thread called a filament. When electricity flows through it, it gets so hot it glows!"],
        ], "Filament"),
        sc("lab", ["max:grow", "lina:idle"], ["💡 air"], [
          ["lina", "They pumped the air out of the glass. Without air, the hot filament doesn't burn up so quickly."],
        ], "No air inside"),
        sc("lab", ["lina:cheer", "max:bounce"], ["💡 air"], [
          N("Inventor Lewis Latimer found a better way to make carbon filaments, so bulbs lasted longer and cost less."),
        ], "Lewis Latimer"),
        sc("city", ["max:walk", "lina:walk", "tock:idle"], ["🌙 sky", "💡 air"], [
          N("Soon, electric lights lit up homes and streets all around the world."),
          ["max", "The night got so much brighter!"],
          ["lina", "Factories could run at night, and people could read long after dark."],
        ], "Glowing cities"),
        sc("home", ["lina:idle", "max:think", "tock:idle"], ["💡 air"], [
          ["tock", "Today, many lights are LEDs. They use much less electricity and can last for years."],
        ], "LEDs"),
        sc("lab", ["max:wave", "lina:wave", "tock:wave"], ["💡 air"], [
          ["max", "Next time I flip a switch, I'll remember all those inventors!"],
          N("Big inventions often come from many people building on each other's ideas."),
        ]),
      ],
      [
        q("What did people use for light before electric bulbs?", ["Candles and oil lamps", "Flashlights", "Glow sticks"], 0, "Candles and oil lamps lit homes long ago."),
        q("What is the thin, glowing thread inside an old-style bulb called?", ["A filament", "A noodle", "A fence"], 0, "Electricity heats the filament until it glows."),
        q("Who found a better way to make carbon filaments?", ["Lewis Latimer", "Leonardo da Vinci", "Isaac Newton"], 0, "Lewis Latimer's method made bulbs last longer and cost less."),
        q("Why do many people use LED lights today?", ["They use less electricity", "They are made of candy", "They only work in daytime"], 0, "LEDs are efficient and long-lasting."),
      ],
      "The light bulb came from many inventors working on each other's ideas, and electric light changed life at night.",
    ),
    ep(
      "First Flight",
      "The first airplane",
      "The Tinkerers visit Kitty Hawk in 1903 to watch the Wright brothers make history.",
      [
        sc("lab", ["max:jump", "lina:idle", "tock:idle"], ["✈️ air"], [
          N("Max is folding paper airplanes."),
          ["max", "How did people first learn to fly a real airplane?"],
          ["tock", "Fasten your seatbelts. Next stop: 1903!"],
        ]),
        sc("beach", ["max:idle", "lina:idle", "tock:idle"], ["☁️ sky", "🌬️ air"], [
          N("They land on windy sand dunes at Kitty Hawk, North Carolina, on December 17, 1903."),
        ], "Kitty Hawk, 1903"),
        sc("city", ["tock:idle", "lina:think"], ["🚲 ground"], [
          ["tock", "Wilbur and Orville Wright built bicycles in their shop in Ohio. They used those skills to build flying machines."],
        ], "Bicycle makers"),
        sc("sky", ["lina:fly", "🦅:fly"], ["☁️ sky"], [
          ["lina", "They watched how birds twist the tips of their wings to turn and keep their balance."],
          ["lina", "They copied the idea by twisting their wings with wires. It was called wing warping."],
        ], "Learning from birds"),
        sc("lab", ["max:think", "lina:idle"], ["💨 air"], [
          N("They even built their own wind tunnel to test more than two hundred small wing shapes."),
          ["lina", "Testing, testing, and more testing!"],
        ], "Wind tunnel"),
        sc("beach", ["max:grow", "lina:idle", "tock:idle"], ["☁️ sky"], [
          ["tock", "Curved wings push air down as they move, and the air pushes the wing up. That upward push is called lift."],
        ], "Lift"),
        sc("beach", ["✈️:fly", "max:jump", "lina:cheer"], ["☁️ sky"], [
          N("Orville flew for twelve seconds and traveled about thirty-seven meters. It was the first powered airplane flight!"),
        ], "12 seconds!"),
        sc("beach", ["lina:think", "max:idle"], ["☁️ sky"], [
          ["lina", "They flew four times that day. The longest flight lasted fifty-nine seconds!"],
          ["max", "From twelve seconds to almost a minute, in one day!"],
        ], "4 flights"),
        sc("sky", ["max:fly", "lina:fly"], ["✈️ air", "☁️ sky"], [
          N("Today, airplanes carry millions of people across oceans every single day."),
          ["max", "And just sixty-six years after Kitty Hawk, astronauts flew to the Moon!"],
        ], "Today"),
        sc("lab", ["max:wave", "lina:wave", "tock:wave"], ["✈️ air"], [
          ["max", "They kept testing and never gave up!"],
          N("Like the Wright brothers, every try that doesn't work teaches you something new."),
        ]),
      ],
      [
        q("Who made the first powered airplane flight?", ["The Wright brothers", "Thomas Edison", "Marie Curie"], 0, "Orville and Wilbur Wright flew at Kitty Hawk in 1903."),
        q("How long was the very first flight?", ["About 12 seconds", "About 12 hours", "About 12 days"], 0, "The first flight lasted just twelve seconds!"),
        q("What did the brothers learn by watching birds?", ["How wings twist to turn and balance", "How to lay eggs", "How to sing"], 0, "Birds twist their wing tips to steer and balance."),
        q("What is lift?", ["The upward push on a wing", "The airplane's engine", "The pilot's seat"], 0, "Lift is the upward push that keeps airplanes in the air."),
      ],
      "In 1903 the Wright brothers made the first powered airplane flight by testing, learning from birds and never giving up.",
    ),
  ],
});
