class Tile {
    constructor(x, y, radius, i, j) {
        this.pos = createVector(x, y);
        this.radius = radius;
        this.apothem = this.radius * Math.cos(PI/6);
        
        this.occupied = false;
        this.color = color(76, 206, 255);
        this.strokeColor = color(44, 101, 191);
        this.strokeWeight = 7;
        this.player = 0;

        this.indexI = i;
        this.indexJ = j;
    }

    draw() {
        push();
        translate(this.pos.x, this.pos.y);
        rotate(Math.PI/2);
        fill(this.color);
        strokeWeight(this.strokeWeight);
        stroke(this.strokeColor);
        polygon(0, 0, this.radius, 6);
        pop();
    }
}