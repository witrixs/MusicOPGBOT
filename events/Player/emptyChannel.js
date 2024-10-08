const { EmbedBuilder } = require('discord.js');
const { Translate } = require('../../process_tools');

module.exports = (queue) => {
    // Если существует тред для отображения текста песен, он удаляется
    if (queue.metadata.lyricsThread) {
        queue.metadata.lyricsThread.delete(); // Удаление треда для текстов песен
        queue.setMetadata({
            channel: queue.metadata.channel // Обновление метаданных с каналом
        });
    }

    // Асинхронная функция для отправки сообщения в канал
    (async () => {
        const embed = new EmbedBuilder()
            .setAuthor({
                name: await Translate(`Никого нет в голосовом канале, выхожу из канала! <❌>`) // Сообщение о том, что в канале никого нет и бот выходит
            })
            .setColor('#2f3136'); // Установка цвета для embed-сообщения

        // Отправка сообщения в канал, связанный с очередью
        queue.metadata.channel.send({ embeds: [embed] });
    })();
}
