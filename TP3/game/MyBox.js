class MyBox extends CGFobject {
    constructor(scene) {
        super(scene);
        this.scene = scene
        this.obj = new CGFOBJModel(scene, "models/box.obj", false)
        this.material = new CGFappearance(scene)
        this.material.setAmbient(0.25, 0.20725, 0.20725, 0.922)
        this.material.setDiffuse(1, 0.829, 0.829, 0.922)
        this.material.setSpecular(0.296648, 0.296648, 0.296648, 0.922)
        this.material.setShininess(11.264)
    }

    display() {
        this.scene.pushMatrix()
        this.material.apply()
        this.obj.display()
        this.scene.popMatrix()
    }
}