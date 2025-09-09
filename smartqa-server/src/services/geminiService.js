const axios = require('axios');

const callGemini = async (questions, options ={detailed : false}) => {
    const {detailed}=options;
//     const prompt = `
// Given the following list of questions from an audience,
// group them if they are similar, and return a sorted list 
// with the most frequently asked questions or relevant questions summarized.

// ${questions.map(
//     (ques, index) => `${index + 1}. ${ques.content}`
// ).join('\n')}

// Respond with only the summarized list, one per line.
// `;

const normalPrompt = `
You are given a list of audience questions. 

Your task:
1. Group similar or duplicate questions together.
2. From each group, create at least one clear, high-quality question.
3. Ensure there are 2–5 distinct questions total.
4. Rank the final questions by importance or general audience interest.
5. Output only the final questions — one per line, no numbers, no extra text.

Audience Questions:
${questions.map((ques, index) => `Q${index + 1}: ${ques.content}`).join('\n')}
`;

const detailedPrompt = `
You are given a list of audience questions. 

Your task:
1. Identify and group similar or duplicate questions.
2. Summarize each group into a single clear, concise question.
3. Rank the summarized questions by frequency and relevance.

Respond with these sections:

**Grouping Section**
- Show which raw questions belong together.

**Reasoning Section**
- Explain why you grouped them and how you refined them.

**Final List Section**
- Only the final questions, one per line, no numbers or extra text.

Audience Questions:
${questions.map((ques, index) => `Q${index + 1}: ${ques.content}`).join('\n')}
`;


    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

    const requestBody = {
        contents: [{
            parts: [{ text: detailed ? detailedPrompt : normalPrompt}]
        }]
    };

    const requestHeaders = {
        headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": process.env.GEMINI_API_KEY
        }
    };

    try {
        const response = await axios.post(url, requestBody, requestHeaders);
        const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        return text.split('\n').filter(line => line.trim() !== "");
    } catch (error) {
        console.error("❌ Gemini API Error:");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Response Data:", error.response.data);
        } else {
            console.error(error.message);
        }
        throw new Error("Gemini API failed");
    }
};

module.exports = { callGemini };
