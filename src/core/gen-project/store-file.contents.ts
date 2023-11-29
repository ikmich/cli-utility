export const storeFileContents = {
  build(projectName: string): string {
    return `import { AppStorage } from 'cli-utility';

class DataStore extends AppStorage {
  constructor(projectName: string) {
    super(projectName)
  }
  
  // Implement custom methods here.
}

export const store = new DataStore('${projectName}');
`;
  }
};
