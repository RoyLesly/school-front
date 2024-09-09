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







export type GetSecSchoolFeesInter = {
  id: number;
  secondaryprofile__id: number;
  secondaryprofile__user__full_name: string;
  secondaryprofile__user__username: string;
  secondaryprofile__user__role: string;
  secondaryprofile__user__matricle: string;
  secondaryprofile__secondary_classroom__tuition: number;
  secondaryprofile__secondary_classroom__level__level: string;
  secondaryprofile__secondary_classroom__level__option: string;
  secondaryprofile__secondary_classroom__academic_year: string;
  secondaryprofile__secondary_classroom__domain: string;
  platform_charges: string;
  platform_paid: string;
  balance: number;
};

export type GetSecTransactionsInter = {
  id: number;
  payment_method: string;
  ref: string;
  reason: string;
  amount: number;
  telephone: string;
  payer_name: string;
  status: string;
  operator: string;
  secschoolfees__secondaryprofile__user__full_name: string;
  secschoolfees__secondaryprofile__secondaryclassroom__level__level: string;
  secschoolfees__secondaryprofile__secondaryclassroom__academic_year: string;
  created_by__full_name: string;
  updated_by__full_name: string;
  created_at: string;
};

export type GetSecPaymentMethodInter = {
  id: number;
  name: string;
  account_name: string;
  description: string;
  created_at: string;
  updated_at: string;
};


