import { useState } from "react";
import PokemonPicker from "../components/PokemonPicker";
import useGameRoom from "./useGameRoom";
import PokemonBox from "../components/PokemonBox";
import Guess from "../components/Guess";
import { getPokemonByNumber } from "./pokemons";
import { PokeBattlePhase } from "../interfaces/PokeBattle.inferfaces";

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
    state,
  } = gameRoom;
  const currentPlayer = state?.players.get(sessionId);
  const myPokemons = [...(currentPlayer?.pokemons.values() || [])];
  const rivalPlayer = [...(state?.players.entries() || [])].find(
    ([id]) => id !== sessionId,
  )?.[1];
  const rivalPokemons = [...(rivalPlayer?.pokemons.values() || [])];

  const [currentGuess, setCurrentGuess] = useState<number | undefined>();

  // TODO: handle loading / waiting after actions
  return (
    <main className="card bg-base-100 shadow-xl border border-base-300 container mx-auto my-10 py-40 flex flex-col items-center gap-3">
      <h2>Room: {roomId}</h2>
      <h2>Phase: {state?.phase}</h2>

      {state?.phase === "PICK" && (
        <>
          {[...Array(state?.maxPokemons).keys()].map((i) => (
            <PokemonPicker
              key={i}
              label={`Pokemon #${i + 1}`}
              onSelect={(value) => pickPokemon(i, value)}
              selectedNumber={currentPlayer?.pokemons.get(i.toString())?.number}
              disabled={currentPlayer?.confirmed}
            />
          ))}
          {!currentPlayer?.confirmed ? (
            <button onClick={confirmPokemons} className="btn btn-primary">
              Confirm
            </button>
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
            label="Pick your guess"
            selectedNumber={currentGuess}
            onSelect={setCurrentGuess}
          />
          <Guess />
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
          <button className="btn btn-primary">Pokedex</button>
          <button className="btn btn-primary">Attack</button>
          <button className="btn btn-primary">Switch</button>
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
      {state?.phase === PokeBattlePhase.RESULTS && (
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
