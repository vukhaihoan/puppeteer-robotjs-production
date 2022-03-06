const axios = require("axios");
const axiosRetry = require("axios-retry");
// axios.interceptors.response.use(async (response) => {
//     if (response.status == 200) {
//         const err = new Error("ERROR CATCH I want to retry");
//         err.config = response.config; // axios-retry using this
//         err.response = response; // optional, if you need for retry condition
//         throw err;
//     }
//     return response;
// });

axiosRetry(axios, {
    retries: 5, // number of retries
    retryDelay: (retryCount) => {
        console.log(`retry attempt: ${retryCount}`);
        return retryCount * 2000; // time interval between retries
    },
    retryCondition: (error) => {
        console.log("retryCondition axios");
        return true;
    },
});
i = 0;
const instance = axios.create();
instance.interceptors.response.use(async (response) => {
    i++;
    if (i < 10) {
        if (response.status == 200) {
            const err = new Error("ERROR CATCH I want to200200200200 retry");
            err.config = response.config; // axios-retry using this
            err.response = response; // optional, if you need for retry condition
            throw err;
        }
        return response;
    }
    console.log("ok");
    if (response.status == 201) {
        const err = new Error("ERROR CATCH I want0101 to retry");
        err.config = response.config; // axios-retry using this
        err.response = response; // optional, if you need for retry condition
        throw err;
    }
    return response;
});
axiosRetry(instance, {
    retries: 8, // number of retries
});

axios
    .get("https://example.com/", {
        "axios-retry": {
            retryDelay: (retryCount) => {
                console.log(`retry attempt: ${retryCount}`);
                return retryCount * 1000; // time interval between retries
            },
            retryCondition: (error) => {
                console.log("retry condition");
                return false;
            },
        },
    })
    .then((res) => console.log(res.data))
    .catch((err) => console.log(err.message)); // gonna be here anyway as we'll fail due to interceptor logic
