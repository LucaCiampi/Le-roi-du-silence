import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Octree } from 'three/addons/math/Octree.js';
import { OctreeHelper } from 'three/addons/helpers/OctreeHelper.js';

export default class Floor {
    constructor(_options) {
        this.scene = _options.scene;
        this.debug = _options.debug;
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
        // TODO : remove loader from here
        // TODO : only add octree from desired models
        // (apparently the code belows adds octree to every model of the scene)
        const loader = new GLTFLoader();

        const models = ['collision-world.glb', 'zone-1.glb', 'escalier-1.glb', 'escalier-2.glb'];
        const promises = models.map(model => loader.loadAsync('./Environment/' + model));
        Promise.all(promises).then(gltfs => {

            // Ajouter chaque modèle à la scène
            gltfs.forEach(gltf => {
                const mesh = gltf.scene.children[0];
                this.scene.add(mesh);
            });

            // Créer un Octree global et ajouter les modèles
            this.scene.traverse(mesh => {
                if (mesh instanceof THREE.Mesh) {
                    this.worldOctree.fromGraphNode(mesh);
                }
            });

            this.setHelper();

            this.debug.gui.add(this.octreeHelper, 'visible')
                .onChange((value) => {
                    this.octreeHelper.visible = value;
                    console.log(this.octreeHelper.visible)
                });
        })

        // loader.load('./Environment/collision-world.glb', (gltf) => {

        //     this.scene.add(gltf.scene);

        //     this.worldOctree.fromGraphNode(gltf.scene);

        //     gltf.scene.traverse(child => {

        //         if (child.isMesh) {

        //             child.castShadow = true;
        //             child.receiveShadow = true;

        //             if (child.material.map) {

        //                 child.material.map.anisotropy = 4;

        //             }

        //         }

        //     });

        //     this.setHelper()
        // })
    }

    setHelper() {
        this.octreeHelper = new OctreeHelper(this.worldOctree);
        this.octreeHelper.visible = false;
        this.scene.add(this.octreeHelper);
    }
}