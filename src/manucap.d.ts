declare module 'manucap' {
  import { Reducers } from 'manucap/dist/manucap/manuCapReducers';
  import { default as ManuCap } from 'manucap/dist/manucap/ManuCap';
  import { default as VideoPlayer } from 'manucap/dist/manucap/player/VideoPlayer';
  
  export const Actions: {
    updateEditingTrack: (track: unknown) => unknown;
    updateCues: (cues: unknown[]) => unknown;
    updateSourceCues: (cues: unknown[]) => unknown;
    updateCaptionUser: (user: unknown) => unknown;
    readCaptionSpecification: (spec: unknown) => unknown;
  };

  export const Hooks: {
    useMatchedCuesAsCsv: () => () => unknown;
  };
  
  export { VideoPlayer, Reducers, ManuCap };
}
