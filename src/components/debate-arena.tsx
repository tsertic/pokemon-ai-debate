import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

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
  const getAIAvatar = (ai: string) => {
    if (ai === "GPT") return "/placeholder.svg?height=64&width=64";
    if (ai === "Claude") return "/placeholder.svg?height=64&width=64";
    return "/placeholder.svg?height=64&width=64";
  };

  const getAIColor = (ai: string) => {
    if (ai === "GPT") return "bg-green-100 border-green-500";
    if (ai === "Claude") return "bg-purple-100 border-purple-500";
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
                src={getAIAvatar("Claude") || "/placeholder.svg"}
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

              {winner && (
                <div className="mt-6 p-4 bg-yellow-100 border-2 border-yellow-500 rounded-xl">
                  <div className="font-bold text-center mb-2 text-xl">
                    Gemini's Final Decision:
                  </div>
                  <div className="text-center">{winner}</div>
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
