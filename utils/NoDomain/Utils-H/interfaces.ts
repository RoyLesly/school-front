export interface SelectedResultInter {
    id: number,
    student_id: number,
    course_id: number
    ca?: number | string
    exam?: number | string
    resit?: number | string
    created_by_id: number
}