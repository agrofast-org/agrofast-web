/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormValue, FormValues } from "@/types/form";
import { CalendarDate } from "@internationalized/date";

/**
 * Parses a nested object and flattens it into a single-level object with dot-separated keys.
 *
 * @param nested - The nested object to be flattened. It should be a record where keys are strings and values are of type `FormValue`.
 * @returns A flattened object where each key is a dot-separated path representing the original nested structure.
 *
 * @example
 * ```typescript
 * const nested = {
 *   user: {
 *     name: "John",
 *     address: {
 *       city: "New York",
 *       zip: "10001"
 *     }
 *   }
 * };
 * const flat = parseNested(nested);
 * flat = {
 *   "user.name": "John",
 *   "user.address.city": "New York",
 *   "user.address.zip": "10001"
 * }
 * ```
 */
export const parseNested = (nested: Record<string, FormValue>): FormValues => {
  const flat: FormValues = {};

  const flatten = (obj: unknown, prefix: string = ""): void => {
    if (
      typeof obj !== "object" ||
      obj === null ||
      (obj.constructor && obj.constructor.name === "File")
    ) {
      flat[prefix] = obj as FormValue;
      return;
    }

    if (Object.keys(obj).length === 0) {
      flat[prefix] = "" as unknown as FormValue;
      return;
    }

    for (const key in obj) {
      if (!obj.hasOwnProperty(key)) continue;
      const value = (obj as unknown as Record<string, FormValue>)[key];
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (typeof value === "object" && value !== null) {
        flatten(value, newKey);
      } else {
        flat[newKey] = value;
      }
    }
  };

  flatten(nested);
  return flat;
};

/**
 * Converts a flattened object with dot-separated keys back into a nested object.
 *
 * @param values - The flattened object to be converted. It should be a record where keys are dot-separated strings and values are of type `FormValue`.
 * @returns A nested object where each key represents the original nested structure.
 *
 * @example
 * ```typescript
 * const flat = {
 *   "user.name": "John",
 *   "user.address.city": "New York",
 *   "user.address.zip": "10001"
 * };
 * const nested = toNested(flat);
 * nested = {
 *   user: {
 *     name: "John",
 *     address: {
 *       city: "New York",
 *       zip: "10001"
 *     }
 *   }
 * }
 * ```
 */
export const toNested = (values: Record<string, any>): Record<string, any> => {
  const result: Record<string, any> = {};

  for (const flatKey in values) {
    if (!Object.prototype.hasOwnProperty.call(values, flatKey)) continue;
    let value = values[flatKey];

    if (value && value.day && value.month && value.year) {
      value = (new CalendarDate(value.year, value.month, value.day)).toString();
    }

    if (!flatKey.includes(".")) {
      result[flatKey] = value;
      continue;
    }

    const parts = flatKey.split(".");
    let current: any = result;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i === parts.length - 1;
      const nextPart = parts[i + 1];
      const key = /^\d+$/.test(part) ? Number(part) : part;

      if (isLast) {
        current[key] = value;
      } else {
        if (current[key] === undefined || current[key] === null) {
          current[key] = /^\d+$/.test(nextPart) ? [] : {};
        }
        current = current[key];
      }
    }
  }

  return result;
};
