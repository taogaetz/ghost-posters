export const imageResizeParams = (quality, width, height) => {
  const params = new URLSearchParams();

  if (width) params.append('width', width);
  if (height) params.append('height', height);
  if (quality) params.append('quality', quality);

  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
};
