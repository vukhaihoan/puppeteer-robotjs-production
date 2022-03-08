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

async function gotoFacebookUrl(page, instancePage) {
  try {
    await page.goto("https://www.google.com/", {
      timeout: 0,
    });

    await instancePage.type("input[name=q]", "facebook việt nam", "TYPE GOOGLE SEARCH ");
    await page.keyboard.press("Enter");
    await waitForNavigationKnowError(page, { timeout: 0 }, "WAIT GOOGLE SEARCH LOAD ");
    await instancePage.click('a[href="https://vi-vn.facebook.com/"] > h3', "CLICK FACEBOOK ");
    await waitForNavigationKnowError(page, { timeout: 5000 }, "WAIT GOTO Facebook URL ");
    console.log("GOTO Facebook URL SUCCESS");
  } catch (error) {
    console.log("GOTO Facebook URL ERROR", error);
    throw new Error("GOTO Facebook URL ERROR");
  }
}

async function checkFailEmailKnowError(page, instancePage) {
  try {
    const failedLink = await page.waitForSelector("#suggLink", {
      hidden: true,
    });
    if (failedLink) {
      await instancePage.click("#suggLink", "CLICK FAIL LINK");
      const buttonNameMail = await instancePage.click("#Suggestions > div > a", "CLICK BUTTON NAME MAIL");
      // get Mail Name
      const newMail = (await buttonNameMail.getProperty("textContent"))._remoteObject.value;
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

async function runFaceBook({ user, profile }, i) {
  try {
    const { mail, password, last, first, born } = user;
    const { browser, GL } = await launchGologin(profile.profileId, true);
    Global.browser = browser;
    Global.GL = GL;
    const page = await browser.newPage();
    // await page.emulateNetworkConditions(slow3G);
    await installMouseHelper(page);
    const cursor = createCursor(page);
    const instancePageNormal = new PageFunctionNormal(page);
    const instancePageHuman = new PageFunctionHuman(page, cursor);
    await gotoFacebookUrl(page, instancePageNormal);

    await instancePageHuman.clickHuman('a[data-testid="open-registration-form-button"]', "CLICK REGISTER BUTTON");

    // await instancePageHuman.typeHuman('input[name="lastname"]', last, "TYPE LAST NAME");

    // await instancePageHuman.typeHuman('input[name="firstname"]', first, "TYPE FIRST NAME");

    // await instancePageHuman.typeHuman('input[name="reg_email__"]', mail + "@outlook.com", "TYPE EMAIL");

    // await instancePageHuman.typeHuman(
    //   'input[name="reg_email_confirmation__"]',
    //   mail + "@outlook.com",
    //   "TYPE EMAIL CONFIRM"
    // );

    // await instancePageHuman.typeHuman('input[id="password_step_input"', password, "TYPE PASSWORD");

    await instancePageHuman.clickHuman('select[id="day"]', "CLICK DAY");

    await instancePageHuman.clickHuman('option[value="28"]', "CLICK DAY 28");

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
module.exports = runFaceBook;
