import { Nullable } from "./Nullable";
import { dirtyFieldsToArray } from "./dirtyFieldsToArray";
import { pickPartial } from "./pickPartial";

export const pickDirtyFields = <T extends Record<K, V>, K extends string, V>(
  dirtyFields: Partial<Readonly<Record<K, boolean>>>,
  values: T
) =>
  Nullable.from(dirtyFields)
    .then(dirtyFieldsToArray)
    .filter((fields) => fields.length > 0)
    .then((fields) => pickPartial(fields, values));
