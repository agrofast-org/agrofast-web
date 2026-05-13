import { parseNested, toNested } from "@/lib/nested";
import { describe, expect, it } from "vitest";

describe("parseNested()", () => {
  it("achata um objeto simples sem aninhamento", () => {
    const result = parseNested({ name: "John", age: 30 });

    expect(result).toEqual({ name: "John", age: 30 });
  });

  it("achata um objeto com um nível de aninhamento", () => {
    const result = parseNested({
      user: { name: "John", email: "john@example.com" },
    });

    expect(result).toEqual({
      "user.name": "John",
      "user.email": "john@example.com",
    });
  });

  it("achata um objeto com múltiplos níveis de aninhamento", () => {
    const result = parseNested({
      user: {
        name: "John",
        address: {
          city: "São Paulo",
          zip: "01310-100",
        },
      },
    });

    expect(result).toEqual({
      "user.name": "John",
      "user.address.city": "São Paulo",
      "user.address.zip": "01310-100",
    });
  });

  it("retorna objeto com chave vazia para input vazio", () => {
    // A implementação atual retorna { '': '' } para um objeto vazio
    // pois o flatten chama flat[''] = '' quando obj está vazio
    const result = parseNested({});

    expect(result).toEqual({ "": "" });
  });

  it("preserva valores primitivos null", () => {
    const result = parseNested({ value: null });

    expect(result).toEqual({ value: null });
  });

  it("preserva valores primitivos boolean", () => {
    const result = parseNested({ active: true, deleted: false });

    expect(result).toEqual({ active: true, deleted: false });
  });

  it("preserva valores numéricos", () => {
    const result = parseNested({ price: 99.99, quantity: 3 });

    expect(result).toEqual({ price: 99.99, quantity: 3 });
  });

  it("usa string vazia para objetos vazios aninhados", () => {
    const result = parseNested({ meta: {} });

    expect(result).toEqual({ meta: "" });
  });

  it("achata múltiplos campos no mesmo nível", () => {
    const result = parseNested({
      a: { b: 1, c: 2 },
      d: 3,
    });

    expect(result).toEqual({ "a.b": 1, "a.c": 2, d: 3 });
  });
});

describe("toNested()", () => {
  it("converte objeto flat simples", () => {
    const result = toNested({ name: "John", age: 30 });

    expect(result).toEqual({ name: "John", age: 30 });
  });

  it("converte chaves com ponto para objeto aninhado", () => {
    const result = toNested({
      "user.name": "John",
      "user.email": "john@example.com",
    });

    expect(result).toEqual({
      user: { name: "John", email: "john@example.com" },
    });
  });

  it("converte múltiplos níveis de aninhamento", () => {
    const result = toNested({
      "user.name": "John",
      "user.address.city": "São Paulo",
      "user.address.zip": "01310-100",
    });

    expect(result).toEqual({
      user: {
        name: "John",
        address: {
          city: "São Paulo",
          zip: "01310-100",
        },
      },
    });
  });

  it("retorna objeto vazio para input vazio", () => {
    const result = toNested({});

    // toNested não acessa flatten, apenas itera chaves — correto retornar {}
    expect(Object.keys(result).length).toBe(0);
  });

  it("mantém chaves sem ponto intactas", () => {
    const result = toNested({ simpleKey: "value" });

    expect(result).toEqual({ simpleKey: "value" });
  });

  it("converte chaves numéricas para arrays", () => {
    const result = toNested({
      "items.0": "primeiro",
      "items.1": "segundo",
    });

    expect(result.items).toBeDefined();
    expect(result.items[0]).toBe("primeiro");
    expect(result.items[1]).toBe("segundo");
  });

  it("é inverso de parseNested para objetos simples", () => {
    const original = { "user.name": "John", "user.age": 30 };
    const nested = toNested(original);
    const flat = parseNested(nested as Record<string, unknown>);

    expect(flat).toEqual(original);
  });
});
