import discord
from discord.ext import commands
import requests
from dotenv import load_dotenv
from PIL import Image
import os
import asyncio
import aiosqlite

load_dotenv()
client = commands.Bot(command_prefix="*", intents=discord.Intents.all(), help_command=None)
discord_token = os.getenv("DISCORD_BOT_TOKEN")
directory = os.getcwd()
print(directory)

async def init_db():
    db = await aiosqlite.connect("image_scraper_bot.db")
    await db.execute(
        "CREATE TABLE IF NOT EXISTS processed_messages (id INTEGER PRIMARY KEY, channel_id INTEGER, message_id INTEGER)"
    )
    await db.commit()
    return db

db = asyncio.get_event_loop().run_until_complete(init_db())


def split_image(image_file):
    with Image.open(image_file) as im:
        width, height = im.size
        mid_x = width // 2
        mid_y = height // 2
        top_left = im.crop((0, 0, mid_x, mid_y))
        top_right = im.crop((mid_x, 0, width, mid_y))
        bottom_left = im.crop((0, mid_y, mid_x, height))
        bottom_right = im.crop((mid_x, mid_y, width, height))

        return top_left, top_right, bottom_left, bottom_right

async def download_image(url, filename):
    response = requests.get(url)
    if response.status_code == 200:
        input_folder = "input_images"
        output_folder = "output_images"

        if not os.path.exists(output_folder):
            os.makedirs(output_folder)
        if not os.path.exists(input_folder):
            os.makedirs(input_folder)

        with open(f"{directory}/{input_folder}/{filename}", "wb") as f:
            f.write(response.content)
        print(f"Image downloaded: {filename}")

        input_file = os.path.join(input_folder, filename)

        if "UPSCALED_" not in filename:
            file_prefix = os.path.splitext(filename)[0]
            top_left, top_right, bottom_left, bottom_right = split_image(input_file)
            top_left.save(os.path.join(output_folder, file_prefix + "_top_left.jpg"))
            top_right.save(os.path.join(output_folder, file_prefix + "_top_right.jpg"))
            bottom_left.save(os.path.join(output_folder, file_prefix + "_bottom_left.jpg"))
            bottom_right.save(os.path.join(output_folder, file_prefix + "_bottom_right.jpg"))

        else:
            os.rename(f"{directory}/{input_folder}/{filename}", f"{directory}/{output_folder}/{filename}")
        os.remove(f"{directory}/{input_folder}/{filename}")

# @client.command(name="scrape_images")
# async def scrape_images_command(ctx, limit: int = 100):
#     async for message in ctx.channel.history(limit=limit):
#         for attachment in message.attachments:
#             if "Upscaled by" in message.content:
#                 file_prefix = 'UPSCALED_'
#             else:
#                 file_prefix = ''
#             if attachment.filename.lower().endswith((".png", ".jpg", ".jpeg", ".gif")):
#                 await download_image(attachment.url, f"{file_prefix}{attachment.filename}")
@client.command(name="scrape_images")
async def scrape_images_command(ctx, limit: int = 100):
    last_processed_message_id = None

    async with db.execute(
        "SELECT message_id FROM processed_messages WHERE channel_id = ? ORDER BY message_id DESC LIMIT 1",
        (ctx.channel.id,),
    ) as cursor:
        row = await cursor.fetchone()
        if row:
            last_processed_message_id = row[0]

    async for message in ctx.channel.history(limit=limit, after=discord.Object(id=last_processed_message_id) if last_processed_message_id else None):
        for attachment in message.attachments:
            if "Upscaled by" in message.content:
                file_prefix = 'UPSCALED_'
            else:
                file_prefix = ''
            if attachment.filename.lower().endswith((".png", ".jpg", ".jpeg", ".gif")):
                await download_image(attachment.url, f"{file_prefix}{attachment.filename}")

        await db.execute(
            "INSERT OR REPLACE INTO processed_messages (channel_id, message_id) VALUES (?, ?)",
            (ctx.channel.id, message.id),
        )
        await db.commit()



@client.event
async def on_ready():
    print("Bot connected")

@client.event
async def on_message(message):
    await client.process_commands(message)  # Add this line to process commands

    target_channel_id = 1087738815902400573  # Replace with your desired channel ID

    if message.channel.id != target_channel_id:
        return

    for attachment in message.attachments:
        if "Upscaled by" in message.content:
            file_prefix = 'UPSCALED_'
        else:
            file_prefix = ''
        if attachment.filename.lower().endswith((".png", ".jpg", ".jpeg", ".gif")):
            await download_image(attachment.url, f"{file_prefix}{attachment.filename}")

client.run(discord_token)

