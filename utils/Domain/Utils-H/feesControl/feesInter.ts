export type AccountInter = {
  id: number;
  name: string;
  number: string;
  year: string;
  balance: number;
  status: boolean;
};

export type SchoolFeesInter = {
  id: number;
  userprofile__id: number;
  platform_charges: number;
  platform_paid: boolean;
  balance: number;
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





export type GetAccountInter = {
  id: number;
  name: string;
  number: string;
  year: string;
  balance: number;
  status: string;
}


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
  payment_method: string;
  ref: string;
  reason: string;
  account: string;
  operation_type: string;
  amount: number;
  telephone: string;
  payer_name: string;
  status: string;
  operator: string;
  created_by__full_name: string;
  updated_by__full_name: string;
  created_at: string;
  schoolfees__userprofile__id: number;
  schoolfees__userprofile__user__full_name: string;
  schoolfees__userprofile__user__username: string;
  schoolfees__userprofile__user__role: string;
  schoolfees__userprofile__user__matricle: string;
  schoolfees__userprofile__specialty__main_specialty__specialty_name: string;
  schoolfees__userprofile__specialty__academic_year: string;
  schoolfees__userprofile__specialty__level__level: string;
  schoolfees__userprofile__specialty__tuition: number;
  schoolfees__userprofile__specialty__payment_one: number;
  schoolfees__userprofile__specialty__payment_two: number;
  schoolfees__userprofile__specialty__payment_three: number;
  schoolfees__balance: number;
  from_account__id: number;
  from_account__name: string;
  to_account__id: number;
  to_account__name: string;
};

export type GetTranscriptApplicationInter = {
  id: number;
  status: string;
  created_by__full_name: string;
  updated_by__full_name: string;
  created_at: string;
  userprofile__id: number;
  userprofile__user__full_name: string;
  userprofile__user__matricle: string;
  userprofile__user__telephone: string;
  userprofile__specialty__main_specialty__specialty_name: string;
  userprofile__specialty__academic_year: string;
  userprofile__specialty__level__level: string;
  userprofile__specialty__tuition: number;
  userprofile__specialty__payment_one: number;
  userprofile__specialty__payment_two: number;
  userprofile__specialty__payment_three: number;
  print_count: number;
  approved_by__id: number;
  approved_by__full_name: string;
  approved_at: string;
  printed_by__id: number;
  printed_by__full_name: string;
  printed_at: string;
};

export type GetPaymentMethodInter = {
  id: number;
  name: string;
  account_name: string;
  description: string;
  created_at: string;
  updated_at: string;
};


