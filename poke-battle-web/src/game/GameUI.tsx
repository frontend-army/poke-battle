import { useState } from "react";
import PokemonPicker from "../components/PokemonPicker";
import useGameRoom from "./useGameRoom";
import PokemonBox from "../components/PokemonBox";
import { getPokemonByNumber } from "../../../poke-battle-server/src/pokemons";
import GuessResults from "../components/GuessResults";

export default function GameUI({
  gameRoom,
}: {
  gameRoom: ReturnType<typeof useGameRoom>;
}) {
  const {
    roomId,
    sessionId,
    pickPokemon,
    confirmPokemons,
    guessPokemon,
    guessResults,
    state,
  } = gameRoom;
  const currentPlayer = state?.players.get(sessionId);
  const myPokemons = [...(currentPlayer?.pokemons.values() || [])];
  const rivalPlayer = [...(state?.players.entries() || [])].find(
    ([id]) => id !== sessionId,
  )?.[1];
  const rivalPokemons = [...(rivalPlayer?.pokemons.values() || [])];

  const [currentGuess, setCurrentGuess] = useState<number | undefined>();

  function pickRandomPokemons() {
    const pokes = [];
    while (pokes.length < 3) {
      var r = Math.floor(Math.random() * 151) + 1;
      if (pokes.indexOf(r) === -1) pokes.push(r);
    }
    pokes.forEach((p, i) => pickPokemon(i, p));
  }

  // TODO: handle loading / waiting after actions
  return (
    <main className="card bg-base-100 shadow-xl border border-base-300 container mx-auto my-10 py-40 flex flex-col items-center gap-3">
      <h2>Room: {roomId}</h2>
      <h2>Phase: {state?.phase}</h2>

      {state?.phase === "PICK" && (
        <>
          <div className="flex flex-col">
            {[...Array(state?.maxPokemons).keys()].map((i) => (
              <PokemonPicker
                key={i}
                label={`Pokemon #${i + 1}`}
                onSelect={(value) => pickPokemon(i, value)}
                selectedNumber={
                  currentPlayer?.pokemons.get(i.toString())?.number
                }
                disabled={currentPlayer?.confirmed}
              />
            ))}
          </div>

          {!currentPlayer?.confirmed ? (
            <div className="flex gap-4">
              <button onClick={pickRandomPokemons} className="btn btn-accent">
                Pick Random
              </button>
              <button onClick={confirmPokemons} className="btn btn-success">
                Confirm
              </button>
            </div>
          ) : (
            <p>Waiting for rival...</p>
          )}
        </>
      )}
      {state?.phase === "GUESS" && (
        <>
          <p>Rival Pokemons:</p>
          <div className="flex flex-row">
            {rivalPokemons.map((p, i) => {
              const pokemon = getPokemonByNumber(p.number);
              return (
                <PokemonBox
                  active={i === rivalPlayer?.currentPokemon}
                  index={i}
                  pokemon={p.guessed ? pokemon : undefined}
                />
              );
            })}
          </div>
          <PokemonPicker
            placeholder="Pick a pokemon to guess"
            selectedNumber={currentGuess}
            onSelect={setCurrentGuess}
          />
          <GuessResults
            guessResults={guessResults.filter(
              (guess) => guess.pokemonIndex === rivalPlayer?.currentPokemon,
            )}
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
          {/* <button className="btn btn-primary">Pokedex</button>
          <button className="btn btn-primary">Attack</button>
          <button className="btn btn-primary">Switch</button> */}
          <p>My Pokemons:</p>
          <div className="flex flex-row">
            {myPokemons.map((p, i) => {
              const pokemon = getPokemonByNumber(p.number);
              return (
                <PokemonBox
                  active={currentPlayer?.currentPokemon === i}
                  index={i}
                  pokemon={pokemon}
                />
              );
            })}
          </div>
        </>
      )}
      {state?.phase === "RESULTS" && (
        <p>
          Winner:{" "}
          {state?.winner
            ? state?.winner === sessionId
              ? "You"
              : "Rival"
            : "Unknown"}
        </p>
      )}
    </main>
  );
}
