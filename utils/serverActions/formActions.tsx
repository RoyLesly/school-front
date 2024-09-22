"use server";

import { SchemaPlatformChargesCreate, SchemaTranscriptApplicationCreate, SchemaTranscriptApplicationEditApprove, SchemaTranscriptApplicationEditPrint } from "@/Domain/schemas/schemas";
import { collectMoney } from "@/payment";
import { ActionCreate, ActionEdit } from "./actionGeneral";
import { protocol } from "@/config";
import { TranscriptApplicationUrl } from "@/Domain/Utils-H/feesControl/feesConfig";
import { getSession } from "@/Domain/Utils-S/serverActions/sessionAction";
import { jwtDecode } from "jwt-decode";

export const makePayment = async (state: any, formData: FormData) => {
    const result = await SchemaPlatformChargesCreate.safeParse({
        telephone: formData.get("telephone"),
        amount: formData.get("amount"),
        service: formData.get("operator"),
    })
    console.log(state, 12)
    if (result.success){
        // var pay: { operation: boolean, transaction: boolean } | any = await collectMoney({ amount: result.data.amount, service: result.data.service, payer: result.data.telephone })
        // console.log(pay, 15)
        return { data: result.data }
    }
    if (result.error){
        console.log(result, 19)
        return { error: result.error.format() }
    }
}

export const TranscriptApply = async (state: any, formData: FormData) => {
    const result = await SchemaTranscriptApplicationCreate.safeParse({
        userprofile_id: formData.get("userprofile_id"),
        print_count: 1,
        status: "PENDING",
    })
    var domain = formData.get("domain")
    if (result.success){
        const response = await ActionCreate(result.data, SchemaTranscriptApplicationCreate, protocol + "api" + domain + TranscriptApplicationUrl)
        return { data: response}
    }
    if (result.error){
        return { error: result.error.format() }
    }
}

export const TranscriptApprove = async (state: any, formData: FormData) => {
    const session = await getSession();
    var approved_by_id: any = 0
    if (session){
        var t = jwtDecode(session.access)
        approved_by_id = t.user_id
    }
    const result = await SchemaTranscriptApplicationEditApprove.safeParse({
        id: formData.get("id"),
        userprofile_id: formData.get("userprofile_id"),
        print_count: 1,
        status: "APPROVED",
        approved_by_id: approved_by_id,
        approved_at: new Date().toISOString().slice(0, 10)
    })
    var domain = formData.get("domain")
    if (result.success){
        const response = await ActionEdit(result.data, result.data.id, SchemaTranscriptApplicationEditApprove, protocol + "api" + domain + TranscriptApplicationUrl)
        return { data: response}
    }
    if (result.error){
        return { error: result.error.format() }
    }
}

export const TranscriptPrint = async (state: any, formData: FormData) => {
    const session = await getSession();
    var printed_by_id: any = 0
    if (session){
        var t = jwtDecode(session.access)
        printed_by_id = t.user_id
    }
    const result = await SchemaTranscriptApplicationEditPrint.safeParse({
        id: formData.get("id"),
        userprofile_id: formData.get("userprofile_id"),
        print_count: formData.get("print_count"),
        status: "PRINTED",
        printed_by_id: printed_by_id,
        printed_at: new Date().toISOString().slice(0, 10)
    })
    var domain = formData.get("domain")
    if (result.success){
        const response = await ActionEdit({...result.data, print_count: result.data.print_count + 1}, result.data.id, SchemaTranscriptApplicationEditPrint, protocol + "api" + domain + TranscriptApplicationUrl)
        return { data: response}
    }
    if (result.error){
        return { error: result.error.format() }
    }
}