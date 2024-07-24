import 'intl-pluralrules';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend, { HttpBackendOptions } from 'i18next-http-backend';
import * as RNLocalize from 'react-native-localize';
import HttpService from './HttpService';
import { dev } from '../utils/console';

const fallback = { languageTag: 'en', isRTL: false };

const { languageTag } =
  RNLocalize.findBestLanguageTag(['en', 'fr']) || fallback;

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init<HttpBackendOptions>({
    load: 'languageOnly',
    lng: languageTag,
    fallbackLng: fallback.languageTag,
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: `${HttpService.apiUrl}/locales/{{lng}}/{{ns}}`,
      request: (_options, url, _data, callback) => {
        dev('Requesting I18n translations from:', url);
        HttpService.client
          .get(url)
          .then((response) => {
            // Make sure to respond with the data *directly*, and not with the response object.
            callback(null, response.data);
          })
          .catch((error) => {
            callback(error, { status: 500, data: {} });
          });
      },
    },
  });

export default i18n;
