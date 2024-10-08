const { QueueRepeatMode, useQueue } = require('discord-player'); // Импортируем необходимые функции и классы из discord-player
const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js'); // Импортируем классы из discord.js
const { Translate } = require('../../process_tools'); // Импортируем функцию перевода текстов

module.exports = {
    name: 'loop', // Имя команды
    description: ('Переключить режим повторения треков или всей очереди'), // Описание команды
    voiceChannel: true, // Указываем, что команда может быть вызвана только из голосового канала
    options: [
        {
            name: 'action', // Опция для выбора действия
            description: ('Какое действие вы хотите выполнить с циклом'),
            type: ApplicationCommandOptionType.String, // Тип опции - строка
            required: true, // Опция обязательная
            choices: [
                { name: 'Очередь', value: 'enable_loop_queue' }, // Выбор: включить повтор очереди
                { name: 'Отключить', value: 'disable_loop' }, // Выбор: отключить повтор
                { name: 'Песня', value: 'enable_loop_song' }, // Выбор: включить повтор текущей песни
                { name: 'Автоплей', value: 'enable_autoplay' }, // Выбор: включить автоплей
            ],
        }
    ],

    async execute({ inter }) {
        const queue = useQueue(inter.guild); // Получаем очередь для текущего сервера
        const errorMessage = await Translate(`Что-то пошло не так <${inter.member}>... попробуйте снова ? <❌>`); // Сообщение об ошибке
        let baseEmbed = new EmbedBuilder().setColor('#2f3136'); // Создаем базовый embed с цветом

        // Проверяем, воспроизводится ли музыка
        if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`Сейчас ничего не воспроизводится <${inter.member}>... попробуйте снова ? <❌>`) });

        // Проверяем выбранное действие
        switch (inter.options._hoistedOptions.map(x => x.value).toString()) {
            case 'enable_loop_queue': {
                // Проверяем, включен ли режим повторения текущего трека
                if (queue.repeatMode === QueueRepeatMode.TRACK) return inter.editReply({ content: `Сначала отключите текущую песню в режиме повторения (\`/loop Disable\`) ${inter.member}... попробуйте снова ? ❌` });

                // Включаем режим повторения очереди
                const success = queue.setRepeatMode(QueueRepeatMode.QUEUE);
                baseEmbed.setAuthor({ name: success ? errorMessage : await Translate(`Режим повтора включен, вся очередь будет повторяться бесконечно <🔁>`) });

                return inter.editReply({ embeds: [baseEmbed] });
            }
            case 'disable_loop': {
                // Проверяем, отключен ли уже режим повторения
                if (queue.repeatMode === QueueRepeatMode.OFF) return inter.editReply({ content: await Translate(`Сначала включите режим повтора <(/loop Queue or /loop Song)> <${inter.member}>... попробуйте снова ? <❌>`) });

                // Отключаем режим повторения
                const success = queue.setRepeatMode(QueueRepeatMode.OFF);
                baseEmbed.setAuthor({ name: success ? errorMessage : await Translate(`Режим повтора отключен, очередь больше не будет повторяться <🔁>`) });

                return inter.editReply({ embeds: [baseEmbed] });
            }
            case 'enable_loop_song': {
                // Проверяем, включен ли режим повторения очереди
                if (queue.repeatMode === QueueRepeatMode.QUEUE) return inter.editReply({ content: await Translate(`Сначала отключите текущую очередь в режиме повторения <(\`/loop Disable\`)> <${inter.member}>... попробуйте снова ? <❌>`) });

                // Включаем режим повторения текущего трека
                const success = queue.setRepeatMode(QueueRepeatMode.TRACK);
                baseEmbed.setAuthor({ name: success ? errorMessage : await Translate(`Режим повтора включен, текущая песня будет повторяться бесконечно (вы можете отключить повтор с помощью <\`/loop disable\` >)`) });

                return inter.editReply({ embeds: [baseEmbed] });
            }
            case 'enable_autoplay': {
                // Проверяем, включен ли режим автоплея
                if (queue.repeatMode === QueueRepeatMode.AUTOPLAY) return inter.editReply({ content: await Translate(`Сначала отключите текущую музыку в режиме повторения <(\`/loop Disable\`)> <${inter.member}>... попробуйте снова ? <❌>`) });

                // Включаем режим автоплея
                const success = queue.setRepeatMode(QueueRepeatMode.AUTOPLAY);
                baseEmbed.setAuthor({ name: success ? errorMessage : await Translate(`Автоплей включен, очередь будет автоматически заполняться похожими песнями на текущую <🔁>`) });

                return inter.editReply({ embeds: [baseEmbed] });
            }
        }
    }
}
