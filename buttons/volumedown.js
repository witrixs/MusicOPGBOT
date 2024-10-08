const { Translate } = require('../process_tools'); // Импортируем функцию для перевода текстов

const maxVol = client.config.opt.maxVol; // Получаем максимальную громкость из конфигурации

module.exports = async ({ inter, queue }) => {
    // Проверяем, воспроизводится ли в данный момент музыка
    if (!queue?.isPlaying()) 
        return inter.editReply({ content: await Translate(`Сейчас музыка не играет... попробуйте снова? <❌>`) });

    // Рассчитываем новую громкость, уменьшая текущую на 5
    const vol = Math.floor(queue.node.volume - 5);

    // Проверяем, не ниже ли новая громкость нуля
    if (vol < 0) 
        return inter.editReply({ content: await Translate(`Я не могу уменьшить громкость ниже нуля <${inter.member}>... попробуйте снова? <❌>`) });

    // Проверяем, не равна ли новая громкость текущей
    if (queue.node.volume === vol) 
        return inter.editReply({ content: await Translate(`Громкость, которую вы хотите установить, уже текущая <${inter.member}>... попробуйте снова? <❌>`) });

    // Устанавливаем новую громкость
    const success = queue.node.setVolume(vol);

    // Отправляем ответ в зависимости от того, успешно ли изменена громкость
    return inter.editReply({ content: success ? await Translate(`Громкость была изменена на <${vol}/${maxVol}% 🔊>`) : await Translate(`Что-то пошло не так <${inter.member}>... попробуйте снова? <❌>`) });
}
