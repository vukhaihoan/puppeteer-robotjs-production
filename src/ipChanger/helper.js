const util = require("util");
const exec = util.promisify(require("child_process").exec);
// const isAdmin = require("is-admin");
const { axios } = require("../utils");
async function checkConnectionLocalhost() {
    const { stdout, stderr } = await exec("ping 192.168.1.1");
    // if stdout
    if (stdout) {
        if (stdout.indexOf("Destination host unreachable") > -1) {
            throw new Error("connection failed : 192.168.1.1");
        } else {
            console.log("connection success : 192.168.1.1");
        }
    }
    // if stderr
    if (stderr) {
        throw new Error("connection failed: 192.168.1.1");
    }
}
async function switchAdapter(onoff, namep) {
    // if ((await isAdmin()) == false) {
    //     throw new Error("not admin");
    // }
    let status;
    let name = namep || "Ethernet 3";
    if (onoff == 1) {
        try {
            const { stdout, stderr } = await exec(`netsh interface set interface "${name}" enable`);
            if (stdout) {
                console.log(`${name} is enabled`);
                status = 1;
            }
            if (stderr) {
                throw new Error(`${name} is not enabled`);
            }
        } catch (error) {
            status = 1;
            console.log(`${name} is current enabled`);
        }
    } else {
        const { stdout, stderr } = await exec(`netsh interface set interface "${name}" disable`);
        if (stdout) {
            status = 0;
            console.log(`${name} is disabled`);
        }
        if (stderr) {
            throw new Error(`${name} is not disabled`);
        }
    }
    return status;
}
async function checkIpLocalhost({ v4 = true, v6 = true }) {
    let ipList = {
        ipv4: null,
        ipv6: null,
        ipv4v6: null,
    };
    const resv4v6 = await axios.get("http://v4v6.ipv6-test.com/api/myip.php");
    ipList.ipv4v6 = resv4v6.data;
    if (v4) {
        const resv4 = await axios.get("http://v4.ipv6-test.com/api/myip.php");
        ipList.ipv4 = resv4.data;
    }
    if (v6) {
        const resv6 = await axios.get("http://v6.ipv6-test.com/api/myip.php");
        ipList.ipv6 = resv6.data;
    }
    return ipList;
}
function block4v6(ipv6) {
    return ipv6.split(":")[3];
}
async function compareIpLocalhost(fullchangeCallback, { v4, v6 }) {
    const IpBeforeChange = await checkIpLocalhost({ v4, v6 });
    await fullchangeCallback();
    const IpAfterChange = await checkIpLocalhost({ v4, v6 });
    let ipChangerCompareResult = {
        v4Changed: false,
        v6Changed: false,
        message: "BOTH_V4_V6",
    };
    if (v4) {
        if (IpBeforeChange.ipv4 != IpAfterChange.ipv4) {
            ipChangerCompareResult.v4Changed = true;
            console.log("ipv4 changed");
        } else {
            console.log("ipv4 not changed");
        }
    } else {
        ipChangerCompareResult.message = "NO_V4";
    }
    if (v6) {
        if (
            IpBeforeChange.ipv6 != IpAfterChange.ipv6 &&
            block4v6(IpBeforeChange.ipv6) != block4v6(IpAfterChange.ipv6)
        ) {
            ipChangerCompareResult.v6Changed = true;
            console.log("ipv6 changed");
        } else {
            console.log("ipv6 not changed");
        }
    } else {
        ipChangerCompareResult.message = "NO_V6";
    }

    return ipChangerCompareResult;
}
/**
 * example:
 * await checkConnectionLocalhost()
 * await checkIpLocalhost()
 * console.log(await switchAdapter(0, "Ethernet"));
 * console.log(await switchAdapter(1, "Ethernet"));
 */
module.exports = {
    checkConnectionLocalhost,
    checkIpLocalhost,
    switchAdapter,
    compareIpLocalhost,
};
