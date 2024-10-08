module.exports = (queue) => {
    // Проверка, существует ли поток с текстами песни
    if (queue.metadata.lyricsThread) {
        // Если поток существует, удаляем его
        queue.metadata.lyricsThread.delete();

        // Устанавливаем метаданные очереди, обновляя канал
        queue.setMetadata({
            channel: queue.metadata.channel
        });
    }
}
