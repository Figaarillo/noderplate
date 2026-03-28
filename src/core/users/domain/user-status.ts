export enum UserStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  SUSPENDED = 'SUSPENDED'
}

export type UserStatusTransition =
  | { from: UserStatus.PENDING; to: UserStatus.VERIFIED }
  | { from: UserStatus.PENDING; to: UserStatus.SUSPENDED }
  | { from: UserStatus.VERIFIED; to: UserStatus.SUSPENDED }

const ALLOWED_TRANSITIONS: UserStatusTransition[] = [
  { from: UserStatus.PENDING, to: UserStatus.VERIFIED },
  { from: UserStatus.PENDING, to: UserStatus.SUSPENDED },
  { from: UserStatus.VERIFIED, to: UserStatus.SUSPENDED }
]

export const UserStateMachine = {
  canTransition(currentStatus: UserStatus, newStatus: UserStatus): boolean {
    return ALLOWED_TRANSITIONS.some(t => t.from === currentStatus && t.to === newStatus)
  },

  validateTransition(currentStatus: UserStatus, newStatus: UserStatus): void {
    if (!this.canTransition(currentStatus, newStatus)) {
      throw new Error(`Invalid transition from ${currentStatus} to ${newStatus}`)
    }
  },

  isVerified(status: UserStatus): boolean {
    return status === UserStatus.VERIFIED
  },

  initialStatus(): UserStatus {
    return UserStatus.PENDING
  }
}
