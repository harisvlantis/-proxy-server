const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 5000;

// Ρύθμιση του CORS και Body Parser
app.use(cors());
app.use(bodyParser.json());

// Πάρε το API Key από τις περιβαλλοντικές μεταβλητές
const OPENAI_API_KEY = 

app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message;

    try {
        // Αίτημα προς το OpenAI API
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: [{ role: 'user', content: userMessage }]
            })
        });

        if (!response.ok) {
            throw new Error(`OpenAI API Error: ${response.statusText}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred while processing your request.');
    }
});

// Ξεκινά ο server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
