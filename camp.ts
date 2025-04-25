import fs from "fs"
import puppeteer, { Page } from "puppeteer"
const tempDir = 'C:\\Temp\\puppeteer_profile';
import {
  CHECK_BEST,
  CONCERT_URL,
  COOKIES_JSON,
  IS_HEADLESS,
  LOOPS,
  NIGHT,
  YOUTUBE_VIDEO,
  delay,
  loadBrowser,
} from "./shared"

const loadCookies = async () => {
  const cookiesData = fs.readFileSync(COOKIES_JSON, "utf-8")
  const cookies = JSON.parse(cookiesData)

  await page.setCookie(...cookies)

  await page.waitForNetworkIdle()
}

const browser = await puppeteer.launch({ headless: IS_HEADLESS })
const page = await browser.newPage()

// Listen for the ticket popup

const newPagePromise = new Promise((resolve) => {
  browser.on("targetcreated", async (target) => {
    if (target.type() === "page") {
      const newPage = await target.page()
      await newPage?.setViewport({ width: 1400, height: 1400 })
      resolve(newPage)
    }
  })
})

await loadCookies()
await loadBrowser(page, CONCERT_URL)

const dates = await page.$$("#box_list_date #list_date li")
await dates[NIGHT].click()
await page.waitForNetworkIdle()

await page.locator(".reservationBtn").click()
await page.waitForNetworkIdle()

// Seat selection opens in a popup

const newPage = (await newPagePromise) as Page

await newPage.locator("#btn_later").click()
await newPage.waitForNetworkIdle()

// All the seat info is in a frame, so need to find that frame

const frames = newPage.frames()
let targetFrame

for (const frame of frames) {
  const seats = await frame.$(".box_seat_inner #divGradeSummary [id^=gd]")
  if (seats) {
    targetFrame = frame
    break
  }
}

// Open ticket category dropdowns

let categories =
  (await targetFrame?.$$(".box_seat_inner #divGradeSummary [id^=gd]")) || []

if (!CHECK_BEST) categories = categories.slice(1)
for (const category of categories) {
  await category.click()
}

// Click through each section looking for seats

const sections = (await targetFrame?.$$(".box_list_area li")) || []

let i = 0
while (i < LOOPS) {
  for (const section of sections) {
    const box = await section.boundingBox()
    if (box) {
      await section.click()

      const fills = await targetFrame?.$$eval("#ez_canvas svg rect", (rects) =>
        rects.map((rect) => rect.getAttribute("fill"))
      )

      const colours = new Set(fills)
      colours.delete("none")

      if (colours.size > 1) {
        const secName = await (
          await section.getProperty("textContent")
        ).jsonValue()
        console.log("THERE'S A SEAT! Go to", secName)

        i = 9999 // to exit the "infinite" loop
        break
      }
    }

    await delay(500)
  }

  i++
}

// Only close the browser if we DIDN'T find a ticket
// Otherwise, play a YouTube video to draw our attention

if (i < 9999) {
  browser.close()
} else {
  const youtube = await browser.newPage()
  await loadBrowser(youtube, YOUTUBE_VIDEO + "&themeRefresh=1")
  await youtube.locator(".ytp-play-button").click()
}

console.log("After", i, "loops, we've finished.")
