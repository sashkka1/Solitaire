let game_version = '1.30.9';

import { GameStatus } from './game.js?v=1.30.9';
import { CardGameCore, CardGameUI, SPACING_SMALL, SPACING_MEDIUM, SPACING_BIG} from './cards.js?v=1.30.9';

let i =0;


// переменные для user properties
// let ux_language = window.Telegram.WebApp.initDataUnsafe.user.language_code; // Язык интерфейса
// let ux_color = window.Telegram.WebApp.colorScheme; // Цветовая схема
// let tg_id = window.Telegram.WebApp.initDataUnsafe.user.id; // Айди
// let tg_username = window.Telegram.WebApp.initDataUnsafe.user.username; // Юзернейм
// let tg_platform = window.Telegram.WebApp.platform; // Платформа
// let is_premium_user = window.Telegram.WebApp.initDataUnsafe.user.is_premium; // Премиум или бесплатный (true/false)
// let is_real_user = window.Telegram.WebApp.initDataUnsafe.user.is_bot; // Бот или реальный пользователь (true/false)
// let uis_attached = window.Telegram.WebApp.added_to_attachment_menu; // Добавил пользователь бота в прикрепленное меню или нет (true/false)

let a=0, bb = 1, c=2, d=4, b=3;
// window.dataLayer = window.dataLayer || [];
// dataLayer.push({
//   'event': 'user_properties',
//   'ux_language': 'ux_language',
//   'ux_color': 'ux_color',
//   'tg_id': 'tg_id',
//   'tg_username': 'tg_username',
//   'tg_platform': 'tg_platform',
//   'is_premium_user': 'is_premium_user',
//   'is_real_user': 'is_real_user',
//   'uis_attached': 'uis_attached',
// });
// gtag('event', 'user_properties', {
//     'ux_language': a,
//     'ux_color': b,
//     'tg_id': c,
//     'tg_username': d,
//     'tg_platform': bb,
//     'is_premium_user': a,
//     'is_real_user': c,
//     'uis_attached': d,
//   });
let ux_language = 'language';
let ux_color = 'color';
let tg_id = 123512323;
let tg_username = 'username';
let tg_platform = 'platform';
let is_premium_user = 'premium_user';
let is_real_user = 'real_user';
let uis_attached = 'attached';

function getux_language(){
  return ux_language;
}
// dataLayer.push({
//   'event': 'level_start',
//   'tg_username': 'username',
//   'is_premium_user': 'premium_user'
// });

let autoVisible = 1; // использую для проверки на автоматическое заполнение
let stockCurrent = 1;
let checkFirstTry =0; // Для понимания первый ли расклад карт, для проверки на возврат из тг клауд
let gameIsStart = 0; // Для трекинга изменений


let simpleArray1= [
  [false,"stock",24,0],[false,"stock",16,1],[false,"stock",23,2],[false,"stock",32,3],[false,"stock",13,4],[false,"stock",45,5],[false,"stock",25,6],[false,"stock",49,7],[false,"stock",11,8],[false,"stock",41,9],[false,"stock",12,10],[false,"stock",21,11],[false,"stock",43,12],[false,"stock",27,13],[false,"stock",44,14],[false,"stock",5,15],[false,"stock",6,16],[false,"stock",3,17],[false,"stock",42,18],[false,"stock",4,19],[false,"stock",51,20],[false,"stock",40,21],[false,"stock",17,22],[false,"stock",30,23],[false,"tableau6",31,0],[false,"tableau6",28,1],[false,"tableau6",14,2],[false,"tableau6",7,3],[false,"tableau6",47,4],[false,"tableau6",10,5],[true,"tableau6",18,6],[false,"tableau5",39,0],[false,"tableau5",2,1],[false,"tableau5",1,2],[false,"tableau5",20,3],[false,"tableau5",29,4],[true,"tableau5",48,5],[false,"tableau4",15,0],[false,"tableau4",33,1],[false,"tableau4",37,2],[false,"tableau4",34,3],[true,"tableau4",8,4],[false,"tableau3",50,0],[false,"tableau3",9,1],[false,"tableau3",35,2],[true,"tableau3",36,3],[false,"tableau2",22,0],[false,"tableau2",46,1],[true,"tableau2",52,2],[false,"tableau1",26,0],[true,"tableau1",19,1],[true,"tableau0",38,0]
];
let simpleArray2= [
  [false,"stock",2,0],[false,"stock",5,1],[false,"stock",7,2],[false,"stock",13,3],[false,"stock",31,4],[false,"stock",34,5],[false,"stock",12,6],[false,"stock",19,7],[false,"stock",42,8],[false,"stock",43,9],[false,"stock",44,10],[false,"stock",33,11],[false,"stock",36,12],[false,"stock",50,13],[false,"stock",18,14],[false,"stock",9,15],[false,"stock",38,16],[false,"stock",21,17],[false,"stock",41,18],[false,"stock",28,19],[false,"stock",47,20],[false,"stock",11,21],[false,"stock",26,22],[false,"stock",51,23],[false,"tableau6",32,0],[false,"tableau6",8,1],[false,"tableau6",17,2],[false,"tableau6",15,3],[false,"tableau6",40,4],[false,"tableau6",16,5],[true,"tableau6",49,6],[false,"tableau5",22,0],[false,"tableau5",10,1],[false,"tableau5",35,2],[false,"tableau5",3,3],[false,"tableau5",4,4],[true,"tableau5",48,5],[false,"tableau4",1,0],[false,"tableau4",46,1],[false,"tableau4",52,2],[false,"tableau4",6,3],[true,"tableau4",20,4],[false,"tableau3",23,0],[false,"tableau3",37,1],[false,"tableau3",45,2],[true,"tableau3",30,3],[false,"tableau2",24,0],[false,"tableau2",29,1],[true,"tableau2",27,2],[false,"tableau1",39,0],[true,"tableau1",14,1],[true,"tableau0",25,0]
];
let simpleArray3= [
  [false,"stock",40,0],[false,"stock",15,1],[false,"stock",35,2],[false,"stock",29,3],[false,"stock",47,4],[false,"stock",16,5],[false,"stock",30,6],[false,"stock",52,7],[false,"stock",37,8],[false,"stock",4,9],[false,"stock",21,10],[false,"stock",11,11],[false,"stock",50,12],[false,"stock",44,13],[false,"stock",41,14],[false,"stock",14,15],[false,"stock",17,16],[false,"stock",19,17],[false,"stock",7,18],[false,"stock",22,19],[false,"stock",28,20],[false,"stock",6,21],[false,"stock",26,22],[false,"stock",45,23],[false,"tableau6",31,0],[false,"tableau6",38,1],[false,"tableau6",2,2],[false,"tableau6",18,3],[false,"tableau6",39,4],[false,"tableau6",3,5],[true,"tableau6",1,6],[false,"tableau5",8,0],[false,"tableau5",24,1],[false,"tableau5",12,2],[false,"tableau5",46,3],[false,"tableau5",33,4],[true,"tableau5",13,5],[false,"tableau4",43,0],[false,"tableau4",27,1],[false,"tableau4",25,2],[false,"tableau4",34,3],[true,"tableau4",5,4],[false,"tableau3",23,0],[false,"tableau3",36,1],[false,"tableau3",32,2],[true,"tableau3",49,3],[false,"tableau2",20,0],[false,"tableau2",42,1],[true,"tableau2",10,2],[false,"tableau1",9,0],[true,"tableau1",51,1],[true,"tableau0",48,0]
];
let simpleArray4= [
  [false,"stock",13,0],[false,"stock",49,1],[false,"stock",23,2],[false,"stock",11,3],[false,"stock",7,4],[false,"stock",37,5],[false,"stock",48,6],[false,"stock",6,7],[false,"stock",28,8],[false,"stock",46,9],[false,"stock",40,10],[false,"stock",3,11],[false,"stock",35,12],[false,"stock",51,13],[false,"stock",22,14],[false,"stock",34,15],[false,"stock",10,16],[false,"stock",19,17],[false,"stock",31,18],[false,"stock",45,19],[false,"stock",47,20],[false,"stock",27,21],[false,"stock",30,22],[false,"stock",4,23],[false,"tableau6",21,0],[false,"tableau6",1,1],[false,"tableau6",8,2],[false,"tableau6",36,3],[false,"tableau6",33,4],[false,"tableau6",16,5],[true,"tableau6",41,6],[false,"tableau5",15,0],[false,"tableau5",24,1],[false,"tableau5",42,2],[false,"tableau5",2,3],[false,"tableau5",18,4],[true,"tableau5",52,5],[false,"tableau4",26,0],[false,"tableau4",29,1],[false,"tableau4",17,2],[false,"tableau4",32,3],[true,"tableau4",50,4],[false,"tableau3",38,0],[false,"tableau3",25,1],[false,"tableau3",14,2],[true,"tableau3",20,3],[false,"tableau2",9,0],[false,"tableau2",5,1],[true,"tableau2",39,2],[false,"tableau1",12,0],[true,"tableau1",44,1],[true,"tableau0",43,0]
];
let simpleArray5= [
  [false,"stock",9,0],[false,"stock",17,1],[false,"stock",14,2],[false,"stock",4,3],[false,"stock",10,4],[false,"stock",18,5],[false,"stock",51,6],[false,"stock",29,7],[false,"stock",22,8],[false,"stock",38,9],[false,"stock",7,10],[false,"stock",41,11],[false,"stock",8,12],[false,"stock",16,13],[false,"stock",47,14],[false,"stock",28,15],[false,"stock",42,16],[false,"stock",45,17],[false,"stock",49,18],[false,"stock",44,19],[false,"stock",31,20],[false,"stock",48,21],[false,"stock",24,22],[false,"stock",37,23],[false,"tableau6",12,0],[false,"tableau6",34,1],[false,"tableau6",36,2],[false,"tableau6",52,3],[false,"tableau6",1,4],[false,"tableau6",50,5],[true,"tableau6",6,6],[false,"tableau5",32,0],[false,"tableau5",2,1],[false,"tableau5",15,2],[false,"tableau5",5,3],[false,"tableau5",23,4],[true,"tableau5",27,5],[false,"tableau4",25,0],[false,"tableau4",26,1],[false,"tableau4",3,2],[false,"tableau4",20,3],[true,"tableau4",30,4],[false,"tableau3",21,0],[false,"tableau3",19,1],[false,"tableau3",35,2],[true,"tableau3",46,3],[false,"tableau2",39,0],[false,"tableau2",40,1],[true,"tableau2",11,2],[false,"tableau1",13,0],[true,"tableau1",43,1],[true,"tableau0",33,0]
];




// Создаем класс ядра игры для пасьянса Клондайк, наследуя CardGameCore
class KlondikeCore extends CardGameCore {

  // Метод возвращает массив строк, определяющий расположение карт
  static getCardPlaceStrings() {
    return [
      // "stock discard - foundation foundation foundation foundation", // Сток, сброс, четыре ячейки фундамента
      "foundation foundation foundation foundation - discard stock", // Сток, сброс, четыре ячейки фундамента
      "tableau tableau tableau tableau tableau tableau tableau",      // Семь ячеек игрового стола
    ];
  }

  // Конструктор класса, принимает все карты и количество карт для выбора
  constructor(allCards, pickCount) {
    super(allCards);
    this._pickCount = pickCount;  // Сколько карт можно взять за раз
    this._currentlyPicked = 0;    // Счетчик текущего количества взятых карт
  }

  // Метод проверяет, выиграна ли игра (все карты на местах фундамента)
  checkWin() {
    const foundationArrays = this.constructor.getCardPlaces().kindToPlaceIds.foundation.map(id => this.placeIdToCardArray[id]);
    return foundationArrays.every(cardArray => (cardArray.length === 13)); // Проверка, есть ли 13 карт в каждой стопке фундамента
  }
  // Метод распределения карт при начале игры

  convertAndOutput(storedValue){

    this.moveCards(this._allCards, 'stock', false);
    for(let i=0;i<52;i++){ // упорядочивание элементов в массиве по убыванию для того чтобы корректно дальше выводил
      let j=i;
      for(j;j<52;j++){
        if(storedValue[i][1] == storedValue[j][1] && storedValue[i][3] > storedValue[j][3]){
          let a = storedValue[j];
          storedValue[j] = storedValue[i];
          storedValue[i] = a;
          j=i;
        }
      }
    }

    for(let i=0;i<52;i++){ // непосредственно разложение карт после получения и изменения данных карт на новые
      let j=0;
      for(j;j<52;j++){
        let sourceArray = this.placeIdToCardArray['stock'];
        this._allCards[j].in = sourceArray.indexOf(this._allCards[j]);
        if(storedValue[i][2] == this._allCards[j].i){
          this.rawMoveForGet(this._allCards[j], 'stock',storedValue[i][1]);
          this._allCards[j].in = storedValue[i][3];
          if( storedValue[i][0] == true){this._allCards[j].visible = true }
        }
      }
    }

    let b=[];
    let f=0;
    for(let i=0;i<this._allCards.length;i++){// преобразование в массив для сохранение в облако 
      if( this._allCards[i].v == true){this._allCards[i].visible = true }
      let a = [this._allCards[i].v, this._allCards[i].p, this._allCards[i].i, this._allCards[i].in];
      b[f] = a;
      f++;
    }

    for(let i =0;i<7;i++){ // после разложения проверка на возможность автокомплита
      let sourceArray = this.placeIdToCardArray['tableau' + i];
      if(sourceArray.length>0){
        if(sourceArray[0].visible == false){
          autoVisible = 0;
        }
      }
    }
    if(autoVisible == 1){
      let block = document.getElementById('check-autocomplete-button');
      block.classList.add('normal-auto');
    }
    autoVisible = 1;
    for(let i=0;i<52;i++){ // актуализация индекса карты
      let sourceArray = this.placeIdToCardArray[this._allCards[i].p];
      this._allCards[i].in = sourceArray.indexOf(this._allCards[i]);
    }
  }

  normalStart(){
    this.moveCards(this._allCards, 'stock', false);
    for (let i = 0; i < 7; i++) {
      const howManyCardsToMove = i + 1;
      const cardsToMove = this.placeIdToCardArray.stock.splice(-howManyCardsToMove); // Извлекаем нужное количество карт из стока
      this.moveCards(cardsToMove, 'tableau' + i); // Перемещаем их на соответствующее место стола
      cardsToMove[cardsToMove.length - 1].visible = true; // Открываем последнюю карту в каждом столбц
    }
  }

  firstFiveStart(count){
    // console.log('firstFiveStart(count){');
    if (count === null || count === undefined || count === "") {
      count=1;
    }else{
      count++;
    }
    // window.Telegram.WebApp.CloudStorage.setItem("countTry", count);
    localStorage.setItem("countTry", count);
    switch(count){
      case 1: 
        this.convertAndOutput(simpleArray1);
      break;
      case 2: 
        this.convertAndOutput(simpleArray2);
      break;
      case 3: 
        this.convertAndOutput(simpleArray3);
      break;
      case 4: 
        this.convertAndOutput(simpleArray4);
      break;
      case 5: 
        this.convertAndOutput(simpleArray5);
      break;
      default:
        this.normalStart();
      break;
    }

    // this.normalStart();
  }

  actualGameStart(one){ // для понимания были ли изменения
    gameIsStart = one;
  }

  deal() {
    // console.log('deal() {');
    // document.getElementById('new-game-button').innerHTML = "Test 6";

    let occurrence_time_local = new Date(); // Старт новой игры Отправлять всегда при старте новой игры
    let occurrence_time_utc0 = new Date().toISOString();
    gtag('event', 'level_start', {
      'occurrence_time_local': occurrence_time_local,
      'occurrence_time_utc0': occurrence_time_utc0,
      'game_version': game_version,
    });

    // window.Telegram.WebApp.CloudStorage.getItem("countTry", (err, count) => {
      let count = localStorage.getItem("countTry");
      if(checkFirstTry == 0){
        // window.Telegram.WebApp.CloudStorage.getItem("saveCard", (err, storedValue) => {
          let storedValue = localStorage.getItem("saveCard");
          // console.table(storedValue);
          if (storedValue === null || storedValue === undefined || storedValue === "") {
            console.log('get empty');
            this.firstFiveStart(count);
          }else{
            console.log('get good');
            storedValue = JSON.parse(storedValue);
            // console.log('То что получили');
            // console.table(storedValue);
            this.convertAndOutput(storedValue);
            this.indexStart();
            let buttonBack = document.getElementById('back-button');
            buttonBack.classList.add('lock');
          }
        // });
      } else{
        this.firstFiveStart(count);
      }

      // console.log('То что в итоге вывели');
      // console.table(this._allCards);
      if(count >9){
        // window.Telegram.WebApp.CloudStorage.removeItem("countTry");
        localStorage.removeItem("countTry");
      }

      checkFirstTry++;
    // });

    let buttonBack = document.getElementById('back-button');
    buttonBack.classList.add('lock');
  }

  // Проверяет, можно ли потенциально переместить карту из указанного места
  canMaybeMoveSomewhere(card, sourcePlaceId) {
    if (sourcePlaceId === 'stock') {
      return false; // Карты из стока не перемещаются напрямую (управляется в stockToDiscar)
    }
    if (sourcePlaceId === 'discard' || sourcePlaceId.startsWith('foundation')) {
      const cardArray = this.placeIdToCardArray[sourcePlaceId];
      return (card === cardArray[cardArray.length - 1]); // Перемещать можно только верхнюю карту
    }
    if (sourcePlaceId.startsWith('tableau')) {
      return card.visible; // В tableau перемещать можно только видимые карты
    }
    throw new Error("unknown card place id: " + sourcePlaceId); // Ошибка, если ID места неизвестен
  }

  // Проверяет, находится ли карта в tableau
  _cardInSomeTableau(card) {
    const tableauArrays = this.constructor.getCardPlaces().kindToPlaceIds.tableau.map(id => this.placeIdToCardArray[id]);
    return tableauArrays.some(subArray => subArray.includes(card));
  }

  // Проверяет, можно ли переместить карту из одного места в другое
  canMove(card, sourcePlaceId, destPlaceId) {

    const sourceArray = this.placeIdToCardArray[sourcePlaceId];
    const destArray = this.placeIdToCardArray[destPlaceId];

    const sourceArrayIndex = sourceArray.indexOf(card);
    if (sourceArrayIndex < 0) {
      throw new Error("card and sourcePlaceId don't match"); // Ошибка, если карта не найдена в исходном месте
    }
    const isTopmost = (sourceArrayIndex === sourceArray.length - 1); // Проверка, является ли карта верхней

    if (isTopmost) {
      if (destPlaceId === 'stock' || destPlaceId === 'discard' || !card.visible) {
        return false; // Нельзя перемещать невидимые карты или карты в сток/сброс
      }
      if (destPlaceId.startsWith('foundation')) {
        if (destArray.length === 0) {
          return (card.number === 1); // На пустой foundation можно переместить только туза
        }
        const topmostCard = destArray[destArray.length - 1];
        return (card.suit === topmostCard.suit && card.number === topmostCard.number + 1); // Только карты той же масти и на единицу больше
      }
    } else {
      if (!( sourcePlaceId.startsWith('tableau') && destPlaceId.startsWith('tableau') && card.visible )) {
        return false; // В stack перемещать можно только из tableau в tableau и если карта видимая
      }
    }

    if (!destPlaceId.startsWith('tableau')) {
      throw new Error("bug"); // Ошибка, если место назначения не tableau
    }
    if (destArray.length === 0) {
      return (card.number === 13); // На пустой tableau можно положить только короля
    }
    const topmostCard = destArray[destArray.length - 1];
    return (card.suit.color !== topmostCard.suit.color && card.number === topmostCard.number - 1); // Цвета мастей должны отличаться, номер меньше на 1
  }


  rawMoveForGet(card, sourcePlaceId, destPlaceId) { // переопределение rawMove для реализации разложения полученных из тг клаудстор карт
    super.rawMoveForGet(card, sourcePlaceId, destPlaceId);
    if(autoVisible == 0){
      let block = document.getElementById('check-autocomplete-button');
      block.classList.add('normal-auto');
    }
  }

  // Перемещает карту без дополнительных проверок
  rawMove(card, sourcePlaceId, destPlaceId) {
    super.rawMove(card, sourcePlaceId, destPlaceId);
    const sourceArray = this.placeIdToCardArray[sourcePlaceId];
    if (sourcePlaceId.startsWith('tableau') && sourceArray.length !== 0) {
      sourceArray[sourceArray.length - 1].visible = true; // Открывает верхнюю карту в tableau, если она закрыта

      let a=0;
      // реализация понимания того есть ли открытые карты на доске
      let sourcePlaceIdUltimate ='tableau';
      for(let i =0;i<7;i++){
        let f = 1;
        sourcePlaceId = sourcePlaceIdUltimate + i;
        let sourceArray = this.placeIdToCardArray[sourcePlaceId];
        while (f <= sourceArray.length) {
            if(sourceArray[sourceArray.length - f].visible == false){
              a++;
            }
            f++;
        }
      }
      if(a == 0){
        autoVisible = 0;
      }
      a=0;
      
    }
    if(autoVisible == 0){
      let block = document.getElementById('check-autocomplete-button');
      block.classList.add('normal-auto');
    }
  }

  // Перемещает карты из стока в сброс или возвращает все карты из сброса в сток
  stockToDiscard() {
    if (this.placeIdToCardArray.stock.length === 0) {
      for (const card of this.placeIdToCardArray.discard) {
        card.visible = false; // Закрываем все карты в сбросе
      }
      stockCurrent = 0;
      this.moveCards(this.placeIdToCardArray.discard, 'stock'); // Перемещаем карты обратно в сток
      this.placeIdToCardArray.discard.length = 0; // Очищаем сброс
    } else {
      const cardArray = this.placeIdToCardArray.stock.splice(0, this._pickCount); // Берем указанное количество карт из стока
      this.moveCards(cardArray, 'discard'); // Перемещаем их в сброс
      for (const card of cardArray) {
        card.visible = true; // Открываем каждую карту
      }
    }
  }

  // Перемещает карту в foundation, если это возможно
  moveCardToAnyFoundationIfPossible(card, sourcePlaceId) {
    for (const foundationId of this.constructor.getCardPlaces().kindToPlaceIds.foundation) {
      if (this.canMove(card, sourcePlaceId, foundationId)) {
        this.move(card, sourcePlaceId, foundationId);
        return true;
      }
    }
    return false;
  }

  // Перемещает все карты в foundation, если это возможно
  moveAnyCardToAnyFoundationIfPossible() {
    autoVisible = 1;
    for ( const id of this.constructor.getCardPlaces().kindToPlaceIds.tableau.concat(['discard']) ) {
      const array = this.placeIdToCardArray[id];
      if (array.length !== 0 && this.moveCardToAnyFoundationIfPossible(array[array.length - 1], id)) {
        return true;
      }
    }
    return false;
  }

  discardToStockAuto(){ // собирание карт в сток для автозаполнения
    for (const card of this.placeIdToCardArray.discard) {
      card.visible = false; // Закрываем все карты в сбросе
    }
    stockCurrent = 0;
    this.moveCards(this.placeIdToCardArray.discard, 'stock'); // Перемещаем карты обратно в сток
    this.placeIdToCardArray.discard.length = 0; // Очищаем сброс
  }
  
  stockToDiscardAuto() { // собирание карт в дискард для автозаполнения
    let a =1;
      const cardArray = this.placeIdToCardArray.stock.splice(0, a); // Берем указанное количество карт из стока
      this.moveCards(cardArray, 'discard'); // Перемещаем их в сброс
      for (const card of cardArray) {
        card.visible = true; // Открываем каждую карту
      }
  }

  forAuto(){ // реализация кнопки автозаполнения
    let cardsStock = this.placeIdToCardArray.stock.length;
    let cardsDiscard = this.placeIdToCardArray.discard.length;
    let card = cardsStock + cardsDiscard;
    if(card == 0){
      while( this.moveAnyCardToAnyFoundationIfPossible() ){};
    }
    for(;card !=0;){
      this.discardToStockAuto();
      cardsStock = this.placeIdToCardArray.stock.length;
      for(let i=0; i != cardsStock;i++){
        this.stockToDiscardAuto();
        while( this.moveAnyCardToAnyFoundationIfPossible() ){};
      }
      cardsStock = this.placeIdToCardArray.stock.length;
      cardsDiscard = this.placeIdToCardArray.discard.length;
      card = cardsStock + cardsDiscard;
    }
  }


  stockCurrentDefolt(){ // показывает клондайку то что игра уже началась
    stockCurrent = 1;
  }
}


// Создаем класс пользовательского интерфейса для игры в пасьянс Клондайк
class KlondikeUI extends CardGameUI {
  constructor(gameDiv) {
    super(gameDiv, KlondikeCore);
    


    // Добавляем обработчик клика на сток
    this.cardPlaceDivs.stock.addEventListener('click', () => this._onClick(null));

    // Добавляем обработчики кликов для каждой карты
    for (const [ card, div ] of this.cardDivs.entries()) {
      div.addEventListener('click', () => {
        this._onClick(card);
      });
      div.addEventListener('auxclick', () => {
        this._onAuxClick(card);
        event.stopPropagation(); // Останавливаем всплытие события, чтобы не выполнять другие обработчики
      });
    }

    // Добавляем обработчик правого клика для игровой области
    gameDiv.addEventListener('auxclick', () => this._onAuxClick(null));
  }


  // Обработка клика на сток
  _onClick(card) {
    i++;
    if (this.currentGame.status !== GameStatus.PLAYING) {
      return;
    }
    if (card === null || this.currentGame.placeIdToCardArray.stock.includes(card)) {
      let testcheck = "";
      // testcheck = window.Telegram.WebApp.platform;
      if(testcheck == "tdesktop"){
        this.currentGame.stockToDiscard(); // Перемещаем карты из стока в сброс
      }else{
        if(this.currentGame.placeIdToCardArray.discard.length === 0){
          if(stockCurrent == 1){
            this.currentGame.stockToDiscard();
          }
          stockCurrent = 1;
        }else{
          this.currentGame.stockToDiscard(); // Перемещаем карты из стока в сброс
        }
      }
    }
    let buttonBack = document.getElementById('back-button');
    buttonBack.classList.remove('lock');
  }

  // Обработка правого клика на карту или игровое поле
  _onAuxClick(card) {
    if (this.currentGame.status !== GameStatus.PLAYING) {
      return;
    }
  }

  // Получаем смещение карты при перемещении
  getNextCardOffset(card, movedCards, newPlaceId) {
    if (newPlaceId === 'discard' && movedCards.includes(card)) {
      return [SPACING_MEDIUM, 0]; // Смещение для карт в сбросе
    }
    if (newPlaceId.startsWith('tableau')) {
      return card.visible ? [0, SPACING_BIG] : [0, SPACING_SMALL]; // Смещение для видимых и невидимых карт в tableau
    }
    return [0, 0]; // Нет смещения по умолчанию
  }
}



// Запуск кода после загрузки содержимого страницы
document.addEventListener('DOMContentLoaded', () => {

  const tg = window.Telegram.WebApp;
  tg.expand();
  tg.disableVerticalSwipes();

  const gameDiv = document.getElementById('game'); // Находим элемент для игрового поля
  let PickInput = 1;
  const ui = new KlondikeUI(gameDiv); // Создаем новый экземпляр UI игры
  ui.newGame(+PickInput); // Запускаем новую игру с количеством карт из pickInput

  let backButton = document.getElementById('back-button'); // шаг назад
  backButton.addEventListener('click', () => ui.backButton()); // Обрабатываем клик по кнопке для возврата назад
  
  let autoButton = document.getElementById('check-autocomplete-button'); // шаг назад
  autoButton.addEventListener('click', () => ui.autoButton());

  let newGameButton = document.getElementById('new-game-button'); // Находим кнопку для новой игры
  newGameButton.addEventListener('click', () =>{// Обрабатываем клик по кнопке для новой игры
    if(gameIsStart == 0) {
      ui.newGame(+PickInput)
      gameIsStart=0;
    }else{
      let elements = document.getElementById("check-desire-box");
      elements.classList.add('normal');
    }
  }); 

  let newGameButtonOk = document.getElementById('check-desire-button-ok'); // Находим кнопку для новой игры
  newGameButtonOk.addEventListener('click', () =>{// Обрабатываем клик по кнопке для новой игры
    let elements = document.getElementById("check-desire-box");
    elements.classList.remove('normal');
    ui.newGame(+PickInput)
  }); 

  let newGameButtonWin = document.getElementById('win-box'); // Находим кнопку для вин скрина
  newGameButtonWin.addEventListener('click', () =>{// Обрабатываем клик по кнопке для новой игры
    ui.newGame(+PickInput)
    newGameButtonWin.classList.remove('normal-win');
  }); 


  // window.Telegram.WebApp.CloudStorage.getItem("countTryGoogle", (err, count) => {
    let count = localStorage.getItem("countTryGoogle");
    if (count === null || count === undefined || count === "") {
      let occurrence_time_local = new Date(); // Первое открытие веб вью (новый пользователь)
      let occurrence_time_utc0 = new Date().toISOString();
      gtag('event', 'first_vw_open', {
        'occurrence_time_local': occurrence_time_local,
        'occurrence_time_utc0': occurrence_time_utc0,
        'game_version': game_version,
      });
      count=1;
    }else{
      let occurrence_time_local = new Date(); // Очередное открытие веб вью (старый пользователь)
      let occurrence_time_utc0 = new Date().toISOString();
      gtag('event', 'ww_open', {
        'occurrence_time_local': occurrence_time_local,
        'occurrence_time_utc0': occurrence_time_utc0,
        'game_version': game_version,
      });
      count++;
    }
    // window.Telegram.WebApp.CloudStorage.setItem("countTryGoogle", count);
    localStorage.setItem("countTryGoogle", count);
  // });

});

window.addEventListener('beforeunload', function() {  // Закрытие веб вью
  let occurrence_time_local = new Date(); 
  let occurrence_time_utc0 = new Date().toISOString();
  gtag('event', 'ww_close', {
    'occurrence_time_local': occurrence_time_local,
    'occurrence_time_utc0': occurrence_time_utc0,
    'game_version': game_version,
  });
});



