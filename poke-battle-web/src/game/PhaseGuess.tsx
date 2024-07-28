import { useState } from "react";
import PokemonPicker from "../components/PokemonPicker";
import useGameRoom from "./useGameRoom";
import PokemonBox from "../components/PokemonBox";
import { getPokemonByNumber } from "../../../poke-battle-server/src/pokemons";
import GuessResults from "../components/GuessResults";
import GuessResultsCompact from "../components/GuessResultsCompact";
import type { PokeBattleGuess } from "../../../poke-battle-server/src/interfaces/PokeBattle.inferfaces";
import WaitingForRival from "../components/WaitingForRival";

const DEBUG = import.meta.env.MODE === "development";

export default function PhaseGuess({
  gameRoom: {
    currentPlayer,
    myPokemons,
    rivalId,
    rivalPlayer,
    rivalPokemons,
    waitingForRivalAction,
    guessPokemon,
    guessResults,
    state,
  },
}: {
  gameRoom: ReturnType<typeof useGameRoom>;
}) {
  const [currentGuess, setCurrentGuess] = useState<number | undefined>();

  return (
    <>
      <p className="text-4xl">Score</p>
      <p className="text-4xl">
        {rivalPokemons.filter((p) => p.guessed).length} -{" "}
        {myPokemons.filter((p) => p.guessed).length}
      </p>
      <p>Rival Pokemons:</p>
      <div className="flex flex-row">
        {rivalPokemons.map((p, i) => {
          const pokemon = getPokemonByNumber(p.number);
          return (
            <PokemonBox
              key={i}
              active={i === rivalPlayer?.currentPokemon}
              index={i}
              pokemon={p.guessed ? pokemon : undefined}
            />
          );
        })}
      </div>
      {waitingForRivalAction ? (
        <WaitingForRival />
      ) : (
        <>
          <PokemonPicker
            placeholder="Pick a pokemon to guess"
            selectedNumber={currentGuess}
            onSelect={setCurrentGuess}
          />
          {currentGuess && (
            <button
              onClick={() => {
                if (currentGuess) {
                  guessPokemon(currentGuess);
                  setCurrentGuess(undefined);
                }
              }}
              className="btn btn-primary"
            >
              Guess
            </button>
          )}
          <GuessResults
            guessResults={guessResults.filter(
              (guess) => guess.pokemonIndex === rivalPlayer?.currentPokemon,
            )}
          />
          {/* <button className="btn btn-primary">Pokedex</button>
          <button className="btn btn-primary">Attack</button>
          <button className="btn btn-primary">Switch</button> */}
        </>
      )}

      <p>My Pokemons:</p>
      <div className="flex flex-row">
        {myPokemons.map((p, i) => {
          const pokemon = getPokemonByNumber(p.number);
          return (
            <PokemonBox
              key={i}
              active={currentPlayer?.currentPokemon === i}
              grayed={p.guessed}
              index={i}
              pokemon={pokemon}
            />
          );
        })}
      </div>
      <GuessResultsCompact
        guessResults={[...(state?.rounds || [])]
          .map(
            (round) =>
              JSON.parse(round.results.get(rivalId) || "{}") as PokeBattleGuess,
          )
          .filter(
            (guess) => guess.pokemonIndex === rivalPlayer?.currentPokemon,
          )}
      />
    </>
  );
}
