import { azaharDay } from "@/templates/classic/spanish/azahar-day";
import { basslineDay } from "@/templates/genz/ukblack/bassline-day";
import { compasDay } from "@/templates/modern/spanish/compas-day";
import { covenantDay } from "@/templates/classic/afroamerican/covenant-day";
import { duendeDay } from "@/templates/hubble/spanish/duende-day";
import { ellingtonDay } from "@/templates/hubble/ukblack/ellington-day";
import { fandangoDay } from "@/templates/modern/mexican/fandango-day";
import { flurryDay } from "@/templates/modern/canadian/flurry-day";
import { goldhourDay } from "@/templates/hubble/canadian/goldhour-day";
import { jaleoDay } from "@/templates/genz/spanish/jaleo-day";
import { kindlingDay } from "@/templates/genz/canadian/kindling-day";
import { legacyDay } from "@/templates/classic/afroamerican/legacy-day";
import { miradorDay } from "@/templates/hubble/mexican/mirador-day";
import { monarchDay } from "@/templates/modern/ukblack/monarch-day";
import { northlightDay } from "@/templates/hubble/canadian/northlight-day";
import { nottingDay } from "@/templates/genz/ukblack/notting-day";
import { paseoDay } from "@/templates/genz/mexican/paseo-day";
import { plungeDay } from "@/templates/genz/canadian/plunge-day";
import { rippleDay } from "@/templates/genz/canadian/ripple-day";
import { sageDay } from "@/templates/hubble/afroamerican/sage-day";
import { saltlineDay } from "@/templates/classic/canadian/saltline-day";
import { secondlineDay } from "@/templates/genz/afroamerican/secondline-day";
import { shutterDay } from "@/templates/genz/canadian/shutter-day";
import { skyburstDay } from "@/templates/genz/afroamerican/skyburst-day";
import { soleraDay } from "@/templates/classic/mexican/solera-day";
import { starfallDay } from "@/templates/modern/canadian/starfall-day";
import { strideDay } from "@/templates/modern/afroamerican/stride-day";
import { talaveraDay } from "@/templates/genz/mexican/talavera-day";
import { velaDay } from "@/templates/genz/spanish/vela-day";
import { vestryDay } from "@/templates/classic/ukblack/vestry-day";
import { toContent, type WeddingContent, type WeddingDay } from "./types";

/** Every themed demo pack, keyed by meta.id */
export const catalog: Record<string, WeddingDay | (typeof saltlineDay)> = {
  [vestryDay.meta.id]: vestryDay,
  [ellingtonDay.meta.id]: ellingtonDay,
  [monarchDay.meta.id]: monarchDay,
  [basslineDay.meta.id]: basslineDay,
  [nottingDay.meta.id]: nottingDay,
  [legacyDay.meta.id]: legacyDay,
  [covenantDay.meta.id]: covenantDay,
  [sageDay.meta.id]: sageDay,
  [strideDay.meta.id]: strideDay,
  [skyburstDay.meta.id]: skyburstDay,
  [secondlineDay.meta.id]: secondlineDay,
  [azaharDay.meta.id]: azaharDay,
  [duendeDay.meta.id]: duendeDay,
  [compasDay.meta.id]: compasDay,
  [velaDay.meta.id]: velaDay,
  [jaleoDay.meta.id]: jaleoDay,
  [soleraDay.meta.id]: soleraDay,
  [miradorDay.meta.id]: miradorDay,
  [fandangoDay.meta.id]: fandangoDay,
  [paseoDay.meta.id]: paseoDay,
  [talaveraDay.meta.id]: talaveraDay,
  [kindlingDay.meta.id]: kindlingDay,
  [plungeDay.meta.id]: plungeDay,
  [rippleDay.meta.id]: rippleDay,
  [shutterDay.meta.id]: shutterDay,
  [flurryDay.meta.id]: flurryDay,
  [starfallDay.meta.id]: starfallDay,
  [goldhourDay.meta.id]: goldhourDay,
  [northlightDay.meta.id]: northlightDay,
  [saltlineDay.meta.id]: saltlineDay,
};

export function contentPack(id: string): WeddingContent | null {
  const day = catalog[id];
  if (!day || !("first" in day) || typeof day.first !== "string") return null;
  return toContent(day as WeddingDay);
}
