const { EmbedBuilder } = require('discord.js');
const { Translate } = require("../../process_tools");

module.exports = (queue, error) => {
    // Асинхронная функция для отправки сообщения в канал
    (async () => {
        const embed = new EmbedBuilder()
            .setAuthor({ name: await Translate(`У бота произошла неожиданная ошибка, пожалуйста, проверьте консоль немедленно!`) }) // Сообщение об ошибке
            .setColor('#EE4B2B'); // Установка цвета для embed-сообщения (красный)

        // Отправка сообщения в канал, связанный с очередью
        queue.metadata.channel.send({ embeds: [embed] });

        // Логирование ошибки в консоль
        console.log((`Ошибка, вызванная проигрывателем: <${error.message}>`));
    })();
}
