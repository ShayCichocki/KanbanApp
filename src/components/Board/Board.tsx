import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Column } from '../Column/Column';
import { Card } from '../Card/Card';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import type { Board as BoardType, Card as CardType } from '../../types';
import { createDefaultBoard } from '../../types';
import styles from './Board.module.css';

export function Board() {
  const [board, setBoard] = useLocalStorage<BoardType>('kanban-board', createDefaultBoard());
  const [activeCard, setActiveCard] = useState<CardType | null>(null);
  const [newColumnTitle, setNewColumnTitle] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const findColumnByCardId = (cardId: string) => {
    return board.columns.find((col) => col.cardIds.includes(cardId));
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const card = board.cards[active.id as string];
    if (card) {
      setActiveCard(card);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeColumn = findColumnByCardId(activeId);
    const overColumn = findColumnByCardId(overId) || board.columns.find((col) => col.id === overId);

    if (!activeColumn || !overColumn || activeColumn.id === overColumn.id) return;

    setBoard((prev) => {
      const activeCardIds = [...activeColumn.cardIds];
      const overCardIds = activeColumn.id === overColumn.id ? activeCardIds : [...overColumn.cardIds];

      const activeIndex = activeCardIds.indexOf(activeId);
      activeCardIds.splice(activeIndex, 1);

      const overIndex = overColumn.cardIds.indexOf(overId);
      const newIndex = overIndex >= 0 ? overIndex : overCardIds.length;
      overCardIds.splice(newIndex, 0, activeId);

      return {
        ...prev,
        columns: prev.columns.map((col) => {
          if (col.id === activeColumn.id) {
            return { ...col, cardIds: activeCardIds };
          }
          if (col.id === overColumn.id) {
            return { ...col, cardIds: overCardIds };
          }
          return col;
        }),
      };
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const activeColumn = findColumnByCardId(activeId);
    const overColumn = findColumnByCardId(overId) || board.columns.find((col) => col.id === overId);

    if (!activeColumn || !overColumn) return;

    if (activeColumn.id === overColumn.id) {
      setBoard((prev) => {
        const columnIndex = prev.columns.findIndex((col) => col.id === activeColumn.id);
        const cardIds = [...prev.columns[columnIndex].cardIds];
        const activeIndex = cardIds.indexOf(activeId);
        const overIndex = cardIds.indexOf(overId);

        if (activeIndex !== -1 && overIndex !== -1) {
          cardIds.splice(activeIndex, 1);
          cardIds.splice(overIndex, 0, activeId);
        }

        const newColumns = [...prev.columns];
        newColumns[columnIndex] = { ...newColumns[columnIndex], cardIds };

        return { ...prev, columns: newColumns };
      });
    }
  };

  const handleAddCard = (columnId: string, title: string) => {
    const cardId = generateId();
    setBoard((prev) => ({
      ...prev,
      cards: { ...prev.cards, [cardId]: { id: cardId, title } },
      columns: prev.columns.map((col) =>
        col.id === columnId ? { ...col, cardIds: [...col.cardIds, cardId] } : col
      ),
    }));
  };

  const handleEditCard = (cardId: string, title: string) => {
    setBoard((prev) => ({
      ...prev,
      cards: { ...prev.cards, [cardId]: { ...prev.cards[cardId], title } },
    }));
  };

  const handleDeleteCard = (cardId: string) => {
    setBoard((prev) => {
      const { [cardId]: _, ...remainingCards } = prev.cards;
      return {
        ...prev,
        cards: remainingCards,
        columns: prev.columns.map((col) => ({
          ...col,
          cardIds: col.cardIds.filter((id) => id !== cardId),
        })),
      };
    });
  };

  const handleEditColumn = (columnId: string, title: string) => {
    setBoard((prev) => ({
      ...prev,
      columns: prev.columns.map((col) =>
        col.id === columnId ? { ...col, title } : col
      ),
    }));
  };

  const handleDeleteColumn = (columnId: string) => {
    setBoard((prev) => {
      const column = prev.columns.find((col) => col.id === columnId);
      if (!column) return prev;

      const cardsToRemove = column.cardIds;
      const remainingCards = { ...prev.cards };
      cardsToRemove.forEach((id) => delete remainingCards[id]);

      return {
        ...prev,
        cards: remainingCards,
        columns: prev.columns.filter((col) => col.id !== columnId),
      };
    });
  };

  const handleAddColumn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColumnTitle.trim()) return;

    const columnId = generateId();
    setBoard((prev) => ({
      ...prev,
      columns: [...prev.columns, { id: columnId, title: newColumnTitle.trim(), cardIds: [] }],
    }));
    setNewColumnTitle('');
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className={styles.board}>
        {board.columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            cards={column.cardIds.map((id) => board.cards[id]).filter(Boolean)}
            onAddCard={handleAddCard}
            onEditCard={handleEditCard}
            onDeleteCard={handleDeleteCard}
            onEditColumn={handleEditColumn}
            onDeleteColumn={handleDeleteColumn}
          />
        ))}

        <form onSubmit={handleAddColumn} className={styles.addColumn}>
          <input
            type="text"
            value={newColumnTitle}
            onChange={(e) => setNewColumnTitle(e.target.value)}
            placeholder="Add column..."
            className={styles.input}
          />
          <button type="submit" className={styles.addButton}>
            +
          </button>
        </form>
      </div>

      <DragOverlay>
        {activeCard ? (
          <Card
            card={activeCard}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
