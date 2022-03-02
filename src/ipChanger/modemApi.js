const { axios, delay } = require("../utils");
const https = require("https");
const FormData = require("form-data");
const cheerio = require("cheerio");
const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
});
const defaultOptions = {
    withCredentials: true,
    baseURL: "https://192.168.1.1/",
    httpsAgent,
    headers: {
        Host: "192.168.1.1",
        Connection: "keep-alive",
        // "Content-Length": 0,
        "sec-ch-ua": '" Not A;Brand";v="99", "Chromium";v="98", "Google Chrome";v="98"',
        // Accept: "*/*",
        "X-Requested-With": "XMLHttpRequest",
        "sec-ch-ua-mobile": "?0",
        "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36",
        "sec-ch-ua-platform": '"Windows"',
        Origin: "https://192.168.1.1",
        "Sec-Fetch-Site": "same-origin",
        // "Sec-Fetch-Mode": "cors",
        // "Sec-Fetch-Dest": "empty",
        Referer: "https://192.168.1.1/",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.9,vi;q=0.8",
    },
};

const instance = axios.create(defaultOptions);

async function main() {
    const token = await instance({
        method: "post",
        url: "/asp/GetRandCount.asp",
        headers: {
            "Content-Length": 0,
            Accept: "*/*",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Dest": "empty",
        },
    }).then((res) => res.data);
    console.log(token);
    var bodyFormData = new FormData();
    bodyFormData.append("UserName", "admin");
    bodyFormData.append("PassWord", "SFdUQzlCMTAzNUE2");
    bodyFormData.append("Language", "english");
    bodyFormData.append("x.X_HW_Token", token);
    await instance({
        method: "post",
        url: "/login.cgi",
        headers: {
            "Content-Length": 103,
            "Cache-Control": "max-age=0",
            "Upgrade-Insecure-Requests": 1,
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-User": "?1",
            "Sec-Fetch-Dest": "document",
            Cookie: "Cookie=sid=a34f7974a77c0adc6949fed2abc92999213e3dfbc0a4651b488ce1311b28a517:Language:english:id=1",
        },
        // mode: "no-cors",
        data: bodyFormData,
        // maxRedirects: 0,
        // validateStatus: function (status) {
        //     return status >= 200 && status < 303;
        // },
    }).then((res) => {
        console.log(res.headers);
        console.log(res.status);
        console.log(res.data);
    });
}
main();
