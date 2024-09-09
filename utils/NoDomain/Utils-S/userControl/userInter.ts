
export type CustomUserInter = {
  id: number;
  matricle: string;
  username: string;
  full_name: string;
  first_name: string;
  last_name: string;
  address: string;
  sex: string;
  dob: string;
  pob: string;
  role: string;
  dept: string[];
  password: string;
  password_set: boolean;
  telephone: string;
  email: string;
  email_confirmed: boolean;
  is_active: boolean;
  last_login: string;
  created_at: string;
  updated_at: string;
};

export type SecondaryProfileInter = {
  id: number;
  user: CustomUserInter;
  secondary_classroom__id: string;
  secondary_classroom__level__level: string;
  secondary_classroom__level__option: string;
  secondary_classroom__academic_year: string;
  secondary_classroom__domain: string;
  session: string;
  user__is_active: boolean;
  user__is_superuser: boolean;
};


export type ProgramInter = {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
};


export type DeptInter = {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
};


export type AppearanceInter = {
  id: number;
  user: CustomUserInter;
  dark_mode: string;
  lang: string;
};






export type GetDepartmentInter = {
  id: number;
  name: string;
}


export type GetCustomUserInter = {
  id: number;
  matricle: string;
  username: string;
  role: string;
  first_name: string;
  last_name: string;
  full_name: string;
  age: string;
  sex: string;
  address: string;
  telephone: string;
  email: string;
  title: string;
  is_superuser: boolean;
  is_staff?: boolean;
  password_set?: boolean;
  is_active?: string | boolean;
  email_confirmed?: boolean;
  last_login?: string;
  dept: any;
};


export type GetSecondaryProfileInter = {
  id: number;
  user__id: number;
  user__matricle: string;
  user__username: string;
  user__first_name: string;
  user__last_name: string;
  user__full_name: string;
  user__age: string;
  user__sex: string;
  user__address: string;
  user__telephone: string;
  user__email: string;
  user__title: string;
  user__dob: string;
  user__pob: string;
  secondary_classroom__id: string;
  secondary_classroom__level__level: string;
  secondary_classroom__level__option: string;
  secondary_classroom__academic_year: string;
  secondary_classroom__domain: string;
  session: string;
  user__is_active: boolean;
  user__is_superuser: boolean;
};

export type GeAppearanceInter = {
  id: number;
  user__matricle: string;
  user__username: string;
  user__first: string;
  user__full_name: string;
  user__age: string;
  user__sex: string;
  user__address: string;
  user__telephone: string;
  user__email: string;
  user__title: string;
  user__is_active: boolean;
  dark_mode: string;
  lang: string;
};