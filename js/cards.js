let game_version = '1.30.9';

import { GameCore, GameStatus, GameUI} from './game.js?v=1.30.9';

export const SUITS = [
  { name: 'spade', color: 'black', unicode: '\u2660'},
  { name: 'heart', color: 'red', unicode: '\u2665'},
  { name: 'club', color: 'black', unicode: '\u2663'},
  { name: 'diamond', color: 'red', unicode: '\u2666'},
];

let i =0;
let oldPlace, newPlace, backCard, whatChange, beforeVisible, oldId;
let gameIsStart = 0;
let gameIsStart2 = 0;
let block;
let checkcontinue = 0;






// кнопка отмены при проверке создания новой игры
block = document.getElementById('check-desire-button-cancel');
block.addEventListener('click', () => {
  let elements = document.getElementById("check-desire-box");
  elements.classList.remove('normal');
});
// Фон за блоком при проверке создания новой игры
block = document.getElementById('backk');
block.addEventListener('click', () => {
  let elements = document.getElementById("check-desire-box");
  elements.classList.remove('normal');
});




// Определяем класс карты с использованием EventTarget для событий

export class Card extends EventTarget {
  constructor(number, suit, id) {
    super(); // Вызов конструктора родительского класса EventTarget
    this._number = number; // Устанавливаем номер карты (от 1 до 13)
    this._suit = suit; // Устанавливаем масть карты
    this.v = false; // Изначально карта невидима
    this.p = "";
    this.i = "0";
    this.in = "-1";
  }

  // Возвращает строковое представление номера карты (A, J, Q, K или число)
  getNumberString() {
    switch (this.number) {
      case 1: return 'A'; // Если номер 1, возвращаем "A" (туз)
      case 11: return 'J'; // Если номер 11, возвращаем "J" (валет)
      case 12: return 'Q'; // Если номер 12, возвращаем "Q" (дама)
      case 13: return 'K'; // Если номер 13, возвращаем "K" (король)
      default: return (this.number + ''); // В других случаях возвращаем число
    }
  }

  // Геттеры и сеттеры для свойств number, suit и visible
  get number() { return this._number; }
  get suit() { return this._suit; }
  get visible() { return this.v; }
  // get id() { return this.id; }

  set number(value) { this._number = value; this.dispatchEvent(new Event('CardChanged')); }
  set suit(value) { this._suit = value; this.dispatchEvent(new Event('CardChanged')); }
  set visible(value) { this.v = value; this.dispatchEvent(new Event('CardChanged')); }
  // set id(value) { this.id = value; this.dispatchEvent(new Event('CardChanged')); }
}

// Функция для перемешивания массива карт (алгоритм Фишера-Йетса)
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Случайный индекс
    [a[i], a[j]] = [a[j], a[i]]; // Меняем местами элементы
  }
}

// Класс логики игры на основе карт
export class CardGameCore extends GameCore {
  // Метод-заглушка, который должен быть переопределен для получения строк расположения карт
  static getCardPlaceStrings() {
    throw new Error("wasn't overrided");
  }
  // Генерирует и кэширует информацию о местах для карт
  static getCardPlaces() {
    if (this._cachedCardPlaces !== undefined) {
      return this._cachedCardPlaces; // Возвращаем кэшированный результат, если доступен
    }

    const kindToCounts = {}; // Ассоциативный массив для подсчета видов мест
    const stringArray = this.getCardPlaceStrings(); // Получаем строки мест
    const width = stringArray[0].split(' ').length; // Ширина в символах

    for (const [yCount, string] of stringArray.entries()) {
      if (/\d/.test(string)) {
        throw new Error("card place string contains a number: " + string); // Ошибка, если встречается число
      }

      const stringParts = string.split(' ');
      if (stringParts.length !== width) {
        throw new Error("inconsistent string part count"); // Ошибка, если количество частей не совпадает
      }

      for (const [xCount, kind] of stringParts.entries()) {
        if (kind === '-') {
          continue; // Пропускаем пустые места
        }
        if (kindToCounts[kind] === undefined) {
          kindToCounts[kind] = [];
        }
        kindToCounts[kind].push([xCount, yCount]); // Запоминаем координаты мест для каждого вида
      }
    }

    // Результат, содержащий информацию о местах карт
    const result = {
      kindToPlaceIds: {},
      placeIdToCounts: {},
      countsToPlaceId: {},
      countsToKind: {},
      width: width,
      height: stringArray.length,
    };
    for (const [kind, counts2dArray] of Object.entries(kindToCounts)) {
      result.kindToPlaceIds[kind] = [];
      for (const [index, counts] of counts2dArray.entries()) {
        let id = kind;
        if (counts2dArray.length !== 1) {
          id += index; // Уникальный идентификатор места для вида
        }
        result.kindToPlaceIds[kind].push(id);
        result.placeIdToCounts[id] = counts;
        result.countsToPlaceId[counts] = id;
        result.countsToKind[counts] = kind;
        // console.log(`result.kindToPlaceIds[kind].push(id) ${counts}`);
      }
      
    }

    this._cachedCardPlaces = result;
    return result; // Возвращаем построенные данные о местах карт
  }

  // Создает и возвращает массив всех карт в колоде
  static createCards() {
    const result = [];
    // let uniqueId  =1;
    for (const suit of SUITS) {
      for (let number = 1; number <= 13; number++) {
        // suit.id = uniqueId;
        // result.push(new Card()); // Создаем карты каждой масти и добавляем в массив
        result.push(new Card(number, suit, )); // Создаем карты каждой масти и добавляем в массив
        // console.log(`suit.id - ${suit.id}, number - ${number}, name - ${suit.name}`);
        // uniqueId ++;
      }
    }
    return result;
  }

  // Конструктор для создания игры с использованием всех карт
  constructor(allCards) {
    super();
    for (const card of allCards) {
      card.visible = false; // Устанавливаем все карты невидимыми
    }

    this._allCards = Array.from(allCards); // Копируем массив карт
    shuffle(this._allCards); // Перемешиваем карты

    this.placeIdToCardArray = {};
    for (const id of Object.keys(this.constructor.getCardPlaces().placeIdToCounts)) {
      this.placeIdToCardArray[id] = []; // Инициализируем массивы карт для каждого места
    }
  }

  // Метод-заглушка для раздачи карт
  deal() {
    throw new Error("wasn't overrided");
  }

  // Метод-заглушка для проверки на победу
  checkWin() {
    throw new Error("wasn't overrided");
  }

  // Перемещает карты в новое место и проверяет статус игры
  moveCards(cardArray, newPlaceId, setStatus = true) {
    for(let i=0;i<cardArray.length;i++){// актуализвация положения карты
      cardArray[i].p = newPlaceId;
    }
    
    this.placeIdToCardArray[newPlaceId].push(...cardArray); // Перемещаем карты
    const event = new Event('CardsMoved');
    event.newPlaceId = newPlaceId;
    event.cardArray = cardArray;
    this.dispatchEvent(event); // Отправляем событие перемещения карт
    if (setStatus && this.checkWin()) {
      this.status = GameStatus.WIN; // Обновляем статус на "победа" при достижении условий
    }

    for(let i=0;i<52;i++){ // актуализация индекса карты
      let sourceArray = this.placeIdToCardArray[this._allCards[i].p];
      this._allCards[i].in = sourceArray.indexOf(this._allCards[i]);
    }

    if(gameIsStart > 0){ // сохранение в тг клаудстор
      let b=[];
      let f=0;

      if(whatChange == "table"){ // только когда перемещение было с стола открываем придыдущую карту
        let sourceArray = this.placeIdToCardArray[oldPlace];
        if(sourceArray.length !== 0){ // если последнее действие открывает карту
          for(let i=0;i<52;i++){
            if((sourceArray.length-1) == this._allCards[i].in && this._allCards[i].p == oldPlace){
              this._allCards[i].v = true;
              i = 52;
            }
          }
        }
      }

      for(let i=0;i<this._allCards.length;i++){// преобразование в массив для сохранение в облако 
        if( this._allCards[i].v == true){this._allCards[i].visible = true }
        let a = [this._allCards[i].v, this._allCards[i].p, this._allCards[i].i, this._allCards[i].in];
        b[f] = a;
        f++;
      }
      if(whatChange == "stock"){ // только когда перемещение было с стока открываем последнюю карту дискрад
        let asdf = this.placeIdToCardArray['discard'];
        if((this.placeIdToCardArray['discard'].length-1) >=0){
          for(let i=0;i<this._allCards.length;i++){
            if(this._allCards[i] == asdf[asdf.length-1]){
              b[i][0] = true;
            }
          }
        }
      }
      if(whatChange == "table"){
      // window.Telegram.WebApp.CloudStorage.setItem("saveCard", JSON.stringify(b));
      localStorage.setItem("saveCard", JSON.stringify(b));
      }
      // console.log("Save good");
      // console.table(b);
    }
  }

  moveCardsForStock(cardArray, newPlaceId, setStatus = true) { // перемещение карт без сохранения
    for(let i=0;i<cardArray.length;i++){// актуализвация положения карты
      cardArray[i].p = newPlaceId;
    }
    
    this.placeIdToCardArray[newPlaceId].push(...cardArray); // Перемещаем карты
    const event = new Event('CardsMoved');
    event.newPlaceId = newPlaceId;
    event.cardArray = cardArray;
    this.dispatchEvent(event); // Отправляем событие перемещения карт
    if (setStatus && this.checkWin()) {
      this.status = GameStatus.WIN; // Обновляем статус на "победа" при достижении условий
    }

    for(let i=0;i<52;i++){ // актуализация индекса карты
      let sourceArray = this.placeIdToCardArray[this._allCards[i].p];
      this._allCards[i].in = sourceArray.indexOf(this._allCards[i]);
    }
  }

  rawMoveForStock(card, sourcePlaceId, destPlaceId,) { // перемещение карт без сохранения
    let buttonBack = document.getElementById('back-button');
    buttonBack.classList.remove('lock');

    const sourceArray = this.placeIdToCardArray[sourcePlaceId];
    const index = sourceArray.indexOf(card);
    if (index === -1) {
      throw new Error("card and sourcePlaceId don't match"); // Ошибка, если карта не найдена в указанном месте
    }
    const moving = sourceArray.splice(index); // Извлекаем карты для перемещения
    this.moveCardsForStock(moving, destPlaceId); // Перемещаем карты
  }
  

  // Находит текущее место, где находится карта
  findCurrentPlaceId(card) {
    for (const [id, cardArray] of Object.entries(this.placeIdToCardArray)) {
      if (cardArray.includes(card)) {
        return id; // Возвращаем ID места, если карта найдена
      }
    }
    throw new Error("cannot find card"); // Ошибка, если карта не найдена
  }

  // Проверяет возможность перетаскивания карты
  canMaybeMoveSomewhere(card, sourcePlaceId) {
    throw new Error("wasn't overrided"); // Заглушка для проверки возможного хода
  }

  // Проверяет возможность перемещения карты на новое место
  canMove(card, sourcePlaceId, destPlaceId) {
    throw new Error("wasn't overrided"); // Заглушка для проверки допустимого перемещения
  }

  // Реализует перемещение карты в новое место
  rawMove(card, sourcePlaceId, destPlaceId,) {
    let buttonBack = document.getElementById('back-button');
    buttonBack.classList.remove('lock');

    const sourceArray = this.placeIdToCardArray[sourcePlaceId];
    const index = sourceArray.indexOf(card);
    if (index === -1) {
      throw new Error("card and sourcePlaceId don't match"); // Ошибка, если карта не найдена в указанном месте
    }
    const moving = sourceArray.splice(index); // Извлекаем карты для перемещения
    this.moveCards(moving, destPlaceId); // Перемещаем карты
  }

  indexStart(){ // при выведении сохраненной игры чтобы понимал что игра началась
    gameIsStart++;
    checkcontinue++;
  }
  
  rawMoveForGet(card, last, neww) { // для реализации перемещения карт при возврате их из тг клаудстор
    let buttonBack = document.getElementById('back-button');
    buttonBack.classList.remove('lock');
// console.log('rawMoveForGet1');
    const sourceArray = this.placeIdToCardArray[last];
    const index = sourceArray.indexOf(card);
    // console.log(index,'index',sourceArray,'sourceArray');
    if (index === -1) {
      throw new Error("card and sourcePlaceId don't match"); // Ошибка, если карта не найдена в указанном месте
    }
    const moving = sourceArray.splice(card.in,1); // Извлекаем карты для перемещения
    // console.log('rawMoveForGet2');
    this.moveCards(moving, neww); // Перемещаем карты
    // console.log('rawMoveForGet3');
  }


  // Осуществляет перемещение карты с проверкой возможности
  move(card, sourcePlaceId, destPlaceId) {
    if (!this.canMove(card, sourcePlaceId, destPlaceId)) {
      throw new Error("invalid move"); // Ошибка, если перемещение недопустимо
    }
    this.rawMove(card, sourcePlaceId, destPlaceId); // Выполняем перемещение
  }

}




let widthh = window.innerWidth;
// console.log('Current width:', widthh);

let ScreenWidth = screen.width;
if(widthh > 720){
  widthh = 720;
}
const CARD_WIDTH = widthh*0.135;
const CARD_HEIGHT = CARD_WIDTH * 1.390625;
export const SPACING_SMALL = 0.15 * CARD_HEIGHT; // Маленький интервал
export const SPACING_MEDIUM = 0.3 * CARD_WIDTH; // Средний интервал переписал
export const SPACING_BIG = 0.35 * CARD_HEIGHT; // Большой интервал переписал

// Ограничивает число в пределах min и maxPlus1
function putNumberBetween(num, min, maxPlus1) {
  if (num < min) {
    return min; // Возвращает минимум, если число меньше min
  }
  if (num >= maxPlus1) {
    return maxPlus1 - 1; // Возвращает максимум - 1, если число больше или равно maxPlus1
  }
  return num; // Возвращает само число, если оно в пределах min и maxPlus1
}


export class CardGameUI extends GameUI {
  // Учитывайте, что cardDiv.left и cardDiv.top - это координаты центра карты,
  // так как CSS применяет translate(-50%, -50%) для выравнивания по центру

  constructor(gameDiv, CoreClass) {
    super(gameDiv); // Инициализация базового класса GameUI с gameDiv
    this._CoreClass = CoreClass;

    // Рассчитываем увеличение по оси X в процентах для размещения карточек
    const xIncrementPercents = 100 / CoreClass.getCardPlaces().width;

    this.cardPlaceDivs = {};
    i =0;
    for (const [id, [xCount, yCount]] of Object.entries(CoreClass.getCardPlaces().placeIdToCounts)) {
      i++;
      
      const div = document.createElement('div'); // Создаем контейнер для места карты
      div.classList.add('card-place'); // Добавляем CSS класс
      if( i == 5){
        div.classList.add('invisible');
      }
      div.style.width = CARD_WIDTH + 'px'; // Устанавливаем ширину места карты
      div.style.height = CARD_HEIGHT + 'px'; // Устанавливаем высоту места карты
      div.style.left = (xCount + 1 / 2) * xIncrementPercents + '%'; // Позиционируем место по оси X
      div.style.top = (yCount * (SPACING_SMALL + CARD_HEIGHT) + SPACING_SMALL + CARD_HEIGHT / 2) + 'px'; // Позиционируем по оси Y
      gameDiv.appendChild(div); // Добавляем div в контейнер gameDiv
      this.cardPlaceDivs[id] = div; // Сохраняем div в cardPlaceDivs по id
    }

    const cardArray = CoreClass.createCards(); // Создаем массив карт
    this.cardDivs = new Map();


    i =0;
    for (const card of cardArray) {
    i++;

      const div = document.createElement('div'); // Создаем div для каждой карты
      div.classList.add('card'); // Применяем CSS класс карты
      // div.classList.add(card.suit.color); // Применяем цвет масти ('red' или 'black')
      div.style.width = CARD_WIDTH + 'px'; // Устанавливаем ширину карты
      div.style.height = CARD_HEIGHT + 'px'; // Устанавливаем высоту карты
      div.style.left = xIncrementPercents / 2 + '%'; // Устанавливаем начальную позицию по X
      div.style.top = (SPACING_SMALL + CARD_HEIGHT / 2) + 'px'; // Устанавливаем начальную позицию по Y
      div.setAttribute('id', i); // Присваиваем id
      // card.suit.id = i;
      card.i = i;
      div.style.backgroundImage = `url(./materials/Images/Front/${i + '.png'})`;


      // Создаем два угловых элемента для отображения номера и масти карты
      for (const loop of [1, 2]) {
        const subDiv = document.createElement('div');
        div.appendChild(subDiv);
        const numberSpan = document.createElement('span');
        // numberSpan.classList.add('number'); // Класс для номера карты
        subDiv.appendChild(numberSpan);
        const suitSpan = document.createElement('span');
        // suitSpan.classList.add('suit'); // Класс для масти карты
        subDiv.appendChild(suitSpan);
        // console.log(`i${i}`, `subDiv(${subDiv})`, `numberSpan(${numberSpan})`, `suitSpan(${suitSpan})` );
        if(loop == 1){
          subDiv.classList.add('back');
        }
      }
      const subDiv = document.createElement('div');
      // console.log(`i${i}`, `card.suit.number(${card.suit.number})`, `card.suit.number(${card.suit.number})`, `card.suit.number(${card.suit.number})` );
      this.cardDivs.set(card, div); // Сохраняем div карты в Map
      gameDiv.appendChild(div); // Добавляем карту в gameDiv

      // Подписываемся на события изменения карты
      card.addEventListener('CardChanged', () => this._onCardChanged(card));
      this._onCardChanged(card); // Первоначальная настройка карты

      // Добавляем обработчики событий для перетаскивания карты мышью и касанием
      div.addEventListener('mousedown', event => {
        if (event.which === 1) { // Левая кнопка мыши
          this._beginDrag(card, event.clientX, event.clientY);
        }
      });
      div.addEventListener('touchstart', event => {
        this._beginDrag(card, event.changedTouches[0].clientX, event.changedTouches[0].clientY);
        event.preventDefault(); // Предотвращаем дополнительные события касания
      }, { passive: false });
    }

    // Добавляем обработчики перемещения для мыши и касания
    gameDiv.addEventListener('mousemove', event => this._doDrag(event.clientX, event.clientY));
    gameDiv.addEventListener('touchmove', event => {
      this._doDrag(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
      event.preventDefault(); // Предотвращаем дополнительные события касания
    }, { passive: false });

    // Обработчики для завершения перетаскивания карты при выходе из игрового поля
    gameDiv.addEventListener('mouseleave', () => this._endDrag(null));
    gameDiv.addEventListener('mouseup', () => this._endDrag(null));
    gameDiv.addEventListener('touchend', event => this._endDrag(event.target));

    this._draggingState = null; // Состояние для отслеживания процесса перетаскивания
  }

  newGame() {// проверяю на то была ли игра уже начата чтобы решить выставлять блок решением пользователя о продолжении или новой игре  
    let autocomplete = document.getElementById('check-autocomplete-button');
    let buttonPlace = document.getElementById('button-place');
    let buttonBack = document.getElementById('back-button');
    buttonBack.classList.add('lock');
    if(gameIsStart2 ==0){ // первый заход, позволяем разложить карты
      this.currentGame = new this._CoreClass(Array.from(this.cardDivs.keys()), ...arguments);
      this.currentGame.addEventListener('CardsMoved', event => this._onCardsMoved(event)); // Подписка на событие перемещения карт
      this.currentGame.deal(); // Начало игры (раздача карт)
      super.newGame(); // Вызов метода newGame() родительского класса
      this.currentGame.stockCurrentDefolt();
      autocomplete.classList.remove('normal-auto');
      buttonPlace.classList.add('normal');
    }else if(gameIsStart == 0){ // изменений нет, просто начинаем новую
      this.currentGame = new this._CoreClass(Array.from(this.cardDivs.keys()), ...arguments);
      this.currentGame.addEventListener('CardsMoved', event => this._onCardsMoved(event)); // Подписка на событие перемещения карт
      this.currentGame.deal(); // Начало игры (раздача карт)
      super.newGame(); // Вызов метода newGame() родительского класса
      this.currentGame.stockCurrentDefolt();
      autocomplete.classList.remove('normal-auto');
      buttonPlace.classList.add('normal');
      // window.Telegram.WebApp.CloudStorage.removeItem("saveCard");
      localStorage.removeItem("saveCard");
    }else{
      // window.Telegram.WebApp.CloudStorage.removeItem("saveCard");
      localStorage.removeItem("saveCard");
      let elements = document.getElementById("check-desire-box");
      elements.classList.remove('normal');
      this.currentGame = new this._CoreClass(Array.from(this.cardDivs.keys()), ...arguments);
      this.currentGame.addEventListener('CardsMoved', event => this._onCardsMoved(event)); // Подписка на событие перемещения карт
      this.currentGame.deal(); // Начало игры (раздача карт)
      super.newGame(); // Вызов метода newGame() родительского класса
      this.currentGame.stockCurrentDefolt();
      
      autocomplete.classList.remove('normal-auto');
      buttonPlace.classList.add('normal');
      if(checkcontinue > 0){ 
        let occurrence_time_local = new Date(); //Старт новой игры, если прошлая игра находилась в прогрессеПо сути дубликат level_start (отправится два ивента), но будет указание на то, что пользователь решил пропустить текущую игру
        let occurrence_time_utc0 = new Date().toISOString();
        gtag('event', 'level_reset_and_start', {
          'occurrence_time_local': occurrence_time_local,
          'occurrence_time_utc0': occurrence_time_utc0,
          'game_version': game_version,
        });
        checkcontinue=0;
      }
      
    }
    gameIsStart=0;
    gameIsStart2 ++;
    this.currentGame.actualGameStart(gameIsStart);
  }

  autoButton(){ // реализация кнопки автозаполнения

    gameIsStart =0; // для того чтобы не сохраняла при выполнении автокомплита

    let occurrence_time_local = new Date(); // Нажатие на кнопку автокомплита уровня
    let occurrence_time_utc0 = new Date().toISOString();
    gtag('event', 'initiate_autocomplete', {
      'occurrence_time_local': occurrence_time_local,
      'occurrence_time_utc0': occurrence_time_utc0,
      'game_version': game_version,
    });

    this.currentGame.forAuto();
    let block = document.getElementById('check-autocomplete-button');
    block.classList.remove('normal-auto');
  }

  backButton(){ // реализация кнопки бэк

    let occurrence_time_local = new Date(); // Нажатие на кнопку отмены действия
    let occurrence_time_utc0 = new Date().toISOString();
    gtag('event', 'cancel_move', {
      'occurrence_time_local': occurrence_time_local,
      'occurrence_time_utc0': occurrence_time_utc0,
      'game_version': game_version,
    });

    if(backCard !="undefined"){

      if(whatChange == "stock"){
        let discard = this.currentGame.placeIdToCardArray.discard.length;
        let stock = this.currentGame.placeIdToCardArray.stock.length;
        let summ = discard + stock;

        while((summ) > 0){
          summ--;
          this.currentGame.stockToDiscardAuto();
        }
        this.currentGame.discardToStockAuto();
        if(discard == 0){
          discard = stock+1;
        }

        while((discard-1) > 0){
          discard--;
          this.currentGame.stockToDiscardAuto();
        }
      }else if(whatChange == "table"){
        let a= "discard";
        if(oldPlace != a){
          if(beforeVisible != true){
            const sourceArray = this.currentGame.placeIdToCardArray[oldPlace];
            if(oldId > 0){
              sourceArray[oldId - 1].visible = false;
            }
          }
        }
        // this.currentGame.rawMoveForStock(backCard, newPlace, oldPlace);
        this.currentGame.rawMove(backCard, newPlace, oldPlace);

      }

      backCard ="undefined";
    }
    let buttonBack = document.getElementById('back-button');
    buttonBack.classList.add('lock');
  }
    
  _onCardChanged(card) {
    // Метод для обновления отображения карты при изменении её состояния
    const div = this.cardDivs.get(card);

    if (card.visible) {
      div.classList.add('visible'); // Если карта видима, добавляем класс 'visible'
      div.classList.remove('back');
    } else {
      div.classList.remove('visible'); // Иначе убираем этот класс
      div.classList.add('back');
    }
  }

  _beginDrag(card, clientX, clientY) {
    // Начало перетаскивания карты
    if (this.currentGame.status !== GameStatus.PLAYING || this._draggingState !== null) {
      return; // Прекращаем, если игра не активна или уже происходит перетаскивание
    }

    const oldCardPlaceId = this.currentGame.findCurrentPlaceId(card); // Идентификатор текущего места карты
    if (!this.currentGame.canMaybeMoveSomewhere(card, oldCardPlaceId)) {
      whatChange = "stock";
      backCard = 'a'
      return; // Проверяем, можно ли вообще переместить карту
    }
    const allCardsAtThePlace = this.currentGame.placeIdToCardArray[oldCardPlaceId]; // Все карты на текущем месте
    const index = allCardsAtThePlace.indexOf(card); // Индекс карты среди других на этом месте
    
    if (index < 0) {
      throw new Error("placeIdToCardArray или findCurrentPlaceId не работают корректно");
    }
    const movingCards = allCardsAtThePlace.slice(index); // Получаем все карты от текущей до последней на месте
    if (movingCards.length === 0) {
      throw new Error("произошла ошибка, movingCards не может быть пустым");
    }

    const cardInfos = movingCards.map((card, index) => {
      const div = this.cardDivs.get(card); // Получаем div карты
      const divRect = div.getBoundingClientRect(); // Координаты div на экране

      const oldStyle = {
        left: div.style.left,
        top: div.style.top,
        zIndex: div.style.zIndex,
      };
      div.style.zIndex = 100 + index; // Устанавливаем высокий z-index для карт, которые перетаскиваются
      div.classList.add('dragging'); // Добавляем класс 'dragging' для карты

      return {
        card: card,
        div: div,
        oldStyle: oldStyle,
        mouseOffsetFromCenterX: clientX - (divRect.left + divRect.right) / 2, // Смещение по X относительно центра карты
        mouseOffsetFromCenterY: clientY - (divRect.top + divRect.bottom) / 2, // Смещение по Y относительно центра карты
      };
    });

    this._draggingState = {
      oldCardPlaceId: oldCardPlaceId,
      dropPlaceId: null,
      cardInfos: cardInfos, // Массив с данными о перетаскиваемых картах
      hasMoved: false,
      index: index,
    };
  }

  
  // может вернуть null, если не удастся найти место
_cardPlaceIdFromRelativeCoordinates(x, y) {
  // Получаем общую ширину игрового поля
  const totalWidth = this.gameDiv.getBoundingClientRect().width;
  // Вычисляем соотношение X относительно ширины игрового поля
  const xRatio = x / totalWidth;
  // Определяем количество мест по оси X (округляя вниз)
  const xCountRaw = Math.floor(xRatio * this._CoreClass.getCardPlaces().width);

  // Определяем центр по оси Y для нулевого количества строк
  const yCenterOfYCountZero = SPACING_SMALL + CARD_HEIGHT / 2;
  // Разница по Y между двумя строками карт
  const yDifferenceBetweenTwoRows = SPACING_SMALL + CARD_HEIGHT;
  // Разница между переданным Y и центром первой строки
  const yDifference = y - yCenterOfYCountZero;
  // Определяем количество мест по оси Y (округляя до ближайшего целого)
  const yCountRaw = Math.round(yDifference / yDifferenceBetweenTwoRows);

  // Ограничиваем количество по оси X, чтобы оно не выходило за пределы доступных мест
  const xCount = putNumberBetween(xCountRaw, 0, this._CoreClass.getCardPlaces().width);
  // Ограничиваем количество по оси Y аналогично
  const yCount = putNumberBetween(yCountRaw, 0, this._CoreClass.getCardPlaces().height);

  // Получаем идентификатор места, основываясь на найденных xCount и yCount
  const placeId = this._CoreClass.getCardPlaces().countsToPlaceId[xCount + ',' + yCount];
  // Если место не найдено, возвращаем null
  if (placeId === undefined) {
    return null;
  }
  // Возвращаем идентификатор места
  return placeId;
}

// Обрабатываем перетаскивание карты
_doDrag(clientX, clientY) {
  // Проверяем, идет ли игра и существует ли состояние перетаскивания
  if (this.currentGame.status !== GameStatus.PLAYING || this._draggingState === null) {
    return; // Если нет, выходим из функции
  }

  // Получаем размеры игрового поля
  const gameDivRect = this.gameDiv.getBoundingClientRect();
  let firstXRelative = null; // Переменная для первого относительного X
  let firstYRelative = null; // Переменная для первого относительного Y

  // Обрабатываем каждую карту в состоянии перетаскивания
  for (const cardInfo of this._draggingState.cardInfos) {
    // Вычисляем относительное положение карты по X
    const xRelative = clientX - gameDivRect.left - cardInfo.mouseOffsetFromCenterX;
    // Вычисляем относительное положение карты по Y
    const yRelative = clientY - gameDivRect.top - cardInfo.mouseOffsetFromCenterY;
    // Устанавливаем новые стили для карты (позиция)
    cardInfo.div.style.left = xRelative + 'px';
    cardInfo.div.style.top = yRelative + 'px';
    
    // Запоминаем первое относительное положение, если это первая итерация
    if (firstXRelative === null && firstYRelative === null) {
      firstXRelative = xRelative;
      firstYRelative = yRelative;
    }
  }

  // Получаем новое место для карты на основе относительных координат
  const newCardPlaceId = this._cardPlaceIdFromRelativeCoordinates(firstXRelative, firstYRelative);
  // Проверяем, можно ли переместить карту в новое место
  if (newCardPlaceId !== null &&
      this.currentGame.canMove(this._draggingState.cardInfos[0].card, this._draggingState.oldCardPlaceId, newCardPlaceId)) {

      // сохранение данных для кнопки back
      oldPlace = this._draggingState.oldCardPlaceId;
      backCard = this._draggingState.cardInfos[0].card;
      newPlace = newCardPlaceId;
      whatChange = "table";
      oldId =this._draggingState.index;

      // проверка на то была ли открыта карта-1 перед последним перетаскиванием для кнопки back
      let a = "discard";
      beforeVisible = false;
      const sourceArray = this.currentGame.placeIdToCardArray[oldPlace];
      if(oldPlace != a){
        if(oldId > 0){
          if(sourceArray[oldId - 1].visible == true){
            beforeVisible = true;
          }
        }
      }
      

    // Если можно, добавляем класс для визуализации готовности к сбросу
    for (const cardInfo of this._draggingState.cardInfos) {
      cardInfo.div.classList.add('ready2drop');
    }
    // Запоминаем новое место для сброса
    this._draggingState.dropPlaceId = newCardPlaceId;
  } else {
    // Если нельзя, убираем класс готовности к сбросу
    for (const cardInfo of this._draggingState.cardInfos) {
      cardInfo.div.classList.remove('ready2drop');
    }
    this._draggingState.dropPlaceId = null; // Обнуляем место для сброса
  }
  // Указываем, что карты были перемещены
  this._draggingState.hasMoved = true;
}

// Обрабатываем окончание перетаскивания
_endDrag(touchElement) {
  // Проверяем, идет ли игра
  if (this.currentGame.status !== GameStatus.PLAYING) {
    return; // Если нет, выходим из функции
  }
  // Если состояние перетаскивания равно null, возможно, была нажата карта
  if (this._draggingState === null) {
    if (touchElement !== null) {
      touchElement.click(); // Симулируем клик по элементу
    }
    return; // Выходим из функции
  }

  // Если новое место для сброса равно null, восстанавливаем старый стиль карт
  if (this._draggingState.dropPlaceId === null) {
    for (const cardInfo of this._draggingState.cardInfos) {
      Object.assign(cardInfo.div.style, cardInfo.oldStyle);
    }
  } else {
    gameIsStart++;
    this.currentGame.actualGameStart(gameIsStart);
    this.currentGame.move(this._draggingState.cardInfos[0].card, this._draggingState.oldCardPlaceId, this._draggingState.dropPlaceId);
    // _onCardsMoved() обрабатывает дальнейшие действия
    if(checkcontinue == 1){ 
      let occurrence_time_local = new Date(); //Продолжение игры rогда пользователь сделал один ход в игре, в которую он уже играл и которая была загружена
      let occurrence_time_utc0 = new Date().toISOString();
      gtag('event', 'level_continue', {
        'occurrence_time_local': occurrence_time_local,
        'occurrence_time_utc0': occurrence_time_utc0,
        'game_version': game_version,
      });
      checkcontinue++;
    }

  }

  // Убираем классы, связанные с перетаскиванием
  for (const cardInfo of this._draggingState.cardInfos) {
    cardInfo.div.classList.remove('ready2drop');
    cardInfo.div.classList.remove('dragging');
  }

  // Обрабатываем совместимость касаний с событиями клика
  if (touchElement !== null && !this._draggingState.hasMoved) {
    touchElement.click(); // Симулируем клик по элементу
  }

  // Обнуляем состояние перетаскивания
  this._draggingState = null;
}

// Метод, который вызывается для каждой карты при перемещении
// Переопределите, чтобы настроить, куда идут карты
getNextCardOffset(card, movedCards, newPlaceId) {   // eslint-disable-line
  return [0, 0]; // Возвращает смещение (по умолчанию 0, 0)
}

// Обрабатываем событие перемещения карт
_onCardsMoved(event) {
  // Получаем количество мест по осям X и Y для нового места
  const [ xCount, yCount ] = this._CoreClass.getCardPlaces().placeIdToCounts[event.newPlaceId];
  // Вычисляем процентное соотношение по оси X
  const xIncrementPercents = 100 / this._CoreClass.getCardPlaces().width;
  // Находим центр по оси X в процентах
  const xCenterPercents = (xCount + 1/2) * xIncrementPercents;
  // Определяем координату Y центра
  const yCenter = SPACING_SMALL + CARD_HEIGHT / 2 + (SPACING_SMALL + CARD_HEIGHT) * yCount;
  // console.log(`yCenter ${yCenter}`);
  let zIndex = 1; // Начальный индекс Z для наложения карт
  let xOffset = 0; // Смещение по оси X
  let yOffset = 0; // Смещение по оси Y

  // Обрабатываем каждую карту в новом месте
  for (const card of this.currentGame.placeIdToCardArray[event.newPlaceId]) {
    const div = this.cardDivs.get(card); // Получаем элемент карты
    // Устанавливаем позиции и порядок наложения
    // div.style.left = `calc(${xCenterPercents}% + ${xOffset}vw)`;
    // div.style.top = (yCenter + yOffset) + 'vw';
    div.style.left = `calc(${xCenterPercents}% + ${xOffset}px)`;
    div.style.top = (yCenter + yOffset) + 'px';
    div.style.zIndex = zIndex++;

    // Получаем дополнительные смещения для следующей карты
    const [ xOffsetMore, yOffsetMore ] = this.getNextCardOffset(card, event.cardArray, event.newPlaceId);
    xOffset += xOffsetMore; // Обновляем общее смещение по оси X
    yOffset += yOffsetMore; // Обновляем общее смещение по оси Y
  }

  // Обновляем высоту игрового поля на основе координат карт
  const maxCardCenterY = Math.max(...( Array.from(this.cardDivs.values()).map(div => +div.style.top.split('px')[0]) ));
  this.gameDiv.style.height = (maxCardCenterY + CARD_HEIGHT / 2 + SPACING_SMALL) + 'px';
  // const maxCardCenterY = Math.max(...( Array.from(this.cardDivs.values()).map(div => +div.style.top.split('vw')[0]) ));
  // this.gameDiv.style.height = (maxCardCenterY + CARD_HEIGHT / 2 + SPACING_SMALL) + 'vw';
}

}