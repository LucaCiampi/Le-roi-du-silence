import * as THREE from "three";
import { Octree } from 'three/addons/math/Octree.js';
import { OctreeHelper } from 'three/addons/helpers/OctreeHelper.js';

export default class WorldOctree {
    constructor(_options) {
        this.scene = _options.scene;
        this.debug = _options.debug;
        this.event = _options.event;
        this.models = _options.models;
        this.onFinish = _options.onFinish;

        this.octree = null;
        this.octreeHelper = null;

        this.init();
    }

    init() {
        this.octree = new Octree();

        this.event.on('Start', () => {
            this.makeOctree(this.onFinish)
        })
    }

    /**
     * Creates an octree out of each room model
     * @param {Action} callback the callback when the octree is finished
     */
    makeOctree(callback) {
        this.models.forEach(room => {
            room.model.traverse(mesh => {
                if (mesh instanceof THREE.Mesh) {
                    this.octree.fromGraphNode(mesh);
                }
            });
        });

        if (this.debug.active) {
            this.addDebugOptions();
        }

        callback();
    }

    /**
     * Adds the octree map helper visibility toggle to the debug GUI options
     */
    addDebugOptions() {
        this.setHelper();

        const folder = this.debug.gui.addFolder('WorldOctree');
        folder.add(this.octreeHelper, 'visible')
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