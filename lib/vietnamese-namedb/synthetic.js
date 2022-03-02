const fs = require("fs");
const readline = require("readline");
// const boy = fs.createReadStream("./txt/boy.txt");

// const boyline = readline.createInterface({
//     input: boy,
//     crlfDelay: Infinity,
// });

async function run() {
    let listarr = [];
    async function processLineByLine() {
        const file = fs.createReadStream("./txt/girl_one_word.txt");
        const fileline = readline.createInterface({
            input: file,
            crlfDelay: Infinity,
        });
        for await (const line of fileline) {
            if (!line) {
                break;
            }
            const item = {
                first_name: line,
            };
            listarr.push(item);
        }
    }
    await processLineByLine();
    fs.writeFileSync("girl_one_word.json", JSON.stringify(listarr));
}
run();
