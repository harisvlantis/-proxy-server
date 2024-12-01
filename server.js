const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const OPENAI_API_KEY =  

app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: [{ role: 'user', content: userMessage }],
            }),
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to fetch data from OpenAI API' });
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server is running on port ${PORT}`);
});
