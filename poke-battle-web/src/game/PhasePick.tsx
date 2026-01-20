import { getPokemonByNumber } from "../../../poke-battle-server/src/pokemons";
import Loading from "../components/Loading";
import PokemonBox from "../components/PokemonBox";
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
          <div key={i} className="flex flex-col text-center">
            <p className="font-bold text-xl">Pick Pokemon #{i + 1}</p>
            <div className="flex fit-content">
              {[...Array(state?.maxPickOptions).keys()].map((j) => (
                <button key={j}
                  className="cursor-pointer"
                  onClick={() => pickPokemon(i, j)}
                >
                  <PokemonBox
                    active={currentPlayer?.pokemons.get(i.toString())?.number === getPokemonByNumber(currentPlayer?.pickOptions?.[i]?.options?.[j] ?? 0)?.number} pokemon={getPokemonByNumber(currentPlayer?.pickOptions?.[i]?.options?.[j] ?? 0)} />
                </button>
              ))}
            </div>
          </div>
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
