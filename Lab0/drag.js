var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// Set up the canvas
ctx.fillStyle = '#F0F0F0';	
ctx.fillRect(0, 0, 500, 500); //background fill
 
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
var startPoint = { x: 0, y: 0 };

// Function to draw a line
function drawLine(startPoint, endPoint) {
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(endPoint.x, endPoint.y);
    ctx.stroke();
}

// Handle mouse clicks
canvas.addEventListener("mousedown", function(event) {
    if (event.button === 0) { // Left click
        isPressed = true;
        startPoint = { x: event.offsetX, y: event.offsetY };
        console.log("Start Point:", startPoint);
    }
});

// Handle mouse release
canvas.addEventListener("mouseup", function(event) {
    if (isPressed) {
        isPressed = false;
        var endPoint = { x: event.offsetX, y: event.offsetY };
        console.log("End Point:", endPoint);
        drawLine(startPoint, endPoint);
    }
});


