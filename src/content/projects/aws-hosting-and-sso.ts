import { edge, node, type DiagramNode, type Project } from './types'

const I = 'implemented' as const
const E = 'dependency' as const

const visitor = (x: number, y: number): DiagramNode =>
  node('visitor', 'Visitor', x, y, E, 'Someone opening the public website.')
const dns = (x: number, y: number): DiagramNode =>
  node(
    'dns',
    'DNS records',
    x,
    y,
    I,
    'Domain records configured in GoDaddy DNS and Amazon Route 53. How responsibility was split between the two is not described here.',
    'GoDaddy, Route 53'
  )
const cf = (x: number, y: number): DiagramNode =>
  node(
    'cf',
    'CloudFront',
    x,
    y,
    I,
    'Serves the static website over HTTPS. Configured with an ACM certificate and with Origin Access Control to read from the private bucket.',
    'HTTPS, OAC'
  )
const s3 = (x: number, y: number): DiagramNode =>
  node(
    's3',
    'Private S3 bucket',
    x,
    y,
    I,
    'Holds the static website files. The bucket is private. Its policy allows the intended CloudFront distribution and nothing else.',
    'static site'
  )
const user = (x: number, y: number): DiagramNode =>
  node('user', 'User', x, y, E, 'Someone signing in to the application.')
const frontend = (x: number, y: number): DiagramNode =>
  node(
    'frontend',
    'Custom sign-in UI',
    x,
    y,
    I,
    'A custom authentication interface built with Amplify UI. It supports email sign-in and a Microsoft sign-in option.',
    'Amplify UI'
  )
const cognito = (x: number, y: number): DiagramNode =>
  node(
    'cognito',
    'Amazon Cognito',
    x,
    y,
    I,
    'A user pool with an app client. Configured with callback and sign-out URLs, and federated to Microsoft through SAML.',
    'user pool, app client'
  )
const idp = (x: number, y: number): DiagramNode =>
  node(
    'idp',
    'Microsoft Entra ID',
    x,
    y,
    E,
    'The Microsoft enterprise identity provider, integrated with Cognito as a SAML 2.0 identity provider.',
    'SAML 2.0 IdP'
  )
const route = (x: number, y: number): DiagramNode =>
  node(
    'route',
    'Application route',
    x,
    y,
    I,
    'The route an authenticated user reaches. It is served by the Elastic Beanstalk application, not by S3.'
  )
const eb = (x: number, y: number): DiagramNode =>
  node(
    'eb',
    'Elastic Beanstalk',
    x,
    y,
    I,
    'Hosts the application, with its routing and deployment configuration.',
    'application'
  )

export const awsHostingAndSso: Project = {
  slug: 'aws-hosting-and-sso',
  title: 'AWS hosting and Microsoft SSO for a client web application',
  summary:
    'Static hosting, application hosting and enterprise sign-in on AWS Singapore. S3 and CloudFront for the site, Elastic Beanstalk for the app, Cognito federated to Microsoft over SAML.',
  classification: 'professional',
  category: 'AWS cloud infrastructure, hosting, authentication and enterprise SSO',
  context: 'Professional implementation',
  labels: ['AWS ap-southeast-1'],
  tier: 'case',
  lab: 'access-trace',
  glance: [
    { label: 'Region', value: 'AWS Singapore (ap-southeast-1)' },
    { label: 'Static site', value: 'Private S3 behind CloudFront, using OAC' },
    { label: 'Application', value: 'AWS Elastic Beanstalk' },
    { label: 'Sign-in', value: 'Cognito, federated to Microsoft over SAML' },
  ],
  stackGroups: [
    {
      group: 'Static hosting',
      items: ['Amazon S3 (private)', 'Amazon CloudFront', 'Origin Access Control'],
    },
    { group: 'Application hosting', items: ['AWS Elastic Beanstalk'] },
    {
      group: 'Authentication',
      items: ['Amazon Cognito user pool', 'Cognito app client', 'Amplify UI'],
    },
    { group: 'Enterprise identity', items: ['Microsoft Entra ID (Azure AD)', 'SAML 2.0'] },
    { group: 'DNS and TLS', items: ['Amazon Route 53', 'GoDaddy DNS', 'AWS Certificate Manager'] },
  ],
  views: [
    {
      id: 'overview',
      label: 'Overview',
      caption:
        'Three flows, kept separate. Static hosting, authentication and application hosting are different paths.',
      height: 'h-[36rem]',
      regions: [
        { label: 'Static website', x: 2, y: 3, w: 96, h: 26 },
        { label: 'Authentication', x: 2, y: 33, w: 96, h: 31 },
        { label: 'Application hosting', x: 2, y: 68, w: 96, h: 28 },
      ],
      nodes: [
        visitor(14, 17),
        dns(38, 17),
        cf(62, 17),
        s3(86, 17),
        user(14, 49),
        frontend(38, 49),
        cognito(62, 49),
        idp(86, 49),
        route(38, 82),
        eb(66, 82),
      ],
      edges: [
        edge('visitor', 'dns'),
        edge('dns', 'cf'),
        edge('cf', 's3', 'OAC'),
        edge('user', 'frontend'),
        edge('frontend', 'cognito'),
        edge('cognito', 'idp', 'SAML'),
        edge('cognito', 'route', 'authenticated'),
        edge('route', 'eb'),
      ],
    },
    {
      id: 'static',
      label: 'Static hosting',
      caption: 'How the website is delivered. The bucket is private.',
      height: 'h-[24rem]',
      nodes: [
        visitor(14, 62),
        dns(38, 62),
        cf(62, 62),
        s3(86, 62),
        node(
          'acm',
          'ACM certificate',
          62,
          18,
          I,
          'The TLS certificate attached to the CloudFront distribution for HTTPS.',
          'TLS'
        ),
      ],
      edges: [
        edge('visitor', 'dns'),
        edge('dns', 'cf'),
        edge('cf', 's3', 'OAC'),
        edge('acm', 'cf'),
      ],
      steps: [
        {
          text: 'A visitor requests the site. DNS records resolve the domain to CloudFront.',
          edges: [
            ['visitor', 'dns'],
            ['dns', 'cf'],
          ],
        },
        {
          text: 'CloudFront answers over HTTPS using the ACM certificate.',
          edges: [['acm', 'cf']],
        },
        {
          text: 'CloudFront reads the files from the private S3 bucket through Origin Access Control. The bucket policy allows the intended distribution only.',
          edges: [['cf', 's3']],
        },
      ],
    },
    {
      id: 'auth',
      label: 'Authentication',
      caption: 'Custom sign-in through Cognito, with Microsoft SAML SSO.',
      height: 'h-[30rem]',
      nodes: [
        user(18, 14),
        frontend(50, 14),
        cognito(82, 14),
        idp(82, 50),
        node(
          'app',
          'Application',
          18,
          60,
          I,
          'Receives the authentication result through the callback URL configured on the Cognito app client.'
        ),
      ],
      edges: [
        edge('user', 'frontend'),
        edge('frontend', 'cognito'),
        edge('cognito', 'idp', 'SAML'),
        edge('cognito', 'app', 'callback URL'),
      ],
      steps: [
        {
          text: 'The user opens the custom authentication interface built with Amplify UI. It offers email sign-in and Microsoft sign-in.',
          edges: [['user', 'frontend']],
        },
        {
          text: 'The interface works with the Cognito user pool through the app client.',
          edges: [['frontend', 'cognito']],
        },
        {
          text: 'For Microsoft sign-in, Cognito federates to the enterprise identity provider over SAML 2.0 and the user is sent to Microsoft to authenticate.',
          edges: [['cognito', 'idp']],
        },
        {
          text: 'Microsoft returns the SAML authentication response to Cognito, along the same federation link.',
          edges: [['cognito', 'idp']],
        },
        {
          text: 'Cognito returns the authentication result to the application through the configured callback URL.',
          edges: [['cognito', 'app']],
        },
      ],
    },
    {
      id: 'app',
      label: 'Application hosting',
      caption: 'The application runs on Elastic Beanstalk. S3 does not host it.',
      height: 'h-[18rem]',
      nodes: [
        node('auth', 'Authenticated user', 14, 50, E, 'A user who has signed in through Cognito.'),
        route(50, 50),
        eb(86, 50),
      ],
      edges: [edge('auth', 'route'), edge('route', 'eb')],
      steps: [
        {
          text: 'An authenticated user reaches the application route.',
          edges: [['auth', 'route']],
        },
        {
          text: 'Requests are routed to the application running on AWS Elastic Beanstalk.',
          edges: [['route', 'eb']],
        },
      ],
    },
  ],
  sections: [
    {
      id: 'intro',
      provenance: 'record',
      body: 'A client needed its website and application on AWS, with sign-in through Amazon Cognito and enterprise Microsoft SSO. I configured the hosting, authentication, DNS and TLS in the AWS Singapore region (ap-southeast-1).',
    },
    {
      id: 'problem',
      provenance: 'record',
      body: 'Configure and deploy the website and application infrastructure on AWS, with authentication and enterprise Microsoft SSO.',
    },
    {
      id: 'context',
      provenance: 'record',
      points: [
        'Static website: Amazon S3 and CloudFront, with a private bucket and Origin Access Control.',
        'Application: AWS Elastic Beanstalk.',
        'Authentication: a Cognito user pool and app client, a custom Amplify UI interface and email-based sign-in.',
        'Enterprise identity: Microsoft Entra ID (Azure AD) as a SAML 2.0 identity provider federated with Cognito.',
        'DNS and certificates: GoDaddy DNS, Amazon Route 53 and AWS Certificate Manager.',
      ],
    },
    {
      id: 'contribution',
      provenance: 'record',
      body: 'I configured the pieces below and worked on the custom authentication experience. Direct Microsoft login redirection from the custom interface is described as work I did on, not as a finished product claim.',
    },
    {
      id: 'architecture',
      provenance: 'record',
      body: 'The overview keeps three flows apart. Open each tab to follow one flow at a time.',
      details: [
        {
          title: 'Private bucket, public site',
          provenance: 'record',
          body: 'The S3 bucket is private. CloudFront reads from it through Origin Access Control, and the bucket policy allows the intended distribution. The site is public because CloudFront serves it, and the bucket is not a public website endpoint.',
        },
        {
          title: 'Where the application runs',
          provenance: 'record',
          body: 'The application is hosted on AWS Elastic Beanstalk. S3 serves static files only and does not run the application. The static site and the application are separate flows.',
        },
        {
          title: 'Why callback and sign-out URLs matter',
          provenance: 'reference',
          body: 'In Cognito, the app client holds an allow-list of callback and sign-out URLs. Sign-in results are only returned to addresses on that list, so these URLs are part of the security configuration and must match the real application and domain.',
        },
      ],
    },
    { id: 'stack', provenance: 'record' },
    {
      id: 'implementation',
      provenance: 'record',
      body: 'What was configured:',
      points: [
        'Private S3 static website hosting.',
        'CloudFront with Origin Access Control.',
        'Bucket access policy allowing the intended CloudFront distribution.',
        'Application hosting on Elastic Beanstalk.',
        'Cognito authentication.',
        'Microsoft enterprise SAML authentication.',
        'Callback and sign-out URLs.',
        'Domain DNS records.',
        'ACM certificates and HTTPS.',
        'Custom authentication interface with Amplify UI.',
        'Worked on direct Microsoft login redirection from the custom interface.',
      ],
    },
    {
      id: 'challenges',
      provenance: 'record',
      points: [
        'Secure static hosting: keep the bucket private and still serve the site.',
        'CloudFront with a private bucket: Origin Access Control plus a bucket policy scoped to the intended distribution.',
        'Authentication configuration: user pool, app client, and callback and sign-out URLs.',
        'Enterprise SAML integration: federating Cognito with the Microsoft identity provider.',
        'DNS and TLS: records across GoDaddy and Route 53, ACM certificates and HTTPS on CloudFront.',
        'A custom authentication experience: an Amplify UI interface and direct Microsoft redirect flows.',
      ],
    },
    {
      id: 'security',
      provenance: 'record',
      points: [
        'Private S3 bucket reachable only by the intended CloudFront distribution.',
        'HTTPS on CloudFront with ACM certificates.',
        'Enterprise Microsoft SAML single sign-on through Cognito.',
        'Callback and sign-out URLs configured for the application.',
      ],
    },
    {
      id: 'outcome',
      provenance: 'record',
      body: 'The static website, application hosting, Cognito authentication and Microsoft SAML SSO were configured on AWS. No traffic, uptime or performance figures are published, because none were provided for this write-up.',
    },
    {
      id: 'lessons',
      provenance: 'reference',
      points: [
        'Keep static hosting, application hosting and authentication as separate concerns. Each fails in its own way.',
        'Domain names and callback URLs are part of the identity configuration. They have to agree across Cognito, the identity provider and the application.',
        'With a private bucket behind CloudFront, the CloudFront distribution is the single entry point to the content. That is also where to look when content does not load.',
      ],
    },
  ],
}
