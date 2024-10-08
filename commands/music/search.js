const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { QueryType, useMainPlayer } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'search',
    description: 'Поиск песни', // Описание команды
    voiceChannel: true,
    options: [
        {
            name: 'song',
            description: 'Песня, которую вы хотите найти', // Описание параметра
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],

    async execute({ client, inter }) {
        const player = useMainPlayer();
        const song = inter.options.getString('song');

        const res = await player.search(song, {
            requestedBy: inter.member,
            searchEngine: QueryType.AUTO
        });

        if (!res?.tracks.length) return inter.editReply({ content: await Translate(`Результатов не найдено <${inter.member}>... попробуйте еще раз? <❌>`) });

        const queue = player.nodes.create(inter.guild, {
            metadata: {
                channel: inter.channel
            },
            spotifyBridge: client.config.opt.spotifyBridge,
            volume: client.config.opt.defaultvolume,
            leaveOnEnd: client.config.opt.leaveOnEnd,
            leaveOnEmpty: client.config.opt.leaveOnEmpty
        });
        const maxTracks = res.tracks.slice(0, 10);

        const embed = new EmbedBuilder()
            .setColor('#2f3136')
            .setAuthor({ name: await Translate(`Результаты для <${song}>`), iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true }) })
            .setDescription(await Translate(`<${maxTracks.map((track, i) => `**${i + 1}**. ${track.title} | ${track.author}`).join('\n')}\n\n> Выберите вариант от <**1**> до <**${maxTracks.length}**> или <**отменить**> ⬇️>`))
            .setTimestamp()
            .setFooter({ text: await Translate('Музыка прежде всего - Сделано с любовью сообществом <❤️>'), iconURL: inter.member.avatarURL({ dynamic: true }) });

        inter.editReply({ embeds: [embed] });

        const collector = inter.channel.createMessageCollector({
            time: 15000,
            max: 1,
            errors: ['time'],
            filter: m => m.author.id === inter.member.id
        });

        collector.on('collect', async (query) => {
            collector.stop();
            if (query.content.toLowerCase() === 'cancel') {
                return inter.followUp({ content: await Translate(`Поиск отменен <✅>`) , ephemeral: true });
            }

            const value = parseInt(query);
            if (!value || value <= 0 || value > maxTracks.length) {
                return inter.followUp({ content: await Translate(`Некорректный ответ, попробуйте значение от <**1**> до <**${maxTracks.length}**> или <**отменить**>... попробуйте еще раз? <❌>`), ephemeral: true });
            }

            try {
                if (!queue.connection) await queue.connect(inter.member.voice.channel);
            } catch {
                await player.deleteQueue(inter.guildId);
                return inter.followUp({ content: await Translate(`Я не могу присоединиться к голосовому каналу <${inter.member}>... попробуйте еще раз? <❌>`), ephemeral: true });
            }

            await inter.followUp({ content: await Translate(`Загрузка вашего поиска... <🎧>`), ephemeral: true });

            queue.addTrack(res.tracks[query.content - 1]);

            if (!queue.isPlaying()) await queue.node.play();
        });

        collector.on('end', async (msg, reason) => {
            if (reason === 'time') return inter.followUp({ content: await Translate(`Поиск истек <${inter.member}>... попробуйте еще раз? <❌>`), ephemeral: true });
        });
    }
}
