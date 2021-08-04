import { getAppEnvConfig } from "@/utils/env";

export interface GlobConfig {
  // Site title
  title: string;
  // Service interface url
  apiUrl: string;
  // Upload url
  uploadUrl?: string;
  //  Service interface url prefix
  urlPrefix?: string;
  // Project abbreviation
  shortName: string;
}

export const useGlobSetting = (): Readonly<GlobConfig> => {
  const {
    VUE_APP_TITLE,
    VUE_APP_API_URL,
    VUE_APP_SHORT_NAME,
    VUE_APP_API_URL_PREFIX,
    VUE_APP_UPLOAD_URL,
  } = getAppEnvConfig();

  const glob: Readonly<GlobConfig> = {
    title: VUE_APP_TITLE,
    apiUrl: VUE_APP_API_URL,
    shortName: VUE_APP_SHORT_NAME,
    urlPrefix: VUE_APP_API_URL_PREFIX,
    uploadUrl: VUE_APP_UPLOAD_URL,
  };

  return glob;
};
