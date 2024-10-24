import puppeteer, { Page } from 'puppeteer';
import fs from 'fs';
import { CONCERT_URL, COOKIES_JSON, delay, IS_HEADLESS, loadBrowser, NIGHT } from './shared';


const loadCookies = async () => {
  const cookiesData = fs.readFileSync(COOKIES_JSON, 'utf-8')
  const cookies = JSON.parse(cookiesData);

  await page.setCookie(...cookies);

  await page.waitForNetworkIdle();
}


const browser = await puppeteer.launch({ headless: IS_HEADLESS });
const page = await browser.newPage();


// Listen for the ticket popup

const newPagePromise = new Promise((resolve) => {
  browser.on('targetcreated', async (target) => {
    if (target.type() === 'page') {
      const newPage = await target.page();
      await newPage?.setViewport({ width: 1400, height: 1400 });
      resolve(newPage);
    }
  });
});


await loadCookies();
await loadBrowser(page, CONCERT_URL);


const dates = await page.$$('#box_list_date #list_date li');
await dates[NIGHT].click();
await page.waitForNetworkIdle();

await page.locator('.reservationBtn').click();
await page.waitForNetworkIdle();


// Seat selection opens in a popup

const newPage = await newPagePromise as Page;

await newPage.locator('#btn_later').click();
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


// Open each ticket category dropdown

const categories = await targetFrame?.$$('.box_seat_inner #divGradeSummary [id^=gd]') || []
for (const category of categories) {
  await category.click();
}


// Click through each section looking for seats

const sections = await targetFrame?.$$('.box_list_area li') || []
for (const section of sections) {
  await section.click();

  const fills = await targetFrame?.$$eval('#ez_canvas svg rect', rects => rects.map(rect => rect.getAttribute('fill')));

  const colours = new Set(fills);
  colours.delete("none");
  if (colours.size > 1) {
    const secName = await (await section.getProperty('textContent')).jsonValue();
    console.log("THERE'S A SEAT! Go to", secName);
    break;
  }

  await delay(500);
}

browser.close();

console.log("done.");