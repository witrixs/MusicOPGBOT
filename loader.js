// Импорт необходимых модулей
const { readdirSync } = require("fs"); // Импорт модуля для чтения файловой системы
const { Collection } = require("discord.js"); // Импорт коллекций из библиотеки discord.js
const { useMainPlayer } = require("discord-player"); // Импорт основного музыкального плеера из discord-player

// Создание коллекции для хранения команд бота
client.commands = new Collection(); // Создаем коллекцию для команд
const commandsArray = []; // Массив для хранения всех команд
const player = useMainPlayer(); // Получаем основной экземпляр музыкального плеера

// Импорт функций перевода
const { Translate, GetTranslationModule } = require("./process_tools"); // Импорт функции перевода и модуля для работы с переводами

// Получение всех файлов событий Discord и музыкального плеера
const discordEvents = readdirSync("./events/Discord/").filter((file) =>
  file.endsWith(".js")
); // Получаем список файлов событий для Discord
const playerEvents = readdirSync("./events/Player/").filter((file) =>
  file.endsWith(".js")
); // Получаем список файлов событий для плеера

// Загрузка модуля перевода
GetTranslationModule().then(() => {
  console.log("| Модуль перевода загружен |");

  // Загрузка всех событий Discord
  for (const file of discordEvents) {
    const DiscordEvent = require(`./events/Discord/${file}`); // Импорт события
    const txtEvent = `< -> > [Загружено событие Discord] <${file.split(".")[0]}>`;
    parseLog(txtEvent); // Логируем событие
    client.on(file.split(".")[0], DiscordEvent.bind(null, client)); // Привязываем событие к клиенту
    delete require.cache[require.resolve(`./events/Discord/${file}`)]; // Удаляем кэш модуля для обновления
  }

  // Загрузка всех событий плеера
  for (const file of playerEvents) {
    const PlayerEvent = require(`./events/Player/${file}`); // Импорт события
    const txtEvent = `< -> > [Загружено событие плеера] <${file.split(".")[0]}>`;
    parseLog(txtEvent); // Логируем событие
    player.events.on(file.split(".")[0], PlayerEvent.bind(null)); // Привязываем событие к плееру
    delete require.cache[require.resolve(`./events/Player/${file}`)]; // Удаляем кэш модуля
  }

  // Загрузка всех команд бота
  readdirSync("./commands/").forEach((dirs) => {
    const commands = readdirSync(`./commands/${dirs}`).filter((files) =>
      files.endsWith(".js")
    ); // Получаем все команды из соответствующей директории

    for (const file of commands) {
      const command = require(`./commands/${dirs}/${file}`); // Импорт команды
      if (command.name && command.description) { // Проверка, что у команды есть имя и описание
        commandsArray.push(command); // Добавляем команду в массив команд
        const txtEvent = `< -> > [Загружена команда] <${command.name.toLowerCase()}>`;
        parseLog(txtEvent); // Логируем команду
        client.commands.set(command.name.toLowerCase(), command); // Добавляем команду в коллекцию
        delete require.cache[require.resolve(`./commands/${dirs}/${file}`)]; // Удаляем кэш команды
      } else {
        const txtEvent = `< -> > [Ошибка загрузки команды] <${command.name?.toLowerCase()}>`;
        parseLog(txtEvent); // Логируем ошибку, если команда некорректна
      }
    }
  });

  // Когда клиент готов, регистрируем команды
  client.on("ready", (client) => {
    if (client.config.app.global) {
      client.application.commands.set(commandsArray); // Если глобальные команды включены, регистрируем их глобально
    } else {
      client.guilds.cache
        .get(client.config.app.guild)
        .commands.set(commandsArray); // Иначе регистрируем команды на конкретный сервер (гильдию)
    }
  });

  // Асинхронная функция для логирования событий с переводом
  async function parseLog(txtEvent) {
    console.log(await Translate(txtEvent, null)); // Переводит и логирует сообщение о событии
  }
});
