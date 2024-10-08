const { EmbedBuilder } = require('discord.js'); // Импортируем класс EmbedBuilder для создания сообщений
const { Translate } = require('../process_tools'); // Импортируем функцию перевода

module.exports = async ({ inter, queue }) => {
    // Проверяем, играет ли в данный момент музыка
    if (!queue?.isPlaying()) 
        return inter.editReply({ content: await Translate(`Сейчас музыка не играет... попробуйте снова? <❌>`) });

    // Создаем новый Embed для отправки информации о текущем треке
    const embed = new EmbedBuilder()
        .setColor('Red') // Устанавливаем цвет эмбеда
        .setTitle(`:arrow_forward: ${queue.currentTrack.title}`) // Устанавливаем заголовок с названием трека
        .setURL(queue.currentTrack.url) // Устанавливаем URL на трек
        .addFields(
            { name: await Translate('Длительность <:hourglass:>'), value: `\`${queue.currentTrack.duration}\``, inline: true }, // Поле для длительности
            { name: await Translate('Исполнитель:'), value: `\`${queue.currentTrack.author}\``, inline: true }, // Поле для исполнителя
            { name: await Translate('Просмотры <:eyes:>'), value: `\`${Number(queue.currentTrack.views).toLocaleString()}\``, inline: true }, // Поле для количества просмотров
            { name: await Translate('Ссылка на трек <URL>:'), value: `\`${queue.currentTrack.url}\`` } // Поле для ссылки на трек
        )
        .setThumbnail(queue.currentTrack.thumbnail) // Устанавливаем миниатюру трека
        .setFooter({ text: await Translate(`С сервера <${inter.member.guild.name}>`), iconURL: inter.member.guild.iconURL({ dynamic: false }) }); // Устанавливаем подвал с информацией о сервере

    // Отправляем созданный embed пользователю в личные сообщения
    inter.member.send({ embeds: [embed] })
        .then(async () => {
            // Если сообщение успешно отправлено, отправляем ответ в канал
            return inter.editReply({ content: await Translate(`Я отправил вам информацию о музыке в личные сообщения <✅>`) });
        }).catch(async (error) => {
            console.error(error); // Выводим ошибку в консоль
            // Если не удалось отправить личное сообщение, отправляем сообщение об ошибке в канал
            return inter.editReply({ content: await Translate(`Не удалось отправить вам личное сообщение... попробуйте снова? <❌>`) });
        });
}
