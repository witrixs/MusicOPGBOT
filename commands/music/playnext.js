const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js'); // Импортируем необходимые классы
const { QueryType, useMainPlayer, useQueue } = require('discord-player'); // Импортируем функции для работы с музыкальным плеером
const { Translate } = require('../../process_tools'); // Импортируем функцию перевода текстов

module.exports = {
    name: 'playnext', // Имя команды
    description: ("Воспроизвести песню сразу после этой"), // Описание команды
    voiceChannel: true, // Указываем, что команда может быть вызвана только в голосовом канале
    options: [
        {
            name: 'song', // Название опции
            description: ('Песня, которую вы хотите воспроизвести следующей'), // Описание опции
            type: ApplicationCommandOptionType.String, // Тип опции (строка)
            required: true, // Опция обязательная
        }
    ],

    async execute({ inter }) {
        const player = useMainPlayer(); // Получаем основной музыкальный плеер
        const queue = useQueue(inter.guild); // Получаем очередь для текущего сервера

        // Проверяем, воспроизводится ли музыка
        if (!queue?.isPlaying()) 
            return inter.editReply({ content: await Translate(`Сейчас ничего не воспроизводится <${inter.member}>... попробуйте снова ? <❌>`) });

        const song = inter.options.getString('song'); // Получаем название песни из опций
        const res = await player.search(song, { // Ищем трек по названию
            requestedBy: inter.member, // Указываем, кто запросил трек
            searchEngine: QueryType.AUTO // Автоматический выбор типа поиска
        });

        // Проверяем, были ли найдены результаты
        if (!res?.tracks.length) 
            return inter.editReply({ content: await Translate(`Не найдено результатов <${inter.member}>... попробуйте снова ? <❌>`) });

        // Проверяем, является ли результат плейлистом
        if (res.playlist) 
            return inter.editReply({ content: await Translate(`Эта команда не поддерживает плейлисты <${inter.member}>... попробуйте снова ? <❌>`) });

        // Вставляем трек в очередь на первое место
        queue.insertTrack(res.tracks[0], 0);

        // Создаем embed-сообщение с подтверждением
        const playNextEmbed = new EmbedBuilder()
            .setAuthor({ name: await Translate(`Трек добавлен в очередь... он будет воспроизведен следующим <🎧>`) })
            .setColor('#2f3136'); // Устанавливаем цвет сообщения

        // Отправляем ответ с embed-сообщением
        await inter.editReply({ embeds: [playNextEmbed] });
    }
}
