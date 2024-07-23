import type {
  GuessAttributes,
  PokeBattleGuess,
} from "../../../poke-battle-server/src/interfaces/PokeBattle.inferfaces";
import type { PokemonData } from "../../../poke-battle-server/src/pokemons";

const colorByResult: Record<string, string> = {
  CORRECT: "text-success",
  INCORRECT: "text-error",
  BIGGER: "text-error",
  SMALLER: "text-error",
};

export default function GuessResults({
  guessResults,
}: {
  guessResults: PokeBattleGuess[];
}) {
  console.log(guessResults);

  return (
    <div className="flex flex-col">
      {!!guessResults?.length &&
        guessResults.map((guess, index) => (
          <div key={index} className="flex flex-row gap-3">
            {Object.keys(guess.result).map((attr) => (
              <div className="flex flex-col">
                <p>
                  {attr}: {guess.pokemon[attr as keyof PokemonData]}
                </p>
                <p
                  className={
                    colorByResult[guess.result[attr as GuessAttributes]]
                  }
                >
                  {guess.result[attr as GuessAttributes]}
                </p>
              </div>
            ))}
          </div>
        ))}
    </div>
  );
}
