/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://sushantsonbarse.com',
  generateRobotsText: true,
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
  exclude: ['/api/*', '/404', '/500'],
  additionalPaths: async (config) => [
    await config.transform(config, '/projects/kubernetes-cluster'),
    await config.transform(config, '/projects/cicd-pipeline'),
    await config.transform(config, '/projects/infrastructure-as-code'),
    await config.transform(config, '/projects/docker-containerization'),
    await config.transform(config, '/projects/monitoring-observability'),
    await config.transform(config, '/projects/cloud-migration'),
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
}