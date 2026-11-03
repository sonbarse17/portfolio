export type AccessRequest = {
  ssoAuthenticated: boolean
  mfa: boolean
  compliantDevice: boolean
  roleMapped: boolean
  explicitDeny: boolean
  scpAllows: boolean
  boundaryAllows: boolean
  identityAllows: boolean
  resourcePolicyAllows: boolean
  fromPrivateNetwork: boolean
  tls12: boolean
}

export const secureDefault: AccessRequest = {
  ssoAuthenticated: true,
  mfa: true,
  compliantDevice: true,
  roleMapped: true,
  explicitDeny: false,
  scpAllows: true,
  boundaryAllows: true,
  identityAllows: true,
  resourcePolicyAllows: false,
  fromPrivateNetwork: true,
  tls12: true,
}

export type Check = { layer: string; name: string; pass: boolean; why: string }

/**
 * Walks one request from sign-in to the data. The AWS section follows the documented order for a
 * same-account request: explicit deny wins, then SCPs, then a resource policy can grant directly,
 * otherwise both the permissions boundary and an identity policy must allow.
 */
export function evaluateAccess(r: AccessRequest) {
  const identityGrant = r.boundaryAllows && r.identityAllows
  const checks: Check[] = [
    {
      layer: 'Identity',
      name: 'Entra ID SSO',
      pass: r.ssoAuthenticated,
      why: r.ssoAuthenticated
        ? 'User signed in through the central identity provider.'
        : 'No session. Nothing further is evaluated.',
    },
    {
      layer: 'Identity',
      name: 'Conditional Access',
      pass: r.mfa && r.compliantDevice,
      why:
        r.mfa && r.compliantDevice
          ? 'MFA satisfied on a managed device.'
          : `Blocked: ${[!r.mfa && 'MFA missing', !r.compliantDevice && 'device not compliant'].filter(Boolean).join(', ')}.`,
    },
    {
      layer: 'Federation',
      name: 'SAML role mapping',
      pass: r.roleMapped,
      why: r.roleMapped
        ? 'Group claim maps to a short-lived role session.'
        : 'No group maps to a role, so no credentials are issued.',
    },
    {
      layer: 'AWS IAM',
      name: 'Explicit deny',
      pass: !r.explicitDeny,
      why: r.explicitDeny
        ? 'A Deny statement matched. No Allow anywhere can override it.'
        : 'No Deny statement matched.',
    },
    {
      layer: 'AWS IAM',
      name: 'Service control policy',
      pass: r.scpAllows,
      why: r.scpAllows
        ? 'The organization permits this action.'
        : 'The SCP sets the ceiling, and this action is above it.',
    },
    {
      layer: 'AWS IAM',
      name: 'Allow decision',
      pass: r.resourcePolicyAllows || identityGrant,
      why: r.resourcePolicyAllows
        ? 'A resource policy names this principal directly, which is enough within one account.'
        : identityGrant
          ? 'Both the identity policy and the permissions boundary allow it.'
          : !r.identityAllows
            ? 'Implicit deny: no policy grants this action.'
            : 'The identity policy allows it, but the boundary does not. Effective permissions are the intersection.',
    },
    {
      layer: 'Network',
      name: 'Private path',
      pass: r.fromPrivateNetwork,
      why: r.fromPrivateNetwork
        ? 'Reached over a VPC endpoint.'
        : 'A bucket policy condition requires the VPC endpoint. Valid credentials are not enough.',
    },
    {
      layer: 'Transport',
      name: 'TLS 1.2+',
      pass: r.tls12,
      why: r.tls12
        ? 'Encrypted in transit with an accepted protocol version.'
        : 'Rejected: policy denies requests below TLS 1.2.',
    },
  ]

  const failedAt = checks.findIndex((c) => !c.pass)
  return { checks, failedAt, allowed: failedAt === -1 }
}
