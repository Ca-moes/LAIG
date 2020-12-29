//From https://github.com/EvanHahn/ScriptInclude
include = function () {
    function f() {
        var a = this.readyState;
        (!a || /ded|te/.test(a)) && (c--, !c && e && d())
    }

    var a = arguments, b = document, c = a.length, d = a[c - 1], e = d.call;
    e && c--;
    for (var g, h = 0; c > h; h++) g = b.createElement("script"), g.src = arguments[h], g.async = !0, g.onload = g.onerror = g.onreadystatechange = f, (b.head || b.getElementsByTagName("head")[0]).appendChild(g)
};
serialInclude = function (a) {
    var b = console, c = serialInclude.l;
    if (a.length > 0) c.splice(0, 0, a); else b.log("Done!");
    if (c.length > 0) {
        if (c[0].length > 1) {
            var d = c[0].splice(0, 1);
            b.log("Loading " + d + "...");
            include(d, function () {
                serialInclude([]);
            });
        } else {
            var e = c[0][0];
            c.splice(0, 1);
            e.call();
        }

    } else b.log("Finished.");
};
serialInclude.l = [];

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
        function (m, key, value) {
            vars[decodeURIComponent(key)] = decodeURIComponent(value);
        });
    return vars;
}

//Include additional files here

serialInclude(['../lib/CGF.js',
    'XMLscene.js',
    'MySceneGraph.js',
    'MyInterface.js',
    'Utils.js',
    './primitives/MyRectangle.js',
    './primitives/MyTriangle.js',
    './primitives/MyTorus.js',
    './primitives/MySphere.js',
    './primitives/MyCylinder.js',
    './primitives/MyCircle.js',
    './primitives/Plane.js',
    './primitives/Patch.js',
    './primitives/MyDefbarrel.js',
    './game/MyPiece.js',
    './game/MyAuxiliaryBoard.js',
    './game/MyBox.js',
    './game/MyTile.js',
    './game/MyMenu.js',
    './game/MyLoadingScreen.js',
    './game/MyGameBoard.js',
    './game/MyBoardFrame.js',
    './game/MyAnimatedCamera.js',
    './game/CGFResourceReader.js',
    './game/CGFOBJModel.js',
    './game/MyAnimator.js',
    './game/MyGameMove.js',
    './game/MyGameHud.js',
    './game/MyGameOrchestrator.js',
    './game/MyGameSequence.js',
    './game/GameState/GameState.js',
    './game/GameState/ReplayState.js',
    './game/GameState/GameOverState.js',
    './game/GameState/AnimationState.js',
    './game/GameState/LoadingState.js',
    './game/GameState/CameraAnimationState.js',
    './game/GameState/MoveState.js',
    './game/GameState/MenuState.js',
    './game/GameState/ConfirmRemoveState.js',
    './game/GameState/RemoveState.js',
    './game/GameState/ReadyState.js',
    './game/PieceState/PieceState.js',
    './game/PieceState/StaticPieceState.js',
    './game/PieceState/PickedPieceState.js',
    './game/PieceState/AnimatedPieceState.js',
    './game/TileState/TileState.js',
    './game/TileState/StaticTileState.js',
    './game/TileState/HighlightedTileState.js',
    './prolog_connection/MyPrologInterface.js',
    'Animation.js',
    'KeyframeAnimation.js',
    'MySpriteSheet.js',
    'MySpriteText.js',
    'MySpriteAnimation.js',


    main = function () {
        // Standard application, scene and interface setup
        var app = new CGFapplication(document.body);
        var myInterface = new MyInterface();
        var myScene = new XMLscene(myInterface);

        app.init();

        app.setScene(myScene);
        app.setInterface(myInterface);

        myInterface.setActiveCamera(myScene.camera);

        // start
        app.run();
    }

]);