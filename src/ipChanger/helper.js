const util = require("util");
const exec = util.promisify(require("child_process").exec);
// const isAdmin = require("is-admin");
const { axios } = require("../utils");
async function checkConnection() {
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
async function checkIp(onlyv4) {
    const resv4 = await axios.get("http://v4.ipv6-test.com/api/myip.php");
    console.log("ipv4 : " + resv4.data);
    const resv4v6 = await axios.get("http://v4v6.ipv6-test.com/api/myip.php");
    console.log("ipv4v6 : " + resv4v6.data);
    if (onlyv4) {
        return {
            ipv4: resv4.data,
            ipv4v6: resv4v6.data,
        };
    }
    const resv6 = await axios.get("http://v6.ipv6-test.com/api/myip.php");
    console.log("ipv6 : " + resv6.data);
    return {
        ipv4: resv4.data,
        ipv6: resv6.data,
        ipv4v6: resv4v6.data,
    };
}
function block4v6(ipv6) {
    return ipv6.split(":")[3];
}
async function compareIp(fullchangeCallback, onlyv4) {
    const IpBeforeChange = await checkIp(onlyv4);
    await fullchangeCallback();
    const IpAfterChange = await checkIp(onlyv4);
    let result = {
        v4Changed: false,
        v6Changed: false,
        success: false,
    };
    if (IpBeforeChange.ipv4 != IpAfterChange.ipv4) {
        result.v4Changed = true;
        console.log("ipv4 changed");
    } else {
        console.log("ipv4 not changed");
    }
    if (onlyv4) {
        delete result.v6Changed;
        if (result.v4Changed) {
            result.success = true;
            console.log("only v4 changed success");
        } else {
            result.success = false;
            console.log("only v4 changed failed");
        }
    } else {
        if (
            IpBeforeChange.ipv6 != IpAfterChange.ipv6 &&
            block4v6(IpBeforeChange.ipv6) != block4v6(IpAfterChange.ipv6)
        ) {
            result.v6Changed = true;
            console.log("ipv6 changed");
        } else {
            console.log("ipv6 not changed");
        }
        if (result.v4Changed && result.v6Changed) {
            result.success = true;
            console.log("succes change ip");
        } else {
            console.log("failed change ip");
        }
    }

    return result;
}
/**
 * example:
 * await checkConnection()
 * await checkIp()
 * console.log(await switchAdapter(0, "Ethernet"));
 * console.log(await switchAdapter(1, "Ethernet"));
 */
module.exports = {
    checkConnection,
    checkIp,
    switchAdapter,
    compareIp,
};
