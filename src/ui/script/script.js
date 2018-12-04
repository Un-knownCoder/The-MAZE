const mazeHandler = io();
let login;

if(document.cookie)
   mazeHandler.emit('admin log', document.cookie);

////////////////////////////////////////////////////////////////////////////////////////////////////

function load() {
   document.getElementsByClassName('browser')[0].style.filter = "blur(0px)";
}

function tryLogin() {
   swal({
      title: 'Enter the ADMINISTRATOR password',
      input: 'password',
      confirmButtonText: 'Confirm',
      inputValidator: (input) => {
         if (!input)
            return "Error: no input"
         else
            return new Promise((resolve) => {
               mazeHandler.emit('admin log', input);
               mazeHandler.on('log res', (out) => {
                  if (out.state === 404) {
                     resolve("Error: Someone has just logged")
                  } else if (out.state === 403) {
                     resolve("Error: Wrong password");
                  } else swal({
                     title: 'You logged-in as ADMIN',
                     type: 'success'
                  }).then(() => {
                     login = input;
                     document.cookie = login;
                     resolve()
                  });
               });
            });
      }
   });
}

////////////////////////////////////////////////////////////////////////////////////////////////////

let maze;
let player;
let cond;

mazeHandler.emit('get maze');
mazeHandler.on('maze', (elem) => {
   document.getElementById('maze').classList = '';
   document.getElementById('maze').classList = 's40';
   maze = elem.matrix;
   player = elem.player;
   console.log(maze)

   if ((maze.length > 15 && maze.length <= 30) && (maze[0].length > 25 && maze[0].length <= 40))
      document.getElementById('maze').classList = '';
   else if ((maze.length > 30 && maze.length <= 45) && (maze[0].length > 40 && maze[0].length <= 55)) {
      console.log(maze[0].length)
      document.getElementById('maze').classList = '';
      document.getElementById('maze').classList.add('s20');
   } else if ((maze.length > 45 && maze.length <= 60) && (maze[0].length > 55 && maze[0].length <= 80)) {
      document.getElementById('maze').classList = '';
      document.getElementById('maze').classList.add('s10');
   } else if ((maze.length > 60) && (maze[0].length > 80)) {
      if(!cond)
         swal({
            title: "Warning",
            text: 'The maze is really big, it could result warped, continue?',
            type: 'warning',
            preConfirm: (vvv) => {cond = true;}
         });
   }

   drawMaze();
});

function drawMaze() {
   let land = document.getElementById('maze');
   land.innerHTML = ''

   for (let i = 0; i < maze.length; i++) {
      let row = document.createElement('TR');
      row.classList.add('row');
      land.appendChild(row);
   }

   let rows = land.getElementsByClassName('row');

   for (let i = 0; i < maze.length; i++) {
      for (let j = 0; j < maze[i].length; j++) {
         let cell = document.createElement('TD');
         if (maze[i][j].isSpace && !maze[i][j].isEnd)
            cell.classList.add('grass');
         else if (maze[i][j].isWall)
            cell.classList.add('wall');
         else if (maze[i][j].isDoor && !maze[i][j].isOpen)
            cell.classList.add('cDoor');
         else if (maze[i][j].isDoor && maze[i][j].isOpen)
            cell.classList.add('oDoor');
         else if (maze[i][j].isKey)
            cell.classList.add('key');
         else if (maze[i][j].isEnd)
            cell.classList.add('end');
         rows[i].appendChild(cell);
      }
   }
   console.log(player)
   rows[player.posY].getElementsByTagName('td')[player.posX].classList = "";
   rows[player.posY].getElementsByTagName('td')[player.posX].classList.add('hero');
}

document.onkeypress = function(key) {
   let k;
   if (window.event) { // IE                    
      k = key.keyCode;
   } else if (key.which) { // Netscape/Firefox/Opera
      k = key.which;
   }
   
   if(!!login) {
      switch(k) {
         case 119: mazeHandler.emit('movePlayer', 1); break;
         case 97:  mazeHandler.emit('movePlayer', 4); break;
         case 115: mazeHandler.emit('movePlayer', 3); break;
         case 100: mazeHandler.emit('movePlayer', 2); break;
      }
   }
}
