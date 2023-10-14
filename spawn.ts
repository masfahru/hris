import os from "node:os";
import Bun from "bun";

const command = ["bun", "src/index.ts"]

const options = {
	stdio: ["inherit", "inherit", "inherit"],
	env: { ...process.env },
  onExit: (proc) => {
    if (proc.killed) {
      Bun.spawn(command, options);
    } 
  }
};


// @ts-ignore
const numCpus = os.availableParallelism();

for (let i = 0; i < numCpus; i++) {
	Bun.spawn(command, options);
}
