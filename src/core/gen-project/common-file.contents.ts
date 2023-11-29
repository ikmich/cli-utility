export const commonFileContents = {
  build(projectName: string) {
    return `
export const PROJECT_NAME = '${projectName}';   
`;
  }
};
