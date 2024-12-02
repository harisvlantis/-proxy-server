
// Εισαγωγή απαιτούμενων βιβλιοθηκών
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
require('dotenv').config(); // Για να φορτώσουμε τις περιβαλλοντικές μεταβλητές από το αρχείο .env

const app = express();
const PORT = process.env.PORT || 5000; // Θύρα στην οποία θα τρέχει ο server

// Ρύθμιση του CORS (επιτρέπει αιτήματα μόνο από συγκεκριμένο frontend)
app.use(cors({ origin: 'http://your-frontend-domain.com' }));

// Ρύθμιση του Body Parser (για JSON δεδομένα στα αιτήματα)
app.use(bodyParser.json());

// Πάρε το API Key από τις περιβαλλοντικές μεταβλητές
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
    console.error('ERROR: Missing OPENAI_API_KEY in environment variables!');
    process.exit(1); // Τερματίζει αν το API Key δεν έχει οριστεί
}

// Endpoint για το Chat API
app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message;

    // Έλεγχος αν το μήνυμα είναι κενό
    if (!userMessage) {
        return res.status(400).json({ error: 'Message cannot be empty.' });
    }

    try {
        // Αίτημα προς το OpenAI API
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'gpt-4', // Μοντέλο που θα χρησιμοποιηθεί
                messages: [{ role: 'user', content: userMessage }],
            }),
        });

        // Αν η απάντηση του OpenAI API δεν είναι επιτυχής
        if (!response.ok) {
            const errorDetails = await response.json();
            console.error('OpenAI API Error:', errorDetails);
            return res.status(response.status).json(errorDetails);
        }

        // Επιστροφή δεδομένων στο frontend
        const data = await response.json();
        res.json(data);
    } catch (error) {
        // Καταγραφή και επιστροφή σφάλματος
        console.error('Server Error:', error);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
});

// Εκκίνηση του server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
