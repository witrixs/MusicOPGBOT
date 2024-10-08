const { EmbedBuilder } = require('discord.js');
const { Translate } = require("../../process_tools");

module.exports = (queue, track) => {
    // Асинхронная функция для отправки сообщения о пропуске трека
    (async () => {
        const embed = new EmbedBuilder()
            .setAuthor({ name: await Translate(`Пропускаем <**${track.title}**>! <❌>`)}) // Сообщение о пропуске
            .setColor('#EE4B2B'); // Установка цвета для embed-сообщения (красный)

        // Отправка сообщения в канал, связанный с очередью
        queue.metadata.channel.send({ embeds: [embed], iconURL: track.thumbnail });
    })();
}
