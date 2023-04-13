//have chatgpt rewrite my code

require('dotenv').config();
const { Client, Intents } = require('discord.js');
const fetch = require('node-fetch');
const fs = require('fs');
const sharp = require('sharp');

const client = new Client({ intents: [Intents.FLAGS.Guilds, Intents.FLAGS.GuildMessages, Intents.FLAGS.MessageContent, Intents.FLAGS.MessageAttachments] });

const targetChannelId = 'your_target_channel_id_here';
const imageDbPath = 'imageDb.json';

if (!fs.existsSync(imageDbPath)) {
  fs.writeFileSync(imageDbPath, JSON.stringify({}));
}

function saveImageDb(imageDb) {
  fs.writeFileSync(imageDbPath, JSON.stringify(imageDb));
}

async function downloadImage(url, filename) {
  try {
    const response = await fetch(url);
    const buffer = await response.buffer();
    fs.writeFileSync(`./input_images/${filename}`, buffer);
    console.log(`Image downloaded: ${filename}`);
  } catch (error) {
    console.error(`Error downloading image ${filename}: ${error.message}`);
  }
}

async function processImage(filename, outputFolder) {
  try {
    const inputImagePath = `./input_images/${filename}`;
    const image = sharp(inputImagePath);
    const { width, height } = await image.metadata();
    const topLeft = image.extract({ left: 0, top: 0, width: width / 2, height: height / 2 });
    const topRight = image.extract({ left: width / 2, top: 0, width: width / 2, height: height / 2 });
    const bottomLeft = image.extract({ left: 0, top: height / 2, width: width / 2, height: height / 2 });
    const bottomRight = image.extract({ left: width / 2, top: height / 2, width: width / 2, height: height / 2 });

    await topLeft.toFile(`./${outputFolder}/${filename.split('.')[0]}_top_left.jpg`);
    await topRight.toFile(`./${outputFolder}/${filename.split('.')[0]}_top_right.jpg`);
    await bottomLeft.toFile(`./${outputFolder}/${filename.split('.')[0]}_bottom_left.jpg`);
    await bottomRight.toFile(`./${outputFolder}/${filename.split('.')[0]}_bottom_right.jpg`);

    fs.unlinkSync(inputImagePath);
    console.log(`Image processed: ${filename}`);
  } catch (error) {
    console.error(`Error processing image ${filename}: ${error.message}`);
  }
}

client.once('ready', () => {
  console.log('Bot connected');
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'scrape_images') {
    const imageDb = JSON.parse(fs.readFileSync(imageDbPath));
    const targetChannel = await client.channels.fetch(targetChannelId);

    if (!fs.existsSync('input_images')) fs.mkdirSync('input_images');
    if (!fs.existsSync('output_images')) fs.mkdirSync('output_images');

    let lastMessage = null;

// ... existing imports and functions ...

async function resizeImage(filename, maxDimension) {
  const inputImagePath = `./output_images/${filename}`;
  const image = sharp(inputImagePath);
  const { width, height } = await image.metadata();

  if (width > maxDimension || height > maxDimension) {
    const newDimensions = width > height
      ? { width: maxDimension, height: Math.round((maxDimension * height) / width) }
      : { width: Math.round((maxDimension * width) / height), height: maxDimension };
    await image.resize(newDimensions).toFile(`./resized_images/${filename}`);
    console.log(`Image resized: ${filename}`);
  }
}

client.on('messageCreate', async message => {
  if (message.channel.id !== targetChannelId || !message.attachments.size) return;

  const imageDb = JSON.parse(fs.readFileSync(imageDbPath));

  for (const [, attachment] of message.attachments) {
    if (!/\.(png|jpg|jpeg|gif)$/i.test(attachment.name)) continue;

    const filePrefix = message.content.includes('Upscaled by') ? 'UPSCALED_' : '';
    const filename = `${filePrefix}${attachment.name}`;

    if (imageDb[filename]) {
      console.log(`Image ${filename} already processed, skipping.`);
      continue;
    }

    await downloadImage(attachment.url, filename);
    const isCorrupted = await sharp(`./input_images/${filename}`).metadata().catch(() => true);

    if (isCorrupted) {
      console.log(`Image ${filename} is corrupted, redownloading.`);
      await downloadImage(attachment.url, filename);
    }

    await processImage(filename, 'output_images');
    await resizeImage(filename, 3840); // Resize to the desired max dimension
    imageDb[filename] = true;
    saveImageDb(imageDb);
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);

// ... existing imports and functions ...

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'scrape_images') {
    const limit = interaction.options.getInteger('limit') || 2000;
    await scrapeImages(interaction.channel, limit);
    await interaction.reply(`Scraped images from the last ${limit} messages.`);
  } else if (commandName === 'resize_images') {
    await resizeImages();
    await interaction.reply('Resized all images in the output folder.');
  }
});

async function scrapeImages(channel, limit) {
  const imageDb = JSON.parse(fs.readFileSync(imageDbPath));

  const messages = await channel.messages.fetch({ limit });
  messages.forEach(async message => {
    if (!message.attachments.size) return;

    for (const [, attachment] of message.attachments) {
      if (!/\.(png|jpg|jpeg|gif)$/i.test(attachment.name)) continue;

      const filePrefix = message.content.includes('Upscaled by') ? 'UPSCALED_' : '';
      const filename = `${filePrefix}${attachment.name}`;

      if (imageDb[filename]) {
        console.log(`Image ${filename} already processed, skipping.`);
        continue;
      }

      await downloadImage(attachment.url, filename);
      const isCorrupted = await sharp(`./input_images/${filename}`).metadata().catch(() => true);

      if (isCorrupted) {
        console.log(`Image ${filename} is corrupted, redownloading.`);
        await downloadImage(attachment.url, filename);
      }

      await processImage(filename, 'output_images');
      await resizeImage(filename, 3840); // Resize to the desired max dimension
      imageDb[filename] = true;
      saveImageDb(imageDb);
    }
  });
}

async function resizeImages() {
  const outputFiles = fs.readdirSync('./output_images');
  for (const file of outputFiles) {
    if (/\.(png|jpg|jpeg|gif)$/i.test(file)) {
      await resizeImage(file, 3840); // Resize to the desired max dimension
    }
  }
}

client.login(process.env.DISCORD_BOT_TOKEN);

