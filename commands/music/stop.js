const { EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'stop',
    description: 'Остановить трек', // Описание команды
    voiceChannel: true,

    async execute({ inter }) {
        const queue = useQueue(inter.guild);
        if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`Сейчас не играет музыка <${inter.member}>... попробуйте ещё раз? <❌>`) });

        queue.delete();

        const embed = new EmbedBuilder()
            .setColor('#2f3136')
            .setAuthor({ name: await Translate(`Музыка остановлена <✅>`) });

        return inter.editReply({ embeds: [embed] });
    }
}
