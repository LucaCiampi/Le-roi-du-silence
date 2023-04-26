import * as THREE from "three";


export default class Floor {
    constructor(_options) {
        this.scene = _options.scene;
        this.resources = _options.resources;
        this.parameter = _options.parameter;

        this.setFloor();
    }

    setFloor() {
        // const geometry = new THREE.PlaneGeometry(5, 10);

        // const material = new THREE.MeshBasicMaterial({map: this.resources.items.foreground, transparent: false})
        // const mesh = new THREE.Mesh(geometry, material); 
        // mesh.renderOrder = 5;
        this.scene.add(this.resources.items.floor.scenes[0])
    }

}