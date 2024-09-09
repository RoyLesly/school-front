import { UserProfileInter } from "@/serverActions/interfaces";
import { CustomUserInter } from "../userControl/userInter";


export type CampusInter = {
  id: number;
  name: string;
  region: string;
  created_by?: CustomUserInter;
  created_at: string;
  updated_by?: CustomUserInter;
  updated_at: string;
}

export type SchoolInfoInter = {
  id: number;
  campus: CampusInter;
  main_school: boolean;
  school_name: string;
  school_name_short: string;
  country: string;
  school_type: string;
  po_box: string;
  email: string;
  niu: string;
  telephone: string;
  website: string;
  created_by?: CustomUserInter;
  created_at: string;
  updated_by?: CustomUserInter;
  updated_at: string;
};

export type DomainInter = {
  id: number;
  domain_name: string;
  created_by?: CustomUserInter;
  created_at: string;
  updated_by?: CustomUserInter;
  updated_at: string;
};

export type FieldInter = {
  id: number;
  field_name: string;
  domain: DomainInter;
  created_by?: CustomUserInter;
  created_at: string;
  updated_by?: CustomUserInter;
  updated_at: string;
};

export type MainSpecialtyInter = {
  id: number;
  specialty_name: string;
  field: FieldInter;
  created_by?: CustomUserInter;
  created_at: string;
  updated_by?: CustomUserInter;
  updated_at: string;
};

export type SpecialtyInter = {
  id: number;
  school: SchoolInfoInter;
  main_specialty: MainSpecialtyInter;
  academic_year: string;
  level: LevelInter;
  tuition: number;
  created_by?: CustomUserInter;
  created_at: string;
  updated_by?: CustomUserInter;
  updated_at: string;
};

export type MainCourseInter = {
  id: number;
  course_name: string;
  created_by?: CustomUserInter;
  created_at: string;
  updated_by?: CustomUserInter;
  updated_at: string;
};

export type CourseInter = {
  id: number;
  main_course: MainCourseInter;
  specialty: SpecialtyInter;
  course_code: string;
  course_type: string;
  semester: string;
  course_credit: string;
  completed: boolean;
  assigned: boolean;
  paid: boolean;
  hours: number;
  hours_left: number;
  date_assigned: string;
  assigned_to?: CustomUserInter;
  created_by?: CustomUserInter;
  created_at: string;
  updated_by?: CustomUserInter;
  updated_at: string;
};

export type LevelInter = {
  id: number;
  level: string | number;
  created_by?: CustomUserInter;
  created_at: string;
  updated_by?: CustomUserInter;
  updated_at: string;
};

export type ResultInter = {
  id: number;
  student: UserProfileInter;
  course: CourseInter;
  ca: string;
  exam: string;
  resit: string;
  average: string;
  validated: boolean;
  publish_ca: boolean;
  publish_exam: boolean;
  publish_resit: boolean;
  closed: boolean;
  active: boolean;
  created_by?: CustomUserInter;
  created_at: string;
  updated_by?: CustomUserInter;
  updated_at: string;
};

export type PublishInter = {
  id: number;
  specialty: SpecialtyInter;
  semester: string;
  ca: boolean;
  exam: boolean;
  resit: boolean;
  created_by?: CustomUserInter;
  created_at: string;
  updated_by?: CustomUserInter;
  updated_at: string;
};








export type GetSchoolInfoInter = {
  id: number;
  campus__id:number;
  campus__name:string;
  campus__region:string;
  main_school: boolean;
  school_name: string;
  school_name_short: string;
  school_type: string;
  country: string;
  town?: string;
  po_box: string;
  email: string;
  niu: string;
  telephone: string;
  website: string;
  created_by__full_name?: string;
  created_at: string;
  updated_by__full_name?: string;
  updated_at: string;
};

export type GetDomainInter = {
  id: number;
  domain_name: string;
  created_by__full_name: string;
  created_at: string;
  updated_by__full_name?: string;
  updated_at: string;
};

export type GetFieldInter = {
  id: number;
  field_name: string;
  domain__id: number;
  domain__domain_name: string;
  created_by__full_name: string;
  created_at: string;
  updated_by__full_name?: string;
  updated_at: string;
};


export type GetMainSpecialtyInter = {
  id: number;
  field__id: number;
  field__domain__id: number;
  field__domain__domain_name: string;
  specialty_name: string;
  created_by__full_name?: string;
};


export type GetSpecialtyInter = {
  id: number;
  main_specialty__id: number;
  main_specialty__field__domain__id: number;
  main_specialty__specialty_name: string;
  school__campus__id: number;
  school__campus__name: string;
  school__school_name: string;
  level__id: number;
  level__level: number;
  academic_year: string;
  tuition: string;
  payment_one: number;
  payment_two: number;
  payment_three: number;
  created_by__full_name?: string;
};


export type GetMainCourseInter = {
  id: number;
  field__id: string;
  field_name: string;
  field__domain__id: string;
  field__domain__domain_name: string;
  course_name: string;
  created_by__full_name?: string;
};


export type GetCourseInter = {
  id: number;
  main_course__id: string;
  main_course__course_name: string;
  specialty__id: string;
  specialty__main_specialty__specialty_name: string;
  specialty__main_specialty__field__domain__domain_name: string;
  specialty__academic_year: string;
  specialty__level__level: number;
  specialty__school__campus__region: string;
  specialty__school__campus__name: string;
  course_code: string;
  course_type: string;
  semester: string;
  course_credit: string;
  completed: boolean;
  assigned: boolean;
  paid: boolean;
  assigned_to__id?: string;
  assigned_to__full_name?: string;
  hours: number;
  hours_left: number;
  date_assigned: string;
  created_by__full_name?: string;
};


export type GetResultInter = {
  id: number;
  student__id: number;
  student__user__first_name: string;
  student__user__full_name: string;
  course__id: number;
  course__main_course__course_name: string;
  course__course_code: string;
  course__course_credit: number;
  ca: number;
  exam: number;
  resit: number;
  average: number;
  validated: boolean;
  publish_ca: boolean;
  publish_exam: boolean;
  publish_resit: boolean;
  closed: boolean;
  active: boolean;
  course__assigned_to__full_name: string;
  created_by__full_name?: string;
  updated_at?: string;
};


export type GetLevelInter = {
  id: number;
  level: number;
  created_by__full_name?: string;
  updated_at?: string;
};


export type GetPublishInter = {
  id: number;
  semester: string;
  specialty__main_specialty__specialty_name: string;
  specialty__academic_year: string;
  specialty__level__level: string;
  ca: boolean;
  portal_ca: boolean;
  exam: boolean;
  portal_exam: boolean;
  resit: boolean;
  portal_resit: boolean;
  updated_by__full_name: string;
};