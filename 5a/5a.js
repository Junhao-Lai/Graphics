import * as THREE from 'three';
import {OrbitControls} from './lib/OrbitControls.js';
import {OBJLoader} from './lib/OBJLoader.js';
import {MTLLoader} from './lib/MTLLoader.js';
import {GUI} from './lib/lil-gui.module.min.js';

function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({canvas});
    renderer.outputEncoding = THREE.sRGBEncoding;

    const fov = 35;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 10, 20);

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 5, 0);
    controls.update();

    const scene = new THREE.Scene();

    {
        const color = "orange";
        const density = 0.01;
        scene.fog = new THREE.FogExp2(color, density);
    }


    {
        const mtlLoader = new MTLLoader();
        mtlLoader.load('./models/windmill/windmill_001.mtl', (mtl) => {
            mtl.preload();
            const objLoader = new OBJLoader();
            mtl.materials.Material.side = THREE.DoubleSide;
            objLoader.setMaterials(mtl);
            objLoader.load('./models/windmill/windmill_001.obj', (root) => {
                //scene.position.y = 9;
                scene.add(root);
            });
        });
    }

    {
        const planeSize = 40;

        const loader = new THREE.TextureLoader();
        const texture = loader.load('pitch.jpg');
        texture.encoding = THREE.sRGBEncoding;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.magFilter = THREE.NearestFilter;
        const repeats = planeSize / 20;
        texture.repeat.set(repeats, repeats);

        const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
        const planeMat = new THREE.MeshPhongMaterial({
            map: texture,
            side: THREE.DoubleSide,
        });
        const mesh = new THREE.Mesh(planeGeo, planeMat);
        mesh.rotation.x = Math.PI * 1.5;
        scene.add(mesh);
    }

    {
        const skyColor = 0xB1E1FF;  // light blue
        const groundColor = 0xB97A20;  // brownish orange
        const intensity = 0.6;
        const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
        scene.add(light);
    }

    {
        const color = 0xFFFFFF;
        const intensity = 0.8;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(5, 10, 2);
        scene.add(light);
        scene.add(light.target);
    }

    const boxWidth = 2;
    const boxHeight = 2;
    const boxDepth = 2;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    //const loader = new THREE.TextureLoader();
    function makeInstance(geometry, color, x, y, z) {
        const loader = new THREE.TextureLoader();
    	const texture = loader.load('logo.png');

        const material = new THREE.MeshBasicMaterial( {
            map: texture
        } );

        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        cube.position.x = x;
        cube.position.y = y;
        cube.position.z = z;
        return cube;
    }

    const cubes = [
        makeInstance(geometry, 0x44aa88, -1, 1, -3),
        makeInstance(geometry, 0x8844aa, -19, 1, 1),
        makeInstance(geometry, 0xaa8844, 19, 1, 1),
        makeInstance(geometry, 0xaa8844, 19, 1, 19),
        makeInstance(geometry, 0xaa8844, 19, 1, 10),
        makeInstance(geometry, 0xaa8844, 19, 1, -10),
        makeInstance(geometry, 0xaa8844, 19, 1, -19),
        makeInstance(geometry, 0xaa8844, -19, 1, 10),
        makeInstance(geometry, 0xaa8844, -19, 1, 19),
        makeInstance(geometry, 0xaa8844, -19, 1, -10),
        makeInstance(geometry, 0xaa8844, -19, 1, -19),
        makeInstance(geometry, 0xaa8844, -1, 1, 19),
        makeInstance(geometry, 0xaa8844, -1, 1, -19),
    ];

    {
        const loader = new THREE.TextureLoader();
        const texture = loader.load('barca.jpg',
            () => {
                const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
                rt.fromEquirectangularTexture(renderer, texture);
                scene.background = rt.texture;
            });
    }


    const trunkRadius = .2;
    const trunkHeight = 1;
    // const trunkRadialSegments = 12;
    // const trunkGeometry = new THREE.CylinderGeometry(
    //     trunkRadius, trunkRadius, trunkHeight, trunkRadialSegments);

    const topRadius = trunkRadius * 4;
    const topHeight = trunkHeight * 2;
    const topSegments = 12;
    const topGeometry = new THREE.ConeGeometry(
        topRadius, topHeight, topSegments);

    //const trunkMaterial = new THREE.MeshPhongMaterial({color: 'brown'});
    const topMaterial = new THREE.MeshPhongMaterial({color: 'gray'});

    function makeTree(x, z) {
        const root = new THREE.Object3D();
        //const trunk = new THREE.Mesh(trunkGeometry);
        //trunk.position.y = trunkHeight / 2;
        //root.add(trunk);

        const top = new THREE.Mesh(topGeometry, topMaterial);
        top.position.y = trunkHeight + topHeight / 2;
        root.add(top);

        root.position.set(x, -1, z);
        scene.add(root);

        return root;
    }
    makeTree(7,1);
    makeTree(-7,1);
    makeTree(-15,1);
    makeTree(15,1);

    {
        const sphereRadius = 3;
        const sphereWidthDivisions = 32;
        const sphereHeightDivisions = 16;
        const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
        const sphereMat = new THREE.MeshPhongMaterial({color: '#CA8'});
        const mesh = new THREE.Mesh(sphereGeo, sphereMat);
        mesh.position.set(-sphereRadius - 5, sphereRadius + 10, 0);
        scene.add(mesh);
    }

    {
        const sphereRadius = 3;
        const sphereWidthDivisions = 32;
        const sphereHeightDivisions = 16;
        const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
        const sphereMat = new THREE.MeshPhongMaterial({color: '#CA8'});
        const mesh = new THREE.Mesh(sphereGeo, sphereMat);
        mesh.position.set(-sphereRadius + 10, sphereRadius + 10, 0);
        scene.add(mesh);
    }

    {
        const sphereRadius = 3;
        const sphereWidthDivisions = 32;
        const sphereHeightDivisions = 16;
        const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
        const sphereMat = new THREE.MeshPhongMaterial({color: '#CA8'});
        const mesh = new THREE.Mesh(sphereGeo, sphereMat);
        mesh.position.set(-sphereRadius + 3, sphereRadius + 10, 10);
        scene.add(mesh);
    }
    {
        const sphereRadius = 3;
        const sphereWidthDivisions = 32;
        const sphereHeightDivisions = 16;
        const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
        const sphereMat = new THREE.MeshPhongMaterial({color: '#CA8'});
        const mesh = new THREE.Mesh(sphereGeo, sphereMat);
        mesh.position.set(-sphereRadius + 3, sphereRadius + 10, -10);
        scene.add(mesh);
    }

    // function frameArea(sizeToFitOnScreen, boxSize, boxCenter, camera) {
    //     const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5;
    //     const halfFovY = THREE.MathUtils.degToRad(camera.fov * .5);
    //     const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);
    //     // compute a unit vector that points in the direction the camera is now
    //     // in the xz plane from the center of the box
    //     const direction = (new THREE.Vector3())
    //         .subVectors(camera.position, boxCenter)
    //         .multiply(new THREE.Vector3(1, 0, 1))
    //         .normalize();
    //
    //     // move the camera to a position distance units way from the center
    //     // in whatever direction the camera was from the center already
    //     camera.position.copy(direction.multiplyScalar(distance).add(boxCenter));
    //
    //     // pick some near and far values for the frustum that
    //     // will contain the box.
    //     camera.near = boxSize / 100;
    //     camera.far = boxSize * 100;
    //
    //     camera.updateProjectionMatrix();
    //
    //     // point the camera to look at the center of the box
    //     camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);
    // }

    class ColorGUIHelper {
        constructor(object, prop) {
            this.object = object;
            this.prop = prop;
        }

        get value() {
            return `#${this.object[this.prop].getHexString()}`;
        }

        set value(hexString) {
            this.object[this.prop].set(hexString);
        }
    }

    function makeXYZGUI(gui, vector3, name, onChangeFn) {
        const folder = gui.addFolder(name);
        folder.add(vector3, 'x', -10, 10).onChange(onChangeFn);
        folder.add(vector3, 'y', 0, 10).onChange(onChangeFn);
        folder.add(vector3, 'z', -10, 10).onChange(onChangeFn);
        folder.open();
    }

    {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(0, 10, 0);
    light.target.position.set(-5, 0, 0);
    scene.add(light);
    scene.add(light.target);

    const helper = new THREE.DirectionalLightHelper(light);
    scene.add(helper);

    function updateLight() {
        light.target.updateMatrixWorld();
        helper.update();
    }
    updateLight();

    const gui = new GUI();
    gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
    gui.add(light, 'intensity', -2, 5, 0.01);

    makeXYZGUI(gui, light.position, 'position', updateLight);
    makeXYZGUI(gui, light.target.position, 'target', updateLight);
}


//billboard
    const bodyRadiusTop = .4;
    const bodyRadiusBottom = .2;
    const bodyHeight = 2;
    const bodyRadialSegments = 6;
    const bodyGeometry = new THREE.CylinderGeometry(
        bodyRadiusTop, bodyRadiusBottom, bodyHeight, bodyRadialSegments);

    const headRadius = bodyRadiusTop * 0.8;
    const headLonSegments = 12;
    const headLatSegments = 5;
    const headGeometry = new THREE.SphereGeometry(
        headRadius, headLonSegments, headLatSegments);

    function makeLabelCanvas(baseWidth, size, name) {
        const borderSize = 2;
        const ctx = document.createElement('canvas').getContext('2d');
        const font =  `${size}px bold sans-serif`;
        ctx.font = font;
        // measure how long the name will be
        const textWidth = ctx.measureText(name).width;

        const doubleBorderSize = borderSize * 2;
        const width = baseWidth + doubleBorderSize;
        const height = size + doubleBorderSize;
        ctx.canvas.width = width;
        ctx.canvas.height = height;

        // need to set font again after resizing canvas
        ctx.font = font;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';

        ctx.fillStyle = 'blue';
        ctx.fillRect(0, 0, width, height);

        // scale to fit but don't stretch
        const scaleFactor = Math.min(1, baseWidth / textWidth);
        ctx.translate(width / 2, height / 2);
        ctx.scale(scaleFactor, 1);
        ctx.fillStyle = 'white';
        ctx.fillText(name, 0, 0);

        return ctx.canvas;
    }

    function makePerson(x, z, labelWidth, size, name, color) {
        const canvas = makeLabelCanvas(labelWidth, size, name);
        const texture = new THREE.CanvasTexture(canvas);
        // because our canvas is likely not a power of 2
        // in both dimensions set the filtering appropriately.
        texture.minFilter = THREE.LinearFilter;
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;

        const labelMaterial = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
        });
        const bodyMaterial = new THREE.MeshPhongMaterial({
            color,
            flatShading: true,
        });

        const root = new THREE.Object3D();
        root.position.x = x;
        root.position.y = 2;
        root.position.z = z;
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        root.add(body);
        body.position.y = bodyHeight / 2;

        const head = new THREE.Mesh(headGeometry, bodyMaterial);
        root.add(head);
        head.position.y = bodyHeight + headRadius * 1.1;

        // if units are meters then 0.01 here makes size
        // of the label into centimeters.
        const labelBaseScale = 0.01;
        const label = new THREE.Sprite(labelMaterial);
        root.add(label);
        label.position.y = head.position.y + headRadius + size * labelBaseScale;

        label.scale.x = canvas.width  * labelBaseScale;
        label.scale.y = canvas.height * labelBaseScale;

        scene.add(root);
        return root;
    }

    makePerson(-19,1, 150, 32, 'West', 'purple');
    makePerson(-0.8,3, 150, 32, 'Middle', 'green');
    makePerson(19,1, 150, 32, 'East', 'red');
    makePerson(-0.8,19, 150, 32, 'South', 'blue');
    makePerson(-0.8,-19, 150, 32, 'North', 'white');

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

    function render(time) {
        time *= 0.001;
        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        cubes.forEach((cube, ndx) =>{
            const speed = 1 + ndx * .1;
            const rot = time * speed;
            cube.rotation.x = rot;
            cube.rotation.y = rot;
        });
        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

main();