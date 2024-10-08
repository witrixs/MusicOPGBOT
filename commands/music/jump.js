const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js'); // Импортируем необходимые классы из discord.js
const { useQueue } = require('discord-player'); // Импортируем функцию для работы с очередью в discord-player
const { Translate } = require('../../process_tools'); // Импортируем функцию перевода текстов

module.exports = {
    name: 'jump', // Имя команды
    description: ("Прыжок к определенному треку в очереди"), // Описание команды
    voiceChannel: true, // Указываем, что команда может быть вызвана только из голосового канала
    options: [
        {
            name: 'song', // Опция для указания имени или URL трека
            description: ('Имя/URL трека, к которому вы хотите прыгнуть'),
            type: ApplicationCommandOptionType.String, // Тип опции - строка
            required: false, // Опция не обязательная
        },
        {
            name: 'number', // Опция для указания номера трека в очереди
            description: ('Место в очереди, где находится песня'),
            type: ApplicationCommandOptionType.Number, // Тип опции - число
            required: false, // Опция не обязательная
        }
    ],

    async execute({ inter }) {
        const queue = useQueue(inter.guild); // Получаем очередь для текущего сервера
        // Проверяем, воспроизводится ли музыка
        if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`Сейчас ничего не воспроизводится <${inter.member}>... попробуйте снова? <❌>`) });

        const track = inter.options.getString('song'); // Получаем опцию 'song' из ввода
        const number = inter.options.getNumber('number'); // Получаем опцию 'number' из ввода

        // Проверяем, указаны ли параметры для прыжка
        if (!track && !number) {
            return inter.editReply({ content: await Translate(`Вы должны использовать одну из опций для перехода к песне <${inter.member}>... попробуйте снова? <❌>`) });
        }

        let trackName; // Переменная для хранения названия трека, к которому мы прыгаем
        if (track) { // Если указано имя/URL трека
            // Ищем трек в очереди по имени или URL
            const toJump = queue.tracks.toArray().find((t) => t.title.toLowerCase() === track.toLowerCase() || t.url === track);
            // Если трек не найден, возвращаем сообщение
            if (!toJump) return inter.editReply({ content: await Translate(`Не удалось найти <${track}> <${inter.member}>... попробуйте использовать URL или полное название песни? <❌>`) });

            // Прыгаем к найденному треку
            queue.node.jump(toJump);
            trackName = toJump.title; // Сохраняем название трека
        } else if (number) { // Если указан номер трека
            const index = number - 1; // Индекс трека (0 - основание)
            const name = queue.tracks.toArray()[index]?.title; // Получаем название трека по индексу
            // Проверяем, существует ли трек с таким индексом
            if (!name) return inter.editReply({ content: await Translate(`Этот трек, похоже, не существует <${inter.member}>... попробуйте снова? <❌>`) });

            // Прыгаем к треку по индексу
            queue.node.jump(index);
            trackName = name; // Сохраняем название трека
        }

        // Создаем embed-сообщение о переходе
        const jumpEmbed = new EmbedBuilder()
            .setAuthor({ name: await Translate(`Перешли к <${trackName}> <✅>`) }) // Заголовок сообщения
            .setColor('#2f3136'); // Цвет сообщения

        // Отправляем embed-сообщение в ответ на взаимодействие
        inter.editReply({ embeds: [jumpEmbed] });
    }
}
