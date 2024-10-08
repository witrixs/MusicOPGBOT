const { EmbedBuilder } = require('discord.js');
const { Translate } = require('../../process_tools');

module.exports = (queue, track) => {
    // Проверка, включены ли дополнительные сообщения (extraMessages) в конфигурации
    if (!client.config.app.extraMessages) return;

    // Асинхронная функция для отправки сообщения в канал
    (async () => {
        const embed = new EmbedBuilder()
            .setAuthor({
                name: await Translate(`Трек <${track.title}> добавлен в очередь <✅>`), // Сообщение о добавлении трека переводится на выбранный язык
                iconURL: track.thumbnail // Используется миниатюра трека как иконка
            })
            .setColor('#2f3136'); // Установка цвета встраиваемого сообщения (серо-черный)

        // Отправка встраиваемого сообщения в канал, связанный с очередью
        queue.metadata.channel.send({ embeds: [embed] });
    })();
}
