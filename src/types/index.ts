export interface Card {
  id: string;
  title: string;
  description?: string;
}

export interface Column {
  id: string;
  title: string;
  cardIds: string[];
}

export interface Board {
  columns: Column[];
  cards: Record<string, Card>;
}

export const createDefaultBoard = (): Board => ({
  columns: [
    { id: 'todo', title: 'To Do', cardIds: [] },
    { id: 'in-progress', title: 'In Progress', cardIds: [] },
    { id: 'done', title: 'Done', cardIds: [] },
  ],
  cards: {},
});
