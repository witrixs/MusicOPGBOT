const { EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'back',
    description: "Вернуться к последней сыгранной песне", // Описание команды
    voiceChannel: true,

    async execute({ inter }) {
        const queue = useQueue(inter.guild);

        // Проверка, играет ли музыка
        if (!queue?.isPlaying()) {
            return inter.editReply({ content: await Translate(`В данный момент музыка не играет <${inter.member}>... попробуйте снова? <❌>`) });
        }

        // Проверка наличия предыдущей песни
        if (!queue.history.previousTrack) {
            return inter.editReply({ content: await Translate(`Перед этим не было проигранной музыки <${inter.member}>... попробуйте снова? <❌>`) });
        }

        try {
            await queue.history.back(); // Возврат к предыдущей песне

            const backEmbed = new EmbedBuilder()
                .setAuthor({ name: await Translate(`Играет предыдущая трек <✅>`) })
                .setColor('#2f3136');

            return inter.editReply({ embeds: [backEmbed] }); // Отправка сообщения с информацией
        } catch (error) {
            console.error(error); // Логирование ошибки
            return inter.editReply({ content: await Translate(`Произошла ошибка при попытке вернуться к предыдущей песне <${inter.member}>... попробуйте снова? <❌>`) });
        }
    }
}