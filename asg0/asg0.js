var canvas = document.getElementById('A1');  
var ctx = canvas.getContext('2d');

function main() {  
  // Retrieve <canvas> element
  var canvas = document.getElementById('A1');  
  if (!canvas) { 
    console.log('Failed to retrieve the <canvas> element');
    return false; 
  } 

  // Get the rendering context for 2DCG
  //var canvas = document.getElementById('A1');  
  //window.ctx = canvas.getContext("2d");
  // Draw a 黑 rectangle
  ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set color to black
  ctx.fillRect(0, 0, canvas.width, canvas.height);        // Fill a rectangle with the color


  let v1 = {
    elements: [2.25, 2.25] // Example vector components
  };
  drawVector(v1, "red");
  

}

// function handleDrawEvent(){
//   let v1 = document.getElementById("name").value;
//   console.log(v1);
//   var canvas = document.getElementById('A1');  
//   var ctx = canvas.getContext('2d');
//   ctx.strokeStyle = 'red'; 
//   let cx = canvas.width/2;
//   let cy = canvas.height/2;
//   ctx.beginPath();
//   ctx.moveTo(cx,cy);
//   ctx.lineTo(cx + 75, cy + 50);
//   ctx.stroke();
// }

function drawVector(v,color){

  ctx.strokeStyle = color;
  let cx = canvas.width/2;
  let cy = canvas.height/2;
  ctx.beginPath();
  ctx.moveTo(cx,cy);
  ctx.lineTo(cx+v.elements[0]*20, cy-v.elements[1]*20);
  ctx.stroke();
}

