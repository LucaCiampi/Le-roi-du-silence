import * as THREE from "three"
import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

export default class Renderer {
    constructor(_options) {
        this.canvas = _options.canvas;
        this.scene = _options.scene;
        this.sizes = _options.sizes;
        this.camera = _options.camera;

        // this.outlineEffect = null;
        this.composer = null

        this.init();
    }

    init() {

        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas
        });

        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(this.sizes.pixelRatio);

        // this.outlineEffect = new OutlineEffect( this.instance, {
        //     defaultThickness: 0.005,
        //     // defaultColor: [131, 33, 97]
        // } );

        // this.outlineEffect.thickness = 0.1;
        // this.outlineEffect.color = [255, 0, 0];

        // Bloom
        const renderScene = new RenderPass(this.scene, this.camera.instance)
        this.composer = new EffectComposer(this.instance)
        this.composer.addPass(renderScene)

        // const bloomPass = new UnrealBloomPass(
        //     new THREE.Vector2(this.sizes.width, this.sizes.height),
        //     1.5,
        //     0.9,
        //     0.9
        // )
        // this.composer.addPass(bloomPass)
    }

    resize() {
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(this.sizes.pixelRatio);
    }

    update() {
        // this.instance.render(this.scene, this.camera.instance)
        // this.outlineEffect.render(this.scene, this.camera.instance)
        this.composer.render(this.scene, this.camera.instance)
    }

}