import Head from 'next/head';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

export default function CloudCostOptimizationPage() {
  return (
    <>
      <Head>
        <title>Cloud Cost Optimization - Sushant Sonbarse</title>
        <meta name="description" content="Analyze and optimize your cloud spending to reduce costs without sacrificing performance." />
      </Head>
      <main className="bg-gray-50 dark:bg-black">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Link href="/freelance" legacyBehavior>
            <a className="inline-flex items-center text-blue-600 hover:text-blue-800">
              <FiArrowLeft className="mr-2" />
              Back to Services
            </a>
          </Link>
          <div className="py-12">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">Cloud Cost Optimization</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              This is a placeholder for the Cloud Cost Optimization service page. You can edit this content later.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
