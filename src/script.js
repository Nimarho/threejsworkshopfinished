import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import ringVertexShader from './shaders/ring/vertex.glsl';
// import ringFragmentShader from './shaders/ring/fragment.glsl';


//Canvas
const canvas = document.querySelector('canvas.webgl')

//Scene
const scene = new THREE.Scene()

//Sizes
const sizes = {
    width : window.innerWidth,
    height:window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    
    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    
    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    //renderer.render(scene, camera)
})

//Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height, 0.1, 100)
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
const center = new THREE.Vector3(0)
camera.lookAt(center)
scene.add(camera)

//Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

//Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

//Cube test
const geometry = new THREE.BoxGeometry(1,1,1)
const material = new THREE.MeshBasicMaterial({})


const cube = new THREE.Mesh(geometry,material)
cube.position.x = -5
scene.add(cube)

//Texture
const textureLoader = new THREE.TextureLoader()

const earthColorTexture= textureLoader.load('/lava-006/Lava_006_basecolor.jpg')
const earthHeightTexture= textureLoader.load('/lava-006/Lava_006_height.png')
const earthNormalTexture= textureLoader.load('/lava-006/Lava_006_normal.jpg')
const earthRoughnessTexture= textureLoader.load('/lava-006/Lava_006_roughness.jpg')
const earthAmbOccTexture= textureLoader.load('/lava-006/Lava_006_ambientOcclusion.jpg')
const earthMetalTexture= textureLoader.load('/lava-006/Lava_006_emissive.jpg')

const minecraftTexture = textureLoader.load('/minecraft.png')
minecraftTexture.magFilter = THREE.NearestFilter

material.map = minecraftTexture

//Sphere
const earthGeom = new THREE.SphereGeometry(1)
const earthMat = new THREE.MeshStandardMaterial()
earthMat.roughnessMap = earthRoughnessTexture
earthMat.map = earthColorTexture
earthMat.displacementMap = earthHeightTexture
earthMat.emissiveMap = earthMetalTexture
earthMat.normalMap = earthNormalTexture
earthMat.aoMap = earthAmbOccTexture


const earth = new THREE.Mesh(earthGeom, earthMat)
scene.add(earth)

const moonGeom = new THREE.SphereGeometry(0.25)
const moonMat = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load('/Lava_004_SD/Lava_004_COLOR.jpg')
})
const moon = new THREE.Mesh(moonGeom, moonMat)
moon.position.x = 3
scene.add(moon)

//Rings
const ringGeom = new THREE.BufferGeometry()

const particleNbr = 1000
const ringPositions = new Float32Array(particleNbr*3)
const ringColors = new Float32Array(particleNbr*3)

for (let i = 0; i < particleNbr; i++) {
    const i3 = i *3
    const radius =  (Math.random()) + 2
    const randAngle = Math.random() * (Math.PI * 2)
    ringPositions[i3] = Math.cos(randAngle) * radius
    ringPositions[i3 + 1] = (Math.random()-0.5)*0.1
    ringPositions[i3 + 2] = Math.sin(randAngle) * radius
    ringColors[i3] = Math.random()
    ringColors[i3 + 1] = Math.random()
    ringColors[i3 + 2] = Math.random()
}

ringGeom.setAttribute('position', new THREE.BufferAttribute(ringPositions, 3))
ringGeom.setAttribute('color', new THREE.BufferAttribute(ringColors, 3))

const ringMaterial = new THREE.PointsMaterial({
    sizeAttenuation: true,
    depthWrite: false, //Transparence
    blending: THREE.AdditiveBlending, //mélange couleur
    vertexColors: true,
    size:0.05,
    // vertexShader: ringVertexShader,
    // fragmentShader: ringFragmentShader,
})

const ring = new THREE.Points(ringGeom, ringMaterial)
scene.add(ring)

//Renderer
const renderer = new THREE.WebGLRenderer({
    canvas:canvas,
})
renderer.setSize(sizes.width,sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//Animate
const clock = new THREE.Clock()

const tick = () =>{
    
    const elapsedTime = clock.getElapsedTime()
    
    earth.rotation.y = -elapsedTime*0.3 

    moon.position.x = Math.cos(elapsedTime)*2.5
    moon.position.z = Math.sin(elapsedTime)*2.5
    moon.position.y = Math.cos(elapsedTime)*1
    
    ring.rotation.y = -elapsedTime * 0.2

    cube.position.x = Math.cos(elapsedTime)*5
    cube.position.z = Math.sin(elapsedTime)*5
    cube.rotation.y = -elapsedTime

    controls.update(elapsedTime)

    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()