import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';

const app = express();
app.use(bodyParser.json());

// Bot tokenni Vercel environment variable'dan olamiz
const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;

// Webhook endpoint
app.post('/api/webhook', async (req, res) => {
    const update = req.body;

    // 1️⃣ Oddiy xabarlar
    if (update.message) {
        const chatId = update.message.chat.id;
        const text = update.message.text;

        if (text === '/start') {
            await sendMessage(chatId, 'Salom! Men murakkab botman 😊 Siz inline query ham qilishingiz mumkin.');
        } 
        else if (text.toLowerCase() === 'rasm') {
            await sendPhoto(chatId, 'https://placekitten.com/300/300', 'Mana rasm!');
        } 
        else {
            await sendMessage(chatId, `Siz yozdingiz: ${text}`);
        }
    }

    // 2️⃣ Inline query
    if (update.inline_query) {
        const queryId = update.inline_query.id;
        const queryText = update.inline_query.query;

        const results = [
            {
                type: "article",
                id: "1",
                title: "Salom Inline!",
                input_message_content: { message_text: `Siz yozdingiz: ${queryText}` }
            },
            {
                type: "photo",
                id: "2",
                photo_url: "https://placekitten.com/200/200",
                thumb_url: "https://placekitten.com/100/100",
                photo_width: 200,
                photo_height: 200,
                caption: "Inline rasm!"
            }
        ];

        await fetch(`${TELEGRAM_API}/answerInlineQuery`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ inline_query_id: queryId, results })
        });
    }

    res.sendStatus(200);
});

// Helper functions
async function sendMessage(chatId, text) {
    await fetch(`${TELEGRAM_API}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text })
    });
}

async function sendPhoto(chatId, photo, caption) {
    await fetch(`${TELEGRAM_API}/sendPhoto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, photo, caption })
    });
}

// Vercel endpoint
export default app;
