import { useState } from "react";
import PokemonPicker from "../components/PokemonPicker";
import useGameRoom from "./useGameRoom";
import PokemonBox from "../components/PokemonBox";
import { getPokemonByNumber } from "../../../poke-battle-server/src/pokemons";
import GuessResults from "../components/GuessResults";
import GuessResultsCompact from "../components/GuessResultsCompact";
import type {
  PokeBattleGuess,
  PokeBattleGuessActions,
} from "../../../poke-battle-server/src/interfaces/PokeBattle.inferfaces";
import WaitingForRival from "../components/WaitingForRival";

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
  gameFinished
}: {
  gameFinished?: boolean;
  gameRoom: ReturnType<typeof useGameRoom>;
}) {
  const [currentGuess, setCurrentGuess] = useState<number | undefined>();
  const [currentAction, setCurrentAction] = useState<
    PokeBattleGuessActions["type"] | undefined
  >();

  function renderActions() {
    return <>
      {waitingForRivalAction ? (
        <WaitingForRival />
      ) : (
        <>
          {currentAction === "GUESS" && (
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
                      setCurrentAction(undefined);
                    }
                  }}
                  className="btn btn-secondary"
                >
                  Guess
                </button>
              )}
            </>
          )}
          {!currentAction ? (
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setCurrentAction("GUESS")}
                className="btn btn-secondary"
              >
                Guess (∞)
              </button>
              <button
                disabled
                onClick={() => setCurrentAction("POKEDEX")}
                className="btn btn-success"
              >
                Pokedex (0/1)
              </button>
              <button
                disabled
                onClick={() => setCurrentAction("ATTACK")}
                className="btn btn-accent"
              >
                Attack (0/3)
              </button>
              <button
                disabled
                onClick={() => setCurrentAction("SWITCH")}
                className="btn btn-primary"
              >
                Switch (0/2)
              </button>
            </div>
          ) : (
            <button
              onClick={() => setCurrentAction(undefined)}
              className="btn btn-primary"
            >
              Return
            </button>
          )}
        </>
      )}
      <GuessResults
        guessResults={guessResults
          .filter((guess) => guess.pokemonIndex === rivalPlayer?.currentPokemon)
          .reverse()}
      />
    </>
  }

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
              pokemon={p.number ? pokemon : undefined}
              grayed={!p.guessed}
            />
          );
        })}
      </div>
      {!gameFinished && renderActions()}
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
          .filter((guess) => guess.pokemonIndex === rivalPlayer?.currentPokemon)
          .reverse()}
      />
    </>
  );
}
