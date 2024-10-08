const { QueueRepeatMode } = require('discord-player');
const { Translate } = require('../process_tools');

module.exports = async ({ inter, queue }) => {
    const methods = ['disabled', 'track', 'queue']; // Перевод методов зацикливания
    if (!queue?.isPlaying()) 
        return inter.editReply({ content: await Translate(`Сейчас музыка не играет... попробуйте снова? <❌>`) });

    // Переключение режима зацикливания
    if (queue.repeatMode === 2) 
        queue.setRepeatMode(QueueRepeatMode.OFF)
    else 
        queue.setRepeatMode(queue.repeatMode + 1)

    return inter.editReply({ content: await Translate(`Режим зацикливания установлен на <**${methods[queue.repeatMode]}**>.<✅>`) });
}
