const { useMainPlayer, useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'syncedlyrics',
    description: 'Синхронизировать текст песни', // Описание команды
    voiceChannel: true,

    async execute({ inter }) {
        const player = useMainPlayer();
        const queue = useQueue(inter.guild);
        if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`Сейчас не играет музыка <${inter.member}>... попробуйте ещё раз? <❌>`) });

        const metadataThread = queue.metadata.lyricsThread;
        if (metadataThread && !metadataThread.archived) return inter.editReply({ content: await Translate(`Поток с текстом уже создан <${inter.member}>! <${queue.metadata.lyricsThread}>`) });

        const results = await player.lyrics
            .search({
                q: queue.currentTrack.title
            })
            .catch(async (e) => {
                console.log(e);
                return inter.editReply({ content: await Translate(`Ошибка! Пожалуйста, свяжитесь с разработчиком! | <❌>`) });
            });

        const lyrics = results?.[0];
        if (!lyrics?.plainLyrics) return inter.editReply({ content: await Translate(`Текст для <${queue.currentTrack.title}> не найден... попробуйте ещё раз? <❌>`) });
        
        const thread = await queue.metadata.channel.threads.create({
            name: `Текст песни ${queue.currentTrack.title}`
        });

        queue.setMetadata({
            channel: queue.metadata.channel,
            lyricsThread: thread
        });

        const syncedLyrics = queue?.syncedLyrics(lyrics);
        syncedLyrics.onChange(async (lyrics) => {
            await thread.send({
                content: lyrics
            });
        });

        syncedLyrics?.subscribe();

        return inter.editReply({ content: await Translate(`Текст песни успешно синхронизирован в <${thread}>! <${inter.member}> <✅>`) });
    }
}
