const { EmbedBuilder } = require('discord.js'); // Импортируем класс для создания embed-сообщений
const { useQueue } = require('discord-player'); // Импортируем функцию для получения текущей очереди воспроизведения
const { Translate } = require('../../process_tools'); // Импортируем функцию для перевода текстов

module.exports = {
    name: 'clear', // Имя команды
    description: ('Очистить всю музыку в очереди'), // Описание команды
    voiceChannel: true, // Указываем, что команда может быть выполнена только в голосовом канале

    async execute({ inter }) {
        const queue = useQueue(inter.guild); // Получаем текущую очередь воспроизведения для данного сервера

        // Проверяем, воспроизводится ли в данный момент музыка
        if (!queue?.isPlaying()) 
            return inter.editReply({ content: await Translate(`Сейчас музыка не играет <${inter.member}>... попробуйте снова? <❌>`) });

        // Проверяем, есть ли в очереди треки после текущего
        if (!queue.tracks.toArray()[1]) 
            return inter.editReply({ content: await Translate(`Нет музыки в очереди после текущей <${inter.member}>... попробуйте снова? <❌>`) });

        // Очищаем очередь
        queue.tracks.clear();

        // Создаем embed-сообщение о том, что очередь была очищена
        const clearEmbed = new EmbedBuilder()
            .setAuthor({ name: await Translate(`Очередь только что была очищена <🗑️>`) }) // Заголовок сообщения
            .setColor('#2f3136'); // Цвет сообщения

        // Отправляем embed-сообщение в ответ на команду
        inter.editReply({ embeds: [clearEmbed] });
    }
}
