import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import ringVertexShader from "./shaders/ring/vertex.glsl"
import ringFragmentShader from "./shaders/ring/fragment.glsl"
import sunVertexShader from "./shaders/sun/vertex.glsl"
import sunFragmentShader from "./shaders/sun/fragment.glsl"
import bloc from "./testClass";
import Planet from "./PlanetClass";

//Canvas
const canvas = document.querySelector('canvas.webgl')



//Scene
const scene = new THREE.Scene()

//Sizes
const sizes = {
    width : window.innerWidth,
    height:window.innerHeight
}

//Renderer
const renderer = new THREE.WebGLRenderer({
    canvas:canvas,
})
renderer.setSize(sizes.width,sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true

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
camera.position.x = 20
camera.position.y = 20
camera.position.z = 20
const center = new THREE.Vector3(0)
camera.lookAt(center)
scene.add(camera)

//Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

//Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
scene.add(ambientLight)

// const directLight = new THREE.DirectionalLight(0xffffff, 1)
// directLight.position.set(5,0,5)
// directLight.castShadow = true
// scene.add(directLight)
//0xFDB813
const sunLight = new THREE.PointLight(0xFFFFFF, 1)
sunLight.castShadow = true
scene.add(sunLight)

//Cube test
const geometry = new THREE.BoxGeometry(1,1,1)
const material = new THREE.MeshStandardMaterial({})


const cube = new THREE.Mesh(geometry,material)
cube.position.x = -5
cube.castShadow = true
cube.receiveShadow = true
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
earth.castShadow = true
earth.receiveShadow = true
scene.add(earth)

const moonGeom = new THREE.SphereGeometry(0.25)
const moonMat = new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load('/Lava_004_SD/Lava_004_COLOR.jpg')
})
const moon = new THREE.Mesh(moonGeom, moonMat)
moon.position.x = 3
moon.castShadow = true
moon.receiveShadow=true
scene.add(moon)

//Rings
const ringGeom = new THREE.BufferGeometry()

const particleNbr = 1000
const ringPositions = new Float32Array(particleNbr*3)
const ringColors = new Float32Array(particleNbr*3)
const scales = new Float32Array(particleNbr * 1)
const blinking = new Float32Array(particleNbr * 1)
const blinkingSpeed = 5 //Clignotements des particules plus on augmente plus ça va vite

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

    scales[i] = Math.random()

    blinking[i] = Math.random() * blinkingSpeed
}

ringGeom.setAttribute('position', new THREE.BufferAttribute(ringPositions, 3))
ringGeom.setAttribute('color', new THREE.BufferAttribute(ringColors, 3))
ringGeom.setAttribute('aScale', new THREE.BufferAttribute(scales, 1 ))
ringGeom.setAttribute('aBlinking', new THREE.BufferAttribute(blinking, 1 ))

const ringMaterial = new THREE.ShaderMaterial({
    depthWrite: false, //Transparence
    blending: THREE.AdditiveBlending, //mélange couleur
    vertexColors: true,
    vertexShader: ringVertexShader,
    fragmentShader: ringFragmentShader,
    uniforms:{
        uSize:{value:100 * renderer.getPixelRatio()},
        uTime:{value:0}
    },
})

const ring = new THREE.Points(ringGeom, ringMaterial)

ring.position.z = 7
scene.add(ring)

//Sun
const sunGeom = new THREE.BufferGeometry()
const sunPos = new Float32Array(3)
const sunCol = new Float32Array(3)

sunPos[0]=0
sunPos[1]=0
sunPos[2]=0

sunCol[0]=253/255
sunCol[1]=184/255
sunCol[2]=19/255

sunGeom.setAttribute('position', new THREE.BufferAttribute(sunPos, 3))
sunGeom.setAttribute('color', new THREE.BufferAttribute(sunCol, 3))

const sunMaterial = new THREE.ShaderMaterial({
    depthWrite: false, //Transparence
    blending: THREE.AdditiveBlending, //mélange couleur
    vertexColors: true,
    vertexShader: sunVertexShader,
    fragmentShader: sunFragmentShader,
})

const sun = new THREE.Points(sunGeom, sunMaterial)
scene.add(sun)
//class test
// const randomSize = 0.1 + Math.random()
const colorRGB = {
    r:Math.random(),
    g:Math.random(),
    b:Math.random(),
}
const planetSize = 2
const orbitSpeed = 0.75
const sunDistance = 15
const planetTexture = {
    roughnessMap : earthRoughnessTexture,
    map : earthColorTexture,
    displacementMap : earthHeightTexture,
    emissiveMap : earthMetalTexture,
    normalMap : earthNormalTexture,
    aoMap : earthAmbOccTexture
}
const planetAmount = 5
const planet = new Planet(planetSize, sunDistance, orbitSpeed, colorRGB)
scene.add(planet.planet)
//const blocTest = new bloc(scene, 10, Math.random())

//Animate
const clock = new THREE.Clock()

const tick = () =>{
    
    const elapsedTime = clock.getElapsedTime()
    
    earth.rotation.y = -elapsedTime
    ring.rotation.y = elapsedTime

    earth.position.x = Math.cos(elapsedTime/2)*7
    earth.position.z = Math.sin(elapsedTime/2)*7
    
    // ring.position.z = Math.cos(elapsedTime)*7
    // ring.position.x = Math.sin(elapsedTime)*7
    
    ringMaterial.uniforms.uTime.value = -elapsedTime

    cube.position.x = Math.cos(elapsedTime)*5
    cube.position.z = Math.sin(elapsedTime)*5

    moon.position.x = (Math.cos(elapsedTime * 2)*2.5) + earth.position.x
    moon.position.z = (Math.sin(elapsedTime * 2)*2.5) + earth.position.z
    moon.position.y = Math.cos(elapsedTime)*0.5

    //blocTest.orbiting(elapsedTime)
    planet.orbiting(elapsedTime)
    // console.clear()
    // console.log(sun);
    // console.log("X: ",cube.position.x);
    // console.log("Y: ",cube.position.y);
    // console.log("Z: ",cube.position.z);

    cube.rotation.y = -elapsedTime
    cube.rotation.x = -elapsedTime
    controls.update(elapsedTime)

    //directLight.position.set(camera.position.x,camera.position.y,camera.position.z)


    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()