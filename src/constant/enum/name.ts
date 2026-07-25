export const NAME: Record<string, string> = {
  BASE_API: "BASE_API",
  BASE_API_EXM: "BASE_API_EXM",
  FLIGHT_API: "FLIGHT_API",
};

export type CONSTANT_NAME = (typeof NAME)[keyof typeof NAME];
