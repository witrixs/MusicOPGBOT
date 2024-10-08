const { EmbedBuilder } = require('discord.js'); // Импортируем класс для создания embed-сообщений
const { useQueue } = require('discord-player'); // Импортируем функцию для работы с очередью
const { Translate } = require('../../process_tools'); // Импортируем функцию перевода текстов

module.exports = {
    name: 'history', // Имя команды
    description: ('Посмотреть историю очереди'), // Описание команды
    voiceChannel: false, // Указываем, что команда может быть вызвана из любого канала

    async execute({ inter }) {
        const queue = useQueue(inter.guild); // Получаем очередь для текущего сервера

        // Проверяем, есть ли очередь и есть ли треки в истории
        if (!queue || queue.history.tracks.toArray().length == 0) 
            return inter.editReply({ content: await Translate(`Пока не воспроизводилась музыка`) }); // Возвращаем сообщение, если истории нет

        const tracks = queue.history.tracks.toArray(); // Получаем массив треков из истории

        // Формируем строку с описанием первых 20 треков из истории
        let description = tracks
            .slice(0, 20) // Берем только первые 20 треков
            .map((track, index) => { 
                return `**${index + 1}.** [${track.title}](${track.url}) by ${track.author}`; // Форматируем каждую запись в истории
            })
            .join('\r\n\r\n'); // Разделяем треки пустыми строками

        // Создаем embed-сообщение с историей воспроизведения
        let historyEmbed = new EmbedBuilder()
            .setTitle(`История`) // Заголовок сообщения
            .setDescription(description) // Описание с треками
            .setColor('#2f3136') // Цвет сообщения
            .setTimestamp() // Добавляем временную метку
            .setFooter({ text: await Translate('Музыка прежде всего - сделано с любовью сообществом <❤️>'), iconURL: inter.member.avatarURL({ dynamic: true }) }); // Добавляем нижний колонтитул

        // Отправляем embed-сообщение в ответ на взаимодействие
        inter.editReply({ embeds: [historyEmbed] });
    }
}
