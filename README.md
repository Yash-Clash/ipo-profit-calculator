# IPO Listing Profit Tier Calculator

A modern, responsive web application for calculating IPO listing gains, tiered profit sharing/cuts, and investor payouts.

Live Ready for **Vercel** deployment with zero configuration.

## Features
- **Dual Input Modes**:
  - **Mode 1**: Enter Total Bid Amount & Total Selling Price.
  - **Mode 2**: Enter Avg Buying Price per Share, LTP (Selling Price), and Quantity of Shares.
- **Dynamic Tiered Slabs**:
  - `x ≤ 15%` ➔ **0%** Profit Cut
  - `15% < x ≤ 20%` ➔ **10%** Profit Cut
  - `20% < x ≤ 25%` ➔ **15%** Profit Cut
  - `25% < x ≤ 30%` ➔ **20%** Profit Cut
  - `x > 30%` ➔ **25%** Profit Cut
- **Settlement Flexibility**:
  - Toggle between **% of Gross Profit** (Industry Standard) and **% of Allotted Capital**.
- **Interactive Visualizer**:
  - Live highlight of the active slab with distance needed to unlock the next profit tier.
- **Copy Summary**:
  - 1-Click WhatsApp / Telegram breakdown formatting.
- **Quick Test Presets**:
  - Instant scenarios: 12%, 18%, 23%, 28%, 45%, and discount listings.

## Deploying to Vercel

### Option 1: Using Vercel CLI (Recommended - 60 seconds)
1. Open PowerShell or Terminal in this folder:
   ```bash
   npx vercel
   ```
2. Log in (if not already logged in) and press Enter to accept the defaults.
3. Your live link (e.g. `https://ipo-profit-calculator.vercel.app`) will be printed immediately!

### Option 2: Deploying via GitHub
1. Push this directory to your GitHub account:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of IPO Profit Calculator"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```
2. Go to [vercel.com/new](https://vercel.com/new) and import your repository.
3. Click **Deploy**. Vercel will automatically detect Vite and build the site!

## Local Development
```bash
npm install
npm run dev
```

Build for production:
```bash
npm run build
```
