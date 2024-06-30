const API_V1 = "/api/v1";
export const routes = {
  app: {
    leagues: `${API_V1}/app/leagues`,
    teams: `${API_V1}/app/teams`,
    players: `${API_V1}/app/players`,
    users: `${API_V1}/app/users`,
  },
  auth: {
    register: `${API_V1}/auth/register`,
    login: `${API_V1}/auth/login`,
    logout: `${API_V1}/auth/logout`,
    delete: `${API_V1}/auth/delete`,
    profile: `${API_V1}/auth/profile`,
  },
  health: {
    check: `${API_V1}/healthcheck`,
  },
};

export const externalApi = {
  rest: "rest/v1",
  auth: "auth/v1",
  realtime: "realtime/v1",
  storage: "storage/v1",
};
