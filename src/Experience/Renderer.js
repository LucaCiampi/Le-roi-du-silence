import * as THREE from "three"
import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js';

export default class Renderer 
{
    constructor(_options){
        this.canvas = _options.canvas;
        this.scene = _options.scene;
        this.sizes = _options.sizes;
        this.camera = _options.camera;

        this.outlineEffect = null;

        this.init();
    }

    init(){
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas
        });
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(this.sizes.pixelRatio);

        this.outlineEffect = new OutlineEffect( this.instance, {
            defaultThickness: 0.005,
            // defaultColor: [131, 33, 97]
        } );
        // this.outlineEffect.thickness = 0.1;
        // this.outlineEffect.color = [255, 0, 0];
    }

    resize(){
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(this.sizes.pixelRatio);
    }

    update(){
        this.outlineEffect.render(this.scene, this.camera.instance)
    }

}