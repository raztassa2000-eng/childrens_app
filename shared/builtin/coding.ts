import { N, cast, ep, q, sc, series } from "./dsl";

export default series({
  id: "coding.byte-and-ada",
  category: "coding",
  age: "9-12",
  title: "Byte & Ada's Code Quest",
  tagline: "Think like a programmer, no computer needed!",
  emoji: "🤖",
  cast: [
    cast("ada", "Ada", "👧", "child", "A puzzle-loving girl who built her own robot."),
    cast("byte", "Byte", "🤖", "robot", "A robot who does exactly what it's told, nothing more and nothing less."),
  ],
  episodes: [
    ep(
      "Exactly What You Say",
      "Algorithms",
      "Ada teaches Byte to make a jam sandwich and discovers why instructions must be precise.",
      [
        sc("home", ["byte:wave", "ada:idle"], ["🥪 air"], [
          N("Ada built a robot named Byte. Byte does exactly what you tell it, nothing more and nothing less."),
          ["byte", "Beep! Hello, Ada. Waiting for instructions."],
        ]),
        sc("home", ["ada:idle", "byte:idle"], ["🍞 ground"], [
          ["ada", "An algorithm is a list of steps that solves a problem. Let's teach Byte to make a jam sandwich!"],
          ["byte", "Sandwich algorithm. Exciting! Ready for step one."],
        ], "Algorithm"),
        sc("home", ["ada:think", "byte:spin"], ["🍞 ground", "🫙 air"], [
          ["ada", "Step one: put jam on the bread."],
          N("Byte puts the whole closed jam jar on top of the loaf. Plop!"),
        ], "Step 1"),
        sc("home", ["byte:shiver", "ada:think"], ["🫙 ground"], [
          ["byte", "Instruction complete. The jam is on the bread."],
          ["ada", "Ha! You're right. I wasn't precise enough."],
        ], "Bug!"),
        sc("home", ["ada:idle", "byte:idle"], ["🍞 ground"], [
          ["ada", "Computers can't guess what we mean. Every step has to be clear and exact."],
          ["byte", "Correct. I only know what you tell me. Beep!"],
        ], "Be precise"),
        sc("home", ["byte:bounce", "ada:idle"], ["🍞 ground", "🥄 air"], [
          ["ada", "New algorithm. One: open the jar. Two: take two slices of bread out of the bag."],
        ], "Steps 1 and 2"),
        sc("home", ["byte:grow", "ada:bounce"], ["🥄 air", "🍓 air"], [
          ["ada", "Three: use the spoon to spread jam on one slice. Four: put the other slice on top."],
        ], "Steps 3 and 4"),
        sc("home", ["byte:cheer", "ada:cheer"], ["🥪 air"], [
          N("Byte follows each step in order and makes a perfect jam sandwich!"),
          ["byte", "Sandwich complete. Beep boop!"],
        ], "Sandwich!"),
        sc("home", ["ada:think", "byte:idle"], ["🥪 air"], [
          ["byte", "Question: what if I put the slices together before spreading the jam?"],
          ["ada", "Then the jam ends up on the outside. The order of the steps matters!"],
        ], "Order matters"),
        sc("home", ["ada:wave", "byte:wave"], ["⭐ air"], [
          N("Programmers write algorithms every day. Try writing the steps for brushing your teeth, then test them on someone at home!"),
        ]),
      ],
      [
        q("What is an algorithm?", ["A list of steps that solves a problem", "A type of robot", "A secret password"], 0, "Algorithms are step-by-step instructions."),
        q("Why did Byte put the whole jar on the bread?", ["The instruction wasn't precise", "Byte was being silly on purpose", "Byte was hungry"], 0, "Computers follow instructions exactly, so they must be precise."),
        q("What can happen if you change the order of the steps?", ["The result can change", "Nothing ever changes", "The robot falls asleep"], 0, "Order matters in algorithms."),
        q("Which instruction is the most precise?", ["Take two slices of bread out of the bag", "Make it nice", "Do the food thing"], 0, "Clear, exact steps work best."),
      ],
      "An algorithm is a list of clear, exact steps, and the order of the steps matters.",
    ),
    ep(
      "Loop-de-Loop",
      "Loops",
      "Ada teaches Byte a dance and a drawing using loops, and learns that every loop needs a way to stop.",
      [
        sc("stage", ["ada:dance", "byte:idle"], ["🎵 air"], [
          N("Ada is teaching Byte a dance."),
          ["ada", "Step left, step right, clap! Step left, step right, clap! Step left..."],
          ["byte", "Beep! These instructions are getting very long."],
        ]),
        sc("stage", ["ada:think", "byte:idle"], ["🔁 air"], [
          ["ada", "I know! We can use a loop. A loop tells a computer to repeat steps."],
        ], "Loop"),
        sc("stage", ["byte:dance", "ada:cheer"], ["🔁 air"], [
          ["ada", "Repeat four times: step left, step right, clap!"],
          N("Byte dances the whole routine from one short instruction."),
        ], "Repeat 4 times"),
        sc("classroom", ["ada:idle", "byte:walk"], ["✏️ air"], [
          ["ada", "Now let's draw a square. Move forward, then turn right."],
          ["byte", "Moving forward. Turning right. Waiting for more steps. Beep."],
        ], "Draw a square"),
        sc("classroom", ["byte:walk", "ada:think"], ["🟥 air"], [
          ["byte", "Move forward, turn right. Repeat four times. Square complete!"],
        ], "Repeat 4 times"),
        sc("classroom", ["ada:bounce", "byte:spin"], ["⭐ air"], [
          ["ada", "Change the turn to a sharper corner and repeat five times, and we get a star!"],
          ["byte", "Five points! Loops can draw amazing patterns."],
        ], "Repeat 5 times"),
        sc("classroom", ["byte:spin", "ada:shiver"], ["🔁 air"], [
          N("Uh-oh! Ada forgot to say when to stop. Byte keeps spinning around and around."),
          ["byte", "Spinning forever. Beep! Help!"],
        ], "Forever loop!"),
        sc("classroom", ["ada:think", "byte:idle"], ["🛑 air"], [
          ["ada", "Oops, that's an infinite loop! Every loop needs a rule for when to stop."],
          ["byte", "Stopping now. Thank you. I was getting dizzy!"],
        ], "Stop rule"),
        sc("city", ["ada:walk", "byte:walk"], [], [
          N("Loops are everywhere: traffic lights repeat green, yellow and red, and the seasons repeat every year."),
          ["ada", "Even the chorus of a song is a loop!"],
        ], "Loops everywhere"),
        sc("stage", ["ada:wave", "byte:wave"], ["🎵 air"], [
          ["byte", "Loops save time and make code shorter. Beep boop!"],
          N("Can you find a loop in your day? Maybe brushing each tooth!"),
        ]),
      ],
      [
        q("What does a loop do?", ["Repeats steps", "Deletes the program", "Turns off the robot"], 0, "Loops repeat instructions."),
        q("How many times do you repeat 'move forward, turn right' to draw a square?", ["4", "2", "10"], 0, "A square has four sides, so we repeat four times."),
        q("What is an infinite loop?", ["A loop that never stops", "A very short loop", "A loop made of string"], 0, "Without a stop rule, a loop goes on forever."),
        q("Which is an example of a loop in real life?", ["Traffic lights repeating their colors", "A single sneeze", "Opening a door once"], 0, "Traffic lights repeat the same pattern again and again."),
      ],
      "Loops repeat steps to save time, but every loop needs a rule for when to stop.",
    ),
    ep(
      "Bug Hunt",
      "Debugging",
      "Byte delivers a letter to the wrong place, and Ada learns to test, find and fix the bug.",
      [
        sc("city", ["byte:walk", "ada:think"], ["📬 air"], [
          N("Byte is following a program to deliver a letter to the library."),
          ["byte", "Beep! Starting delivery program."],
        ], "Mission: library"),
        sc("city", ["byte:walk", "ada:idle"], ["🥖 ground"], [
          N("But Byte ends up at the bakery instead!"),
          ["byte", "Delivery complete. This place smells like bread."],
        ]),
        sc("city", ["ada:think", "byte:idle"], ["🐞 air"], [
          ["ada", "There's a bug in our program. A bug is a mistake that makes code do the wrong thing."],
          ["byte", "A bug? I don't see any insects. Beep?"],
        ], "Bug!"),
        sc("lab", ["ada:idle", "byte:idle"], ["📓 air"], [
          N("Fun fact: in 1947, a team working with computer pioneer Grace Hopper found a real moth stuck inside a computer!"),
          ["ada", "They taped it in their notebook and wrote: first actual case of bug being found."],
        ], "1947"),
        sc("lab", ["ada:think", "byte:idle"], ["📜 air"], [
          ["ada", "Debugging means finding and fixing bugs. First, we test to see exactly what goes wrong."],
          ["byte", "Running test. I turned at the fountain and ended up at the bakery."],
        ], "Step 1: Test"),
        sc("lab", ["byte:think", "ada:idle"], ["🔍 air"], [
          ["byte", "Reading my steps. Step three says: turn right at the fountain."],
          ["ada", "That's it! It should say turn left!"],
        ], "Step 2: Find it"),
        sc("lab", ["🦆:bounce", "ada:idle"], [], [
          N("Some programmers explain their code out loud to a rubber duck. Saying it out loud helps them spot mistakes!"),
        ], "Rubber duck!"),
        sc("lab", ["ada:bounce", "byte:grow"], ["🔧 air"], [
          ["ada", "Change right to left. Fixed!"],
          ["byte", "Updating program. Beep!"],
        ], "Step 3: Fix it"),
        sc("city", ["byte:walk", "ada:cheer"], ["📚 air"], [
          N("They test again. This time, Byte arrives at the library with the letter!"),
          ["byte", "Mission complete. And no bread this time!"],
        ], "Step 4: Test again"),
        sc("city", ["ada:wave", "byte:wave"], ["⭐ air"], [
          ["byte", "Bugs are not failures. They are clues!"],
          N("Every programmer makes bugs. Good programmers test, find and fix them."),
        ]),
      ],
      [
        q("What is a bug in code?", ["A mistake that makes code do the wrong thing", "A pet insect", "A fast computer"], 0, "Bugs are mistakes in programs."),
        q("What did a team working with Grace Hopper find inside a computer in 1947?", ["A real moth", "A sandwich", "A rubber duck"], 0, "They found a moth and taped it in their logbook."),
        q("What is the first step in debugging?", ["Test to see what goes wrong", "Throw the computer away", "Give up"], 0, "Testing shows us where the bug is."),
        q("Why do some programmers talk to a rubber duck?", ["Explaining out loud helps find mistakes", "Ducks are great coders", "It makes the computer faster"], 0, "Explaining your steps helps you spot problems."),
      ],
      "Debugging means testing, finding and fixing mistakes, and every programmer does it.",
    ),
  ],
});
