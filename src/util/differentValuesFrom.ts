export const hasDifferentValuesFrom =
  <T extends Record<K, V>, K extends string, V>(initial: T) =>
  (changed: Partial<T>) =>
    Object.keys(changed)
      .filter((key): key is K => true)
      .filter((key) => changed[key] !== initial[key]).length > 0;
