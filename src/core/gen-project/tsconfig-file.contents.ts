export const tsconfigFileContents = {
  build() {
    return `{
  "compilerOptions": {
    "target": "ESNext",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "resolveJsonModule": true,
    "rootDir": "./src",
    "outDir": "./dist",
    "baseUrl": "./",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": false,
    "strict": true,
    "noImplicitAny": true,
    "strictPropertyInitialization": true,
    "noUnusedLocals": false,
    "incremental": true,
    "skipLibCheck": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true
  }
}
`;
  }
};
