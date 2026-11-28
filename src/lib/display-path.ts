/** The ~/route form of a pathname: '/' becomes '~', '/work/' becomes '~/work'. */
export function displayPath(pathname: string): string {
  const trimmed = pathname.replace(/\/$/, '')
  return `~${trimmed}`
}
