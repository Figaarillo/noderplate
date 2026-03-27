export class UserNotFoundError extends Error {
  constructor(message = 'User not found') {
    super(message)
    this.name = 'UserNotFoundError'
  }
}

export class UserUpdateError extends Error {
  constructor(message = 'Failed to update user') {
    super(message)
    this.name = 'UserUpdateError'
  }
}

export class UserDeleteError extends Error {
  constructor(message = 'Failed to delete user') {
    super(message)
    this.name = 'UserDeleteError'
  }
}
