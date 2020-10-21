const DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var INITIALS_INDEX = 0;
var VIEWS_INDEX = 1;
var ILLUMINATION_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var NODES_INDEX = 6;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * Constructor for MySceneGraph class.
     * Initializes necessary variables and starts the XML file reading process.
     * @param {string} filename - File that defines the 3D scene
     * @param {XMLScene} scene
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.idRoot = null; // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    }

    /**
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /**
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {String} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "lsf")
            return "root tag <lsf> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <initials>
        var index;
        if ((index = nodeNames.indexOf("initials")) == -1)
            return "tag <initials> missing";
        else {
            if (index != INITIALS_INDEX)
                this.onXMLMinorError("tag <initials> out of order " + index);

            //Parse initials block
            if ((error = this.parseInitials(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseViews(nodes[index])) != null)
                return error;
        }

        // <illumination>
        if ((index = nodeNames.indexOf("illumination")) == -1)
            return "tag <illumination> missing";
        else {
            if (index != ILLUMINATION_INDEX)
                this.onXMLMinorError("tag <illumination> out of order");

            //Parse illumination block
            if ((error = this.parseIllumination(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }
        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <nodes>
        if ((index = nodeNames.indexOf("nodes")) == -1)
            return "tag <nodes> missing";
        else {
            if (index != NODES_INDEX)
                this.onXMLMinorError("tag <nodes> out of order");

            //Parse nodes block
            if ((error = this.parseNodes(nodes[index])) != null)
                return error;
        }
        this.log("all parsed");
    }

    /**
     * Parses the <initials> block.
     * @param {initials block element} initialsNode
     */
    parseInitials(initialsNode) {
        var children = initialsNode.children;
        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var rootIndex = nodeNames.indexOf("root");
        var referenceIndex = nodeNames.indexOf("reference");

        // Get root of the scene.
        if (rootIndex == -1)
            return "No root id defined for scene.";

        var rootNode = children[rootIndex];
        var id = this.reader.getString(rootNode, 'id');
        if (id == null)
            return "No root id defined for scene.";

        this.idRoot = id;

        // Get axis length
        if (referenceIndex == -1)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        var refNode = children[referenceIndex];
        var axis_length = this.reader.getFloat(refNode, 'length');
        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        this.referenceLength = axis_length || 1;

        this.log("Parsed initials");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseViews(viewsNode) {
        this.views = []
        this.viewsIds = []

        this.defaultView = this.reader.getString(viewsNode, "default")
        if (this.defaultView == null) {
            return "[VIEWS] No default view set"
        }

        const children = viewsNode.children;

        for (let i = 0; i < children.length; i++) {
            if (children[i].nodeName !== "perspective" && children[i].nodeName !== "ortho") {
                this.onXMLMinorError("[VIEWS] unknown tag <" + children[i].nodeName + ">")
                continue
            }

            // get current view's ID
            let viewId = this.reader.getString(children[i], 'id')
            if (viewId == null) {
                return "[VIEWS] no ID set for <" + children[i] + ">"
            }

            if (this.views[viewId] != null) {
                return "[VIEWS] View IDs must be unique (ID = " + viewId + " already exists)"
            }

            if (children[i].nodeName === "perspective") {
                let fromAux = null
                let toAux = null

                const perspectiveChildren = children[i].children
                for (let j = 0; j < perspectiveChildren.length; j++) {
                    if (perspectiveChildren[j].nodeName !== "from" && perspectiveChildren[j].nodeName !== "to") {
                        this.onXMLMinorError("[VIEWS] unknown tag <" + perspectiveChildren[j].nodeName + ">")
                        continue
                    }

                    if (perspectiveChildren[j].nodeName === "from") {
                        fromAux = {
                            x: this.reader.getFloat(perspectiveChildren[j], 'x'),
                            y: this.reader.getFloat(perspectiveChildren[j], 'y'),
                            z: this.reader.getFloat(perspectiveChildren[j], 'z')
                        }
                    } else {
                        toAux = {
                            x: this.reader.getFloat(perspectiveChildren[j], 'x'),
                            y: this.reader.getFloat(perspectiveChildren[j], 'y'),
                            z: this.reader.getFloat(perspectiveChildren[j], 'z')
                        }
                    }
                }

                this.views[viewId] = this.createPerspectiveCamera({
                    near: this.reader.getFloat(children[i], 'near'),
                    far: this.reader.getFloat(children[i], 'far'),
                    angle: this.reader.getFloat(children[i], 'angle'),
                    from: fromAux,
                    to: toAux
                })
            } else if (children[i].nodeName === "ortho") {
                const orthoChildren = children[i].children;

                let fromAux = null
                let toAux = null
                let upAux = {
                    x: 0.0,
                    y: 1.0,
                    z: 0.0
                }

                for (let j = 0; j < orthoChildren.length; j++) {
                    if (orthoChildren[j].nodeName !== "from" && orthoChildren[j].nodeName !== "to" && orthoChildren[j].nodeName !== "up") {
                        this.onXMLMinorError("unknown tag <" + orthoChildren[j].nodeName + ">");
                        continue;
                    }

                    if (orthoChildren[j].nodeName === "from") {
                        fromAux = {
                            x: this.reader.getFloat(orthoChildren[j], 'x'),
                            y: this.reader.getFloat(orthoChildren[j], 'y'),
                            z: this.reader.getFloat(orthoChildren[j], 'z')
                        }
                    } else if (orthoChildren[j].nodeName === "to") {
                        toAux = {
                            x: this.reader.getFloat(orthoChildren[j], 'x'),
                            y: this.reader.getFloat(orthoChildren[j], 'y'),
                            z: this.reader.getFloat(orthoChildren[j], 'z')
                        }
                    }
                    // todo - default for up is 0,1,0 (make this happen if no up is defined)
                    else {
                        upAux = {
                            x: this.reader.getFloat(orthoChildren[j], 'x'),
                            y: this.reader.getFloat(orthoChildren[j], 'y'),
                            z: this.reader.getFloat(orthoChildren[j], 'z')
                        }
                    }
                }

                this.views[viewId] = this.createOrthoCamera({
                    near: this.reader.getFloat(children[i], 'near'),
                    far: this.reader.getFloat(children[i], 'far'),
                    left: this.reader.getFloat(children[i], 'left'),
                    right: this.reader.getFloat(children[i], 'right'),
                    top: this.reader.getFloat(children[i], 'top'),
                    bottom: this.reader.getFloat(children[i], 'bottom'),
                    from: fromAux,
                    to: toAux,
                    up: upAux
                })
            }
            this.viewsIds.push(viewId)
        }

        if (this.viewsIds.length === 0) {
            return "[VIEWS] No views defined. At least one must be defined"
        }
        if (!this.viewsIds.includes(this.defaultView)) {
            return "[VIEWS] Default View is not declared"
        }

        this.log("Parsed Views.")
    }

    /**
     * Parses the <illumination> node.
     * @param {illumination block element} illuminationsNode
     */
    parseIllumination(illuminationsNode) {
        var children = illuminationsNode.children;

        this.ambient = [];
        this.background = [];

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var ambientIndex = nodeNames.indexOf("ambient");
        var backgroundIndex = nodeNames.indexOf("background");

        var color = this.parseColor(children[ambientIndex], "ambient");
        if (!Array.isArray(color))
            return color;
        else
            this.ambient = color;

        color = this.parseColor(children[backgroundIndex], "background");
        if (!Array.isArray(color))
            return color;
        else
            this.background = color;

        this.log("Parsed Illumination.");

        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            // Storing light information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            //Check type of light
            if (children[i].nodeName != "light") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            } else {
                attributeNames.push(...["enable", "position", "ambient", "diffuse", "specular"]);
                attributeTypes.push(...["boolean", "position", "color", "color", "color"]);
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "boolean")
                        var aux = this.parseBoolean(grandChildren[attributeIndex], "value", "enabled attribute for light of ID" + lightId);
                    else if (attributeTypes[j] == "position")
                        var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID" + lightId);
                    else
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);

                    if (typeof aux === 'string')
                        return aux;

                    global.push(aux);
                } else
                    return "light " + attributeNames[i] + " undefined for ID = " + lightId;
            }
            this.lights[lightId] = global;
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");
        return null;
    }

    /**
     * Parses the <textures> block.
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {
        let children = texturesNode.children

        this.textures = []

        //For each texture in textures block, check ID and file URL
        for (let i = 0; i < children.length; i++) {
            if (children[i].nodeName !== "texture") {
                this.onXMLMinorError("[TEXTURES] unknown tag <" + children[i].nodeName + ">");
                continue
            }
            const textureId = this.reader.getString(children[i], 'id')
            if (textureId.length === 0) {
                return "[TEXTURES] no texture ID defined"
            }
            if (this.textures[textureId] != null) {
                return "ID must be unique for each texture (conflict: ID = " + textureId + ")";
            }

            const file = this.reader.getString(children[i], 'path');
            if (file.includes('scenes/images')) {
                this.textures[textureId] = new CGFtexture(this.scene, file)
            } else if (file.includes('images/')) {
                this.onXMLMinorError("[TEXTURES] Texture path with ID: " + textureId + " not on 'scenes/', adding prefix scenes/ to path.")
                this.textures[textureId] = new CGFtexture(this.scene, "./scenes/" + file)
            } else {
                this.onXMLMinorError("[TEXTURES] Texture path with ID: " + textureId + " not on 'scenes/images/', adding prefix path.")
                this.textures[textureId] = new CGFtexture(this.scene, "./scenes/images/" + file)
            }
        }

        this.log("Parsed Textures.")
        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        const children = materialsNode.children

        this.materials = []

        let count = 0
        // Any number of materials.
        for (let i = 0; i < children.length; i++) {
            if (children[i].nodeName !== "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">")
                continue;
            }

            // Get id of the current material.
            const materialID = this.reader.getString(children[i], 'id')
            if (materialID == null)
                return "no ID defined for material"

            // Checks for repeated IDs.
            if (this.materials[materialID] != null)
                return "ID must be unique for each material (conflict: ID = " + materialID + ")"

            // parsing materials
            const grandChildren = children[i].children
            let gchildnames = []
            for (let k = 0; k < grandChildren.length; k++)
                gchildnames.push(grandChildren[k].nodeName)

            let components = [];
            components["shininess"] = gchildnames.indexOf("shininess")
            components["emissive"] = gchildnames.indexOf("emissive")
            components["ambient"] = gchildnames.indexOf("ambient")
            components["diffuse"] = gchildnames.indexOf("diffuse")
            components["specular"] = gchildnames.indexOf("specular")

            for (const [key, value] of Object.entries(components)) {
                if (value === -1) {
                    return "[MATERIALS] Missing node <" + key + "> for material ID: " + materialID
                }
            }

            const shininess = this.reader.getFloat(grandChildren[components["shininess"]], 'value')
            if (isNaN(shininess) || shininess == null) {
                return "[MATERIALS] Shininess not valid for material ID: " + materialID
            }

            const emissive = this.parseColor(grandChildren[components["emissive"]], 'emissive')
            if (!Array.isArray(emissive)) return emissive
            const ambient = this.parseColor(grandChildren[components["ambient"]], 'ambient')
            if (!Array.isArray(ambient)) return ambient
            const diffuse = this.parseColor(grandChildren[components["diffuse"]], 'diffuse')
            if (!Array.isArray(diffuse)) return diffuse
            const specular = this.parseColor(grandChildren[components["specular"]], 'specular')
            if (!Array.isArray(specular)) return specular


            this.materials[materialID] = new CGFappearance(this.scene)
            this.materials[materialID].setShininess(shininess)
            this.materials[materialID].setEmission(emissive[0], emissive[1], emissive[2], emissive[3])
            this.materials[materialID].setAmbient(ambient[0], ambient[1], ambient[2], ambient[3])
            this.materials[materialID].setDiffuse(diffuse[0], diffuse[1], diffuse[2], diffuse[3])
            this.materials[materialID].setSpecular(specular[0], specular[1], specular[2], specular[3])

            count++
        }
        if (count === 0) {
            return "[MATERIALS] No materials defined"
        }

        this.log("Parsed Materials.");
        return null;
    }

    /**
     * Parses the <nodes> block.
     * @param {nodes block element} nodesNode
     */
    parseNodes(nodesNode) {
        const children = nodesNode.children;

        let grandChildren = [];
        let nodeNames = [];

        // Any number of nodes.
        for (let i = 0; i < children.length; i++) {
            if (children[i].nodeName !== "node") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">")
                continue
            }

            // Get id of the current node.
            const nodeID = this.reader.getString(children[i], 'id')
            if (nodeID == null)
                return "no ID defined for nodeID"

            // Checks for repeated IDs.
            if (this.nodes[nodeID] != null)
                return "ID must be unique for each node (conflict: ID = " + nodeID + ")"

            grandChildren = children[i].children

            nodeNames = [];
            for (let j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName)
            }

            const transformationsIndex = nodeNames.indexOf("transformations");
            const materialIndex = nodeNames.indexOf("material");
            const textureIndex = nodeNames.indexOf("texture");
            const descendantsIndex = nodeNames.indexOf("descendants");

            // checking if there is a material or a texture applied
            if (materialIndex === -1 || textureIndex === -1) {
                return "[NODES] No material or texture applied node ID: " + nodeID
            }

            // Transformations
            // when theres no <transformation> block we simply pass the identity matrix
            // and warn the user about it!
            const transformationMatrix = mat4.create()
            if (transformationsIndex === -1) {
                this.onXMLMinorError("[NODES] Lack of transformation tag on node ID: " + nodeID + ", proceeding with no transformations.")
            } else {
                const transformationsNode = grandChildren[transformationsIndex].children
                for (let j = 0; j < transformationsNode.length; j++) {
                    if (transformationsNode[j].nodeName === "rotation") {
                        const axis = this.reader.getString(transformationsNode[j], 'axis')
                        const angle = this.reader.getFloat(transformationsNode[j], 'angle')

                        if (axis == null || (axis !== "x" && axis !== "y" && axis !== "z")) {
                            return "[NODES] wrong value for axis on rotation - node id: " + nodeID
                        }
                        if (angle == null || isNaN(angle)) {
                            return "[NODES] wrong value for angle on rotation - node id: " + nodeID
                        }

                        mat4.rotate(transformationMatrix, transformationMatrix, angle * DEGREE_TO_RAD, this.axisCoords[axis])
                    } else if (transformationsNode[j].nodeName === "translation") {
                        const x = this.reader.getFloat(transformationsNode[j], "x")
                        const y = this.reader.getFloat(transformationsNode[j], "y")
                        const z = this.reader.getFloat(transformationsNode[j], "z")

                        if (x == null || y == null || z == null) {
                            return "[NODES] missing values for translation - node id: " + nodeID
                        }
                        if (isNaN(x) || isNaN(y) || isNaN(z)) {
                            return "[NODES] wrong values for translation - node id: " + nodeID
                        }

                        mat4.translate(transformationMatrix, transformationMatrix, [x, y, z])
                    } else if (transformationsNode[j].nodeName === "scale") {
                        const sx = this.reader.getFloat(transformationsNode[j], "sx")
                        const sy = this.reader.getFloat(transformationsNode[j], "sy")
                        const sz = this.reader.getFloat(transformationsNode[j], "sz")

                        if (sx == null || sy == null || sz == null) {
                            return "[NODES] missing values for scale - node id: " + nodeID
                        }
                        if (isNaN(sx) || isNaN(sy) || isNaN(sz)) {
                            return "[NODES] wrong values for scale - node id: " + nodeID
                        }

                        mat4.scale(transformationMatrix, transformationMatrix, [sx, sy, sz])
                    } else {
                        this.onXMLMinorError("[NODES] unknown tag <" + transformationsNode[j].nodeName + ">")
                    }
                }
            }

            // Material
            const materialId = this.reader.getString(grandChildren[materialIndex], "id")
            if (materialId == null) {
                return "[NODES] Material ID is not valid. node ID: " + nodeID
            }
            if (materialId !== "null") {
                if (this.materials[materialId] == null) {
                    return "[NODES] Material with ID: " + materialId + " does not exist. Error on node ID: " + nodeID
                }
            }

            // Texture
            const textureId = this.reader.getString(grandChildren[textureIndex], "id")
            if (textureId == null) {
                return "[NODES] Texture ID is not valid. node ID: " + nodeID
            }
            if (textureId !== "null" && textureId !== "clear") {
                if (this.textures[textureId] == null) {
                    return "[NODES] Texture with ID: " + textureId + " does not exist. Error on node ID: " + nodeID
                }
            }

            const textureChildren = grandChildren[textureIndex].children
            let amplification = {
                afs: 1.0,
                aft: 1.0
            }
            let textureChildrenName = []
            for (let j = 0; j < textureChildren.length; j++) {
                textureChildrenName.push(textureChildren[j].nodeName)
            }

            let amplificationIndex = textureChildrenName.indexOf('amplification')
            if (amplificationIndex === -1) {
                this.onXMLMinorError("[NODES] No amplification set for node id: " + nodeID + ", proceeding with default (1.0).")
            } else {
                const afs = this.reader.getFloat(textureChildren[amplificationIndex], 'afs')
                const aft = this.reader.getFloat(textureChildren[amplificationIndex], 'aft')
                if (aft == null || afs == null) {
                    return "[NODES] Amplification is not valid. Node ID: " + nodeID
                }
                if (isNaN(aft) || isNaN(afs)) {
                    this.onXMLMinorError("[NODES] No amplification set for node id: " + nodeID + ", proceeding with default (1.0).")
                } else {
                    amplification = {
                        afs: afs,
                        aft: aft
                    }
                }
            }
            const texture = {
                textureId: textureId,
                amplification: amplification
            }

            // Descendants
            const descendants = []
            const descendantsNodes = grandChildren[descendantsIndex].children
            for (let j = 0; j < descendantsNodes.length; j++) {
                if (descendantsNodes[j].nodeName === "noderef") {
                    const descID = this.reader.getString(descendantsNodes[j], 'id');

                    if (descID == null)
                        return "[NODES] Undefined ID for descendant. node id: " + nodeID;
                    else if (descID === nodeID)
                        return " [NODES] duplicated node id: " + nodeID;

                    descendants.push({
                        type: "noderef",
                        id: descID
                    })
                } else if (descendantsNodes[j].nodeName === "leaf") {
                    const type = this.reader.getString(descendantsNodes[j], "type", ['triangle', 'rectangle', 'cylinder', 'sphere', 'torus'])
                    if (type === "rectangle") {
                        const x1 = this.reader.getFloat(descendantsNodes[j], 'x1')
                        const y1 = this.reader.getFloat(descendantsNodes[j], 'y1')
                        const x2 = this.reader.getFloat(descendantsNodes[j], 'x2')
                        const y2 = this.reader.getFloat(descendantsNodes[j], 'y2')

                        if (x1 == null || x2 == null || y1 == null || y2 == null) {
                            return "[NODES] Missing values for rectangle leaf. Node id: " + nodeID
                        }
                        if (isNaN(x1) || isNaN(x2) || isNaN(y1) || isNaN(y2)) {
                            return "[NODES] Invalid values for rectangle leaf. Node id: " + nodeID
                        }

                        descendants.push({
                            type: "rectangle",
                            object: new MyRectangle(this.scene, x1, y1, x2, y2)
                        })
                    } else if (type === "triangle") {
                        const x1 = this.reader.getFloat(descendantsNodes[j], 'x1')
                        const y1 = this.reader.getFloat(descendantsNodes[j], 'y1')
                        const x2 = this.reader.getFloat(descendantsNodes[j], 'x2')
                        const y2 = this.reader.getFloat(descendantsNodes[j], 'y2')
                        const x3 = this.reader.getFloat(descendantsNodes[j], 'x3')
                        const y3 = this.reader.getFloat(descendantsNodes[j], 'y3')

                        if (x1 == null || x2 == null || y1 == null || y2 == null || x3 == null || y3 == null) {
                            return "[NODES] Missing values for triangle leaf. Node id: " + nodeID
                        }
                        if (isNaN(x1) || isNaN(x2) || isNaN(y1) || isNaN(y2) || isNaN(x3) || isNaN(y3)) {
                            return "[NODES] Invalid values for triangle leaf. Node id: " + nodeID
                        }

                        descendants.push({
                            type: "triangle",
                            object: new MyTriangle(this.scene, x1, y1, x2, y2, x3, y3)
                        })
                    } else if (type === "cylinder") {
                        const height = this.reader.getFloat(descendantsNodes[j], 'height')
                        const topRadius = this.reader.getFloat(descendantsNodes[j], 'topRadius')
                        const bottomRadius = this.reader.getFloat(descendantsNodes[j], 'bottomRadius')
                        const stacks = this.reader.getInteger(descendantsNodes[j], 'stacks')
                        const slices = this.reader.getInteger(descendantsNodes[j], 'slices')

                        if (height == null || topRadius == null || bottomRadius == null || stacks == null || slices == null) {
                            return "[NODES] Missing values for cylinder leaf. Node id: " + nodeID
                        } else if (isNaN(height) || isNaN(topRadius) || isNaN(bottomRadius) || isNaN(stacks) || isNaN(slices)) {
                            return "[NODES] Invalid values for cylinder leaf. Node id: " + nodeID
                        }

                        descendants.push({
                            type: "cylinder",
                            object: new MyCylinder(this.scene, height, topRadius, bottomRadius, stacks, slices)
                        })
                    } else if (type === "sphere") {
                        const radius = this.reader.getFloat(descendantsNodes[j], 'radius')
                        const stacks = this.reader.getInteger(descendantsNodes[j], 'stacks')
                        const slices = this.reader.getInteger(descendantsNodes[j], 'slices')

                        if (radius == null || stacks == null || slices == null)
                            return "[NODES] Missing values for sphere leaf. Node id: " + nodeID
                        else if (isNaN(radius) || isNaN(stacks) || isNaN(slices))
                            return "[NODES] Invalid values for sphere leaf. Node id: " + nodeID

                        descendants.push({
                            type: "sphere",
                            object: new MySphere(this.scene, radius, slices, stacks)
                        })
                    } else if (type === "torus") {
                        const inner = this.reader.getFloat(descendantsNodes[j], 'inner')
                        const outer = this.reader.getFloat(descendantsNodes[j], 'outer')
                        const loops = this.reader.getInteger(descendantsNodes[j], 'loops')
                        const slices = this.reader.getInteger(descendantsNodes[j], 'slices')

                        if (inner == null || outer == null || loops == null || slices == null)
                            return "[NODES] Missing values for torus leaf. Node id: " + nodeID
                        else if (isNaN(inner) || isNaN(outer) || isNaN(loops) || isNaN(slices))
                            return "[NODES] Invalid values for torus leaf. Node id: " + nodeID

                        descendants.push({
                            type: "torus",
                            object: new MyTorus(this.scene, inner, outer, slices, loops)
                        })
                    }
                }
            }
            if (descendants.length === 0) {
                return "[NODES] No descendants! Node id: " + nodeID
            }

            this.nodes[nodeID] = {
                matrix: transformationMatrix,
                material: this.materials[materialId],
                texture: texture,
                descendants: descendants
            }
        }

        let aux
        if ((aux = this.verifyDescendants()) !== null) {
            return "[NODES] Descendant node with ID: " + aux + " is not defined."
        }

        if (this.nodes[this.idRoot] == null) {
            return "[NODES] Root node not defined."
        }

        this.log("Parsed Nodes.")
        return null
    }

    /**
     * Verifica se consegue dar parse do valor boleano no atributo "name" do "node"
     * @param {Object} node nó a verificar
     * @param {String} name Nome do Atributo - "bollean"
     * @param {String} messageError Mensagem de Erro a apresentar
     */
    parseBoolean(node, name, messageError) {
        let boolVal = this.reader.getBoolean(node, name);
        if (!(boolVal != null && !isNaN(boolVal) && (boolVal == true || boolVal == false))) {
            this.onXMLMinorError("unable to parse value component " + messageError + "; assuming 'value = 1'");
            boolVal = true
        }
        return boolVal;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;

        position.push(...[x, y, z]);

        return position;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {Node} node
     * @param {String} Error Message
     */
    parseCoordinates4D(node, messageError) {
        var position = [];

        //Get x, y, z
        position = this.parseCoordinates3D(node, messageError);

        if (!Array.isArray(position))
            return position;


        // w
        var w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w)))
            return "unable to parse w-coordinate of the " + messageError;

        position.push(w);

        return position;
    }

    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {String} messageError Attribute Name
     */
    parseColor(node, messageError) {
        var color = [];

        // R
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse R component of the " + messageError;

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component of the " + messageError;

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component of the " + messageError;

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component of the " + messageError;

        color.push(...[r, g, b, a]);

        return color;
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        this.scene.pushMatrix()
        this.processNode(this.nodes[this.idRoot], this.nodes[this.idRoot].material, this.nodes[this.idRoot].texture)
        this.scene.popMatrix()
    }

    /**
     * Apllies all the components to the node and displays it.
     * @param {Node} node Node to Process
     * @param {any} material Material of Node
     * @param {any} texture Texture of Node
     */
    processNode(node, material, texture) {
        this.scene.multMatrix(node.matrix)

        let currentMaterial = material
        let currentTexture = texture

        if (node.texture.textureId !== "null") {
            currentTexture = node.texture
        }
        currentTexture.amplification = node.texture.amplification

        if (node.material != null) {
            currentMaterial = node.material
        }

        if (currentMaterial != null) {
            currentMaterial.apply()
        }

        for (let desc of node.descendants) {
            if (desc.type !== "noderef") {
                if (currentTexture.textureId !== "clear" && currentTexture.textureId !== "null") {
                    this.textures[currentTexture.textureId].bind()
                }
                if (!desc.object.updatedTexCoords) {
                    /* once object updates its texCoords we dont need to call this function
                     *  anymore, this flag - updatedTexCoords helps with that */
                    desc.object.updateTexCoords(currentTexture.amplification)
                }
                if (currentTexture.textureId !== "clear" && currentTexture.textureId !== "null")  {
                    this.textures[currentTexture.textureId].bind()
                }
                desc.object.display()
            } else {
                this.scene.pushMatrix()
                this.processNode(this.nodes[desc.id], currentMaterial, currentTexture)
                this.scene.popMatrix()
            }
        }
    }

    /**
     * Checks the Perspective Camera parameters and returns a CGFcamera()
     * @param {Map} elements Parameters of the Perspective Camera {near, far, angle, from, to}
     */
    createPerspectiveCamera(elements) {
        if (isNaN(elements.near)) {
            this.onXMLError('expected a float number on near.')
        }
        if (isNaN(elements.far)) {
            this.onXMLError('expected a float number on far.')
        }
        if (isNaN(elements.angle)) {
            this.onXMLError('expected a float number on angle.')
        }
        if (isNaN(elements.from.x)) {
            this.onXMLError('expected a float number o from(x)')
        }
        if (isNaN(elements.from.y)) {
            this.onXMLError('expected a float number o from(y)')
        }
        if (isNaN(elements.from.z)) {
            this.onXMLError('expected a float number o from(z)')
        }
        if (isNaN(elements.to.x)) {
            this.onXMLError('expected a float number o to(x)')
        }
        if (isNaN(elements.to.y)) {
            this.onXMLError('expected a float number o to(y)')
        }
        if (isNaN(elements.to.z)) {
            this.onXMLError('expected a float number o to(z)')
        }
        return new CGFcamera(elements.angle * DEGREE_TO_RAD, elements.near, elements.far, vec3.fromValues(elements.from.x, elements.from.y, elements.from.z), vec3.fromValues(elements.to.x, elements.to.y, elements.to.z))
    }

    /**
     * Checks the Orthographic Camera parameters and returns a CGFcamera()
     * @param {Map} elements Parameters of the Orthographic Camera {near, far, from, to, up, left, right, bottom, top}
     */
    createOrthoCamera(elements) {
        if (isNaN(elements.near)) {
            this.onXMLError('Perspective Views expected a float number on near.')
        }
        if (isNaN(elements.far)) {
            this.onXMLError('Perspective Views expected a float number on far.')
        }
        if (isNaN(elements.from.x)) {
            this.onXMLError('Perspective Views expected a float number o from(x)')
        }
        if (isNaN(elements.from.y)) {
            this.onXMLError('Perspective Views expected a float number o from(y)')
        }
        if (isNaN(elements.from.z)) {
            this.onXMLError('Perspective Views expected a float number o from(z)')
        }
        if (isNaN(elements.to.x)) {
            this.onXMLError('Perspective Views expected a float number o to(x)')
        }
        if (isNaN(elements.to.y)) {
            this.onXMLError('Perspective Views expected a float number o to(y)')
        }
        if (isNaN(elements.to.z)) {
            this.onXMLError('Perspective Views expected a float number o to(z)')
        }
        if (isNaN(elements.up.x)) {
            this.onXMLError('Perspective Views expected a float number o up(x)')
        }
        if (isNaN(elements.up.y)) {
            this.onXMLError('Perspective Views expected a float number o up(y)')
        }
        if (isNaN(elements.up.z)) {
            this.onXMLError('Perspective Views expected a float number o up(z)')
        }
        if (isNaN(elements.left)) {
            this.onXMLError('Perspective Views expected a float number on left.')
        }
        if (isNaN(elements.right)) {
            this.onXMLError('Perspective Views expected a float number on right.')
        }
        if (isNaN(elements.bottom)) {
            this.onXMLError('Perspective Views expected a float number on bottom.')
        }
        if (isNaN(elements.top)) {
            this.onXMLError('Perspective Views expected a float number on top.')
        }
        return new CGFcameraOrtho(elements.left, elements.right, elements.bottom, elements.top, elements.near, elements.far, vec3.fromValues(elements.from.x, elements.from.y, elements.from.z), vec3.fromValues(elements.to.x, elements.to.y, elements.to.z), vec3.fromValues(elements.up.x, elements.up.y, elements.up.z))
    }

    /**
     * Checks all child nodes of all the nodes to verify if any child node does not exist
     */
    verifyDescendants() {
        for (const [nodeID, node] of Object.entries(this.nodes)) {
            for (const desc of node.descendants) {
                if (desc.type === "noderef") {
                    if (this.nodes[desc.id] == null) {
                        return desc.id
                    }
                }
            }
        }
        return null
    }
}