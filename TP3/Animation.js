/**
 * Easing Functions
 * @type {Readonly<{easeInOutCirc: (function(*): number), easeInOutSine: (function(*)), easeInOutBack: (function(*): number), easeInOutElastic: (function(*): number), easeOutElastic: (function(*): number), easeInOutCubic: (function(*): number), easeInOutQuart: (function(*): number), easeOutCirc: (function(*): number)}>}
 */
const Animations = Object.freeze({
    easeInOutSine: (x) => -(Math.cos(Math.PI * x) - 1) / 2,
    easeInOutCubic: (x) => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2,
    easeOutCirc: (x) => Math.sqrt(1 - Math.pow(x - 1, 2)),
    easeInOutCirc: (x) => x < 0.5
        ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2
        : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2,
    easeInOutElastic: (x) => {
        const c5 = (2 * Math.PI) / 4.5;
        return x === 0
            ? 0
            : x === 1
                ? 1
                : x < 0.5
                    ? -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * c5)) / 2
                    : (Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * c5)) / 2 + 1;
    },
    easeInOutBack: (x) => {
        const c1 = 1.70158;
        const c2 = c1 * 1.525;
        return x < 0.5
            ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
            : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
    },
    easeInOutQuart: (x) => x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2,
    easeOutElastic: (x) => {
        const c4 = (2 * Math.PI) / 3;

        return x === 0
            ? 0
            : x === 1
                ? 1
                : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
    }
})

/**
 * Map to send to the interface
 * @type {Readonly<{"Ease In Out Elastic": string, "Ease In Out Cubic": string, "Ease In Out Quart": string, "Ease In Out Sine": string, "Ease In Out Circular": string, "Ease In Out Back": string, "Ease Out Elastic": string, "Ease Out Circular": string}>}
 */
const AnimationIndexes = Object.freeze({
    'Ease In Out Sine': 'easeInOutSine',
    'Ease In Out Cubic': 'easeInOutCubic',
    'Ease Out Circular': 'easeOutCirc',
    'Ease In Out Circular': 'easeInOutCirc',
    'Ease In Out Elastic': 'easeInOutElastic',
    'Ease In Out Back': 'easeInOutBack',
    'Ease In Out Quart': 'easeInOutQuart',
    'Ease Out Elastic': 'easeOutElastic'
})

/**
 * Animation parent class
 */
class Animation {
    /**
     * Starts the animation object
     * @param instant_start
     * @param instant_end
     */
    constructor(instant_start, instant_end) {
        this.start = instant_start
        this.end = instant_end

        this.current_matrix = mat4.create()
    }

    /**
     * @abstract
     */
    apply() {
        throw new Error("Abstract class cannot implement methods.");
    }

    /**
     * @abstract
     * @param t time
     */
    update(t) {
        throw new Error("Abstract class cannot implement methods.");
    }

    clone() {
        return Object.assign(
            Object.create(
                // Set the prototype of the new object to the prototype of the instance.
                // Used to allow new object behave like class instance.
                Object.getPrototypeOf(this),
            ),
            // Prevent shallow copies of nested structures like arrays, etc
            JSON.parse(JSON.stringify(this)),
        );
    }
}