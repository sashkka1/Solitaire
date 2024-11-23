// Определяем константы статуса игры
export const GameStatus = Object.freeze({
  PLAYING: 1,    // Игра идет
  GAME_OVER: 2,  // Игра окончена
  WIN: 3         // Победа
});

// Определяем основной класс игры, который наследуется от EventTarget
export class GameCore extends EventTarget {
  constructor() {
    super();
    this._status = GameStatus.PLAYING; // Устанавливаем начальный статус как PLAYING
  }

  // Геттер для получения текущего статуса игры
  get status() {
    return this._status;
  }

  // Сеттер для изменения статуса игры
  set status(newStatus) {
    this._status = newStatus; // Обновляем статус
    this.dispatchEvent(new Event('StatusChanged')); // Генерируем событие при изменении статуса
  }
}

// Класс пользовательского интерфейса игры
export class GameUI {
  constructor(gameDiv) {
    this.gameDiv = gameDiv;  // Элемент контейнера для игры
    this.currentGame = null; // Объект текущей игры

    // Создаем элемент для отображения сообщения о статусе
    this._statusMessagePara = document.createElement('p');
    this._statusMessagePara.classList.add('status-message'); // Класс для стилей
    this._statusMessagePara.classList.add('hidden');         // Скрываем сообщение по умолчанию
    gameDiv.appendChild(this._statusMessagePara);            // Добавляем элемент в контейнер игры
  }

  // Метод для создания новой игры; должен быть переопределен в наследниках
  newGame() {
    if (this.currentGame === null) {
      throw new Error("newGame() не был переопределен или не установил currentGame");
    }

    // Добавляем обработчик события изменения статуса игры
    this.currentGame.addEventListener('StatusChanged', () => this._onStatusChanged());
    this._onStatusChanged(); // Обновляем отображение статуса игры при ее запуске
  }
  backButton() {
    if (this.currentGame === null) {
      throw new Error("newGame() не был переопределен или не установил currentGame");
    }
  }

  // Метод для обновления интерфейса в зависимости от текущего статуса игры
  _onStatusChanged() {
    if (this.currentGame.status === GameStatus.GAME_OVER) {
      this._statusMessagePara.classList.remove('hidden');    // Показываем сообщение
      this._statusMessagePara.textContent = "Game Over :(";  // Сообщение о проигрыше
    } else if (this.currentGame.status === GameStatus.WIN) {
      let block = document.getElementById('win-box');
      block.classList.add('normal-win');
      let buttonPlace = document.getElementById('button-place');
      buttonPlace.classList.remove('normal');
      // this._statusMessagePara.classList.remove('hidden');    // Показываем сообщение
      // this._statusMessagePara.textContent = "You win :)";    // Сообщение о победе
    } else if (this.currentGame.status === GameStatus.PLAYING) {
      this._statusMessagePara.classList.add('hidden');       // Скрываем сообщение
      this._statusMessagePara.textContent = "";              // Сбрасываем текст
    } else {
      throw new Error("Неизвестный статус игры: " + this.currentGame.status); // Ошибка для неизвестного статуса
    }
  }
}
