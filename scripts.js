let scene, camera, renderer;
let blender, blade, glass, objectToBlend;
let diamonds = 0;
let isBlenderOn = false;
let blenderMode = "Normal";
let bladeSpeed = 1;
let objectsInBlender = [];

// Physics world setup
let world, material, groundMaterial;

// Sound Effects
let blenderSound, objectBlenderSound, turboSound;

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

    // Physics world setup
    world = new CANNON.World();
    world.gravity.set(0, -9.82, 0); // Gravity
    world.broadphase = new CANNON.NaiveBroadphase();
    world.solver.iterations = 10;

    material = new CANNON.Material();
    groundMaterial = new CANNON.Material();

    // Sound Effects (Using Howler.js)
    blenderSound = new Howl({ src: ['blender_sound.mp3'], loop: true });
    objectBlenderSound = new Howl({ src: ['object_blend.mp3'] });
    turboSound = new Howl({ src: ['turbo_sound.mp3'], loop: false });

    // Lights
    const light = new THREE.AmbientLight(0x404040, 2);
    scene.add(light);

    // Spot light
    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(10, 10, 10);
    scene.add(spotLight);

    // Blender setup
    const blenderGeometry = new THREE.CylinderGeometry(1, 1, 3, 32);
    const blenderMaterial = new THREE.MeshStandardMaterial({ color: 0x8e8e8e });
    blender = new THREE.Mesh(blenderGeometry, blenderMaterial);
    blender.position.set(0, -1, 0);
    scene.add(blender);

    // Blade setup
    const bladeGeometry = new THREE.BoxGeometry(0.2, 0.5, 2);
    const bladeMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
    blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
    blade.position.set(0, 0, 0);
    blender.add(blade);

    // Glass setup
    const glassGeometry = new THREE.CylinderGeometry(1, 1, 3, 32);
    const glassMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, opacity: 0.5, transparent: true });
    glass = new THREE.Mesh(glassGeometry, glassMaterial);
    glass.position.set(0, 1, 0);
    blender.add(glass);

    // Event listeners for buttons
    document.getElementById("start-blender").addEventListener("click", startBlender);
    document.getElementById("stop-blender").addEventListener("click", stopBlender);
    document.getElementById("toggle-mode").addEventListener("click", toggleMode);
    document.getElementById("spawn-banana").addEventListener("click", () => spawnObject("banana"));
    document.getElementById("spawn-hammer").addEventListener("click", () => spawnObject("hammer"));
    document.getElementById("spawn-duck").addEventListener("click", () => spawnObject("duck"));
    document.getElementById("shop-btn").addEventListener("click", toggleShop);

    // Resize handling
    window.addEventListener("resize", onWindowResize);

    // Start the animation loop
    animate();
}

// Animate loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    world.step(1 / 60);

    if (isBlenderOn) {
        blade.rotation.z += bladeSpeed * 0.1;
    }
}

// Blender functionality
function startBlender() {
    isBlenderOn = true;
    blenderSound.play();
    objectBlenderSound.play();
}

function stopBlender() {
    isBlenderOn = false;
    blenderSound.stop();
    objectBlenderSound.stop();
}

function toggleMode() {
    blenderMode = blenderMode === "Normal" ? "Turbo" : "Normal";
    bladeSpeed = blenderMode === "Turbo" ? 2 : 1;
    turboSound.play();
    alert(`Blender is now in ${blenderMode} mode!`);
}

function spawnObject(type) {
    let object;
    let objectColor;

    // Set object color based on type
    if (type === "banana") objectColor = 0xfff000;
    else if (type === "hammer") objectColor = 0x7a7a7a;
    else if (type === "duck") objectColor = 0x0099ff;

    object = createObject(objectColor);

    // Apply physics for object interaction
    const physicsShape = new CANNON.Sphere(0.3);
    const objectBody = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 2, 0),
        shape: physicsShape
    });
    world.addBody(objectBody);

    // Add the object to the blender scene
    objectsInBlender.push({ object, objectBody });

    // Update diamond count
    diamonds += 10;
    document.getElementById("diamonds").textContent = diamonds;
}

function createObject(color) {
    const geometry = new THREE.SphereGeometry(0.3, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, 0);
    scene.add(mesh);
    return mesh;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function toggleShop() {
    const shopItems = document.getElementById("shop-items");
    shopItems.style.display = shopItems.style.display === "block" ? "none" : "block";
}

init();
