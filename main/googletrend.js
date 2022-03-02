"use strict";

var googleTrends = require("google-trends-api");

/* ******************* Autocomplete **************************/

// googleTrends.autoComplete({keyword: 'Back to school'})
// .then((res) => {
//   console.log('this is res', res);
// })
// .catch((err) => {
//   console.log('got the error', err);
//   console.log('error message', err.message);
//   console.log('request body',  err.requestBody);
// });

/* ******************* Interest over time **************************/

// googleTrends.interestOverTime({keyword: 'Valentines Day'})
// .then((res) => {
//   console.log('this is res', res);
// })
// .catch((err) => {
//   console.log('got the error', err);
//   console.log('error message', err.message);
//   console.log('request body',  err.requestBody);
// });

// googleTrends.interestOverTime({
//   keyword: 'Valentines Day',
//   startTime: new Date(Date.now() - (4 * 60 * 60 * 1000)),
//   granularTimeResolution: true,
// }, function(err, results) {
//   if (err) console.log('oh no error!', err);
//   else console.log(results);
// });

/* ****** Interest over time - Set a custom timezone ***************/

// googleTrends.interestOverTime({
//   keyword: 'Valentines Day',
//   timezone: new Date().getTimezoneOffset() / 60,
// }, function(err, results) {
//   if (err) console.log('oh no error!', err);
//   else console.log(results);
// });

/* ****** Interest over time - Comparing multiple keywords *********/
// googleTrends.interestOverTime({keyword: ['Valentines Day', 'Christmas Day']})
// .then((res) => {
//   console.log('this is res', res);
// })
// .catch((err) => {
//   console.log('got the error', err);
// })

/* ******************* Interest by region **************************/

// googleTrends.interestByRegion({
//   keyword: 'Donald Trump',
//   startTime: new Date('2017-02-01'),
//   endTime: new Date('2017-02-06'),
//   resolution: 'CITY',
// })
// .then((res) => {
//   console.log(res);
// })
// .catch((err) => {
//   console.log(err);
// })

// googleTrends.interestByRegion({
//   keyword: 'Donald Trump',
//   startTime: new Date('2017-02-01'),
//   endTime: new Date('2017-02-06'),
//   geo: 'US-CA',
// })
// .then((res) => {
//   console.log(res);
// })
// .catch((err) => {
//   console.log(err);
// })

/* ******************* Related queries **************************/

// googleTrends.relatedQueries({keyword: 'Westminster Dog Show'})
// .then((res) => {
//   console.log(res);
// })
// .catch((err) => {
//   console.log(err);
// })

/* ******************* Related topics **************************/

// googleTrends.relatedTopics({
//   keyword: 'Chipotle',
//   startTime: new Date('2015-01-01'),
//   endTime: new Date('2017-02-10'),
// })
// .then((res) => {
//   console.log(res);
// })
// .catch((err) => {
//   console.log(err);
// });

/* ************************* RealTime Trending Searches  ******************/
const fs = require("fs");
googleTrends.realTimeTrends(
    {
        geo: "VN",
        category: "all",
    },
    function (err, results) {
        if (err) {
            console.log(err);
        } else {
            const data = JSON.parse(results).storySummaries.trendingStories;
            // console.log(data)
            fs.writeFileSync(__dirname + "/trendsData.json", results);
            const listkeywords = data.map((item) => {
                return item.entityNames; // ["Truong Quynh Anh", "Xuan Lan", "Vũ Hà Anh", "Vietnam"]
            });
            const allKeywords = listkeywords.reduce((acc, curr) => {
                return acc.concat(curr);
            }, []);
            console.log(allKeywords);
            fs.writeFileSync(__dirname + "/../data/listKeywords.json", JSON.stringify(allKeywords));
        }
    }
);

// make one big array of all the keywords

/* ***********************  Daily Trends *******************************/
// Please note that google only keeps around T-15 days of daily trends information.
// TrendDate designation that go too far back in the past will result in an error.
// Note: TrendDate is optional and will default to currentDate

// googleTrends.dailyTrends(
//     {
//         trendDate: new Date("2022-02-15"),
//         geo: "VN",
//     },
//     function (err, results) {
//         if (err) {
//             console.log("oh no error!", err);
//         } else {
//             const data = JSON.parse(results).default;
//             console.log(data);
//         }
//     }
// );
