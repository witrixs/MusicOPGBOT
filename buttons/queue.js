const { EmbedBuilder } = require('discord.js');
const { Translate } = require('../process_tools');

module.exports = async ({ client, inter, queue }) => {
    // Проверяем, играет ли в данный момент музыка
    if (!queue?.isPlaying()) 
        return inter.editReply({ content: await Translate(`Сейчас музыка не играет... попробуйте снова? <❌>`) });
    
    // Проверяем, есть ли треки в очереди после текущего
    if (!queue.tracks.toArray()[0]) 
        return inter.editReply({ content: await Translate(`Нет музыки в очереди после текущей <${inter.member}>... попробуйте снова? <❌>`) });

    const methods = ['', '🔁', '🔂']; // Массив с режимами повторения
    const songs = queue.tracks.length; // Получаем количество треков в очереди
    const nextSongs = songs > 5 
        ? await Translate(`И <**${songs - 5}**> других песен...`) // Если больше 5, выводим количество оставшихся
        : await Translate(`В плейлисте <**${songs}**> песен...`); // Если 5 или меньше, выводим общее количество

    // Получаем массив с треками, добавляя информацию о каждом
    const tracks = await Promise.all(queue.tracks.map(async (track, i) => 
        await Translate(`<**${i + 1}**> - <${track.title} | ${track.author}> (запрашивалась: <${track.requestedBy ? track.requestedBy.displayName : "неизвестно"}>)`)
    ));

    // Создаем embed-сообщение для отображения информации о текущей очереди
    const embed = new EmbedBuilder()
        .setColor('#ff0000') // Устанавливаем цвет embed-сообщения
        .setThumbnail(inter.guild.iconURL({ size: 2048, dynamic: true })) // Устанавливаем миниатюру с иконкой сервера
        .setAuthor({ 
            name: await Translate(`Очередь сервера - <${inter.guild.name} ${methods[queue.repeatMode]}>`), // Заголовок с названием сервера и режимом повтора
            iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true }) // Иконка бота
        })
        .setDescription(`Сейчас играет: ${queue.currentTrack.title}\n\n${tracks.slice(0, 5).join('\n')}\n\n${nextSongs}`) // Описание с текущим треком и треками в очереди
        .setTimestamp() // Добавляем отметку времени
        .setFooter({ 
            text: await Translate('Музыка на первом месте - Сделано с любовью сообществом <❤️>'), // Подпись внизу сообщения
            iconURL: inter.member.avatarURL({ dynamic: true }) // Иконка пользователя, вызвавшего команду
        });

    // Отправляем embed-сообщение в ответ на взаимодействие
    inter.editReply({ embeds: [embed] });
}
