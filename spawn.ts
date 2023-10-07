import os from "node:os";
import Bun from "bun";

// @ts-ignore
const numCpus = os.availableParallelism();

for (let i = 0; i < numCpus; i++) {
	Bun.spawn(["bun", "src/index.ts"], {
		stdio: ["inherit", "inherit", "inherit"],
		env: { ...process.env },
	});
}
