var Card = new Class({  
   initialize: function(v, s) {
      var valueList = ['2', '3', '4', '5', '6' ,'7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
      var suitList = ['C', 'D', 'H', 'S'];

      if ($defined(v) && $defined(s)) {
         this.value = v; 
         this.suit = s;
         this.frontSrc = suitList[this.suit] + valueList[this.value];
      }
      this.el = new Element('img');
      this.el.src = "images/back.png";
      this.el.addClass('card');
      this.el.setStyles({
         width: '100px',
         height: '144px',
         position: 'absolute',
         zIndex: 50 
      });
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

   moveTo: function(options) {
      var defaultOptions = {
         position: 'upperLeft',
         edge: 'upperLeft',
         trasition: 'linear',
         unit: 'px',
         duration: 100,
         offset: {x: 0, y: 0}
      }

      options = $merge(defaultOptions, options);
      options.duration *= game.speed;
      var move = new Fx.Move(this.el, options);
      move.start();
   },

   kill: function() {
      this.el.dispose();
   },

   fadeIn: function(time) {
      var fade = new Fx.Morph(this.el, {
         duration: time * game.speed
      });
      fade.start({'opacity': [0, 1]});
   },

   fadeOut: function(time, complete) {
      var fade = new Fx.Morph(this.el, {
         duration: time * game.speed,
         onComplete: complete
      });
      fade.start({'opacity': [1, 0]});
   },

   allowDrag: function() {
      var drag = this.el.makeDraggable({
         container: document.body,
         droppables: $('battlefield'),
         onStart: function() {
            this.deck.changeScore(-1);
         }.bind(this),
         onDrop: function(el, droppable) {
            if (droppable != null) {
               this.play(100);
               drag.detach();
            } else {
               this.backToDeck(100);
            }
         }.bind(this)
      });

   },

   play: function(time) {
      var cardPosition = game.field.add(this);
      var yOffset = 55 * cardPosition.sign + cardPosition.offset * 20;
      this.moveTo({
         relativeTo: $('battlefield'),
         position: 'center',
         edge: 'center',
         duration: time,
         offset: {
            x: 0,
            y: yOffset
         }, 
         onComplete: function() {
            if (game.inWar && !this.deck.auto && game.dropsTillBattle != 1) {
               this.deck.nextCard();
            }
            game.cardDropped();
         }.bind(this)
      });
      //Create the front side card now to give it time to load.
      this.front = this.frontSide();
   },

   frontSide: function() {
      var front = new Card();

      front.el.src = "images/" + this.frontSrc + ".png";
      front.el.style.zIndex = this.el.style.zIndex - 1;

      return front;
   },

   backToDeck: function(time, complete) {
      this.moveTo({
         duration: time,
         relativeTo: this.deck.el,
         onComplete: function() {
            this.deck.changeScore(1);
            if ($defined(complete)) {
               complete(this);
            }
         }.bind(this)
      });
   },
});
