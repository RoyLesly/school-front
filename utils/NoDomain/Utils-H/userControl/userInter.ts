

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








export type GetCustomUserInter = {
  id: number;
  matricle: string;
  username: string;
  first_name: string;
  last_name: string;
  full_name: string;
  age: string;
  sex: string;
  address: string;
  telephone: string;
  email: string;
  title: string;
  is_active: boolean;
  is_superuser: boolean;
};



export type GetUserProfileInter = {
  id: number;
  user__id: number;
  user__matricle: string;
  user__username: string;
  user__first_name: string;
  user__last_name: string;
  user__full_name: string;
  user__role: string;
  user__age: string;
  user__sex: string;
  user__address: string;
  user__telephone: string;
  user__email: string;
  user__title: string;
  specialty__id: string;
  specialty__main_specialty__specialty_name: string;
  specialty__academic_year: string;
  specialty__level__level: number;
  specialty__tuition: number;
  specialty__payment_one: number;
  specialty__payment_two: number;
  specialty__payment_three: number;
  program__id: number;
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

export type GetProgramInter = {
  id: number;
  name: string;
  description: string;
};