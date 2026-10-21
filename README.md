# Pet Flight Fee Calculator

Next.js (App Router) + Tailwind + TypeScript. All airline data lives in `data/airlines.json`; every airline page is generated from it.

## Run it locally

Needs Node.js 20.9 or newer.

```bash
npm install
npm run dev        # http://localhost:3000
```

Production build: `npm run build && npm start`. Calculator tests: `npm test`.

Vercel Analytics is included; enable it in your Vercel project under Analytics. Before deploying, set `NEXT_PUBLIC_SITE_URL` (e.g. `https://yourdomain.com`) so canonical URLs, `sitemap.xml` and `robots.txt` use your domain.

## Pages

- `/` calculator
- `/southwest-pet-fee`, `/spirit-pet-fee`, `/frontier-pet-fee` (from `data/airlines.json`)
- `/compare`, `/about`, `/privacy`, `/disclaimer`, `/affiliate-disclosure`
