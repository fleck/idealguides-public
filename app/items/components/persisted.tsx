// Client side models that haven't been persisted start at 0 and count down.
export const persisted = ({ id }: { id: string | bigint | number }) =>
  BigInt(id) > 0
