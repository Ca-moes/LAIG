class MyGameBoard extends CGFobject{
    constructor(scene, centerx, centery, size){
        super(scene)
        this.scene = scene
        this.centerx = centerx
        this.centery = centery
        this.size = size
        this.board = []
        this.updatedTexCoords = true; // no need for updateTexCoords

        this.createBoard()
    }

    createBoard(){
        let pieceType = 1
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                let tile = new MyTile(this.scene, this, x, y)
                let piece = new MyPiece(this.scene, pieceType)
                tile.setPiece(piece)
                piece.setTile(tile)
                this.board.push(tile)
                pieceType = -pieceType
            }
            if (this.size%2 == 0)
                pieceType = -pieceType
        }
    }

    logPicking() {
		if (this.scene.pickMode == false) {
			if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
				for (var i = 0; i < this.scene.pickResults.length; i++) {
					var obj = this.scene.pickResults[i][0];
					if (obj) {
						var customId = this.scene.pickResults[i][1];
						console.log("Picked object: " + obj + ", with pick id " + customId);						
					}
				}
				this.scene.pickResults.splice(0, this.scene.pickResults.length);
			}
		}
	}

    display(){
        this.logPicking()
        this.scene.clearPickRegistration();

        let index = 0
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {

                this.scene.registerForPick(index + 1, this.board[index]);

                this.scene.pushMatrix()
                this.scene.translate(this.centerx,this.centery, 0)
                this.scene.translate(x*1.03 - (this.size/2) + 0.5, -y*1.03 + (this.size/2) - 0.5, 0)
                this.board[index].display()
                this.scene.popMatrix()
                index++
            }
        }
    }

}