interface HasCreatorId {
  creatorId: string;
}

export function isCreator<T extends HasCreatorId>(
  object: T,
  userId: string,
): boolean {
  return object.creatorId === userId;
}
