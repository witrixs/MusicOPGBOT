const { Translate } = require('../process_tools'); // Импортируем функцию перевода

module.exports = async ({ inter, queue }) => {
    // Проверяем, играет ли в данный момент музыка
    if (!queue?.isPlaying()) 
        return inter.editReply({ content: await Translate(`Сейчас музыка не играет... попробуйте снова? <❌>`) });

    // Пытаемся возобновить воспроизведение текущей музыки
    const resumed = queue.node.resume();
    // Создаем сообщение о текущем треке, который был возобновлён
    let message = await Translate(`Текущая музыка <${queue.currentTrack.title}> возобновлена <✅>`);

    // Если воспроизведение не возобновилось, ставим трек на паузу
    if (!resumed) {
        queue.node.pause(); // Ставим трек на паузу
        message = await Translate(`Текущая музыка <${queue.currentTrack.title}> приостановлена <✅>`); // Обновляем сообщение
    }

    // Отправляем сообщение в ответ на взаимодействие
    return inter.editReply({ content: message });
}
