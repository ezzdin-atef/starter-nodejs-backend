export interface AuthResponseDto {
  accessToken: string
  refreshToken: string
  user: {
    id: string
    email: string
    name?: string
  }
}

export function toAuthResponseDto(data: {
  accessToken: string
  refreshToken: string
  user: {
    id: string
    email: string
    name?: string
  }
}): AuthResponseDto {
  return {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    user: {
      id: data.user.id,
      email: data.user.email,
      name: data.user.name
    }
  }
}

