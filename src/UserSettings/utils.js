export const isTestApi = apiSourceUrl => {
  return apiSourceUrl && apiSourceUrl.includes('sample');
};
