import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card } from '../Card/Card';
import type { Column as ColumnType, Card as CardType, CardLabel } from '../../types';
import styles from './Column.module.css';

interface ColumnProps {
  column: ColumnType;
  cards: CardType[];
  onAddCard: (columnId: string, title: string) => void;
  onEditCard: (cardId: string, title: string) => void;
  onDeleteCard: (cardId: string) => void;
  onToggleCardLabel: (cardId: string, label: CardLabel) => void;
  onEditColumn: (columnId: string, title: string) => void;
  onDeleteColumn: (columnId: string) => void;
}

export function Column({
  column,
  cards,
  onAddCard,
  onEditCard,
  onDeleteCard,
  onToggleCardLabel,
  onEditColumn,
  onDeleteColumn,
}: ColumnProps) {
  const [newCardTitle, setNewCardTitle] = useState('');
  const [isAddingCard, setIsAddingCard] = useState(false);

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const handleSubmitCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCardTitle.trim()) {
      onAddCard(column.id, newCardTitle.trim());
      setNewCardTitle('');
      setIsAddingCard(false);
    }
  };

  const handleTitleChange = (e: React.FocusEvent<HTMLSpanElement>) => {
    const newTitle = e.currentTarget.textContent?.trim() || column.title;
    if (newTitle !== column.title) {
      onEditColumn(column.id, newTitle);
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  return (
    <div className={`${styles.column} ${isOver ? styles.over : ''}`}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.label}>Module</span>
          <span
            className={styles.title}
            contentEditable
            suppressContentEditableWarning
            onBlur={handleTitleChange}
            onKeyDown={handleTitleKeyDown}
          >
            {column.title}
          </span>
        </div>

        <div className={styles.headerActions}>
          <span className={styles.count}>{String(cards.length).padStart(2, '0')}</span>
          <button
            className={styles.deleteButton}
            onClick={() => onDeleteColumn(column.id)}
            aria-label="Delete column"
          >
            &times;
          </button>
        </div>
      </div>

      <div ref={setNodeRef} className={styles.cards}>
        <SortableContext items={column.cardIds} strategy={verticalListSortingStrategy}>
          {cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              onEdit={onEditCard}
              onDelete={onDeleteCard}
              onToggleLabel={onToggleCardLabel}
            />
          ))}
        </SortableContext>
      </div>

      {isAddingCard ? (
        <form onSubmit={handleSubmitCard} className={styles.addCardForm}>
          <input
            type="text"
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            placeholder="Enter card title..."
            className={styles.input}
            autoFocus
          />
          <div className={styles.formButtons}>
            <button type="submit" className={styles.submitButton}>
              <span className={styles.buttonGlyph} aria-hidden="true">[+]</span>
              Add
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => {
                setIsAddingCard(false);
                setNewCardTitle('');
              }}
            >
              <span className={styles.buttonGlyph} aria-hidden="true">[x]</span>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          className={styles.addCardButton}
          onClick={() => setIsAddingCard(true)}
        >
          <span className={styles.buttonGlyph} aria-hidden="true">[+]</span>
          Add note card
        </button>
      )}

    </div>
  );
}
