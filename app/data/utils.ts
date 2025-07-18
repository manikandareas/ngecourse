export const toFileUrl = (file: string) => {
  return `${import.meta.env.VITE_BACKEND_URL}/assets/${file}?access_token=${import.meta.env.VITE_BACKEND_KEY}`;
};
