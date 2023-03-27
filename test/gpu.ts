/// <reference types="@webgpu/types" />

interface GPUProvider {
  /** Returns a GPU with the given flags */
  create(flags: string[]): GPU;
}

export let gpuProvider: GPUProvider;

export function setGPUProvider(provider: GPUProvider) {
  gpuProvider = provider;
}

export async function createDevice(): Promise<GPUDevice> {
  if (!gpuProvider) {
    throw new Error('no gpuProvider assigned');
  }
  const gpu = gpuProvider.create([]);
  if (!gpu) {
    throw new Error('gpuProvider.create() failed');
  }
  const adapter = await gpu.requestAdapter();
  if (!adapter) {
    throw new Error('gpu.requestAdapter failed');
  }
  const device = await adapter?.requestDevice();
  if (!device) {
    throw new Error('requestDevice failed');
  }
  return device;
}
