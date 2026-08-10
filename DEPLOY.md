# Ambastion / Anemoi Matrix — go live on ambastion.com

Google Workspace **owns/verifies** your domain for email. It does **not** host this React site.
You need: (1) host the built site, (2) point DNS for `ambastion.com` to that host.

## Recommended: Vercel (fastest)

### 1. Deploy
```bash
cd F:\shravan\AnemoiMatrix
npm install
npm run build
npx vercel login
npx vercel --prod
```

### 2. Add custom domain in Vercel
1. Open the project on [vercel.com](https://vercel.com) → **Settings → Domains**
2. Add `ambastion.com` and `www.ambastion.com`

### 3. DNS (where ambastion.com DNS is managed)
Usually **Google Domains / Squarespace Domains**, Cloudflare, or your registrar — **not** inside Gmail Admin “Manage domains”.

Add what Vercel shows (typical):

| Type  | Name | Value                          |
|-------|------|--------------------------------|
| A     | `@`  | `76.76.21.21`                  |
| CNAME | `www`| `cname.vercel-dns.com`         |

Exact values are in Vercel → Domains after you add the domain. Wait for DNS (often 5–60 min).

Then `https://ambastion.com` loads this app worldwide.

---

## Alternative: Netlify
```bash
npx netlify login
npx netlify deploy --prod
```
Add domain in Netlify → Domain settings, then set their DNS records the same way.

## Alternative: Firebase Hosting (Google cloud)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```
Then add custom domain in Firebase Console and update DNS as instructed.

---

## Checklist
- [ ] Production build works (`npm run build`)
- [ ] Site deployed to Vercel/Netlify/Firebase
- [ ] `ambastion.com` + `www` added on the host
- [ ] DNS A/CNAME updated at the domain DNS provider
- [ ] HTTPS shows as valid (automatic on Vercel/Netlify)
