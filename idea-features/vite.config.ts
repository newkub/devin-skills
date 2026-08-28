import { defineConfig, type PreviewServer, type ViteDevServer } from 'vite';
import solid from 'vite-plugin-solid';
import UnoCSS from 'unocss/vite';
import { existsSync, readFileSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import process from 'node:process';
import type { IncomingMessage } from 'node:http';

const tempDir = 'D:\\newkub\\temp';
const defaultDataPath = resolve(tempDir, 'idea-features', 'data.json');
const dataPath = resolve(process.env.IDEA_FEATURES_DATA || defaultDataPath);

async function getBody(req: IncomingMessage) {
  return new Promise<string>((res, rej) => {
    const chunks: Buffer[] = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => res(Buffer.concat(chunks).toString('utf-8')));
    req.on('error', rej);
  });
}

async function readData() {
  try {
    return JSON.parse(readFileSync(dataPath, 'utf-8'));
  } catch {
    return { generatedAt: new Date().toISOString(), features: [] };
  }
}

async function writeData(data: unknown) {
  await writeFile(dataPath, JSON.stringify(data, null, 2), 'utf-8');
}

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
  await writeData(sample);
}

function setupDataMiddleware(server: ViteDevServer | PreviewServer) {
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
  });

  server.middlewares.use('/api/enhance', (req, res, next) => {
    if (req.method !== 'POST') return next();
    res.setHeader('Content-Type', 'application/json');
    const llmUrl = process.env.OLLAMA_URL || process.env.OPENAI_BASE_URL;
    if (!llmUrl) {
      res.end(JSON.stringify({
        success: false,
        message: 'ยังไม่ได้ตั้ง LLM backend กรุณาตั้งค่า OLLAMA_URL หรือ OPENAI_API_KEY'
      }));
      return;
    }
    res.end(JSON.stringify({
      success: true,
      message: 'enhance ถูกส่งไปยัง LLM backend แล้ว (mock response)'
    }));
  });

  server.middlewares.use('/api/create', async (req, res, next) => {
    if (req.method !== 'POST') return next();
    res.setHeader('Content-Type', 'application/json');
    try {
      const body = JSON.parse(await getBody(req));
      const data = await readData();
      const features = data.features || data || [];
      const maxNum = Math.max(0, ...features.map((f: { number?: number; }) => f.number || 0));
      const newFeature = { ...body, number: maxNum + 1 };
      features.push(newFeature);
      data.features = features;
      await writeData(data);
      res.end(JSON.stringify({ success: true, feature: newFeature }));
    } catch (err) {
      res.statusCode = 500;
      res.end(JSON.stringify({ success: false, error: String(err) }));
    }
  });
}

export default defineConfig({
  cacheDir: resolve(tempDir, 'vite-cache'),
  plugins: [
    solid(),
    UnoCSS(),
    {
      name: 'idea-features-data',
      async configureServer(server) {
        await ensureSampleData();
        setupDataMiddleware(server);
      },
      async configurePreviewServer(server) {
        setupDataMiddleware(server);
      }
    }
  ],
  build: {
    target: 'esnext',
    outDir: 'dist'
  },
  server: {
    port: 5173,
    open: false
  },
  preview: {
    port: 5173,
    open: false
  }
});
