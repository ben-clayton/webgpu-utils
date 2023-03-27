/// <reference types="@webgpu/types" />

export interface SortEnqueueArgs {
  commandEncoder: GPUCommandEncoder;
}

export interface Sorter {
  /** Encodes the sort */
  encode(args: SortEnqueueArgs): void;
  /** The buffer holding the data to be sorted */
  config: SorterConfig;
}

export interface SorterConfig {
  /** The GPU device */
  device: GPUDevice;
  /** The buffer holding the data to be sorted */
  buffer: GPUBuffer;
  /** The type of data to sort */
  data: BufferData;
}

export interface ContiguousArray {
  kind: 'contiguous';
  elements: 'i32' | 'u32' | 'f32';
}

export type BufferData = ContiguousArray;

export function makeSorter(cfg: SorterConfig): Sorter {
  return {
    encode: (args: SortEnqueueArgs) => {},
    config: cfg,
  };
}
