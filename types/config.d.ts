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

export interface GlobEnvConfig {
  // Site title
  VUE_APP_TITLE: string;
  // Service interface url
  VUE_APP_API_URL: string;
  // Service interface url prefix
  VUE_APP_API_URL_PREFIX?: string;
  // Project abbreviation
  VUE_APP_SHORT_NAME: string;
  // Upload url
  VUE_APP_UPLOAD_URL?: string;
}
