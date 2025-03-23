"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PokemonSelectProps {
  pokemon: string;
  setPokemon: (pokemon: string) => void;
  pokemonList: string[];
  label: string;
}

export function PokemonSelect({
  pokemon,
  setPokemon,
  pokemonList,
  label,
}: PokemonSelectProps) {
  const getPokemonImageUrl = (name: string) => {
    const formattedName = name.toLowerCase();
    return `/placeholder.svg?height=96&width=96`;
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-semibold text-gray-800">{label}</div>
      <div className="bg-white rounded-full p-2 border-4 border-gray-300 mb-2">
        <img
          src={getPokemonImageUrl(pokemon) || "/placeholder.svg"}
          alt={pokemon}
          width={96}
          height={96}
          className="rounded-full"
        />
      </div>
      <Select value={pokemon} onValueChange={setPokemon}>
        <SelectTrigger className="w-40 bg-white border-2 border-gray-400">
          <SelectValue placeholder="Select Pokémon" />
        </SelectTrigger>
        <SelectContent>
          {pokemonList.map((p) => (
            <SelectItem key={p} value={p} className="cursor-pointer">
              {p}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
