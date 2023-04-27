import * as THREE from 'three';
import Controller from './Controller';
// import { Capsule } from 'three/addons/math/Capsule.js';

export default class Player {
    constructor(_options) {
        this.event = _options.event;
        this.scene = _options.scene;
        this.resources = _options.resources;
        this.parameter = _options.parameter;
        this.canvas = _options.canvas;
        this.camera = _options.camera;

        this.init();
        this.eventReciever();
    }

    init() {
        this.controller = new Controller({
            // player: this,
            canvas: this.canvas,
            camera: this.camera,
            scene: this.scene,
            resources: this.resources
        })

        // console.log(this.controller.controls.getObject().instance)

        // const object3D = new THREE.Object3D();
        // object3D.add(this.controller.controls.getObject());
        // this.scene.add(object3D);

        // this.scene.add(this.controller.controls.getObject())
        this.setMesh();
    }

    eventReciever() {
        this.event.on('Start', () => {
            this.controller.allowMovement();
        });
    }

    setMesh() {
        this.playerGeometry = new THREE.PlaneGeometry(2.5, 2);

        this.player = new THREE.Mesh(this.playerGeometry, new THREE.MeshBasicMaterial({ transparent: true, visible: false }));
        this.player.position.set(0, -3.8, 0)

        this.setAssets(this.playerGeometry);

        this.setPosition()
        this.setHelper()
        this.setColliders()

        this.scene.add(this.player)
    }

    setPosition() {
        this.player.position.y = 2
    }

    setHelper() {
        this.player.helper = new THREE.BoxHelper(this.player, 0xffff00);
        this.scene.add(this.player.helper);
    }

    setAssets(geometry) {
        this.bucketBackground = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ map: this.resources.items.player_background, transparent: true }));
        this.bucketBackground.position.x = -.35
        this.bucketBackground.renderOrder = 1;

        this.bucketForeground = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ map: this.resources.items.player_foreground, transparent: true }));
        this.bucketForeground.position.x = -.35
        this.bucketForeground.renderOrder = 3;

        this.player.add(this.bucketBackground, this.bucketForeground)
    }

    setColliders() {
        // Create colliders for the player
        // this.collider = new Capsule(new THREE.Vector3(0, 0.35, 0), new THREE.Vector3(0, 1, 0), 0.35);
        this.collider = new THREE.Box3().setFromObject(this.player);
    }

    update(deltaT) {
        this.updatePlayer(deltaT);
    }

    updatePlayer(deltaT) {
        // Move the player according to the controller
        this.controller.getMovement(deltaT);

        // this.player.position.x = this.player.position.x + movement.x
        // this.player.position.z = this.player.position.z + movement.z

        // this.resources.playerPosition = this.player.position

        // Update collider position
        this.collider.setFromObject(this.player);
    }
}