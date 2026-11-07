import {
  checkIcon,
  PlusIcon,
  TrashIcon,
} from "@excalidraw/excalidraw/components/icons";
import { MainMenu } from "@excalidraw/excalidraw/index";
import React, { useState } from "react";

import {
  createBoard,
  deleteActiveBoard,
  getActiveBoardId,
  loadBoards,
  switchBoard,
} from "./boards";
import { useDoskaT } from "./strings";

// keeps inactive board names aligned with the checked one
const blankIcon = <svg aria-hidden="true" />;

/** "Doskalarim" section of the main menu. */
export const BoardsMenu = () => {
  const { dt } = useDoskaT();
  const [boards] = useState(() => loadBoards((n) => dt("boardN", { n })));
  const activeId = getActiveBoardId(boards);

  const onNewBoard = () =>
    createBoard(boards, dt("boardN", { n: boards.length + 1 }));

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
      <MainMenu.Item icon={PlusIcon} onSelect={onNewBoard}>
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
    </MainMenu.Group>
  );
};
