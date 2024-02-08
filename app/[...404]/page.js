import Link from "next/link";
import styles from "@/styles/404.module.css";
import { FaExclamationTriangle } from 'react-icons/fa';

export default function NotFoundPage() {
    return (
        
        <div className={styles.error}>
            <h1><FaExclamationTriangle /> 404</h1> <br/>
            <h4>Sorry, there is nothing here</h4> <br/>
            <Link href="/">Go back home</Link>
        </div>
        
    );
    }

