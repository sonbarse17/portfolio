import dynamic from 'next/dynamic'
import type { ComponentType } from 'react'

const loading = () => (
  <p className="label py-24 text-center text-muted" role="status">
    Loading lab
  </p>
)

/** One chunk per lab, so a visitor downloads only the engine they open. */
export const labComponents: Record<string, ComponentType> = {
  'blast-radius': dynamic(() => import('./blast-radius').then((m) => m.BlastRadiusLab), {
    loading,
  }),
  'release-path': dynamic(() => import('./release-path').then((m) => m.ReleasePathLab), {
    loading,
  }),
  cluster: dynamic(() => import('./cluster').then((m) => m.ClusterLab), { loading }),
  plan: dynamic(() => import('./plan').then((m) => m.PlanLab), { loading }),
  'error-budget': dynamic(() => import('./error-budget').then((m) => m.ErrorBudgetLab), {
    loading,
  }),
  'access-trace': dynamic(() => import('./access-trace').then((m) => m.AccessTraceLab), {
    loading,
  }),
}
