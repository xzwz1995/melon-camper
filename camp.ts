import puppeteer, { Page } from 'puppeteer';
import fs from 'fs';
import { CONCERT_URL, IS_HEADLESS, loadBrowser } from './shared';

const COOKIES_JSON = "./cookies.json"

const delay = async (time: number) => {
  return new Promise(function(resolve) { 
      setTimeout(resolve, time)
  });
}

const loadCookies = async () => {
  const cookiesData = fs.readFileSync(COOKIES_JSON, 'utf-8')
  const cookies = JSON.parse(cookiesData);

  await page.setCookie(...cookies);

  await page.waitForNetworkIdle();
}


const browser = await puppeteer.launch({ headless: IS_HEADLESS });
const page = await browser.newPage();

// Listen for the new tab
const newPagePromise = new Promise((resolve) => {
  browser.on('targetcreated', async (target) => {
    if (target.type() === 'page') {
      const newPage = await target.page();
      await newPage.setViewport({ width: 1400, height: 1400 });
      resolve(newPage);
    }
  });
});


await loadCookies();
await loadBrowser(page, CONCERT_URL);

// TDS3 Concert Page
await page.locator('text/Sun, Dec 01, 2024').click();
await page.waitForNetworkIdle();
await page.locator('text/Get Tickets').click();
await page.waitForNetworkIdle();

// Skip login and cookies, only have to run this one
// await logIn();
// await saveCookies();

const newPage = await newPagePromise as Page;

await newPage.locator('text/To See the seats first, Click here').click();
await newPage.waitForNetworkIdle();


// All the seat info is in a frame, so need to find that frame

const frames = newPage.frames();
let targetFrame;

for (const frame of frames) {
  const seats = await frame.$('.box_seat_inner #divGradeSummary [id^=gd]');
  if (seats) {
      targetFrame = frame;
      break;
  }
}

const categories = await targetFrame?.$$('.box_seat_inner #divGradeSummary [id^=gd]')
for (const category of categories) {
  await category.click();
  await delay(200);
}

const sections = await targetFrame?.$$('.box_list_area li');

for (const section of sections) {
  await section.click();
  // await delay(400); // might not need delay just wait for it to load?
  await targetFrame?.waitForNavigation();

  const fills = await targetFrame?.$$eval('#ez_canvas svg rect', rects => rects.map(rect => rect.getAttribute('fill')));

  const colours = new Set(fills)
  if (colours.has("none")) colours.delete("none")
  if (colours.size > 1) console.log("OMG!!!! THERE'S A SEAT:", colours)
}

console.log("done.")