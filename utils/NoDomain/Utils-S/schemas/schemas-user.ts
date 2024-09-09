import { z } from "zod";


const arraySchema = z.number().optional()

export const DepartmentSchema = z.object({
    id: z.coerce.number().optional(),
    name: z.string().trim().min(4, { message: "Must Contain 4 Characters Minimum"}),
})

export const ProgramSchema = z.object({
    id: z.string().trim().min(1, { message: "Must Contain 1 Characters Minimum"}),
    name: z.string().trim().min(4, { message: "Must Contain 4 Characters Minimum"}),
})

export const SchemaCreateCustomUser = z.object({
    username: z.string().optional(),
    matricle: z.string().optional(),
    first_name: z.string().trim().min(2, { message: "Must Contain 2 Characters Minimum"}),
    last_name: z.string().trim().min(2, { message: "Must Contain 2 Characters Minimum"}),
    password: z.string().optional(),
    sex: z.string().trim().min(2, { message: "Must Contain 2 Characters Minimum"}),
    email: z.string().optional(),
    role: z.string().trim().min(1, { message: "Must Contain 2 Characters Minimum"}),
    telephone: z.coerce.number().optional(),
    parent_name: z.string().trim().optional(),
    prefix: z.string().min(3, { message: "Prefix Required min 2"}),
    parent_telephone: z.coerce.number().optional(),
    title: z.string().optional(),
    dept: z.array(arraySchema).optional(),
    school: z.array(arraySchema).optional(),
    // created_campus_id: z.coerce.number().optional(),
})

export const SchemaEditCustomUser = z.object({
    id: z.string().trim().min(1, { message: "Must Contain 1 Characters Minimum"}),
    username: z.string().trim().min(3, { message: "Must Contain 3 Characters Minimum"}),
    first_name: z.string().trim().min(2, { message: "Must Contain 2 Characters Minimum"}),
    last_name: z.string().trim().min(2, { message: "Must Contain 2 Characters Minimum"}),
    email: z.string().optional(),
    role: z.string().trim().min(2, { message: "Must Contain 2 Characters Minimum"}),
    sex: z.string().optional(),
    title: z.string().optional(),
    is_active: z.boolean().optional(),
    telephone: z.coerce.number().optional(),
    // dept_id: z.array(arraySchema)
    // dept_id: z.array(DepartmentSchema).optional()
})

export const SecondaryProfileCreateSchema = z.object({
    user_id: z.coerce.number().min(1, { message: "Must Contain user Id"}),
    secondary_classroom_id: z.coerce.number().optional(),
    session: z.string().trim().min(4, { message: "Must Contain Session Id"}),
    active: z.boolean().optional(),
})

export const UserProfileStudentEditSchema = z.object({
    user_id: z.coerce.number().min(1, { message: "Must Contain user Id"}),
    classroom_id: z.coerce.number().optional(),
    session: z.string().trim().min(4, { message: "Must Contain Session Id"}),
    active: z.boolean().optional(),
})

export const UserProfileLectAdminEditSchema = z.object({
    user_id: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum"}),
})


export type LoginZodType = z.infer<typeof SchemaCreateCustomUser>;