import * as THREE from "three"

export default class Renderer 
{
    constructor(_options){
        this.canvas = _options.canvas;
        this.scene = _options.scene;
        this.sizes = _options.sizes;
        this.camera = _options.camera;

        this.setInstance();
    }

    setInstance(){
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas
        });
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(this.sizes.pixelRatio);
    }

    resize(){
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(this.sizes.pixelRatio);
    }

    update(){
        this.instance.render(this.scene, this.camera.instance)
    }

}