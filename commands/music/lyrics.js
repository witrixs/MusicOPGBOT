const { EmbedBuilder } = require('discord.js'); // Импортируем EmbedBuilder из discord.js
const { useMainPlayer, useQueue } = require('discord-player'); // Импортируем функции для работы с основным плеером и очередью
const { Translate } = require('../../process_tools'); // Импортируем функцию перевода текстов

module.exports = {
    name: 'lyrics', // Имя команды
    description: ('Получить текст для текущего трека'), // Описание команды
    voiceChannel: true, // Указываем, что команда может быть вызвана только из голосового канала

    async execute({ inter }) {
        const player = useMainPlayer(); // Получаем основной плеер
        const queue = useQueue(inter.guild); // Получаем очередь для текущего сервера

        // Проверяем, воспроизводится ли музыка
        if (!queue?.isPlaying()) 
            return inter.editReply({ content: await Translate(`Сейчас ничего не воспроизводится <${inter.member}>... попробуйте снова ? <❌>`) });

        // Ищем текст песни по названию текущего трека
        const results = await player.lyrics
            .search({
                q: queue.currentTrack.title
            })
            .catch(async (e) => {
                console.log(e); // Логируем ошибку
                return inter.editReply({ content: await Translate(`Ошибка! Пожалуйста, свяжитесь с разработчиками! | <❌>`) });
            });

        const lyrics = results?.[0]; // Получаем первые результаты поиска

        // Проверяем, есть ли текст песни
        if (!lyrics?.plainLyrics) 
            return inter.editReply({ content: await Translate(`Не найден текст для <${queue.currentTrack.title}>... попробуйте снова ? <❌>`) });

        // Ограничиваем длину текста до 1997 символов
        const trimmedLyrics = lyrics.plainLyrics.substring(0, 1997);

        // Создаем embed-сообщение с текстом
        const embed = new EmbedBuilder()
            .setTitle(await Translate(`Текст для <${queue.currentTrack.title}>`)) // Заголовок сообщения
            .setAuthor({
                name: lyrics.artistName // Имя исполнителя
            })
            .setDescription(trimmedLyrics.length === 1997 ? `${trimmedLyrics}...` : trimmedLyrics) // Описание с текстом
            .setFooter({ text: await Translate('Музыкальный OPGBOT v3 <❤️>'), iconURL: inter.member.avatarURL({ dynamic: true }) }) // Подвал сообщения
            .setTimestamp() // Время отправки сообщения
            .setColor('#2f3136'); // Цвет сообщения

        return inter.editReply({ embeds: [embed] }); // Отправляем embed-сообщение в чат
    }
}
