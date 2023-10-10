const getOrCreatePlugin = <T, Plugin>(
  deps: T,
  generate: (deps: T) => Plugin,
  pluginMap: Map<T, Plugin>,
): Plugin => {
  if (deps) {
    if (pluginMap.has(deps)) {
      const plugin = pluginMap.get(deps);
      if (plugin) {
        return plugin;
      }
    }
  }
  const plugin = generate(deps);
  pluginMap.set(deps, plugin);
  return plugin;
};

export default getOrCreatePlugin;
