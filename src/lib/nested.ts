import { FormValue, FormValues } from "@/components/form";
import { isNumeric } from "./utils";

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

  const flatten = (obj: FormValue, prefix: string = ""): void => {
    if (typeof obj !== "object" || obj === null) {
      flat[prefix] = obj;
      return;
    }

    if (Object.keys(obj).length === 0) {
      flat[prefix] = obj;
      return;
    }

    for (const key in obj) {
      if (!obj.hasOwnProperty(key)) continue;
      const value = obj[key];
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
export const toNested = (values: FormValues): FormValue => {
  const result: FormValue = {};

  for (const flatKey in values) {
    if (!values.hasOwnProperty(flatKey)) continue;
    const value = values[flatKey];
    const parts = flatKey.split(".");
    let current = result;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const key = isNumeric(part) ? Number(part) : part;
      const isLast = i === parts.length - 1;

      if (isLast) {
        current[key] = value;
      } else {
        if (current[key] === undefined) {
          const nextPart = parts[i + 1];
          current[key] = isNumeric(nextPart) ? [] : {};
        }
        current = current[key];
      }
    }
  }

  return result;
};
