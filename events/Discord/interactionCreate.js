const { EmbedBuilder, InteractionType } = require('discord.js');
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = async (client, inter) => {
    // Отложенный ответ на взаимодействие (для сообщений, которые не должны быть видны другим пользователям)
    await inter.deferReply({ ephemeral: true });

    // Если взаимодействие является командой
    if (inter.type === InteractionType.ApplicationCommand) {
        const DJ = client.config.opt.DJ; // Получаем настройки DJ
        const command = client.commands.get(inter.commandName); // Получаем команду по её имени

        // Создаём встраиваемое сообщение для ошибок
        const errorEmbed = new EmbedBuilder().setColor('#ff0000');

        // Если команда не найдена
        if (!command) {
            errorEmbed.setDescription(await Translate('<❌> | Ошибка! Пожалуйста, обратитесь к разработчикам!'));
            inter.editReply({ embeds: [errorEmbed], ephemeral: true });
            return client.slash.delete(inter.commandName); // Удаляем команду из списка доступных
        }

        // Проверка разрешений на выполнение команды
        if (command.permissions && !inter.member.permissions.has(command.permissions)) {
            errorEmbed.setDescription(await Translate('<❌> | У вас нет необходимых прав для выполнения этой команды.'));
            return inter.editReply({ embeds: [errorEmbed], ephemeral: true });
        }

        // Проверка на роль DJ, если команда зарезервирована для DJ
        if (DJ.enabled && DJ.commands.includes(command) && !inter.member._roles.includes(inter.guild.roles.cache.find(x => x.name === DJ.roleName).id)) {
            errorEmbed.setDescription(await Translate(`<❌> | Эта команда доступна только для пользователей с ролью <\`${DJ.roleName}\`>`));
            return inter.editReply({ embeds: [errorEmbed], ephemeral: true });
        }

        // Проверка на нахождение в голосовом канале
        if (command.voiceChannel) {
            if (!inter.member.voice.channel) {
                errorEmbed.setDescription(await Translate('<❌> | Вы не находитесь в голосовом канале.'));
                return inter.editReply({ embeds: [errorEmbed], ephemeral: true });
            }

            // Проверка на нахождение в одном и том же голосовом канале с ботом
            if (inter.guild.members.me.voice.channel && inter.member.voice.channel.id !== inter.guild.members.me.voice.channel.id) {
                errorEmbed.setDescription(await Translate('<❌> | Вы не находитесь в том же голосовом канале.'));
                return inter.editReply({ embeds: [errorEmbed], ephemeral: true });
            }
        }

        // Выполнение команды
        command.execute({ inter, client });

    // Если взаимодействие происходит с компонентом сообщения (например, кнопка)
    } else if (inter.type === InteractionType.MessageComponent) {
        const customId = inter.customId; // Получаем ID компонента
        if (!customId) return;

        const queue = useQueue(inter.guild); // Получаем очередь воспроизведения
        const path = `../../buttons/${customId}.js`; // Путь к файлу с обработчиком кнопки

        // Очищаем кэш и загружаем обработчик кнопки
        delete require.cache[require.resolve(path)];
        const button = require(path);
        if (button) return button({ client, inter, customId, queue });
    }
}
