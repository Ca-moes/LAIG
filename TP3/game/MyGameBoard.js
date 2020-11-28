class MyGameBoard extends CGFobject{
    constructor(scene, size){
        super(scene)
        this.scene = scene
        this.size = size
        this.board = []
        this.createBoard()
    }

    createBoard(){
        let pieceType = 1
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                this.board.push( new MyTile(this.scene, this, new MyPiece(this.scene, pieceType), x, y) )
                pieceType = -pieceType
            }
        }
    }

    display(){
        let index = 0
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                this.scene.pushMatrix()
                this.scene.translate(x*1.7, y*1.7, 0)
                this.board[index].display()
                this.scene.popMatrix()
                index++
            }
        }
    }

}