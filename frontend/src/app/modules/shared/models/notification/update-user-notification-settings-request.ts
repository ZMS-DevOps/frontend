export interface UpdateUserNotificationSettingsRequest {
  settings: {
    type: number,
    active: boolean
  }[],
  role: string
}
