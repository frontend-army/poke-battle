import { type, Schema, MapSchema, ArraySchema } from "@colyseus/schema";

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

// TODO: This data should be private
export class Pokemon extends Schema {
  @type("boolean") guessed = false;
  @type("number") number: number;
}

export class Player extends Schema {
  @type("boolean") confirmed = false;
  @type({ map: Pokemon }) pokemons = new MapSchema<Pokemon>();
  @type("number") currentPokemon = 0;
}

export class Round extends Schema {
  @type("boolean") ended = false;
}

export class PokeBattleState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
  @type("string") phase: PokeBattlePhase;
  @type({ array: Round }) rounds: ArraySchema<Round>;
  @type("string") winner: string;
  @type("number") maxPokemons: number;
}

export type PokeBattleStateType = typeof PokeBattleState;
