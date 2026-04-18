const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// OpenAI setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Root route (browser test)
app.get("/", (req, res) => {
  res.send("AI Backend is running 🚀");
});

// 👉 IMPORTANT: chat GET (for browser test)
app.get("/chat", (req, res) => {
  res.send("Use POST request to /chat");
});

// Chat API (MAIN)
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "তুমি একজন ইসলামিক সহকারী।",
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    res.json({
      reply: response.choices[0].message.content,
    });

  } catch (error) {
    console.error("ERROR FULL:", error); // 🔥 full error log
    res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
});

// PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});