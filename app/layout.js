import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import styles from '@/styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Layout({ title, keywords, description, children }) {
  return (
    <html lang="en">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
      </Head>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
Layout.defaultProps = {
  title: 'Budget Tracker',
  description: 'Track your budget with ease',
  keywords: 'budget, tracker, money',
};
