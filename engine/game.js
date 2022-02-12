/*
Add your code for Game here
 */

 export default class Game {
    constructor(xy) {
        this.side = xy;
        this.board = [xy**2];
        this.goal = 2048;

        var rand1 = randIndex(xy);
        var rand2 = randIndex(xy);

        while (rand1 == rand2) {
            rand2 = randIndex(xy);
        }

        for (let i=0; i<this.side**2; i++) {
            if ((i == rand1)||(i == rand2)) {this.board[i] = randTile();} 
            else {this.board[i] = 0;}
        }

        this.gameState = {
            board: this.board,
            score: 0,
            won: false,
            over: false

        }
        this.wincallbacks = [];
        this.losecallbacks = [];
        this.movecallbacks = [];
    }

    setupNewGame() {
            this.gameState.won = false;
            this.gameState.over = false;
            this.gameState.score = 0;
            this.board = [this.side**2];
            this.gameState.board = this.board;
    
            var rand1 = randIndex(this.side);
            var rand2 = randIndex(this.side);
    
            while (rand1 == rand2) {rand2 = randIndex(this.side);}
    
            for (let i=0; i<this.side**2; i++) {
                if ((i == rand1)||(i == rand2)) {this.gameState.board[i] = randTile();} 
                else {this.gameState.board[i] = 0;}
            }
    }

    loadGame(gameState) {
        this.gameState = gameState;
    }

    move(direction) {
        var startIndex, collapse, next;
        var move = false;
       
        switch(direction) {
            case 'up': 
                startIndex = 0;
                collapse = this.side;
                next = 1;
                break;

            case 'down':
                startIndex = this.gameState.board.length - 1;
                collapse = -1*(this.side);
                next = -1;
                break;

            case 'left':
                startIndex = 0;
                collapse = 1;
                next = this.side;
                break;

            case 'right':
                startIndex = this.gameState.board.length - 1;
                collapse = -1;
                next = -1*(this.side);
                break;
        }

        
        for (let i=0; i<this.side; i++) {
            let x = startIndex + (next*i);
            for (let j=0; j<this.side-1; j++) {
                let index = x + (collapse*j);
                if (this.gameState.board[index]==0) {
                    for (let k=1; k<(this.side-j); k++) {
                        let n = index + (collapse*k);
                        if (this.gameState.board[n]!==0) {
                            this.gameState.board[index] = this.gameState.board[n];
                            this.gameState.board[n] = 0;
                            move=true;
                            break;
                        }
                    }
                }
                if (this.gameState.board[index]!==0) {
                    for (let k=1; k<(this.side-j); k++) {
                        let n = index + (collapse*k);
                        if ((this.gameState.board[n]!==this.gameState.board[index])&&(this.gameState.board[n]!==0)) {
                            break;
                        } else if (this.gameState.board[n]==this.gameState.board[index]){
                            this.gameState.board[index]=this.gameState.board[index]*2;
                            this.gameState.board[n] = 0;
                            move=true;
                            this.gameState.score += this.gameState.board[index];
                            if (this.gameState.board[index]==2048) {
                             this.gameState.won=true;
                             this.onWin(handleWinEvent);
                             this.goal*=2;
                             break;
                            }
                            break;
                        }
                    }
                }
            }
        }
       if (move) {
            let rand = randIndex(this.side);
            while(this.gameState.board[rand]!==0) {
            rand = randIndex(this.side);
            }
            this.gameState.board[rand] = randTile();
        }
        if (!this.canMove()) {
            this.gameState.over=true;
            this.onLose(handleLoseEvent);
        }

        

        this.onMove(handleMoveEvent);
    }

    canMove() {
        let m = false
        for (let i=0; i<this.gameState.board.length; i++) {
            let now = this.gameState.board[i];
            let next_right = this.gameState.board[i+1];
            let next_down = this.gameState.board[i+this.side];
            if (now == 0) {m=true;}
            if((i+1<this.gameState.board.length)&&((i%this.side)<(this.side-1))) {if (next_right==now){m=true;}}
            if(((i+this.side)<this.gameState.board.length)&&(toRC(i, this.side).row < this.side)) {if (next_down==now){m=true;}}
        }
        return m;
    }

    getGameState() {
        return this.gameState;
    }

    toString() {
        let s = '';
        for (let i=0; i<this.board.length; i++) {
            s += '[' +this.board[i] + '] ';
            if (toRC(i, this.side).column == 4) {
                s+='\n';
            }
        }
        return s;
    }

    onMove(callback) {
        this.movecallbacks.push(callback);
        this.movecallbacks.forEach(callback => callback(this.gameState))
    }

    onLose(callback) {
        this.losecallbacks.push(callback);
        if(this.gameState.over) {
            /*setTimeout(()=>{ */this.losecallbacks.forEach(callback => callback(this.gameState))/*},500);*/;
        }
    }

    onWin(callback) {
        this.wincallbacks.push(callback);
        if (this.gameState.won) {
            /*setTimeout(()=>{ */this.wincallbacks.forEach(callback => callback(this.gameState));/*}, 500);*/
        }
    }
 }

 export function randTile() {
     let x = Math.random();
     if (x<.1) {return 4;} 
     else {return 2;}
 }

 export function randIndex(xy) {
    return Math.floor(Math.random() * (xy ** 2));
 }

 export function toRC(i, xy) {
    return {
        row: Math.floor(i / xy) + 1,
        column: (i % xy) + 1
    };
 }

 export function handleMoveEvent(gameState) {
    console.log(toString(gameState.board));
 }

 export function handleWinEvent(gameState) {
        console.log("you got 2048!");
 }

 export function handleLoseEvent(gameState) {
     console.log("lost");
 }

 export function toString(b) {
     let s = '';
     for (let i=0; i<b.length; i++) {
         s += '[' +b[i] + '] ';
         if (toRC(i, 4).column == 4) {
             s+='\n';
         }
     }
     return s;
 }
 export function arrayEquals(a, b) {
    return a.length === b.length &&
      a.every((val, index) => val === b[index]);
  }

