var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// Set up the canvas
ctx.fillStyle = '#F0F0F0';	
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Draw horizontal x-axis red axis
ctx.strokeStyle = "red";
ctx.beginPath();
ctx.moveTo(0, 250);
ctx.lineTo(500, 250);
ctx.stroke();

// Draw vertical y-axis green axis
ctx.strokeStyle = "green";
ctx.beginPath();
ctx.moveTo(250, 0);
ctx.lineTo(250, 500);
ctx.stroke();

var isPressed = false;
var startPoint = { 
    x: 0, 
    y: 0 
};

var lines = []; // Array to store lines

// Function to draw a line
function drawLine(startPoint, endPoint) {
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(endPoint.x, endPoint.y);
    ctx.stroke();
}

// Handle mouse clicks (Click handler)
canvas.addEventListener("mousedown", function(event) {
    if (event.button === 0) { // Left click
        isPressed = true;
        startPoint = { 
            x: event.offsetX, 
            y: event.offsetY 
        };
        console.log("Start Point:", startPoint);
    }
});

// Handle mouse release (un-clicked handler)
canvas.addEventListener("mouseup", function(event) {
    if (isPressed) {
        isPressed = false;
        var endPoint = { 
            x: event.offsetX,
            y: event.offsetY 
        };
        console.log("End Point:", endPoint);
        lines.push({ start: startPoint, end: endPoint }); // Store the line
    }
});

//鼠标移动时候 (move handler)
canvas.addEventListener("mousemove", function(event) {
    if (isPressed) {
        var endPoint = { 
            x: event.offsetX, 
            y: event.offsetY 
        }

        // Clear the canvas for a new line (clean up the previous frame)
        clearCanvas();

        // Draw the stored lines (previous lines)
        oldLines();

        // Draw the current line dynamically
        drawLine(startPoint, endPoint);
    }
});


function oldLines() {
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        drawLine(line.start, line.end);
    }
}


function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#F0F0F0';	
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Redraw axes
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.moveTo(0, 250);
    ctx.lineTo(500, 250);
    ctx.stroke();

    ctx.strokeStyle = "green";
    ctx.beginPath();
    ctx.moveTo(250, 0);
    ctx.lineTo(250, 500);
    ctx.stroke();
}
