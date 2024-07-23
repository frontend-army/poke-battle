import type {
  GuessAttributes,
  PokeBattleGuess,
} from "../../../poke-battle-server/src/interfaces/PokeBattle.inferfaces";
import type { PokemonData } from "../../../poke-battle-server/src/pokemons";

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
          <div key={index} className="flex flex-row">
            {Object.keys(guess.result).map((attr) => (
              <div>
                {attr}: {guess.pokemon[attr as keyof PokemonData]}{" "}
                {guess.result[attr as GuessAttributes]}
              </div>
            ))}
          </div>
        ))}
    </div>
  );
}
