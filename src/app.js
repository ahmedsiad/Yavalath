let tile;
let tile2;
let grid;

let rules = `Two players, White and Black, take turns adding a piece of their colour to an empty cell. A player wins by making 4-in-a-row of their colour (or more) but loses by making 3-in-a-row of their colour without also making 4-in-a-row (or more). If the board fills without either player winning or losing, then the game is a draw.`;

let currentPlayerTurn = 1;

function setup() {
    let cnv = createCanvas(1900, 900);
    grid = new Grid(5, width / 2, height / 2, 45);
}

function draw() {
    background(240, 244, 249);
    grid.draw();

    textSize(50);
    textAlign(CENTER);
    textFont("Fredoka One");
    text("Yavalath, by Ludi", width / 2, 50);

    textSize(24);
    rectMode(CENTER);
    text(rules, 350, 400, 500, 300);

    textSize(32);
    text("Yavalath Rules", 350, 220);

    if (grid.winningTiles.length == 0) {
        if (currentPlayerTurn == 1) {
            textSize(44);
            text("Player 1's turn (White)", 1550, 220);
        }
        else {
            textSize(44);
            text("Player 2's Turn (Black)", 1550, 220);
        }
    }
    else {
        let winningPlayer = grid.winningTiles[0].player;
        winningPlayer = (grid.winningTiles.length == 3 ? -winningPlayer + 3 : winningPlayer);
        if (winningPlayer == 1) {
            textSize(36);
            rectMode(CENTER);
            text("Player 1 (White) has won the game!\n\n Press any key to play again.", 1550, 350, 400, 300);
        }
        else {
            textSize(36);
            rectMode(CENTER);
            text("Player 2 (Black) has won the game!\n\n Press any key to play again.", 1550, 350, 400, 300);
        }
    }
}

function mousePressed() {
    if (grid.winningTiles.length == 0) {
        currentPlayerTurn = grid.processClick(mouseX, mouseY, currentPlayerTurn);
        grid.checkFourInARow();
    }
}

function keyPressed() {
    if (grid.winningTiles.length != 0) {
        grid = new Grid(5, width / 2, height / 2, 45);
        currentPlayerTurn = 1;
    }
}

function createHeaders() {
    let nameHeader = document.createElement("h1");
    nameHeader.innerHTML = "Yavalath, by Ludi";
}

function createRules() {
    let span = document.createElement("span");
    span.innerHTML = `Two players, White and Black, take turns adding a piece of their colour to an empty cell. 
    A player wins by making 4-in-a-row of their colour (or more) 
    but loses by making 3-in-a-row of their colour without also making 4-in-a-row (or more). 
    If the board fills without either player winning or losing, then the game is a draw.`;

    span.style.display = "inline-flex";
    span.style.textAlign = "center";
    span.style.width = "20em";
    span.style.position = "absolute";
    span.style.top = "2em";
    span.style.left = "3em";

    document.body.appendChild(span);
}

function polygon(x, y, radius, npoints) {
    let angle = Math.PI * 2 / npoints;
    beginShape();
    for (let a = 0; a < Math.PI * 2; a += angle) {
        let sx = x + Math.cos(a) * radius;
        let sy = y + Math.sin(a) * radius;
        vertex(sx, sy);
    }
    endShape(CLOSE);
}

