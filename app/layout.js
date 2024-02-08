import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "@/styles/globals.css";

export default function Layout({ title, keywords, description, children }) {
    return (
        <div>
            <Head>
                <title>{title}</title>
                <meta name="description" content={description} />
                <meta name="keywords" content={keywords} />
            </Head>
            <Header />
            {children}
            <Footer />
        </div>
    );
}

Layout.defaultProps = {
    title: "Budget Tracker",
    description: "Track your budget with ease",
    keywords: "budget, tracker, money",
};