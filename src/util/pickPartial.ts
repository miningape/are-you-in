export function pickPartial<V, T extends keyof V>(pick: T[], from: V) {
  return pick.reduce((acc, field) => {
    acc[field] = from[field];
    return acc;
  }, {} as Partial<V>);
}
