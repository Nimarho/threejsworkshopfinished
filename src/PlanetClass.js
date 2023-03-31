import * as THREE from "three";

export default class Planet{
    constructor(radius=1, sunDistance=1, orbitSpeed=1, color={r:1,g:1,b:1}, texture={
        roughnessMap : null,
        map : null,
        displacementMap : null,
        emissiveMap : null,
        normalMap : null,
        aoMap : null
    }){
        this.sunDistance = sunDistance
        this.color = new THREE.Color( color.r,color.g,color.b );
        this.orbitSpeed = orbitSpeed
        const planetGeom = new THREE.SphereGeometry(radius)
        const planetMat = new THREE.MeshStandardMaterial()
        planetMat.color = this.color
        if(texture.map){
            planetMat.aoMap = texture.aoMap
            planetMat.map = texture.map
            planetMat.displacementMap = texture.displacementMap
            planetMat.normalMap = texture.normalMap
        }
        const planet = new THREE.Mesh(planetGeom, planetMat)
        this.planet = planet
        this.planet.position.x = sunDistance
        this.planet.castShadow = true
        this.planet.receiveShadow = true
    }


    orbiting(elapsedTime){
        this.planet.position.x = Math.cos(elapsedTime*this.orbitSpeed) * this.sunDistance
        this.planet.position.z = Math.sin(elapsedTime*this.orbitSpeed) * this.sunDistance
    }
}