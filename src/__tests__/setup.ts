import "@testing-library/react";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Limpar o DOM após cada teste
afterEach(() => {
  cleanup();
});
