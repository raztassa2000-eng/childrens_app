import { useEffect, useMemo, useState } from "react";
import type { QuizQuestion, Series } from "../../shared/types";
import { sfx } from "../engine/sfx";
import { getSpeech } from "../engine/speech";
import { haptic } from "../lib/native";
import { useStore } from "../lib/store";

interface Props {
  series: Series;
  questions: QuizQuestion[];
  colors: [string, string];
  onDone: (stars: number) => void;
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** "Did you catch it?" — a gentle quiz after each episode. A star for each first-try answer. */
export function Quiz({ series, questions, colors, onDone }: Props) {
  const { settings } = useStore();
  const shuffled = useMemo(
    () => questions.map((q) => ({ ...q, order: shuffle(q.choices.map((_, i) => i)) })),
    [questions],
  );
  const [index, setIndex] = useState(0);
  const [tried, setTried] = useState<number[]>([]);
  const [solved, setSolved] = useState(false);
  const [stars, setStars] = useState(0);
  const [shake, setShake] = useState<number | null>(null);
  const q = shuffled[index];

  const say = (text: string) => {
    if (!settings.narration) return;
    const speech = getSpeech();
    speech.cancel();
    void speech.speak(text, { lang: series.language, style: "narrator", rate: settings.rate, slot: 0 });
  };

  useEffect(() => {
    if (q) say(`${q.question} ${q.order.map((i) => q.choices[i]).join(", or ")}?`);
    return () => getSpeech().cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  if (!q) return null;

  const choose = (choice: number) => {
    if (solved || tried.includes(choice)) return;
    if (choice === q.answer) {
      setSolved(true);
      if (tried.length === 0) setStars((s) => s + 1);
      sfx.correct();
      haptic.success();
      say(q.explanation || "Yes! Great job!");
    } else {
      setTried((t) => [...t, choice]);
      setShake(choice);
      sfx.tryAgain();
      haptic.oops();
    }
  };

  const next = () => {
    sfx.click();
    if (index + 1 >= shuffled.length) {
      onDone(stars);
      return;
    }
    setIndex(index + 1);
    setTried([]);
    setSolved(false);
  };

  return (
    <div className="quiz" style={{ ["--c1" as string]: colors[0], ["--c2" as string]: colors[1] }}>
      <div className="quiz__header">
        <span className="quiz__title">🧠 Did you catch it?</span>
        <span className="quiz__dots">
          {shuffled.map((_, i) => (
            <span key={i} className={i < index ? "done" : i === index ? "now" : ""} />
          ))}
        </span>
      </div>
      <h2 className="quiz__question" dir="auto">
        {q.question}
      </h2>
      <div className="quiz__choices">
        {q.order.map((choice) => {
          const state = solved && choice === q.answer ? "right" : tried.includes(choice) ? "wrong" : "";
          return (
            <button
              key={choice}
              className={`quiz__choice ${state} ${shake === choice ? "shake" : ""}`}
              onClick={() => choose(choice)}
              onAnimationEnd={() => setShake(null)}
              dir="auto"
            >
              {state === "right" ? "✅ " : state === "wrong" ? "🙈 " : ""}
              {q.choices[choice]}
            </button>
          );
        })}
      </div>
      <div className="quiz__footer">
        {solved ? (
          <>
            <p className="quiz__explain" dir="auto">
              {tried.length === 0 ? "⭐ " : "👍 "}
              {q.explanation}
            </p>
            <button className="btn btn--primary btn--big" onClick={next}>
              {index + 1 >= shuffled.length ? "See my stars ⭐" : "Next ➜"}
            </button>
          </>
        ) : (
          <p className="quiz__hint">{tried.length > 0 ? "Almost! Try another one 💪" : "Tap the right answer"}</p>
        )}
      </div>
    </div>
  );
}
