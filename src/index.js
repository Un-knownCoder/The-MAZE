const express = require('express');
const web = express();
const SocketIo = require('socket.io');
const {
   Maze
} = require('./modules/maze');
const {
   Space,
   Key,
   Door,
   Color
} = require('./modules/elements');

/////////////////////////////////////////////////////////////////////////////////////

web.use(express.static('ui'));
console.log("<Server>: service started...")

const server = web.listen(process.env.PORT || 80);
const io = SocketIo(server);

setTimeout(() => {
	console.log("<Server>: now listening on port 80")
}, 2000);

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
      } else if (!!admin) {
         if (pw === adminPW && socket.id == admin) {
            io.sockets.connected[socket.id].emit('log res', {
               state: 200
            });
         } else {
            io.sockets.connected[socket.id].emit('log res', {
               state: 404
            });
         }
      } else io.sockets.connected[socket.id].emit('log res', {
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
      if (socket.id === admin)
         movePlayer(dir);
      else io.sockets.connected[socket.id].emit('host err');
   });

   socket.on('disconnect', () => {
      if(socket.id === admin)
         admin = '';
   })



   function movePlayer(dir) {
      playerMotion(dir);
      for (let key in io.sockets.connected)
         io.sockets.connected[key].emit('maze', {
            matrix: matrix,
            player: hero
         });
   }
});

/////////////////////////////////////////////////////////////////////////////////////

function playerMotion(dir) {
   const north = 1,
      east = 2,
      south = 3,
      west = 4;

   switch (dir) {
      case north:
         {
            if (hero.posY - 1 >= 0) {
               let cell = matrix[hero.posY - 1][hero.posX];
               if (cell.value == 10) {
                  hero.posY--;
               } else if (cell.value == 40) {
                  if (hero.keys > 0) {
                     hero.keys--;
                     matrix[hero.posY - 1][hero.posX].isOpen = true;
                  }
               } else if (cell.value == 50) {
                  if (hero.posY - 2 >= 0)
                     if (matrix[hero.posY - 2][hero.posX].value === (10 || 70 || 99)) {
                        if (matrix[hero.posY - 2][hero.posX].value === 70) {
                           hero.keys++;
                           matrix[hero.posY - 1][hero.posX] = new Space(10, new Color(255, 255, 255), false);
                           // matrix[hero.posY - 1][hero.posX] = matrix[hero.posY][hero.posX]
                        }
                        hero.posY -= 2;
                     }
               } else if (cell.value == 70) {
                  hero.keys++;
                  hero.posY--;
                  matrix[hero.posY - 1][hero.posX] = new Space(10, new Color(255, 255, 255), false);
                  // matrix[hero.posY - 1][hero.posX] = matrix[hero.posY][hero.posX]
               } else if (cell.value == 99) {
                  for (let key in io.sockets.connected)
                     io.sockets.connected[key].emit('GAME OVER');
                  return;
               }
            }
         }
         break;
      case east:
         {
            if (hero.posX + 1 < matrix[0].length) {
               let cell = matrix[hero.posY][hero.posX+1];
               if (cell.value == 10) {
                  hero.posX++;
               } else if (cell.value == 40) {
                  if (hero.keys > 0) {
                     hero.keys--;
                     matrix[hero.posY][hero.posX + 1].isOpen = true;
                     matrix[hero.posY][hero.posX + 1].value  = 50;
                  }
               } else if (cell.value == 50) {
                  if (hero.posX + 2 < matrix.length)
                     if (matrix[hero.posY][hero.posX + 2].value === (10 || 70 || 99)) {
                        if (matrix[hero.posY][hero.posX + 2].value === 70) {
                           hero.keys++;
                           matrix[hero.posY][hero.posX + 1] = new Space(10, new Color(255, 255, 255), false);
                           // matrix[hero.posY - 1][hero.posX] = matrix[hero.posY][hero.posX]
                        }
                        hero.posX += 2;
                     }
               } else if (cell.value == 70) {
                  hero.posX++;
                  hero.keys++;
                  matrix[hero.posY][hero.posX + 1] = new Space(10, new Color(255, 255, 255), false);
                  // matrix[hero.posY - 1][hero.posX] = matrix[hero.posY][hero.posX]
               } else if (cell.value == 99) {
                  hero.posX++;
                  for (let key in io.sockets.connected)
                     io.sockets.connected[key].emit('GAME OVER');
                  return;
               }
            }
         }
         break;
      case south:
         {
            if (hero.posY + 1 < matrix.length) {
               let cell = matrix[hero.posY + 1][hero.posX];
               if (cell.value == 10) {
                  hero.posY++;
               } else if (cell.value == 40) {
                  if (hero.keys > 0) {
                     hero.keys--;
                     matrix[hero.posY + 1][hero.posX].isOpen = true;
                  }
               } else if (cell.value == 50) {
                  if (hero.posY + 2 < matrix.length)
                     if (matrix[hero.posY + 2][hero.posX].value === (10 || 70 || 99)) {
                        if (matrix[hero.posY + 2][hero.posX].value === 70) {
                           hero.keys++;
                           matrix[hero.posY + 1][hero.posX] = new Space(10, new Color(255, 255, 255), false);
                           // matrix[hero.posY - 1][hero.posX] = matrix[hero.posY][hero.posX]
                        }
                        hero.posY += 2;
                     }
               } else if (cell.value == 70) {
                  hero.posY++;
                  hero.keys++;
                  matrix[hero.posY + 1][hero.posX] = new Space(10, new Color(255, 255, 255), false);
                  // matrix[hero.posY - 1][hero.posX] = matrix[hero.posY][hero.posX]
               } else if (cell.value == 99) {
                  hero.posY++;
                  for (let key in io.sockets.connected)
                     io.sockets.connected[key].emit('GAME OVER');
                  return;
               }
            }
         }
         break;
      case west:
         {
            if (hero.posX - 1 >= 0) {
               let cell = matrix[hero.posY][hero.posX - 1];
               if (cell.value == 10) {
                  hero.posX--;
               } else if (cell.value == 40) {
                  if (hero.keys > 0) {
                     hero.keys--;
                     matrix[hero.posY][hero.posX - 1].isOpen = true;
                  }
               } else if (cell.value == 50) {
                  if (hero.posX - 2 >= 0)
                     if (matrix[hero.posY][hero.posX - 2].value === (10 || 70 || 99)) {
                        if (matrix[hero.posY][hero.posX - 2].value === 70) {
                           hero.keys++;
                           matrix[hero.posY][hero.posX - 1] = new Space(10, new Color(255, 255, 255), false);
                           // matrix[hero.posY - 1][hero.posX] = matrix[hero.posY][hero.posX]
                        }
                        hero.posX -= 2;
                     }
               } else if (cell.value == 70) {
                  hero.posX--;
                  hero.keys++;
                  matrix[hero.posY][hero.posX - 1] = new Space(10, new Color(255, 255, 255), false);
                  // matrix[hero.posY - 1][hero.posX] = matrix[hero.posY][hero.posX]
               } else if (cell.value == 99) {
                  for (let key in io.sockets.connected)
                     io.sockets.connected[key].emit('GAME OVER');
                  return;
               }
            }
         }
         break;
   }
}