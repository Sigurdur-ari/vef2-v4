import Categories from '@/components/Categories/Categories';
import Navigation from '@/components/Navigation/Navigation';
import styles from "../page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <Navigation />
      <Categories title="Allir flokkar" />
    </div>
  );
}
