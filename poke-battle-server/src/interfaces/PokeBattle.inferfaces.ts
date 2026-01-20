import {
  type,
  filter,
  filterChildren,
  Schema,
  MapSchema,
  ArraySchema,
} from "@colyseus/schema";
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
  MAIN = "MAIN",
  RESULTS = "RESULTS",
}

export type PokeBattlePickActions =
  | { type: "PICK"; index: number; pickIndex: number }
  | { type: "CONFIRM" };

export type PokeBattleMainActions =
  | { type: "GUESS"; pokemon: number } // Guess pokedle style
  | { type: "SWITCH" } // Switch to the next pokemon (slow, X times per match)
  | { type: "POKEDEX" } // Get Pokedex entry, (slow, X times per match)
  | { type: "ATTACK" }; // Get weakness / strength by attacking with your current pokemon;

export type PokeBattleActions = PokeBattleMainActions | PokeBattlePickActions;

export class Pokemon extends Schema {
  @type("boolean") guessed = false;
  @type("boolean") revealed = false;

  @filter(function (
    this: Pokemon,
    client: Client,
    _value: Pokemon["number"],
    root: PokeBattleState
  ) {
    return (
      this.guessed ||
      this.revealed ||
      [...root.players.get(client.sessionId).pokemons.values()].includes(this)
    );
  })
  @type("number")
  number: number;
}

export class Player extends Schema {
  @type("string") sessionId: string;
  @type("boolean") confirmed = false;
  @filter(function (
    this: Player,
    client: Client,
  ) {
    return this.sessionId === client.sessionId;
  })
  @type({ map: "number" }) pickOptions = new MapSchema<number>();
  @type({ map: Pokemon }) pokemons = new MapSchema<Pokemon>();
  @type({ array: "string" }) results = new ArraySchema<string>();
  @type("number") currentPokemon = 0;
  @type("number") switches = 0;
  @type("boolean") connected = true;
}

export class Action extends Schema {
  @type("string") type: PokeBattleMainActions["type"];
  @type("number") pokemon?: number;
  @type("number") timestamp: number;
}

export class Round extends Schema {
  @filterChildren(function (
    this: PokeBattleState,
    client: Client,
    key: string
  ) {
    return key === client.sessionId;
  })
  @type({ map: Action })
  actions = new MapSchema<Action>();
}

export class PokeBattleState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
  @type("string") phase: PokeBattlePhase;
  @type({ array: Round }) rounds = new ArraySchema<Round>();
  @type("number") currentRound: number;

  @type("string") winner: string;
  @type("number") maxPokemons: number;
  @type("number") guessesToWin: number;
  @type("number") switches: number;
}

export type PokeBattleStateType = typeof PokeBattleState;
