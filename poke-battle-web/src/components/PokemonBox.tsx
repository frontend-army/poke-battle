import type { POKEMONS } from "../../../poke-battle-server/src/pokemons";

export default function PokemonBox({
  index,
  pokemon,
  active,
}: {
  index: number;
  pokemon?: (typeof POKEMONS)[0];
  active: boolean;
}) {
  return (
    <div
      className={`card flex join items-center flex-col w-24 ${active ? "border-8 border-double border-amber-500" : ""}`}
    >
      <p>#{index + 1}</p>
      {pokemon ? (
        <>
          <img width={80} src={pokemon?.sprite} />
          <p className="capitalize">{pokemon?.name}</p>
        </>
      ) : (
        "?"
      )}
    </div>
  );
}
