import { useDebounce } from "@/hooks/use-debounce";
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("useDebounce()", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("não chama a função antes do delay", () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useDebounce(fn, 300));
    const [debounce] = result.current;

    act(() => {
      debounce();
    });

    expect(fn).not.toHaveBeenCalled();
  });

  it("chama a função após o delay", () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useDebounce(fn, 300));
    const [debounce] = result.current;

    act(() => {
      debounce();
      vi.advanceTimersByTime(300);
    });

    expect(fn).toHaveBeenCalledOnce();
  });

  it("cancela chamadas anteriores quando chamado novamente dentro do delay", () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useDebounce(fn, 300));
    const [debounce] = result.current;

    act(() => {
      debounce();
      vi.advanceTimersByTime(200);
      debounce();
      vi.advanceTimersByTime(300);
    });

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("passa argumentos corretamente para a função", () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useDebounce(fn, 100));
    const [debounce] = result.current;

    act(() => {
      debounce("arg1", 42);
      vi.advanceTimersByTime(100);
    });

    expect(fn).toHaveBeenCalledWith("arg1", 42);
  });

  it("indica debouncing como true enquanto aguarda", () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useDebounce(fn, 300));
    const [debounce, , ] = result.current;

    act(() => {
      debounce();
    });

    // Após disparar, debouncing deve ser true
    expect(result.current[2]).toBe(true);
  });

  it("indica debouncing como false após o delay", () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useDebounce(fn, 300));
    const [debounce] = result.current;

    act(() => {
      debounce();
      vi.advanceTimersByTime(300);
    });

    expect(result.current[2]).toBe(false);
  });

  it("cancel() impede a execução da função", () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useDebounce(fn, 300));
    const [debounce, cancel] = result.current;

    act(() => {
      debounce();
      cancel();
      vi.advanceTimersByTime(300);
    });

    expect(fn).not.toHaveBeenCalled();
  });

  it("usa delay mínimo de 0 quando delay negativo é passado", () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useDebounce(fn, -100));
    const [debounce] = result.current;

    act(() => {
      debounce();
      vi.advanceTimersByTime(0);
    });

    // Com delay 0, executa imediatamente
    expect(fn).toHaveBeenCalled();
  });
});
