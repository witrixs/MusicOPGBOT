const { EmbedBuilder } = require('discord.js');
const { Translate } = require('../process_tools');

module.exports = async ({ client, inter, queue }) => {
    // Проверка, воспроизводится ли в данный момент музыка
    if (!queue?.isPlaying()) 
        return inter.editReply({ content: await Translate(`Сейчас музыка не играет... попробуйте снова? <❌>`) });

    const track = queue.currentTrack; // Получаем текущий трек
    const methods = ['disabled', 'track', 'queue']; // Опции для режима зацикливания
    const timestamp = track.duration; // Длительность трека
    const trackDuration = timestamp.progress == 'Infinity' ? 'infinity (live)' : track.duration; // Если трек в прямом эфире
    const progress = queue.node.createProgressBar(); // Создание прогресс-бара

    const embed = new EmbedBuilder()
        .setAuthor({ name: track.title, iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true }) }) // Заголовок с названием трека и аватаром бота
        .setThumbnail(track.thumbnail) // Миниатюра (thumbnail) с изображением трека
        .setDescription(await Translate(`Громкость <**${queue.node.volume}**%\n> <Длительность **${trackDuration}**\n> <Прогресс ${progress}\n> <Режим зацикливания **${methods[queue.repeatMode]}**\n> <Запрошено ${track.requestedBy}>`)) // Описание с информацией о треке
        .setFooter({ text: 'Музыкальный OPGBOT v3 ❤️', iconURL: inter.member.avatarURL({ dynamic: true }) }) // Подвал с информацией и аватаром пользователя
        .setColor('ff0000') // Цвет встраиваемого сообщения
        .setTimestamp(); // Установка временной метки

    inter.editReply({ embeds: [embed] }); // Отправка встраиваемого сообщения
}
