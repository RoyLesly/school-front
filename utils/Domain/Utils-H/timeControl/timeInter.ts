import { CourseInter, SpecialtyInter } from "../appControl/appInter";
import { CustomUserInter } from "../userControl/userInter";


export type TimeTableInter = {
  id: number;
  specialty: SpecialtyInter;
  year_week: string;
  created_by?: CustomUserInter;
  created_at: string;
  updated_by?: CustomUserInter;
  updated_at: string;
};

export type DayProgramInter = {
  id: number;
  day: string;
  timetable: TimeTableInter;
  period_0812: CourseInter;
  period_1317: CourseInter;
  period_1721: CourseInter;
  assigned: string;
  signed_in: string;
  signed_our: string;
  created_by?: CustomUserInter;
  created_at: string;
};


export type GetTimeTableInter = {
  id: number;
  specialty__main_specialty__specialty_name: string;
  specialty__academic_year: string;
  specialty__level__level: string;
  year_week: string;
  publish: boolean;
  created_by__full_name?: string;
};

export type GetDayProgramInter = {
  id: number;
  timetable__specialty__id: number;
  timetable__specialty__main_specialty__specialty_name: string;
  timetable__specialty__academic_year: string;
  timetable__specialty__level__level: string;
  timetable__year_week: string;
  period_0812__id: number;
  period_0812__main_course__course_name: string;
  period_0812__assigned_to__id: string;
  period_0812__assigned_to__full_name: string;
  period_1317__id: number;
  period_1317__main_course__course_name: string;
  period_1317__assigned_to__id: string;
  period_1317__assigned_to__full_name: string;
  period_1721__id: number;
  period_1721__main_course__course_name: string;
  period_1721__assigned_to__id: string;
  period_1721__assigned_to__full_name: string;
  day: string;
  period_0812: string;
  period_1317: string;
  assigned: boolean;
  signed_in: string;
  signed_our: string;
  created_by__full_name?: string;
  created_at?: string;
};














export type MondayInter = {
  id: number;
  timetable: TimeTableInter;
  period_0810: string;
  period_1012: string;
  period_1315: string;
  period_1517: string;
  comment: string;
  created_by?: CustomUserInter;
  created_at: string;
  updated_by?: CustomUserInter;
  updated_at: string;
};

export type TuesdayInter = {
  id: number;
  timetable: TimeTableInter;
  period_0810: string;
  period_1012: string;
  period_1315: string;
  period_1517: string;
  comment: string;
  created_by?: CustomUserInter;
  created_at: string;
  updated_by?: CustomUserInter;
  updated_at: string;
};

export type WednesdayInter = {
  id: number;
  timetable: TimeTableInter;
  period_0810: string;
  period_1012: string;
  period_1315: string;
  period_1517: string;
  comment: string;
  created_by?: CustomUserInter;
  created_at: string;
  updated_by?: CustomUserInter;
  updated_at: string;
};

export type ThursdayInter = {
  id: number;
  timetable: TimeTableInter;
  period_0810: string;
  period_1012: string;
  period_1315: string;
  period_1517: string;
  comment: string;
  created_by?: CustomUserInter;
  created_at: string;
  updated_by?: CustomUserInter;
  updated_at: string;
};

export type FridayInter = {
  id: number;
  timetable: TimeTableInter;
  period_0810: string;
  period_1012: string;
  period_1315: string;
  period_1517: string;
  comment: string;
  created_by?: CustomUserInter;
  created_at: string;
  updated_by?: CustomUserInter;
  updated_at: string;
};

export type SaturdayInter = {
  id: number;
  timetable: TimeTableInter;
  period_0810: string;
  period_1012: string;
  period_1315: string;
  period_1517: string;
  comment: string;
  created_by?: CustomUserInter;
  created_at: string;
  updated_by?: CustomUserInter;
  updated_at: string;
};

export type SundayInter = {
  id: number;
  timetable: TimeTableInter;
  period_0810: string;
  period_1012: string;
  period_1315: string;
  period_1517: string;
  comment: string;
  created_by?: CustomUserInter;
  created_at: string;
  updated_by?: CustomUserInter;
  updated_at: string;
};

