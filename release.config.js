module.exports = {
  branches: ["main", "develop"],
  repositoryUrl: "https://github.com/zoricavukovic/probaAngularWorkflow",
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/npm",
    "@semantic-release/github"
  ]
};
