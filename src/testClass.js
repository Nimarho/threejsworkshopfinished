import * as THREE from "three";

export default class Bloc{

    constructor(scene, radius, orbitSpeed){
        const geometry = new THREE.BoxGeometry(1,1,1)
        const material = new THREE.MeshStandardMaterial({color:'skyblue'})
        const cube = new THREE.Mesh(geometry,material)
        cube.position.x = radius
        this.radius = radius
        cube.castShadow = true
        cube.receiveShadow = true
        this.cube = cube
        this.orbitSpeed = orbitSpeed
        scene.add(cube)
    }

    orbiting(timeElapsed){
        this.cube.position.x = Math.cos(timeElapsed * this.orbitSpeed)*this.radius
        this.cube.position.z = Math.sin(timeElapsed * this.orbitSpeed)*this.radius
    }
}