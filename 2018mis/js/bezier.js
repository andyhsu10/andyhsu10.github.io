function CanvasState(canvas){
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
    this.dragging = false; // Keep track of when we are dragging
    // the current selected object. In the future we could turn this into an array for multiple selection
    this.selection = null;
    this.dragoffx = 0; // See mousedown and mousemove events for explanation
    this.dragoffy = 0;
  
    // **** events! ****
    var myState = this;
  
    //fixes a problem where double clicking causes text to get selected on the canvas
    canvas.addEventListener('selectstart', function(e){ e.preventDefault(); return false; }, false);
    // Up, down, and move are for dragging
    canvas.addEventListener('mousedown', function(e){
        var mouse = myState.getMouse(e);
        var mx = mouse.x;
        var my = mouse.y;
        var points = myState.points;
        for(var i = points.length-1; i >= 0; i--){
            if(points[i].contains(mx, my)){
                var mySel = points[i];
                // Keep track of where in the object we clicked
                // so we can move it smoothly(see mousemove)
                myState.dragoffx = mx - mySel.x;
                myState.dragoffy = my - mySel.y;
                myState.dragging = true;
                myState.selection = mySel;
                myState.valid = false;
                return;
            }
        }
        // havent returned means we have failed to select anything.
        // If there was an object selected, we deselect it
        if(myState.selection){
            myState.selection = null;
            myState.valid = false; // Need to clear the old selection border
        }
    }, true);
    canvas.addEventListener('mousemove', function(e){
        var mouse = myState.getMouse(e);
        if(myState.dragging){
            // We don't want to drag the object by its top-left corner, we want to drag it
            // from where we clicked. Thats why we saved the offset and use it here
            myState.selection.x = mouse.x - myState.dragoffx;
            myState.selection.y = mouse.y - myState.dragoffy;   
            myState.valid = false; // Something's dragging so we must redraw
        }
        $("#bezier_x").text((mouse.x-myState.dragoffx)<0? 0:parseInt(mouse.x-myState.dragoffx));
        $("#bezier_y").text((mouse.y-myState.dragoffy)<0? 0:parseInt(mouse.y-myState.dragoffy));
    }, true);
    canvas.addEventListener('mouseup', function(e){
        myState.dragging = false;
    }, true);
    // double click for making new points
    canvas.addEventListener('dblclick', function(e){
        var mouse = myState.getMouse(e);
        myState.addPoint(new Point(mouse.x, mouse.y));
    }, true);

    document.getElementById('reset_bezier').addEventListener('click', function(){
        myState.reset();
        $("#bezier_x").text(0);
        $("#bezier_y").text(0);
        setTimeout(function(){ $("#reset_bezier").trigger('blur'); }, 200);
    }, true);

    window.addEventListener('resize', function(){
        myState.resize();
    }, true);

    document.getElementById('bezier_link').addEventListener('click', function(){
        myState.resize();
    }, true);
  
    this.interval = 30;
    setInterval(function(){ myState.draw(); }, myState.interval);
}

CanvasState.prototype.addPoint = function(point){
    if(this.points.length < 4){
        if(this.points.length % 2)
            this.points.push(new Point(point.x,point.y,false));
        else
            this.points.push(new Point(point.x,point.y,true));
    }
    this.valid = false;
}

CanvasState.prototype.resize = function(){
    document.getElementById('bezier_canvas').width = $('#bezier_canvas').closest('.tab-content').width();
    document.getElementById('bezier_canvas').height = window.innerHeight - $('#bezier_canvas').offset().top - $('footer').outerHeight() - 8;

    for(var i = 0; i < this.points.length; i++){
        this.points[i].x = (document.getElementById('bezier_canvas').width / this.width) * this.points[i].x;
        this.points[i].y = (document.getElementById('bezier_canvas').height / this.height) * this.points[i].y;
    }
    $("#bezier_x").text(parseInt((document.getElementById('bezier_canvas').width / this.width) * $("#bezier_x").text()));
    $("#bezier_y").text(parseInt((document.getElementById('bezier_canvas').height / this.height) * $("#bezier_y").text()));
    this.width = document.getElementById('bezier_canvas').width;
    this.height = document.getElementById('bezier_canvas').height;
    this.valid = false;
    this.draw();
}

CanvasState.prototype.clear = function(){
    this.ctx.clearRect(0, 0, this.width, this.height);
}

CanvasState.prototype.reset = function(){
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.valid = false;
    this.points = []; 
    this.dragging = false;
    this.selection = null;
    this.dragoffx = 0;
    this.dragoffy = 0;
}

// While draw is called as often as the INTERVAL variable demands,
// It only ever does something if the canvas gets invalidated by our code
CanvasState.prototype.draw = function(){
    // if our state is invalid, redraw and validate!
    if(!this.valid){
        this.valid = true;
        var ctx = this.ctx;
        var points = this.points;
        this.clear();
    
        // draw all points
        if(points.length >= 2){
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            ctx.lineTo(points[1].x, points[1].y);
            ctx.stroke();
        }

        if(points.length == 4){
            ctx.beginPath();
            ctx.moveTo(points[2].x, points[2].y);
            ctx.lineTo(points[3].x, points[3].y);
            ctx.stroke();
            bezierCurve(points[0], points[1], points[3], points[2], null, ctx);
        }
        ctx.setLineDash([]);

        for(var i = 0; i < points.length; i++){
            var point = points[i];
            points[i].draw(ctx);
        }
    }
}

// Creates an object with x and y defined, set to the mouse position relative to the state's canvas
// If you wanna be super-correct this can be tricky, we have to worry about padding and borders
CanvasState.prototype.getMouse = function(e){
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

function init_bezier(){
    var s = new CanvasState(document.getElementById('bezier_canvas'));
    s.resize();
}

function bezierCurve(P1, P2, P3, P4, Q, ctx){
    var P12 = new Point((P1.x+P2.x)/2, (P1.y+P2.y)/2);
    var P23 = new Point((P2.x+P3.x)/2, (P2.y+P3.y)/2);
    var P34 = new Point((P3.x+P4.x)/2, (P3.y+P4.y)/2);
    var P123 = new Point((P12.x+P23.x)/2, (P12.y+P23.y)/2);
    var P234 = new Point((P23.x+P34.x)/2, (P23.y+P34.y)/2);
    var new_Q = new Point((P123.x+P234.x)/2, (P123.y+P234.y)/2);

    if(!Q){
        drawBLine(ctx, new_Q);
        bezierCurve(P1, P12, P123, new_Q, new_Q, ctx);
        bezierCurve(new_Q, P234, P34, P4, new_Q, ctx);
    }
    else if((Math.abs(Q.x-new_Q.x)+Math.abs(Q.y-new_Q.y)) > 1){
        drawBLine(ctx, new_Q);
        bezierCurve(P1, P12, P123, new_Q, new_Q, ctx);
        bezierCurve(new_Q, P234, P34, P4, new_Q, ctx);
    }
}

function drawBLine(ctx, P){
    ctx.beginPath();
    ctx.arc(P.x, P.y, 1, 0, 2 * Math.PI);
    ctx.fillStyle = '#000000';
    ctx.fill();
    ctx.strokeStyle = '#000000';
    ctx.stroke();
}
