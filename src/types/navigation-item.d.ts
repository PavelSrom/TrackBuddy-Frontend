export type NavigationLink =
  | '/dashboard'
  | '/journals'
  | '/planner'
  | '/habits'
  | '/charts'

export type NavigationItem = {
  value: NavigationLink
  label: string
  icon: React.ElementType
}
