export const transformImageUrlToBase64 = (
  imageUrl: string,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.onload = () => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };

      reader.onerror = () => {
        reject(reader.error);
      };

      reader.readAsDataURL(xhr.response);
    };

    xhr.open('GET', imageUrl);
    xhr.responseType = 'blob';
    xhr.send();
  });
};
