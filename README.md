# 🍉 Melon Camper

## Inspiration

While studying abroad in South Korea, my favourite kpop group, NCT, was scheduled to have a concert! Of course, I wanted to go, but I had one hurdle in front of me: getting tickets. I've fought my way through Ticketmaster before, but Korean ticketing was a mystery to me. I went to an internet café with my friends for the best internet possible, but in the end, we weren't all able to secure tickets :(

However, tickets would sporadically pop up on the website — a seat would reappear for a split second, then disappear the next. Clicking through the seating sections nonstop was the only way to scavenge for tickets. Hence, I created Melon Camper, a script that "camps" on the Melon ticketing website and searches for your concert ticket!

## How It Works

Melon Camper is a Python script that clicks through a concert on the Global Melon website, then alerts you when a ticket is found! It uses Puppeteer to open a Chrome browser and log you into [tkglobal.melon.com](https://tkglobal.melon.com/main/index.htm?langCd=EN). You'll only need to log in once, because it saves the cookies for future usage.

Then, it searches through the seats of your concert of choice, and notifies you if it finds any available tickets!

https://github.com/user-attachments/assets/af11947c-b946-49db-9a70-0e49de896e50

## How To Use

1. Make a copy of `TEMPLATE_credentials.json` and name it `credentials.json`. Then fill it out with your information.
2. Create an empty JSON file to store your cookies. Update your constants in `shared.ts`.
3. Run `bun run login.ts` to populate your cookies! This way you won't have to log in every time.
4. Run `bun run camp.ts` to scavenge for tickets...

### `shared.ts` Constants to Change

- `CONCERT_URL` — the concert you want tickets for
- `NIGHT` — which date of the concert you want tickets for
- `CHECK_BEST` — whether or not you want to search in VIP too
- `LOOPS` — how many times should we check before giving up?
- `YOUTUBE_VIDEO` — the video that plays when a seat is found

## Next Steps

Currently, it skips the captcha that appears when you open the seating chart, so when the human comes back to actually purchase the ticket, they'll have to fill it out then. Maybe there's a way to automate the captcha too?

Additionally, the alert system is pretty simple — it's just a tab that opens and plays a YouTube video. In the future, I imagine a more sophisticated way of notifying the user of a ticket. Perhaps a text message, in case you're letting Melon Camper run for hours while you're away from your computer ;)

### Thanks for reading!

As a bonus, here's a picture from the concert <3

<img src="https://github.com/user-attachments/assets/a74acc78-7da1-4345-9dcb-1154396f727c" width="300px" alt="NCT Dream" />
