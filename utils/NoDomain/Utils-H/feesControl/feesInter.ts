export type SchoolFeesInter = {
  id: number;
  name: string;
  account_name: string;
  description: string;
  created_at: string;
  updated_at: string;
};

export type TransactionsInter = {
  id: number;
  name: string;
  account_name: string;
  description: string;
  created_at: string;
  updated_at: string;
};

export type PaymentMethodsInter = {
  id: number;
  name: string;
  account_name: string;
  description: string;
  created_at: string;
  updated_at: string;
};




export type GetSchoolFeesInter = {
  id: number;
  userprofile__id: number;
  userprofile__user__full_name: string;
  userprofile__user__username: string;
  userprofile__user__role: string;
  userprofile__user__matricle: string;
  userprofile__specialty__main_specialty__specialty_name: string;
  userprofile__specialty__academic_year: string;
  userprofile__specialty__level__level: string;
  userprofile__specialty__tuition: number;
  userprofile__specialty__payment_one: number;
  userprofile__specialty__payment_two: number;
  userprofile__specialty__payment_three: number;
  platform_charges: string;
  platform_paid: string;
  balance: number;
};

export type GetTransactionsInter = {
  id: number;
  schoolfees__id: number;
  schoolfees__userprofile__user__matricle: string;
  schoolfees__userprofile__user__full_name: string;
  schoolfees__userprofile__specialty__tuition: number;
  schoolfees__userprofile__specialty__academic_year: string;
  schoolfees__userprofile__specialty__level__level: number;
  schoolfees__userprofile__specialty__main_specialty__specialty_name: string;
  schoolfees__balance: number;
  payment_method: string;
  ref: string;
  reason: string;
  amount: string;
  telephone: string;
  payer_name: string;
  status: string;
  operator: string;
  created_by__full_name: string;
  updated_by__full_name: string;
  created_at: string;
};

export type GetPaymentMethodInter = {
  id: number;
  name: string;
  account_name: string;
  description: string;
  created_at: string;
  updated_at: string;
};


