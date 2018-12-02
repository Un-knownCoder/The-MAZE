
class Color {
   constructor(r, g, b) {
      if (r < 0 || r > 255)
         throw new Error("Cannot initiate a color within a value out of range 0-255")

      if (g < 0 || g > 255)
         throw new Error("Cannot initiate a color within a value out of range 0-255")

      if (b < 0 || b > 255)
         throw new Error("Cannot initiate a color within a value out of range 0-255")

      this.R = r;
      this.G = g;
      this.B = b;
   }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////

class Player {
   constructor(pp) {
      if (!(pp instanceof PlayerPosition))
         throw new Error('Cannot initiate the Player without a proper position!')
      else
         this.pos = pos;
   }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////

class MazeTile {
   constructor(v, c) {
      if(c instanceof Color) {
         this.color = c;
         this.value = v;
      } else {
         throw new Error("Cannot initiate a maze tile without a proper color!");
      }
   }

   getColor() {
      return this.color;
   }

   getValue() {
      return this.value;
   }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////

class Wall extends MazeTile {
   constructor(v, c) {
      super(v, c);
      this.isWall = true;
   }
}

class Space extends MazeTile {
   constructor(v, c, e) {
      super(v, c);
      this.isSpace = true;
      this.isEnd = !!e;
   }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////

class Door extends MazeTile {
   constructor(v, c, b) {
      super(v, c);
      this.isOpen = !!b;
      this.isDoor = true;
   }

   open() {
      if(!this.isOpen) {
         this.isOpen = true;
         this.color = new Color(50, 200, 50);
      }
   }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////

class Key extends MazeTile {
   constructor(v, c) {
      super(v, c);
      this.isKey = true;
   }

   take() {
     // this = new Space(this.getValue(), this.getColor(), false);
   }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////

class PlayerPosition {
   constructor(x, y) {
      this.posX = x;
      this.posY = y;

      this.keys = 0;
   }
} 

////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = {Color, MazeTile, Wall, Door, Space, Key, PlayerPosition}