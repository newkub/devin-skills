---
title: Migrate from Rollup - Troubleshooting
description: Troubleshooting and benefits of migrating from Rollup to Rolldown
auto_execution_mode: 3
---

## Goal

Fix problems found after migration and summarize the benefits

## Scope

- Troubleshooting
- Benefits of migration

## Troubleshooting

### Plugin Not Compatible

Problem: A plugin does not work with Rolldown

Solution:
- Check whether a Rolldown version exists
- Use a plugin that is compatible with both
- Adjust the plugin to be compatible

### Build Error

Problem: Build error after migration

Solution:
- Check the config options
- Check plugin compatibility
- Check the TypeScript config

### Output Different

Problem: Output differs from Rollup

Solution:
- Check the tree-shaking options
- Check the minification settings
- Check the output format

## Benefits of Migration

- Performance: 10-100x faster builds
- TypeScript: Built-in TypeScript support
- Minification: Built-in minifier
- Compatibility: Rollup-compatible API

## Rules

- Check plugin compatibility when problems appear
- Check the config and output thoroughly
- Take advantage of Rolldown's built-in features

## Expected Outcome

- Problems after migration are resolved
- Gains from performance and built-in features
