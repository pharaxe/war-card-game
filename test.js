var GameEngine = new Class({
   initialize: function() {
      this.player = [new Deck(), new Deck()];
      this.field = new Battlefield();
      this.dropsTillBattle = 0;      
      this.gameWinner = -1; //-1 means no one has won yet.
      this.battleWinner = -1;
      this.auto = false; //Only used in test version.

      this.setDecks();
      this.nextTurn();
   },

   setDecks: function() {
      this.player[0].fill();
      this.player[0].shuffle();
      for (var num = 0; num < 26; num++) {
         this.player[1].push(this.player[0].shift());
      }
   },

   cardDropped: function() {
      this.dropsTillBattle--;
      if (this.dropsTillBattle == 0) {
         this.battleWinner = this.battle();
      }
   },

   battle: function() {
      var winnerNum;

      winnerNum = this.field.battle();
      if (winnerNum >= 0) {
         this.field.giveCards(this.player[winnerNum]);
         this.checkForWinner();
         this.nextTurn();
      } else {
         if (this.player[0].empty() && this.player[1].empty()) {
            this.gameWinner = 2; //Draw game!
         }
         this.war();
      }
      return winnerNum;
   },

   checkForWinner: function() {
      for (var p = 0; p < 2; p++) {
         if (this.player[p].cardsLeft() == 52) {
            this.gameWinner = p;
         }
      }
   },

   war: function() {
      var p, cards;
      
      for (p = 0; p < 2; p++) {
         for (cards = 0; cards < 4; cards++) {           
            if (!this.player[p].empty()) {
               this.field.push(this.player[p].shift(), p);
               this.dropsTillBattle++;
            }
         }
      }
   },
      
   nextTurn: function() {
      for (var p = 0; p < 2; p++) {
         this.field.push(this.player[p].shift(), p);
         this.dropsTillBattle++;
      }
   },

   //The following functions are only for test purposes.
   print: function() {
      var text;
      var p1 = document.getElementById('player1');
      var p2 = document.getElementById('player2');
      var s1 = document.getElementById('stack1');
      var s2 = document.getElementById('stack2');
      var span = document.getElementById('drop');
         
      span.innerHTML = "dropsLeft: " + this.dropsTillBattle + ", &nbsp &nbsp gameWinner: " + this.gameWinner;
      p1.innerHTML = this.player[0].print();
      s1.innerHTML = this.field.print(0);
      p2.innerHTML = this.player[1].print();
      s2.innerHTML = this.field.print(1);
   },

   toggleAuto: function(checked) {
      this.auto = checked;
      this.automate();
   },

   automate: function() {
      if (this.auto && this.gameWinner == -1) {
         this.cardDropped();
         this.print();   
         window.setTimeout('game.automate()', 10); 
      }
   },

   skip: function() {
      var check = document.getElementById('check');
      var num;
      this.auto = false;
      check.checked = false;

      for (num = 0; num < 100; num++) {
         if (this.gameWinner < 0) {
            game.cardDropped();
         }
      }
      this.print();
   }
});

var Battlefield = new Class({
   initialize: function() {
      this.stack = [[], []];
   },

   giveCards: function(deck) {
      var combinedStack = [];
      var p;
      var rand;

      for (p = 0; p < 2; p++) {
         while(this.stack[p].length > 0) {
            combinedStack.push(this.stack[p].shift());
         }
      }

      while (combinedStack.length > 0) {
         rand = $random(0, combinedStack.length - 1);
         deck.push(combinedStack[rand]);
         combinedStack.splice(rand, 1);
      }
   },

   shift: function(player) {
      return this.stack[player].shift();
   },
      
   push: function(card, player) {
      this.stack[player].push(card);
   },

   battle: function() {
      var first = this.stack[0][this.stack[0].length - 1];
      var second = this.stack[1][this.stack[1].length - 1];

      return first.compare(second);
   },
   
   print: function(s) {
      var text = "";

      for (var c = 0; c < this.stack[s].length; c++) {
         text += this.stack[s][c].print();
      }
      return text;
   }
});

var Deck = new Class({
   initialize: function() {
      this.cards = [];
   },

   fill: function() {
      var ndx = 0;
      var s;
      var v;

      for (s = 0; s < 4; s++) {
         for (v = 0; v < 13; v++) {
            this.cards[ndx] = new Card(v, s);
            ndx++;
         }
      }
   },

   shuffle: function() {
      var shuffledCards = [];
      var rand = 0;
      
      while(this.cards.length > 0) {
         rand = $random(0, this.cards.length - 1);
         shuffledCards.push(this.cards[rand]);
         this.cards.splice(rand, 1);
      } 

      this.cards = shuffledCards;
    },

   shift: function() {
      return this.cards.shift();
   },   

   push: function(card) {
      this.cards.push(card);
   },

   empty: function() {
      return this.cards.length == 0;
   },

   cardsLeft: function() {
      return this.cards.length;
   },

   //
   print: function() {
      var text;

      text = "cards: " + this.cards.length + "\n\n";
      this.cards.each(function(card) {
         text += card.print();  
      });
      return text;
   }
});
        
var Card = new Class({
   initialize: function(value, suit) {
      var valueList = ['2', '3', '4', '5', '6' ,'7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
      var suitList = ['C', 'D', 'H', 'S'];

      this.value = value;
      this.name = suitList[suit] + valueList[value];
   },

   compare: function(other) {
      if (this.value > other.value) {
         return 0;
      }   
      if (this.value < other.value) {
         return 1;
      }
      return -1;
   },

   print: function() {
      return this.name +  "\n";
   }
});
