/**
 * Registers every translated UI dictionary for the build. Imported by the middleware only, so the
 * dictionaries never end up in the browser bundles (the browser loads /i18n/<locale>.js instead).
 */
import { registerDictionary } from './index';
import { dictionaries } from './dictionaries';

for (const [locale, dict] of Object.entries(dictionaries)) registerDictionary(locale as keyof typeof dictionaries, dict);
