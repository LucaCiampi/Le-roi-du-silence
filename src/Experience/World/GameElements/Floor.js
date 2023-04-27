import * as THREE from "three";

export default class Floor {
    constructor(_options) {
        this.scene = _options.scene;
        this.resources = _options.resources;
        this.parameter = _options.parameter;

        this.init();
    }

    init() {
        this.setFloor();
    }

    setFloor() {
        this.scene.add(this.resources.items.floor.scene)

        //TODO: comment this
        this.resources.items.floor.scene.traverse(child => {

            if (child.isMesh) {

                child.castShadow = true;
                child.receiveShadow = true;

                if (child.material.map) {

                    child.material.map.anisotropy = 4;

                }

            }

        });

        // this.scene.position.y = 0
    }

}