import os
import asyncio
from telethon import TelegramClient, events

api_id = int(os.getenv("API_ID"))
api_hash = os.getenv("API_HASH")
session = os.getenv("SESSION_STRING")

client = TelegramClient(session, api_id, api_hash)

@client.on(events.NewMessage)
async def handler(event):
    if event.is_group:
        await event.reply("Salom! Bu AI javob.")
        await asyncio.sleep(1)

client.start()
client.run_until_disconnected()
