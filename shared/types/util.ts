export type ToPrimitive<T, D = unknown> = T extends string
  ? string
  : T extends number
  ? number
  : T extends bigint
  ? bigint
  : T extends boolean
  ? boolean
  : T extends undefined
  ? undefined
  : T extends symbol
  ? symbol
  : T extends null
  ? null
  : D;
