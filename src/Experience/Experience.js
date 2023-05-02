import * as THREE from "three";

// Utils
import Sizes from "./Utils/Sizes.js";
import Time from "./Utils/Time.js";
import Resources from "./Utils/Resources.js";
import sources from "./AssetsSources.js";
import Debug from "./Utils/Debug.js";

// Experience
import Event from "./Event.js";
import Camera from "./Camera.js"
import Renderer from "./Renderer.js";

// World
import World from "./World/World.js";

export default class Experience {
    constructor(canvas) {
        window.experience = this;
        this.canvas = canvas;

        // options
        this.sizes = null;
        this.time = null;
        this.scene = null;
        this.resources = null;
        this.debug = null;

        // Setup
        this.event = null;
        this.camera = null;
        this.renderer = null;
        this.world = null;
        this.controls = null;

        this.init();
    }

    init() {
        // options
        this.sizes = new Sizes();
        this.time = new Time();
        this.scene = new THREE.Scene();
        this.resources = new Resources(sources);

        // Setup
        this.event = new Event()

        this.camera = new Camera({
            scene: this.scene,
            sizes: this.sizes
        });

        this.renderer = new Renderer({
            canvas: this.canvas,
            scene: this.scene,
            sizes: this.sizes,
            camera: this.camera
        });

        this.world = new World({
            event: this.event,
            scene: this.scene,
            debug: this.debug,
            resources: this.resources,
            canvas: this.canvas,
            camera: this.camera,
            player: this.player,
        });

        // this.controls = new PointerLockControls( this.camera, document.body );

        // Events
        if (this.resources.toLoad !== 0) {
            this.resources.on('ready', () => {
                this.ready();
            })
        } else {
            this.ready();
        }
        this.sizes.on('resize', () => {
            this.resize();
        })
        this.time.on('update', () => {
            this.update();
        })
    }

    ready() {
        this.world.ready();
        this.event.ready();
        
        this.debug = new Debug({
            world: this.world
        });
    }

    resize() {
        this.camera.resize();
        this.renderer.resize();
    }

    update() {
        // this.camera.update();
        this.renderer.update();

        this.world.update(this.time.deltaTime);
    }

    destroy() {
        this.renderer.dispose();
        this.renderer = null;

        this.camera = null;

        this.scene = null;

        this.canvas = null;
    }
}