import { makeSorter } from '../src/sort/sort.js';
import { createDevice } from './gpu.js';

async function TestSort(numElements: number) {
  const device = await createDevice();
  const sorter = makeSorter({
    device,
    buffer: device.createBuffer({
      size: numElements,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
    }),
    data: { kind: 'contiguous', elements: 'f32' },
  });

  const data = device.createBuffer({
    size: numElements,
    usage:
      GPUBufferUsage.MAP_READ |
      GPUBufferUsage.MAP_WRITE |
      GPUBufferUsage.COPY_SRC |
      GPUBufferUsage.COPY_DST,
    mappedAtCreation: true,
  });

  const unsorted = new Array<number>(numElements);
  for (var i = 0; i < numElements; i++) {
    unsorted[i] = Math.random();
  }
  const sorted = new Array<number>(...unsorted);
  sorted.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));

  {
    const f32s = new Float32Array(data.getMappedRange());
    for (var i = 0; i < numElements; i++) {
      f32s[i] = unsorted[i];
    }
    data.unmap();
  }

  const commandEncoder = device.createCommandEncoder();
  commandEncoder.copyBufferToBuffer(data, 0, sorter.config.buffer, 0, data.size);
  sorter.encode({ commandEncoder });
  commandEncoder.copyBufferToBuffer(sorter.config.buffer, 0, data, 0, data.size);
  device.queue.submit([commandEncoder.finish()]);

  {
    const got = new Float32Array(data.getMappedRange());
    for (var i = 0; i < numElements; i++) {
      if (sorted[i] !== got[i]) {
        console.error(`element[${i}] was not as expected.
 - expected ${sorted[i]}
 - got      ${got[i]}
`);
      }
    }
    data.unmap();
  }
}

export function TestSort64() {
  TestSort(64);
}
