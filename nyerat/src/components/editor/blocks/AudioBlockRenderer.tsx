import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import RecordPlugin from "wavesurfer.js/dist/plugins/record.esm.js";
import { Mic, Square, Play, Pause, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadToBucket } from "@/lib/upload";
import { useWorkspaceStore } from "@/stores/useWorkspaceStore";
import { toast } from "sonner";

interface Props {
  url: string;
  duration: number;
  fileName: string;
  pageId: string;
  onChange: (props: { url: string; duration: number; fileName: string }) => void;
  editable: boolean;
}

function fmt(s: number) {
  if (!isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const ss = Math.floor(s % 60);
  return `${String(m).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}

export function AudioBlockRenderer({ url, duration, fileName, pageId, onChange, editable }: Props) {
  const { activeWorkspace } = useWorkspaceStore();
  const recContainerRef = useRef<HTMLDivElement | null>(null);
  const playContainerRef = useRef<HTMLDivElement | null>(null);
  const recWsRef = useRef<WaveSurfer | null>(null);
  const recPluginRef = useRef<RecordPlugin | null>(null);
  const playWsRef = useRef<WaveSurfer | null>(null);

  const [recording, setRecording] = useState(false);
  const [recTime, setRecTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [rate, setRate] = useState(1);
  const [uploading, setUploading] = useState(false);

  // Init recording surfer once
  useEffect(() => {
    if (url || !recContainerRef.current) return;
    const ws = WaveSurfer.create({
      container: recContainerRef.current,
      waveColor: "#a5b4fc",
      progressColor: "#4f46e5",
      height: 48,
      barWidth: 2,
    });
    const rec = ws.registerPlugin(
      RecordPlugin.create({ scrollingWaveform: true, renderRecordedAudio: false })
    );
    rec.on("record-progress", (ms: number) => setRecTime(ms / 1000));
    rec.on("record-end", async (blob: Blob) => {
      if (!activeWorkspace) return;
      setUploading(true);
      try {
        const ext = blob.type.includes("mp4") ? "m4a" : "webm";
        const file = new File([blob], `voice-${Date.now()}.${ext}`, { type: blob.type });
        const signed = await uploadToBucket(
          "audio-recordings",
          activeWorkspace.id,
          pageId,
          file
        );
        onChange({ url: signed, duration: recTime, fileName: file.name });
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    });
    recWsRef.current = ws;
    recPluginRef.current = rec;
    return () => {
      ws.destroy();
      recWsRef.current = null;
      recPluginRef.current = null;
    };
  }, [url, activeWorkspace, pageId, onChange, recTime]);

  // Init playback surfer
  useEffect(() => {
    if (!url || !playContainerRef.current) return;
    const ws = WaveSurfer.create({
      container: playContainerRef.current,
      waveColor: "#a5b4fc",
      progressColor: "#4f46e5",
      cursorColor: "#4f46e5",
      height: 48,
      barWidth: 2,
      url,
    });
    ws.on("audioprocess", (t: number) => setCurrent(t));
    ws.on("finish", () => setPlaying(false));
    ws.on("seeking", (t: number) => setCurrent(t));
    playWsRef.current = ws;
    return () => {
      ws.destroy();
      playWsRef.current = null;
    };
  }, [url]);

  useEffect(() => {
    playWsRef.current?.setPlaybackRate(rate);
  }, [rate]);

  const startRecord = async () => {
    if (!recPluginRef.current) return;
    try {
      const mime = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/mp4";
      await recPluginRef.current.startRecording({ deviceId: undefined as never, mimeType: mime } as never);
      setRecording(true);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Mic permission denied");
    }
  };

  const stopRecord = () => {
    recPluginRef.current?.stopRecording();
    setRecording(false);
  };

  const togglePlay = () => {
    if (!playWsRef.current) return;
    playWsRef.current.playPause();
    setPlaying(playWsRef.current.isPlaying());
  };

  if (!url) {
    return (
      <div className="my-2 rounded-lg border border-border bg-card p-3">
        <div ref={recContainerRef} className="mb-2 min-h-[48px]" />
        <div className="flex items-center gap-2">
          {!recording ? (
            <Button size="sm" variant="outline" onClick={startRecord} disabled={!editable || uploading}>
              <Mic className="mr-1 h-3.5 w-3.5" /> {uploading ? "Saving…" : "Click to record"}
            </Button>
          ) : (
            <>
              <Button size="sm" variant="destructive" onClick={stopRecord}>
                <Square className="mr-1 h-3.5 w-3.5" /> Stop
              </Button>
              <span className="flex items-center gap-1.5 text-xs">
                <span className="h-2 w-2 animate-pulse rounded-full bg-destructive" />
                {fmt(recTime)}
              </span>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="my-2 rounded-lg border border-border bg-card p-3">
      <div ref={playContainerRef} className="mb-2 min-h-[48px]" />
      <div className="flex items-center gap-2 text-xs">
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={togglePlay}>
          {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        </Button>
        <span className="text-muted-foreground">
          {fmt(current)} / {fmt(duration)}
        </span>
        <span className="flex-1 truncate text-muted-foreground">{fileName}</span>
        <select
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
          className="rounded border bg-background px-1.5 py-0.5 text-xs"
          aria-label="Playback speed"
        >
          {[0.5, 0.75, 1, 1.25, 1.5, 2].map((r) => (
            <option key={r} value={r}>
              {r}x
            </option>
          ))}
        </select>
        <a href={url} target="_blank" rel="noreferrer" download={fileName}>
          <Button size="icon" variant="ghost" className="h-8 w-8">
            <Download className="h-3.5 w-3.5" />
          </Button>
        </a>
      </div>
    </div>
  );
}
