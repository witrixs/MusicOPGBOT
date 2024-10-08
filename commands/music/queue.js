const { EmbedBuilder } = require('discord.js'); // Импортируем класс для создания embed-сообщений
const { useQueue } = require('discord-player'); // Импортируем функцию для работы с очередью
const { Translate } = require('../../process_tools'); // Импортируем функцию перевода текстов

module.exports = {
    name: 'queue', // Имя команды
    description: ('Получить песни в очереди'), // Описание команды
    voiceChannel: true, // Указываем, что команда может быть вызвана только в голосовом канале

    async execute({ client, inter }) {
        const queue = useQueue(inter.guild); // Получаем очередь для текущего сервера

        // Проверяем, есть ли очередь и воспроизводится ли музыка
        if (!queue) 
            return inter.editReply({ content: await Translate(`Сейчас ничего не воспроизводится <${inter.member}>... попробуйте снова ? <❌>`) });
        if (!queue.tracks.toArray()[0]) 
            return inter.editReply({ content: await Translate(`В очереди нет музыки после текущей <${inter.member}>... попробуйте снова ? <❌>`) });

        // Получаем информацию о повторе и количестве песен в очереди
        const methods = ['', '🔁', '🔂'];
        const songs = queue.tracks.size;
        const nextSongs = songs > 5 ? await Translate(`И <**${songs - 5}**> других песен...`) : await Translate(`В плейлисте <**${songs}**> песен...`);

        // Формируем список треков
        const tracks = queue.tracks.map((track, i) => `**${i + 1}** - ${track.title} | ${track.author} (запрошено: ${track.requestedBy ? track.requestedBy.displayName : "неизвестно"})`);

        // Создаем embed-сообщение с информацией о очереди
        const embed = new EmbedBuilder()
            .setColor('#2f3136') // Устанавливаем цвет
            .setThumbnail(inter.guild.iconURL({ size: 2048, dynamic: true })) // Устанавливаем миниатюру сервера
            .setAuthor({ name: await Translate(`Очередь сервера - <${inter.guild.name}> <${methods[queue.repeatMode]}>`), iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true }) }) // Устанавливаем автора
            .setDescription(await Translate(`Текущий трек <${queue.currentTrack.title}> <\n\n> <${tracks.slice(0, 5).join('\n')}> <\n\n> <${nextSongs}>`)) // Устанавливаем описание
            .setTimestamp() // Устанавливаем временную метку
            .setFooter({ text: await Translate('Музыкальный OPGBOT v3 <❤️>'), iconURL: inter.member.avatarURL({ dynamic: true }) }); // Устанавливаем нижний колонтитул

        // Отправляем ответ с embed-сообщением
        inter.editReply({ embeds: [embed] });
    }
}