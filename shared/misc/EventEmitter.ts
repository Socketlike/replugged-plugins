/**
 * @template EventMap (event name) -> (value)
 * @example
 * const events = new EventEmitter<{
 *   'string': string;
 * }>();
 *
 * events.on('string', (event) => {
 *   // event.detail infers as (string)
 * });
 */
export class EventEmitter<EventMap extends Record<string, unknown>> {
  private _target = new EventTarget();
  private _events = new Map<string, Set<(...args: any[]) => void>>();

  public on<T extends keyof EventMap>(
    event: T & string,
    listener: (event: CustomEvent<EventMap[T]>) => void,
  ): () => void {
    this._target.addEventListener(event, listener as EventListener);

    if (!this._events.has(event)) this._events.set(event, new Set<(...args: any[]) => void>());

    this._events.get(event).add(listener);

    return () => this.off(event, listener);
  }

  public chainableOn<T extends keyof EventMap>(
    event: T & string,
    listener: (event: CustomEvent<EventMap[T]>) => void,
  ): this {
    this.on(event, listener);
    return this;
  }

  public off<T extends keyof EventMap>(
    event: T & string,
    listener: (event: CustomEvent<EventMap[T]>) => void,
  ): void {
    if (this._events.has(event)) this._events.get(event).delete(listener);

    this._target.removeEventListener(event, listener as EventListener);
  }

  public chainableOff<T extends keyof EventMap>(
    event: T & string,
    listener: (event: CustomEvent<EventMap[T]>) => void,
  ): this {
    this.off(event, listener);
    return this;
  }

  public emit<T extends keyof EventMap>(event: T & string, data?: unknown): void {
    this._target.dispatchEvent(new CustomEvent(event, { detail: data }));
  }
}
