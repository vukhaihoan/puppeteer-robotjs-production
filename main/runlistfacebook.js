// require("../overWrite");
require("dotenv").config();
const amount = 101;
var fs = require("fs");
var util = require("util");

const {
  runFacebookBridge,
  gologinApi: { changeProxyOfProfile, checkProxyFromGologinApi, compareProxyGologin, proxyChangerGoLogin },
  ipChanger: {
    xproxy: { getCurrentProxyXproxy, getNewProxyXproxy, compareProxyXproxy, proxyChangerXproxy },
  },
  createUserAndProfileBridge,
} = require("../sbridge");
const { listProfile, listFacebook, status } = require("../data");
const { delay, goto, axios, rn } = require("../src/utils");
const { consoleToLog, createUserAndProfileFs } = require("./shared");

async function main() {
  try {
    if (amount == 0) {
      throw new Error("Amount is 0");
    }
    let i = 100;
    while (i < amount) {
      try {
        // consoleToLog(i);
        // const { user, profile } = await createUserAndProfileFs();
        // console.log("user ", user);
        // console.log(
        //   "change proxy profile status code : ",
        //   await changeProxyOfProfile(
        //     profile.profileId,
        //     "socks5",
        //     "100014837701498.ldproxy.com",
        //     17039
        //   )
        // );
        // // await proxyChangerGoLogin("socks5", "100014837701498.ldproxy.com", 17039);
        // console.log(await proxyChangerXproxy(17039));
        // await runFacebookBridge({ user, profile }, i);
        const user = {
          mail: { Normal: "yennguyen861drt", Hard: "giapyen45su" },
          password: "6k2tHNguyen77*",
          lastOne: "Nguyễn",
          last: "Giáp",
          first: "Yến",
          fullName: "Nguyễn Yến",
          born: { day: "18", month: "6", year: "1998" },
        };
        const profile = {
          profileId: "62230a680d96188bdbbbde5e",
          profileName: "6k2tHNguyen77*",
        };
        await runFacebookBridge({ user, profile }, i);
      } catch (error) {
        console.log(`LOOP ${i} ERROR `, error);
      }
      console.log("LOOP " + i + " DONE");
      i++;
    }
    console.log("DONE ALL LOOP with amount " + amount);
  } catch (error) {
    console.log("MAIN FUNCTION ERROR ", error);
  }
}
main();
