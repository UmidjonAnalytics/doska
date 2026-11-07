import { randomId } from "@excalidraw/common";

import { STORAGE_KEYS } from "../app_constants";
import { LocalData } from "../data/LocalData";

// Multiple boards on top of Excalidraw's single local scene.
//
// The active board always lives in the regular storage keys
// (STORAGE_KEYS.LOCAL_STORAGE_ELEMENTS / _APP_STATE), so the rest of the app
// works unchanged. Inactive boards are parked under `doska-board:<id>`.
// Image files stay in the shared IndexedDB file store, keyed by file id.

export type Board = {
  id: string;
  name: string;
  createdAt: number;
};

type BoardSnapshot = {
  elements: string | null;
  appState: string | null;
};

const KEYS = {
  boards: "doska-boards",
  active: "doska-active-board",
  snapshot: (id: string) => `doska-board:${id}`,
};

const read = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key: string, value: unknown) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// --- boards -------------------------------------------------------------------

/** Board list; the first visit creates "Doska 1" around the existing scene. */
export const loadBoards = (defaultName: (n: number) => string): Board[] => {
  let boards = read<Board[]>(KEYS.boards, []);
  if (!boards.length) {
    boards = [{ id: randomId(), name: defaultName(1), createdAt: Date.now() }];
    write(KEYS.boards, boards);
    write(KEYS.active, boards[0].id);
  }
  return boards;
};

export const getActiveBoardId = (boards: Board[]): string => {
  const id = read<string | null>(KEYS.active, null);
  return boards.some((board) => board.id === id) ? id! : boards[0].id;
};

const parkActiveBoard = (activeId: string) => {
  // write any pending edits into the regular keys, then stop the app from
  // writing the old scene back while we swap
  LocalData.flushSave();
  LocalData.pauseSave("collaboration");
  const snapshot: BoardSnapshot = {
    elements: localStorage.getItem(STORAGE_KEYS.LOCAL_STORAGE_ELEMENTS),
    appState: localStorage.getItem(STORAGE_KEYS.LOCAL_STORAGE_APP_STATE),
  };
  write(KEYS.snapshot(activeId), snapshot);
};

const activate = (id: string, snapshot: BoardSnapshot | null) => {
  const restore = (key: string, value: string | null | undefined) =>
    value ? localStorage.setItem(key, value) : localStorage.removeItem(key);
  restore(STORAGE_KEYS.LOCAL_STORAGE_ELEMENTS, snapshot?.elements);
  restore(STORAGE_KEYS.LOCAL_STORAGE_APP_STATE, snapshot?.appState);
  localStorage.removeItem(KEYS.snapshot(id));
  write(KEYS.active, id);
  // a fresh load is the simplest way to bring every part of the app
  // (scene, files, history, other tabs) in line with the new board
  window.location.reload();
};

export const switchBoard = (boards: Board[], targetId: string) => {
  const activeId = getActiveBoardId(boards);
  if (targetId === activeId) {
    return;
  }
  parkActiveBoard(activeId);
  activate(targetId, read<BoardSnapshot | null>(KEYS.snapshot(targetId), null));
};

/** Creates a new empty board and opens it. */
export const createBoard = (boards: Board[], name: string) => {
  const board: Board = { id: randomId(), name, createdAt: Date.now() };
  parkActiveBoard(getActiveBoardId(boards));
  write(KEYS.boards, [...boards, board]);
  activate(board.id, null);
};

/** Deletes the active board and opens the next one. */
export const deleteActiveBoard = (boards: Board[]) => {
  if (boards.length <= 1) {
    return;
  }
  const activeId = getActiveBoardId(boards);
  const remaining = boards.filter((board) => board.id !== activeId);
  LocalData.flushSave();
  LocalData.pauseSave("collaboration");
  write(KEYS.boards, remaining);
  const next = remaining[0];
  activate(next.id, read<BoardSnapshot | null>(KEYS.snapshot(next.id), null));
};
