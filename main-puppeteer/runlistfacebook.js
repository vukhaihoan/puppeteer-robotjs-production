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
        // const { profile } = await createUserAndProfileFs();
        // console.log("user ", user);
        // console.log(
        //   "change proxy profile status code : ",
        //   await changeProxyOfProfile(
        //     profile.profileId,
        //     "socks5",
        //     "100014837701498.ldproxy.com",
        //     17309
        //   )
        // );
        // await proxyChangerGoLogin("socks5", "100014837701498.ldproxy.com", 17309);
        // console.log(await proxyChangerXproxy(17309));
        // await runFacebookBridge({ user, profile }, i);
        const user = {
          mail: { Normal: "thanhnguyen91700z", Hard: "nguyenthanh23" },
          password: "NguyenJWK270?",
          lastOne: "Nguyễn",
          last: "Vũ",
          first: "Thanh",
          fullName: "Nguyễn Thanh",
          born: { day: "29", month: "3", year: "2002" },
        };
        const profile = {
          profileId: "62295b049c1f935f0c801c05",
          profileName: "vxGS6Nhan69!",
        };
        console.log(
          "change proxy profile status code : ",
          await changeProxyOfProfile(profile.profileId, "socks5", "100014837701498.ldproxy.com", 17309)
        );
        // console.log(await proxyChangerXproxy(17309));
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
