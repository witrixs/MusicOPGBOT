const { Translate } = require('../../process_tools');

module.exports = async (client) => {
    // Логгирование сообщения о подключении клиента
    console.log(await Translate(`Logged to the client <${client.user.username}>.`)); // Сообщение переводится и выводится в консоль, где <${client.user.username}> заменяется на имя бота

    // Логгирование сообщения о том, что бот готов к работе
    console.log(await Translate("Let's play some music !"));

    // Установка активности бота (статус "играет" или "слушает")
    client.user.setActivity(client.config.app.playing); // Активность устанавливается на значение, указанное в конфигурации (например, "OPG City")
}
