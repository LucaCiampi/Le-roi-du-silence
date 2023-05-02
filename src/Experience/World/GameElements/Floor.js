import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Octree } from 'three/addons/math/Octree.js';
import { OctreeHelper } from 'three/addons/helpers/OctreeHelper.js';

export default class Floor {
    constructor(_options) {
        this.scene = _options.scene;
        this.resources = _options.resources;
        this.parameter = _options.parameter;

        this.worldOctree = null;
        this.octreeHelper = null;

        this.init();
    }

    init() {
        this.worldOctree = new Octree();

        this.setFloor();
    }

    setFloor() {
        // this.scene.add(this.resources.items.floor.scene)

        // //TODO: comment this
        // this.resources.items.floor.scene.traverse(child => {

        //     if (child.isMesh) {

        //         child.castShadow = true;
        //         child.receiveShadow = true;

        //         if (child.material.map) {

        //             child.material.map.anisotropy = 4;

        //         }

        //     }

        // });

        //TODO : remove loader from here
        const loader = new GLTFLoader();

        loader.load('./Environment/collision-world.glb', (gltf) => {

            this.scene.add(gltf.scene);

            this.worldOctree.fromGraphNode(gltf.scene);

            gltf.scene.traverse(child => {

                if (child.isMesh) {

                    child.castShadow = true;
                    child.receiveShadow = true;

                    if (child.material.map) {

                        child.material.map.anisotropy = 4;

                    }

                }

            });

            this.setHelper()
        })
    }

    setHelper() {
        this.octreeHelper = new OctreeHelper(this.worldOctree);
        this.octreeHelper.visible = false;
        this.scene.add(this.octreeHelper);
    }
}