var Battlefield = new Class({
   initialize: function() {
      this.stack = [[], []];
   },

   remove: function() {
      var ndx;
      var card;
      var player;

      ndx = $random(0, this.stack[0].length + this.stack[1].length - 1);  
      if (ndx < this.stack[0].length) {
         player = 0;
      } else {
         player = 1;
         ndx -= this.stack[0].length;
      }

      card = this.stack[player][ndx];
      this.stack[player].splice(ndx, 1);
      return card;
   },
      
   add: function(card) {
      var direction = 1;
      var offSet;

      if (card.deck.player == 0) {
         direction = -1;
      }
      this.stack[card.deck.player].push(card);
      offSet = this.stack[card.deck.player].length;
      card.el.style.zIndex = offSet;
      return {sign: direction, offset: direction * offSet};
   },

   empty: function() {
      return this.stack[0].length == 0 && this.stack[1].length == 0;
   },

   battle: function() {
      var first = this.stack[0][this.stack[0].length - 1];
      var second = this.stack[1][this.stack[1].length - 1];

      return first.compare(second);
   },

   flipTops: function() {
      var first = this.stack[0][this.stack[0].length - 1];
      var second = this.stack[1][this.stack[1].length - 1];

      if (!first.flipped) {
         game.flipCard(first);
      }
      if (!second.flipped) {
         game.flipCard(second);
      }
   },
 
   size: function() {
      return this.stack[0].length + this.stack[1].length;
   }
});
