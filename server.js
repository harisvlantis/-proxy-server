// Import required libraries
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000; // Server port

// Configure CORS to allow requests only from your frontend
app.use(cors({ origin: 'http://your-frontend-domain.com' }));

// Configure Body Parser for JSON data
app.use(bodyParser.json());

// Load OpenAI API Key from environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
    console.error('ERROR: Missing OPENAI_API_KEY in environment variables!');
    process.exit(1); // Exit if the API key is not set
}

// Chat API Endpoint
app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message;

    // Check if the message is empty
    if (!userMessage) {
        return res.status(400).json({ error: 'Message cannot be empty.' });
    }

    try {
        // Send request to OpenAI API
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'gpt-4', // Specify the model
                messages: [{ role: 'user', content: userMessage }],
            }),
        });

        // Handle OpenAI API errors
        if (!response.ok) {
            const errorDetails = await response.json();
            console.error('OpenAI API Error:', errorDetails);
            return res.status(response.status).json(errorDetails);
        }

        // Return data to the frontend
        const data = await response.json();
        res.json(data);
    } catch (error) {
        // Log and return server-side errors
        console.error('Server Error:', error);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
