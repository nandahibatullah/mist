# MIST | My Immediate Steam Tracker

This is dashboard app to see an overview of your steam library.
See your total hours played on Steam, top games, and your entire game library.
![image](/docs/Screenshot.png)

## Running locally

- Instal Node with a node manager like `fnm` or manually. Node version is inside the `.node-version` file.
- Install pnpm with `npm install -g pnpm@8.6.12`, should work with the latest though.
- Copy the example `.env.example` as `.env`
- Get a [Steam Web API Key](https://steamcommunity.com/dev/apikey)
- Paste it into the `STEAM_API_KEY` env variable.
- Install redis using the [following instructions](https://redis.io/docs/getting-started/installation/), or just use [upstash](https://upstash.com/docs/introduction).
- If you have redis locally and want to use that, you can set the `REDIS_URL` to your local instance. Otherwise, use your upstash redis url.
- run `pnpm i`
- run `pnpm dev`

## Running tests

- run `pnpm test`

## Technologies & Decisions

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app` with the following libraries:

- [Next.js](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

### Stack choice

The T3 stack is a great option to quickly get a deployable app up and running with type-safety across the entire application.

With tRPC and Typescript, I can define my API endpoints and easily consume them with full Type safety on frontend.

Using React, running on Next.js, I can easily manage this application, it's dependencies, and easily optimise page performance with the tools supplied.
Not to mention you can also have both SSR, and CSR where it makes sense.

Next.js also hooks up nicely to [Vercel](https://vercel.com/dashboard) to deploy to Preview and Production environments. The entire workflow from Dev to Prod is very seamless
and quick which is great for getting quick feedback on your work.

### Frontend styling

Tailwind CSS is a classic choice for easy styling without having to mess with any .css files. On top of that, I used [Mantine](https://mantine.dev/)
for a UI library to help speed up development in aiding me to not have to manually create common components.

I used the [Steam Web API](https://developer.valvesoftware.com/wiki/Steam_Web_API#GetPlayerSummaries_.28v0002.29) to query game data for a Steam user.
For caching on the heavy endpoints and to have the add-in benefit of some rate limiting, I used [upstash](https://upstash.com/docs/introduction) for my redis service.

### Backend tooling

I decided to not use a DB for this as I didn't want to have to manage the overhead of keeping sync of data from an external source that
doesn't really change all too much. A lot of the actions on the application are read-only so far, there is no need to store the data.

The only benefit of using a Database in this scenario is to be able to not rely on uptime from Steam, and also to avoid rate limits from Steam.
We can get around this by using redis to cache the responses from Steam. Not only will we reduce the amount of calls to Steam's API, but also,
we get a much faster response, than even a DB call, for the data.

I didn't do all of the endpoints just as of yet, I focused on the heavy cases like fetching player's entire library data over and over again.
Next.js + tRPC has some good options, some are on by default, to cache responses too from Server -> Client.

### CI/CD

Vercel has some great auto deploy features that when you push, you don't have to worry about it. I decided to take a manual approach
and use github actions to enable full control of my pipeline, and add some CI checks for PRs and pushes to main.
