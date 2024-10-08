const maxVol = client.config.opt.maxVol || 100;
const { ApplicationCommandOptionType } = require('discord.js');
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'volume',
    description: 'Регулировать громкость', // Описание команды
    voiceChannel: true,
    options: [
        {
            name: 'volume',
            description: 'Новая громкость', // Описание параметра
            type: ApplicationCommandOptionType.Number,
            required: true,
            minValue: 1,
            maxValue: maxVol
        }
    ],

    async execute({ inter }) {
        const queue = useQueue(inter.guild);
        if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`Сейчас не играет музыка <${inter.member}>... попробуйте ещё раз? <❌>`) });

        const vol = inter.options.getNumber('volume');
        if (queue.node.volume === vol) return inter.editReply({ content: await Translate(`Новая громкость уже равна текущей <${inter.member}>... попробуйте ещё раз? <❌>`) });

        const success = queue.node.setVolume(vol);

        return inter.editReply({ content: success ? await Translate(`Громкость изменена на <${vol}/${maxVol}%> <🔊>`) : `Что-то пошло не так, ${inter.member}... попробуйте ещё раз? ❌` });
    }
}
