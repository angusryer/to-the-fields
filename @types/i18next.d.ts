import resources from "./i18nextResources";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: typeof resources.common;
    fallbackLng: "en";
    resources: typeof resources;
  }
}
