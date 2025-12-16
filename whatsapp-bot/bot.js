const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

// --- CONFIGURATION ---
// The specific string you invented (e.g., "happy_cat_123")
const VERIFY_TOKEN = 'happy_cat_123';
// The long temporary token from Meta Dashboard
const WHATSAPP_TOKEN = 'EAAZA09zHXvbABQCNC3b6Sa2yCj8uLSCvzcHgIhCj4WU6ZCf4De0yvAokKFZBGnWTxtbaIJ31nPjrKQXLusFvVLLTwO0wvkhG8eZBo8wbROHSWu3YjCuYI9cCb05F6A0mIZA3grWw3LCUXhSjcRG9KrJZCX7LnN5IZAJiHqKukUHrhSqmttqZCkmkLQGQVJjn2eiZA181hGbK5ZCsJR7RDzZA7dQ0ZClSr8UZBxKANq0xZBNqZA3POBXeJNRUVwdmNGKBcHOJYSok3KJcFZBQlpWAzXSYJG6l';
// The Phone Number ID (not the phone number) from Meta Dashboard
const PHONE_NUMBER_ID = '908377602358233';
const PORT = 3000;

// --- WEBHOOK VERIFICATION (GET) ---
// Meta sends a GET request to verify your webhook URL exists and matches the token.
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    } else {
        res.sendStatus(400); // Bad Request
    }
});

// --- MESSAGE HANDLING (POST) ---
// Meta sends a POST request when a message comes in.
app.post('/webhook', async (req, res) => {
    const body = req.body;

    console.log('Incoming webhook:', JSON.stringify(body, null, 2));

    // Check if this is an event from a WhatsApp subscription
    if (body.object) {
        if (
            body.entry &&
            body.entry[0].changes &&
            body.entry[0].changes[0].value.messages &&
            body.entry[0].changes[0].value.messages[0]
        ) {
            const phoneNumberId = body.entry[0].changes[0].value.metadata.phone_number_id;
            const from = body.entry[0].changes[0].value.messages[0].from; // sender's number
            const msgBody = body.entry[0].changes[0].value.messages[0].text.body; // msg text

            console.log(`Received message: "${msgBody}" from ${from}`);

            // Send a reply via Graph API
            try {
                await axios({
                    method: 'POST',
                    url: `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`,
                    headers: {
                        'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                    data: {
                        messaging_product: 'whatsapp',
                        to: from,
                        text: { body: `Echo: You said "${msgBody}"` },
                    },
                });
                console.log('Reply sent successfully!');
            } catch (error) {
                console.error('Error sending reply:', error.response ? error.response.data : error.message);
            }
        }
        res.sendStatus(200); // Always return 200 OK to Meta
    } else {
        res.sendStatus(404);
    }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
