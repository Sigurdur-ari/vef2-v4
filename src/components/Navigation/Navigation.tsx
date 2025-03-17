import Link from "next/link";

import styles from './Navigation.module.css'

export default function Navigation() {
  return (
    <nav className={styles.nav}>
      <ul>
        <li><Link href="/">Forsíða</Link></li>
        <li><Link href="/flokkar">Flokkar</Link></li>
        <li><Link href="/form">Bæta við spurningu</Link></li>
      </ul>
    </nav>
  );
} 