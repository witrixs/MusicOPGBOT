const { EmbedBuilder } = require('discord.js'); // Импортируем необходимые классы для создания embed-сообщений
const { useQueue } = require('discord-player'); // Импортируем функцию для работы с очередью
const { Translate } = require('../../process_tools'); // Импортируем функцию для перевода текстов

module.exports = {
    name: 'resume', // Имя команды
    description: ('Возобновить воспроизведение трека'), // Описание команды
    voiceChannel: true, // Команда может использоваться только в голосовом канале

    async execute({ inter }) {
        const queue = useQueue(inter.guild); // Получаем очередь для текущего сервера

        // Проверяем, существует ли очередь и воспроизводится ли музыка
        if (!queue) 
            return inter.editReply({ content: await Translate(`Сейчас ничего не воспроизводится <${inter.member}>... попробуйте снова ? <❌>`) });

        // Проверяем, воспроизводится ли трек
        if (queue.node.isPlaying()) 
            return inter.editReply({ content: await Translate(`Трек уже воспроизводится, <${inter.member}>... попробуйте снова ? <❌>`) });

        // Возобновляем воспроизведение трека
        const success = queue.node.resume();

        // Создаем embed-сообщение для ответа
        const resumeEmbed = new EmbedBuilder()
            .setAuthor({ name: success ? await Translate(`Текущий трек <${queue.currentTrack.title}> возобновлён <✅>`) : await Translate(`Что-то пошло не так <${inter.member}>... попробуйте снова ? <❌>`) })
            .setColor('#2f3136'); // Устанавливаем цвет сообщения

        return inter.editReply({ embeds: [resumeEmbed] }); // Отправляем ответ с embed-сообщением
    }
}
