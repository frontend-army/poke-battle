import { useMemo, useState } from "react";
import { POKEMONS } from "../../../poke-battle-server/src/pokemons";

export default function PokemonPicker({
  label,
  onSelect,
  selectedNumber,
  disabled,
  placeholder = "Type pokemon name",
}: {
  label?: string;
  onSelect: (pokemon: number) => void;
  selectedNumber?: number;
  disabled?: boolean;
  placeholder?: string;
}) {
  const [search, setSearch] = useState<string>("");

  const results = useMemo(
    () =>
      search
        ? POKEMONS.filter((pokemon) =>
            pokemon.name
              .toLocaleLowerCase()
              .startsWith(search.toLocaleLowerCase()),
          ).slice(0, 3)
        : [],
    [search],
  );
  const selectedPokemon = POKEMONS.find((p) => p.number === selectedNumber);

  return (
    <div className="flex flex-col gap-4">
      {label && <p>{label}</p>}
      {selectedPokemon && (
        <div className="join items-center gap-4 relative">
          <button
            onClick={() => onSelect(-1)}
            className="absolute top-2 left-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </button>
          <img
            className="rounded-xl border-4 border-double border-accent p-1"
            width={100}
            height={100}
            src={selectedPokemon.sprite}
          />
          <p className="capitalize">{selectedPokemon.name}</p>
        </div>
      )}
      {!selectedPokemon && !disabled && (
        <>
          <label className="input input-bordered flex items-center gap-2">
            <input
              type="text"
              className="grow"
              placeholder={placeholder}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
          </label>
          <div className={`dropdown ${results?.length ? "dropdown-open" : ""}`}>
            <ul className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow capitalize">
              {results.map((pokemon) => (
                <li>
                  <button
                    onClick={() => {
                      onSelect(pokemon.number);
                      setSearch("");
                    }}
                  >
                    <img width={80} height={80} src={pokemon.sprite} />
                    <p className="capitalize">{pokemon.name}</p>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
