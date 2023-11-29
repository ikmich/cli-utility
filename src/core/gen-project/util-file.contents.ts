export const utilFileContents = {
  build() {
    return `export function _fn(f: () => any): any {
  return f();
}

export function toJson(o: any): string {
  return JSON.stringify(o, null, 2);
}

export function fromJson(json: string): any {
  return JSON.parse(json);
}
`;
  }
};
