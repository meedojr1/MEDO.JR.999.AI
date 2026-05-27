const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');

const app = express();

// إعدادات الـ CORS الكاملة لمنع أي رفض من المتصفح
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/chat', async (req, res) => {
    const { prompt } = req.body;
    
    // تأكيد استقبال النص
    if (!prompt) {
        return res.status(400).json({ error: "الرسالة فارغة" });
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        res.json({ text });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// سطر مهم جداً عشان Vercel يتعرف على السيرفر كدالة ذكية
module.exports = app;

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
