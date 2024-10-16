import Loading from "../components/Loading";
import PokemonPicker from "../components/PokemonPicker";
import WaitingForRival from "../components/WaitingForRival";
import type { GameRoom } from "../hooks/useGameRoom";

export default function PhasePick({ game }: { game: GameRoom }) {
  const {
    currentPlayer,
    pickPokemon,
    pickRandomPokemons,
    confirmPokemons,
    state,
    rivalPlayer,
  } = game;

  return (
    <>
      {!rivalPlayer?.connected && (
        <Loading text="Waiting for rival to reconnect..." delay={800} />
      )}
      <div className="flex flex-col">
        {[...Array(state?.maxPokemons).keys()].map((i) => (
          <PokemonPicker
            key={i}
            label={`Pokemon #${i + 1}`}
            onSelect={(value) => pickPokemon(i, value)}
            selectedNumber={currentPlayer?.pokemons.get(i.toString())?.number}
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
        <WaitingForRival />
      )}
    </>
  );
}
