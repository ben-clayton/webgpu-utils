import { createRequire } from 'node:module';
import { setGPUProvider } from "./gpu.js";

export function loadDawnNode() {
  const require = createRequire(import.meta.url);
  const dawnNode = require(process.env.DAWN_NODE!);
  setGPUProvider({ create: dawnNode.create });
}
