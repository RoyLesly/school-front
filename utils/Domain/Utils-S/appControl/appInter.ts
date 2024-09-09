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

export type ClassroomInter = {
  id: number;
  school: SchoolInfoInter;
  domain: string;
  academic_year: string;
  level: LevelInter;
  tuition: number;
  created_by?: CustomUserInter;
  created_at: string;
  updated_by?: CustomUserInter;
  updated_at: string;
};

export type MainSubjectInter = {
  id: number;
  subject_name: string;
  created_by?: CustomUserInter;
  created_at: string;
  updated_by?: CustomUserInter;
  updated_at: string;
};

export type SubjectInter = {
  id: number;
  main_subject: MainSubjectInter;
  classroom: ClassroomInter;
  subject_code: string;
  subject_coefficient: string;
  subject_type: string;
  assigned: boolean;
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
  option: string;
  created_by?: CustomUserInter;
  created_at: string;
  updated_by?: CustomUserInter;
  updated_at: string;
};

export type ResultInter = {
  id: number;
  student: UserProfileInter;
  subject: SubjectInter;
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
  classroom: ClassroomInter;
  semester: string;
  ca: boolean;
  exam: boolean;
  resit: boolean;
  created_by?: CustomUserInter;
  created_at: string;
  updated_by?: CustomUserInter;
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


export type GetClassroomInter = {
  id: number;
  level__id: number;
  level__level: string;
  level__option: string;
  domain: string;
  school__campus__id: number;
  school__campus__name: string;
  school__school_name: string;
  academic_year: string;
  tuition: string;
  registration: number;
  payment_one: number;
  payment_two: number;
  payment_three: number;
  created_by__full_name?: string;
};


export type GetMainSubjectInter = {
  id: number;
  subject_name: string;
  created_by__full_name?: string;
};


export type GetSubjectInter = {
  id: number;
  main_subject__id: string;
  main_subject__subject_name: string;
  classroom__id: string;
  classroom__level__level: string;
  classroom__level__option: string;
  classroom__academic_year: string;
  classroom__school__campus__region: string;
  classroom__school__campus__name: string;
  subject_coefficient: string;
  subject_type: string;
  subject_code: string;
  assigned: boolean;
  paid: boolean;
  assigned_to__id?: string;
  assigned_to__full_name?: string;
  date_assigned: string;
  created_by__full_name?: string;
};


export type GetResultInter = {
  id: number;
  student__id: number;
  student__user__full_name: string;
  student__user__matricle: string;
  student__user__telephone: string;
  subject__id: number;
  subject__main_subject__subject_name: string;
  subject__classroom__id: string;
  subject__classroom__level: string;
  subject__classroom__option: string;
  subject__assigned_to__full_name: string;
  seq_1: number;
  seq_2: number;
  seq_3: number;
  seq_4: number;
  seq_5: number;
  seq_6: number;
  average_term_1: number;
  average_term_2: number;
  average_term_3: number;
  passed_1: boolean;
  passed_2: boolean;
  passed_3: boolean;
  publish_seq_1: boolean;
  publish_seq_2: boolean;
  publish_seq_3: boolean;
  publish_seq_4: boolean;
  publish_seq_5: boolean;
  publish_seq_6: boolean;
  publish_term_1: boolean;
  publish_term_2: boolean;
  publish_term_3: boolean;
  active: boolean;
  created_by__full_name?: string;
  created_by__id?: number;
  updated_at?: string;
};

export type GetTermResultInter = {
  id: number;
  count: string;
  grade_1: string;
  grade_2: string;
  grade_3: string;
  anual_average: number;
  average_term_1: number;
  average_term_2: number;
  average_term_3: number;
  subject_coefficient: number;
  total_marks: number | null;
  total: number | null;
  total_1: number | null;
  total_2: number | null;
  total_3: number | null;
  subject_name: string;
  subject_code: string;
  seq_1: number;
  seq_2: number;
  seq_3: number;
  seq_4: number;
  seq_5: number;
  seq_6: number;
};


export type GetLevelInter = {
  id: number;
  level: number;
  option: string;
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


export type GetSchoolInfoInter = {
  id: number;
  campus__name: string;
  campus__region: string;
  main_school: boolean;
  school_name: string;
  school_name_short: string;
  country: string;
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