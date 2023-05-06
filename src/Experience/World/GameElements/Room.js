import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Octree } from 'three/addons/math/Octree.js';
import { OctreeHelper } from 'three/addons/helpers/OctreeHelper.js';

export default class Room {
    constructor(_options) {
        this.scene = _options.scene;
        this.resources = _options.resources;
        this.parameter = _options.parameter;
        this.name = _options.name;

        this.worldOctree = null;
        this.octreeHelper = null;

        this.init();
    }

    init() {
        this.worldOctree = new Octree();

        this.setMesh();
    }

    setMesh() {
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

        loader.load('./Environment/' + this.name + '.glb', (gltf) => {

            const model = gltf.scene;

            model.position.setY(0);
            model.position.setX(-3);

            this.scene.add(model);

            this.worldOctree.fromGraphNode(model);

            model.traverse(child => {

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