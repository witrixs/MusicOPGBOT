// Загружает переменные среды из файла .env
require('dotenv').config()

// Импортирует классы Player (для работы с музыкой) и Client, GatewayIntentBits из discord.js
const { Player } = require('discord-player');
const { Client, GatewayIntentBits } = require('discord.js');
const { YoutubeiExtractor } = require('discord-player-youtubei');

// Создает глобальный клиент Discord с нужными намерениями (intents)
global.client = new Client({
    intents: [
        GatewayIntentBits.Guilds,             // Намерение для работы с серверами (гильдиями)
        GatewayIntentBits.GuildMembers,       // Намерение для работы с участниками сервера
        GatewayIntentBits.GuildMessages,      // Намерение для работы с сообщениями на сервере
        GatewayIntentBits.GuildVoiceStates,   // Намерение для работы с голосовыми состояниями (подключение/отключение участников к голосовым каналам)
        GatewayIntentBits.MessageContent      // Намерение для чтения содержания сообщений
    ],
    disableMentions: 'everyone',              // Отключает упоминания для всех (everyone)
});

// Загружает конфигурационный файл для клиента (например, токен и опции)
client.config = require('./config');

// Создает новый объект Player для музыкального функционала, используя клиент и опции из конфигурации
const player = new Player(client, client.config.opt.discordPlayer);
player.extractors.register(YoutubeiExtractor, {}); // Загружает стандартные экстракторы для работы с музыкальными сервисами

// Очищает консоль (для удобства работы с логами)
console.clear()

// Загружает дополнительные модули через loader
require('./loader');

// Авторизует клиента в Discord с использованием токена из конфигурации
client.login(client.config.app.token)
.catch(async (e) => { // Обработка ошибок при авторизации
    // Если ошибка связана с неправильным токеном
    if(e.message === 'An invalid token was provided.') {
        require('./process_tools')
        .throwConfigError('app', 'token', '\n\t   ❌ Invalid Token Provided! ❌ \n\tchange the token in the config file\n')
    }
    // Если произошла другая ошибка
    else {
        console.error('❌ An error occurred while trying to login to the bot! ❌ \n', e)
    }
});
