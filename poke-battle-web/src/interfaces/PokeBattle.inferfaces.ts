import { type, Schema, MapSchema, ArraySchema } from "@colyseus/schema";

export enum GuessAttributes {
  stage = "STAGE",
  color = "COLOR",
  habitat = "HABITAT",
  height = "HEIGHT",
  weight = "WEIGHT",
  type_1 = "TYPE_1",
  type_2 = " TYPE_2",
}

export type PokeBattleGuess = Record<GuessAttributes, string>;

export enum PokeBattlePhase {
  WAITING = "WAITING",
  PICK = "PICK",
  GUESS = "GUESS",
  RESULTS = "RESULTS",
}

export type PokeBattlePickActions =
  | { type: "PICK"; index: number; pokemon: number }
  | { type: "CONFIRM" };

export type PokeBattleGuessActions =
  | { type: "GUESS"; pokemon: number } // Guess pokedle style
  | { type: "SWITCH"; pokemonIndex: number } // Switch to another pokemon (slow, 2 times per match)
  | { type: "POKEDEX"; pokemonIndex: number } // Get Pokedex entry, (slow, 1 times per match)
  | { type: "ATTACK" }; // Get weakness / strength by attacking with your current pokemon;

export type PokeBattleActions = PokeBattleGuessActions | PokeBattlePickActions;

export type Pokemon = any;
export type Player = any;
export type Round = any;
export type PokeBattleState = any;
export type PokeBattleStateType = any;
