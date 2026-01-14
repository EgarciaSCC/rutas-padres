import {
  children as mockChildren,
  childrenMap,
  routeEventsByChild,
  mockHistory,
  routeSchedules as mockRouteSchedules,
  exceptions as mockExceptions,
  Child,
  RouteEvent,
  RouteHistory,
  routeLocationsByChild,
  RouteLocations,
} from "@/mocks/mocksData";

function delay<T>(value: T, ms = 400): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

// helper to parse date fields in schedules/exceptions
function parseSchedules(raw: any[]) {
  return raw.map((s) => ({ ...s, date: new Date(s.date) }));
}

function parseExceptions(raw: any[]) {
  return raw.map((e) => ({ ...e, date: new Date(e.date) }));
}

export const api = {
  getChildren: async (): Promise<Child[]> => {
    // return all children
    return delay(mockChildren, 300);
  },

  getChildById: async (id: string): Promise<Child | null> => {
    return delay(childrenMap[id] ?? null, 300);
  },

  getRouteEvents: async (childId: string): Promise<RouteEvent[]> => {
    return delay(routeEventsByChild[childId] ?? [], 350);
  },

  getRouteHistory: async (): Promise<RouteHistory[]> => {
    return delay(mockHistory, 400);
  },

  getRouteHistoryByChild: async (childId: string): Promise<RouteHistory[]> => {
    return delay(mockHistory.filter((r) => r.childId === childId), 350);
  },

  // simple filtered query to emulate server-side filters
  queryRouteHistory: async (opts: { childId?: string; status?: string }): Promise<RouteHistory[]> => {
    const { childId, status } = opts;
    let res = mockHistory as RouteHistory[];
    if (childId && childId !== "all") res = res.filter((r) => r.childId === childId);
    if (status && status !== "all") res = res.filter((r) => r.status === status);
    return delay(res, 350);
  },

  // Calendar endpoints
  getSchedules: async (): Promise<any[]> => {
    // parse date strings into Date objects
    return delay(parseSchedules(mockRouteSchedules), 350);
  },

  getExceptions: async (): Promise<any[]> => {
    return delay(parseExceptions(mockExceptions), 350);
  },

  // New: obtener ubicaciones (bus y casa) para un niño
  getRouteLocations: async (childId: string): Promise<RouteLocations | null> => {
    return delay(routeLocationsByChild[childId] ?? null, 250);
  },
};

export type Api = typeof api;
