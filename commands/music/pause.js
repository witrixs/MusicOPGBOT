const { EmbedBuilder } = require('discord.js'); // Импортируем класс для создания embed-сообщений
const { useQueue } = require('discord-player'); // Импортируем функцию для работы с очередью
const { Translate } = require('../../process_tools'); // Импортируем функцию перевода текстов

module.exports = {
    name: 'pause', // Имя команды
    description: ('Поставить трек на паузу'), // Описание команды
    voiceChannel: true, // Указываем, что команда может быть вызвана только из голосового канала

    async execute({ inter }) {
        const queue = useQueue(inter.guild); // Получаем очередь для текущего сервера

        // Проверяем, воспроизводится ли музыка
        if (!queue?.isPlaying()) 
            return inter.editReply({ content: await Translate(`Сейчас ничего не воспроизводится <${inter.member}>... попробуйте снова ? <❌>`) });

        // Проверяем, находится ли трек уже на паузе
        if (queue.node.isPaused()) 
            return inter.editReply({ content: await Translate(`Трек уже на паузе, <${inter.member}>... попробуйте снова ? <❌>`) });

        // Ставим трек на паузу
        const success = queue.node.setPaused(true);
        
        // Создаем embed-сообщение с результатом операции
        const pauseEmbed = new EmbedBuilder()
            .setAuthor({ name: success ? await Translate(`Текущая музыка <${queue.currentTrack.title}> поставлена на паузу <✅>`) : await Translate(`Что-то пошло не так <${inter.member}>... попробуйте снова ? <❌>`) }) // Заголовок с результатом
            .setColor('#2f3136'); // Цвет сообщения

        // Отправляем ответ с embed-сообщением
        return inter.editReply({ embeds: [pauseEmbed] });
    }
}
