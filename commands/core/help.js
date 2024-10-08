// Импортирует классы EmbedBuilder (для создания встраиваемых сообщений) и Translate (для перевода текста)
const { EmbedBuilder } = require('discord.js');
const { Translate } = require('../../process_tools');

// Экспорт модуля команды 'help'
module.exports = {
    name: 'help', // Имя команды - "help"
    description: "Все команды, которые есть у этого бота!", // Описание команды
    showHelp: false, // Не показывает команду в списке помощи (по умолчанию)

    // Асинхронная функция, которая выполняется при вызове команды
    async execute({ client, inter }) {
        // Фильтрует команды, которые нужно показывать в списке (только те, где showHelp !== false)
        const commands = client.commands.filter(x => x.showHelp !== false);

        // Создает встраиваемое сообщение (embed) с помощью EmbedBuilder
        const embed = new EmbedBuilder()
            .setColor('#ff0000') // Устанавливает цвет для сообщения (красный цвет)
            .setAuthor({ 
                name: client.user.username, // Устанавливает имя автора сообщения как имя бота
                iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true }) // Устанавливает аватар бота с размером 1024 и динамическим обновлением
            })
            .setDescription(await Translate('Музыка by witrix')) 

            // Создание массива полей с командами и их описаниями
            .addFields(await Promise.all(commands.map(async (command) => ({
                name: `\`${command.name}\``, // Название команды в виде кода
                value: await Translate(command.description) || 'Нет описания', // Описание команды (если есть)
                inline: true // Поля будут располагаться в одном ряду
            }))))
            .setTimestamp() // Добавляет отметку времени (время создания сообщения)
            .setFooter({ 
                text: await Translate('Музыкальный OPGBOT v3'), // Перевод текста нижнего колонтитула
                iconURL: inter.member.avatarURL({ dynamic: true }) // Устанавливает аватар пользователя, который вызвал команду
            });

        // Редактирует сообщение с ответом на команду, добавляя встраиваемое сообщение (embed)
        inter.editReply({ embeds: [embed] });
    }
};
