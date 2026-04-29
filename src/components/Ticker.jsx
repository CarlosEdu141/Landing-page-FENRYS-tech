import { techs } from '../data/siteData';
import styles from './Ticker.module.css';

export default function Ticker() {
  const doubled = [...techs, ...techs];
  return (
    <div className={styles.ticker}>
      <div className={styles.track}>
        {doubled.map((t, i) => (
          <span key={i} className={styles.item}>
            <span className={styles.dot}></span>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}