const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'skipto',
    description: "Пропустить к определённому треку в очереди", // Описание команды
    voiceChannel: true,
    options: [
        {
            name: 'song',
            description: 'Имя/ссылка трека, на который вы хотите перейти', // Описание параметра
            type: ApplicationCommandOptionType.String,
            required: false,
        },
        {
            name: 'number',
            description: 'Позиция в очереди, где находится трек', // Описание параметра
            type: ApplicationCommandOptionType.Number,
            required: false,
        }
    ],

    async execute({ inter }) {
        const queue = useQueue(inter.guild);
        if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`Сейчас не играет музыка <${inter.member}>... попробуйте ещё раз? <❌>`) });

        const track = inter.options.getString('song');
        const number = inter.options.getNumber('number');
        if (!track && !number) return inter.editReply({ content: await Translate(`Вы должны использовать один из вариантов, чтобы перейти к треку <${inter.member}>... попробуйте ещё раз? <❌>`) });

        let trackName;

        if (track) {
            const skipTo = queue.tracks.toArray().find((t) => t.title.toLowerCase() === track.toLowerCase() || t.url === track);
            if (!skipTo) return inter.editReply({ content: await Translate(`Не удалось найти <${track}> <${inter.member}>... попробуйте использовать URL или полное имя трека? <❌>`) });

            trackName = skipTo.title;

            queue.node.skipTo(skipTo);
        } else if (number) {
            const index = number - 1;
            const name = queue.tracks.toArray()[index]?.title; // Используем оператор опциональной цепочки
            if (!name) return inter.editReply({ content: await Translate(`Этот трек, похоже, не существует <${inter.member}>... попробуйте ещё раз? <❌>`) });

            trackName = name;

            queue.node.skipTo(index);
        }

        const embed = new EmbedBuilder()
            .setAuthor({ name: await Translate(`Переключено на <${trackName}> <✅>`) })
            .setColor('#2f3136');

        inter.editReply({ embeds: [embed] });
    }
}
