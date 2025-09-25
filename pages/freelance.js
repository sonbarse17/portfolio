import Head from 'next/head';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';
import FreelanceServices from '../components/FreelanceServices';

export default function FreelancePage() {
  return (
    <>
      <Head>
        <title>Freelance DevOps & Cloud Services - Sushant Sonbarse</title>
        <meta name="description" content="Explore the freelance DevOps and cloud services offered by Sushant Sonbarse. CI/CD, cloud infrastructure, Kubernetes, and more." />
      </Head>
      <main className="bg-gray-50 dark:bg-black">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Link href="/" legacyBehavior>
            <a className="inline-flex items-center text-blue-600 hover:text-blue-800">
              <FiArrowLeft className="mr-2" />
              Back to Home
            </a>
          </Link>
        </div>
        <FreelanceServices />
      </main>
    </>
  );
}