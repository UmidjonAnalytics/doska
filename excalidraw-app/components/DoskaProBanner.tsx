import { PlusPromoIcon } from "@excalidraw/excalidraw/components/icons";

import { useAtomValue, useSetAtom } from "../app-jotai";
import { proStatusAtom } from "../doska/boards";
import { proDialogAtom } from "../doska/ProDialog";
import { useDoskaT } from "../doska/strings";

/** Top-right "Doska Pro" button (replaces the Excalidraw+ banner). */
export const DoskaProBanner = () => {
  const { dt } = useDoskaT();
  const isPro = useAtomValue(proStatusAtom);
  const setProDialog = useSetAtom(proDialogAtom);
  if (isPro) {
    return null;
  }
  return (
    <button
      type="button"
      className="plus-banner"
      onClick={() => setProDialog({ isOpen: true, reason: "menu" })}
    >
      <span className="plus-banner__icon">{PlusPromoIcon}</span>
      <span className="plus-banner__text">
        <span className="plus-banner__title">{dt("upgrade")}</span>
      </span>
    </button>
  );
};
