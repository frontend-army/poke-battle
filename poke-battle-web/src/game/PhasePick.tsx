import PokemonPicker from "../components/PokemonPicker";
import WaitingForRival from "../components/WaitingForRival";
import useGameRoom from "./useGameRoom";

export default function PhasePick({
  gameRoom: {
    currentPlayer,
    pickPokemon,
    pickRandomPokemons,
    confirmPokemons,
    state,
  },
}: {
  gameRoom: ReturnType<typeof useGameRoom>;
}) {
  return (
    <>
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
