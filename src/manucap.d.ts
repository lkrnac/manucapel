declare module 'manucap' {
  import { Reducers } from 'manucap/dist/manucap/manuCapReducers';
  import { default as ManuCap } from 'manucap/dist/manucap/ManuCap';
  import { default as VideoPlayer } from 'manucap/dist/manucap/player/VideoPlayer';
  
  export const Actions: {
    updateEditingTrack: (track: any) => any;
    updateCues: (cues: any[]) => any;
    updateSourceCues: (cues: any[]) => any;
    updateCaptionUser: (user: any) => any;
    readCaptionSpecification: (spec: any) => any;
  };
  
  export const Hooks: {
    useMatchedCuesAsCsv: () => Function;
  };
  
  export { VideoPlayer, Reducers, ManuCap };
}
