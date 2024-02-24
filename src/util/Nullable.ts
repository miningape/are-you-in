export class Nullable<T> {
  static from = <T>(value: T | null) => new Nullable<T>(value);
  constructor(private value: T | null) {}

  filter = (discriminator: (a: T) => boolean): Nullable<T> =>
    Nullable.from(
      this.value !== null && discriminator(this.value) ? this.value : null
    );
  then = <V>(functor: (a: T) => V): Nullable<V> =>
    Nullable.from(this.value !== null ? functor(this.value) : null);
  else = <V>(value: V) =>
    this.value === null ? Nullable.from(value) : Nullable.from(this.value);
  get = () => this.value;
}
