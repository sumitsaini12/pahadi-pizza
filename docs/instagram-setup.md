# Instagram gallery setup

The **Gallery** section shows posts from [@pahadi_pizza_uk04](https://www.instagram.com/pahadi_pizza_uk04).
It works in one of two modes:

| Mode | When | What visitors see |
| --- | --- | --- |
| **Live feed** | `INSTAGRAM_ACCESS_TOKEN` is set | Up to 48 of the latest posts (the API is paged through), newest first, in the reel strip. Pressing a reel opens the theatre and plays the video file straight away in the site's own player. New uploads appear on their own within about 30 minutes. |
| **Curated embeds** | No token, or the API is unavailable | The reels and posts listed in `src/instagram-posts.ts`, played inside the theatre through Instagram's official embed (the visitor presses play on the video). This list is fixed: new uploads do **not** appear until someone edits the list. |

### Why some reels are not in the strip without a token

Instagram's embed refuses to play some reels on other websites (usually reels with licensed music) and shows only *Watch on Instagram*.
Those reels are kept in `src/instagram-posts.ts` with `playsInline: false` and left out of the strip, so every play button on the site plays the video right there.
With a token, the API returns the video file for them too, and they play in the site's own player.

The token is read only on the server (`src/lib/instagram.ts`) and is never sent to the browser.

## One-time setup (done by the account owner, about 10 minutes)

### 1. Make the Instagram account Professional

The API only works for Business or Creator accounts.
In the Instagram app, go to **Settings → Account type and tools → Switch to professional account**, and choose **Business** with the category *Pizza place* or *Restaurant*.
The account does not need to be linked to a Facebook Page.

### 2. Create a Meta app

1. Go to <https://developers.facebook.com/apps> and log in with a Facebook account. Register as a developer if asked.
2. Click **Create app**. For the use case, choose **Manage messaging & content on Instagram**. For the type, choose **Business**. Name it something like *Pahadi Pizza Website*.
3. In the app dashboard, open **Instagram → API setup with Instagram login**.

### 3. Generate the access token

1. Under **Generate access tokens**, click **Add account** and log in as `pahadi_pizza_uk04`. Allow the requested permission (`instagram_business_basic`).
2. Click **Generate token** next to the account and copy it.
   This is a **long-lived token**, valid for 60 days.
3. Optional: find the numeric user id. Leaving it empty also works.
   ```bash
   curl "https://graph.instagram.com/me?fields=user_id,username&access_token=PASTE_TOKEN"
   ```

The app can stay in *Development* mode. It only reads the owner's own posts.

### 4. Add the token to the site

**Local development**: create `.env.local` in the project root. Git ignores this file.

```bash
INSTAGRAM_ACCESS_TOKEN=PASTE_TOKEN
# INSTAGRAM_USER_ID=1784...   (optional)
```

**Production (Vercel)**: in the project, open **Settings → Environment Variables**, add `INSTAGRAM_ACCESS_TOKEN` (and optionally `INSTAGRAM_USER_ID`) for *Production*, then **redeploy**.
Environment variable changes only apply to new deployments.

To check it works, open the site. The Gallery header should say **Live from Instagram**, and the newest post should be first.

## Keeping the token alive (every 60 days)

A long-lived token expires after 60 days unless it is refreshed.
You can refresh it any time after it is 24 hours old, and each refresh gives a new 60-day token:

```bash
curl "https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=CURRENT_TOKEN"
```

Put the returned `access_token` into Vercel (and `.env.local`), then redeploy.
A monthly calendar reminder is enough.

If the token expires or is revoked, the site does not break.
It falls back to the curated embeds, and the server log shows `[instagram] media request failed with HTTP 400`.

## Changing the curated posts (fallback mode)

Edit `src/instagram-posts.ts`. For each post, copy the code from its link:
`instagram.com/reel/DfimTwrzt0O/` gives `kind: 'reel', code: 'DfimTwrzt0O'`.
Use `mediaRatio: 1.25` for reels, `1` for square photos and carousels, and the photo's height divided by its width for other photos.
Only use posts from the restaurant's own account.

## Notes

- Feed refresh interval: `REVALIDATE_SECONDS` in `src/lib/instagram.ts` (1800 seconds, which is 30 minutes).
- Reels that Instagram has muted for copyright reasons may come back without a video URL. They are skipped automatically.
- Media URLs from Instagram are signed and expire. That is why images from the feed are served directly from Instagram's CDN and not cached by the Next image optimizer.
