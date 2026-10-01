import type { Series } from "../types";
import animals from "./animals";
import art from "./art";
import body from "./body";
import coding from "./coding";
import feelings from "./feelings";
import inventions from "./inventions";
import math from "./math";
import nature from "./nature";
import physics from "./physics";
import safety from "./safety";
import space from "./space";
import values from "./values";
import words from "./words";
import world from "./world";

/** The starter library that ships inside the app (works offline, no AI key needed). */
export const BUILTIN_SERIES: Series[] = [
  animals,
  math,
  physics,
  values,
  feelings,
  space,
  nature,
  body,
  world,
  words,
  inventions,
  art,
  coding,
  safety,
];
