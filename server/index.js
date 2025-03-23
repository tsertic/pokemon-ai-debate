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
    console.log(messages, pokemonB);
    const claudeSystem = `You are an AI debater who argues that ${pokemonB} is superior.`;
    const completion = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      system: claudeSystem,
      messages: messages,
      max_tokens: 500,
    });
    console.log(completion.content, "COMPLETION");
    const textResponse = completion.content
      .filter((block) => block.type === "text") // Uzimamo samo blokove tipa 'text'
      .map((block) => block.text) // Izvlačimo samo tekst
      .join(" "); // Spajamo sve u jednu rečenicu
    console.log(textResponse, "Text Response");
    res.json(textResponse);
  } catch (error) {
    console.error("Greška u proxy serveru:", error);
    res.status(500).json({ error: "Došlo je do problema s Claude API-jem." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Proxy server pokrenut na http://localhost:${PORT}`);
});
