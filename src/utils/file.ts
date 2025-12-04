export function generateRandomString(len: number = 10) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < len; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export function blobToFile(blob: Blob, fileName?: string) {
  const fileNameWithExtension = fileName || generateRandomString(10) + '.png';
  const file = new File([blob], fileNameWithExtension, {
    type: blob.type,
    lastModified: Date.now()
  });
  return file;
}
