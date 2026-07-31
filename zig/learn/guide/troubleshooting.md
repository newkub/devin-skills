---
title: Zig Troubleshooting
description: การแก้ปัญหาที่พบบ่อยในการพัฒนา Zig
---

# Zig Troubleshooting

วิธีแก้ปัญหาที่พบบ่อยในการพัฒนา Zig

## Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `error: use of undeclared identifier` | ตัวแปรหรือฟังก์ชันไม่ได้ประกาศ | ตรวจสอบการสะกดชื่อ และตรวจสอบว่าได้ import แล้ว |
| `error: expected type, found` | Type mismatch | ตรวจสอบ type ที่ return หรือรับ parameter |
| `error: struct has no member` | เข้าถึง field ที่ไม่มีใน struct | ตรวจสอบชื่อ field และ struct definition |
| `error: cannot assign to constant` | พยายาม assign ค่าให้ const | เปลี่ยนเป็น `var` หรือใช้ pointer |
| `error: integer overflow` | ตัวเลขเกินขอบเขต type | ใช้ type ที่ใหญ่ขึ้น หรือใช้ `@saturating` operations |
| `error: unreachable code reached` | โค้ดที่ไม่ควรถึงถึง | ตรวจสอบ logic และ error handling |
| `error: no entry named` | ไม่พบ entry point | ตรวจสอบว่ามี `pub fn main` หรือ `test` function |

## Build Issues

### Compilation Errors

**Problem**: Build ล้มเหลวด้วย syntax errors

**Solution**:
1. ตรวจสอบ syntax ด้วย `zig fmt`
2. อ่าน error messages อย่างละเอียด
3. ตรวจสอบ missing semicolons หรือ brackets

**Problem**: Cross-compilation ไม่ทำงาน

**Solution**:
1. ตรวจสอบ target triple: `zig targets`
2. ใช้ `-Dtarget` ใน build.zig
3. ตรวจสอบว่ามี toolchain สำหรับ target นั้น

### Linking Errors

**Problem**: Undefined reference ขณะ linking

**Solution**:
1. เพิ่ม library paths ใน build.zig
2. ตรวจสอบ C library dependencies
3. ใช้ `@cImport` อย่างถูกต้องสำหรับ C interop

## Runtime Issues

### Memory Issues

**Problem**: Memory leaks

**Solution**:
1. ตรวจสอบ allocators ทั้งหมด
2. ใช้ `defer` สำหรับ cleanup
3. ตรวจสอบ reference cycles

**Problem**: Use-after-free

**Solution**:
1. ตรวจสอบ lifetime ของ pointers
2. ใช้ allocators ที่ปลอดภัย (GeneralPurposeAllocator)
3. เปิด safety checks ด้วย `-Ddebug`

### Performance Issues

**Problem**: Code ช้ากว่าที่คาด

**Solution**:
1. ใช้ `zig build -Drelease-fast` สำหรับ optimization
2. ตรวจสอบ allocations ที่ไม่จำเป็น
3. ใช้ `@inline` สำหรับฟังก์ชันเล็กๆ
4. ตรวจสอบ comptime ที่ทำงานซ้ำ

## Tool Issues

### Zig Build System

**Problem**: build.zig ไม่ทำงาน

**Solution**:
1. ตรวจสอบ Zig version: `zig version`
2. อัปเดต Zig เป็นเวอร์ชันล่าสุด
3. ตรวจสอบ syntax ใน build.zig
4. ลบ cache: `rm -rf zig-cache`

### Zig Language Server

**Problem**: LSP ไม่ทำงาน

**Solution**:
1. ตรวจสอบว่า zig อยู่ใน PATH
2. รีสตาร์ต editor
3. ตรวจสอบ LSP configuration
4. ตรวจสอบ logs ของ LSP

## Debugging Tips

### Using Zig's Built-in Debugging

1. **Print Debugging**: ใช้ `std.debug.print` แทน `print`
2. **Assertions**: ใช้ `std.debug.assert` สำหรับ invariants
3. **Panic Traces**: เปิด stack traces ด้วย `-Ddebug`
4. **Memory Safety**: ใช้ `GeneralPurposeAllocator` ใน debug mode

### Common Mistakes

1. **ลืม defer**: ใช้ defer สำหรับ cleanup เสมอ
2. **Error handling ไม่ครบ**: ตรวจสอบทุก error union
3. **Type mismatches**: Zig ไม่มี implicit casting
4. **Comptime misuse**: ตรวจสอบว่า code สามารถ run ที่ comptime ได้

## Getting Help

- **Official Documentation**: https://ziglang.org/documentation/
- **Zig GitHub Issues**: https://github.com/ziglang/zig/issues
- **Zig Discord**: https://discord.gg/ziglang
- **Zig Forum**: https://ziggit.org/
