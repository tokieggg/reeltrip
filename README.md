# Sydney trip

A small phone page for one drive north of Sydney. It keeps the places, the map, and the reel links on the phone. There is no account and no server of yours.

## What happens when you paste a reel

Paste the link only. There is no caption box and no API key.

1. If the reel is one this trip already knows, its places are pinned at once. The drive north keeps the road kilometres already measured: 46, 6, 50, and 22.
2. For any other link, the page asks Instagram for the public caption and pins each street address it finds.

Instagram often refuses that request when it comes from a website. Google’s AI is not used, because those reels are usually missing from Google. The video is never stored. The reel link under the map opens it in Instagram.

Places you add, and the trip file from Export, stay in this browser. They are not uploaded to GitHub.

## Run it on your computer

Open `index.html` in a browser, or from this folder:

```powershell
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Publish it on GitHub

You need a GitHub account and Git installed. The repository should be **public**. GitHub’s free plan serves Pages from a public repository. A private repository needs a paid GitHub plan before Pages will serve it.

The published page is the app and the original Sydney drive. Pins you add later stay on each phone.

### 1. Create the repository

On GitHub, choose **New repository**. Name it `sydney-trip`. Leave it empty: do not add a README, a gitignore, or a licence there. Those files are already in this folder. Create the repository.

### 2. Put this folder on GitHub

In PowerShell, from this folder, replace `YOUR_NAME` with your GitHub username:

```powershell
git init
git add index.html styles.css app.js README.md
git commit -m "Add the Sydney trip page"
git branch -M main
git remote add origin https://github.com/YOUR_NAME/sydney-trip.git
git push -u origin main
```

If Git says it needs your name and email before the commit, run these once, with your own details, then run the commit again:

```powershell
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

GitHub will ask you to sign in when you push.

### 3. Turn on Pages

On the repository page, open **Settings**, then **Pages**. Under **Build and deployment**, set **Source** to **Deploy from a branch**. Set the branch to **main** and the folder to **/ (root)**. Save.

Wait a minute, then open:

`https://YOUR_NAME.github.io/sydney-trip/`

If you named the repository something else, that name replaces `sydney-trip` in the link. A repository named exactly `YOUR_NAME.github.io` is served from `https://YOUR_NAME.github.io/` with no project name on the end.

### 4. Put it on your phone

Open that link in Safari or Chrome. Use **Share**, then **Add to Home Screen**. The trip is stored in that installed page. Updating the code on GitHub does not erase it.

Send the same link to the other person. That is how you share it. Their phone starts with the original drive, and pins they add stay on their phone. To give them places you added, tap **Export**, send them `sydney-trip.json`, and they tap **Import**.

This page is the trip, not a product listing. You do not need a store page or ads. Anyone with the link can add it to their home screen.

## Change the saved reels

The built-in list is the `KNOWN` object in `app.js`. Each entry is the code from the reel link, the bit after `/reel/`. After you edit it, commit and push again. GitHub Pages updates from that push. Phones that already saved a trip keep their old copy until they tap **Reset** or **Import**.
