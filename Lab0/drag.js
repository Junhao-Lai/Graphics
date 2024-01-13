var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
    
ctx.fillStyle = '#F0F0F0';	
ctx.fillRect(0, 0, c.width, c.height);

    // Draw horizontal red axis
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.moveTo(0, c.height / 2);
    ctx.lineTo(c.width, c.height / 2);
    ctx.stroke();

    // Draw vertical green axis
    ctx.strokeStyle = "green";
    ctx.beginPath();
    ctx.moveTo(c.width / 2, 0);
    ctx.lineTo(c.width / 2, c.height);
    ctx.stroke();
    
