const {
  modem,
  dcomHilink,
  helper: { compareIpLocalhost, switchAdapter },
} = require("../src/ipChanger");
const pcInfomationChanger = require("./pcInfomationChanger");
async function change() {
  await modem();
  await switchAdapter(0);
  await switchAdapter(1);
  // await pcInfomationChanger();
}
async function main() {
  const result = await compareIpLocalhost(change, { v6: false });
  // let result = await compareIp(dcomHilink, true);
  console.log(result);
}
main();
