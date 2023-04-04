import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Scene
const scene = new THREE.Scene()

// Red cube
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0033 })
const boxMesh = new THREE.Mesh(geometry, material)
scene.add(boxMesh)

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Renderer
const monCanvas = document.getElementById('webgl')
const renderer = new THREE.WebGLRenderer({
    canvas: monCanvas
})
renderer.setSize(sizes.width, sizes.height)

renderer.setAnimationLoop(animate)

// Animation
function animate() {
    boxMesh.rotation.x += 0.01
    boxMesh.rotation.y += 0.01
    renderer.render(scene, camera)
}

// Orbit controls (allows camera movement from user)
const orbit = new OrbitControls(camera, renderer.domElement)
orbit.update()