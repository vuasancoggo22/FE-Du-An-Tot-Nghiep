/* eslint-disable no-unused-vars */
import { atom, selector } from "recoil";


export const notificationState = atom({
    key : 'notification',
    default : false
})
export const notificationLengthState = atom({
    key : 'notificationLength',
    default : 0
})
export const userNotificationLengthState = atom({
  key : 'userNotificationLength',
  default : 0
})
export const userNotificationState = atom({
  key: 'userNotification',
  default : false
})

export const employeeNotificationState = atom({
  key: 'employeeNotification',
  default : false
})

export const employeeNotificationLengthState = atom({
  key: 'employeeNotificationLength',
  default : false
})