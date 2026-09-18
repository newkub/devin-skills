// File-type icon map — vscode-icons collection via iconify CDN (configured in uno.config.ts presetIcons)
// Usage: <span class={`${fileIcon('src/app.ts')} w-4 h-4`} />

const EXT_ICONS: Record<string, string> = {
  // JS/TS
  ts: 'i-vscode-icons-file-type-typescript', tsx: 'i-vscode-icons-file-type-reactts',
  js: 'i-vscode-icons-file-type-js', jsx: 'i-vscode-icons-file-type-reactjs',
  mjs: 'i-vscode-icons-file-type-js', cjs: 'i-vscode-icons-file-type-js',
  mts: 'i-vscode-icons-file-type-typescript', cts: 'i-vscode-icons-file-type-typescript',
  dts: 'i-vscode-icons-file-type-typescript-def',
  // Web
  html: 'i-vscode-icons-file-type-html', htm: 'i-vscode-icons-file-type-html',
  css: 'i-vscode-icons-file-type-css', scss: 'i-vscode-icons-file-type-scss',
  sass: 'i-vscode-icons-file-type-sass', less: 'i-vscode-icons-file-type-less',
  vue: 'i-vscode-icons-file-type-vue', svelte: 'i-vscode-icons-file-type-svelte',
  astro: 'i-vscode-icons-file-type-astro', svg: 'i-vscode-icons-file-type-svg',
  // Data / config
  json: 'i-vscode-icons-file-type-json', json5: 'i-vscode-icons-file-type-json',
  jsonc: 'i-vscode-icons-file-type-json', jsonl: 'i-vscode-icons-file-type-json',
  yaml: 'i-vscode-icons-file-type-yaml', yml: 'i-vscode-icons-file-type-yaml',
  toml: 'i-vscode-icons-file-type-toml', xml: 'i-vscode-icons-file-type-xml',
  ini: 'i-vscode-icons-file-type-config', env: 'i-vscode-icons-file-type-dotenv',
  cfg: 'i-vscode-icons-file-type-config', conf: 'i-vscode-icons-file-type-config',
  lock: 'i-vscode-icons-file-type-lock',
  // Docs
  md: 'i-vscode-icons-file-type-markdown', mdx: 'i-vscode-icons-file-type-mdx',
  txt: 'i-vscode-icons-file-type-text', pdf: 'i-vscode-icons-file-type-pdf',
  // Languages
  py: 'i-vscode-icons-file-type-python', rs: 'i-vscode-icons-file-type-rust',
  go: 'i-vscode-icons-file-type-go', java: 'i-vscode-icons-file-type-java',
  kt: 'i-vscode-icons-file-type-kotlin', kts: 'i-vscode-icons-file-type-kotlin',
  swift: 'i-vscode-icons-file-type-swift', rb: 'i-vscode-icons-file-type-ruby',
  php: 'i-vscode-icons-file-type-php', c: 'i-vscode-icons-file-type-c',
  h: 'i-vscode-icons-file-type-c', cpp: 'i-vscode-icons-file-type-cpp',
  cc: 'i-vscode-icons-file-type-cpp', cxx: 'i-vscode-icons-file-type-cpp',
  hpp: 'i-vscode-icons-file-type-cpp', cs: 'i-vscode-icons-file-type-csharp',
  fs: 'i-vscode-icons-file-type-fsharp', lua: 'i-vscode-icons-file-type-lua',
  zig: 'i-vscode-icons-file-type-zig', dart: 'i-vscode-icons-file-type-dart',
  scala: 'i-vscode-icons-file-type-scala', hs: 'i-vscode-icons-file-type-haskell',
  ex: 'i-vscode-icons-file-type-elixir', exs: 'i-vscode-icons-file-type-elixir',
  erl: 'i-vscode-icons-file-type-erlang', clj: 'i-vscode-icons-file-type-clojure',
  r: 'i-vscode-icons-file-type-r', jl: 'i-vscode-icons-file-type-julia',
  nim: 'i-vscode-icons-file-type-nim', v: 'i-vscode-icons-file-type-v',
  // Shell / scripts
  sh: 'i-vscode-icons-file-type-shell', bash: 'i-vscode-icons-file-type-shell',
  zsh: 'i-vscode-icons-file-type-shell', fish: 'i-vscode-icons-file-type-shell',
  ps1: 'i-vscode-icons-file-type-powershell', psm1: 'i-vscode-icons-file-type-powershell',
  bat: 'i-vscode-icons-file-type-bat', cmd: 'i-vscode-icons-file-type-bat',
  nu: 'i-vscode-icons-file-type-nushell',
  // Infra / build
  tf: 'i-vscode-icons-file-type-terraform', tfvars: 'i-vscode-icons-file-type-terraform',
  sql: 'i-vscode-icons-file-type-sql', graphql: 'i-vscode-icons-file-type-graphql',
  gql: 'i-vscode-icons-file-type-graphql', proto: 'i-vscode-icons-file-type-proto',
  makefile: 'i-vscode-icons-file-type-makefile', mk: 'i-vscode-icons-file-type-makefile',
  cmake: 'i-vscode-icons-file-type-cmake', gradle: 'i-vscode-icons-file-type-gradle',
  // Media / binary
  png: 'i-vscode-icons-file-type-image', jpg: 'i-vscode-icons-file-type-image',
  jpeg: 'i-vscode-icons-file-type-image', gif: 'i-vscode-icons-file-type-image',
  webp: 'i-vscode-icons-file-type-image', ico: 'i-vscode-icons-file-type-image',
  bmp: 'i-vscode-icons-file-type-image', mp4: 'i-vscode-icons-file-type-video',
  mov: 'i-vscode-icons-file-type-video', mp3: 'i-vscode-icons-file-type-audio',
  wav: 'i-vscode-icons-file-type-audio', zip: 'i-vscode-icons-file-type-zip',
  gz: 'i-vscode-icons-file-type-zip', tar: 'i-vscode-icons-file-type-zip',
  wasm: 'i-vscode-icons-file-type-binary', exe: 'i-vscode-icons-file-type-binary',
  dll: 'i-vscode-icons-file-type-binary',
  // Misc
  csv: 'i-vscode-icons-file-type-csv', sqlite: 'i-vscode-icons-file-type-sqlite',
  db: 'i-vscode-icons-file-type-sqlite', gitignore: 'i-vscode-icons-file-type-git',
  dockerfile: 'i-vscode-icons-file-type-docker', dockerignore: 'i-vscode-icons-file-type-docker',
  woff: 'i-vscode-icons-file-type-font', woff2: 'i-vscode-icons-file-type-font',
  ttf: 'i-vscode-icons-file-type-font', otf: 'i-vscode-icons-file-type-font',
};

const NAME_ICONS: Record<string, string> = {
  'dockerfile': 'i-vscode-icons-file-type-docker',
  'makefile': 'i-vscode-icons-file-type-makefile',
  'cmakelists.txt': 'i-vscode-icons-file-type-cmake',
  'package.json': 'i-vscode-icons-file-type-node',
  'bun.lock': 'i-vscode-icons-file-type-bun',
  'bun.lockb': 'i-vscode-icons-file-type-bun',
  'tsconfig.json': 'i-vscode-icons-file-type-tsconfig',
  '.gitignore': 'i-vscode-icons-file-type-git',
  '.gitattributes': 'i-vscode-icons-file-type-git',
  '.gitmodules': 'i-vscode-icons-file-type-git',
  '.npmrc': 'i-vscode-icons-file-type-npm',
  '.env': 'i-vscode-icons-file-type-dotenv',
  'license': 'i-vscode-icons-file-type-licence',
  'license.md': 'i-vscode-icons-file-type-licence',
  'readme.md': 'i-vscode-icons-file-type-markdown',
  'changelog.md': 'i-vscode-icons-file-type-markdown',
};

const DIR_ICONS: [RegExp, string][] = [
  [/^(src|source|app)$/i, 'i-vscode-icons-folder-type-src'],
  [/^(test|tests|__tests__|spec|specs|e2e)$/i, 'i-vscode-icons-folder-type-test'],
  [/^(components?|widgets?)$/i, 'i-vscode-icons-folder-type-component'],
  [/^(pages?|views?)$/i, 'i-vscode-icons-folder-type-view'],
  [/^(public|static|assets?)$/i, 'i-vscode-icons-folder-type-asset'],
  [/^(images?|imgs|icons?)$/i, 'i-vscode-icons-folder-type-images'],
  [/^(docs?|documentation)$/i, 'i-vscode-icons-folder-type-docs'],
  [/^(scripts?|tools?)$/i, 'i-vscode-icons-folder-type-tools'],
  [/^(config|configs|settings?)$/i, 'i-vscode-icons-folder-type-config'],
  [/^(lib|libs|library)$/i, 'i-vscode-icons-folder-type-library'],
  [/^(api|apis|server|backend)$/i, 'i-vscode-icons-folder-type-api'],
  [/^(client|web|frontend)$/i, 'i-vscode-icons-folder-type-client'],
  [/^(styles?|css|theme)$/i, 'i-vscode-icons-folder-type-style'],
  [/^(types?|typings|interfaces|models?)$/i, 'i-vscode-icons-folder-type-model'],
  [/^(utils?|helpers?|shared|common)$/i, 'i-vscode-icons-folder-type-utils'],
  [/^(hooks?)$/i, 'i-vscode-icons-folder-type-hook'],
  [/^(routes?|router)$/i, 'i-vscode-icons-folder-type-route'],
  [/^(middlewares?)$/i, 'i-vscode-icons-folder-type-middleware'],
  [/^(services?)$/i, 'i-vscode-icons-folder-type-services'],
  [/^(store|stores|state)$/i, 'i-vscode-icons-folder-type-store'],
  [/^(db|database|migrations?)$/i, 'i-vscode-icons-folder-type-db'],
  [/^(node_modules)$/i, 'i-vscode-icons-folder-type-node'],
  [/^(dist|build|out|target)$/i, 'i-vscode-icons-folder-type-dist'],
  [/^\.github$/i, 'i-vscode-icons-folder-type-github'],
  [/^\.git$/i, 'i-vscode-icons-folder-type-git'],
  [/^(ci|workflows?)$/i, 'i-vscode-icons-folder-type-ci'],
  [/^(packages?|crates?|workspaces?)$/i, 'i-vscode-icons-folder-type-packages'],
  [/^(examples?|samples?|demos?)$/i, 'i-vscode-icons-folder-type-example'],
  [/^(i18n|l10n|locales?|translations?)$/i, 'i-vscode-icons-folder-type-locale'],
  [/^(env|environments?)$/i, 'i-vscode-icons-folder-type-environment'],
  [/^(logs?)$/i, 'i-vscode-icons-folder-type-log'],
  [/^(vendor|third[-_]?party)$/i, 'i-vscode-icons-folder-type-vendor'],
];

export function fileIcon(path: string): string {
  const name = path.slice(Math.max(path.lastIndexOf('/'), path.lastIndexOf('\\')) + 1);
  const lower = name.toLowerCase();
  if (NAME_ICONS[lower]) return NAME_ICONS[lower];
  if (lower.startsWith('.env')) return 'i-vscode-icons-file-type-dotenv';
  const ext = lower.includes('.') ? lower.slice(lower.lastIndexOf('.') + 1) : '';
  return EXT_ICONS[ext] || 'i-vscode-icons-default-file';
}

export function dirIcon(name: string, open: boolean): string {
  for (const [re, icon] of DIR_ICONS) {
    if (re.test(name)) return open ? `${icon}-opened` : icon;
  }
  return open
    ? 'i-vscode-icons-default-folder-opened'
    : 'i-vscode-icons-default-folder';
}
