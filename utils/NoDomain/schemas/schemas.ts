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

export const SchemaCreateSpecialty = z.object({
    academic_year: z.string().trim().min(4, { message: "Must Contain 4 Characters Minimum" }),
    school_id: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum" }),
    main_specialty_id: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum" }),
    level_id: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum" }),
    tuition: z.coerce.number().min(1000, { message: "Must Contain Minimum 1000" }),
    payment_one: z.coerce.number().optional(),
    payment_two: z.coerce.number().optional(),
    payment_three: z.coerce.number().optional(),
})

export const SchemaCreateEditSpecialty = z.object({
    id: z.number().optional(),
    academic_year: z.string().trim().min(4, { message: "Must Contain 4 Characters Minimum" }),
    school_id: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum" }),
    main_specialty_id: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum" }),
    level_id: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum" }),
    tuition: z.coerce.number().min(1000, { message: "Must Contain Minimum 1000" }),
    payment_one: z.coerce.number().optional(),
    payment_two: z.coerce.number().optional(),
    payment_three: z.coerce.number().optional(),
})

export const SchemaCreateEditMainCourse = z.object({
    course_name: z.string().trim().min(5, { message: "Must Contain 5 Characters Minimum" }),
})

export const SchemaCreateEditCourse = z.object({
    main_course_id: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum" }),
    specialty_id: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum" }),
    course_code: z.string().trim().min(3, { message: "Must Contain 3 Characters Minimum" }),
    course_credit: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum" }),
    course_type: z.string().trim().min(3, { message: "Must Contain 3 Characters Minimum" }),
    semester: z.string().trim().min(1, { message: "Must Contain 1 Characters Minimum" }),
    hours: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum" }),
    hours_left: z.coerce.number().optional(),
    completed: z.boolean(),
    paid: z.boolean().optional(),
    assigned: z.boolean(),
    assigned_to_id: z.coerce.number().optional(),
    date_assigned: z.string().optional(),
})

export const SchemaCreateEditResult = z.object({
    id: z.coerce.number().optional(),
    student_id: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum" }),
    course_id: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum" }),
    ca: z.coerce.number().optional(),
    exam: z.coerce.number().optional(),
    resit: z.coerce.number().optional(),
    created_by_id: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum" }),
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

export const SchemaCreateEditLevel = z.object({
    level: z.string().trim().min(2, { message: "Must Contain 2 Characters Minimum" }),
})

export const SchemaCreateEditProgram = z.object({
    name: z.string().trim().min(2, { message: "Must Contain 2 Characters Minimum" }),
    description: z.string().trim().min(2, { message: "Must Contain 2 Characters Minimum" }),
})

export const SchemaAssignSpecialty = z.object({
    specialty_id: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum" }),
    user_id: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum" }),
    program_id: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum" }),
    studentID: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum" }),
    domainID: z.coerce.number().min(1, { message: "Must Contain 0 Characters Minimum" }),
    academicYear: z.string().trim().min(1, { message: "Must Contain 1 Characters Minimum" }),
    levelID: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum" }),
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

export const SchemaCreateEditSchoolFees = z.object({
    id: z.coerce.number().optional(),
    userprofile_id: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum" }),
    platform_charges: z.coerce.number().optional(),
    platform_paid: z.boolean(),
    balance: z.coerce.number().optional(),
})

export const SchemaCreateEditTransactions = z.object({
    id: z.coerce.number().optional(),
    schoolfees_id: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum" }),
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

export const SchemaCreateEditNotifiation = z.object({
    target: z.string().trim().min(3, { message: "Must Select Target Group"}),
    message_one: z.string().trim().max(255, { message: "Must Enter Message"}),
    message_two: z.string().trim().max(255, { message: "Must Enter Message"}),
    noti_type: z.string().trim().min(3, { message: "Must Select Notification Category"}),
    role: z.string().trim().min(3, { message: "Must Select Role"}),
    status: z.boolean().optional(),
    schools: z.array(arraySchema).optional(),
    specialty: z.array(arraySchema).optional(),
    domains: z.array(arraySchema).optional(),
    ending_at: z.string().optional(),
})





export type LoginZodType = z.infer<typeof SchemaCreateEditDomain>;