import Conf from 'conf';

export class AppStorage {
  readonly conf;
  get: typeof this.conf.get;
  set: typeof this.conf.set;

  constructor(projectName: string) {
    this.conf = new Conf({
      projectName
    });
    this.get = this.conf.get;
    this.set = this.conf.set;
  }

  getData<T extends any>(key: string) {
    return this.get(key) as T;
  }

  setData<T extends any>(key: string, value: T) {
    this.set(key, value as T);
  }
}
