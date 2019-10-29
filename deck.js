var Deck = new Class({
   initialize: function(player, auto) {
      this.el = new Element('img');
      this.cards = [];
      this.auto = auto;
      this.player = player;
      this.score = 26;
      this.el.src = "images/back.png";
      this.el.addClass('deck');
      this.el.setStyles({
         zIndex: 1,
         position: 'absolute',
         width: '100px',
         height: '144px',
         visibility: 'hidden'
      });
      var side;

      if (player == 0) {
         side = 'upperLeft';
      } else if (player == 1) {
         side = 'bottomRight';
      }

      this.el.inject(document.body);
      this.el.position({
         relativeTo: $('mainDiv'),
         position: side,
         edge: side
      });
      this.el.style.visibility = 'visible';
      this.createScore();
   },

   fill: function() {
      var card;

      for (var suit = 0; suit < 4; suit++) {
         for (var value = 0; value < 13; value++) {
            card = new Card(value, suit);
            this.push(card);
         }
      }
   },

   shuffle: function() {
      var shuffled = [];
      var ndx = 0;

      while(this.cards.length > 0) {
         ndx = $random(0, this.cards.length - 1);
         shuffled.push(this.cards[ndx]);
         this.cards.splice(ndx, 1);
      }
      this.cards = shuffled;
   },

   nextCard: function() {
      var card = null;
      var suit;
      var value;

      if (this.score != 0 && this.score != 52) {
         card = this.shift();
         card.deck = this;
         card.flipped = false;
         card.el.style.visibility = 'hidden';
         card.el.src = "images/back.png";
         card.el.style.zIndex = 50;
         card.el.inject(document.body); 
         card.el.position({relativeTo: this.el}); 
         card.el.style.visibility = 'visible';

         if (this.auto) {
            var autoPlay = function() {
               card.play(800);
               this.changeScore(-1);
            }
            autoPlay.delay(100, this);
         } else {
            card.allowDrag();
         }
         game.flipsTillMove++;
      }
   },

   push: function(card) {
      this.cards.push(card);   
   },

   shift: function() {
      return this.cards.shift();
   },

   createScore: function() {
      this.scoreDiv = new Element('div');

      this.scoreDiv.inject(document.body);
      this.scoreDiv.style.display = 'block';
      this.scoreDiv.style.position = 'absolute';
      this.scoreDiv.style.width = '100px';
      this.scoreDiv.style.height = '20px';
      this.scoreDiv.style.fontSize = '20px';
      this.scoreDiv.addClass("score");
      this.scoreDiv.position({
         relativeTo: this.el,
         position: 'upperCenter',
         edge: 'bottomCenter'
      });
      this.changeScore(0);
   },

   changeScore: function(add) {
      var cardsStr = " card";
      
      this.score += add;
      if (this.score != 1) {
         cardsStr += "s";
      } else {
         cardsStr += "!";
      }
      if (this.score == 0) {
         this.el.style.visibility = 'hidden';
      } else {
         this.el.style.visibility = 'visible';    
         this.el.style.zIndex = 1;
      }
      this.scoreDiv.set('text', this.score + cardsStr); 
   } 
});
