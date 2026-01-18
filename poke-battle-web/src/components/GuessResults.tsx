import type { ReactElement } from "react";
import type {
  GuessAttributes,
  PokeBattleGuess,
} from "../../../poke-battle-server/src/interfaces/PokeBattle.inferfaces";
import type { PokemonData } from "../../../poke-battle-server/src/pokemons";

const classNameByResult: Record<string, string> = {
  CORRECT: "bg-success-content",
  PARTIAL: "bg-warning-content",
  INCORRECT: "bg-error-content",
  BIGGER: "bg-error-content",
  SMALLER: "bg-error-content",
};

const iconByResult: Record<string, ReactElement | undefined> = {
  BIGGER: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={5}
      stroke="currentColor"
      className="size-20 opacity-30 p-1"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
      />
    </svg>
  ),
  SMALLER: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={5}
      stroke="currentColor"
      className="size-20 opacity-30 p-1"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
      />
    </svg>
  ),
};

function formatAttr(attr: string, value: string | number | string[]): string {
  if (attr === "weight") {
    return `${(value as number) / 10}kg`;
  }

  if (attr === "height") {
    return `${(value as number) / 10}m`;
  }

  return Array.isArray(value) ? value.join(" ") : value.toString();
}

function hasLongWord(text: string): boolean {
  const words = text.split(/[\s,]+/);
  return words.some((word) => word.length > 5);
}

export default function GuessResults({
  guessResults,
}: {
  guessResults: PokeBattleGuess[];
}) {
  if (!!!guessResults?.length) return null;
  return (
    <div className="overflow-x-auto max-w-full mx-2">
      <table className="table table-xs table-pin-rows">
        <thead>
          <tr className="text-center">
            <th>Pokémon</th>
            {[
              "stage",
              "color",
              "habitat",
              "height",
              "weight",
              "type 1",
              "type 2",
            ].map((attr) => (
              <td key={attr}>
                <p className="capitalize">{attr}</p>
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          {!!guessResults?.length &&
            guessResults.map((guess, index) => (
              <tr key={index}>
                <th
                  className="tooltip w-[80px] h-[80px] flex items-center justify-center"
                  data-tip={guess.pokemon.name}
                >
                  <img
                    className="flex-1"
                    alt={guess.pokemon.name}
                    width={80}
                    src={guess.pokemon.sprite}
                  />
                </th>
                {Object.keys(guess.result).map((attr) => (
                  <td key={attr}>
                    <div
                      className={
                        "flex flex-col items-center justify-center w-[80px] h-[80px] p-1 border-4 relative rounded-md border-double border-neutral " +
                        classNameByResult[guess.result[attr as GuessAttributes]]
                      }
                    >
                      <div className="absolute">
                        {iconByResult[guess.result[attr as GuessAttributes]]}
                      </div>
                      <p className={`font-bold ${hasLongWord(formatAttr(attr, guess.pokemon[attr as keyof PokemonData]).replace("-", " ")) ? "text-xs" : "text-lg"} capitalize wrap-anywhere hyphens-auto align-middle flex-grow-0`}>
                        {formatAttr(
                          attr,
                          guess.pokemon[attr as keyof PokemonData],
                        ).replace("-", " ")}
                      </p>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
