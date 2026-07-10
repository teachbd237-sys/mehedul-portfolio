# Mehedul — Video Editor Portfolio

A cinematic, dark-mode portfolio built with plain HTML, CSS, and JavaScript
(Tailwind-style utility spacing hand-rolled in `style.css`, GSAP + ScrollTrigger
for animation, and Lenis for smooth scroll). No build step, no frameworks —
upload it as-is.

## File structure

```
index.html          → all page markup / sections
style.css            → design tokens, layout, glassmorphism, responsive rules
script.js            → GSAP animations, cursor, particles, filters, modal, form
assets/
  images/            → put your profile photo / thumbnails here
  videos/            → optional, not used by the portfolio player (videos are
                       embedded from YouTube — see section 3); keep this folder
                       only if you want a local copy of your raw footage
  icons/             → optional extra icons
README.md
```

## 1. Open it locally

No build tools needed. Either:

- Double-click `index.html` to open it directly in a browser, **or**
- Serve it locally for the best experience (some browsers restrict video/canvas
  features on the `file://` protocol):

  ```bash
  # from inside the project folder
  npx serve .
  # or
  python3 -m http.server 5500
  ```

  Then visit `http://localhost:5500` (or whatever port is printed).

## 2. Upload to Netlify

**Option A — drag and drop**
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag the whole project folder onto the page.
3. Netlify deploys it instantly and gives you a live URL.

**Option B — Git**
1. Push this folder to a GitHub/GitLab/Bitbucket repo.
2. In Netlify: **Add new site → Import an existing project**.
3. Build command: leave blank. Publish directory: `/` (project root).

## 3. Replace the portfolio videos (via YouTube — no video files to host)

Each project card in the "Work" section opens a modal that plays a **YouTube
video through an embed**, so you never need to upload raw video files to the
site itself. The flow is:

1. Upload your video to YouTube as normal.
2. On the video's **Visibility** setting, choose **Unlisted** (not Private —
   Private videos can't be embedded on outside sites; Unlisted can, and it
   still won't show up in search or on your channel page).
3. Open the video, click **Share → Embed**, and copy just the **video ID**
   out of the embed URL. For example, if the embed code contains
   `https://www.youtube.com/embed/dQw4w9WgXcQ`, the ID is the part after
   `/embed/`: `dQw4w9WgXcQ`.
4. Open `script.js` and find the `projects` array (search for `const projects =`).
   Each project object has a `youtube` field — replace the placeholder ID with
   your own:

   ```js
   { cat: 'commercial', label: 'Commercial', title: 'Nova Skincare — Launch Film',
     desc: '...', grad: '...', youtube: 'dQw4w9WgXcQ' }
   ```

That's it — no files go into `assets/videos/` anymore. When a visitor clicks
a project card, `openModal()` in `script.js` points the modal's `<iframe>` at
`https://www.youtube-nocookie.com/embed/<your-video-id>` and it plays right
there in the modal (the visitor never has to leave your site or land on
youtube.com). Closing the modal clears the iframe's `src`, which stops
playback.

- For real thumbnails instead of gradients, replace the `.thumb` div's inline
  `style="--grad:..."` with a background image, e.g. add a `thumb-img` class
  with `background-image:url(...)` in `style.css`, or swap the `div` for an
  `<img>`. (A common trick: YouTube auto-generates a thumbnail at
  `https://img.youtube.com/vi/<video-id>/maxresdefault.jpg` — you can use that
  URL directly as the background image, so the thumbnail always matches the
  video.)

## 4. Replace the profile image

The current design doesn't use a literal headshot (the hero focuses on
typography), but if you'd like to add one:
1. Save your photo to `assets/images/profile.jpg`.
2. In `index.html`, inside `.hero-content` or `.about-copy`, add:
   ```html
   <img src="assets/images/profile.jpg" alt="Mehedul" class="profile-photo">
   ```
3. Style `.profile-photo` in `style.css` (e.g. rounded corners, max-width).

## 5. Edit contact information

Open `index.html` and search for the `#contact` section:

- **Email:** update the `mailto:` link and visible text.
- **WhatsApp:** replace the number in `https://wa.me/8801000000000` with your
  own (international format, no `+` or spaces).
- **Location:** edit the plain text next to "Location".
- **Social links:** update the `href="#"` placeholders under `.social-row`
  (Facebook / LinkedIn / Instagram) and in the footer's `.footer-socials`.

The form currently simulates a successful send in the browser only
(`script.js`, `contactForm` submit handler). To actually receive messages,
connect it to a form backend such as Netlify Forms, Formspree, or your own
API endpoint, and post the form data there instead of the `setTimeout` demo.

## 6. Change colors

All colors are defined as CSS custom properties at the top of `style.css`:

```css
:root{
  --bg: #050505;            /* page background */
  --bg-elevated: #111111;   /* cards */
  --accent: #8B5CF6;        /* primary accent */
  --accent-2: #B794F6;      /* lighter accent, used for highlights/text */
  --text: #ffffff;
  --text-secondary: #A1A1AA;
}
```

Change any of these values and the whole site updates — no need to hunt
through individual rules.

## 7. Change fonts

Fonts are loaded from Google Fonts in `index.html`'s `<head>` and referenced
in `style.css`:

```css
--font-display: "Bricolage Grotesque", "Inter", sans-serif; /* headlines */
--font-body: "Inter", sans-serif;                            /* paragraphs, UI */
--font-mono: "JetBrains Mono", monospace;                    /* timecodes, labels */
```

To swap a font: update the Google Fonts `<link>` in `index.html` with the new
family, then change the matching `--font-*` variable in `style.css`.

## Notes

- The scroll progress bar at the very top is styled like a video-editing
  timeline scrubber (a nod to the profession) — it fills as you scroll and
  ends in a small diamond "playhead."
- Section labels use timecode-style formatting (`00:00:00:0X`) instead of
  generic numbering, since this is content a video editor would actually use.
- All animations respect `prefers-reduced-motion` and will simplify
  automatically for users who have that setting enabled.
- The custom cursor and mouse-trail particle canvas automatically disable on
  touch devices.
