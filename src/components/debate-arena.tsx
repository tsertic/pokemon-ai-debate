import { Card } from "@/components/ui/card";
import { Loader2, Trophy } from "lucide-react";
import { useEffect, useState } from "react";

interface DebateArenaProps {
  pokemonA: string;
  pokemonB: string;
  messages: { role: string; content: string; round?: number }[];
  winner: string | null;
  isLoading: boolean;
}

export function DebateArena({
  pokemonA,
  pokemonB,
  messages,
  winner,
  isLoading,
}: DebateArenaProps) {
  const [winnerPokemon, setWinnerPokemon] = useState<string | null>(null);
  const [winnerImage, setWinnerImage] = useState<string | null>(null);
  const [showWinnerEffect, setShowWinnerEffect] = useState(false);

  // Parse winner text to determine which Pokémon won
  useEffect(() => {
    if (winner) {
      // Look for the winning Pokémon in the winner text
      const winnerText = winner.toUpperCase();

      // First check for explicit "WINNER: X" format
      const winnerMatch = winnerText.match(/WINNER:\s*(\w+)/i);
      if (winnerMatch && winnerMatch[1]) {
        const pokemonName = winnerMatch[1];
        setWinnerPokemon(pokemonName);
      } else if (winnerText.includes(pokemonA.toUpperCase())) {
        setWinnerPokemon(pokemonA);
      } else if (winnerText.includes(pokemonB.toUpperCase())) {
        setWinnerPokemon(pokemonB);
      }

      // We removed the automatic reveal - now it only happens on click
    }
  }, [winner, pokemonA, pokemonB]);

  // Fetch winner Pokémon image
  useEffect(() => {
    const fetchPokemonImage = async () => {
      if (!winnerPokemon) return;

      try {
        const formattedName = winnerPokemon.toLowerCase();
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${formattedName}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch ${winnerPokemon}`);
        }

        const data = await response.json();
        const officialArtwork =
          data.sprites.other["official-artwork"].front_default;
        const sprite = officialArtwork || data.sprites.front_default;

        if (sprite) {
          setWinnerImage(sprite);
        }
      } catch (error) {
        console.error(`Error fetching ${winnerPokemon} image:`, error);
      }
    };

    if (winnerPokemon) {
      fetchPokemonImage();
    }
  }, [winnerPokemon]);

  const getAIAvatar = (ai: string) => {
    if (ai === "GPT") return "/images/bot-two.png";
    if (ai === "CLAUDE") return "/images/bot-one.png";
    return "/placeholder.svg?height=64&width=64";
  };

  const getAIColor = (ai: string) => {
    if (ai === "GPT") return "bg-green-100 border-green-500";
    if (ai === "CLAUDE") return "bg-purple-100 border-purple-500";
    return "bg-gray-100";
  };

  return (
    <div className="bg-blue-600 p-6 min-h-[400px]">
      <div className="max-w-4xl mx-auto">
        {/* AI Debaters */}
        <div className="flex justify-between mb-4">
          <div className="flex items-center">
            <div className="bg-white rounded-full p-1 border-4 border-red-500">
              <img
                src={getAIAvatar("GPT") || "/placeholder.svg"}
                alt="GPT"
                width={64}
                height={64}
                className="rounded-full"
              />
            </div>
            <div className="ml-2 bg-red-500 text-white px-3 py-1 rounded-lg font-bold">
              GPT for {pokemonA}
            </div>
          </div>
          <div className="flex items-center">
            <div className="mr-2 bg-blue-500 text-white px-3 py-1 rounded-lg font-bold">
              Claude for {pokemonB}
            </div>
            <div className="bg-white rounded-full p-1 border-4 border-blue-500">
              <img
                src={getAIAvatar("CLAUDE") || "/placeholder.svg"}
                alt="Claude"
                width={64}
                height={64}
                className="rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Debate Messages */}
        <Card className="bg-white border-8 border-black rounded-xl p-4 min-h-[300px] relative overflow-hidden">
          {messages.length === 0 && !isLoading ? (
            <div className="flex items-center justify-center h-64 text-gray-500 italic">
              Select two Pokémon and start the debate!
            </div>
          ) : (
            <div className="space-y-6">
              {/* Group messages by round */}
              {Array.from(new Set(messages.map((m) => m.round || 1))).map(
                (round) => (
                  <div key={`round-${round}`} className="space-y-4">
                    <div className="text-center">
                      <span className="inline-block bg-yellow-300 text-black px-3 py-1 rounded-full font-bold border-2 border-black">
                        Round {round}
                      </span>
                    </div>

                    {messages
                      .filter((msg) => (msg.round || 1) === round)
                      .map((msg, index) => (
                        <div
                          key={`${round}-${index}`}
                          className={`p-3 rounded-xl border-2 ${getAIColor(
                            msg.role
                          )} ${msg.role === "GPT" ? "mr-12" : "ml-12"}`}
                        >
                          <div className="font-bold mb-1">
                            {msg.role === "GPT"
                              ? `GPT (${pokemonA})`
                              : `Claude (${pokemonB})`}
                            :
                          </div>
                          <div>{msg.content}</div>
                        </div>
                      ))}
                  </div>
                )
              )}

              {isLoading && (
                <div className="flex justify-center items-center py-4">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  <span className="ml-2 text-blue-500 font-medium">
                    {messages.length === 0
                      ? "Waiting for first argument..."
                      : `Round ${
                          Math.floor(messages.length / 2) + 1
                        } in progress...`}
                  </span>
                </div>
              )}

              {winner && !showWinnerEffect && (
                <div
                  className="mt-6 p-4 bg-yellow-100 border-2 border-yellow-500 rounded-xl relative cursor-pointer transition-all hover:bg-yellow-200 hover:shadow-lg"
                  onClick={() => setShowWinnerEffect(true)}
                >
                  <div className="font-bold text-center mb-2 text-xl">
                    Judge Gemini's Final Decision
                  </div>
                  <div className="text-center font-bold text-lg">
                    Click to reveal winner!
                  </div>
                  <div className="flex justify-center mt-2">
                    <div className="animate-bounce">
                      <Trophy className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                </div>
              )}

              {/* Winner Animation Overlay */}
              {showWinnerEffect && winnerImage && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-10">
                  <div className="relative bg-gray-800 p-8 rounded-xl max-w-2xl w-full mx-auto">
                    <div className="animate-bounce absolute -top-16 left-1/2 transform -translate-x-1/2">
                      <Trophy className="h-12 w-12 text-yellow-400" />
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <div className="relative flex-shrink-0">
                        <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 rounded-full animate-pulse opacity-70" />
                        <img
                          src={winnerImage}
                          alt={winnerPokemon || "Winner"}
                          className="h-40 w-40 object-contain relative z-10 animate-pulse-slow bg-gray-700 rounded-full p-2"
                        />
                      </div>

                      <div className="text-center md:text-left flex-grow">
                        <h2 className="text-3xl font-bold text-white mb-2">
                          {winnerPokemon}
                        </h2>
                        <div className="text-xl text-yellow-300 font-bold mb-3">
                          is the WINNER!
                        </div>
                        <div className="text-white text-base max-h-28 overflow-y-auto">
                          {winner}
                        </div>
                      </div>
                    </div>

                    <div className="text-center mt-6">
                      <button
                        onClick={() => setShowWinnerEffect(false)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Pokéball Pattern Overlay */}
          <div className="absolute -bottom-16 -right-16 w-32 h-32 rounded-full bg-red-500 border-8 border-black opacity-10"></div>
          <div className="absolute -top-16 -left-16 w-32 h-32 rounded-full bg-red-500 border-8 border-black opacity-10"></div>
        </Card>

        {/* Judge Section */}
        {(messages.length > 0 || isLoading) && !winner && (
          <div className="mt-4 text-center">
            <div className="inline-block bg-yellow-300 text-black px-4 py-2 rounded-lg border-2 border-black">
              <div className="font-bold">Gemini AI Judge</div>
              <div className="text-sm">
                {messages.length % 2 !== 0
                  ? "Waiting for response..."
                  : messages.length === 0
                  ? "Waiting for debate to start..."
                  : `Round ${Math.floor(messages.length / 2)} of ${Math.ceil(
                      messages.length / 2
                    )} complete`}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
