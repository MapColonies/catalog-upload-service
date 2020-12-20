function joinUrl(...urlParts: string[]): string {
  if (urlParts.length == 0) {
    return '';
  }
  let url = urlParts[0];
  for (let i = 1; i < urlParts.length; i++) {
    if (url.endsWith('/')) {
      url += urlParts[i];
    } else {
      url += '/' + urlParts[i];
    }
  }
  return url;
}

export { joinUrl };
