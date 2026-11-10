// The notification inbox. It holds unread notifications only: marking one read removes it.
import { http } from './client';
import type { AppNotification, Paged } from './types';

export const getNotifications = (page: number) =>
  http.get<Paged<AppNotification>>('/client/notifications', { page });

export const unreadCount = async () =>
  (
    await http.get<Paged<AppNotification>>('/client/notifications', {
      limit: 1,
    })
  ).pagination.total;

export const markRead = (id: number) =>
  http.post(`/client/notifications/${id}/read`);

export const markAllRead = () => http.post('/client/notifications/read-all');
