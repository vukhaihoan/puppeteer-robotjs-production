var hisRobot = require("../../lib/his");
var {
    helper: { clickInit },
} = require("./robotjsFunction");
const { delay, rn, goto } = require("../utils");
/**
 * @param {Object} options - options
 * @param {Number} options.cutoff
 * @param {Boolean} options.double
 * @param {Number} options.tolerance
 * @param {Number} options.confidence
 * @param {Number} options.fatigue
 * @param {Number} options.randomX
 * @param {Number} options.randomY
 * @description click IMAGE
 */
async function hisClick(imgName, options) {
    const { cutoff, double, tolerance, confidence, fatigue, randomX, randomY } = options || {};
    await clickInit(
        imgName,
        function (newpoint) {
            const mouse = hisRobot.getMousePos();
            hisRobot.moveMouse({
                xStart: mouse.x,
                yStart: mouse.y,
                xEnd: newpoint.x + (randomX || 0),
                yEnd: newpoint.y + (randomY || 0),
                tolerance: tolerance || 0,
                confidence: confidence || 0.7,
                fatigue: fatigue || 0.8,
            });
        },
        cutoff,
        double
    );
    await delay(rn(500, 800));
}
/**
 * @param {Object} options - options
 * @param {Number} options.tolerance
 * @param {Number} options.confidence
 * @param {Number} options.fatigue
 * @param {double} options.double
 * @param {Number} options.randomX
 * @param {Number} options.randomY
 * @description click POINT
 */
function hisClickPoint(x, y, options) {
    const { double, tolerance, confidence, fatigue, randomX, randomY } = options || {};
    const mouse = hisRobot.getMousePos();
    hisRobot.moveMouse({
        xStart: mouse.x,
        yStart: mouse.y,
        xEnd: x + (randomX || 0),
        yEnd: y + (randomY || 0),
        tolerance: tolerance || 0,
        confidence: confidence || 0.7,
        fatigue: fatigue || 0.8,
    });
    hisRobot.mouseClick("left", double || false);
}
/**
 * @param {Object} options - options
 * @param {Number} options.cutoff
 * @param {Number} options.speed
 * @param {Boolean} options.double
 * @param {Number} options.tolerance
 * @param {Number} options.confidence
 * @param {Number} options.fatigue
 * @param {Number} options.randomX
 * @param {Number} options.randomY
 * @description click IMAGE smooth
 */
async function hisClickSmooth(imgName, options) {
    const { cutoff, speed, double, tolerance, confidence, fatigue, randomX, randomY } = options || {};
    await clickInit(
        imgName,
        function (newpoint) {
            const mouse = hisRobot.getMousePos();
            hisRobot.moveMouseSmooth({
                xStart: mouse.x,
                yStart: mouse.y,
                xEnd: newpoint.x + (randomX || 0),
                yEnd: newpoint.y + (randomY || 0),
                speed: speed || 0.2,
                tolerance: tolerance || 0,
                confidence: confidence || 0.7,
                fatigue: fatigue || 0.8,
            });
        },
        cutoff,
        double
    );
    // await delay(rn(800, 1200));
}
/**
 * @param {Object} options - opetions
 * @param {String} options.string
 * @param {Number} options.cutoff
 * @param {Boolean} options.double
 * @param {Number} options.tolerance
 * @param {Number} options.confidence
 * @param {Number} options.fatigue
 * @param {Number} options.toleranceKeyboard
 * @param {Number} options.confidenceKeyboard
 * @param {Number} options.fatigueKeyboard
 * @param {Number} options.speed
 * @param {Number} options.randomX
 * @param {Number} options.randomY
 * @description type string IMAGE
 */
async function hisTypeString(imgName, options) {
    const {
        string,
        cutoff,
        double,
        tolerance,
        confidence,
        fatigue,
        speed,
        toleranceKeyboard,
        confidenceKeyboard,
        fatigueKeyboard,
        randomX,
        randomY,
    } = options || {};
    await hisClick(imgName, { cutoff, double, tolerance, confidence, fatigue, randomX, randomY });
    hisRobot.typeString({
        string: string,
        tolerance: toleranceKeyboard || 0,
        confidence: confidenceKeyboard || 0.9,
        fatigue: fatigueKeyboard || 0.4,
        speed: speed || 0.2,
    });
}
/**
 * @param {Object} options - opetions
 * @param {String} options.string
 * @param {Boolean} options.double
 * @param {Number} options.tolerance
 * @param {Number} options.confidence
 * @param {Number} options.fatigue
 * @param {Number} options.toleranceKeyboard
 * @param {Number} options.confidenceKeyboard
 * @param {Number} options.fatigueKeyboard
 * @param {Number} options.speed
 * @param {Number} options.randomX
 * @param {Number} options.randomY
 * @description type string POINT
 */
function hisTypeStringPoint(x, y, options) {
    const {
        string,
        double,
        tolerance,
        confidence,
        fatigue,
        speed,
        toleranceKeyboard,
        confidenceKeyboard,
        fatigueKeyboard,
    } = options || {};
    hisClickPoint(x, y, { double, tolerance, confidence, fatigue, randomX, randomY });
    hisRobot.typeString({
        string: string,
        tolerance: toleranceKeyboard || 0,
        confidence: confidenceKeyboard || 0.9,
        fatigue: fatigueKeyboard || 0.4,
        speed: speed || 0.2,
    });
}
/**
 * @param {Object} options - opetions
 * @param {String} options.string
 * @param {Number} options.tolerance
 * @param {Number} options.confidence
 * @param {Number} options.fatigue
 * @param {Number} options.speed
 * @description type string ONLY
 */
function hisTypeStringOnly(options) {
    const { string, tolerance, confidence, fatigue, speed } = options || {};
    hisRobot.typeString({
        string: string,
        tolerance: tolerance || 0,
        confidence: confidence || 0.9,
        fatigue: fatigue || 0.4,
        speed: speed || 0.2,
    });
}

module.exports = {
    hisClick,
    hisClickPoint,
    hisClickSmooth,
    hisTypeString,
    hisTypeStringPoint,
    hisTypeStringOnly,
    hisRobot,
};
