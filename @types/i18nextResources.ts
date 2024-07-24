import * as common from "../libs/server/src/locales/en/common.json";
import * as auth from "../libs/server/src/locales/en/auth.json";
import * as onboarding from "../libs/server/src/locales/en/onboarding.json";

const resources = {
  common,
  auth,
  onboarding,
} as const;

export default resources;
