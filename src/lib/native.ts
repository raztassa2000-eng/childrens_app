import { Capacitor } from "@capacitor/core";
import { Haptics, ImpactStyle, NotificationType } from "@capacitor/haptics";
import { audioContext } from "../engine/audio";

/** Small native touches for the iPhone app; harmless no-ops on the web. */

export const isNative = Capacitor.isNativePlatform();

export const haptic = {
  tap() {
    if (isNative) void Haptics.impact({ style: ImpactStyle.Light }).catch(() => undefined);
  },
  success() {
    if (isNative) void Haptics.notification({ type: NotificationType.Success }).catch(() => undefined);
  },
  oops() {
    if (isNative) void Haptics.notification({ type: NotificationType.Warning }).catch(() => undefined);
  },
};

/** Browsers only allow sound after a tap, so unlock audio on the very first one. */
export function unlockAudioOnFirstTap() {
  const unlock = () => {
    audioContext();
    window.removeEventListener("pointerdown", unlock);
    window.removeEventListener("keydown", unlock);
  };
  window.addEventListener("pointerdown", unlock);
  window.addEventListener("keydown", unlock);
}
