var Jimp = require("jimp");
var robot = require("robotjs");
const { delay, rn, goto } = require("../src/utils");
const { findMultiple, findOne, compare, findCorner } = require("./pythonScript");
const path = require("path");

function location(x, y) {
  return {
    x: parseInt((x * 100) / 125),
    y: parseInt((y * 100) / 125),
  };
}

function point(p) {
  return (p * 100) / 125;
}

function captureImage({ x, y, w, h }) {
  const pic = robot.screen.capture(x, y, w, h);
  const width = pic.byteWidth / pic.bytesPerPixel; // pic.width is sometimes wrong!
  const height = pic.height;
  const image = new Jimp(width, height);
  let red, green, blue;
  pic.image.forEach((byte, i) => {
    switch (i % 4) {
      case 0:
        return (blue = byte);
      case 1:
        return (green = byte);
      case 2:
        return (red = byte);
      case 3:
        image.bitmap.data[i - 3] = red;
        image.bitmap.data[i - 2] = green;
        image.bitmap.data[i - 1] = blue;
        image.bitmap.data[i] = 255;
    }
  });
  return image;
}

async function compareImage(imgName, cutoffp) {
  const template = path.join(__dirname, `/images/templates/${imgName}.png`);
  const crop = path.join(__dirname, `/images/crops/${imgName}.png`);
  const status = await compare(template, crop);
  const cutoff = cutoffp || process.env.CUTOFF || 3;
  let result = false;
  if (status < cutoff) {
    result = true;
  }
  const data = {
    match: status,
    cutoff,
    result,
    name: imgName,
  };
  console.log(data);
  return data;
}
const { x, y, w, h } = { x: 0, y: 0, w: 1920, h: 1080 };

async function captrueAndFind(imgName) {
  captureImage({ x, y, w, h }).write(path.join(__dirname, `/images/captures/${imgName}.png`));
  const templateLocation = path.join(__dirname, `/images/templates/${imgName}.png`);
  const captrueLocation = path.join(__dirname, `/images/captures/${imgName}.png`);
  imgfind = await findOne(templateLocation, captrueLocation);
  return imgfind;
}

async function captrueAndFindCorner(imgName) {
  captureImage({ x, y, w, h }).write(path.join(__dirname, `/images/captures/${imgName}.png`));
  const templateLocation = path.join(__dirname, `/images/templates/${imgName}.png`);
  const captrueLocation = path.join(__dirname, `/images/captures/${imgName}.png`);
  imgfind = await findCorner(templateLocation, captrueLocation);
  return imgfind;
}

function captureOnly(imgName) {
  captureImage({ x, y, w, h }).write(path.join(__dirname, `/images/captures/${imgName}.png`));
}

async function findOnly(templateName, captrueName) {
  const templateLocation = path.join(__dirname, `/images/templates/${templateName}.png`);
  const captrueLocation = path.join(__dirname, `/images/captures/${captrueName}.png`);
  imgfind = await findOne(templateLocation, captrueLocation);
  const imgpoint = imgfind[0];
  const newpoint = location(imgpoint.x, imgpoint.y);
  return newpoint;
}
// function retryDelay(retryCount) {
//     console.log(`retry find image attempt: ${retryCount}`);
//     return retryCount * 2000; // time interval between retries
// }

async function findImagePoint(imgName, cutoff) {
  var imgfind;
  let callbackGoto = async function () {
    imgfind = await captrueAndFind(imgName);
  };
  let condition = async function () {
    const { result } = await compareImage(imgName, cutoff);
    return !result;
  };
  await goto(callbackGoto, condition);

  const imgpoint = imgfind[0];
  const newpoint = location(imgpoint.x, imgpoint.y);
  return newpoint;
}
async function findImagePointCorner(imgName, cutoff) {
  var imgfind;
  let callbackGoto = async function () {
    imgfind = await captrueAndFindCorner(imgName);
  };
  let condition = async function () {
    const { result } = await compareImage(imgName, cutoff);
    return !result;
  };
  await goto(callbackGoto, condition);

  const imgpoint = imgfind[0];
  const newpoint = location(imgpoint.x, imgpoint.y);
  return newpoint;
}

async function clickInit(imgName, callback, cutoff, double) {
  // var imgfind;
  // var i = 0;
  // var check = false;
  // start: while (true) {
  //     const { x, y, w, h } = { x: 0, y: 0, w: 1920, h: 1080 };
  //     captureImage({ x, y, w, h }).write(path.join(__dirname, `/images/captures/${imgName}.png`));
  //     const templateLocation = path.join(__dirname, `/images/templates/${imgName}.png`);
  //     const captrueLocation = path.join(__dirname, `/images/captures/${imgName}.png`);
  //     imgfind = await findOne(templateLocation, captrueLocation);
  //     await delay(retryDelay(i));
  //     i++;
  //     const status = await compareImage(imgName);
  //     if (i < 5 && !status) continue start;
  //     if (i == 5) {
  //         check = true;
  //     }
  //     break;
  // }
  // if (check) {
  //     throw new Error("Could not find image after 5 attempts");
  // }
  var imgfind;
  let callbackGoto = async function () {
    // const { x, y, w, h } = { x: 0, y: 0, w: 1920, h: 1080 };
    // captureImage({ x, y, w, h }).write(path.join(__dirname, `/images/captures/${imgName}.png`));
    // const templateLocation = path.join(__dirname, `/images/templates/${imgName}.png`);
    // const captrueLocation = path.join(__dirname, `/images/captures/${imgName}.png`);
    // imgfind = await findOne(templateLocation, captrueLocation);
    imgfind = await captrueAndFind(imgName);
  };
  let condition = async function () {
    const { result } = await compareImage(imgName, cutoff);
    return !result;
  };
  await goto(callbackGoto, condition);

  const imgpoint = imgfind[0];
  const newpoint = location(imgpoint.x, imgpoint.y);
  callback(newpoint);
  robot.mouseClick("left", double || false);
  console.log("click", imgName + " success");
  return null;
}

async function click(imgName, cutoff, double) {
  await clickInit(
    imgName,
    function (newpoint) {
      robot.moveMouse(newpoint.x, newpoint.y);
    },
    cutoff,
    double
  );
}

async function humanClick(imgName, cutoff, speed, double) {
  await clickInit(
    imgName,
    function (newpoint) {
      robot.moveMouseSmooth(newpoint.x, newpoint.y, speed || 0.2);
    },
    cutoff,
    double
  );
  await delay(rn(800, 1200));
}

async function type(imgName, string, cutoff, double) {
  await click(imgName, cutoff, double);
  robot.typeString(string);
}

async function humanType(imgName, string, cpm, cutoff, spell, double) {
  await humanClick(imgName, cutoff, spell, double);
  robot.typeStringDelayed(string, cpm || 1200);
  // robot.typeString(string);
  await delay(rn(800, 1200));
}

module.exports = {
  click,
  humanClick,
  type,
  humanType,
  helper: {
    location,
    point,
    captureImage,
    compareImage,
    clickInit,
    captrueAndFind,
    captureOnly,
    findOnly,
    findImagePoint,
    findImagePointCorner,
  },
  robot,
};
