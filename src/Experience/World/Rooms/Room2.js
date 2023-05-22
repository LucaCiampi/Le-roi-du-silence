import * as THREE from 'three'
import Room from "../Room";
import TriggerZone from '../TriggerZone'

export default class Room2 extends Room {
    constructor(_options) {
        super(_options)

        this.init();
    }

    init() {
        this.name = "room2";
        this.position = new THREE.Vector3(-14, 0, -28);
        this.spawnPosition = new THREE.Vector3(-12, 0, -26);
        this.entranceTriggerZone = new TriggerZone({
            debug: this.debug,
            scene: this.scene,
            startPosition: new THREE.Vector2(-12, -22),
            endPosition: new THREE.Vector2(-6, -14),
        });

        this.setRoomModel();

        this.setAshes();
    }

    update() {
        this.animateAsh();
    }

    setAshes() {
        // Créer un groupe pour contenir les particules de cendres
        this.ashGroup = new THREE.Group();
        this.ashGroup.position.set(2, 2, 6);
        this.props.push(this.ashGroup)

        // Créer le matériau des particules de cendres
        const ashTexture = this.resources.items['ash'];
        const ashMaterial = new THREE.PointsMaterial({
            map: ashTexture,
            size: 0.5, // Taille des particules
            transparent: true,
        });

        // Créer la géométrie des particules
        const ashGeometry = new THREE.BufferGeometry();

        // Définir les positions des particules
        const positions = [];
        for (let i = 0; i < 1000; i++) {
            positions.push(
                (Math.random() * 2 - 1) * 10, // Position X aléatoire
                (Math.random() * 2 - 1) * 10, // Position Y aléatoire
                (Math.random() * 2 - 1) * 10  // Position Z aléatoire
            );
        }
        ashGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

        // Créer les particules avec la géométrie et le matériau
        this.ashes = new THREE.Points(ashGeometry, ashMaterial);
        this.ashGroup.add(this.ashes);
    }

    animateAsh() {
        // Mettre à jour la position des particules
        this.ashes.rotation.y += 0.01; // Rotation des particules
        this.ashGroup.position.y -= 0.05; // Vitesse de descente des particules

        // Réinitialiser la position des particules qui sont sorties de la vue
        if (this.ashGroup.position.y < -10) {
            this.ashGroup.position.y = 0;
        }
    }
}