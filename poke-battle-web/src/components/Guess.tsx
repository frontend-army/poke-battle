import useGameRoom from "../game/useGameRoom";
import { GuessAttributes } from "../interfaces/PokeBattle.inferfaces";

export default function Guess() {
  const { guessResults } = useGameRoom();

  return (
    <div className="row">
      {guessResults?.length &&
        guessResults.length > 0 &&
        guessResults.map((guess, index) => (
          <div key={index}>
            {Object.keys(guess).map((attr) => (
              <div>{guess[attr as GuessAttributes]}</div>
            ))}
          </div>
        ))}
    </div>
  );
}
