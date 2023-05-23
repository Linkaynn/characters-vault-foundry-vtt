export const createFolder = async (folderPath: string) => {
  const folders = folderPath.split('/');

  let currentFolder = '';

  for (const folder of folders) {
    currentFolder += `${folder}/`;

    try {
      await FilePicker.createDirectory('data', currentFolder);
    } catch (e) {
      console.log(e);
    }
  }
};
