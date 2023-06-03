require('dotenv').config();
const express = require('express');
const app = express();
const axios = require('axios');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.post('/whatsapp', async (req, res) => {
    try {
        console.log("message for cyclic: ", req.body);
        console.log("message: ", req.body.body);
        const response = await generateChatResponse(req.body.body);
        console.log("reply: ", response);

        resp = new MessagingResponse();
        resp.message(response);
        res.type('text/xml');
        res.send(resp.toString());
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).end();
    }
});

app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});

async function generateChatResponse(message) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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',
        'User-Agent': 'curl/7.64.1',
    };
    const body = {
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": message}]
      };

        const response = await axios.post('https://api.openai.com/v1/chat/completions', body, { headers }).then(res => {
            const reply = res.data.choices[0].message.content;
            return reply;
        }).catch(error => {
            console.log("Hey Error: ", error);
            process.exit(1);
        });
        return response;
}

