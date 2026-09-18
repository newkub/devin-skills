# Tech Stack And Runtime Checks

Reference สำหรับ tech stack และ runtime review checks

## Framework And Library Checks

1. ตรวจสอบ framework versions เทียบกับ latest stable และ EOL status
2. ตรวจสอบ library alignment กับ project requirements และ redundancy
3. ระบุ frameworks ที่ outdated: major, minor, patch
4. ตรวจสอบ redundant libraries ที่ทำงานเหมือนกัน (เช่น `lodash` + `es-toolkit`)

## Runtime And Build Tool Checks

1. ตรวจสอบ runtime compatibility: `Node.js` version, browser support, engine field
2. ตรวจสอบ build tool configuration และ consistency
3. ตรวจสอบ package manager consistency (`bun`, `npm`, `pnpm`, `yarn`)
4. ตรวจสอบ technology alignment กับ project requirements

## Compatibility Matrix

1. ตรวจสอบ compatibility matrix ระหว่าง framework, runtime, และ dependencies
2. ตรวจสอบ bundler compatibility (`Vite`, `webpack`, `Rollup`)
3. ตรวจสอบ module resolution strategy
4. ระบุ incompatible combinations พร้อม recommendation

## Severity Mapping

- Critical: EOL framework, incompatible runtime, security-impacted version
- High: outdated major version, redundant library, missing compatibility
- Medium: minor version lag, suboptimal build tool, inconsistent package manager
- Low: cosmetic config improvement, outdated patch version
