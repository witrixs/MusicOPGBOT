const { ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ChannelType, EmbedBuilder, PermissionsBitField } = require('discord.js'); // Импортируем необходимые классы из Discord.js
const { Translate } = require('../../process_tools'); // Импортируем функцию для перевода текстов

module.exports = {
    name: 'controller', // Имя команды
    description: ("Отправить контроллер музыки в канал"), // Описание команды
    voiceChannel: false, // Указываем, что команда может выполняться вне голосового канала
    permissions: PermissionsBitField.Flags.ManageMessages, // Необходимые права для выполнения команды
    options: [
        {
            name: 'channel', // Имя параметра
            description: ('Текстовый канал, в который вы хотите отправить его'), // Описание параметра
            type: ApplicationCommandOptionType.Channel, // Тип параметра (канал)
            required: true, // Параметр обязателен
        }
    ],

    async execute({ inter }) {
        // Получаем указанный текстовый канал
        const channel = inter.options.getChannel('channel');
        
        // Проверяем, является ли канал текстовым
        if (channel.type !== ChannelType.GuildText) 
            return inter.editReply({ content: await Translate(`Вам нужно отправить это в текстовый канал.. <❌>`) });

        // Создаем embed-сообщение для контроллера
        const embed = new EmbedBuilder()
            .setTitle(await Translate('Управляйте своей музыкой с помощью кнопок ниже!')) // Заголовок сообщения
            .setImage(inter.guild.iconURL({ size: 4096, dynamic: true })) // Логотип сервера
            .setColor('#2f3136') // Цвет сообщения
            .setFooter({ text: await Translate('Музыкальный OPGBOT v3 <❤️>'), iconURL: inter.member.avatarURL({ dynamic: true }) }); // Подвал сообщения

        // Уведомляем пользователя о том, что контроллер отправляется в указанный канал
        inter.editReply({ content: await Translate(`Отправляю контроллер в <${channel}>... <✅>`) });

        // Получаем настройки для эмодзи
        let EmojiState = client.config.app.enableEmojis; // Получаем состояние эмодзи

        const emojis = client.config.emojis; // Загружаем эмодзи из конфигурации

        emojis ? EmojiState = EmojiState : EmojiState = false; // Определяем, использовать ли эмодзи

        // Создаем кнопки для управления музыкой
        const back = new ButtonBuilder()
            .setLabel(EmojiState ? emojis.back : ('Назад')) // Название кнопки "Назад"
            .setCustomId('back') // ID кнопки
            .setStyle('Primary'); // Стиль кнопки

        const skip = new ButtonBuilder()
            .setLabel(EmojiState ? emojis.skip : ('Пропустить')) // Название кнопки "Пропустить"
            .setCustomId('skip')
            .setStyle('Primary');

        const resumepause = new ButtonBuilder()
            .setLabel(EmojiState ? emojis.ResumePause : ('Возобновить & Пауза')) // Название кнопки "Возобновить & Пауза"
            .setCustomId('resume&pause')
            .setStyle('Danger');

        const save = new ButtonBuilder()
            .setLabel(EmojiState ? emojis.savetrack : ('Сохранить')) // Название кнопки "Сохранить"
            .setCustomId('savetrack')
            .setStyle('Success');

        const volumeup = new ButtonBuilder()
            .setLabel(EmojiState ? emojis.volumeUp : ('Увеличить громкость')) // Название кнопки "Увеличить громкость"
            .setCustomId('volumeup')
            .setStyle('Primary');

        const volumedown = new ButtonBuilder()
            .setLabel(EmojiState ? emojis.volumeDown : ('Уменьшить громкость')) // Название кнопки "Уменьшить громкость"
            .setCustomId('volumedown')
            .setStyle('Primary');

        const loop = new ButtonBuilder()
            .setLabel(EmojiState ? emojis.loop : ('Цикл')) // Название кнопки "Цикл"
            .setCustomId('loop')
            .setStyle('Danger');

        const np = new ButtonBuilder()
            .setLabel('Сейчас играет') // Название кнопки "Сейчас играет"
            .setCustomId('nowplaying')
            .setStyle('Secondary');

        const queuebutton = new ButtonBuilder()
            .setLabel('Очередь') // Название кнопки "Очередь"
            .setCustomId('queue')
            .setStyle('Secondary');

        const lyrics = new ButtonBuilder()
            .setLabel('Тексты') // Название кнопки "Тексты"
            .setCustomId('Lyrics')
            .setStyle('Primary');

        const shuffle = new ButtonBuilder()
            .setLabel('Перемешать') // Название кнопки "Перемешать"
            .setCustomId('shuffle')
            .setStyle('Success');

        const stop = new ButtonBuilder()
            .setLabel('Стоп') // Название кнопки "Стоп"
            .setCustomId('stop')
            .setStyle('Danger');

        // Создаем строки кнопок
        const row1 = new ActionRowBuilder().addComponents(back, resumepause, skip, stop, save); // Первая строка
        const row2 = new ActionRowBuilder().addComponents(volumedown, volumeup, loop); // Вторая строка
        const row3 = new ActionRowBuilder().addComponents(lyrics, shuffle, queuebutton, np); // Третья строка

        // Отправляем embed-сообщение и кнопки в указанный текстовый канал
        channel.send({ embeds: [embed], components: [row1, row2, row3] });
    }
}
