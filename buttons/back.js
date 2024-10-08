const { Translate } = require('../process_tools');

module.exports = async ({ inter, queue }) => {
  // Проверка, воспроизводится ли в данный момент музыка
  if (!queue?.isPlaying())
    return inter.editReply({
      content: await Translate(`Сейчас музыка не играет... попробуйте снова? <❌>`),
    });
  // Проверка, был ли ранее воспроизведен трек
  if (!queue.history.previousTrack)
    return inter.editReply({
      content: await Translate(`До этого не было сыграно музыки <${inter.member}>... попробуйте снова? <❌>`),
    });

  // Возврат к предыдущему треку
  await queue.history.back();

  inter.editReply({
    content: await Translate(`Воспроизведение <**предыдущего**> трека <✅>`),
  });
};
