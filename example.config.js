export default [
  {
    name: "NPM or YARN",
    definitions: [
      {
        name: "has yarn",
        suggestions: ["install yarn"],
        checker: () => true,
      },
    ],
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
          console.log(definition);
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
