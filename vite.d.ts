import type { InlineConfig as VitestInlineConfig } from 'vitest';
import 'vite';

declare module 'vite' {
  interface UserConfig {
    test?: VitestInlineConfig;
  }
}
