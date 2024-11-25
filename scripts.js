let scene, camera, renderer;
let blender, blade, objectToBlend;
let objectsInBlender = [];
let diamonds = 0;
let isBlenderOn = false;
let blenderMode = "Normal";
let bladeSpeed = 1;

// Initialize the scene
function init() {
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeeeeee);

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Lights
    const light = new THREE.AmbientLight(0x404040, 2); // Soft light
    scene.add(light);

    // Spot light
    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(10, 10, 10);
    scene.add(spotLight);

    // Blender Base and Glass
    const blenderGeometry = new THREE.CylinderGeometry(1, 1, 3, 32);
    const blenderMaterial = new THREE.MeshStandardMaterial({ color: 0x8e8e8e });
    blender = new THREE.Mesh(blenderGeometry, blenderMaterial);
    blender.position.set(0, -1, 0);
    scene.add(blender);

    // Blender Blade
    const bladeGeometry = new THREE.BoxGeometry(0.2, 0.5, 2);
    const bladeMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
    blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
    blade.position.set(0, 0, 0);
    blender.add(blade);

    // Blender Glass
    const glassGeometry = new THREE.CylinderGeometry(1, 1, 3, 32);
    const glassMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 });
    const glass = new THREE.Mesh(glassGeometry, glassMaterial);
    glass.position.set(0, 1.5, 0);
    blender.add(glass);

    // Event Listeners for Blender Buttons
    document.getElementById('start-blender').addEventListener('click', startBlender);
    document.getElementById('stop-blender').addEventListener('click', stopBlender);
    document.getElementById('toggle-mode').addEventListener('click', toggleMode);

    // Spawn Buttons
    document.getElementById('spawn-banana').addEventListener('click', () => spawnObject('banana'));
    document.getElementById('spawn-hammer').addEventListener('click', () => spawnObject('hammer'));
    document.getElementById('spawn-duck').addEventListener('click', () => spawnObject('duck'));

    animate();
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    if (isBlenderOn) {
        blade.rotation.x += 0.1 * bladeSpeed; // Simulate fast rotation
    }

    renderer.render(scene, camera);
}

// Blender Controls
function startBlender() {
    isBlenderOn = true;
    bladeSpeed = blenderMode === "Turbo" ? 2 : 1;
    document.getElementById('start-blender').disabled = true;
    document.getElementById('stop-blender').disabled = false;
}

function stopBlender() {
    isBlenderOn = false;
    bladeSpeed = 0;
    document.getElementById('start-blender').disabled = false;
    document.getElementById('stop-blender').disabled = true;
}

function toggleMode() {
    blenderMode = blenderMode === "Normal" ? "Turbo" : "Normal";
    bladeSpeed = blenderMode === "Turbo" ? 2 : 1;
}

// Object Spawning
function spawnObject(type) {
    const object = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0x888888 })
    );

    object.position.set(Math.random() * 2 - 1, 2, 0);
    object.type = type;
    scene.add(object);

    objectsInBlender.push(object);
}

// Object Interaction
function interactWithBlender(object) {
    if (isBlenderOn) {
        // Simulate blending
        object.position.set(0, -1, 0); // Drop object into blender
        object.scale.set(0.1, 0.1, 0.1); // Simulate blending (shrinking the object)
        diamonds += 5; // Reward
        document.getElementById("diamonds").innerText = diamonds;
    }
}

// Shop
document.getElementById("shop-btn").addEventListener("click", () => {
    const shopItems = document.getElementById("shop-items");
    shopItems.style.display = shopItems.style.display === "none" ? "block" : "none";
});

// Start Game
init();
