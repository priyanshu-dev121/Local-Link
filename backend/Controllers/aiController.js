const { GoogleGenerativeAI } = require("@google/generative-ai");
const Booking = require("../Models/booking");

const genAI = new GoogleGenerativeAI((process.env.GEMINI_API_KEY || "").trim());

const chatWithAI = async (req, res) => {
  const { message, history } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ 
      success: false, 
      message: "AI Configuration Missing. Please add GEMINI_API_KEY to your .env file." 
    });
  }

  const modelsToTry = ["gemini-flash-latest", "gemini-2.0-flash"];
  let lastError = null;

  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        systemInstruction: "Fast Assistant for LocalLink. Short answers only."
      });

      // Speed optimization: Use only last 3 messages for context
      const mappedHistory = (history || []).slice(-3).map(h => ({
          role: h.sender === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }]
      }));

      const firstUserIndex = mappedHistory.findIndex(h => h.role === 'user');
      const finalHistory = firstUserIndex !== -1 ? mappedHistory.slice(firstUserIndex) : [];

      const chat = model.startChat({ 
        history: finalHistory,
        generationConfig: { maxOutputTokens: 200, temperature: 0.5 }
      });

      const result = await chat.sendMessage(message);
      const response = await result.response;
      return res.status(200).json({ success: true, text: response.text() });
    } catch (error) {
      lastError = error;
      if (error.status !== 503 && error.status !== 429) break;
    }
  }

  res.status(500).json({ success: false, message: "AI Busy: " + lastError.message });
};

const summarizeReviews = async (req, res) => {
  const { serviceId } = req.params;

  try {
    const bookings = await Booking.find({ service: serviceId, 'review.text': { $exists: true } });
    if (bookings.length === 0) {
      return res.json({ summary: "No reviews yet. Be the first to try this service!" });
    }

    const reviewTexts = bookings.map(b => `Rating: ${b.review.rating}/5. Review: ${b.review.text}`).join("\n");
    
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `Here are customer reviews for a service. Please provide a very concise, professional summary (max 3 sentences) highlighting what users like and any common complaints. Focus on tone of "LocalLink Expert Insights".\n\nReviews:\n${reviewTexts}`;

    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    res.json({ success: true, summary });
  } catch (error) {
    console.error("AI Summary Error:", error);
    res.status(500).json({ success: false, message: "Error generating summary" });
  }
};

module.exports = { chatWithAI, summarizeReviews };
