import { defineConfig, type PreviewServer, type ViteDevServer } from 'vite';
import solid from 'vite-plugin-solid';
import UnoCSS from 'unocss/vite';
import { existsSync, readFileSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import process from 'node:process';

const tempDir = process.env.TEMP || process.env.TMP || 'D:\\newkub\\temp';
const defaultDataPath = resolve(tempDir, 'idea-features', 'data.json');
const dataPath = resolve(process.env.IDEA_FEATURES_DATA || defaultDataPath);

async function ensureSampleData() {
  if (existsSync(dataPath)) return;
  await mkdir(dirname(dataPath), { recursive: true });
  const sample = {
    generatedAt: new Date().toISOString(),
    features: [
      {
        number: 1,
        type: 'New',
        impact: 'สูง',
        feature: 'Feature Selector Dashboard',
        description: 'หน้า Dashboard สำหรับเลือก features จากไอเดียที agent สร้าง',
        phase: 'MVP',
        effort: 'S',
        mvpScore: 9,
        risk: 'ต่ำ',
        reason: 'ทำให้ user เห็นภาพรวม features และตัดสินใจได้เร็ว',
        how: 'สร้างหน้า web แสดง list พร้อม checkbox, filter, copy',
        riskDetail: 'ต้องรองรับข้อมูลจาก temp ไฟล์ JSON'
      },
      {
        number: 2,
        type: 'New',
        impact: 'สูง',
        feature: 'One-Click Copy as Enhance-Prompt',
        description: 'ปุ่ม copy features ทีเลือกให้เป็น numbered list ตามรูปแบบ enhance-prompt',
        phase: 'MVP',
        effort: 'S',
        mvpScore: 9,
        risk: 'ต่ำ',
        reason: 'ลดเวลาเอา features ไปใช้ใน chat',
        how: 'ใช้ Clipboard API กับ template ลำดับเลข',
        riskDetail: 'ต้องรองรับ browser permission'
      },
      {
        number: 3,
        type: 'New',
        impact: 'กลาง',
        feature: 'Per-Feature UX/UI Sketch',
        description: 'แสดง wireframe ลายเส้นของแต่ละ feature แบบละเอียด',
        phase: 'MVP',
        effort: 'M',
        mvpScore: 8,
        risk: 'กลาง',
        reason: 'ช่วยคิด UX ก่อน implement จริง',
        how: 'สร้าง ASCII wireframe จาก feature metadata',
        riskDetail: 'ต้องทำ template หลายแบบตามประเภท feature'
      },
      {
        number: 4,
        type: 'Extends',
        impact: 'กลาง',
        feature: 'Auto-Stop Dev Server on Tab Close',
        description: 'เมื่อ user ปิด tab ของ app Vite dev server จะหยุดอัตโนมัติ',
        phase: 'v2',
        effort: 'S',
        mvpScore: 7,
        risk: 'ต่ำ',
        reason: 'ไม่ต้องกลับมาปิด server เอง',
        how: 'ใช้ beforeunload + sendBeacon ไปยัง Vite close endpoint',
        riskDetail: 'ต้องใช้ Vite plugin จัดการ close endpoint'
      }
    ]
  };
  await writeFile(dataPath, JSON.stringify(sample, null, 2), 'utf-8');
}

function setupMiddlewares(server: ViteDevServer | PreviewServer) {
  const serverStart = Date.now();
  const closeToken = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  let dataServed = false;

  function readBody(req: any) {
    return new Promise<string>((resolve) => {
      let chunks = '';
      req.on('data', (chunk: Buffer) => { chunks += chunk.toString(); });
      req.on('end', () => resolve(chunks));
      req.on('error', () => resolve(''));
    });
  }

  server.middlewares.use('/api/data', (req, res, next) => {
    if (req.method !== 'GET') return next();
    res.setHeader('Content-Type', 'application/json');
    try {
      if (!existsSync(dataPath)) {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: `data file not found: ${dataPath}` }));
        return;
      }
      res.end(readFileSync(dataPath, 'utf-8'));
    } catch (err) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: String(err) }));
    }
    dataServed = true;
  });

  server.middlewares.use('/token', (req, res, _next) => {
    if (req.method !== 'GET') {
      res.statusCode = 405;
      res.end(JSON.stringify({ error: 'method not allowed' }));
      return;
    }
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ token: closeToken }));
  });

  server.middlewares.use('/close', async (req, res, _next) => {
    if (req.method !== 'POST') {
      res.statusCode = 405;
      res.end(JSON.stringify({ error: 'method not allowed' }));
      return;
    }
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: true, closing: true }));
    const body = await readBody(req);
    let token = '';
    try { token = JSON.parse(body || '{}').token || ''; } catch { }
    if (!dataServed) {
      console.log('[idea-features] close beacon ignored: no data served yet');
      return;
    }
    if (token !== closeToken) {
      console.log('[idea-features] close beacon ignored: token mismatch');
      return;
    }
    console.log('[idea-features] close beacon received, stopping dev server...');
    setTimeout(() => server.close().catch(() => { }), 100);
  });
}

export default defineConfig({
  plugins: [
    solid(),
    UnoCSS(),
    {
      name: 'idea-features-data-and-close',
      async configureServer(server) {
        await ensureSampleData();
        setupMiddlewares(server);
      },
      async configurePreviewServer(server) {
        setupMiddlewares(server);
      }
    }
  ],
  build: {
    target: 'esnext',
    outDir: 'dist'
  },
  preview: {
    port: 5173,
    open: false
  }
});
