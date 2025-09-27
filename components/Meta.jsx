import Head from 'next/head';

export default function Meta({
  title = 'Sushant Sonbarse - DevOps Engineer Portfolio',
  description = 'DevOps Engineer specializing in cloud infrastructure, automation, and scalable solutions. View my portfolio of Kubernetes, CI/CD, and AWS projects.',
  canonical,
  ogImage = '/assets/images/og-image.jpg',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  twitterCreator = '@sushantsonbarse'
}) {
  const siteUrl = 'https://sushantsonbarse.com';
  const fullCanonical = canonical ? `${siteUrl}${canonical}` : siteUrl;
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullCanonical} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="Sushant Sonbarse Portfolio" />
      
      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:creator" content={twitterCreator} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />
    </Head>
  );
}