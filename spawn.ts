import os from 'node:os';

// @ts-ignore
const numCPUs = os.availableParallelism();

for (let i = 0; i < numCPUs; i++) {
  Bun.spawn(['bun', 'src/index.ts'], {
    stdio: ['inherit', 'inherit', 'inherit'],
    env: { ...process.env },
  });
}
