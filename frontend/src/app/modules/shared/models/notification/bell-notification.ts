export interface BellNotification {
  id: number;
  message: string;
  timeStamp: Date;
  seen: boolean;
  shouldRedirect: boolean;
  redirectId?: string;
  userId: string;
}
