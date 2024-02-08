import Link from "next/link";
import styles from "@/styles/Header.module.css";


export default function Header() {
    return (
        <header className={styles.header}>
            <nav>
                <ul>
                    <li>
                        <Link href="/">
                            <p>Home</p>
                        </Link>
                    </li>
                    <li>
                        <Link href="/about">
                            <p>About</p>
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

