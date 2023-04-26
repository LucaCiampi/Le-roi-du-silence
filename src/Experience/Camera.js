import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

export default class Camera
{
    constructor(_options){

        this.canvas = _options.canvas;
        this.scene = _options.scene;
        this.sizes = _options.sizes;

        this.setInstance();
        this.setOrbitControl();

        document.body.addEventListener( 'mousemove', ( event ) => {

            if ( document.pointerLockElement === document.body ) {
    
              camera.rotation.y -= event.movementX / 500;
              camera.rotation.x -= event.movementY / 500;
    
            }
    
          } );
    }

    setInstance(){
        this.instance = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 100);
        this.instance.position.set(0, 0, 15);
        this.scene.add(this.instance);
    }

    setOrbitControl(){
        this.controls = new OrbitControls(this.instance, this.canvas);
        this.controls.enableDamping = true;
    }

    resize(){
        this.instance.aspect = this.sizes.width / this.sizes.height;
        this.instance.updateProjectionMatrix();
    }

    update(){
        // this.controls.update();
    }

}

