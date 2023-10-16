import { describe, expect, it, vi } from "vitest";
import {
  Definition,
  DefinitionDictionary,
  DefinitionStatus,
} from "./definition";

describe("Definition", () => {
  describe("evaluate()", () => {
    it("should be create with the default values", () => {
      const result = new Definition({
        name: "test",
        checker: () => true,
      });

      expect(result).toBeTruthy();
      expect(result).toBeTypeOf("object");
      expect(result.status).toBe(DefinitionStatus.PENDING);
      expect(result.definitions.length).toBe(0);
      expect(result.suggestions.length).toBe(0);
    });

    it("should fail if passed checker and definitions", () => {
      expect(() => {
        new Definition({
          name: "test",
          checker: () => true,
          definitions: [{}],
        });
      }).toThrow(
        "Definition test has both checker and definitions. You cannot use in the same time."
      );
    });

    it("should fail if no name is defined", () => {
      expect(() => {
        new Definition({});
      }).toThrow("Definition name is required");
    });

    it("should get the status SUCCESS of the root if the checker has passed", async () => {
      const def = new Definition({
        name: "root",
        checker: () => true,
      });
      await def.evaluate();
      expect(def.status).toBe(DefinitionStatus.SUCCESS);
    });

    it("should get the status FAILED of the root if the checker hasn't passed", async () => {
      const def = new Definition({
        name: "root",
        checker: () => false,
      });
      await def.evaluate();

      expect(def.status).toBe(DefinitionStatus.FAILED);
    });

    it("should get the status FAILED for all sub nodes if the children fails", async () => {
      const def = new Definition({
        name: "root",
        definitions: [
          {
            name: "child",
            checker: () => false,
          },
          {
            name: "child2",
            checker: () => false,
          },
        ],
      });

      await def.evaluate();

      expect(DefinitionDictionary.get("child2").status).toBe(
        DefinitionStatus.FAILED
      );
      expect(DefinitionDictionary.get("child").status).toBe(
        DefinitionStatus.FAILED
      );
      expect(DefinitionDictionary.get("root").status).toBe(
        DefinitionStatus.FAILED
      );
    });

    it("should get the status PARTIAL for the parent of the sub nodes", async () => {
      const def = new Definition({
        name: "root",
        definitions: [
          {
            name: "child",
            checker: () => false,
          },
          {
            name: "child2",
            checker: () => true,
          },
        ],
      });

      await def.evaluate();

      expect(DefinitionDictionary.get("child2").status).toBe(
        DefinitionStatus.SUCCESS
      );
      expect(DefinitionDictionary.get("child").status).toBe(
        DefinitionStatus.FAILED
      );
      expect(DefinitionDictionary.get("root").status).toBe(
        DefinitionStatus.PARTIAL
      );
    });

    it("should call the checker with the definition and call internal methods", async () => {
      const definition = new Definition({
        name: "test",
        checker: vi.fn().mockImplementation(({ definition: def }) => {
          def.pushSuggestion("test1");
          def.pushSuggestion("test2");
          return true;
        }),
      });

      const pushSpy = vi.spyOn(definition, "pushSuggestion");

      await definition.evaluate();

      expect(definition.checker).toHaveBeenCalledWith({
        definition,
        bash: expect.any(Function),
      });
      expect(pushSpy).toBeCalledWith("test1");
      expect(pushSpy).toBeCalledWith("test2");
      expect(definition.suggestions).toEqual(["test1", "test2"]);
    });

    it("should return false if the async checker fails", async () => {
      const definition = new Definition({
        name: "test",
        checker: async () => {
          throw new Error("test");
        },
      });

      await definition.evaluate();

      expect(definition.status).toBe(DefinitionStatus.FAILED);
    });
  });

  describe("pushSuggestion()", () => {
    it("should add the suggestion in the suggestions array", () => {
      const definition = new Definition({
        name: "test",
        checker: () => true,
      });

      definition.pushSuggestion("test1");
      definition.pushSuggestion("test2");

      expect(definition.suggestions).toEqual(["test1", "test2"]);
    });
  });

  it.todo("should call the accept fixers");
});
