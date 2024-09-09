import { CourseInter, SpecialtyInter } from "../appControl/appInter";
import { CustomUserInter } from "../userControl/userInter";


export type NotificationInter = {
  id: number;
  specialty: SpecialtyInter;
  year_week: string;
  created_by?: CustomUserInter;
  created_at: string;
  updated_by?: CustomUserInter;
  updated_at: string;
};

export type ComplainInter = {
  id: number;
  day: string;
  period_0812: CourseInter;
  period_1317: CourseInter;
  period_1721: CourseInter;
  assigned: string;
  signed_in: string;
  signed_our: string;
  created_by?: CustomUserInter;
  created_at: string;
};

export type UserActivityInter = {
  id: number;
  day: string;
  period_0812: CourseInter;
  period_1317: CourseInter;
  period_1721: CourseInter;
  assigned: string;
  signed_in: string;
  signed_our: string;
  created_by?: CustomUserInter;
  created_at: string;
};


export type GetNotificationInter = {
  id: number;
  message_one: string;
  message_two?: string;
  target?: string;
  noti_type: string;
  status: boolean;
  created_at?: string;
  ending_at?: string;
  created_by__full_name?: string;
};

export type GetComplainInter = {
  id: number;
  timetable__specialty__id: number;
  created_by__full_name?: string;
  created_at?: string;
};

export type GetUserActivityInter = {
  id: number;
  timetable__specialty__id: number;
  created_by__full_name?: string;
  created_at?: string;
};

