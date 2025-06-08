import { EventEmitter } from '@shared/misc';

import { GlobalEventMap } from '../types';

export const globalEvents = new EventEmitter<GlobalEventMap>();
