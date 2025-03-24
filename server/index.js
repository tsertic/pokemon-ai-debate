import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
import Anthropic from "@anthropic-ai/sdk";
dotenv.config();

const app = express();
const PORT = 3001; // Backend server port
app.use(cors()); // Dozvoljava frontend-u pristup API-ju
app.use(express.json()); // Omogućuje JSON body parsing

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

app.post("/api/claude", async (req, res) => {
  try {
    const { messages, pokemonB } = req.body;
    console.log("Recevied request for Claude Debate", {
      messagesCound: messages.length,
      pokemonB,
    });
    const claudeSystem = `You are an AI debater who argues that ${pokemonB} is superior. Respond with 2 sentences maximum, be aggresive in your reasoning.`;

    //handle empty messages array
    if (!messages || messages.length === 0) {
      //if no messages send initial response
      const completion = await anthropic.create({
        model: "claude-3-haiku-2024307",
        system: claudeSystem,
        messages: [
          {
            role: "user",
            content: `Let's start a debate.Tell me why ${pokemonB} is superios.`,
          },
        ],
        max_tokens: 500,
      });
      const textResponse = completion.content
        .filter((block) => block.type === "text")
        .map((block) => block.text)
        .join(" ");

      console.log("Initial Claude response:", textResponse);
      return res.json(textResponse);
    }

    const completion = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      system: claudeSystem,
      messages: messages,
      max_tokens: 500,
    });

    const textResponse = completion.content
      .filter((block) => block.type === "text") // Uzimamo samo blokove tipa 'text'
      .map((block) => block.text) // Izvlačimo samo tekst
      .join(" "); // Spajamo sve u jednu rečenicu
    console.log("Claude Respons: ", textResponse);
    res.json(textResponse);
  } catch (error) {
    console.error("Server error", error);
    res.status(500).json({ error: "Problem with Claude API." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Proxy server pokrenut na http://localhost:${PORT}`);
});
