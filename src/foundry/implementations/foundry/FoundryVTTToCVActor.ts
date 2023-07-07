export type FoundryVTTToCVActor = {
  id: string;
  name: string;

  vtt: 'foundry';
  vttVersion: number;

  data: any;

  flags: Record<string, any>;
};
