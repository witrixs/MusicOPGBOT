const { EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'skip',
    description: 'Пропустить трек', // Описание команды
    voiceChannel: true,

    async execute({ inter }) {
        const queue = useQueue(inter.guild);
        if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`Сейчас не играет музыка <${inter.member}>... попробуйте еще раз? <❌>`) });

        const success = queue.node.skip();

        const embed = new EmbedBuilder()
            .setColor('#2f3136')
            .setAuthor({ name: success ? await Translate(`Текущая музыка <${queue.currentTrack.title}> пропущена <✅>`) : await Translate(`Что-то пошло не так <${inter.member}>... попробуйте еще раз? <❌>`) });

        return inter.editReply({ embeds: [embed] });
    }
}
