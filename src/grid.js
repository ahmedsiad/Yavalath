class Grid {
    constructor(radius, centerX, centerY, tileSize) {
        this.rows = this.generateRows(radius, centerX, centerY, tileSize);
        console.log(this.rows);

        this.lastTileClickedIndex = {i: 0, j: 0};

        this.winningTiles = [];
    }

    generateRows(radius, centerX, centerY, tileSize) {
        let rows = [];
        let amount = radius * 2 - 1;
        for (let i = 0; i < amount; i++) {
            rows[i] = [];
            
            let apothem = tileSize * Math.cos(PI/6);
            let limit = amount - Math.abs(i - radius + 1);
            let startX = centerX - (0.5 * limit - 0.5) * apothem * 2;
            let startY = centerY - (apothem/2 + tileSize) * (radius - i);
            for (let j = 0; j < limit; j++) {
                let tile = new Tile(startX + apothem * 2 * j, startY, tileSize, i, j);
                rows[i].push(tile);
            }
        }
        return rows;
    }

    draw() {
        for (let i = 0; i < this.rows.length; i++) {
            for (let j = 0; j < this.rows[i].length; j++) {
                this.rows[i][j].draw();
            }
        }
        for (let j = 0; j < this.winningTiles.length; j++) {
            this.winningTiles[j].draw();
        }
    }

    processClick(x, y, player) {
        let closest = Infinity;
        let closestTile;
        let closestIndex = {i: 0, j: 0};

        for (let i = 0; i < this.rows.length; i++) {
            for (let j = 0; j < this.rows[i].length; j++) {
                let distance = dist(x, y, this.rows[i][j].pos.x, this.rows[i][j].pos.y);
                if (distance < closest) {
                    closest = distance;
                    closestTile = this.rows[i][j];
                    closestIndex.i = i;
                    closestIndex.j = j;
                }
            }
        }

        if (closestTile.occupied) return player;
        if (closest > this.rows[0][0].radius) return player;

        if (this.lastTileClickedIndex.i == closestIndex.i && this.lastTileClickedIndex.j == closestIndex.j) {
            closestTile.occupied = true;
            closestTile.player = player;
            if (player == 2) {
                closestTile.color = color(0);//color(200, 50, 50);
            }
            else {
                closestTile.color = color(255);//color(50, 50, 200);
            }
    
            return -player + 3;
        }

        let lastTileClicked = this.rows[this.lastTileClickedIndex.i][this.lastTileClickedIndex.j];
        if (!lastTileClicked.occupied) lastTileClicked.color = color(76, 206, 255);

        this.lastTileClickedIndex = closestIndex;
        closestTile.color = color(255, 255, 80);
        return player;
    }

    checkFourInARow() {
        let potentialFour;
        let potentialThree;
        for (let i = 0; i < this.rows.length; i++) {
            for (let j = 0; j < this.rows[i].length; j++) {
                if (this.rows[i][j].player == 0) continue;
                let straight = this.straightFourInARow(this.rows[i][j]);
                if (straight.length == 3) {
                    potentialThree = straight;
                }
                else if (straight.length != 0) {
                    potentialFour = straight;
                }

                let diagonalU = this.diagonalUpFourInARow(this.rows[i][j]);
                if (diagonalU.length == 3) {
                    potentialThree = diagonalU;
                }
                else if (diagonalU.length != 0) {
                    potentialFour = diagonalU;
                }

                let diagonalD = this.diagonalDownFourInARow(this.rows[i][j]);
                if (diagonalD.length == 3) {
                    potentialThree = diagonalD;
                }
                else if (diagonalD.length != 0) {
                    potentialFour = diagonalD;
                }
            }
        }

        if (potentialFour != undefined) {
            this.highlightTiles(potentialFour);
            return;
        }
        if (potentialThree != undefined) {
            this.highlightTiles(potentialThree);
        }
    }

    highlightTiles(tiles) {
        for (let i = 0; i < tiles.length; i++) {
            tiles[i].color.levels[0] += 50;
            tiles[i].color.levels[1] += 50;
            tiles[i].color.levels[2] += 50;
            //tiles[i].strokeColor = color(104, 161, 251);
            tiles[i].strokeColor = (tiles.length >= 4 ? color(0, 255, 0) : color(255, 0, 0));
            tiles[i].strokeWeight = 9;
            this.winningTiles.push(tiles[i]);
        }
    }

    diagonalUpFourInARow(tile) {
        let tiles = [];
        let j = 0;

        if (tile.indexI < 2) return tiles;
        tiles.push(tile);

        for (let i = 1; i < 4; i++) {
            let a = tiles[tiles.length - 1];
            if (this.rows[a.indexI - 1] == undefined) break;
            j = (this.rows[a.indexI].length < this.rows[a.indexI - 1].length ? a.indexJ + 1 : a.indexJ);

            let k = this.rows[a.indexI - 1][j];
            if (k == undefined) break;
            tiles.push(k);
        }
        
        if (tiles.length == 4) {
            if (tiles[0].player == tiles[1].player && tiles[0].player == tiles[2].player && tiles[0].player == tiles[3].player) return tiles;
            tiles.pop();
            if (tiles[0].player == tiles[1].player && tiles[0].player == tiles[2].player) return tiles;
        }
        else if (tiles.length == 3) {
            if (tiles[0].player == tiles[1].player && tiles[0].player == tiles[2].player) return tiles;
        }
        return [];
    }

    diagonalDownFourInARow(tile) {
        let tiles = [];
        let j = 0;

        if (tile.indexI > this.rows.length - 3) return tiles;
        tiles.push(tile);

        for (let i = 1; i < 4; i++) {
            let a = tiles[tiles.length - 1];
            if (this.rows[a.indexI + 1] == undefined) break;
            j = (this.rows[a.indexI].length < this.rows[a.indexI + 1].length ? a.indexJ + 1 : a.indexJ);

            let k = this.rows[a.indexI + 1][j];
            if (k == undefined) break;
            tiles.push(k);
        }

        if (tiles.length == 4) {
            if (tiles[0].player == tiles[1].player && tiles[0].player == tiles[2].player && tiles[0].player == tiles[3].player) return tiles;
            tiles.pop();
            if (tiles[0].player == tiles[1].player && tiles[0].player == tiles[2].player) return tiles;
        }
        else if (tiles.length == 3) {
            if (tiles[0].player == tiles[1].player && tiles[0].player == tiles[2].player) return tiles;
        }
        return [];
    }

    straightFourInARow(tile) {
        let tiles = [];

        if (tile.indexJ > this.rows[tile.indexI].length - 3) return tiles;
        tiles.push(tile);

        for (let i = 1; i < 4; i++) {
            if (this.rows[tile.indexI][tile.indexJ + i] == undefined) break;
            tiles.push(this.rows[tile.indexI][tile.indexJ + i]);
        }

        if (tiles.length == 4) {
            if (tiles[0].player == tiles[1].player && tiles[0].player == tiles[2].player && tiles[0].player == tiles[3].player) return tiles;
            tiles.pop();
            if (tiles[0].player == tiles[1].player && tiles[0].player == tiles[2].player) return tiles;
        }
        else if (tiles.length == 3) {
            if (tiles[0].player == tiles[1].player && tiles[0].player == tiles[2].player) return tiles;
        }
        return [];
    }
}