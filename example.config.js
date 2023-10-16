module.exports = [
  {
    name: "NPM or YARN",
    suggestions: ["install yarn or npm"],
    checker: async ({ bash }) => {
      await bash("npm --version");
      await bash("yarn --version");

      return true;
    },
  },
  {
    name: "Docker",
    suggestions: ["Install npm", "Install yarn"],
    fix: [],
    definitions: [
      {
        name: "has docker",
        suggestions: ["visit: https://www.docker.com"],
        checker: ({ definition }) => {
          definition.pushSuggestion("Install docker friend");
          return false;
        },
      },
      {
        name: "has containerd",
        suggestions: ["Install the containerd"],
        checker: () => false,
      },
    ],
  },
  {
    name: "Environments",
    definitions: [
      {
        name: "has A",
        suggestions: ["Run the .source"],
        checker: () => !!process.env.A,
      },
      {
        name: "has B",
        suggestions: ["Run the .source"],
        checker: () => true,
      },
    ],
  },
];
