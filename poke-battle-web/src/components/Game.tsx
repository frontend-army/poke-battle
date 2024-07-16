import PokemonPicker from "./PokemonPicker";
import useColyseusRoom from "../hooks/useColyseusRoom";

export default function Game() {
  const { roomId, pickPokemon, confirmPokemons, guessPokemon, state } = useColyseusRoom();

  return (
    <main
      className="card bg-base-100 shadow-xl border border-base-300 container mx-auto my-10 py-40 flex flex-col items-center gap-3"
    >
      <h2>Room: {roomId}</h2>
      <h2>Phase: {state?.phase}</h2>
      {state?.phase === "PICK" && (<>
        <PokemonPicker index="0" onSelect={pickPokemon} />
        <PokemonPicker index="1" onSelect={pickPokemon} />
        <PokemonPicker index="2" onSelect={pickPokemon} />
        <button onClick={confirmPokemons} className="btn btn-primary">Confirm</button>
      </>)}
      {state?.phase === "GUESS" && (<>
        <PokemonPicker index="0" onSelect={pickPokemon} />
        <button onClick={() => guessPokemon(29)} className="btn btn-primary">Guess</button>
        <button className="btn btn-primary">Pokedex</button>
        <button className="btn btn-primary">Attack</button>
        <button className="btn btn-primary">Switch</button>
      </>)}
    </main>
  )
}
