var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
    
ctx.fillStyle = '#F0F0F0';	
ctx.fillRect(0, 0, c.width, c.height);

    // Draw horizontal red axis
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.moveTo(0, 250); //start 
    ctx.lineTo(500,250); // dst 
    ctx.stroke();

    // Draw vertical green axis
    ctx.strokeStyle = "green";
    ctx.beginPath();
    ctx.moveTo(250,0);
    ctx.lineTo(250,500);
    ctx.stroke();

