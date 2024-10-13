import { CourseInter, SpecialtyInter } from "../appControl/appInter";
import { CustomUserInter } from "../userControl/userInter";


export type TimeTableWeekInter = {
  id: number;
  specialty: SpecialtyInter;
  year_week: string;
  publish: boolean;
  created_by?: CustomUserInter;
  created_at: string;
  updated_by?: CustomUserInter;
  updated_at: string;
};

export type TimeTableDayInter = {
  id: number;
  date: string;
  day: string;
  timetableweek_: TimeTableWeekInter;
  created_by?: CustomUserInter;
  created_at: string;
};

export type TimeSlotInter = {
  id: number;
  title: string;
  timetableday :TimeTableDayInter;
  course: CourseInter;
  start: string;
  end: string;
  start_time: string;
  end_time: string;
  hours: number;
  created_by?: CustomUserInter;
  created_at: string;
};


export type GetTimeTableWeekInter = {
  id: number;
  specialty__id: number;
  specialty__main_specialty__specialty_name: string;
  specialty__academic_year: string;
  specialty__level__level: number;
  specialty__main_specialty__field__id: string;
  specialty__main_specialty__field__doamin__id: number;
  specialty__main_specialty__field__doamin_name: string;
  specialty__main_specialty__id: number;
  year_week: string;
  publish: boolean;
  created_by__full_name?: string;
};

export type GetTimeTableDayInter = {
  timetableweek__id: number;
  timetableweek__specialty__id: number;
  timetableweek__specialty__main_specialty__specialty_name: string;
  timetableweek__specialty__academic_year: string;
  timetableweek__specialty__level__level: number;
  timetableweek__specialty__main_specialty__field__id: string;
  timetableweek__specialty__main_specialty__field__doamin__id: number;
  timetableweek__specialty__main_specialty__field__doamin_name: string;
  timetableweek__specialty__main_specialty__id: number;
  timetableweek__year_week: string;
  timetableweek__publish: boolean;
  date: string;
  day: string;
  created_by__full_name?: string;
}


export type GetTimeSlotInter = {
  id: number;
  timetableday__id: number;
  timetableday__date: string;
  timetableday__day: string;
  course__id: number;
  course__main_course__id: number;
  course__main_course__course_name: string;
  timetableday__timetableweek__id: number;
  timetableday__timetableweek__specialty__id: number;
  timetableday__timetableweek__specialty__main_specialty__specialty_name: string;
  timetableday__timetableweek__specialty__academic_year: string;
  timetableday__timetableweek__specialty__level__level: number;
  timetableday__timetableweek__specialty__main_specialty__field__id: string;
  timetableday__timetableweek__specialty__main_specialty__field__doamin__id: number;
  timetableday__timetableweek__specialty__main_specialty__field__doamin_name: string;
  timetableday__timetableweek__specialty__main_specialty__id: number;
  timetableday__timetableweek__year_week: string;
  timetableday__timetableweek__publish: boolean;
  title: string;
  start: string;
  end: string;
  start_time: string;
  end_time: string;
  time?: string;
  hours: number;
  session: string;
  status: string;

  created_by__id?: number;
  created_by__full_name?: string;
  created_at?: string;
  updated_by__id?: number;
  updated_by__full_name?: string;
  updated_at?: string;
};
