import { useState } from "react";

import "./App.css";
import { FIRST_GEN_POKEMONS } from "./constants/POKE_LIST";
import { Button } from "./components/ui/button";
import { Loader2 } from "lucide-react";
import { DebateArena } from "./components/debate-arena";
import { PokemonSelect } from "./components/pokemon-select";

// Server API URL - move to environment variable in production
const API_URL = "http://localhost:3001/api";

interface IDebateMessage {
  role: "CLAUDE" | "GPT";
  content: string;
  round?: number;
}

function App() {
  const [pokemonA, setPokemonA] = useState(FIRST_GEN_POKEMONS[0]);
  const [pokemonB, setPokemonB] = useState(FIRST_GEN_POKEMONS[3]);
  const [messages, setMessages] = useState<IDebateMessage[]>([]);
  const [winner, setWinner] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [rounds, setRounds] = useState<number>(2);

  const callGPT = async (debateMessages: IDebateMessage[]) => {
    try {
      // Format messages for GPT API request
      const formattedMessages = debateMessages
        .map((msg) => {
          if (msg.role === "GPT") {
            return { role: "assistant", content: msg.content };
          } else if (msg.role === "CLAUDE") {
            return { role: "user", content: msg.content };
          }
          return null;
        })
        .filter(Boolean); // Remove any null entries

      console.log("Sending to GPT API:", formattedMessages.length, "messages");

      const response = await fetch(`${API_URL}/gpt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: formattedMessages,
          pokemonA,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed request to GPT API: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error calling GPT API:", error);
      return "Error: Could not get response from GPT";
    }
  };

  const callClaude = async (debateMessages: IDebateMessage[]) => {
    try {
      // Format messages for Claude API request
      const formattedMessages = debateMessages
        .map((msg) => {
          if (msg.role === "GPT") {
            return { role: "user", content: msg.content };
          } else if (msg.role === "CLAUDE") {
            return { role: "assistant", content: msg.content };
          }
          return null;
        })
        .filter(Boolean); // Remove any null entries

      console.log(
        "Sending to Claude API:",
        formattedMessages.length,
        "messages"
      );

      const response = await fetch(`${API_URL}/claude`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: formattedMessages,
          pokemonB,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed request to Claude API: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error calling Claude API:", error);
      return "Error: Could not get response from Claude";
    }
  };

  const getVerdict = async (debateMessages: IDebateMessage[]) => {
    try {
      // Extract GPT and Claude messages
      const gptMessages = debateMessages
        .filter((msg) => msg.role === "GPT")
        .map((msg) => msg.content);

      const claudeMessages = debateMessages
        .filter((msg) => msg.role === "CLAUDE")
        .map((msg) => msg.content);

      console.log("Getting verdict from Gemini");

      const response = await fetch(`${API_URL}/gemini`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gptMessages,
          claudeMessages,
          pokemonA,
          pokemonB,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed request to Gemini API: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error getting verdict:", error);
      return "Error: Could not get a verdict from Gemini";
    }
  };

  const startDebate = async () => {
    try {
      setIsLoading(true);
      setMessages([]);
      setWinner(null);

      const debateMessages: IDebateMessage[] = [];

      for (let i = 0; i < rounds; i++) {
        // Get GPT response with full context
        const gptResponse = await callGPT(debateMessages);
        console.log(`Round ${i + 1} GPT:`, gptResponse);

        const gptMessage: IDebateMessage = {
          role: "GPT",
          content: gptResponse,
          round: i + 1,
        };

        debateMessages.push(gptMessage);
        setMessages([...debateMessages]); // Update UI with current messages

        // Add a small delay to allow UI to update
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Get Claude response with full context
        const claudeResponse = await callClaude(debateMessages);
        console.log(`Round ${i + 1} Claude:`, claudeResponse);

        const claudeMessage: IDebateMessage = {
          role: "CLAUDE",
          content: claudeResponse,
          round: i + 1,
        };

        debateMessages.push(claudeMessage);
        setMessages([...debateMessages]); // Update UI with current messages

        // Add a small delay to allow UI to update
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      // Get final verdict
      console.log("Getting final verdict from Gemini...");
      const verdict = await getVerdict(debateMessages);
      setWinner(verdict);
    } catch (error) {
      console.error("Error in debate process:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-red-600">
      {/* Header */}
      <header className="p-4 text-center">
        <h1 className="text-4xl font-bold text-yellow-300 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] tracking-wider">
          Pokémon AI Debate
        </h1>
      </header>

      {/* Selection Area */}
      <div className="bg-sky-200 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <PokemonSelect
              pokemon={pokemonA}
              setPokemon={setPokemonA}
              pokemonList={FIRST_GEN_POKEMONS}
              label="Choose First Pokémon"
            />

            <div className="text-2xl font-bold bg-red-500 text-white px-4 py-2 rounded-full">
              VS
            </div>

            <PokemonSelect
              pokemon={pokemonB}
              setPokemon={setPokemonB}
              pokemonList={FIRST_GEN_POKEMONS}
              label="Choose Second Pokémon"
            />
          </div>

          <div className="mt-6 flex justify-center items-center gap-4">
            <div className="font-semibold text-gray-800">Number of Rounds:</div>
            <div className="flex border-2 border-gray-400 rounded-lg overflow-hidden">
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  onClick={() => setRounds(num)}
                  className={`px-4 py-2 ${
                    rounds === num
                      ? "bg-blue-500 text-white font-bold"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 text-center">
            <Button
              onClick={startDebate}
              disabled={isLoading}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-lg px-8 py-3 rounded-full border-4 border-blue-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Battle in Progress...
                </>
              ) : (
                "Start Pokémon Debate!"
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Debate Arena */}
      <DebateArena
        pokemonA={pokemonA}
        pokemonB={pokemonB}
        messages={messages}
        winner={winner}
        isLoading={isLoading}
      />
    </div>
  );
}

export default App;
