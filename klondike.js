// Импортируем необходимые классы и константы из других файлов
import { GameStatus } from './game.js?v=1.0.8';
import { CardGameCore, CardGameUI, SPACING_SMALL, SPACING_MEDIUM, SPACING_BIG} from './cards.js?v=1.0.8';

let i =0;



let autoVisible = 1;
let stockCurrent = 1;
let checkFirstTry =0;


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
  deal() {
    this.moveCards(this._allCards, 'stock', false); // Перемещаем все карты в сток
    // document.getElementById('new-game-button').innerHTML = "Test 0";
    for(let i=0;i<52;i++){ // актуализация индекса карты
      let sourceArray = this.placeIdToCardArray[this._allCards[i].p];
      this._allCards[i].in = sourceArray.indexOf(this._allCards[i]);
    }
    if(checkFirstTry == 0){
      console.log('get start');
      window.Telegram.WebApp.CloudStorage.getItem("saveCard", (err, storedValue) => {
        // let storedValue = localStorage.getItem("saveCard");
        if (storedValue === null || storedValue === undefined || storedValue === "") {
          console.log('get empty');
          for (let i = 0; i < 7; i++) {
            const howManyCardsToMove = i + 1;
            const cardsToMove = this.placeIdToCardArray.stock.splice(-howManyCardsToMove); // Извлекаем нужное количество карт из стока
            this.moveCards(cardsToMove, 'tableau' + i); // Перемещаем их на соответствующее место стола
            cardsToMove[cardsToMove.length - 1].visible = true; // Открываем последнюю карту в каждом столбц
          }
          return; // Exit if there's an error
        }else{
          console.log('get good');
          storedValue = JSON.parse(storedValue);
          // console.table(storedValue);
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
        }
        this.indexStart();
      });
    } else{
      console.log('normal start');
      for (let i = 0; i < 7; i++) {
        const howManyCardsToMove = i + 1;
        const cardsToMove = this.placeIdToCardArray.stock.splice(-howManyCardsToMove); // Извлекаем нужное количество карт из стока
        this.moveCards(cardsToMove, 'tableau' + i); // Перемещаем их на соответствующее место стола
        cardsToMove[cardsToMove.length - 1].visible = true; // Открываем последнюю карту в каждом столбц
      }
    }
    checkFirstTry++;

      //  //  // делает видимыми карты
      // let sourcePlaceIdUltimate ='tableau';
      // let f = 1;
      // let sourcePlaceId = sourcePlaceIdUltimate + i;
      // let sourceArray = this.placeIdToCardArray[sourcePlaceId];
      // while (f <= sourceArray.length) {
      //   cardsToMove[cardsToMove.length - f].visible = true;
      //     f++;
      // }
    // }

    // делает видимыми колоду
    // let ccardsToMove = this.placeIdToCardArray.stock; // Извлекаем нужное количество карт из стока
    // let f=1;
    // while (f <= ccardsToMove.length) {
    //   ccardsToMove[ccardsToMove.length - f].visible = true;
    //     f++;
    // }
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
      testcheck = window.Telegram.WebApp.platform;
      if(testcheck == "tdesktop"){
        this.currentGame.stockToDiscard(); // Перемещаем карты из стока в сброс
      }else{
        if(this.currentGame.placeIdToCardArray.discard.length === 0){
          if(stockCurrent === 1){
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

  // const tg = window.Telegram.WebApp;
  // tg.expand();
  // tg.disableVerticalSwipes();
  // console.log(tg.isFullscreen); 

    // tg.requestFullscreen();
    // console.log(tg.isFullscreen); 
  const gameDiv = document.getElementById('game'); // Находим элемент для игрового поля
  const newGameButton = document.getElementById('new-game-button'); // Находим кнопку для новой игры
  const backButton = document.getElementById('back-button'); // шаг назад
  const autoButton = document.getElementById('check-autocomplete-button'); // шаг назад
  let PickInput = 1;
  const ui = new KlondikeUI(gameDiv); // Создаем новый экземпляр UI игры
  ui.newGame(+PickInput); // Запускаем новую игру с количеством карт из pickInput
  newGameButton.addEventListener('click', () => ui.newGame(+PickInput)); // Обрабатываем клик по кнопке для новой игры
  backButton.addEventListener('click', () => ui.backButton()); // Обрабатываем клик по кнопке для возврата назад
  autoButton.addEventListener('click', () => ui.autoButton());
});
