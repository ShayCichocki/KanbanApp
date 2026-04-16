import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Card as CardType, CardLabel } from '../../types';
import styles from './Card.module.css';

const CARD_LABELS: CardLabel[] = ['Lab', 'Text', 'Clip'];

interface CardProps {
  card: CardType;
  onEdit: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  onToggleLabel: (id: string, label: CardLabel) => void;
}

export function Card({ card, onEdit, onDelete, onToggleLabel }: CardProps) {
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

  const labels = card.labels ?? [];
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

  const handleLabelPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.stopPropagation();
  };

  const handleLabelClick = (label: CardLabel) => (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onToggleLabel(card.id, label);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.card} ${isDragging ? styles.dragging : ''}`}
      {...attributes}
      {...listeners}
    >
      <div className={styles.content}>
        <div className={styles.stickerRow}>
          {CARD_LABELS.map((label) => {
            const isActive = labels.includes(label);
            const variantClass =
              label === 'Lab'
                ? styles.pixelTagMint
                : label === 'Text'
                  ? styles.pixelTagSky
                  : styles.pixelTagPeach;

            return (
              <button
                key={label}
                type="button"
                className={`${styles.pixelTag} ${variantClass} ${isActive ? styles.pixelTagActive : styles.pixelTagInactive}`}
                aria-pressed={isActive}
                onPointerDown={handleLabelPointerDown}
                onClick={handleLabelClick(label)}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className={styles.metaRow}>
          <span className={styles.meta}>Study Note</span>
          <span className={styles.serial}>{card.id.slice(-4).toUpperCase()}</span>
        </div>

        <span
          className={styles.title}
          contentEditable
          suppressContentEditableWarning
          onBlur={handleTitleChange}
          onKeyDown={handleKeyDown}
        >
          {card.title}
        </span>
      </div>

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
