const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js'); // Импортируем необходимые классы
const { useMainPlayer, useQueue } = require('discord-player'); // Импортируем функции для работы с плеером и очередью
const { Translate } = require('../../process_tools'); // Импортируем функцию для перевода текстов

module.exports = {
    name: 'remove', // Имя команды
    description: "Удалить песню из очереди", // Описание команды
    voiceChannel: true, // Команда может вызываться только в голосовом канале
    options: [
        {
            name: 'song', // Опция для указания названия или URL песни
            description: 'название/URL трека, который вы хотите удалить',
            type: ApplicationCommandOptionType.String,
            required: false, // Необязательная опция
        },
        {
            name: 'number', // Опция для указания номера песни в очереди
            description: 'номер в очереди, на котором находится песня',
            type: ApplicationCommandOptionType.Number,
            required: false, // Необязательная опция
        }
    ],

    async execute({ inter }) {
        const queue = useQueue(inter.guild); // Получаем очередь для текущего сервера

        // Проверяем, воспроизводится ли музыка
        if (!queue?.isPlaying()) 
            return inter.editReply({ content: await Translate(`Сейчас ничего не воспроизводится <${inter.member}>... попробуйте снова ? <❌>`) });

        // Получаем значения опций
        const number = inter.options.getNumber('number');
        const track = inter.options.getString('song');
        
        // Проверяем, указаны ли параметры для удаления
        if (!track && !number) 
            return inter.editReply({ content: await Translate(`Вы должны использовать одну из опций для удаления песни <${inter.member}>... попробуйте снова ? <❌>`) });

        let trackName; // Переменная для хранения названия удаляемой песни

        // Если указано название трека
        if (track) {
            const toRemove = queue.tracks.toArray().find((t) => t.title === track || t.url === track); // Ищем песню по названию или URL
            if (!toRemove) 
                return inter.editReply({ content: await Translate(`Не удалось найти <${track}> <${inter.member}>... попробуйте использовать URL или полное название песни ? <❌>`) });

            queue.removeTrack(toRemove); // Удаляем трек из очереди
        } 
        // Если указано число
        else if (number) {
            const index = number - 1; // Индекс в массиве треков
            const name = queue.tracks.toArray()[index]?.title; // Получаем название трека по индексу
            if (!name) 
                return inter.editReply({ content: await Translate(`Этот трек, похоже, не существует <${inter.member}>... попробуйте снова ? <❌>`) });

            queue.removeTrack(index); // Удаляем трек по индексу
            trackName = name; // Сохраняем название удаляемого трека
        }

        // Создаем embed-сообщение для ответа
        const embed = new EmbedBuilder()
            .setColor('#2f3136') // Устанавливаем цвет
            .setAuthor({ name: await Translate(`Удалена <${trackName}> из очереди <✅>`) }); // Устанавливаем автора сообщения

        return inter.editReply({ embeds: [embed] }); // Отправляем ответ
    }
}
