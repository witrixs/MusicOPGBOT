const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js");
const { Translate } = require("../../process_tools");

module.exports = (queue, track) => {
  // Проверка, нужно ли отображать сообщение о зацикливании
  if (!client.config.app.loopMessage && queue.repeatMode !== 0) return;

  // Определение, должны ли использоваться эмодзи
  let EmojiState = client.config.app.enableEmojis;
  const emojis = client.config.emojis;

  emojis ? EmojiState = EmojiState : EmojiState = false;

  // Асинхронная функция для отправки сообщения о начале воспроизведения
  (async () => {
    const embed = new EmbedBuilder()
      .setAuthor({
        name: await Translate(
          `Начато воспроизведение <${track.title}> в <${queue.channel.name}> <🎧>`
        ),
        iconURL: track.thumbnail,
      })
      .setColor("#2f3136"); // Установка цвета сообщения

    // Создание кнопок управления
    const back = new ButtonBuilder()
      .setLabel(EmojiState ? emojis.back : ('Назад'))
      .setCustomId('back')
      .setStyle('Primary');

    const skip = new ButtonBuilder()
      .setLabel(EmojiState ? emojis.skip : ('Пропустить'))
      .setCustomId('skip')
      .setStyle('Primary');

    const resumepause = new ButtonBuilder()
      .setLabel(EmojiState ? emojis.ResumePause : ('Возобновить & Пауза'))
      .setCustomId('resume&pause')
      .setStyle('Danger');

    const loop = new ButtonBuilder()
      .setLabel(EmojiState ? emojis.loop : ('Зациклить'))
      .setCustomId('loop')
      .setStyle('Danger');

    const lyrics = new ButtonBuilder()
      .setLabel(await Translate("Текст трека"))
      .setCustomId("lyrics")
      .setStyle("Secondary");

    // Создание строки с кнопками
    const row1 = new ActionRowBuilder().addComponents(
      back,
      loop,
      resumepause,
      skip,
      lyrics
    );

    // Отправка сообщения с embed и кнопками в канал очереди
    queue.metadata.channel.send({ embeds: [embed], components: [row1] });
  })();
};
