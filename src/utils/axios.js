const axios = require("axios");
const axiosRetry = require("axios-retry");
axiosRetry(axios, {
    retries: 5, // number of retries
    retryDelay: (retryCount) => {
        console.log(`retry attempt: ${retryCount}`);
        return retryCount * 2000; // time interval between retries
    },
    // retryCondition: (error) => {
    //     // if retry condition is not specified, by default idempotent requests are retried
    //     return error.response.status === 503;
    // },
});
module.exports = axios;
