export default function PokemonPicker({ index, onSelect }: { index: string; onSelect: (pokemon: number) => void }) {
  return (
    <div className="flex flex-col gap-4">
      <p>Pokemon #{index}</p>
      <select onChange={(event) => onSelect(parseInt(event.target.value, 10))} className="select w-full max-w-xs">
        <option disabled selected>Pick your pokemon</option>
        {[...Array(150).keys()].map((i) => <option key={i}>{i}</option>)}
      </select>
    </div>
  )
}
