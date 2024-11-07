import express from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

const app = express();
const port = 3000;

// Enable CORS for frontend
app.use(cors({
  origin: 'http://localhost:5173', // Vite dev server
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

app.post('/api/login/slate', async (req, res) => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled'
      ]
    });
    
    const page = await browser.newPage();
    await page.goto('https://slate.uol.edu.pk');

    await delay(2000);

    const password = 'QPJQQ@&$123LOL';
    const email = '70125368@student.uol.edu.pk';

    await page.waitForSelector('img[width="24"]', { visible: true });
    await page.click('img[width="24"]');
    
    await page.waitForSelector('[type="email"]', { visible: true });
    await page.type('[type="email"]', email);
    
    await page.click('#identifierNext');
    await page.waitForSelector('[type="password"]', { visible: true });
    
    await page.type('[type="password"]', password);
    await page.click('#passwordNext');
    
    await page.waitForNavigation();
    
    res.json({ success: true, message: 'Slate login automation completed' });
  } catch (error) {
    console.error('Error during Slate automation:', error);
    res.status(500).json({ 
      error: `Failed to automate Slate login: ${error.message}` 
    });
  }
});

app.post('/api/login/erp', async (req, res) => {
  res.json({ success: true, message: 'ERP login automation completed' });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});