import { NoDomainRootApi } from "@/config"

export const LoginUrl = NoDomainRootApi + "/token/" 
export const RefreshTokenUrl = NoDomainRootApi + "/token/refresh/"
export const ResetPasswordTokensUrl = NoDomainRootApi + "/admin/django_rest_passwordreset/resetpasswordtoken/"
