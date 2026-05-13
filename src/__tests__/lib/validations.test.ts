import { validateBrowserAgent } from "@/lib/validations";
import { describe, expect, it } from "vitest";

describe("validateBrowserAgent()", () => {
  it("retorna true para UUID v4 válido", () => {
    expect(validateBrowserAgent("550e8400-e29b-41d4-a716-446655440000")).toBe(
      true,
    );
  });

  it("retorna true para UUID com letras maiúsculas", () => {
    expect(validateBrowserAgent("550E8400-E29B-41D4-A716-446655440000")).toBe(
      true,
    );
  });

  it("retorna true para UUID com letras minúsculas", () => {
    expect(validateBrowserAgent("a3b4c5d6-e7f8-1234-abcd-ef1234567890")).toBe(
      true,
    );
  });

  it("retorna false para string vazia", () => {
    expect(validateBrowserAgent("")).toBe(false);
  });

  it("retorna false para UUID incompleto (segmento faltando)", () => {
    expect(validateBrowserAgent("550e8400-e29b-41d4-a716")).toBe(false);
  });

  it("retorna false para UUID com segmentos de tamanho errado", () => {
    expect(validateBrowserAgent("550e8400-e29b-41d4-a716-4466554400001")).toBe(
      false,
    );
  });

  it("retorna false para texto aleatório", () => {
    expect(validateBrowserAgent("not-a-uuid")).toBe(false);
  });

  it("retorna false para UUID com caractere inválido (g)", () => {
    expect(validateBrowserAgent("550g8400-e29b-41d4-a716-446655440000")).toBe(
      false,
    );
  });

  it("retorna false para UUID sem hífens", () => {
    expect(validateBrowserAgent("550e8400e29b41d4a716446655440000")).toBe(
      false,
    );
  });

  it("retorna false para UUID com hífens em posições erradas", () => {
    expect(validateBrowserAgent("550e840-0e29b-41d4-a716-446655440000")).toBe(
      false,
    );
  });

  it("valida corretamente múltiplos UUIDs válidos", () => {
    const uuids = [
      "00000000-0000-0000-0000-000000000000",
      "ffffffff-ffff-ffff-ffff-ffffffffffff",
      "12345678-1234-1234-1234-123456789abc",
    ];

    uuids.forEach((uuid) => {
      expect(validateBrowserAgent(uuid)).toBe(true);
    });
  });
});
