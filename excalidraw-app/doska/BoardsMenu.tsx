import {
  checkIcon,
  PlusIcon,
  TrashIcon,
} from "@excalidraw/excalidraw/components/icons";
import { MainMenu } from "@excalidraw/excalidraw/index";
import React, { useState } from "react";

import { useAtomValue, useSetAtom } from "../app-jotai";

import {
  canCreateBoard,
  createBoard,
  deleteActiveBoard,
  getActiveBoardId,
  loadBoards,
  proStatusAtom,
  switchBoard,
} from "./boards";
import { DoskaMark } from "./DoskaLogo";
import { proDialogAtom } from "./ProDialog";
import { useDoskaT } from "./strings";

// keeps inactive board names aligned with the checked one
const blankIcon = <svg aria-hidden="true" />;

/** "Doskalarim" section of the main menu. */
export const BoardsMenu = () => {
  const { dt } = useDoskaT();
  const setProDialog = useSetAtom(proDialogAtom);
  const isPro = useAtomValue(proStatusAtom);
  const [boards] = useState(() => loadBoards((n) => dt("boardN", { n })));
  const activeId = getActiveBoardId(boards);

  const onNewBoard = () => {
    if (!canCreateBoard(boards)) {
      setProDialog({ isOpen: true, reason: "limit" });
      return;
    }
    createBoard(boards, dt("boardN", { n: boards.length + 1 }));
  };

  return (
    <MainMenu.Group title={dt("myBoards")}>
      {boards.map((board) => (
        <MainMenu.Item
          key={board.id}
          icon={board.id === activeId ? checkIcon : blankIcon}
          selected={board.id === activeId}
          onSelect={() => switchBoard(boards, board.id)}
        >
          {board.name}
        </MainMenu.Item>
      ))}
      <MainMenu.Item
        icon={PlusIcon}
        onSelect={onNewBoard}
        badge={
          !isPro && !canCreateBoard(boards) ? (
            <span className="doska-pro-badge">PRO</span>
          ) : undefined
        }
      >
        {dt("newBoard")}
      </MainMenu.Item>
      {boards.length > 1 && (
        <MainMenu.Item
          icon={TrashIcon}
          onSelect={() => {
            const active = boards.find((board) => board.id === activeId);
            if (
              active &&
              window.confirm(dt("deleteBoardConfirm", { name: active.name }))
            ) {
              deleteActiveBoard(boards);
            }
          }}
        >
          {dt("deleteBoard")}
        </MainMenu.Item>
      )}
      {!isPro && (
        <MainMenu.Item
          icon={<DoskaMark size={16} />}
          onSelect={() => setProDialog({ isOpen: true, reason: "menu" })}
        >
          {dt("pro")}
        </MainMenu.Item>
      )}
    </MainMenu.Group>
  );
};
