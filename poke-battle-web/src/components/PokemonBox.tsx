import type { POKEMONS } from "../../../poke-battle-server/src/pokemons";
import pokeball from "../assets/pokeball.png";

export default function PokemonBox({
  index,
  pokemon,
  active,
  grayed,
}: {
  index: number;
  pokemon?: (typeof POKEMONS)[0];
  active: boolean;
  grayed?: boolean;
}) {
  return (
    <div
      className={`card flex join items-center flex-col w-24 aspect-square border-8 border-double ${active ? " border-accent" : "border-transparent"}`}
    >
      <p className="font-bold text-xl">#{index + 1}</p>
      {pokemon ? (
        <>
          <img
            alt=""
            className={grayed ? "grayscale" : ""}
            width={80}
            src={pokemon?.sprite}
          />
          <p className="capitalize text-lg">{pokemon?.name}</p>
        </>
      ) : (
        <div className="w-[80px] h-[80px] flex items-center justify-center relative">
          <img
            className="absolute opacity-100 grayscale"
            src={pokeball.src}
            alt="Unknown Pokemon"
            width="60"
            height="60"
          />
          <p className="text-accent text-center font-extrabold text-5xl z-10">?</p>
        </div>
      )}
    </div>
  );
}
