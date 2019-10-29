var GameEngine = new Class({
   initialize: function() {
   },

   setUp: function(auto0, auto1, speed) {
      this.cleanUpScreen();
      this.player = [new Deck(0, auto0), new Deck(1, auto1)];
      this.field = new Battlefield();
      this.dropsTillBattle = 0;      
      this.flipsTillMove = 0;
      this.movesTillTurn = 0;
      this.gameWinner = -1; //-1 means no one has won yet.
      this.battleWinner = -1;
      this.inWar = false;
      this.speed = speed;

      this.setDecks();
      this.nextTurn();
   },

   setDecks: function() {
      this.player[0].fill();
      this.player[0].shuffle();
      for (var count = 0; count < 26; count++) {
         this.player[1].push(this.player[0].shift());
      }
   },

   nextTurn: function() {
      this.gameWinner = this.checkForEndGame();
      if (this.gameWinner == -1) {
         for (var p = 0; p < 2; p++) {
            this.dropsTillBattle++;
            this.player[p].nextCard();
         }
      } else {
         this.endGame();
      }
   },

   battle: function() {
      this.battleWinner = this.field.battle();

      if (this.battleWinner >= 0) {
         this.field.flipTops();
         if (this.inWar) {
            this.flipField.delay(700 * this.speed, this);
         }
         this.inWar = false;
      } else {
         this.field.flipTops();
         this.war();
      }
   },

   checkForEndGame: function() {
      if (this.player[0].score == 0 && this.player[1].score == 0) {
         return 2; //Tie game!
      }
      for (var p = 0; p < 2; p++) {
         if (this.player[p].score == 52) {
            this.player[p].score = 0;
            return p;
         }
      }
      return -1;
   },

   war: function() {
      this.inWar = true;
      var num;

      for (var p = 0; p < 2; p++) {
         num = Math.min(4, this.player[p].score);
         for (var c = 0; c < num; c++) {
            this.dropsTillBattle++;
            if (this.player[p].auto) {
               this.player[p].nextCard();
            }
         }
         if (!this.player[p].auto) {
            this.player[p].nextCard();
         }
      }
      if (this.dropsTillBattle == 0) {
         this.gameWinner = 2;
         this.endGame();
      }
   },

   flipField: function() {
      var card;

      for (var p  = 0; p < 2; p++) {
         for (var c = 0; c < this.field.stack[p].length; c++) {
            card = this.field.stack[p][c];
            if (!card.flipped) {
               this.flipCard(card);
            }
         }
      }
   },

   flipCard: function(card) {
      var front = card.front;

      front.el.inject(document.body);
      front.el.position({ relativeTo: card.el });
      front.el.style.opacity = 0;
      front.el.style.visibility = 'visible';

      front.fadeIn(700);
      card.flipped = true;
      card.fadeOut(700, function() {
         game.cardFlipped();
         card.kill();
         card.el = front.el;
      });
   },
      
   cardDropped: function() {
      this.dropsTillBattle--;
      if (this.dropsTillBattle == 0) {
         this.battle();
      }
   },

   cardFlipped: function() {
      this.flipsTillMove--;
      if (this.flipsTillMove == 0) {
         var give = function() {
            this.giveCards(this.player[this.battleWinner]);
         }
         give.delay(300 * this.speed, this);
      }
   },

   cardMoved: function() {
      this.movesTillTurn--;
      if (this.movesTillTurn == 0) {
         this.nextTurn();
      }
   },

   giveCards: function(deck) {
      var card;

      this.movesTillTurn = this.field.size();
      while(!this.field.empty()) {
         card = this.field.remove();
         card.deck = deck;
         card.backToDeck(200, function(card) {
            game.cardMoved();
            card.el.src = "images/back.png";
            card.kill();
         }); 
         deck.push(card);
      }
   },

   endGame: function() {
      if (this.gameWinner == 2) {
         var tie = this.makeBanner($('mainDiv'));
         tie.src = "images/tie.png";
         tie.fade.start({'opacity': [0, 1]});

         this.showNewGame();
      } else {
         var win = this.makeBanner(this.player[this.gameWinner].el);
         var lose = this.makeBanner(this.player[1 - this.gameWinner].el);
         
         win.src = "images/winner.png";
         lose.src = "images/loser.png";
         win.fade.start({'opacity': [0, 1]});
         lose.fade.start({'opacity': [0, 1]});
         this.showNewGame();
      }
   },

   makeBanner: function(pos) {
      var banner = new Element('img');
      banner.style.opacity= 0;
      banner.style.width = "300px";
      banner.style.height = "100px";
      banner.style.zIndex = 100;
      banner.addClass('banner');
      banner.inject(document.body);
      banner.position({
         relativeTo: pos,
         position: 'center',
         edge: 'center'
      });
      banner.fade = new Fx.Morph(banner, {
         duration: 700
      });
      
      return banner;
   },

   showNewGame: function() {
      var buttons = $('buttons');
      buttons.style.display = 'block';
   },
   
   cleanUpScreen: function() {
      var buttons = $('buttons');
      buttons.style.display = 'none';
      
      var cards = $$('.card');
      cards.each(function(item) {
         item.dispose();
      });

      var scores = $$('.score');
      scores.each(function(item) {
         item.dispose();
      });

      var banners = $$('.banner');
      banners.each(function(item) {
         item.dispose();
      });

      var decks = $$('.deck');
      decks.each(function(item) {
         item.dispose();
      });
   },

   downloadImages: function() {
      var images = [];
      var valueList = ['2', '3', '4', '5', '6' ,'7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
      var suitList = ['C', 'D', 'H', 'S'];

      images.push ("images/back.png");
      for (var v = 0; v < 14; v++) {
         for (var s = 0; s < 4; s++) {
            images.push("images/" + suitList[s] + valueList[v] + ".png");
         }
      }
      var preLoaded = new Asset.images(images);
   }
});
