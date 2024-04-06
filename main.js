// Google Sheets API
const apiKey = 'AIzaSyBu5Cbjy0Bu-y6P7dVAjOy1eWdrhxVEUN4';
const sheetId = '1fcldAYsE92IPwbhfAQs1PMVcHW8WNM_r2L4CkoKrJD0';
const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A2:F201?key=${apiKey}`;

let camera, scene, renderer, controls;
var hblur, vblur;
let targets = {simple: [], table: [], sphere: [], helix: [], grid: []};

init();
animate();

function init() {

    initCamera();

    initScene();

   // initObjects();

    addClickListeners();

    initRenderer();

    fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        if (data && data.values) {
            const tableData = data.values; 
            initObjects(tableData); 
            addClickListeners();
            transform(targets.table, 2000);
            window.addEventListener('resize', onWindowResize, false);
            console.log('Successfully loaded data.');
        } else {
            console.error('Error: Data values are missing or invalid.');
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

    initTrackbarControls();

    transform(targets.table, 2000);

    window.addEventListener('resize', onWindowResize, false);

}

function initCamera() {

    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 3000;

}

function initScene() {

    scene = new THREE.Scene();

}

function initRenderer() {

    renderer = new THREE.CSS3DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('container').appendChild(renderer.domElement);
}

function initObjects(tableData) {

    simpleObjectsLayout(tableData);
     // Check if tableData is provided
     if (tableData) {
        simpleObjectsLayout(tableData);
        generateGeometricLayouts();
    } else {
        // If tableData is not provided, log an error message
        console.error('No table data provided.');
    }

}

function addClickListeners() {

    addClickListener(targets.table, 'table');
    addClickListener(targets.sphere, 'sphere');
    addClickListener(targets.helix, 'helix');
    addClickListener(targets.grid, 'grid');

}

function simpleObjectsLayout(tableData) {
    console.log('Data:', tableData);
    if (!Array.isArray(tableData) || tableData.length === 0) {
        console.error('Error: tableData is not an array or is empty.');
        return;
    }

    const numColumns = 20;
    const numRows = 10;

    for (let i = 0; i < tableData.length; i++) {
        let object = new THREE.CSS3DObject(htmlElement(tableData, i));
        const col = i / 5 % numColumns;
        const row = Math.floor(i / 5 / numColumns);
        object.position.x = (col * 140) - (numColumns * 140) / 2 + 70; 
        object.position.y = -(row * 180) + (numRows * 180) / 2 - 90; 
        object.position.z = Math.random() * 4000 - 2000;

        scene.add(object);
        targets.simple.push(object);
        tableLayout(tableData, i, col, row);
    }
} 


// Define the htmlElement function
function htmlElement(tableData, i) {
    console.log('Index:', i);
    console.log('Data:', tableData[i]);


    let element = document.createElement('div');
    element.className = 'element';
    let netWorth = parseFloat(tableData[i][5].replace(/[^0-9.-]+/g,"")); // Extract numeric value from Net Worth

    // Set border color based on Net Worth
    if (netWorth < 100000) {
        element.style.borderColor = 'rgba(239, 48, 34)'; // Red
        element.style.boxShadow = '0 0 10px rgba(239, 48, 34, 0.5)'; // Red shadow
        element.style.background = 'linear-gradient(to bottom, rgba(239, 48, 34, 0.25), transparent)'; // Red gradient
    } else if (netWorth >= 100000 && netWorth < 200000) {
        element.style.borderColor = 'rgba(253, 202, 53)'; // Orange
        element.style.boxShadow = '0 0 10px rgba(253, 202, 53, 0.5)'; // Orange shadow
        element.style.background = 'linear-gradient(to bottom, rgba(253, 202, 53, 0.25), transparent)'; // Orange gradient
    } else {
        element.style.borderColor = 'rgba(58, 159, 72)'; // Green
        element.style.boxShadow = '0 0 10px rgba(58, 159, 72, 0.5)'; // Green shadow
        element.style.background = 'linear-gradient(to bottom, rgba(58, 159, 72, 0.25), transparent)'; // Green gradient
    }
    
    
 
    element.style.borderWidth = '4px'; 

    let name = document.createElement('div');
    name.className = 'name';
    name.textContent = tableData[i][0]; 
    element.appendChild(name);

    let image = document.createElement('img');
    image.src = tableData[i][1]; 
    image.className = 'photo'; 
    element.appendChild(image);

    let details = document.createElement('div');
    details.className = 'details';
    details.innerHTML = `Age: ${tableData[i][2]}<br>Country: ${tableData[i][3]}<br>Interest: ${tableData[i][4]}<br>Net Worth: ${tableData[i][5]}`;
    element.appendChild(details);

     // Add click event listener
     element.addEventListener('click', () => {
        console.log('Element clicked:', i);
        elementClickHandler(i);
    }, false);

    return element;
}





function elementClickHandler(i) {
    transform(targets.table, 1000);

    const index = Math.floor(i / 5); // Ensure index is an integer
    const targetPosition = targets.simple[index].position;

    new TWEEN.Tween(targetPosition)
        .to({
            x: 0,
            y: 0,
            z: 2500
        }, Math.random() * 2000 + 2000)
        .easing(TWEEN.Easing.Exponential.InOut)
        .start();

    new TWEEN.Tween(this)
        .to({}, 2000 * 2)
        .onUpdate(render)
        .start();
}


function tableLayout(table, index, col, row) {
    let object = new THREE.Object3D();

    object.position.x = (col * 140) - 1330;
    object.position.y = -(row * 180) + 990;
    targets.table.push(object);
}


function addClickListener(target, elementId) {

    const button = document.getElementById(elementId);

    button.addEventListener('click', function () {
        transform(target, 2000);
    }, false);

}

function initTrackbarControls() {
    controls = new THREE.TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 0.5;
    controls.minDistance = 500;
    controls.maxDistance = 6000;
    controls.addEventListener('change', render);
}

function generateGeometricLayouts() {

    let sphereVector = new THREE.Vector3();
    let helixVector1 = new THREE.Vector3();
    let helixVector2 = new THREE.Vector3();
   
   

    for (let i = 0, l = targets.simple.length; i < l; i++) {
        addSphereObject(sphereVector, i, l);
        addHelixObjects(helixVector1, helixVector2, i);
        addGridObject(i);
    }

}

function addSphereObject(sphereVector, index, length) {

    const phi = Math.acos(-1 + (2 * index) / length);
    const theta = Math.sqrt(length * Math.PI) * phi;
    let object = new THREE.Object3D();

    object.position.setFromSphericalCoords(800, phi, theta);

    sphereVector.copy(object.position).multiplyScalar(2);

    object.lookAt(sphereVector);

    targets.sphere.push(object);
}

function addHelixObjects() {
    const numObjectsPerHelix = 50; // Number of objects per helix
    const helixSeparationDistance = 1000; // Separation distance between helixes

    for (let i = 0; i < numObjectsPerHelix; i++) {
        // First helix
        const theta1 = i * 0.175 + Math.PI;
        const y1 = -(i * 8) + 450;
        let object1 = new THREE.Object3D();
        object1.position.setFromCylindricalCoords(900, theta1, y1);

        // Second helix
        const theta2 = theta1 + Math.PI; // Shift the angle for the second helix
        const y2 = y1; // Keep the same y-coordinate
        let object2 = new THREE.Object3D();
        object2.position.setFromCylindricalCoords(900, theta2, y2);

        // Adjust the position of the second helix to separate it from the first one
        object2.position.x += helixSeparationDistance;

        // Determine the vector for looking at the center
        let helixVector = new THREE.Vector3(0, 0, 0);

        // Set the lookAt direction for both helixes
        object1.lookAt(helixVector);
        object2.lookAt(helixVector);

        // Push objects into respective targets
        targets.helix.push(object1);
        targets.helix.push(object2);
    }
}



function addGridObject(index) {

    let object = new THREE.Object3D();
    object.position.x = ((index % 5) * 400) - 800;
    object.position.y = (-(Math.floor(index / 5) % 4) * 400) + 800;
    object.position.z = (Math.floor(index / 20)) * 1000 - 2000;
    targets.grid.push(object);

}

function transform(target, duration) {

    TWEEN.removeAll();

    for (let i = 0; i < targets.simple.length; i++) {
        let object = targets.simple[i];
        let targetObject = target[i];
        transformObjectPosition(object, targetObject, duration);
        transformObjectRotation(object, targetObject, duration);
    }

    new TWEEN.Tween(this)
        .to({}, duration * 2)
        .onUpdate(render)
        .start();

}

function transformObjectPosition(object, targetObject, duration) {

    new TWEEN.Tween(object.position)
        .to({
            x: targetObject.position.x,
            y: targetObject.position.y,
            z: targetObject.position.z
        }, Math.random() * duration + duration)
        .easing(TWEEN.Easing.Exponential.InOut)
        .start();

}

function transformObjectRotation(object, targetObject, duration) {

    new TWEEN.Tween(object.rotation)
        .to({
            x: targetObject.rotation.x,
            y: targetObject.rotation.y,
            z: targetObject.rotation.z
        }, Math.random() * duration + duration)
        .easing(TWEEN.Easing.Exponential.InOut)
        .start();

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();

}

function render() {

    renderer.render(scene, camera);

}

function animate() {

    requestAnimationFrame(animate);
    TWEEN.update();
    controls.update();

    
}
