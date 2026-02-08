#!/usr/bin/env node
/**
 * Vercel build script that runs the build even if TypeScript has type errors
 * This is needed because Vercel runs type checking after the build
 */

import { execSync } from 'child_process';

try {
  console.log('🚀 Running build script...');
  execSync('node script/build.mjs', { stdio: 'inherit' });
  console.log('✅ Build completed successfully');
  process.exit(0);
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
