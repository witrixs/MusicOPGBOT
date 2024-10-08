const { EmbedBuilder } = require('discord.js');
const { Translate } = require('../../process_tools');

module.exports = (queue) => {
    // Проверка, включены ли дополнительные сообщения (extraMessages) в конфигурации
    if (!client.config.app.extraMessages) return;

    // Асинхронная функция для отправки сообщения в канал
    (async () => {
        const embed = new EmbedBuilder()
            .setAuthor({
                // Сообщение переводится с помощью функции Translate
                name: await Translate(`Все песни из плейлиста добавлены в очередь <✅>`)
            })
            .setColor('#2f3136'); // Установка цвета для embed сообщения

        // Отправка встраиваемого сообщения в канал, связанный с очередью
        queue.metadata.channel.send({ embeds: [embed] });
    })();
}
