import { type, filter, Schema, MapSchema, ArraySchema } from "@colyseus/schema";
import { PokemonData } from "../pokemons";
import { Client } from "colyseus";

export enum GuessAttributes {
  stage = "STAGE",
  color = "COLOR",
  habitat = "HABITAT",
  height = "HEIGHT",
  weight = "WEIGHT",
  type_1 = "TYPE_1",
  type_2 = " TYPE_2",
}

export type PokeBattleGuess = {
  result: Record<GuessAttributes, string>;
  pokemon: PokemonData;
  pokemonIndex: number;
};

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
  | { type: "SWITCH"; pokemon: number } // Switch to another pokemon (slow, 2 times per match)
  | { type: "POKEDEX" } // Get Pokedex entry, (slow, 1 times per match)
  | { type: "ATTACK" }; // Get weakness / strength by attacking with your current pokemon;

export type PokeBattleActions = PokeBattleGuessActions | PokeBattlePickActions;

// TODO: This data should be private
export class Pokemon extends Schema {
  @type("boolean") guessed = false;

  @filter(function (
    this: Pokemon,
    client: Client,
    value: Pokemon["number"],
    root: PokeBattleState
  ) {
    return (
      this.guessed ||
      [...root.players.get(client.id).pokemons.values()].includes(this)
    );
  })
  @type("number")
  number: number;
}

export class Player extends Schema {
  @type("boolean") confirmed = false;
  @type({ map: Pokemon }) pokemons = new MapSchema<Pokemon>();
  @type("number") currentPokemon = 0;
}

export class Action extends Schema {
  @type("string") type: PokeBattleGuessActions["type"];
  @type("number") pokemon: number;
}

export class Result extends Schema {
  @type("string") type: PokeBattleGuessActions["type"];
  @type("number") pokemon: number;
}

export class Round extends Schema {
  @type({ map: Action }) actions = new MapSchema<Action>();
  @type({ map: Action }) results = new MapSchema<Result>();
}

export class PokeBattleState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
  @type("string") phase: PokeBattlePhase;
  @type({ array: Round }) rounds: ArraySchema<Round>;
  @type("string") winner: string;
  @type("number") maxPokemons: number;
}

export type PokeBattleStateType = typeof PokeBattleState;
