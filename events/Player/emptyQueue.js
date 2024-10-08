const { EmbedBuilder } = require('discord.js');
const { Translate } = require('../../process_tools');

module.exports = (queue) => {
    // Асинхронная функция для отправки сообщения в канал
    (async () => {
        const embed = new EmbedBuilder()
            .setAuthor({ name: await Translate('В очереди больше нет песен! <❌>') }) // Сообщение о том, что очередь пуста
            .setColor('#2f3136'); // Установка цвета для embed-сообщения

        // Отправка сообщения в канал, связанный с очередью
        queue.metadata.channel.send({ embeds: [embed] });
    })();
}
