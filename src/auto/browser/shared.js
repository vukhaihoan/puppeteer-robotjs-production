const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const adblocker = require("puppeteer-extra-plugin-adblocker");
const { createCursor, installMouseHelper, GhostCursor } = require("ghost-cursor");
puppeteer.use(StealthPlugin());
puppeteer.use(adblocker());
const { humanizePuppeteer, PuppeteerChromiumType } = require("../../shared/puppeteerFunction");
const { delay, rn, axios, goto } = require("../../utils");

const { launchProfileGologin } = require("../../initial/index");
async function launchGologin(profileId, uploadCookiesToServer) {
  try {
    let { ORBITA_BROWSER, params, env, GL } = await launchProfileGologin(profileId, uploadCookiesToServer);
    const browser = await puppeteer.launch({
      headless: false,
      executablePath: ORBITA_BROWSER,
      args: params,
      userDataDir: ORBITA_BROWSER[0].split("=")[1],
    });
    return {
      browser,
      GL,
    };
  } catch (error) {
    const errMessage = `LAUNCH PROFILE GOLOGIN ERROR : ${profileId}`;
    console.log(errMessage, error);
    throw new Error(errMessage);
  }
}
/**
 * @returns {Promise<{browser : PuppeteerChromiumType.Browser, GL : any}>}
 */
async function closeBrowserAndGologin(browser, GL, err) {
  try {
    (await browser.pages())
      .filter((value, index) => index > 0)
      .forEach(async (page, index) => {
        if (err) {
          console.log("FORCE CLOSE PAGE DUE TO ERROR : " + "https://" + page.url().split("/")[2]);
        } else {
          console.log("CLOSE PAGE BEFORE CLOSE BROWSER : " + "https://" + page.url().split("/")[2]);
        }

        await page.close();
      });
    await browser.close();
    await GL.stop();
    console.log("CLOSE Browser&Gologin SUCCESS");
  } catch (error) {
    const errMessage = `CLOSE Browner&Gologin ERROR `;
    console.log(errMessage, error);
    throw new Error(errMessage);
  }
}

async function waitForNavigationKnowError(page, options = {}, message = "unknown message") {
  try {
    await page.waitForNavigation(options);
  } catch (error) {
    console.log("WAIT FOR NAVIGATION KNOW ERROR : " + message);
  }
}

class PageFunctionNormal {
  constructor(page) {
    /**
     * @type {PuppeteerChromiumType.Page}
     */
    this.page = page;
  }
  async initAction(callback, message) {
    try {
      async function callBackGoto() {
        let condition = false;
        try {
          await callback();
        } catch (error) {
          console.log("ERROR IN ACTION : " + message, error);
          condition = true;
        }
        return condition;
      }
      await goto(callBackGoto, (condition) => condition, {
        retryMessage: `click ${message} by goto`,
      });
    } catch (error) {
      console.log(message + " ERROR", error);
      throw new Error(message + " ERROR");
    }
  }

  async click(selector, message, ...delayTime) {
    async function initCallback() {
      const element = await this.page.waitForSelector(selector);
      await delay(rn(500, 1000));
      await this.page.click(selector, { delay: 100 });
      await delay(rn(delayTime[0] || 500, delayTime[1] || 1000));
      console.log(message + " SUCCESS");
      return element;
    }
    const bindAction = initCallback.bind(this);
    await this.initAction(bindAction, message);
  }
  async type(selector, text, message, ...delayTime) {
    async function initCallback() {
      // await this.page.waitForSelector(selector);
      const element = await this.click(selector, "click before TYPE : " + message, delayTime[2], delayTime[3]);
      await this.page.keyboard.type(text, { delay: 100 });
      await delay(rn(delayTime[0] || 500, delayTime[1] || 1000));
      console.log(message + " SUCCESS");
      return element;
    }
    const bindAction = initCallback.bind(this);
    await this.initAction(bindAction, message);
  }
  async select(selector, value, message, ...delayTime) {
    async function initCallback() {
      // const element = await this.page.waitForSelector(selector);
      const element = await this.click(selector, "click before SELECT : " + message, delayTime[2], delayTime[3]);
      await this.page.select(selector, value);
      await delay(rn(delayTime[0] || 500, delayTime[1] || 1000));
      console.log(message + " SUCCESS");
      return element;
    }
    const bindAction = initCallback.bind(this);
    await this.initAction(bindAction, message);
  }
}

class PageFunctionHuman {
  constructor(page, cursor) {
    /**
     * @type {PuppeteerChromiumType.Page}
     */
    this.page = page;
    /**
     * @type {GhostCursor}
     */
    this.cursor = cursor;
  }
  async initAction(callback, message) {
    try {
      async function callBackGoto() {
        let condition = false;
        try {
          await callback();
        } catch (error) {
          console.log("ERROR IN ACTION (humanize) : " + message, error);
          condition = true;
        }
        return condition;
      }
      await goto(callBackGoto, (condition) => condition, {
        retryMessage: `click ${message} by goto`,
      });
    } catch (error) {
      console.log(message + " humanize ERROR", error);
      throw new Error(message + " humanize ERROR");
    }
  }
  async clickHuman(selector, message, ...delayTime) {
    async function initCallback() {
      const element = await this.page.waitForSelector(selector);
      await delay(rn(500, 1000));
      await this.cursor.click(selector);
      await delay(rn(delayTime[0] || 500, delayTime[1] || 1000));
      console.log(message + "humanize SUCCESS");
      return element;
    }
    const bindAction = initCallback.bind(this);
    await this.initAction(bindAction, message);
  }
  async typeHuman(selector, text, message, ...delayTime) {
    async function initCallback() {
      // await this.page.waitForSelector(selector);
      const element = await this.clickHuman(selector, "click before TYPE : " + message, delayTime[2], delayTime[3]);
      await humanizePuppeteer.humanType(this.page, text);
      await delay(rn(delayTime[0] || 500, delayTime[1] || 1000));
      console.log(message + " humanize SUCCESS");
      return element;
    }
    const bindAction = initCallback.bind(this);
    await this.initAction(bindAction, message);
  }
  async selectHuman(selector, value, message, ...delayTime) {
    // in development
  }

  async select(selector, value, message, ...delayTime) {
    async function initCallback() {
      // const element = await this.page.waitForSelector(selector);
      const element = await this.clickHuman(selector, "click before SELECT : " + message, delayTime[2], delayTime[3]);
      await this.page.select(selector, value);
      await delay(rn(delayTime[0] || 500, delayTime[1] || 1000));
      console.log(message + " SUCCESS");
      return element;
    }
    const bindAction = initCallback.bind(this);
    await this.initAction(bindAction, message);
  }
}

module.exports = {
  launchGologin,
  closeBrowserAndGologin,
  waitForNavigationKnowError,
  PageFunctionNormal,
  PageFunctionHuman,
};
