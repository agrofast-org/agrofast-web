import useCountdown from "@/hooks/use-countdown";
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Precisamos do @testing-library/react para hooks
// Vamos usar renderHook para testar hooks React

describe("useCountdown()", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("inicializa com o tempo fornecido", () => {
    const { result } = renderHook(() => useCountdown(60));

    expect(result.current.time).toBe(60);
  });

  it("inicia executando quando autoStart é true (padrão)", () => {
    const { result } = renderHook(() => useCountdown(60));

    expect(result.current.isRunning).toBe(true);
  });

  it("não inicia quando autoStart é false", () => {
    const { result } = renderHook(() => useCountdown(60, { autoStart: false }));

    expect(result.current.isRunning).toBe(false);
  });

  it("decrementa o tempo a cada segundo", () => {
    const { result } = renderHook(() => useCountdown(5));

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.time).toBe(2);
  });

  it("para em zero quando o tempo acaba", () => {
    const { result } = renderHook(() => useCountdown(3));

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current.time).toBe(0);
    expect(result.current.isRunning).toBe(false);
  });

  it("chama onComplete quando o tempo chega a zero", () => {
    const onComplete = vi.fn();
    renderHook(() => useCountdown(2, { onComplete }));

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    // onComplete é chamado ao menos uma vez quando o tempo zera
    expect(onComplete).toHaveBeenCalled();
  });

  it("pausa o contador ao chamar pause()", () => {
    const { result } = renderHook(() => useCountdown(10));

    act(() => {
      result.current.pause();
    });

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.isRunning).toBe(false);
    // O tempo não deve ter diminuído muito após pausa
    expect(result.current.time).toBeGreaterThan(7);
  });

  it("reseta para o tempo inicial ao chamar reset()", () => {
    const { result } = renderHook(() => useCountdown(10));

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.time).toBe(10);
  });

  it("reseta para um novo tempo quando reset(newTime) é chamado", () => {
    const { result } = renderHook(() => useCountdown(10));

    act(() => {
      result.current.reset(30);
    });

    expect(result.current.time).toBe(30);
  });

  it("não chama onComplete antes do tempo zerar", () => {
    const onComplete = vi.fn();
    renderHook(() => useCountdown(10, { onComplete }));

    act(() => {
      vi.advanceTimersByTime(5000); // apenas 5s de 10s
    });

    // onComplete não deve ser chamado antes do tempo acabar
    expect(onComplete).not.toHaveBeenCalled();
  });
});
