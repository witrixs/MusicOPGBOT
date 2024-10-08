const { EmbedBuilder } = require('discord.js'); // Импортируем класс EmbedBuilder для создания встроенных сообщений
const { Translate } = require('../process_tools'); // Импортируем функцию для перевода текстов

module.exports = async ({ inter, queue }) => {
    // Проверяем, воспроизводится ли в данный момент музыка
    if (!queue?.isPlaying()) 
        return inter.editReply({ content: await Translate(`Сейчас музыка не играет... попробуйте снова? <❌>`) });

    // Удаляем очередь музыкальных треков
    queue.delete();

    // Создаем встроенное сообщение о том, что музыка остановлена
    const embed = new EmbedBuilder()
        .setColor('#2f3136') // Устанавливаем цвет встроенного сообщения
        .setAuthor({ name: await Translate(`Музыка остановлена на этом сервере, до скорой встречи <✅>`) }); // Устанавливаем автора сообщения

    // Отправляем ответ на взаимодействие с встроенным сообщением
    return inter.editReply({ embeds: [embed] });
}
