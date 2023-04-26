import * as THREE from 'three';
import Controller from './Controller';

export default class Player {
    constructor(_options) {
        this.event = _options.event;
        this.scene = _options.scene;
        this.resources = _options.resources;
        this.parameter = _options.parameter;

        this.setPlayer();
        console.log(this)

        this.controller = new Controller({
            player: this.player
        })
    }

    setPlayer() {
        this.setMesh();
    }

    setMesh() {
        this.playerGeometry = new THREE.PlaneGeometry(2.5, 2);

        this.player = new THREE.Mesh(this.playerGeometry, new THREE.MeshBasicMaterial({ transparent: true, visible: false }));
        this.player.position.set(0, -3.8, 0)

        this.setAssets(this.playerGeometry);

        this.setColliders()

        this.scene.add(this.player)
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
        const box = new THREE.Box3().setFromObject(this.player);
        this.collider = box;
    }

    updatePlayer(deltaT) {
        // Move the player according to the controller
        const movement = this.controller.getMovement(deltaT);

        console.log(movement.x)

        this.player.position.x = this.player.position.x + movement.x
        this.player.position.z = this.player.position.z + movement.z

        // Update collider position
        this.collider.setFromObject(this.player);
    }

    update(deltaT) {
        this.updatePlayer(deltaT);
    }

}