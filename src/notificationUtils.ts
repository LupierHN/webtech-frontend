import { ref } from 'vue'
import axios from 'axios'
import type { Notification } from '@/model/notification'

export const newNotifications = ref<boolean>(false)
export const notifications = ref<Notification[]>([])

export function getTimestampAsString(timestamp: Date | string): string {
  const d = new Date()
  const ts = (timestamp instanceof Date ? timestamp : new Date(timestamp)).getTime() / 1000
  const nowTs = Math.floor(d.getTime() / 1000)
  const seconds = nowTs - ts

  if (seconds > 2 * 24 * 3600) {
    return 'a few days ago'
  }
  if (seconds > 24 * 3600) {
    return 'yesterday'
  }
  if (seconds > 3600) {
    return 'a few hours ago'
  }
  if (seconds > 1800) {
    return 'Half an hour ago'
  }
  if (seconds > 60) {
    return Math.floor(seconds / 60) + ' minutes ago'
  }
  return 'Just now'
}

export async function getNewNotifications(): Promise<void> {
  try {
    const response = await axios.get<Notification[]>('/notifications')
    notifications.value = response.data
    newNotifications.value = true
  } catch (error) {
    console.error(error)
  }
}

export async function readNotification(notification: Notification): Promise<void> {
  try {
    const res = await axios.put('/notifications/read', notification)
    if (res.status === 200) {
      await getNewNotifications()
      newNotifications.value = false
    } else {
      console.error(res)
    }
  } catch (error) {
    console.error(error)
  }
}

export async function readAllNotifications(): Promise<void> {
  try {
    const res = await axios.put('/notifications/readAll')
    if (res.status === 200) {
      await getNewNotifications()
      newNotifications.value = false
    } else {
      console.error(res)
    }
  } catch (error) {
    console.error(error)
  }
}
