class LoadingState extends GameState {
    constructor(props) {
        super(props);
    }

    animationEnd() {
        // no animation as components are loading
    }

    pickTile(tile) {
        // cannot pick a tile when components are loading
    }
}