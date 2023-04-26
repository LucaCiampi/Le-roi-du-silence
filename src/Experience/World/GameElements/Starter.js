import * as THREE from "three";

export default class Starter {
    constructor(_options, count){
        this.scene = _options.scene;
        this.resources = _options.resources;
        this.parameter = _options.parameter;

        this.countdown = count
        this.setUpCountdown()
        
    }

    setUpCountdown(){
        this.texture = this.resources.items.countdown;

        this.getCountdown(this.texture, 1, 4, this.countdown)
        this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(3.20, 2.16), new THREE.MeshBasicMaterial({map: this.texture, transparent: true}))
        this.mesh.position.y = -.5;
        this.scene.add(this.mesh)
        
    }

    getCountdown(texture, tilesHoriz, tilesVert, currentTile) 
    { 
        let obj = {};

        obj.texture = texture;
        obj.tilesHorizontal = tilesHoriz;
        obj.tilesVertical = tilesVert;

        obj.numberOfTiles = tilesHoriz * tilesVert;

        obj.texture.wrapS = THREE.RepeatWrapping;   
        obj.texture.wrapT = THREE.RepeatWrapping;   
        obj.texture.repeat.set( 1/tilesHoriz, 1/tilesVert );
        obj.currentTile = currentTile;

        let currentColumn = obj.currentTile % obj.tilesHorizontal;
        obj.texture.offset.x = currentColumn / obj.tilesHorizontal;

        let currentRow = Math.floor( obj.currentTile / obj.tilesHorizontal );
        obj.texture.offset.y = obj.tilesVertical - currentRow / obj.tilesVertical;

        return obj;
    }

    updateCountdown(number){
        this.getCountdown(this.texture, 1, 4, number)
    }

    deleteCountdown(){
        this.parameter.destroy(this.mesh);
    }
}