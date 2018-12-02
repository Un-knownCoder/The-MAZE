const express = require('express');
const web = express();
const SocketIo = require('socket.io');
const {
   Maze
} = require('./modules/maze');
const {Space, Key, Door, Color} = require('./modules/elements');

/////////////////////////////////////////////////////////////////////////////////////

web.use(express.static('ui'));
const server = web.listen(process.env.PORT || 80);
const io = SocketIo(server);

const adminPW = '.letsplaythemaze3.';
let admin = undefined;

/////////////////////////////////////////////////////////////////////////////////////

let maze = new Maze('./modules/maze.log');
let matrix = maze.matrix;
let hero = maze.player;
let keys = maze.keys;

/////////////////////////////////////////////////////////////////////////////////////

io.on('connection', (socket) => {
   socket.on('admin log', (pw) => {
      if (pw === adminPW && !admin) {
         io.sockets.connected[socket.id].emit('log res', {
            state: 200
         });
         admin = socket.id;
      } else if (!!admin) io.sockets.connected[socket.id].emit('log res', {
         state: 404
      });
      else io.sockets.connected[socket.id].emit('log res', {
         state: 403
      });
   });

   socket.on('get maze', () => {
      io.sockets.connected[socket.id].emit('maze', {
         matrix: matrix,
         player: hero
      });
   })

   socket.on('movePlayer', (dir) => {
      console.log(dir)
      if (socket.id === admin)
         movePlayer(dir);
      else io.sockets.connected[socket.id].emit('host err');
   });



   function movePlayer(dir) {
      const nord = 1,
         east = 2,
         south = 3,
         west = 4;

      let result;
      let nPosX = hero.posX,
         nPosY = hero.posY;

      switch (dir) {
         case nord:
            {
               if (hero.posY - 1 >= 0) {
                  result = checkWalk(hero.posY - 1, hero.posX);
                  nPosY--;
               }
            }
            break;
         case east:
            {
               if (hero.posX + 1 <= matrix[0].length - 1) {
                  result = checkWalk(hero.posY, hero.posX + 1);
                  nPosX++;
               }
            }
            break;
         case south:
            {
               if (hero.posY + 1 <= matrix.length - 1) {
                  result = checkWalk(hero.posY + 1, hero.posX);
                  nPosY++;
               }
            }
            break;
         case west:
            {
               if (hero.posX - 1 >= 0) {
                  result = checkWalk(hero.posY, hero.posX - 1);
                  nPosX--;
               }
            }
            break;
      }

      if (result) {
         if (!result.type) {
            hero.posX = nPosX;
            hero.posY = nPosY;
         } else {
            checkWalk(result.y, result.x);
         }
      }
      console.log(matrix.keys)
      for(let key in io.sockets.connected)
         io.sockets.connected[key].emit('maze', {
            matrix: matrix,
            player: hero
         });
   }

   function checkWalk(y, x) {

      const W = 11,
         S = 10,
         E = 99,
         C = 40,
         O = 50,
         K = 70;

      const cell = maze.matrix[y][x];
      let xDif = hero.posX - x;
      let yDif = hero.posY - y;

      switch (cell.getValue()) {
         case W:
            return;
         case S:
            return true;
         case E:
            gameEnd();
            return true;
         case C:
            if (hero.keys > 0) {
               matrix[y][x].isOpen = true;
               hero.keys--;
            }
            return;
         case O:
            return {
               x: hero.posX + (2 * xDif),
               y: hero.posY + (2 * yDif),
               type: O
            };
         case K:
            matrix[y][x] = new Space(11, new Color(1, 1, 1), false);
            hero.keys++;
            return true;
      }
   }
});

/////////////////////////////////////////////////////////////////////////////////////