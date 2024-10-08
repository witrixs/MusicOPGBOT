const { EmbedBuilder } = require('discord.js'); // Импортируем класс EmbedBuilder для создания embed-сообщений
const { Translate } = require('../process_tools'); // Импортируем функцию перевода

module.exports = async ({ inter, queue }) => {
    // Проверяем, воспроизводится ли в данный момент музыка
    if (!queue?.isPlaying()) 
        return inter.editReply({ content: await Translate(`Сейчас музыка не играет... попробуйте снова? <❌>`) });

    // Проверяем, есть ли треки в очереди после текущего
    if (!queue.tracks.toArray()[0]) 
        return inter.editReply({ content: await Translate(`Нет музыки в очереди после текущей <${inter.member}>... попробуйте снова? <❌>`) });

    // Перемешиваем треки в очереди
    await queue.tracks.shuffle();

    // Создаем embed-сообщение для отправки в ответ
    const embed = new EmbedBuilder()
        .setColor('#2f3136') // Устанавливаем цвет эмбеда
        .setAuthor({ name: await Translate(`Очередь перемешана <${queue.tracks.size}> трек(ов)! <✅>`) }); // Устанавливаем авторское сообщение с количеством треков

    // Отправляем embed-сообщение в ответ на взаимодействие
    return inter.editReply({ embeds: [embed] });
}
