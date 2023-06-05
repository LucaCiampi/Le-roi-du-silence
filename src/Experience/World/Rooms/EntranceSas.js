import * as THREE from 'three'
import Room from "../Room";
import TriggerZone from '../TriggerZone'

export default class EntranceSas extends Room {
    constructor(_options) {
        super(_options)

        this.init();
    }

    init() {
        this.name = "sas";
        this.position = new THREE.Vector3(0, 0, 0);

        this.triggerZones = [
            // In the corner on the left
            new TriggerZone({
                debug: this.debug,
                scene: this.scene,
                name: 'sas',
                startPosition: new THREE.Vector2(-2, -5),
                endPosition: new THREE.Vector2(2, -3),
            })
        ]

        this.setRoomModel();

        this.setUpMariusShader();
    }

    update() {
        // Silence is golden...
    }

    // TODO
    setUpMariusShader() {
        // Shader
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        // const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
        const texture = new THREE.TextureLoader().load('https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Red_brick_wall_texture.JPG/2560px-Red_brick_wall_texture.JPG')
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping
        const texture2 = new THREE.TextureLoader().load('https://img.rawpixel.com/private/static/images/website/2022-05/pf-s124-ak-5423_3.jpg?w=1200&h=1200&dpr=1&fit=clip&crop=default&fm=jpg&q=75&vib=3&con=3&usm=15&cs=srgb&bg=F4F4F3&ixlib=js-2.2.1&s=cb3b9a3646d03aa5540c3e518f360e9d')
        texture2.wrapS = texture.wrapT = THREE.RepeatWrapping

        const vertexShader = `
    precision mediump float;
    precision mediump int;

    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;

    attribute vec3 position;
    attribute vec3 normal;
    attribute vec2 uv;

    varying vec2 vUv;
    varying vec3 vNormal;
    
    void main()	{
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        vUv = uv;
        vNormal = normal;
    }`

        const fragmentShader = `
    precision mediump float;
    precision mediump int;
    
    uniform sampler2D colorMap;
    uniform sampler2D colorMap2;
    uniform float test;
    
    varying vec2 vUv;
    varying vec3 vNormal;

    void main()	{
        gl_FragColor = vec4(0.5, 0.5, 0.5, 1) * vec4(vNormal * vec3(texture2D(colorMap2, vUv)), 0)
        + vec4(vec3(texture2D(colorMap, vUv)), 1);
    }`

        const shaderMaterial = new THREE.RawShaderMaterial({
            uniforms: {
                colorMap: {
                    value: texture
                },
                colorMap2: {
                    value: texture2
                },
                // test: {
                //     value: this.scene.children[0].children[0].matrixWorld
                // }
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader
        })

        const cube = new THREE.Mesh(geometry, shaderMaterial);
        cube.position.set(0, 0, 0)
        this.props.push(cube)

        const tel = this.resources.items['tel'].scene;
        tel.position.set(1, 0.9, -0.7)
        tel.scale.set(0.1, 0.1, 0.1)
        tel.rotateY(Math.PI / 2)

        this.props.push(tel)
    }
}