require("dotenv").config();
const {
  createUserAndProfileBridge,
  gologinApi: { changeProxyOfProfile },
} = require("../sbridge");
const fs = require("fs");
async function main() {
  const result = await createUserAndProfileBridge();
  fs.writeFileSync(__dirname + "/../data/oneProfile.json", JSON.stringify(result));
  console.log(
    "change proxy profile status code : ",
    await changeProxyOfProfile(result.profile.profileId, "socks5", "100014837701498.ldproxy.com", 17309)
  );
}
main();
