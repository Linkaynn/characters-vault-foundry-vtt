import type { FoundryVTTActorData } from '../communication/IframeHandler';
import { getUser } from '../utils/getUser';
import { dataURLtoFile } from './utils/transformBase64DataUrlToFile';
import { createFolder } from './utils/createFolder';

export const uploadCharacterToken = async (
  tokenAsBase64: string,
  actor: FoundryVTTActorData,
): Promise<{ path: string }> => {
  const tokenFolderPath = `characters-vault/${getUser().id}`;
  const file = dataURLtoFile(tokenAsBase64, `${actor.id}.png`);

  await createFolder(tokenFolderPath);

  const uploadResult = await FilePicker.upload('data', tokenFolderPath, file);

  if (uploadResult) {
    const r = uploadResult as FilePicker.UploadResult;

    return { path: r.path };
  } else {
    console.log(uploadResult);

    throw new Error('Error uploading token');
  }
};
