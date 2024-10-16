import { useState } from "react";
import PokemonPicker from "../components/PokemonPicker";
import useGameRoom, { type GameRoom } from "../hooks/useGameRoom";
import PokemonBox from "../components/PokemonBox";
import { getPokemonByNumber } from "../../../poke-battle-server/src/pokemons";
import GuessResults from "../components/GuessResults";
import GuessResultsCompact from "../components/GuessResultsCompact";
import type {
  PokeBattleGuess,
  PokeBattleGuessActions,
} from "../../../poke-battle-server/src/interfaces/PokeBattle.inferfaces";
import WaitingForRival from "../components/WaitingForRival";
import Loading from "../components/Loading";

export default function PhaseMain({
  game,
  gameFinished,
}: {
  game: GameRoom;
  gameFinished?: boolean;
}) {
  const {
    currentPlayer,
    myPokemons,
    rivalPlayer,
    rivalPokemons,
    waitingForRivalAction,
    guessPokemon,
    switchPokemon,
    guessResults,
    state,
  } = game;
  const [currentGuess, setCurrentGuess] = useState<number | undefined>();
  const [currentAction, setCurrentAction] = useState<
    PokeBattleGuessActions["type"] | undefined
  >();

  function renderActions() {
    return (
      <>
        {!rivalPlayer?.connected && (
          <Loading text="Waiting for rival to reconnect..." delay={800} />
        )}
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
            {currentAction === "SWITCH" && (
              <button
                onClick={() => {
                  switchPokemon();
                  setCurrentAction(undefined);
                }}
                className="btn btn-success"
              >
                Confirm
              </button>
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
                  onClick={() => setCurrentAction("SWITCH")}
                  className="btn btn-primary"
                  disabled={
                    (currentPlayer?.switches ?? 0) >= (state?.switches ?? 0) ||
                    myPokemons.filter((p) => !p.guessed).length <= 1
                  }
                >
                  {`Switch to next (${(state?.switches ?? 0) - (currentPlayer?.switches ?? 0)}/${state?.switches})`}
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
        <GuessResults guessResults={guessResults} />
      </>
    );
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
        guessResults={[...(rivalPlayer?.results || [])]
          .map((result) => JSON.parse(result || "{}") as PokeBattleGuess)
          .filter(
            (result) => result.pokemonIndex === currentPlayer?.currentPokemon,
          )
          .reverse()}
      />
    </>
  );
}
