
import Categories from "@/components/Categories/Categories";
import styles from "./page.module.css";
import Navigation from "@/components/Navigation/Navigation";

export default function Home() {
  return (
    <div className={styles.page}>
      <Navigation />
      <Categories title="Allir flokkar" />
    </div>
  );
}
