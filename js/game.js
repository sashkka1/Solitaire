let game_version = '1.31.34';


// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDRdEEY-De_dezz2ycoOJYR-H9CH6wRp5E",
  authDomain: "telegramminiapp-dc0b0.firebaseapp.com",
  projectId: "telegramminiapp-dc0b0",
  storageBucket: "telegramminiapp-dc0b0.firebasestorage.app",
  messagingSenderId: "266044158892",
  appId: "1:266044158892:web:6abbe852cb7735b4488009",
  measurementId: "G-PXL5QGF8DJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);



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
      window.Telegram.WebApp.CloudStorage.getItem("countWin", (err, count) => {
        // let count = localStorage.getItem("countWin");
        // count =0;

        if (count === null || count === undefined || count === "") {
          count=1;
        }else{
          count++;
        }

        let occurrence_time_local;
        let occurrence_time_utc0;

        switch(count){ // отправление ивентов о завершении уровня
          case 1: 
            occurrence_time_local = new Date(); // Завершение 1ого уровня
            occurrence_time_utc0 = new Date().toISOString();
            gtag('event', 'level_1_end', {
              'occurrence_time_local': occurrence_time_local,
              'occurrence_time_utc0': occurrence_time_utc0,
              'game_version': game_version,
            });
          break;
          case 2: 
            occurrence_time_local = new Date(); // Завершение 2ого уровня
            occurrence_time_utc0 = new Date().toISOString();
            gtag('event', 'level_2_end', {
              'occurrence_time_local': occurrence_time_local,
              'occurrence_time_utc0': occurrence_time_utc0,
              'game_version': game_version,
            });
          break;
          case 5: 
            occurrence_time_local = new Date(); // Завершение 5ого уровня
            occurrence_time_utc0 = new Date().toISOString();
            gtag('event', 'level_5_end', {
              'occurrence_time_local': occurrence_time_local,
              'occurrence_time_utc0': occurrence_time_utc0,
              'game_version': game_version,
            });
          break;
          case 10: 
            occurrence_time_local = new Date(); // Завершение 10ого уровня
            occurrence_time_utc0 = new Date().toISOString();
            gtag('event', 'level_10_end', {
              'occurrence_time_local': occurrence_time_local,
              'occurrence_time_utc0': occurrence_time_utc0,
              'game_version': game_version,
            });
          break;
          case 15: 
            occurrence_time_local = new Date(); // Завершение 15ого уровня
            occurrence_time_utc0 = new Date().toISOString();
            gtag('event', 'level_15_end', {
              'occurrence_time_local': occurrence_time_local,
              'occurrence_time_utc0': occurrence_time_utc0,
              'game_version': game_version,
            });
          break;
          case 20: 
            occurrence_time_local = new Date(); // Завершение 20ого уровня
            occurrence_time_utc0 = new Date().toISOString();
            gtag('event', 'level_20_end', {
              'occurrence_time_local': occurrence_time_local,
              'occurrence_time_utc0': occurrence_time_utc0,
              'game_version': game_version,
            });
          break;
          case 30: 
            occurrence_time_local = new Date(); // Завершение 30ого уровня
            occurrence_time_utc0 = new Date().toISOString();
            gtag('event', 'level_30_end', {
              'occurrence_time_local': occurrence_time_local,
              'occurrence_time_utc0': occurrence_time_utc0,
              'game_version': game_version,
            });
          break;
          case 40: 
            occurrence_time_local = new Date(); // Завершение 40ого уровня
            occurrence_time_utc0 = new Date().toISOString();
            gtag('event', 'level_40_end', {
              'occurrence_time_local': occurrence_time_local,
              'occurrence_time_utc0': occurrence_time_utc0,
              'game_version': game_version,
            });
          break;
          case 50: 
            occurrence_time_local = new Date(); // Завершение 50ого уровня
            occurrence_time_utc0 = new Date().toISOString();
            gtag('event', 'level_50_end', {
              'occurrence_time_local': occurrence_time_local,
              'occurrence_time_utc0': occurrence_time_utc0,
              'game_version': game_version,
            });
          break;
          default:
        }
        window.Telegram.WebApp.CloudStorage.setItem("countWin", count);
        // localStorage.setItem("countWin", count);
      });
      let block = document.getElementById('win-box');
      block.classList.add('normal-win');
      let buttonPlace = document.getElementById('button-place');
      buttonPlace.classList.remove('normal');
      window.Telegram.WebApp.CloudStorage.removeItem("saveCard");
      // localStorage.removeItem("saveCard");
      this._statusMessagePara.classList.remove('hidden');    // Показываем сообщение
      // this._statusMessagePara.textContent = "You win :)";    // Сообщение о победе
    } else if (this.currentGame.status === GameStatus.PLAYING) {
      this._statusMessagePara.classList.add('hidden');       // Скрываем сообщение
      this._statusMessagePara.textContent = "";              // Сбрасываем текст
    } else {
      throw new Error("Неизвестный статус игры: " + this.currentGame.status); // Ошибка для неизвестного статуса
    }
  }
}
