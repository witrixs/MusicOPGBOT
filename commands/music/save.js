const { EmbedBuilder } = require("discord.js"); // Импортируем EmbedBuilder для создания структурированных сообщений
const { useQueue } = require('discord-player'); // Импортируем useQueue для работы с очередью воспроизведения
const { Translate } = require('../../process_tools'); // Импортируем функцию перевода

module.exports = {
    name: 'save', // Имя команды
    description: ('Сохранить текущий трек!'), // Описание команды
    voiceChannel: true, // Устанавливаем, что команда может вызываться только в голосовом канале

    async execute({ inter }) {
        const queue = useQueue(inter.guild); // Получаем текущую очередь для сервера

        // Проверяем, играет ли музыка
        if (!queue?.isPlaying()) 
            return inter.editReply({ content: await Translate(`Сейчас ничего не воспроизводится <${inter.member}>... попробуйте снова ? <❌>`) });

        // Создаем embed-сообщение с информацией о текущем треке
        const embed = new EmbedBuilder()
            .setColor('#2f3136') // Устанавливаем цвет сообщения
            .setTitle(`:arrow_forward: ${queue.currentTrack.title}`) // Заголовок с названием трека
            .setURL(queue.currentTrack.url) // URL трека
            .addFields(
                { name: await Translate('Длительность <:hourglass:>'), value: `\`${queue.currentTrack.duration}\``, inline: true },
                { name: await Translate('Исполнитель:'), value: `\`${queue.currentTrack.author}\``, inline: true },
                { name: await Translate('Просмотры <:eyes:>'), value: `\`${Number(queue.currentTrack.views).toLocaleString()}\``, inline: true },
                { name: await Translate('Ссылка на трек:'), value: `\`${queue.currentTrack.url}\`` }
            )
            .setThumbnail(queue.currentTrack.thumbnail) // Устанавливаем миниатюру трека
            .setFooter({ text: await Translate(`С сервера <${inter.member.guild.name}>`), iconURL: inter.member.guild.iconURL({ dynamic: false }) }); // Устанавливаем нижний колонтитул

        // Отправляем embed-сообщение в личные сообщения пользователя
        inter.member.send({ embeds: [embed] })
        .then(async () => {
            // Успешно отправлено
            return inter.editReply({ content: await Translate(`Я отправил вам информацию о треке в личные сообщения <✅>`) });
        }).catch(async () => {
            // Ошибка при отправке личного сообщения
            return inter.editReply({ content: await Translate(`Не удалось отправить вам личное сообщение... попробуйте снова ? <❌>`) });
        });
    }
}
