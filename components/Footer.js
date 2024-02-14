import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons'
import styles from "@/styles/Footer.module.css";
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className="row">
                    <div className="col-12 text-center">
                        <p>
                            &copy; 2024 Budget Tracker
                        </p>
                        <div className={styles.socials}>
                                <a href="github.com">
                                <FontAwesomeIcon icon={faGithub} /> 
                                </a>
                          <a href="linkedin.com">
                           
                                <FontAwesomeIcon icon={faLinkedin}  />
                                </a>
                            
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}