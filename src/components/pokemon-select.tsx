"use client";
import { useEffect, useState } from "react";
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
  const [imageUrl, setImageUrl] = useState<string>(
    "/placeholder.svg?height=96&width=96"
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchPokemonImage = async () => {
      if (!pokemon) return;

      setIsLoading(true);
      try {
        // Convert Pokémon name to lowercase for the API
        const formattedName = pokemon.toLowerCase();

        // Fetch Pokémon data from the PokeAPI
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${formattedName}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch ${pokemon}`);
        }

        const data = await response.json();

        // Get the official artwork from the sprites
        const officialArtwork =
          data.sprites.other["official-artwork"].front_default;
        // Fallback to front_default if official artwork isn't available
        const sprite = officialArtwork || data.sprites.front_default;

        if (sprite) {
          setImageUrl(sprite);
        }
      } catch (error) {
        console.error(`Error fetching ${pokemon} image:`, error);
        setImageUrl("/placeholder.svg?height=96&width=96");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPokemonImage();
  }, [pokemon]);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-semibold text-gray-800">{label}</div>
      <div className="bg-white rounded-full p-2 border-4 border-gray-300 mb-2 w-28 h-28 flex items-center justify-center">
        {isLoading ? (
          <div className="animate-pulse bg-gray-200 w-20 h-20 rounded-full" />
        ) : (
          <img
            src={imageUrl}
            alt={pokemon}
            width={96}
            height={96}
            className="rounded-full object-contain"
            onError={() => setImageUrl("/placeholder.svg?height=96&width=96")}
          />
        )}
      </div>
      <Select value={pokemon} onValueChange={setPokemon}>
        <SelectTrigger className="w-40 bg-white border-2 border-gray-400">
          <SelectValue placeholder="Select Pokémon" />
        </SelectTrigger>
        <SelectContent className="max-h-60">
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
