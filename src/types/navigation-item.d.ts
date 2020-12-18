export type NavigationLink = '/dashboard' | '/journals' | '/planner' | '/habits'

export type NavigationItem = {
  value: NavigationLink
  label: string
  icon: React.ElementType
}
