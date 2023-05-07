import * as THREE from "three";
import { Octree } from 'three/addons/math/Octree.js';
import { OctreeHelper } from 'three/addons/helpers/OctreeHelper.js';

export default class WorldOctree {
    constructor(_options) {
        this.scene = _options.scene;
        this.debug = _options.debug;
        this.event = _options.event;
        this.models = _options.models;

        this.octree = null;
        this.octreeHelper = null;

        this.init();
    }

    init() {
        this.octree = new Octree();

        this.event.on('Start', () => {
            this.makeOctree()
        })

    }

    makeOctree() {
        // Créer un Octree global et ajouter les modèles
        this.scene.traverse(mesh => {
            if (mesh instanceof THREE.Mesh) {
                this.octree.fromGraphNode(mesh);
            }
        });

        if (this.debug.active) {
            this.addDebugOption();
        }
    }

    /**
     * Adds the octree map helper visibility toggle to the debug GUI options
     */
    addDebugOption() {
        this.setHelper();

        this.debug.gui.add(this.octreeHelper, 'visible')
            .onChange((value) => {
                this.octreeHelper.visible = value;
            });
    }

    /**
     * Creates an Octree map helper
     */
    setHelper() {
        this.octreeHelper = new OctreeHelper(this.octree);
        this.octreeHelper.visible = false;
        this.scene.add(this.octreeHelper);
    }
}