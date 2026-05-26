const express = require('express');
const { generateText } = require('ai');
const { createGoogleGenerativeAI } = require('@ai-sdk/google');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); // عشان يسمح لموقعك على GitHub يكلم السيرفر ده

// إعداد اتصال جوجل من خلال الـ SDK
const google = createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY // السيرفر هيقرأ المفتاح بأمان من إعدادات Vercel
});

app.post('/api/chat', async (req, res) => {
    const { prompt } = req.body;
    try {
        // استخدام الـ SDK لتوليد النص
        const { text } = await generateText({
            model: google('gemini-1.5-flash'),
            prompt: prompt,
        });
        res.json({ text });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));