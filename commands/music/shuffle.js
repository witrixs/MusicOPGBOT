const { EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'shuffle',
    description: 'Перемешать очередь', // Описание команды
    voiceChannel: true,

    async execute({ inter }) {
        const queue = useQueue(inter.guild);
        if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`Сейчас не играет музыка <${inter.member}>... попробуйте еще раз? <❌>`) });

        if (!queue.tracks.toArray()[0]) return inter.editReply({ content: await Translate(`В очереди нет музыки после текущей <${inter.member}>... попробуйте еще раз? <❌>`) });

        queue.tracks.shuffle();

        const embed = new EmbedBuilder()
            .setColor('#2f3136')
            .setAuthor({ name: await Translate(`Очередь перемешана <${queue.tracks.size}> трек(ов)! <✅>`) });

        return inter.editReply({ embeds: [embed] });
    }
}
