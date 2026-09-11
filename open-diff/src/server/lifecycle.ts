import * as readline from 'node:readline';
import { stdin as input, stdout as output } from 'node:process';

let lastPing = Date.now();
let firstPing = false;
let tabClosed = false;
let prompting = false;
let appUrl = '';
let rl: readline.Interface | null = null;

function getRl() {
  if (!rl) rl = readline.createInterface({ input, output });
  return rl;
}

export function setAppUrl(url: string) {
  appUrl = url;
}

export function recordPing() {
  lastPing = Date.now();
  firstPing = true;
  tabClosed = false;
}

export function startWatchdog() {
  setInterval(() => {
    if (firstPing && !tabClosed && Date.now() - lastPing > 5000) {
      tabClosed = true;
      promptOnClose();
    }
  }, 1000);
}

export function promptOnClose() {
  if (prompting || tabClosed) return;
  tabClosed = true;
  prompting = true;
  console.log('\n[open-diff] Browser tab closed.');
  if (!process.stdin.isTTY) {
    console.log('[open-diff] Non-TTY: continuing to serve.');
    prompting = false;
    return;
  }
  getRl().question('[open-diff] Choose: (r)eopen, (q)uit, (c)ontinue: ', (answer) => {
    prompting = false;
    const a = answer.trim().toLowerCase();
    if (a === 'r' || a === 'reopen') {
      openBrowser(appUrl);
    } else if (a === 'q' || a === 'quit') {
      rl?.close();
      process.exit(0);
    } else {
      console.log('[open-diff] Continuing to serve. Open tab again to reconnect.');
    }
  });
}

export function openBrowser(url: string) {
  if (process.platform === 'win32') {
    Bun.spawn({ cmd: ['powershell', '-Command', `Start-Process '${url}'`] });
  } else if (process.platform === 'darwin') {
    Bun.spawn({ cmd: ['open', url] });
  } else {
    Bun.spawn({ cmd: ['xdg-open', url] });
  }
}
