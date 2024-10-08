const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js'); // Импортируем необходимые классы для работы с embed-сообщениями и кнопками
const { useQueue } = require('discord-player'); // Импортируем функцию для работы с очередью
const { Translate } = require('../../process_tools'); // Импортируем функцию перевода текстов

module.exports = {
    name: 'nowplaying', // Имя команды
    description: 'Смотрите, какая песня сейчас играет!', // Описание команды
    voiceChannel: true, // Указываем, что команда может быть вызвана только из голосового канала

    async execute({ inter }) {
        const queue = useQueue(inter.guild); // Получаем очередь для текущего сервера

        // Проверяем, воспроизводится ли музыка
        if (!queue?.isPlaying()) 
            return inter.editReply({ content: await Translate(`Сейчас ничего не воспроизводится <${inter.member}>... попробуйте снова ? <❌>`) });

        const track = queue.currentTrack; // Получаем текущий трек
        const methods = ['disabled', 'track', 'queue']; // Определяем доступные методы повтора
        const timestamp = track.duration; // Получаем продолжительность трека
        const trackDuration = timestamp.progress == 'Infinity' ? 'infinity (live)' : track.duration; // Проверяем, является ли трек прямым эфиром
        const progress = queue.node.createProgressBar(); // Создаем индикатор прогресса воспроизведения

        let EmojiState = client.config.app.enableEmojis; // Получаем состояние использования эмодзи
        const emojis = client.config?.emojis; // Получаем конфигурацию эмодзи

        // Устанавливаем состояние эмодзи
        emojis ? EmojiState = EmojiState : EmojiState = false;

        // Создаем embed-сообщение
        const embed = new EmbedBuilder()
            .setAuthor({ name: track.title, iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true }) }) // Заголовок с именем трека и иконкой
            .setThumbnail(track.thumbnail) // Миниатюра с обложкой трека
            .setDescription(await Translate(`Громкость <**${queue.node.volume}**%> <\n> <Продолжительность **${trackDuration}**> <\n> Прогресс <${progress}> <\n> Режим повтора <**${methods[queue.repeatMode]}**> <\n> Запрошено <${track.requestedBy}>`)) // Описание с параметрами
            .setFooter({ text: await Translate('Музыкальный OPGBOT v3 <❤️>'), iconURL: inter.member.avatarURL({ dynamic: true }) }) // Подвал сообщения
            .setColor('#2f3136') // Цвет сообщения
            .setTimestamp(); // Время отправки сообщения
        
        // Создание кнопок для управления треком
        const saveButton = new ButtonBuilder()
            .setLabel(EmojiState ? emojis.savetrack : ('Сохранить этот трек'))
            .setCustomId('savetrack')
            .setStyle('Danger');

        const volumeup = new ButtonBuilder()
            .setLabel(EmojiState ? emojis.volumeUp : ('Увеличить громкость'))
            .setCustomId('volumeup')
            .setStyle('Primary');

        const volumedown = new ButtonBuilder()
            .setLabel(EmojiState ? emojis.volumeDown : ('Уменьшить громкость'))
            .setCustomId('volumedown')
            .setStyle('Primary');

        const loop = new ButtonBuilder()
            .setLabel(EmojiState ? emojis.loop : ('Зациклить'))
            .setCustomId('loop')
            .setStyle('Danger');

        const resumepause = new ButtonBuilder()
            .setLabel(EmojiState ? emojis.ResumePause : ('Возобновить <&> Пауза'))
            .setCustomId('resume&pause')
            .setStyle('Success');

        // Создаем ряд кнопок и добавляем их в ответ
        const row = new ActionRowBuilder().addComponents(volumedown, resumepause, volumeup, loop, saveButton);
        inter.editReply({ embeds: [embed], components: [row] }); // Отправляем embed-сообщение и кнопки в канал
    }
}
