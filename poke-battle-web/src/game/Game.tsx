import { PokeBattlePhase } from "../../../poke-battle-server/src/interfaces/PokeBattle.inferfaces";
import PokemonPicker from "../components/PokemonPicker";
import useGameRoom from "./useGameRoom";

export default function Game() {
  const {
    roomId,
    sessionId,
    pickPokemon,
    confirmPokemons,
    guessPokemon,
    state,
  } = useGameRoom();
  console.log(sessionId, state?.players.get(sessionId));
  const currentPlayer = state?.players.get(sessionId);
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
              selectedNumber={currentPlayer?.pokemons.get(i.toString())}
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
          <PokemonPicker label="Pick your guess" onSelect={guessPokemon} />
          <button onClick={() => guessPokemon(29)} className="btn btn-primary">
            Guess
          </button>
          <button className="btn btn-primary">Pokedex</button>
          <button className="btn btn-primary">Attack</button>
          <button className="btn btn-primary">Switch</button>
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