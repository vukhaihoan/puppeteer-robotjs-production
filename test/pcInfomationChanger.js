const { click } = require("../pyscript/robotjsFunction");
const { delay } = require("../src/utils");
async function changePCInfo() {
  await click("icon_normal", 5);
  // await delay(700);
  await click("randall");
  await delay(1200);
  await click("ok");
  await delay(200);
  await click("yes");
  // await delay(3000);
  await click("ok_popup");
  await click("icon_normal", 4);
  console.log("success");
}
// changePCInfo();
module.exports = changePCInfo;
