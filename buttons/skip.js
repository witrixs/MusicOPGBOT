const { Translate } = require("../process_tools"); // Импортируем функцию для перевода текстов

module.exports = async ({ inter, queue }) => {
    // Проверяем, воспроизводится ли в данный момент музыка
    if (!queue?.isPlaying()) 
        return inter.editReply({ content: await Translate(`Сейчас музыка не играет... попробуйте снова? <❌>`) });

    // Пропускаем текущий трек и сохраняем результат операции
    const success = queue.node.skip();

    // Отправляем ответ на взаимодействие: сообщение об успешном пропуске трека или об ошибке
    return inter.editReply({ 
        content: success 
            ? await Translate(`Текущая музыка <${queue.currentTrack.title}> пропущена <✅>`) 
            : await Translate(`Что-то пошло не так <${inter.member}>... попробуйте снова? <❌>`) 
    });
}
