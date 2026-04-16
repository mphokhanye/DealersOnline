import { useState, useCallback } from "react";
import { Landing } from "@/components/drive/Landing";
import { LoadingScreen } from "@/components/drive/LoadingScreen";
import { Profiling } from "@/components/drive/Profiling";
import { NeedsAnalysis } from "@/components/drive/NeedsAnalysis";
import { Prequal } from "@/components/drive/Prequal";
import { VehicleSearch } from "@/components/drive/VehicleSearch";

type Screen = "landing" | "loading" | "profiling" | "needs" | "prequal" | "vehicleSearch";

const Index = () => {
  const [screen, setScreen] = useState<Screen>("landing");
  const [ctx, setCtx] = useState<Record<string, any>>({});

  const nav = useCallback((to: string, data: Record<string, unknown> = {}) => {
    setCtx(c => ({ ...c, ...data }));
    setScreen(to as Screen);
  }, []);

  const handleLoadingComplete = useCallback(() => {
    setScreen("profiling");
  }, []);

  switch (screen) {
    case "landing":
      return <Landing onNav={nav} />;
    case "loading":
      return <LoadingScreen onComplete={handleLoadingComplete} />;
    case "profiling":
      return <Profiling query={ctx.query || ""} onNav={nav} />;
    case "needs":
      return <NeedsAnalysis query={ctx.query || ""} answers={ctx.answers || {}} onNav={nav} />;
    case "prequal":
      return <Prequal query={ctx.query || ""} answers={ctx.answers || {}} na={ctx.na || {}} onNav={nav} />;
    case "vehicleSearch":
      return <VehicleSearch query={ctx.query || ""} answers={ctx.answers || {}} na={ctx.na || {}} prequalified={ctx.prequalified || false} monthly={ctx.monthly} onNav={nav} />;
    default:
      return <Landing onNav={nav} />;
  }
};

export default Index;
