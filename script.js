// Initialize Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('game-canvas') });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

// Lighting (dim for horror)
const ambientLight = new THREE.AmbientLight(0x404040, 0.2);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 0.5, 100);
pointLight.position.set(0, 5, 0);
pointLight.castShadow = true;
scene.add(pointLight);

// Room geometry (simple box)
const roomGeometry = new THREE.BoxGeometry(20, 10, 20);
const roomMaterial = new THREE.MeshLambertMaterial({ color: 0x222222, side: THREE.BackSide });
const room = new THREE.Mesh(roomGeometry, roomMaterial);
scene.add(room);

// Monster (initially hidden)
const monsterGeometry = new THREE.SphereGeometry(1, 32, 32);
const monsterMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
const monster = new THREE.Mesh(monsterGeometry, monsterMaterial);
monster.position.set(0, 1, -5);
monster.visible = false;
scene.add(monster);

// Audio
const ambientSound = document.getElementById('ambient-sound');
const jumpScareSound = document.getElementById('jump-scare-sound');
ambientSound.play();

// Controls
let keys = {};
let mouseX = 0, mouseY = 0;
document.addEventListener('keydown', (e) => keys[e.code] = true);
document.addEventListener('keyup', (e) => keys[e.code] = false);
document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    camera.rotation.y = -mouseX * Math.PI / 4;
    camera.rotation.x = mouseY * Math.PI / 6;
});

// Movement
const moveSpeed = 0.1;
function updateMovement() {
    if (keys.KeyW) camera.translateZ(-moveSpeed);
    if (keys.KeyS) camera.translateZ(moveSpeed);
    if (keys.KeyA) camera.translateX(-moveSpeed);
    if (keys.KeyD) camera.translateX(moveSpeed);
}

// Jump scare logic
let scareTimer = 0;
function triggerJumpScare() {
    monster.visible = true;
    jumpScareSound.play();
    document.getElementById('status').textContent = 'Status: MONSTER!';
    setTimeout(() => {
        monster.visible = false;
        document.getElementById('status').textContent = 'Status: Exploring...';
    }, 2000);
}

// Game loop
function animate() {
    requestAnimationFrame(animate);
    updateMovement();
    scareTimer++;
    if (scareTimer > 300) { // Trigger scare after ~5 seconds
        triggerJumpScare();
        scareTimer = 0;
    }
    renderer.render(scene, camera);
}
animate();

// Resize handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
