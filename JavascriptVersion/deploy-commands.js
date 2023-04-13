const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');
const commands = [
  {
    name: 'scrape_images',
    description: 'Scrape images from the last specified number of messages.',
    options: [
      {
        name: 'limit',
        type: 'INTEGER',
        description: 'Number of messages to scrape (defaults to 2000).',
        required: false,
      },
    ],
  },
  {
    name: 'resize_images',
    description: 'Resize all images in the output folder.',
  },
].map(command => ({ ...command, type: 'CHAT_INPUT' }));

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();
