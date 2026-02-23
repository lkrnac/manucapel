declare module 'manucap' {
  import { Reducers } from 'manucap/dist/manucap/manuCapReducers';
  import { default as ManuCap } from 'manucap/dist/manucap/ManuCap';
  import { default as VideoPlayer } from 'manucap/dist/manucap/player/VideoPlayer';
  
  export const Actions: {
    updateEditingTrack: (track: unknown) => { type: string };
    updateCues: (cues: unknown[]) => { type: string };
    updateSourceCues: (cues: unknown[]) => { type: string };
    updateCaptionUser: (user: unknown) => { type: string };
    readCaptionSpecification: (spec: unknown) => { type: string };
  };

  export const Hooks: {
    useMatchedCuesAsCsv: () => () => unknown;
  };
  
  export { VideoPlayer, Reducers, ManuCap };
}
