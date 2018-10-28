function CanvasStateF(canvas){
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = canvas.getContext('2d');
    // This complicates things a little but but fixes mouse co-ordinate problems
    // when there's a border or padding. See getMouse for more detail
    var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;
    if(document.defaultView && document.defaultView.getComputedStyle){
        this.stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)      || 0;
        this.stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)       || 0;
        this.styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10)  || 0;
        this.styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)   || 0;
    }
    // Some pages have fixed-position bars(like the stumbleupon bar) at the top or left of the page
    // They will mess up mouse coordinates and this fixes that
    var html = document.body.parentNode;
    this.htmlTop = html.offsetTop;
    this.htmlLeft = html.offsetLeft;

    // **** Keep track of state! ****
  
    this.valid = false; // when set to false, the canvas will redraw everything
    this.points = [];  // the collection of things to be drawn
  
    // **** events! ****
    var myState = this;
  
    //fixes a problem where double clicking causes text to get selected on the canvas
    canvas.addEventListener('selectstart', function(e){ e.preventDefault(); return false; }, false);
    // Up, down, and move are for dragging
    canvas.addEventListener('mousemove', function(e){
        var mouse = myState.getMouse(e);
        $("#fractal_x").text((mouse.x<0)? 0:parseInt(mouse.x));
        $("#fractal_y").text((mouse.y<0)? 0:parseInt(mouse.y));
    }, true);
    // double click for making new points
    canvas.addEventListener('dblclick', function(e){
        var mouse = myState.getMouse(e);
        myState.addPoint(new Point(mouse.x, mouse.y, null, $("#polygon_num").val(),$("#level_num").val()));
    }, true);

    document.getElementById('reset_fractal').addEventListener('click', function(){
        myState.reset();
        $("#fractal_x").text(0);
        $("#fractal_y").text(0);
        setTimeout(function(){ $("#reset_fractal").trigger('blur'); }, 200);
    }, true);

    window.addEventListener('resize', function(){
        myState.resize();
    }, true);

    document.getElementById('fractal_link').addEventListener('click', function(){
        myState.resize();
    }, true);
  
    this.interval = 30;
    setInterval(function(){ myState.draw(); }, myState.interval);
}

CanvasStateF.prototype.addPoint = function(point){
    this.points.push(new Point(point.x,point.y,false,point.polygon,point.level));
    if(this.points.length > 1){
        fractalCurve(this.points[this.points.length-2], this.points[this.points.length-1], this.points[this.points.length-1].polygon, this.points[this.points.length-1].level, this.ctx);
        this.points[this.points.length-2].draw(this.ctx);
    }
    this.points[this.points.length-1].draw(this.ctx);
}

CanvasStateF.prototype.resize = function(){
    document.getElementById('fractal_canvas').width = $('#fractal_canvas').closest('.tab-content').width();
    document.getElementById('fractal_canvas').height = 600;

    for(var i = 0; i < this.points.length; i++){
        this.points[i].x = (document.getElementById('fractal_canvas').width / this.width) * this.points[i].x;
    }
    $("#fractal_x").text(parseInt((document.getElementById('fractal_canvas').width / this.width) * $("#fractal_x").text()));
    this.width = document.getElementById('fractal_canvas').width;
    this.height = document.getElementById('fractal_canvas').height;
    this.valid = false;
    this.draw();
}

CanvasStateF.prototype.clear = function(){
    this.ctx.clearRect(0, 0, this.width, this.height);
}

CanvasStateF.prototype.reset = function(){
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.valid = false;
    this.points = [];
}

// While draw is called as often as the INTERVAL variable demands,
// It only ever does something if the canvas gets invalidated by our code
CanvasStateF.prototype.draw = function(){
    // if our state is invalid, redraw and validate!
    if(!this.valid){
        this.valid = true;
        var ctx = this.ctx;
        var points = this.points;
        this.clear();
    
        // draw all points
        for(var i = 1; i < points.length; i++)
            fractalCurve(points[i-1], points[i], points[i].polygon, points[i].level, ctx);
        for(var i = 0; i < points.length; i++){
            var point = points[i];
            points[i].draw(ctx);
        }
    }
}

// Creates an object with x and y defined, set to the mouse position relative to the state's canvas
// If you wanna be super-correct this can be tricky, we have to worry about padding and borders
CanvasStateF.prototype.getMouse = function(e){
    var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;
  
    // Compute the total offset
    if(element.offsetParent !== undefined){
        do {
            offsetX += element.offsetLeft;
            offsetY += element.offsetTop;
        } while((element = element.offsetParent));
    }

    // Add padding and border style widths to offset
    // Also add the <html> offsets in case there's a position:fixed bar
    offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
    offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;

    mx = e.pageX - offsetX;
    my = e.pageY - offsetY;
  
    // We return a simple javascript object(a hash) with x and y defined
    return {x: mx, y: my};
}

function init_fractal(){
    var s = new CanvasStateF(document.getElementById('fractal_canvas'));
    s.resize();
}

function fractalCurve(P1, P2, polygon, level, ctx){
    var V1 = new Point((P2.x-P1.x)/3, (P2.y-P1.y)/3);
    var V2 = new Point(V1.x*2, V1.y*2);
    var degree = -180 + (polygon-2)*180/polygon;
    var v = new Point(-(V1.x*Math.cos(getRad(degree)) + V1.y*Math.sin(getRad(degree))), -(-V1.x*Math.sin(getRad(degree)) + V1.y*Math.cos(getRad(degree))));
    var p = new Point((P1.x+V1.x), (P1.y+V1.y));

    // First part
    ctx.beginPath();
    if(level <= 1){
        ctx.moveTo(P1.x, P1.y);
        ctx.lineTo((P1.x+V1.x), (P1.y+V1.y));
    }
    else{
        fractalCurve(P1, new Point((P1.x+V1.x), (P1.y+V1.y)), polygon, level-1, ctx);
    }

    // Second part
    if(level < 1){
        ctx.lineTo((P1.x+V2.x), (P1.y+V2.y));
    }
    else{
        for(var i = 1; i < polygon; i++){
            if(level == 1)
                ctx.lineTo((p.x+v.x), (p.y+v.y));
            else
                fractalCurve(p, new Point((p.x+v.x), (p.y+v.y)), polygon, level-1, ctx);
            p.x += v.x;
            p.y += v.y;
            v = new Point((v.x*Math.cos(getRad(degree)) + v.y*Math.sin(getRad(degree))), (-v.x*Math.sin(getRad(degree)) + v.y*Math.cos(getRad(degree))));
        }
    }

    // Third part
    if(level <= 1){
        ctx.moveTo((P1.x+V2.x), (P1.y+V2.y));
        ctx.lineTo(P2.x, P2.y);
    }
    else{
        fractalCurve(new Point((P1.x+V2.x), (P1.y+V2.y)), new Point(P2.x, P2.y), polygon, level-1, ctx);
    }
    
    ctx.stroke();
}

function getRad(degree){
    return degree/360*2*Math.PI;
}
