import Link from "next/link";
import styles from "@/styles/Footer.module.css";


export default function Footer() {
    return (
        <footer className={styles.footer}>
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
        </footer>
    );
}

