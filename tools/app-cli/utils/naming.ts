/**
 * Utility functions for converting between different naming conventions
 */

/**
 * Convert a string to PascalCase
 * Example: "user profile" -> "UserProfile", "user_profile" -> "UserProfile"
 */
export function toPascalCase(str: string): string {
  return str
    .split(/[\s_-]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')
}

/**
 * Convert a string to camelCase
 * Example: "user profile" -> "userProfile", "user_profile" -> "userProfile"
 */
export function toCamelCase(str: string): string {
  const pascal = toPascalCase(str)
  return pascal.charAt(0).toLowerCase() + pascal.slice(1)
}

/**
 * Convert a string to kebab-case
 * Example: "User Profile" -> "user-profile", "user_profile" -> "user-profile"
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}

/**
 * Convert a string to snake_case
 * Example: "User Profile" -> "user_profile", "user-profile" -> "user_profile"
 */
export function toSnakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase()
}

/**
 * Convert a string to plural form (simple version)
 * Example: "user" -> "users", "category" -> "categories"
 */
export function toPlural(str: string): string {
  const lower = str.toLowerCase()
  if (lower.endsWith('y')) {
    return str.slice(0, -1) + 'ies'
  }
  if (lower.endsWith('s') || lower.endsWith('x') || lower.endsWith('z') || 
      lower.endsWith('ch') || lower.endsWith('sh')) {
    return str + 'es'
  }
  return str + 's'
}

/**
 * Get the entity name from module name or use provided entity name
 */
export function getEntityName(moduleName: string, entityName?: string): string {
  return entityName ? toPascalCase(entityName) : toPascalCase(moduleName)
}

