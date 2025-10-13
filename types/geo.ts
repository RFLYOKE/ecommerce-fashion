export type ROResponse<T> =
  | ReadonlyArray<T>
  | { data: ReadonlyArray<T> }
  | undefined;

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

const hasData = <T>(v: unknown): v is { data: ReadonlyArray<T> } =>
  isObject(v) && "data" in v;

export const toList = <T>(src: ROResponse<T>): ReadonlyArray<T> => {
  if (!src) return [];
  if (Array.isArray(src)) return src;
  if (hasData<T>(src)) return src.data;
  return [];
};

export const findName = <T extends { id: number | string; name: string }>(
  list: ReadonlyArray<T> | undefined,
  id?: number | string | null
): string => {
  if (!list?.length || id == null) return "";
  const target = String(id);
  const found = list.find((x) => String(x.id) === target);
  return found?.name ?? "";
};