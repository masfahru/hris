import getOrCreatePlugin from "./index";
import { describe, expect, it, mock } from "bun:test";

describe("getOrCreatePlugin", () => {
	it("should return the same plugin instance for the same dependencies", () => {
		const deps = { foo: "bar" };
		const generate = mock(() => ({ baz: "qux" }));
		const pluginMap = new Map();

		const plugin1 = getOrCreatePlugin(deps, generate, pluginMap);
		const plugin2 = getOrCreatePlugin(deps, generate, pluginMap);

		expect(plugin1).toBe(plugin2);
		expect(generate).toHaveBeenCalledTimes(1);
	});

	it("should return a new plugin instance for different dependencies", () => {
		const deps1 = { foo: "bar" };
		const deps2 = { bar: "baz" };
		const generate = mock(() => ({ baz: "qux" }));
		const pluginMap = new Map();

		const plugin1 = getOrCreatePlugin(deps1, generate, pluginMap);
		const plugin2 = getOrCreatePlugin(deps2, generate, pluginMap);

		expect(plugin1).not.toBe(plugin2);
		expect(generate).toHaveBeenCalledTimes(2);
	});
});
