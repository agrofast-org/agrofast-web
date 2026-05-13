import {
  getCurrentOrigin,
  isDevelopment,
  isIpAddress,
  isProduction,
} from "@/service/env";
import { describe, expect, it } from "vitest";

describe("isProduction()", () => {
  it("retorna false em ambiente de teste/desenvolvimento", () => {
    // NODE_ENV é 'test' no Vitest por padrão
    expect(isProduction()).toBe(false);
  });
});

describe("isDevelopment()", () => {
  it("retorna false em ambiente de teste", () => {
    // NODE_ENV é 'test' durante os testes, não 'development'
    expect(isDevelopment()).toBe(false);
  });
});

describe("isIpAddress()", () => {
  it("retorna true para endereço IPv4 simples", () => {
    expect(isIpAddress("192.168.1.1")).toBe(true);
  });

  it("retorna true para localhost numérico", () => {
    expect(isIpAddress("127.0.0.1")).toBe(true);
  });

  it("retorna true para IP apenas com dígitos e pontos", () => {
    expect(isIpAddress("10.0.0.1")).toBe(true);
  });

  it("retorna false para hostname de domínio", () => {
    expect(isIpAddress("example.com")).toBe(false);
  });

  it("retorna false para localhost (texto)", () => {
    expect(isIpAddress("localhost")).toBe(false);
  });

  it("retorna false para domínio com subdomínio", () => {
    expect(isIpAddress("api.agrofast.tech")).toBe(false);
  });

  it("retorna false para string vazia", () => {
    expect(isIpAddress("")).toBe(false);
  });

  it("retorna true para IP sem pontos (apenas números)", () => {
    // A regex /^[0-9.]+$/ também aceita apenas dígitos
    expect(isIpAddress("12345")).toBe(true);
  });

  it("retorna false para IP com letras", () => {
    expect(isIpAddress("192.168.1.abc")).toBe(false);
  });
});

describe("getCurrentOrigin()", () => {
  it("retorna string com protocolo e host", () => {
    // No ambiente de teste (happy-dom) window existe mas location pode ser controlável
    const origin = getCurrentOrigin();
    expect(typeof origin).toBe("string");
    expect(origin).toMatch(/^https?:\/\//);
  });

  it("retorna fallback http://localhost:3000 quando window não existe", () => {
    // Simular ambiente SSR onde window não existe
    const windowBackup = globalThis.window;

    // @ts-expect-error - simulando ambiente SSR
    delete globalThis.window;

    const origin = getCurrentOrigin();
    expect(origin).toBe("http://localhost:3000");

    globalThis.window = windowBackup;
  });
});
