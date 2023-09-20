let childIdSequence = 0

export const newIndexer = () => ({
  id: childIdSequence--,
  name: "",
  hostname: "",
  pathExtension: "",
  cookie: "",
  indexType: "CSS" as const,
  replacements: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  selectorToClick: "",
  decodeUrl: false,
  keepOldValue: true,
  secondsBetweenUpdates: 39600,
  requestHeaders: {},
  selectors: [],
  slice: "",
  decimalPlaces: null,
  apiId: null,
  nextIndexerId: null,
  searchParams: null,
})
