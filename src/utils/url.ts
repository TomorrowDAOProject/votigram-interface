export const getParamFromQuery = (param: string) => {
  if (!param) return '';
  const url = new URL(window.location.href);

  const params = new URLSearchParams(url.search);
  return params.get(param) || '';
}