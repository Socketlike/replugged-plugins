import { AnyFunction } from 'replugged/types';

export class EventEmitter extends EventTarget {
  private _events = new Map<string, Set<AnyFunction>>();

  public on<T>(event: string, listener: (event: CustomEvent<T>) => void): () => void {
    this.addEventListener(event, listener as EventListener);

    if (!this._events.has(event)) this._events.set(event, new Set<AnyFunction>());

    this._events.get(event).add(listener);

    return () => this.off(event, listener);
  }

  public off<T>(event: string, listener: (event: CustomEvent<T>) => void): void {
    if (this._events.has(event)) this._events.get(event).delete(listener);

    this.removeEventListener(event, listener as EventListener);
  }

  public emit<T>(event: string, data?: T): void {
    this.dispatchEvent(new CustomEvent(event, { detail: data }));
  }
}

export const events = new EventEmitter();
