// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'uniform mat4 u_ModelMatrix;\n' +
    'uniform mat4 u_GlobalRotateMatrix;\n' +
    'void main() {\n' +
    '  gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;\n' +
    '}\n';

// Fragment shader program
var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'uniform vec4 u_FragColor;\n' +  // uniformå¤‰æ•°
    'void main() {\n' +
    '  gl_FragColor = u_FragColor;\n' +
    '}\n';

// Global Variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_GlobalRotateMatrix;
function setupWebGL() {
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }
    gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL() {
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    // // Get the storage location of a_Position
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    // Get the storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }

    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
        console.log('Failed to get the storage location of u_ModelMatrix');
        return;
    }
    //Get the storage location of u_GlobalRotateMatrix
    u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
    if (!u_GlobalRotateMatrix) {
        console.log('Failed to get the storage location of u_GlobalRotateMatrix');
        return;
    }
    var identityM = new Matrix4();
    gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// Globals related UI elements
let g_globalAngle = 0;
let g_yellowAngle = 0;
let g_magentaAngle = 0;
let g_yellowAnimation = false;
let g_headAngle = 0;
let shift = false;


//Set up action for the HTML UI elements
function addActionsForHtmlUI() {

    document.getElementById('animationYellowOffButton').onclick = function () { g_yellowAnimation = false; };
    document.getElementById('animationYellowOnButton').onclick = function () { g_yellowAnimation = true; };

    //slider Events
    document.getElementById('yellowSlide').addEventListener('mousemove', function () { g_yellowAngle = this.value; 
        renderAllShapes(); });
    document.getElementById('magentaSlide').addEventListener('mousemove', function () { g_magentaAngle = this.value; 
        renderAllShapes(); });
    document.getElementById('headSlide').addEventListener('mousemove', function () { g_headAngle = this.value; 
        renderAllShapes(); });

    //Size Slider Events
    document.getElementById('angleSlide').addEventListener('mousemove', function () { g_globalAngle = this.value; 
        renderAllShapes(); });
}


var currentAngle = [0.0, 0.0];
function main() {

    //Seet up canvas and gl variables
    setupWebGL();
    //Set up GLSL shader programs and connect GLSL variables
    connectVariablesToGLSL();

    //Set up actions for the HTML UI elements
    addActionsForHtmlUI();

    // Register function (event handler) to be called on a mouse press

    initEventHandlers(canvas, currentAngle);
    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1);

    requestAnimationFrame(tick);
}

function initEventHandlers(canvas, currentAngle) {
    var dragging = false;
    var lastX = -1, lastY = -1;
    canvas.onmousedown = function (ev) {
        var x = ev.clientX, y = ev.clientY;
        var rect = ev.target.getBoundingClientRect();
        if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
            lastX = x; lastY = y;
            dragging = true;
        }
    };
    canvas.onmouseup = function (ev) { dragging = false; };
    canvas.onmousemove = function (ev) {
        var x = ev.clientX, y = ev.clientY;
        if (dragging) {
            var factor = 100 / canvas.height;
            var dx = factor * (x - lastX);
            var dy = factor * (y - lastY);
            currentAngle[0] = Math.max(Math.min(currentAngle[0] + dy, 90.0), -90.0);
            currentAngle[1] = currentAngle[1] + dx;
        }
        lastX = x, lastY = y;
    };
}

var g_startTime = performance.now() / 1000.0;
var g_seconds = performance.now() / 1000.0 - g_startTime;

// Called by browser repeatedly whenever its time
function tick() {
    //save the current time
    //print some debug information so we know we are running
    g_seconds = performance.now() / 1000.0 - g_startTime;
    //console.log(g_seconds);

    //update animation angles
    updateAnimationAngles();

    //Draw everything
    renderAllShapes();

    //Tell the browser to update again when it has time
    requestAnimationFrame(tick);
}

function updateAnimationAngles() {
    if (g_yellowAnimation == true) {
        g_yellowAngle = (12 * Math.sin(g_seconds));
        g_headAngle = (5 * Math.sin(g_seconds));
    }
    if (shift == true) {
        g_yellowAngle2 = (20 * Math.sin(g_seconds));
        g_headAngle2 = (100 * Math.sin(g_seconds));
    }
}
function renderAllShapes() {

    //check the time at the start of this function
    var startTime = performance.now();

    //Pass the matrix to u_ModelMatrix attribute
    //var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);

    var globalRotMat = new Matrix4().rotate(currentAngle[0], 1.0, 0.0, 0.0);
    globalRotMat.rotate(currentAngle[1], 0.0, 1.0, 0.0);
    globalRotMat.rotate(g_globalAngle, 0.0, 1.0, 0.0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clear(gl.COLOR_BUFFER_BIT);

    renderScene();
    var duration = performance.now() - startTime;
    sendTextToHTML("ms:" + Math.floor(duration) + "fps: " + Math.floor(10000 / duration) / 10, "numdot");
}

function sendTextToHTML(text, htmlID) {
    var htmlElm = document.getElementById(htmlID);
    if (!htmlElm) {
        console.log("Failed to get " + htmlID + "from HTML");
        return;
    }
    htmlElm.innerHTML = text;
}

function renderScene() {
    var Sheep_white = [1, 1, 1, 1];
    var face_color = [1, 0.9, 0.6, 1.0];

    var body = new Cube();
    body.color = Sheep_white;
    body.matrix.scale(0.8,0.8,0.8);
    body.matrix.translate(-0.5, -0.5, -0.5);
    body.render();

    var head = new Cube();
    //head.color = Sheep_white;
    head.color =[0.9, 0.9, 0.85, 1]
    head.matrix.rotate(-0, 1, 0, 0);
    head.matrix.scale(0.4, 0.4, 0.4);
    head.matrix.translate(-0.5, 0.65, -1.5);
    head.render();

    var sheep_face = new Cube();
    sheep_face.color = face_color;
    sheep_face.matrix.rotate(-0, 1, 0, 0);
    sheep_face.matrix.scale(0.4, 0.4, 0.03);
    sheep_face.matrix.translate(-0.5, 0.65, -21);
    sheep_face.render();

    var tophair = new Cube();
    tophair.color = Sheep_white;
    tophair.matrix.rotate(-0, 1, 0, 0);
    tophair.matrix.scale(0.4, 0.075, 0.04);
    tophair.matrix.translate(-0.5, 7.8, -16.5);
    tophair.render();

    var left_hair = new Cube();
    left_hair.color = Sheep_white;
    left_hair.matrix.rotate(-0, 1, 0, 0);
    left_hair.matrix.scale(0.05, 0.07, 0.04);
    left_hair.matrix.translate(-4, 7.3, -16.5);
    left_hair.render();

    var botrighthair = new Cube();
    botrighthair.color = Sheep_white;
    botrighthair.matrix.rotate(-0, 1, 0, 0);
    botrighthair.matrix.scale(0.05, 0.07, 0.04);
    botrighthair.matrix.translate(3, 7.3, -16.5);
    botrighthair.render();

    var lefteye = new Cube();
    lefteye.color = [1, 1, 1, 1];
    lefteye.matrix.rotate(-0, 1, 0, 0);
    lefteye.matrix.scale(0.1, 0.06, 0.04);
    lefteye.matrix.translate(-1.5, 7, -16.2);
    lefteye.render();

    var lefteyeblack = new Cube();
    lefteyeblack.color = [0, 0, 0, 1];
    lefteyeblack.matrix.rotate(-0, 1, 0, 0);
    lefteyeblack.matrix.scale(0.05, 0.06, 0.04);
    lefteyeblack.matrix.translate(-3, 7, -16.5);
    lefteyeblack.render();

    var righteye = new Cube();
    righteye.color = [1, 1, 1, 1];
    // righteye.matrix.rotate(-10, 1, 0, 0);
    righteye.matrix.rotate(-0, 1, 0, 0);
    righteye.matrix.scale(0.1, 0.06, 0.04);
    righteye.matrix.translate(0.5, 7, -16.2);
    righteye.render();

    var righteyeblack = new Cube();
    righteyeblack.color = [0, 0, 0, 1];
    // righteyeblack.matrix.rotate(-10, 1, 0, 0);
    righteyeblack.matrix.rotate(-0, 1, 0, 0);
    righteyeblack.matrix.scale(0.05, 0.061, 0.04);
    righteyeblack.matrix.translate(2, 7, -16.5);
    righteyeblack.render();

    // var mouth1 = new Cube();
    // mouth1.color = [1, .8, 0.8, 1];
    // mouth1.matrix.rotate(0, 1, 0, 0);
    // mouth1.matrix.rotate(-0, 1, 0, 0);
    // mouth1.matrix.scale(0.1, 0.071, 0.04);
    // mouth1.matrix.translate(-0.47, 4.2, -16.1);
    // mouth1.render()

    var mouth2 = new Cube();
    mouth2.color = [255, 0, 0, 0.5];
    mouth2.matrix.rotate(0, 1, 0, 0);
    mouth2.matrix.rotate(-0, 1, 0, 0);
    mouth2.matrix.scale(0.05, 0.07, 0.04);
    mouth2.matrix.translate(-0.47, 4.5, -16);
    mouth2.render();

    // var rightLeg = new Cube();
    // rightLeg.color = Sheep_white;
    // rightLeg.matrix.scale(0.05, -0.1, 0.8);
    // rightLeg.matrix.translate(0.05, 0.5, -0.5);
    // rightLeg.render();    

    var frontleftleg = new Cube();
    frontleftleg.color = Sheep_white;
    //frontleftleg.matrix.setTranslate(0,0, 0);
    //frontleftleg.matrix.rotate(-g_Angle,1,0,0); // Joint 1
    //var frontleftlegCoord = new Matrix4(frontleftleg.matrix);
    frontleftleg.matrix.scale(.15, -0.25, 0.15);
    frontleftleg.matrix.translate(-1.7, 1.5, -2);
    frontleftleg.render();

    var frontrightleg = new Cube();
    frontrightleg.color = Sheep_white;
   // frontrightleg.matrix.setTranslate(0, 0, 0);
   // frontrightleg.matrix.rotate(g_Angle,1,0,0); // Joint 1
   // var frontrightlegCoord = new Matrix4(frontrightleg.matrix);
    frontrightleg.matrix.scale(.15, -0.25, 0.15);
    frontrightleg.matrix.translate(0.8, 1.5, -2);
    frontrightleg.render();

    var backleftlegs = new Cube();
  //  backleftlegs.color = Sheep_white;
  //  backleftlegs.matrix.setTranslate(0, 0, 0);
  //  backleftlegs.matrix.rotate(-g_Angle, 1, 0, 0); // Joint 1
  //  var backleftlegsCoord = new Matrix4(backleftlegs.matrix);
    backleftlegs.matrix.scale(.15, -0.25, 0.15);
    backleftlegs.matrix.translate(-1.7, 1.5, 1);
    backleftlegs.render();

    var backright = new Cube();
    backright.color = Sheep_white;
//    backright.matrix.setTranslate(0, 0, 0);
//    backright.matrix.rotate(g_Angle, 1, 0, 0); // Joint 1
//    var backrightCoord = new Matrix4(backright.matrix);
    backright.matrix.scale(.15, -0.25, 0.15);
    backright.matrix.translate(.8, 1.5, 1);
    backright.render();

    var frontleftleglow = new Cube();
    frontleftleglow.color = face_color;
    //frontleftleglow.matrix = frontleftlegCoord;
    //frontleftleglow.matrix.rotate(-g_Angle2, 1, 0, 0);
    frontleftleglow.matrix.scale(0.1, 0.1, 0.1);
    frontleftleglow.matrix.translate(-2.25, -6.8,-2.6);
    frontleftleglow.render();

    var frontrightleglow = new Cube();
    frontrightleglow.color = face_color;
   // frontrightleglow.matrix = frontrightlegCoord;
   // frontrightleglow.matrix.rotate(g_Angle2, 1, 0, 0);
    frontrightleglow.matrix.scale(0.1, 0.1, 0.1);
    frontrightleglow.matrix.translate(1.5, -6.8, -2.6);
    frontrightleglow.render();

    var backleftlegslow = new Cube();
    backleftlegslow.color = face_color;
    //backleftlegslow.matrix = backleftlegsCoord;
    //backleftlegslow.matrix.rotate(-g_Angle2, 1, 0, 0);
    backleftlegslow.matrix.scale(0.1, 0.1, 0.1);
    backleftlegslow.matrix.translate(1.5, -6.8, 1.6);
    backleftlegslow.render();

    var backrightlow = new Cube();
    backrightlow.color = face_color;
    //backrightlow.matrix = backrightCoord;
    //backrightlow.matrix.rotate(g_Angle2, 1, 0, 0);
    backrightlow.matrix.scale(0.1, 0.1, 0.1);
    backrightlow.matrix.translate(-2.25, -6.8, 1.76);
    backrightlow.render();

    var corner1 = new Triangle(); // right side corner
    corner1.color = [0.6,0.3,0,1];
    corner1.matrix.rotate(-0, 1, 0, 0);
    corner1.matrix.scale(0.07, 0.061, 0.04);
    corner1.matrix.translate(2, 10.8, -15.5);
    corner1.render();

    var corner2 = new Triangle(); //right side
    corner2.color = [0.6,0.3,0,1];
    corner2.matrix.rotate(-0, 1, 0, 0);
    corner2.matrix.scale(0.07, 0.061, 0.04);
    corner2.matrix.translate(-2, 10.8, -16.5);
    corner2.render();



}

function funcShiftKey(event) {
    if (event.shiftKey) {
        shift = true;
    } else {
        shift = false;
    }
}


