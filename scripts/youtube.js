const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const fs = require("fs");
const util = require("./util");

const width = 1024;
const height = 1600;

const youtubeList = ["https://www.youtube.com/@Moneygraphy/videos"];

const crawler = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: true,
    args: [`--window-size=${width},${height}`],
  });
  const page = await browser.newPage();

  for (let i = 0; i < youtubeList.length; i++) {
    await page.goto(youtubeList[i], {
      waitUntil: "load",
      timeout: 0,
    });

    await util.delay(1000);

    await page.click("#chips > yt-chip-cloud-chip-renderer:nth-child(2)");
  }
};

crawler().then(() => {
  console.log("크롤러 완료");
});
