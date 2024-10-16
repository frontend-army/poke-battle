import type { ReactElement } from "react";
import type {
  GuessAttributes,
  PokeBattleGuess,
} from "../../../poke-battle-server/src/interfaces/PokeBattle.inferfaces";
import type { PokemonData } from "../../../poke-battle-server/src/pokemons";

const classNameByResult: Record<string, string> = {
  CORRECT: "bg-success",
  PARTIAL: "bg-warning",
  INCORRECT: "bg-error",
  BIGGER: "bg-error",
  SMALLER: "bg-error",
};

const iconByResult: Record<string, ReactElement | undefined> = {
  BIGGER: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={5}
      stroke="currentColor"
      className="size-7 opacity-75 p-1"
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
      className="size-7 opacity-75 p-1"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
      />
    </svg>
  ),
};

export default function GuessResultsCompact({
  guessResults,
}: {
  guessResults: PokeBattleGuess[];
}) {
  return (
    <div className="overflow-x-auto max-w-full mx-2">
      {!!guessResults?.length &&
        guessResults.map((guess, index) => (
          <div key={index} className="flex flex-row">
            <div
              style={{
                backgroundImage: `url('${guess.pokemon.sprite}')`,
                backgroundSize: "40px",
              }}
              className={`rounded-md border-4 border-double border-neutral w-[32px] h-[32px] bg-center`}
            ></div>
            {Object.keys(guess.result).map((attr) => (
              <div
                key={attr}
                className={
                  "flex items-center justify-center w-[32px] h-[32px] p-1 border-4 relative rounded-md border-double border-neutral " +
                  classNameByResult[guess.result[attr as GuessAttributes]]
                }
              >
                <div className="absolute">
                  {iconByResult[guess.result[attr as GuessAttributes]]}
                </div>
              </div>
            ))}
          </div>
        ))}
    </div>
  );
}
