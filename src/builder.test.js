import { describe, it, expect, vi } from "vitest";
import { Builder } from "./builder.js";

vi.mock("./reader");

describe("Builder", () => {
  it("should create definitions with checkers", async () => {
    const builder = new Builder();

    builder
      .createDefinition("Definition 1")
      .addChecker("has yarn", () => true)
      .addChecker("has npm", () => true)
      .createDefinition("Definition 2")
      .addChecker("has docker", () => true)
      .start();

    expect(builder.definitions).toHaveLength(2);
    expect(builder.definitions[0].definitions).toHaveLength(2);
    expect(builder.definitions[1].definitions).toHaveLength(1);
  });
});
