export const dirtyFieldsToArray = <T extends string>(
  dirtyFields: Partial<Readonly<Record<T, boolean>>>
) =>
  Object.entries(dirtyFields)
    .filter(([, active]) => active)
    .map(([field]) => field)
    .filter((field): field is T => true);
