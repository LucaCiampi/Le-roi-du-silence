import * as THREE from 'three'
import Room from "../Room";
import TriggerZone from '../TriggerZone'

export default class Room3 extends Room {
    constructor(_options) {
        super(_options)

        this.init();
    }

    init() {
        this.name = "room3";
        this.position = new THREE.Vector3(-22.7, 1.22, -38.7);
        this.spawnPosition = new THREE.Vector3(-14, 2, -37);
        this.entranceTriggerZone = new TriggerZone({
            debug: this.debug,
            scene: this.scene,
            startPosition: new THREE.Vector2(-20, -41),
            endPosition: new THREE.Vector2(-11, -37),
        });
        
        this.closingDoor.position.set(1.2, 0, 10);
        this.exitDoor.position.set(0, 2, 20);

        this.minScoreRequired = 8;

        this.triggerZones = [
            // Corner after entrance
            new TriggerZone({
                debug: this.debug,
                scene: this.scene,
                name: 'corner',
                startPosition: new THREE.Vector2(-17, -42),
                endPosition: new THREE.Vector2(-15.5, -40),
            }),
            // Small corner near end
            new TriggerZone({
                debug: this.debug,
                scene: this.scene,
                name: 'small corner near end',
                startPosition: new THREE.Vector2(-19, -39),
                endPosition: new THREE.Vector2(-17, -36),
                color: 0x00ffff
            }),
        ];

        this.setRoomModel();

        this.addExitDoor();

        this.setAshes();
        
        if (this.debug.active) {
            this.addDebugOptions();
        }
    }

    update() {
        this.animateAsh();

    }

    /**
     * Sets up the ashes animation in the anger room
     */
    setAshes() {
        // Créer un groupe pour contenir les particules de cendres
        this.ashGroup = new THREE.Group();
        this.ashGroup.position.set(2, 8, 6);
        this.props.push(this.ashGroup)

        // Créer le matériau des particules de cendres
        const ashTexture = this.resources.items['ash'];
        const ashMaterial = new THREE.PointsMaterial({
            map: ashTexture,
            size: 0.2, // Taille des particules
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

    /**
     * Animates the ashes in the anger room
     */
    animateAsh() {
        // Mettre à jour la position des particules
        this.ashes.rotation.y += 0.01; // Rotation des particules
        this.ashGroup.position.y -= 0.05; // Vitesse de descente des particules

        // Réinitialiser la position des particules qui sont sorties de la vue
        if (this.ashGroup.position.y < -6) {
            this.ashGroup.position.y = 8;
        }
    }

    
}