const path = require("path");
const { createCursor, installMouseHelper } = require("ghost-cursor");
const { delay, rn, axios, goto } = require("../../utils");
const {
  humanizePuppeteer: { humanScroll, humanType },
  PuppeteerChromiumType,
} = require("../../shared/puppeteerFunction");
const { submitAnyCaptchaToken } = require("../../services/index");
const {
  launchGologin,
  closeBrowserAndGologin,
  waitForNavigationKnowError,
  PageFunctionNormal,
  PageFunctionHuman,
} = require("./shared");

async function gotoOutlookUrl(page, instancePage) {
  try {
    await page.goto("https://www.google.com/", {
      timeout: 0,
    });

    await instancePage.type("input[name=q]", "hotmail", "TYPE GOOGLE SEARCH ");
    await page.keyboard.press("Enter");
    await waitForNavigationKnowError(
      page,
      { timeout: 0 },
      "WAIT GOOGLE SEARCH LOAD "
    );
    await instancePage.click(
      'a[href="https://outlook.live.com/"] > h3',
      "CLICK HOTMAIL "
    );
    await waitForNavigationKnowError(
      page,
      { timeout: 5000 },
      "WAIT GOTO OUTLOOK URL "
    );
    console.log("GOTO OUTLOOK URL SUCCESS");
  } catch (error) {
    console.log("GOTO OUTLOOK URL ERROR", error);
    throw new Error("GOTO OUTLOOK URL ERROR");
  }
}

async function gotoSignUpUrl(page) {
  try {
    await page.waitForSelector(
      'a[href="https://outlook.live.com/owa/?nlp=1&signup=1"]'
    );
    const createButtonList = await page.$$(
      'a[href="https://outlook.live.com/owa/?nlp=1&signup=1"]'
    );
    try {
      await createButtonList[0].click({ delay: 100 });
    } catch (err) {
      await createButtonList[1].click({ delay: 100 });
    }
    await waitForNavigationKnowError(
      page,
      {
        waitUntil: "networkidle2",
        timeout: 0,
      },
      "WAIT GOTO SIGN UP URL"
    );
    console.log("GOTO SIGN UP URL SUCCESS");
  } catch (error) {
    console.log("GOTO SIGN UP URL ERROR", error);
    throw new Error("GOTO SIGN UP URL ERROR");
  }
}

async function checkFailEmailKnowError(page, instancePage) {
  try {
    const failedLink = await page.waitForSelector("#suggLink", {
      hidden: true,
    });
    if (failedLink) {
      await instancePage.click("#suggLink", "CLICK FAIL LINK");
      const buttonNameMail = await instancePage.click(
        "#Suggestions > div > a",
        "CLICK BUTTON NAME MAIL"
      );
      // get Mail Name
      const newMail = (await buttonNameMail.getProperty("textContent"))
        ._remoteObject.value;
      const newMailTextSplit = newMail.split("@")[0];
      console.log("NEW MAIL FAIL: ", newMailTextSplit);
      await instancePage.click("#iSignupAction", "CLICK SIGN UP BUTTON AGAIN");
      await delay(rn(2000, 3000));
    }
  } catch (error) {
    console.log("CHECK FAIL EMAIL KNOW ERROR : N0_FAIL_EMAIL");
  }
}

const slow3G = PuppeteerChromiumType.networkConditions["Slow 3G"];
const Global = {
  browser: null,
  GL: null,
  page: null,
};

async function runOutlook({ user, profile }, i) {
  try {
    const { mail, password, last, first, born } = user;
    const { browser, GL } = await launchGologin(profile.profileId, true);
    Global.browser = browser;
    Global.GL = GL;
    const page = await browser.newPage();
    // await page.emulateNetworkConditions(slow3G);
    const instancePage = new PageFunctionNormal(page);
    await installMouseHelper(page);
    const cursor = createCursor(page);

    await gotoOutlookUrl(page, instancePage);

    await gotoSignUpUrl(page, instancePage);

    await instancePage.type("#MemberName", mail.Normal, "TYPE MAIL");
    // await instancePage.type("#MemberName", "vukhaihoan", "TYPE MAIL"); // check fail email test
    await instancePage.click("#iSignupAction", "CLICK SIGN UP BUTTON");

    page.setDefaultTimeout(10000);
    await checkFailEmailKnowError(page, instancePage);
    page.setDefaultTimeout(20000);

    await instancePage.type(
      "#PasswordInput",
      password,
      "TYPE PASSWORD",
      2000,
      3000
    );

    await instancePage.click(
      "#ShowHidePasswordCheckbox",
      "CLICK SHOW HIDE PASSWORD"
    );

    await instancePage.click(
      "#iSignupAction",
      "CLICK SIGN UP BUTTON",
      2000,
      3000
    );

    await instancePage.type("#FirstName", last, "TYPE FIRST NAME", 1000, 2000);

    await instancePage.type("#LastName", first, "TYPE LAST NAME", 1000, 2000);

    await instancePage.click(
      "#iSignupAction",
      "CLICK SIGN UP BUTTON",
      2000,
      3000
    );

    await instancePage.select("#BirthMonth", born.month, "SELECT BORN MONTH");

    await instancePage.select("#BirthDay", born.day, "SELECT BORN DAY");

    await instancePage.type("#BirthYear", born.year, "SELECT BORN YEAR");

    await instancePage.click(
      "#iSignupAction",
      "CLICK SIGN UP BUTTON",
      4000,
      5000
    );

    await submitAnyCaptchaToken(page);

    await instancePage.click("#KmsiCheckboxField", "CLICK KMSI CHECKBOX");

    await instancePage.click(
      "#idSIButton9",
      "CLICK SIGN UP BUTTON",
      4000,
      5000
    );

    page.setDefaultTimeout(20000);
    await waitForNavigationKnowError(
      page,
      { waitUntil: "networkidle2" },
      "WAIT GOTO MAILBOX PAGE"
    );

    await delay(rn(4000, 5000));

    await instancePage.click(
      'span[title="no-reply@microsoft.com"]',
      "CLICK NO REPLY",
      3000,
      4000
    );

    // await page.waitForSelector('button[aria-label="Forward"]');
    // await page.evaluate(() => {
    //     document.querySelector('button[aria-label="Forward"]').scrollIntoView();
    // });
    await page.screenshot({
      path: path.resolve(__dirname, `../../../logs/${i}.png`),
    });

    // await page.close();

    await closeBrowserAndGologin(browser, GL);
  } catch (error) {
    console.log(`RUN PROFILE OUTLOOK ERROR : ${profile.profileId}`, error);
    await closeBrowserAndGologin(Global.browser, Global.GL, true);
  }
}
module.exports = runOutlook;
