export class Mutex {
  private mutex = Promise.resolve();

  public lock(): PromiseLike<() => void> {

    let x: (unlock: () => void) => void;

    this.mutex = this.mutex.then(() => {
      return new Promise(x); // promise A
    });

    return new Promise((resolve) => {
      x = resolve;
    })
  }
}
