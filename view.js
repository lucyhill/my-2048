import Game from "/engine/game.js";

export const theGame = new Game(4);

theGame.onWin(gameState => {
    $('#root').empty();
    $('#root').append(
        `<div class= "win section has-text-centered has-text-primary"> <h1 class="title" > YOU WON! </h1><br><h1>Score: ${gameState.score}</h1>
        <div class="reset section has-text-centered"><button class= "content button has-text-link" type="button">RESET</button></div>
        <button type="button" class="keep-playing content button has-text-link">Keep playing</button></div>`
    );
});

theGame.onLose(gameState => {
    $('#root').empty();
    $('#root').append(
        `<div class= "lose section has-text-centered"> <h1 class="section title has-text-centered has-text-danger"> YOU LOST:( </h1><br><h1>Score: ${gameState.score}</h1>
        <button type="button" class="reset content button has-text-link">Play Again?</button></div>`
    );
});

$('#root').on("click", '.reset', event => {
    event.preventDefault();
    $('#root').empty();
    theGame.setupNewGame();
    setGameBoard();
});

$('#root').on("click", '.keep-playing', event => {
    event.preventDefault();
    $('#root').empty();
    setGameBoard();
})



export const setGameBoard = function() {
    $('#root').append(`<div class="grid-container section has-text-centered" id="game-board"></div>`);
    for (let i=0; i<16; i++) {
        let tile = renderTile(theGame.gameState.board[i]);
        $('#game-board').append(tile);
    }
    $('#root').append(`<div id="score" class="section has-text-centered"><h1 class="title is-small"><strong>Score: </strong>${theGame.gameState.score}</h1></div>`);
    $('#score').append(`<div class="reset section is-small has-text-centered"><button class="content button has-text-link" type="button">RESET</button></div>`);

}

export const renderGameBoard = function() {
    $('#game-board').empty();
    for (let i=0; i<16; i++) {
        let tile = renderTile(theGame.gameState.board[i]);
        $('#game-board').append(tile);
    }
    $('#score').replaceWith(`<div id="score" class="section has-text-centered"><h1 class="title is-small"><strong>Score: </strong>${theGame.gameState.score}</h1></div>`)
    $('#score').append(`<div class="reset section is-small"><button class= "content button has-text-link" type="button">RESET</button></div>`);
    
}

export const renderTile = function(number) {
    let tile_color;
    switch (number) {
        case 0:
            tile_color = "has-background-white"
            number = "";
            break;
        case 2:
            tile_color = "has-background-light"
            break;
        case 4:
            tile_color = "has-background-info-light"
            break;
        case 8:
            tile_color = "has-background-success-light"
            break;
        case 16:
            tile_color = "has-background-primary"
            break;
        case 32:
            tile_color ="has-background-info"
            break;
        case 64:
            tile_color ="has-background-link"
            break;
        case 128:
            tile_color ="has-background-success"
            break;
        case 256:
            tile_color ="has-background-warning"
            break;
        case 512:
            tile_color ="has-background-danger"
            break;
        case 1024:
            tile_color ="has-background-danger-dark"
            break;
        case 2048:
            tile_color ="has-background-warning-dark"
            break;
    }
    return `<div class="grid-item ${tile_color}">
                <div class="container content">
                    <h1>${number}</h1>
                </div>
            </div>` ;
}

$(document).on("keydown", function(event) {
    if (!theGame.gameState.over) {
        event.preventDefault();

        switch (event.which) {
            case 38: 
                theGame.move('up');
                renderGameBoard();
                break;
            case 40:
                theGame.move('down');
                renderGameBoard();
                break;
            case 39:
                theGame.move('right');
                renderGameBoard();
                break;
            case 37:
                theGame.move('left');
                renderGameBoard();
                break;
        }
    }
});

$(function() {
    setGameBoard();
});