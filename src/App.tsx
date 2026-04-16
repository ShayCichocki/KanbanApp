import { Board } from './components/Board/Board';
import styles from './App.module.css';

function App() {
  return (
    <div className={styles.app}>
      <main className={styles.main}>
        <section className={styles.workspaceFrame}>
          <div className={styles.workspaceTopBar}>
            <div className={styles.windowDots} aria-hidden="true">
              <span className={styles.windowDot} />
              <span className={styles.windowDot} />
              <span className={styles.windowDot} />
            </div>

            <div className={styles.workspaceHeading}>
              <span className={styles.workspaceEyebrow}>Networked Courseboard</span>
              <strong className={styles.workspaceTitle}>Active Lesson Stream</strong>
            </div>

            <div className={styles.workspaceBadge}>
              <span className={styles.badgeGlyph} aria-hidden="true">::</span>
              Now Syncing
            </div>
          </div>

          <div className={styles.workspaceUtilityBar} aria-label="Workspace controls">
            <div className={styles.tabs}>
              <button type="button" className={`${styles.tab} ${styles.tabActive}`}>
                <span className={styles.tabGlyph} aria-hidden="true">[]</span>
                Planner
              </button>
              <button type="button" className={styles.tab}>
                <span className={styles.tabGlyph} aria-hidden="true">&lt;&gt;</span>
                Seminar Deck
              </button>
              <button type="button" className={styles.tab}>
                <span className={styles.tabGlyph} aria-hidden="true">::</span>
                Studio Notes
              </button>
              <button type="button" className={styles.tab}>
                <span className={styles.tabGlyph} aria-hidden="true">##</span>
                Orbit Archive
              </button>
            </div>

            <div className={styles.utilityMeta}>
              <div className={styles.readout}>
                <span className={styles.readoutLabel}>Signal</span>
                <strong className={styles.readoutValue}>Academic uplink stable</strong>
              </div>

              <div className={styles.stickerSheet} aria-label="Desktop shortcuts">
                <span className={`${styles.sticker} ${styles.stickerMint}`}>Mail</span>
                <span className={`${styles.sticker} ${styles.stickerPeach}`}>Map</span>
                <span className={`${styles.sticker} ${styles.stickerSky}`}>Lab</span>
                <span className={`${styles.sticker} ${styles.stickerLemon}`}>Clip</span>
              </div>
            </div>
          </div>

          <div className={styles.bootStrip} aria-label="System boot status">
            <span className={styles.bootPrompt}>boot&gt;</span>
            <span className={styles.bootText}>ScholarOS 97 initialized</span>
            <span className={styles.bootDivider}>/</span>
            <span className={styles.bootText}>Indexing active lesson stream...</span>
            <span className={styles.bootDivider}>/</span>
            <span className={styles.bootText}>Drag modules to re-sequence coursework</span>
          </div>

          <Board />
        </section>
      </main>
    </div>
  );
}

export default App;
