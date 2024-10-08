// Импорт необходимых модулей
const { QueryType, useMainPlayer } = require('discord-player'); // Импорт из библиотеки для работы с музыкой в Discord
const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js'); // Импорт опций команд и конструктора встраиваемых сообщений
const { Translate } = require('../../process_tools'); // Импорт функции перевода

// Экспорт команды 'play'
module.exports = {
    name: 'play', // Имя команды - "play"
    description:("Воспроизвести песню!"), // Описание команды
    voiceChannel: true, // Требование быть в голосовом канале
    options: [
        {
            name: 'song', // Имя опции - "song"
            description:('Песня, которую вы хотите воспроизвести'), // Описание опции
            type: ApplicationCommandOptionType.String, // Тип опции - строка
            required: true, // Поле обязательно для заполнения
        }
    ],

    // Асинхронная функция, которая выполняется при вызове команды
    async execute({ inter, client }) {
        const player = useMainPlayer(); // Получаем основного плеера

        const song = inter.options.getString('song'); // Получаем название песни из команды
        const res = await player.search(song, {
            requestedBy: inter.member, // Пользователь, запросивший песню
            searchEngine: QueryType.AUTO // Автоматический выбор поисковой системы
        });

        let defaultEmbed = new EmbedBuilder().setColor('#2f3136'); // Создаем встроенное сообщение с темным цветом

        // Проверяем, найдены ли треки
        if (!res?.tracks.length) {
            defaultEmbed.setAuthor({ name: await Translate(`Результаты не найдены... попробовать снова? <❌>`) }); // Если не найдено, отправляем сообщение
            return inter.editReply({ embeds: [defaultEmbed] }); // Отправляем сообщение с ошибкой
        }

        try {
            // Воспроизводим трек в голосовом канале пользователя
            const { track } = await player.play(inter.member.voice.channel, song, {
                nodeOptions: {
                    metadata: {
                        channel: inter.channel // Информация о канале, где отправляется команда
                    },
                    volume: client.config.opt.volume, // Устанавливаем громкость из конфигурации
                    leaveOnEmpty: client.config.opt.leaveOnEmpty, // Покидать канал, если он пустой
                    leaveOnEmptyCooldown: client.config.opt.leaveOnEmptyCooldown, // Задержка перед выходом, если канал пустой
                    leaveOnEnd: client.config.opt.leaveOnEnd, // Покидать канал после завершения воспроизведения
                    leaveOnEndCooldown: client.config.opt.leaveOnEndCooldown, // Задержка перед выходом после завершения
                }
            });

            // Обновляем сообщение с информацией о том, что трек добавлен в очередь
            defaultEmbed.setAuthor({ name: await Translate(`Загрузка <${track.title}> в очередь... <✅>`) });
            await inter.editReply({ embeds: [defaultEmbed] }); // Отправляем сообщение о добавлении песни
        } catch (error) {
            console.log(`Ошибка при воспроизведении: ${error}`); // Логируем ошибку в консоль
            defaultEmbed.setAuthor({ name: await Translate(`Не могу подключиться к голосовому каналу... попробовать снова? <❌>`) }); // Отправляем сообщение об ошибке
            return inter.editReply({ embeds: [defaultEmbed] }); // Отправляем сообщение с ошибкой
        }
    }
};
