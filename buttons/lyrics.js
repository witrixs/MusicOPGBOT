const { EmbedBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');
const { Translate } = require('../process_tools');

module.exports = async ({ inter, queue }) => {
    const player = useMainPlayer();
    if (!queue?.isPlaying()) 
        return inter.editReply({ content: await Translate(`Сейчас музыка не играет <${inter.member}>... попробуйте снова? <❌>`) });

    const results = await player.lyrics
        .search({
            q: queue.currentTrack.title
        })
        .catch(async (e) => {
            console.log(e);
            return inter.editReply({ content: await Translate(`Ошибка! Пожалуйста, свяжитесь с разработчиками! | <❌>`) });
        });

    const lyrics = results?.[0];
    if (!lyrics?.plainLyrics) 
        return inter.editReply({ content: await Translate(`Не найдено текстов для <${queue.currentTrack.title}>... попробуйте снова? <❌>`) });

    const trimmedLyrics = lyrics.plainLyrics.substring(0, 1997);

    const embed = new EmbedBuilder()
        .setTitle(`Текст для ${queue.currentTrack.title}`)
        .setAuthor({
            name: lyrics.artistName
        })
        .setDescription(trimmedLyrics.length === 1997 ? `${trimmedLyrics}...` : trimmedLyrics)
        .setFooter({ text: await Translate('Музыкальный OPGBOT v3 <❤️>'), iconURL: inter.member.avatarURL({ dynamic: true }) })
        .setTimestamp()
        .setColor('#2f3136');

    return inter.editReply({ embeds: [embed] });
}
