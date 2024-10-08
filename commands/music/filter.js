const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js'); // Импорт необходимых классов из Discord.js
const { AudioFilters, useQueue } = require('discord-player'); // Импортируем фильтры и очередь из discord-player
const { Translate } = require('../../process_tools'); // Импортируем функцию для перевода текстов

module.exports = {
    name: 'filter', // Имя команды
    description: ('Добавить фильтр к вашему треку'), // Описание команды
    voiceChannel: true, // Указываем, что команда должна вызываться в голосовом канале
    options: [
        {
            name: 'filter', // Имя параметра
            description: ('Фильтр, который вы хотите добавить'), // Описание параметра
            type: ApplicationCommandOptionType.String, // Тип параметра (строка)
            required: true, // Параметр обязателен
            choices: [
                ...Object.keys(AudioFilters.filters) // Получаем все доступные фильтры
                    .map(m => Object({ name: m, value: m })) // Форматируем фильтры для выбора
                    .splice(0, 25) // Ограничиваем количество фильтров до 25
            ],
        }
    ],

    async execute({ inter }) {
        const queue = useQueue(inter.guild); // Получаем очередь для текущего сервера

        // Проверяем, воспроизводится ли музыка
        if (!queue?.isPlaying()) 
            return inter.editReply({ content: await Translate(`Нет музыки, которая в данный момент играет <${inter.member}>... попробуйте снова? <❌>`) });

        const actualFilter = queue.filters.ffmpeg.getFiltersEnabled()[0]; // Получаем текущий активный фильтр
        const selectedFilter = inter.options.getString('filter'); // Получаем выбранный фильтр

        // Список всех фильтров (включая включенные и отключенные)
        const filters = [];
        queue.filters.ffmpeg.getFiltersDisabled().forEach(f => filters.push(f)); // Добавляем отключенные фильтры
        queue.filters.ffmpeg.getFiltersEnabled().forEach(f => filters.push(f)); // Добавляем включенные фильтры

        // Проверяем, существует ли выбранный фильтр в списке доступных фильтров
        const filter = filters.find((x) => x.toLowerCase() === selectedFilter.toLowerCase().toString());

        // Формируем сообщение для пользователя в случае отсутствия фильтра
        let msg = await Translate(`Этот фильтр не существует <${inter.member}>... попробуйте снова ? <❌ \n>`) +
            (actualFilter ? await Translate(`Текущий активный фильтр: <**${actualFilter}**. \n>`) : "") +
            await Translate(`Список доступных фильтров:`);
        
        // Добавляем доступные фильтры в сообщение
        filters.forEach(f => msg += `- **${f}**`);

        // Если фильтр не найден, отправляем сообщение с доступными фильтрами
        if (!filter) return inter.editReply({ content: msg });

        // Переключаем состояние выбранного фильтра (включаем или отключаем его)
        await queue.filters.ffmpeg.toggle(filter);

        // Создаем embed-сообщение для уведомления пользователя
        const filterEmbed = new EmbedBuilder()
            .setAuthor({ name: await Translate(`Фильтр <${filter}> теперь <${queue.filters.ffmpeg.isEnabled(filter) ? 'включен' : 'отключен'}> <✅\n> *Напоминание: чем длиннее музыка, тем дольше это займет.*`) }) // Заголовок
            .setColor('#2f3136'); // Цвет сообщения

        // Отправляем ответ с информацией о статусе фильтра
        return inter.editReply({ embeds: [filterEmbed] });
    }
}
