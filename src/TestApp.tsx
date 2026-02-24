import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/bootstrap4-light-blue/theme.css";
import "manucap/style";
import { ComponentProps, ReactElement, useEffect, useState } from "react";
import "draft-js/dist/Draft.css";
import { Actions, ManuCap } from "manucap";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import VideoDropZone from "./VideoDropZone";

type Track = Parameters<typeof Actions.updateEditingTrack>[0];
type CueDto = Parameters<typeof Actions.updateCues>[0][number];
type User = Track['createdBy'];
type Language = Track['language'];
type SaveState = ComponentProps<typeof ManuCap>['saveState'];
const {
    updateSourceCues,
    updateCues,
    updateEditingTrack,
    updateCaptionUser
} = Actions;
import { useAppDispatch } from "./hooks/useRedux";

// ################## TESTING DATA TWEAKS ##############################
const language = { id: "en-US", name: "English (US)", direction: "LTR" } as Language;
// const language = { id: "ar-SA", name: "Arabic", direction: "RTL" } as Language;

const trackType = "TRANSLATION";
// const trackType = "CAPTION";

const TIME_MATCH_TESTING = false;

const mediaChunkStart = undefined;
const mediaChunkEnd = undefined;
// const mediaChunkStart = TIME_MATCH_TESTING ? 0 : 13000;
// const mediaChunkEnd = 305000;

// ################## TESTING DATA TWEAKS - END ########################

const sourceLanguage = { id: "sk", name: "Slovak", direction: "LTR" } as Language;
const MIN_DURATION_SECONDS = 0.5;
const START_SHIFT = TIME_MATCH_TESTING ? 30 : 0;

const randomTime = (max: number): number => MIN_DURATION_SECONDS + Math.random() * (max - MIN_DURATION_SECONDS);

const inChunkRange = (start: number, end: number): boolean => {
    if (mediaChunkStart && mediaChunkEnd) {
        const chunkStartSeconds = mediaChunkStart / 1000;
        const chunkEndSeconds = mediaChunkEnd / 1000;
        return start >= chunkStartSeconds  && end <= chunkEndSeconds;
    } else {
        return true;
    }
};

const TestApp = (): ReactElement => {
    const dispatch = useAppDispatch();
    const [ saveState, setSaveState ] = useState<SaveState>("NONE");
    const [ videoUrl, setVideoUrl ] = useState<string | null>(null);
    const [ showUrlDialog, setShowUrlDialog ] = useState(false);
    const [ urlInput, setUrlInput ] = useState('');

    // ################################## Video Loading ###########################################
    useEffect(() => {
        const unsubscribeLocal = window.electronAPI.onVideoLoadLocal((filePath) => {
            const normalized = filePath.replace(/\\/g, '/');
            setVideoUrl(`local-video://${normalized}`);
        });

        const unsubscribeOnline = window.electronAPI.onMenuLoadVideoOnline(() => {
            setShowUrlDialog(true);
        });

        return () => {
            unsubscribeLocal();
            unsubscribeOnline();
        };
    }, []);

    const handleUrlDialogLoad = () => {
        const url = urlInput.trim();
        if (url) {
            setVideoUrl(url);
            setUrlInput('');
            setShowUrlDialog(false);
        }
    };

    // ################################## Source Cues ###########################################
    useEffect(() => {
        if (!videoUrl) return;
        if (trackType === "TRANSLATION") {
            const sourceCues = [] as CueDto[];

            if (TIME_MATCH_TESTING) {
                sourceCues.push({
                    id: "cue-src-1000001",
                    vttCue: new VTTCue(0, 1, "text"),
                    cueCategory: "DIALOGUE",
                    editDisabled: !inChunkRange(0, 1)
                });
                sourceCues.push({
                    id: "cue-src-1000002",
                    vttCue: new VTTCue(1, 2, "text"),
                    cueCategory: "DIALOGUE",
                    editDisabled: !inChunkRange(1, 2)
                });
                sourceCues.push({
                    id: "cue-src-1000003",
                    vttCue: new VTTCue(2, 3, "text"),
                    cueCategory: "DIALOGUE",
                    editDisabled: !inChunkRange(2, 3)
                });
                sourceCues.push({
                    id: "cue-src-1000004",
                    vttCue: new VTTCue(3, 6, "text"),
                    cueCategory: "DIALOGUE",
                    editDisabled: !inChunkRange(3, 6)
                });

                sourceCues.push({
                    id: "cue-src-1000005",
                    vttCue: new VTTCue(7.673, 10.208, "text"),
                    cueCategory: "DIALOGUE",
                    editDisabled: !inChunkRange(7.673, 10.208)
                });
                sourceCues.push({
                    id: "cue-src-1000006",
                    vttCue: new VTTCue(10.746, 11.782, "text"),
                    cueCategory: "DIALOGUE",
                    editDisabled: !inChunkRange(10.746, 11.782)
                });
                sourceCues.push({
                    id: "cue-src-1000007",
                    vttCue: new VTTCue(12.504, 14.768, "text"),
                    cueCategory: "DIALOGUE",
                    editDisabled: !inChunkRange(12.504, 14.768)
                });
                sourceCues.push({
                    id: "cue-src-1000008",
                    vttCue: new VTTCue(15.169, 17.110, "text"),
                    cueCategory: "DIALOGUE",
                    editDisabled: !inChunkRange(15.169, 17.110)
                });

                sourceCues.push({
                    id: "cue-src-1000009",
                    vttCue: new VTTCue(18.954, 20.838, "text"),
                    cueCategory: "DIALOGUE",
                    editDisabled: !inChunkRange(18.954, 20.838)
                });
                sourceCues.push({
                    id: "cue-src-1000001",
                    vttCue: new VTTCue(21.674, 23.656, "text"),
                    cueCategory: "DIALOGUE",
                    editDisabled: !inChunkRange(21.674, 23.656)
                });
                sourceCues.push({
                    id: "cue-src-1000010",
                    vttCue: new VTTCue(24.024, 24.504, "text"),
                    cueCategory: "DIALOGUE",
                    editDisabled: !inChunkRange(24.024, 24.504)
                });
                sourceCues.push({
                    id: "cue-src-1000011",
                    vttCue: new VTTCue(25.383, 28.115, "text"),
                    cueCategory: "DIALOGUE",
                    editDisabled: !inChunkRange(25.383, 28.115)
                });
            }

            let endTime = START_SHIFT;
            for (let idx = 0; idx < 9999; idx++) {
                const randomStart = TIME_MATCH_TESTING ? endTime + randomTime(1) : idx * 3;
                const randomEnd = endTime = TIME_MATCH_TESTING ? randomStart + randomTime(3) : (idx + 1) * 3;
                const withinChunkRange = inChunkRange(randomStart, randomEnd);
                sourceCues.push({
                    id: `cue-src-${idx}`,
                    vttCue: new VTTCue(randomStart, randomEnd, `<i>Source <b>Line</b></i> ${idx + 1}\nWrapped text.`),
                    cueCategory: "DIALOGUE",
                    editDisabled: !withinChunkRange,
                    glossaryMatches: [
                        { source: "text", replacements: ["text replacement1", "text replacement2"]},
                        { source: "line", replacements: ["lineReplacement1"]}
                    ]
                });
            }


            const timer = setTimeout( // this simulates latency caused by server roundtrip
                () => dispatch(updateSourceCues(sourceCues)),
                500
            );
            return () => clearTimeout(timer);
        }
    }, [dispatch, videoUrl]);

    // ################################## Target Cues ###########################################
    useEffect(() => {
        if (!videoUrl) return;
        const targetCues = [] as CueDto[];
        if (TIME_MATCH_TESTING) {
            targetCues.push({
                id: "cue-trg-1000001",
                vttCue: new VTTCue(0, 3, "text"),
                cueCategory: "DIALOGUE",
                editDisabled: !inChunkRange(0, 3)
            });
            targetCues.push({
                id: "cue-trg-1000002",
                vttCue: new VTTCue(3, 4, "text"),
                cueCategory: "DIALOGUE",
                editDisabled: !inChunkRange(3, 4)
            });
            targetCues.push({
                id: "cue-trg-1000003",
                vttCue: new VTTCue(4, 5, "text"),
                cueCategory: "DIALOGUE",
                editDisabled: !inChunkRange(4, 5)
            });
            targetCues.push({
                id: "cue-trg-1000004",
                vttCue: new VTTCue(5, 6, "text"),
                cueCategory: "DIALOGUE",
                editDisabled: !inChunkRange(5, 6)
            });

            targetCues.push({
                id: "cue-trg-1000005",
                vttCue: new VTTCue(7.087, 10.048, "text"),
                cueCategory: "DIALOGUE",
                editDisabled: !inChunkRange(7.087, 10.048)
            });
            targetCues.push({
                id: "cue-trg-1000006",
                vttCue: new VTTCue(10.411, 11.231, "text"),
                cueCategory: "DIALOGUE",
                editDisabled: !inChunkRange(10.411, 11.231)
            });
            targetCues.push({
                id: "cue-trg-1000007",
                vttCue: new VTTCue(11.240, 13.985, "text"),
                cueCategory: "DIALOGUE",
                editDisabled: !inChunkRange(11.240, 13.985)
            });
            targetCues.push({
                id: "cue-trg-1000008",
                vttCue: new VTTCue(14.380, 16.998, "text"),
                cueCategory: "DIALOGUE",
                editDisabled: !inChunkRange(14.380, 16.998)
            });

            targetCues.push({
                id: "cue-trg-1000009",
                vttCue: new VTTCue(20.140, 21.494, "text"),
                cueCategory: "DIALOGUE",
                editDisabled: !inChunkRange(20.140, 21.494)
            });
            targetCues.push({
                id: "cue-trg-1000010",
                vttCue: new VTTCue(21.979, 22.055, "text"),
                cueCategory: "DIALOGUE",
                editDisabled: !inChunkRange(21.979, 22.055)
            });
            targetCues.push({
                id: "cue-trg-1000011",
                vttCue: new VTTCue(22.414, 25.209, "text"),
                cueCategory: "DIALOGUE",
                editDisabled: !inChunkRange(22.414, 25.209)
            });
            targetCues.push({
                id: "cue-trg-1000012",
                vttCue: new VTTCue(26.198, 27.412, "text"),
                cueCategory: "DIALOGUE",
                editDisabled: !inChunkRange(26.198, 27.412)
            });
        }

        let endTime = START_SHIFT;
        for (let idx = 0; idx < 9999; idx++) {
            const randomContent = Math.random().toString(36).slice(Math.floor(Math.random() * 10));
            let text = `<i>Editing <b>Line</b></i> ${idx + 1}\n${randomContent} Wrapped text and text a text`;
            if (language.id === "ar-SA") {
                text = `<b>مرحبًا</b> أيها العالم ${idx + 1}.`;
            }
            const randomStart = (TIME_MATCH_TESTING ? endTime + randomTime(1) : idx * 3);
            const randomEnd = endTime = TIME_MATCH_TESTING ? randomStart + randomTime(3) : (idx + 1) * 3;
            const withinChunkRange = inChunkRange(randomStart, randomEnd);
            const comments = [];
            const randomComments = Math.random() * 4;
            for (let i = 1; i <= randomComments; i++) {
                const isLinguist = Math.random() < 0.5;
                const commentDate = isLinguist ? "2021-08-06T19:49:44.493Z" : "2021-08-08T14:02:20.100Z";
                comments.push({
                    userId: isLinguist ? "jane.doe" : "other.user",
                    author: isLinguist ? "Reviewer": "Linguist",
                    comment: "this is a comment " + i,
                    date: commentDate
                });
            }
            targetCues.push({
                id: `cue-trg-${idx}`,
                vttCue: new VTTCue(randomStart, randomEnd, text),
                cueCategory: "DIALOGUE",
                editDisabled: !withinChunkRange,
                errors: null,
                comments
            });
        }

        const timer = setTimeout( // this simulates latency caused by server roundtrip
            () => dispatch(updateCues(targetCues)),
            500
        );
        return () => clearTimeout(timer);
    }, [dispatch, videoUrl]);

    // ################################## Track ###########################################
    useEffect(() => {
        if (!videoUrl) return;
        const timer = setTimeout( // this simulates latency caused by server roundtrip
            () => dispatch(updateEditingTrack({
                type: trackType,
                language: language,
                sourceLanguage,
                default: true,
                mediaTitle: "This is the video title",
                mediaLength: 3612542,
                mediaChunkStart,
                mediaChunkEnd,
                progress: 50,
                id: "0fd7af04-6c87-4793-8d66-fdb19b5fd04d",
                createdBy: {
                    displayName: "John Doe",
                    email: "john.doe@gmail.com",
                    firstname: "John",
                    lastname: "Doe",
                    systemAdmin: "",
                    userId: "john.doe"
                }
            } as Track)),
            500
        );
        return () => clearTimeout(timer);
    }, [dispatch, videoUrl]);

    // ################################## User ###########################################
    useEffect(() => {
        if (!videoUrl) return;
        const captionUser = {
            displayName: "Jane Doe",
            email: "jane.doe@gmail.com",
            firstname: "Jane",
            lastname: "Doe",
            systemAdmin: "",
            userId: "jane.doe"
        } as User;
        const timer = setTimeout(
            () => dispatch(updateCaptionUser(captionUser)),
            500
        );
        return () => clearTimeout(timer);
    }, [dispatch, videoUrl]);

    // ################################## Caption Specs ###########################################
    // readCaptionSpecification is not available in the library's Actions export
    // useEffect(() => {
    //     setTimeout( // this simulates latency caused by server roundtrip
    //         () => dispatch(readCaptionSpecification({
    //             captionSpecificationId: "3f458b11-2996-41f5-8f22-0114c7bc84db",
    //             projectId: "68ed2f59-c5c3-4956-823b-d1f9f26585fb",
    //             enabled: true,
    //             audioDescription: false,
    //             onScreenText: true,
    //             spokenAudio: false,
    //             speakerIdentification: "NUMBERED",
    //             dialogueStyle: "DOUBLE_CHEVRON",
    //             maxLinesPerCaption: 2,
    //             maxCharactersPerLine: 40,
    //             minCaptionDurationInMillis: MIN_DURATION_SECONDS * 1000,
    //             maxCaptionDurationInMillis: 8000,
    //             maxCharactersPerSecondPerCaption: 50,
    //             comments: "Media comments, please click [here](https://google.com)",
    //             mediaNotes: "Media notes, please click [here](https://google.com)"
    //         })),
    //         500
    //     );
    // }, [dispatch]);

    const urlDialogFooter = (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <Button label="Cancel" className="p-button-text" onClick={() => { setShowUrlDialog(false); setUrlInput(''); }} />
            <Button label="Load" onClick={handleUrlDialogLoad} disabled={!urlInput.trim()} />
        </div>
    );

    return (
        <>
            <Dialog
                header="Load Online Video"
                visible={showUrlDialog}
                onHide={() => { setShowUrlDialog(false); setUrlInput(''); }}
                footer={urlDialogFooter}
                style={{ width: '520px' }}
            >
                <InputText
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleUrlDialogLoad(); }}
                    placeholder="https://example.com/video.mp4"
                    style={{ width: '100%' }}
                    autoFocus
                />
            </Dialog>

            {!videoUrl ? (
                <VideoDropZone onVideoLoaded={setVideoUrl} />
            ) : (
                <ManuCap
                    key={videoUrl}
                    mp4={videoUrl}
                    poster=""
                    onViewTrackHistory={(): void => undefined}
                    onSave={(): void => {
                        setTimeout(() => setSaveState("TRIGGERED"), 1);
                        setTimeout(() => setSaveState("SAVED"), 500);
                    }}
                    onUpdateCue={(): void => {
                        setTimeout(() => setSaveState("TRIGGERED"), 1);
                        setTimeout(() => setSaveState("SAVED"), 500);
                    }}
                    onDeleteCue={(): void => {
                        setTimeout(() => setSaveState("TRIGGERED"), 1);
                        setTimeout(() => setSaveState("SAVED"), 500);
                    }}
                    onComplete={(): void => undefined}
                    onExportSourceFile={(): void => undefined}
                    onExportFile={(): void => undefined}
                    onImportFile={(): void => undefined}
                    spellCheckerDomain="dev-spell-checker.videotms.com"
                    commentAuthor="Linguist"
                    saveState={saveState}
                />
            )}
        </>
    );
};

export default TestApp