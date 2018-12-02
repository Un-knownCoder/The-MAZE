const {Color, MazeTile, Wall, Space, Door, Key, PlayerPosition} = require('./elements');

class Maze {
   constructor(file) {
      let fs = require('fs');
      let matr = fs.readFileSync(file).toString('utf8').split('\r\n');
      this.keys = 0;
      this.matrix = [];

      for(let i = 0; i < matr.length; i++) {
         let arr = [];
         for (let j = 0; j < matr[i].length; j++) {
            switch(matr[i][j]) {
               case '#': arr.push(new Wall(11, new Color(150, 150, 150))); break;
               case ' ': arr.push(new Space(10, new Color(255, 255, 255), false)); break;
               case 'A': arr.push(new Space(10, new Color(255, 255, 255), false)); this.player = new PlayerPosition(j, i); break;
               case 'B': arr.push(new Space(99, new Color(255, 255, 255), true)); break;
               case 'C': arr.push(new Door(40, new Color(200, 55, 55), false)); break;
               case 'O': arr.push(new Door(50, new Color(55, 200, 55), true)); break;
               case 'K': arr.push(new Key(70, new Color(175, 100, 55))); this.keys++; break;
            }      
         }
         
         this.matrix.push(arr);
      }
   }
}

module.exports = {Maze}