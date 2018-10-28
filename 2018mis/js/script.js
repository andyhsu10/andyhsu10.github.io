$(document).ready(function(){
    init_bezier();
    init_fractal();
});

function Point(x, y, fill_state, polygon, level){
    this.x = x || 0;
    this.y = y || 0;
    this.polygon = (polygon < 3 || polygon > 6)? 3:polygon;
    this.level = (level < 0 || level > 6)? 0:level;
    this.fill = (fill_state)? "#000000":"#FFFFFF"
}

// Draws the point to the canvas
Point.prototype.draw = function(ctx){
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, 2 * Math.PI);
    ctx.fillStyle = this.fill;
    ctx.fill();
    ctx.strokeStyle = '#000000';
    ctx.stroke();
}

// Determine if a point is inside the Point's bounds
Point.prototype.contains = function(mx, my){
    return (this.x-3 <= mx) && (this.x+3 >= mx) && (this.y-3 <= my) && (this.y+3 >= my);
}
