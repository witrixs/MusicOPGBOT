const ms = require('ms');
const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'seek',
    description: 'Перейти назад или вперед в песне', // Описание команды
    voiceChannel: true,
    options: [
        {
            name: 'time',
            description: 'Время, к которому нужно пропустить', // Описание параметра
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],
    
    async execute({ inter }) {
        const queue = useQueue(inter.guild);
        if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`Сейчас не играет музыка <${inter.member}>... попробуйте еще раз? <❌>`) });

        const timeToMS = ms(inter.options.getString('time'));
        if (timeToMS >= queue.currentTrack.durationMS) {
            return inter.editReply({ content: await Translate(`Указанное время превышает общее время текущей песни <${inter.member}>... попробуйте еще раз? <❌>\n *Попробуйте, например, валидное время, такое как <**5s, 10s, 20 секунд, 1m**>...*`) });
        }

        await queue.node.seek(timeToMS);

        const embed = new EmbedBuilder()
            .setColor('#2f3136')
            .setAuthor({ name: await Translate(`Время установлено на текущей песне <**${ms(timeToMS, { long: true })}**> <✅>`) });

        inter.editReply({ embeds: [embed] });
    }
}
