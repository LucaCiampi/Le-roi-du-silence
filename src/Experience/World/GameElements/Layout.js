import * as THREE from "three";


export default class Layout {
    constructor(_options){
        this.scene = _options.scene;
        this.resources = _options.resources;
        this.parameter = _options.parameter;
        this.event = _options.event;

        this.blocker = null;
        this.introUI = null;

        this.init();
        this.eventReceiver();
    }

    init(){
        this.blocker = document.getElementById('blocker')
        this.introUI = document.getElementById('instructions')

        this.introUI.addEventListener('click', () => {
            this.event.start();
        })

        // this.setBackground();
        // this.setForeground();
    }

    eventReceiver(){
        this.event.on('Ready', () => {
            this.displayIntroUI()
        })
    }

    displayIntroUI() {
        this.blocker.classList.remove('d-none')
    }

    setBackground(){
        // this.scene.background = this.resources.items.background
        // const geometry = new THREE.PlaneGeometry(4.6, 9.5);

        // const material = new THREE.MeshBasicMaterial({map: this.resources.items.background, transparent: true})
        // const mesh = new THREE.Mesh(geometry, material); 
        // mesh.renderOrder = 0;
        // this.scene.add(mesh)
    }

    setForeground(){
        // const geometry = new THREE.PlaneGeometry(5, 10);

        // const material = new THREE.MeshBasicMaterial({map: this.resources.items.foreground, transparent: false})
        // const mesh = new THREE.Mesh(geometry, material); 
        // mesh.renderOrder = 5;
        // this.scene.add(mesh)
    }

}