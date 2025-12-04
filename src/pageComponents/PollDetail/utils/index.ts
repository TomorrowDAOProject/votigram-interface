export const getShareText = (title: string, desc: string) => {
  function decodeHtmlEntity(str: string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, "text/html");
    return doc.documentElement.textContent;
  }
  const decoded = decodeHtmlEntity(title);
  return `${decoded}\n${desc}`;
};
