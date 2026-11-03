import { edge, node, type Project } from './types'

const E = 'dependency' as const
const I = 'implemented' as const

const appNode = (x: number, y: number, sub = 'web application') =>
  node(
    'app',
    'Azure App Service',
    x,
    y,
    E,
    'The application deployment. Microsoft Entra ID authentication is enabled on it, and it is the backend behind the gateway.',
    sub
  )

const entra = (x: number, y: number) =>
  node(
    'entra',
    'Microsoft Entra ID',
    x,
    y,
    E,
    'Employee single sign-on through Microsoft Entra ID.',
    'SSO'
  )

const integration = (x: number, y: number) =>
  node(
    'integration',
    'Integration system',
    x,
    y,
    E,
    'An external system that triggers a workflow in the application. The network path between it and the application is not shown here; connectivity was verified across the relevant environments.',
    'calls the workflow endpoint'
  )

export const azureInternalAccess: Project = {
  slug: 'azure-internal-access',
  title: 'Internal-only access for an enterprise Azure application',
  summary:
    'Designed and deployed an internal-access architecture for an enterprise Azure application, using an internal Application Gateway and Microsoft Entra ID single sign-on.',
  classification: 'professional',
  category: 'Azure infrastructure, internal network architecture, enterprise identity',
  context: 'Designed and deployed by me',
  labels: ['Dev', 'UAT', 'Production'],
  tier: 'case',
  lab: 'access-trace',
  glance: [
    { label: 'Access model', value: 'Internal-only, through an internal Application Gateway' },
    { label: 'Chosen solution', value: 'Internal Application Gateway, not Private Endpoint' },
    { label: 'Identity', value: 'Microsoft Entra ID SSO, under the application hostname' },
    { label: 'Reached from', value: 'Corporate VDI, Windows 365 Cloud PC, VPN' },
  ],
  stackGroups: [
    { group: 'Application', items: ['Azure App Service', 'Microsoft Entra ID'] },
    {
      group: 'Network entry',
      items: ['Azure Application Gateway (internal)', 'Azure Front Door (legacy)'],
    },
    {
      group: 'Access and DNS',
      items: ['Corporate DNS', 'Corporate VDI', 'Windows 365 Cloud PC', 'Corporate VPN'],
    },
    { group: 'Integration and TLS', items: ['Workflow integration', 'HTTPS certificates'] },
  ],
  views: [
    {
      id: 'before',
      label: 'Before',
      caption: 'Public access through Azure Front Door.',
      height: 'h-[24rem]',
      regions: [{ label: 'Public internet access', x: 3, y: 6, w: 94, h: 34 }],
      nodes: [
        node(
          'users',
          'Corporate and public users',
          20,
          22,
          E,
          'Users reached the application over the public internet through Azure Front Door.'
        ),
        node(
          'afd',
          'Azure Front Door',
          62,
          22,
          E,
          'The public entry point in the original architecture.',
          'public entry'
        ),
        appNode(62, 62),
        entra(88, 62),
        integration(20, 62),
      ],
      edges: [
        edge('users', 'afd'),
        edge('afd', 'app'),
        edge('app', 'entra', 'SSO'),
        edge('integration', 'app'),
      ],
    },
    {
      id: 'after',
      label: 'After',
      caption:
        'Internal access through an internal Application Gateway. Front Door is shown as follow-up work.',
      height: 'h-[34rem]',
      regions: [{ label: 'Corporate network access', x: 3, y: 4, w: 94, h: 40 }],
      nodes: [
        node(
          'vdi',
          'Corporate VDI',
          18,
          13,
          E,
          'One of the three ways employees reach the application.'
        ),
        node(
          'w365',
          'Windows 365 Cloud PC',
          50,
          13,
          E,
          'One of the three ways employees reach the application.'
        ),
        node(
          'vpn',
          'Corporate VPN',
          82,
          13,
          E,
          'One of the three ways employees reach the application.'
        ),
        node(
          'dns',
          'Corporate DNS',
          50,
          36,
          I,
          'Internal DNS records were updated so the application hostname resolves to the internal gateway.',
          'records point to gateway'
        ),
        node(
          'agw',
          'Internal Application Gateway',
          50,
          58,
          I,
          'The internal entry point. It has a private IP address and serves the application over HTTPS with a configured certificate.',
          'private IP, HTTPS'
        ),
        node(
          'afd',
          'Azure Front Door',
          18,
          58,
          'followup',
          'The legacy public entry point. Legacy Front Door and DNS cleanup requirements were reviewed. Decommissioning is follow-up work and is not described as completed.',
          'legacy, cleanup reviewed'
        ),
        appNode(50, 84),
        entra(84, 84),
        integration(16, 84),
      ],
      edges: [
        edge('vdi', 'dns'),
        edge('w365', 'dns'),
        edge('vpn', 'dns'),
        edge('dns', 'agw'),
        edge('agw', 'app'),
        edge('app', 'entra', 'SSO'),
        edge('integration', 'app'),
      ],
    },
    {
      id: 'traffic',
      label: 'Traffic flow',
      caption: 'How an employee request reaches the application.',
      height: 'h-[26rem]',
      nodes: [
        node(
          'user',
          'Corporate user',
          50,
          12,
          E,
          'On Corporate VDI, a Windows 365 Cloud PC or the corporate VPN.',
          'VDI, W365 or VPN'
        ),
        node(
          'dns',
          'Corporate DNS',
          18,
          40,
          I,
          'Resolves the application hostname to the internal gateway.'
        ),
        node(
          'agw',
          'Internal Application Gateway',
          50,
          62,
          I,
          'Receives the request on its private IP address over HTTPS.',
          'private IP'
        ),
        appNode(50, 86),
      ],
      edges: [edge('user', 'dns'), edge('user', 'agw', 'HTTPS'), edge('agw', 'app')],
      steps: [
        {
          text: 'The employee opens the application hostname. Corporate DNS resolves it to the internal gateway.',
          edges: [['user', 'dns']],
        },
        {
          text: 'The browser connects to the gateway on its private IP address over HTTPS.',
          edges: [['user', 'agw']],
        },
        {
          text: 'The gateway forwards the request to the Azure App Service application.',
          edges: [['agw', 'app']],
        },
      ],
    },
    {
      id: 'auth',
      label: 'Authentication',
      caption: 'Employee sign-in through Microsoft Entra ID.',
      height: 'h-[22rem]',
      nodes: [
        node('emp', 'Employee', 18, 22, E, 'Signs in with their corporate identity.'),
        entra(84, 22),
        appNode(50, 70, 'sign-in required'),
      ],
      edges: [edge('emp', 'app'), edge('app', 'entra'), edge('entra', 'emp')],
      steps: [
        { text: 'The employee opens the application.', edges: [['emp', 'app']] },
        {
          text: 'Authentication is handled by Microsoft Entra ID single sign-on.',
          edges: [['app', 'entra']],
        },
        {
          text: 'After signing in, the employee is returned to the application as an authenticated user.',
          edges: [
            ['entra', 'emp'],
            ['emp', 'app'],
          ],
        },
      ],
    },
    {
      id: 'dns',
      label: 'DNS resolution',
      caption: 'The cutover is a DNS change: the same hostname now resolves to the gateway.',
      height: 'h-[22rem]',
      nodes: [
        node('client', 'Corporate client', 50, 14, E, 'Any of the three access paths.'),
        node(
          'dns',
          'Corporate DNS',
          18,
          62,
          I,
          'Internal records were updated, per environment, to point to the internal gateway.',
          'internal records'
        ),
        node(
          'agw',
          'Internal Application Gateway',
          82,
          62,
          I,
          'The target of the internal record.',
          'private IP'
        ),
      ],
      edges: [edge('client', 'dns'), edge('dns', 'agw', 'record'), edge('client', 'agw')],
      steps: [
        {
          text: 'The client asks corporate DNS for the application hostname.',
          edges: [['client', 'dns']],
        },
        {
          text: 'The internal record points the hostname at the gateway private IP address.',
          edges: [['dns', 'agw']],
        },
        { text: 'The client connects to that private address.', edges: [['client', 'agw']] },
      ],
    },
    {
      id: 'integration',
      label: 'Integration workflow',
      caption: 'The authentication exclusion is limited to one endpoint.',
      height: 'h-[20rem]',
      nodes: [
        integration(14, 50),
        node(
          'endpoint',
          'Workflow endpoint',
          50,
          50,
          I,
          'The only endpoint excluded from interactive App Service authentication. The exclusion is in place because the integration needs it.',
          'excluded from interactive auth'
        ),
        appNode(86, 50, 'workflow'),
      ],
      edges: [edge('integration', 'endpoint'), edge('endpoint', 'app')],
      steps: [
        {
          text: 'The integration system calls the workflow endpoint. Connectivity was verified across the relevant environments.',
          edges: [['integration', 'endpoint']],
        },
        {
          text: 'The endpoint reaches the application workflow. Only this endpoint skips interactive sign-in. The rest of the application still requires Entra ID.',
          edges: [['endpoint', 'app']],
        },
      ],
    },
  ],
  sections: [
    {
      id: 'intro',
      provenance: 'record',
      body: 'An enterprise web application required internal-only employee access, Microsoft Entra ID single sign-on, and no public exposure. I designed and deployed the complete solution.',
    },
    {
      id: 'problem',
      provenance: 'record',
      body: 'The requirement was to provide internal-only employee access under the application hostname, with Microsoft Entra ID single sign-on and no public exposure.',
    },
    {
      id: 'context',
      provenance: 'record',
      points: [
        'Original design: Azure Front Door in front of Azure App Service, with Microsoft Entra ID SSO and an external integration workflow.',
        'Employees needed access from Corporate VDI, Windows 365 Cloud PC and the corporate VPN. The integration needed internal connectivity.',
        'Three environments were involved: Development, UAT and Production.',
      ],
    },
    {
      id: 'contribution',
      provenance: 'record',
      body: 'I designed and deployed the complete internal-access solution. I evaluated the available access patterns and selected an internal Application Gateway. My work included gateway deployment and network configuration, DNS updates, validation in each environment, and production-readiness activities.',
    },
    {
      id: 'architecture',
      provenance: 'record',
      body: 'Use the tabs to compare the architecture before and after, then follow traffic, authentication, DNS and the integration workflow separately. Dashed nodes are follow-up work.',
      comparison: {
        rows: [
          {
            aspect: 'Exposure',
            before: 'Public-facing through Azure Front Door',
            after: 'Internal-only through an internal Application Gateway',
          },
          {
            aspect: 'Entry point',
            before: 'Azure Front Door',
            after: 'Internal Application Gateway on a private IP',
          },
          {
            aspect: 'Hostname',
            before: 'Application hostname',
            after: 'The same hostname. Internal DNS resolves it to the gateway',
          },
          {
            aspect: 'Employee sign-in',
            before: 'Microsoft Entra ID SSO',
            after: 'Microsoft Entra ID SSO, the same sign-in',
          },
          {
            aspect: 'Integration endpoint',
            before: 'One workflow endpoint excluded from interactive authentication',
            after: 'Exclusion in place, limited to that endpoint',
          },
          {
            aspect: 'Legacy edge',
            before: 'In use',
            after: 'Cleanup requirements reviewed. Decommissioning is follow-up',
          },
        ],
      },
      details: [
        {
          title: 'Application Gateway and Private Endpoint: how they differ',
          provenance: 'reference',
          body: 'The finalized choice was an internal Application Gateway. Private Endpoint was evaluated and not selected. For context, they work at different layers: a Private Endpoint gives a specific Azure resource a private IP address on the network, while Application Gateway is a layer 7 entry point that receives HTTPS requests on a private IP address and forwards them to a backend. This note describes the difference only. It is not the reasoning behind the decision.',
        },
        {
          title: 'Why only one endpoint skips interactive authentication',
          provenance: 'record',
          body: 'One workflow endpoint is excluded from interactive App Service authentication because an external system integrates with it. The exclusion is limited to that endpoint. The application as a whole is not unauthenticated: every other route still requires Microsoft Entra ID sign-in.',
        },
      ],
    },
    { id: 'stack', provenance: 'record' },
    {
      id: 'implementation',
      provenance: 'record',
      body: 'The work in sequence. Environment labels mark the steps that were specific to one environment.',
      timeline: [
        { text: 'Reviewed the public-facing architecture it replaces', status: 'done' },
        { text: 'Evaluated internal access options', status: 'done' },
        { text: 'Internal Application Gateway finalized as the access solution', status: 'done' },
        {
          text: 'Deployed the Application Gateway and configured its network integration',
          status: 'done',
        },
        { text: 'Configured DNS changes', status: 'done' },
        { text: 'Updated internal DNS records to resolve to the internal gateway', status: 'done' },
        { text: 'Validated access from corporate environments', status: 'done' },
        { text: 'Verified connectivity', env: ['Dev'], status: 'done' },
        { text: 'Verified connectivity', env: ['UAT'], status: 'done' },
        { text: 'Completed DNS updates', env: ['Production'], status: 'done' },
        {
          text: 'Verified integration connectivity across the relevant environments',
          status: 'done',
        },
        { text: 'Completed the production deployment', env: ['Production'], status: 'done' },
        { text: 'Led the security review and production-readiness activities', status: 'done' },
        {
          text: 'Reviewed legacy Front Door and DNS cleanup requirements. Decommissioning is follow-up work.',
          status: 'reviewed',
        },
      ],
    },
    {
      id: 'challenges',
      provenance: 'record',
      points: [
        'Provide internal-only access under the same hostname and the same Entra ID sign-in, with no public exposure.',
        'Make all three access paths, Corporate VDI, Windows 365 Cloud PC and VPN, resolve and reach the internal gateway.',
        'Keep the integration working without opening the rest of the application: the exclusion is scoped to one endpoint.',
        'Repeat validation in Dev, UAT and Production, since each had its own DNS and connectivity to confirm.',
        'Coordinate certificates, change management, the security review and the deployment with the teams involved.',
      ],
    },
    {
      id: 'security',
      provenance: 'record',
      points: [
        'Internal-only access: requests enter through a gateway with a private IP address.',
        'DNS resolution: internal records point the application hostname at the gateway.',
        'HTTPS: certificates were configured for the gateway.',
        'Identity: Microsoft Entra ID SSO, with employee authentication enabled.',
        'API exclusion: limited to one workflow endpoint, for the integration only.',
        'Environment-specific validation, and a security review before production.',
        'Follow-up: legacy Front Door and DNS cleanup was reviewed. Decommissioning is not described as completed.',
      ],
    },
    {
      id: 'outcome',
      provenance: 'record',
      body: 'The internal access architecture was implemented across Dev, UAT and Production. DNS changes were completed and integration connectivity was validated across the environments. No security, uptime or performance figures are published, because none were measured for this write-up.',
    },
    {
      id: 'lessons',
      provenance: 'reference',
      points: [
        'Scope an authentication exclusion to the one integration endpoint. Excluding the application would remove the control.',
        'When the hostname must not change, the cutover is a DNS change. Treat DNS as part of the architecture.',
        'Validate every environment separately. DNS, network paths and certificates differ between them.',
      ],
    },
  ],
}
