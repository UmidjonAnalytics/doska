import { Dialog } from "@excalidraw/excalidraw/components/Dialog";
import { FilledButton } from "@excalidraw/excalidraw/components/FilledButton";
import { checkIcon } from "@excalidraw/excalidraw/components/icons";
import React from "react";

import { atom, useAtom, useAtomValue } from "../app-jotai";

import { proStatusAtom } from "./boards";
import { FREE_BOARD_LIMIT, PRO_CHECKOUT_URL } from "./config";
import { useDoskaT } from "./strings";

import "./doska.scss";

export type ProDialogState =
  | { isOpen: false }
  | { isOpen: true; reason: "limit" | "menu" };

export const proDialogAtom = atom<ProDialogState>({ isOpen: false });

export const ProDialog = () => {
  const [state, setState] = useAtom(proDialogAtom);
  const isPro = useAtomValue(proStatusAtom);
  const { dt, price } = useDoskaT();

  if (!state.isOpen) {
    return null;
  }
  const close = () => setState({ isOpen: false });

  return (
    <Dialog
      size="small"
      onCloseRequest={close}
      title={dt("proTitle")}
      className="doska-pro-dialog"
    >
      {state.reason === "limit" && !isPro && (
        <p className="doska-pro-dialog__notice">
          {dt("limitReached", { limit: FREE_BOARD_LIMIT })}
        </p>
      )}

      <div className="doska-pro-dialog__plans">
        <div className="doska-plan">
          <div className="doska-plan__name">{dt("freePlan")}</div>
          <div className="doska-plan__desc">
            {dt("freePlanDesc", { limit: FREE_BOARD_LIMIT })}
          </div>
          {!isPro && (
            <div className="doska-plan__current">{dt("currentPlan")}</div>
          )}
        </div>
        <div className="doska-plan doska-plan--pro">
          <div className="doska-plan__name">
            {dt("pro")}{" "}
            <span className="doska-pro-badge">{dt("proBadge")}</span>
          </div>
          <div className="doska-plan__price">{price}</div>
          <div className="doska-plan__desc">{dt("proPitch")}</div>
          <ul className="doska-plan__features">
            {(
              ["featureUnlimited", "featureSwitch", "featureSupport"] as const
            ).map((key) => (
              <li key={key}>
                <span className="doska-plan__check">{checkIcon}</span>
                {dt(key)}
              </li>
            ))}
          </ul>
          {isPro && (
            <div className="doska-plan__current">{dt("youArePro")}</div>
          )}
        </div>
      </div>

      {!isPro && (
        <div className="doska-pro-dialog__actions">
          {PRO_CHECKOUT_URL ? (
            <FilledButton
              size="large"
              fullWidth
              label={dt("upgrade")}
              onClick={() => {
                window.open(PRO_CHECKOUT_URL, "_blank", "noopener");
              }}
            />
          ) : (
            <p className="doska-pro-dialog__soon">{dt("comingSoon")}</p>
          )}
          <FilledButton
            variant="outlined"
            color="muted"
            fullWidth
            label={dt("close")}
            onClick={close}
          />
        </div>
      )}
    </Dialog>
  );
};
