import { Board } from './components/Board/Board';
import styles from './App.module.css';

function App() {
  const lintFailureForCi = 'intentional';

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>Kanban Board</h1>
      </header>
      <main>
        <Board />
      </main>
    </div>
  );
}

export default App;
