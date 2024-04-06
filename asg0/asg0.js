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
    elements: [2.25,2.25] // Example vector components
  };
  drawVector(v1, "red"); // step #2
  

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

function handleDrawEvent(){
  ctx.clearRect(0,0,canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set color to black
  ctx.fillRect(0, 0, canvas.width, canvas.height);// Fill a rectangle with the color
  let v1x = document.getElementById("1x").value;
  let v1y = document.getElementById("1y").value;
  var v1 = new Vector3([v1x,v1y,0]);
  drawVector(v1,"red");//done with step #3

  let v2x = document.getElementById("2x").value;
  let v2y = document.getElementById("2y").value;
  let v2 = new Vector3([v2x,v2y,0]);
  drawVector(v2,"blue"); // done with step #4

} 

function handleDrawOperationEvent(){
  ctx.clearRect(0,0,canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set color to black
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let v1x = document.getElementById("1x").value;
  let v1y = document.getElementById("1y").value;
  var v1 = new Vector3([v1x,v1y,0]);
  drawVector(v1,"red");

  let v2x = document.getElementById("2x").value;
  let v2y = document.getElementById("2y").value;
  let v2 = new Vector3([v2x,v2y,0]);
  drawVector(v2,"blue"); 
  
  
  let op = document.getElementById("op").value;
  let scalar = document.getElementById("scalar").value;

  if (op == "add") {
    let v3 = new Vector3([0,0,0]);
    v3.add(v1);
    v3.add(v2);
    drawVector(v3,"green");
  }
  else if(op == "sub"){
    let v3 = new Vector3([0,0,0]);
    v3.add(v1);
    v3.sub(v2);
    drawVector(v3,"green");
  }
  else if(op == "mul"){
    let v3 = v1;
    let v4 = v2;
    v3.mul(scalar);
    v4.mul(scalar);
    drawVector(v3,"green");
    drawVector(v4,"green");
  }
  else if(op == "div"){
    let v3 = v1;
    let v4 = v2;
    v3.div(scalar);
    v4.div(scalar);
    drawVector(v3,"green");
    drawVector(v4,"green");
  }
  else if(op == "mag"){
    console.log("Magnitude v1:", v1.magnitude());
    console.log("Magnitude v2:", v2.magnitude());
  }
  else if(op == "nor"){
    v1.normalize();
    v2.normalize();
    drawVector(v1,"green");
    drawVector(v2,"green");
  }
  else if(op =="ang"){

    angleBetween(v1,v2);
  }
  else if(op == "area"){
    areaTriangle(v1,v2);
  }
}

function angleBetween(v1,v2){
  let d = Vector3.dot(v1,v2);
  let v1mag = v1.magnitude();
  let v2mag = v2.magnitude();
  let x = (Math.acos(d/(v1mag*v2mag)*(180/Math.PI)).toFixed(2));
  console.log("Angle:",x);
  console.log("Angle in Degree:",x * (180 / Math.PI));
}


function areaTriangle(v1, v2){
  var a = Vector3.cross(v1, v2);
  var v1 = new Vector3([a[0], a[1], a[2]]);
  var b = v1.magnitude()/2;
  console.log("Area of the triangle:", b);
}

