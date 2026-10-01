import type { Series } from "../types";
import { localize, type SeriesText } from "./localize";
import animals from "./animals";
import math from "./math";
import physics from "./physics";
import values from "./values";
import feelings from "./feelings";
import space from "./space";
import nature from "./nature";
import body from "./body";
import world from "./world";
import words from "./words";
import inventions from "./inventions";
import art from "./art";
import coding from "./coding";
import safety from "./safety";
import he_animals from "./he/animals";
import he_math from "./he/math";
import he_physics from "./he/physics";
import he_values from "./he/values";
import he_feelings from "./he/feelings";
import he_space from "./he/space";
import he_nature from "./he/nature";
import he_body from "./he/body";
import he_world from "./he/world";
import he_words from "./he/words";
import he_inventions from "./he/inventions";
import he_art from "./he/art";
import he_coding from "./he/coding";
import he_safety from "./he/safety";
import fr_animals from "./fr/animals";
import fr_math from "./fr/math";
import fr_physics from "./fr/physics";
import fr_values from "./fr/values";
import fr_feelings from "./fr/feelings";
import fr_space from "./fr/space";
import fr_nature from "./fr/nature";
import fr_body from "./fr/body";
import fr_world from "./fr/world";
import fr_words from "./fr/words";
import fr_inventions from "./fr/inventions";
import fr_art from "./fr/art";
import fr_coding from "./fr/coding";
import fr_safety from "./fr/safety";

const ENGLISH: Series[] = [animals, math, physics, values, feelings, space, nature, body, world, words, inventions, art, coding, safety];

/** A translation either localizes the English show (same animation, new words) or is a whole series of its own. */
function translated(base: Series, language: string, text: SeriesText | Series): Series {
  return "id" in text ? text : localize(base, language, text);
}

/** The starter library that ships inside the app (works offline, no AI key needed), in every app language. */
export const BUILTIN_SERIES: Series[] = [
  ...ENGLISH,
  translated(animals, "he", he_animals),
  translated(math, "he", he_math),
  translated(physics, "he", he_physics),
  translated(values, "he", he_values),
  translated(feelings, "he", he_feelings),
  translated(space, "he", he_space),
  translated(nature, "he", he_nature),
  translated(body, "he", he_body),
  translated(world, "he", he_world),
  translated(words, "he", he_words),
  translated(inventions, "he", he_inventions),
  translated(art, "he", he_art),
  translated(coding, "he", he_coding),
  translated(safety, "he", he_safety),
  translated(animals, "fr", fr_animals),
  translated(math, "fr", fr_math),
  translated(physics, "fr", fr_physics),
  translated(values, "fr", fr_values),
  translated(feelings, "fr", fr_feelings),
  translated(space, "fr", fr_space),
  translated(nature, "fr", fr_nature),
  translated(body, "fr", fr_body),
  translated(world, "fr", fr_world),
  translated(words, "fr", fr_words),
  translated(inventions, "fr", fr_inventions),
  translated(art, "fr", fr_art),
  translated(coding, "fr", fr_coding),
  translated(safety, "fr", fr_safety),
];
