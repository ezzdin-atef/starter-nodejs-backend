import { User } from '../../domain/entities/User'

export interface UserResponseDto {
  id: string
  email: string
  name?: string
  avatarUrl?: string
  emailVerified?: string
  createdAt: string
  updatedAt: string
}

export function toUserResponseDto(user: User): UserResponseDto {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
    emailVerified: user.emailVerified?.toISOString(),
    createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
    updatedAt: user.updatedAt?.toISOString() || new Date().toISOString()
  }
}

