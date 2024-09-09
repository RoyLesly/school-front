import { z } from "zod";


const arraySchema = z.number().optional()

export const SchemaCreateEditDomain = z.object({
    domain_name: z.string().trim().min(4, { message: "Must Contain 4 Characters Minimum" }),
})

export const SchemaCreateEditField = z.object({
    domain_id: z.string().trim().min(1, { message: "Must Contain 1 Characters Minimum" }),
    field_name: z.string().trim().min(4, { message: "Must Contain 4 Characters Minimum" }),
})

export const SchemaCreateEditMainSpecialty = z.object({
    field_id: z.string().trim().min(1, { message: "Must Contain 1 Characters Minimum" }),
    specialty_name: z.string().trim().min(5, { message: "Must Contain 5 Characters Minimum" }),
})

export const SchemaCreateEditClassroom= z.object({
    school_id: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum" }),
    domain: z.string().trim().min(2, { message: "Must Contain 2 Characters Minimum" }),
    level_id: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum" }),
    academic_year: z.string().trim().min(4, { message: "Must Contain 4 Characters Minimum" }),
    registration: z.coerce.number().optional(),
    tuition: z.coerce.number().min(1000, { message: "Must Contain Minimum 1000" }),
    payment_one: z.coerce.number().min(1000, { message: "Must Contain Minimum 1000" }),
    payment_two: z.coerce.number().min(1000, { message: "Must Contain Minimum 1000" }),
    payment_three: z.coerce.number().min(1, { message: "Must Contain Minimum 1000" }),
})

export const SchemaCreateEditMainSubject = z.object({
    subject_name: z.string().trim().min(5, { message: "Must Contain 5 Characters Minimum" }),
})

export const SchemaCreateEditSubject = z.object({
    main_subject_id: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum" }),
    classroom_id: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum" }),
    subject_code: z.string().trim().min(3, { message: "Must Contain 3 Characters Minimum" }),
    subject_coefficient: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum" }),
    subject_type: z.string().trim().min(3, { message: "Must Contain 3 Characters Minimum" }),
    assigned: z.boolean(),
    assigned_to_id: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum" }),
    date_assigned: z.string().trim().min(3, { message: "Must Contain 3 Characters Minimum" }),
})

export const SchemaCreateEditResult = z.object({
    id: z.coerce.number().optional(),
    student_id: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum" }),
    subject_id: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum" }),
    seq_1: z.coerce.number().optional(),
    seq_2: z.coerce.number().optional(),
    seq_3: z.coerce.number().optional(),
    seq_4: z.coerce.number().optional(),
    seq_5: z.coerce.number().optional(),
    seq_6: z.coerce.number().optional(),
    created_by_id: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum" }),
    updated_by_id: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum" }),
})

export const SchemaCreateEditPublish = z.object({
    id: z.coerce.number().optional(),
    specialty_id: z.coerce.number(),
    semester: z.string().trim().min(1, { message: "Must Contain 1 Characters Minimum" }),
    ca: z.boolean().optional(),
    exam: z.boolean().optional(),
    resit: z.boolean().optional(),
    portal_ca: z.boolean().optional(),
    portal_exam: z.boolean().optional(),
    portal_resit: z.boolean().optional(),
    updated_by_id: z.coerce.number().optional(),
})

export const SchemaCreateEditDepartment = z.object({
    name: z.string().trim().min(2, { message: "Must Contain 2 Characters Minimum" }),
})

export const SchemaCreateEditLevel = z.object({
    level: z.string().trim().min(2, { message: "Must Contain 2 Characters Minimum" }),
    option: z.string().trim().optional(),
})

export const SchemaCreateEditProgram = z.object({
    name: z.string().trim().min(2, { message: "Must Contain 2 Characters Minimum" }),
    description: z.string().trim().min(2, { message: "Must Contain 2 Characters Minimum" }),
})

export const SchemaAssignClassroom = z.object({
    user_id: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum" }),
    classroom_id: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum" }),
    session: z.string().trim().min(1, { message: "Must Contain 1 Characters Minimum" }),
})


export const SchemaCreateTimeTable = z.object({
    year_week: z.string().trim().min(3, { message: "Must Contain 3 Characters Minimum" }),
    specialty_id: z.coerce.number().optional(),
    publish: z.boolean().optional(),
})

export const SchemaEditTimeTable = z.object({
    id: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum" }),
    year_week: z.string().trim().min(3, { message: "Must Contain 3 Characters Minimum" }),
    specialty_id: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum" }),
    publish: z.boolean()
})

export const SchemaCreateDayProgram = z.object({
    timetable_id: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum" }),
    day: z.string().trim().min(3, { message: "Must Contain 3 Characters Minimum" }),
    period_0812_id: z.coerce.number().optional(),
    period_1317_id: z.coerce.number().optional(),
    period_1721_id: z.coerce.number().optional(),
})

export const SchemaEditDayProgram = z.object({
    id: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum" }),
    timetable_id: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum" }),
    day: z.string().trim().min(3, { message: "Must Contain 3 Characters Minimum" }),
    period_0812_id: z.coerce.number().optional(),
    period_1317_id: z.coerce.number().optional(),
    period_1721_id: z.coerce.number().optional(),
})

export const SchemaCreateEditSecSchoolFees = z.object({
    id: z.coerce.number().optional(),
    secondaryprofile_id: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum" }),
    platform_paid: z.boolean(),
    platform_charges: z.coerce.number().optional(),
    balance: z.coerce.number().optional(),
})

export const SchemaCreateEditTransactions = z.object({
    id: z.coerce.number().optional(),
    secschoolfees_id: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum" }),
    payment_method: z.string().trim().min(3, { message: "Must Select Payment Method" }),
    reason: z.string().trim().min(4, { message: "Must Contain 4 Characters Minimum" }),
    telephone: z.string().optional(),
    payer_name: z.string().trim().optional(),
    ref: z.string().trim().optional(),
    // status: z.string().trim().min(4, { message: "Must Contain 4 Characters Minimum" }),
    operator: z.string().trim().optional(),
    amount: z.coerce.number().optional(),
    balance: z.coerce.number().optional(),
})


export const SchemaTransactionCreate = z.object({
    schoolfees_id: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum"}),
    amount: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum"}),
    telephone: z.coerce.number().min(9, { message: "Must Put Telephone number"}),
    operator: z.string().trim().min(3, { message: "Must Select Payment Method"}),
    payment_method: z.string().trim().min(3, { message: "Must Select Payment Method"}),
    reason: z.string().trim().min(1, { message: "Must Contain 1 Characters Minimum"}),
    status: z.string().optional(),
})

export const SchemaAppearanceUpdate = z.object({
    id: z.coerce.number().min(1, { message: "Must Have and ID"}),
    user_id: z.coerce.number().min(1, { message: "Must Have and ID"}),
    lang: z.string().trim().min(2, { message: "Must Select a Language"}),
    dark_mode: z.string().trim().min(3, { message: "Must Select Dark Mode"}),
})





export type LoginZodType = z.infer<typeof SchemaCreateEditDomain>;