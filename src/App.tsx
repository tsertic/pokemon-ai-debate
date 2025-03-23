import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";

import { useState } from "react";

import "./App.css";
import { FIRST_GEN_POKEMONS } from "./constants/POKE_LIST";
import { Button } from "./components/ui/button";
import { Loader2 } from "lucide-react";
import { DebateArena } from "./components/debate-arena";
import { PokemonSelect } from "./components/pokemon-select";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});
const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true,
});
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);
const modelGem = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

function App() {
  const [pokemonA, setPokemonA] = useState(FIRST_GEN_POKEMONS[0]);
  const [pokemonB, setPokemonB] = useState(FIRST_GEN_POKEMONS[3]);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [gptMessages, setGptMessages] = useState<string[]>(["hi"]);
  const [claudeMessages, setClaudeMessages] = useState<string[]>(["hello"]);
  const [winner, setWinner] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [rounds, setRounds] = useState<number>(2);

  const gptSystem = `You are an AI debater who argues that ${pokemonA} is superior.2 sentences max.`;

  const callGPT = async (): Promise<string> => {
    setIsLoading(true);
    for (let i = 0; i < gptMessages.length; i++) {
      setMessages((prevState) => [
        ...prevState,
        { role: "assistant", content: gptMessages[i] },
      ]);

      if (claudeMessages[i]) {
        setMessages((prevState) => [
          ...prevState,
          { role: "user", content: claudeMessages[i] },
        ]);
      }
    }
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: gptSystem }],
    });
    setIsLoading(false);
    return completion.choices[0]?.message?.content || "";
  };

  const callClaude = async (chatgptMessages: string[]): Promise<string> => {
    try {
      const allMessages = [
        ...chatgptMessages
          .map((msg, i) => [
            { role: "user", content: msg },
            { role: "assistant", content: claudeMessages[i] || "" },
          ])
          .flat(),
      ];

      console.log(allMessages, "All mesages");
      /* const completion = await anthropic.messages.create({
        model: "claude-3-haiku-20240307",
        system: claudeSystem,
        messages: allMessages as any,
        max_tokens: 500,
      }); */
      const response = await fetch("http://localhost:3001/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: allMessages, pokemonB }),
      });
      if (!response.ok)
        throw new Error("Neuspješan zahtjev prema proxy serveru.");

      return response.json();
    } catch (error) {
      console.error("Greška u pozivu Claude API-ja:", error);
      return "";
    }
  };

  const callGemini = async (
    gptResponse: string[],
    claudeResponse: string[]
  ): Promise<string> => {
    const chatSession = modelGem.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 500,
      },
    });
    const prompt = `
    You are a fair and impartial judge in a Pokémon debate.
    You listen carefully to the arguments made by two AI debaters.
    After evaluating their logic, reasoning, and evidence, you make a final judgment on which Pokémon is superior.
    Your decision must be based on the debate, not personal bias.
    Summarize the key points from both sides and declare the winner in a maximum of 3 sentences.
    last sentance should be WINNER: POKEMON WHO WON DEBATE

    GPT-4o-mini's arguments: ${gptResponse.join(" | ")}
    Claude-3-haiku's arguments: ${claudeResponse.join(" | ")}
  `;

    const response = await chatSession.sendMessage(prompt);
    return response.response.text();
  };

  /*   const startDebate = async () => {
    setMessages([]);
    setWinner(null);
    for (let i = 0; i < rounds; i++) {
      const gptNext = await callGPT();
      console.log(`GPT:\n${gptNext}\n`);
      setGptMessages((prevGptMessages) => [...prevGptMessages, gptNext]);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "GPT", content: gptNext },
      ]);
      console.log(
        "PRIJE POZIVA CLAUDA gpt - messages - claude",
        gptMessages,
        messages,
        claudeMessages
      );
      const claudeNext = await callClaude();
      console.log(`Claude:\n${claudeNext}\n`);
      setClaudeMessages((prevClaudeMessages) => [
        ...prevClaudeMessages,
        claudeNext,
      ]);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "CLAUDE", content: claudeNext },
      ]);
    }
    console.log("Final Verdict by GEMINI");
    const verdict = await callGemini(gptMessages, claudeMessages);

    setWinner(verdict);
    console.log(messages, "MESSAGES");
    console.log(verdict, "VERDICT");
  }; */

  const startDebate = async () => {
    setMessages([]);
    setClaudeMessages([]);
    setGptMessages([]);
    setWinner(null);

    let updatedGptMessages: any[] | ((prevState: string[]) => string[]) = [];
    let updatedClaudeMessages: any[] | ((prevState: string[]) => string[]) = [];
    let updatedMessages:
      | any[]
      | ((
          prevState: { role: string; content: string }[]
        ) => { role: string; content: string }[]) = [];

    for (let i = 0; i < rounds; i++) {
      const gptNext = await callGPT();
      setTimeout(() => {}, 300);

      console.log(`GPT:\n${gptNext}\n`);

      updatedGptMessages = [...updatedGptMessages, gptNext];
      updatedMessages = [
        ...updatedMessages,
        { role: "GPT", content: gptNext, round: i + 1 },
      ];

      setGptMessages(updatedGptMessages);
      setMessages(updatedMessages);

      console.log(
        "PRIJE POZIVA CLAUDA gpt - messages - claude",
        updatedGptMessages,
        updatedMessages,
        updatedClaudeMessages
      );

      setTimeout(() => {}, 300);
      const claudeNext = await callClaude(updatedGptMessages);
      setTimeout(() => {}, 300);
      console.log(`Claude:\n${claudeNext}\n`);

      updatedClaudeMessages = [...updatedClaudeMessages, claudeNext];
      updatedMessages = [
        ...updatedMessages,
        { role: "CLAUDE", content: claudeNext, round: i + 1 },
      ];

      setClaudeMessages(updatedClaudeMessages);
      setMessages(updatedMessages);
    }

    console.log(updatedMessages, "MESSAGES kad se loop zavrsi");
    console.log("Final Verdict by GEMINI");
    const verdict = await callGemini(updatedGptMessages, updatedClaudeMessages);

    setWinner(verdict);

    console.log(verdict, "VERDICT");
    setClaudeMessages([]);
    setGptMessages([]);
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
