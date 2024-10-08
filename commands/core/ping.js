// Импорт модуля ms (для работы с временем) и Translate (для перевода текста)
const ms = require('ms');
const { Translate } = require('../../process_tools');

// Экспорт команды 'ping'
module.exports = {
    name: 'ping', // Имя команды - "ping"
    description:("Получить пинг бота!"), // Описание команды

    // Асинхронная функция, которая выполняется при вызове команды
    async execute({ client, inter }) {
        // Отправляет временное сообщение "Ping?" до выполнения основного кода
        await inter.editReply("Пинг?");
        
        // Редактирует сообщение, чтобы отправить пинг бота и задержку API
        inter.editReply(await Translate(`Понг! Задержка API составляет <${Math.round(client.ws.ping)}мс 🛰️>, последнее измерение задержки произошло <${ms(Date.now() - client.ws.shards.first().lastPingTimestamp, { long: true })}> назад`));
    }
};
