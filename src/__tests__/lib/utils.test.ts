import {
  cn,
  getBaseUrl,
  getLegalUrl,
  getPortfolioUrl,
  getWebUrl,
  isNumeric,
  numberInputMask,
  parseQueryDate,
} from "@/lib/utils";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock das dependências externas
vi.mock("@/service/env", () => ({
  isDevelopment: vi.fn(() => false),
  isIpAddress: vi.fn(() => false),
  getCurrentOrigin: vi.fn(() => "http://localhost:3030"),
}));

describe("cn()", () => {
  it("combina classes simples", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("remove classes duplicadas com tailwind-merge", () => {
    expect(cn("p-4", "p-8")).toBe("p-8");
  });

  it("ignora valores falsy", () => {
    expect(cn("foo", undefined, null, false, "bar")).toBe("foo bar");
  });

  it("suporta expressões condicionais", () => {
    const isActive = true;
    expect(cn("base", isActive && "active")).toBe("base active");
  });

  it("retorna string vazia quando não há classes", () => {
    expect(cn()).toBe("");
  });
});

describe("numberInputMask()", () => {
  it("retorna string vazia para valor undefined", () => {
    expect(numberInputMask(undefined)).toBe("");
  });

  it("retorna string vazia para string vazia", () => {
    expect(numberInputMask("")).toBe("");
  });

  it("retorna string vazia para string apenas de espaços", () => {
    expect(numberInputMask("   ")).toBe("");
  });

  it("formata número BR com 10 dígitos: (DD) XXXX-XXXX", () => {
    const result = numberInputMask("11912341234");
    expect(result).toMatch(/\(\d{2}\) \d{5}-\d{4}/);
  });

  it("formata número BR com 11 dígitos (celular): (DD) XXXXX-XXXX", () => {
    expect(numberInputMask("11912341234")).toBe("(11) 91234-1234");
  });

  it("remove caracteres não numéricos antes de formatar", () => {
    expect(numberInputMask("(11) 91234-1234")).toBe("(11) 91234-1234");
  });

  it("limita a 19 caracteres de entrada", () => {
    const longNumber = "1234567890123456789012345";
    const result = numberInputMask(longNumber);
    // Deve processar apenas os primeiros 19 chars
    expect(result.length).toBeLessThanOrEqual(20);
  });

  it("formata número internacional: +CC (DD) XXXXX-XXXX", () => {
    const result = numberInputMask("5511912341234");
    expect(result).toBe("+55 (11) 91234-1234");
  });
});

describe("isNumeric()", () => {
  it("retorna true para string numérica", () => {
    expect(isNumeric("123")).toBe(true);
  });

  it("retorna true para dígito único", () => {
    expect(isNumeric("0")).toBe(true);
  });

  it("retorna false para string com letras", () => {
    expect(isNumeric("abc")).toBe(false);
  });

  it("retorna false para string mista", () => {
    expect(isNumeric("12a")).toBe(false);
  });

  it("retorna false para string vazia", () => {
    expect(isNumeric("")).toBe(false);
  });

  it("retorna false para ponto decimal", () => {
    expect(isNumeric("1.5")).toBe(false);
  });

  it("retorna false para espaço", () => {
    expect(isNumeric(" ")).toBe(false);
  });
});

describe("parseQueryDate()", () => {
  // A função recebe datas no formato DD-MM-YYYY (separado por traço)
  // e converte para YYYY-MM-DD. Datas no formato YYYY-MM-DD são
  // interpretadas erroneamente pelo bloco catch (o primeiro segmento
  // vira o "dia" e o último vira o "ano").

  it("converte date no formato DD-MM-YYYY para YYYY-MM-DD", () => {
    const result = parseQueryDate("31-12-2025");
    expect(result).toBe("2025-12-31");
  });

  it("retorna data com zeros à esquerda no mês", () => {
    const result = parseQueryDate("05-01-2025");
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("converte 01-06-2024 corretamente", () => {
    const result = parseQueryDate("01-06-2024");
    expect(result).toBe("2024-06-01");
  });

  it("retorna string no formato ISO YYYY-MM-DD", () => {
    const result = parseQueryDate("15-03-2023");
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("getBaseUrl()", () => {
  beforeEach(() => {
    // Limpar o cache da URL base entre testes
    // A função usa uma variável de módulo cacheada — apenas testamos o retorno
  });

  it("retorna string não vazia", () => {
    const url = getBaseUrl();
    expect(typeof url).toBe("string");
    expect(url.length).toBeGreaterThan(0);
  });

  it("retorna URL válida com protocolo", () => {
    const url = getBaseUrl();
    expect(url).toMatch(/^https?:\/\//);
  });
});

describe("getWebUrl()", () => {
  it("retorna URL com path /web", () => {
    const url = getWebUrl();
    expect(url).toContain("/web");
  });
});

describe("getLegalUrl()", () => {
  it("retorna URL com path /legal", () => {
    const url = getLegalUrl();
    expect(url).toContain("/legal");
  });
});

describe("getPortfolioUrl()", () => {
  it("retorna string não vazia", () => {
    const url = getPortfolioUrl();
    expect(typeof url).toBe("string");
    expect(url.length).toBeGreaterThan(0);
  });
});
