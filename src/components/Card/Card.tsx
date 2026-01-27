import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Card as CardType } from '../../types';
import styles from './Card.module.css';

interface CardProps {
  card: CardType;
  onEdit: (id: string, title: string) => void;
  onDelete: (id: string) => void;
}

export function Card({ card, onEdit, onDelete }: CardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleTitleChange = (e: React.FocusEvent<HTMLSpanElement>) => {
    const newTitle = e.currentTarget.textContent?.trim() || card.title;
    if (newTitle !== card.title) {
      onEdit(card.id, newTitle);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.card} ${isDragging ? styles.dragging : ''}`}
      {...attributes}
      {...listeners}
    >
      <span
        className={styles.title}
        contentEditable
        suppressContentEditableWarning
        onBlur={handleTitleChange}
        onKeyDown={handleKeyDown}
      >
        {card.title}
      </span>
      <button
        className={styles.deleteButton}
        onClick={(e) => {
          e.stopPropagation();
          onDelete(card.id);
        }}
        aria-label="Delete card"
      >
        &times;
      </button>
    </div>
  );
}
