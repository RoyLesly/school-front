'use client';
import React, { FC, useState } from 'react'
import MainCoursesList from './MainCoursesList';
import SelectedMainCourses from './SelectedMainCourses';
import EditSelectedMainCourses from './EditSelectedMainCourses';
import { MainCourseInter } from '@/Domain/Utils-H/appControl/appInter';


export interface SelectedMainCousesAssignProps {
    main_course_id: number
    main_course__course_name: string
    specialty_id: number
    course_code: string
    course_type: string
    semester: string
    course_credit: number
    completed: boolean
    assigned: boolean
    paid: boolean
    hours: number
    hours_left: number
    assigned_to_id?: number
}

interface SaleActionProps {
    apiData: any
    searchParams: any
    apiLecturer?: any
    apiAdmin?: any
}

const CourseAssignAction: FC<SaleActionProps> = ({ apiData, searchParams, apiLecturer, apiAdmin }) => {

    const [page, setPage] = useState<number>(1)
    const [selectedMainCoursesAssign, setSelectedMainCoursesAssign] = useState<SelectedMainCousesAssignProps[]>()

    const addMainCourseItems = (selMainCourse: MainCourseInter) => {
        if (selectedMainCoursesAssign) {
            var found = selectedMainCoursesAssign.find(item => item.main_course_id == selMainCourse.id)
            if (found) {

            } else {
                let item: SelectedMainCousesAssignProps = {
                    main_course_id: selMainCourse.id,
                    main_course__course_name: selMainCourse.course_name,
                    specialty_id: searchParams.specialty_id,
                    course_code: "",
                    course_type: "",
                    semester: searchParams.semester,
                    course_credit: 1,
                    completed: false,
                    assigned: true,
                    paid: true,
                    hours: 1,
                    hours_left: 1,
                };
                setSelectedMainCoursesAssign([...selectedMainCoursesAssign, item])
            }
        } else {
            let item: SelectedMainCousesAssignProps = {
                main_course_id: selMainCourse.id,
                main_course__course_name: selMainCourse.course_name,
                specialty_id: searchParams.specialty_id,
                course_code: "",
                course_type: "",
                semester: searchParams.semester,
                course_credit: 1,
                completed: false,
                assigned: true,
                paid: true,
                hours: 1,
                hours_left: 1,
            };
            setSelectedMainCoursesAssign([item])
        }
    }

    return (
        <div className='flex flex-col-reverse gap-10 md:flex-row w-full'>

            {apiData && page == 1 &&
                <MainCoursesList
                    data={apiData}
                    addMainCourseItems={addMainCourseItems}
                />
            }

            {selectedMainCoursesAssign && selectedMainCoursesAssign.length > 0 && page == 1 &&
                <div className='flex flex-col gap-2 w-2/3'>
                    <div className='font-bold py-2 text-lg tracking-widest'>Selected Courses</div>
                    <SelectedMainCourses
                        selectedMainCoursesAssign={selectedMainCoursesAssign}
                        setPage={setPage}
                        setData={setSelectedMainCoursesAssign}
                        page={page}
                    />
                </div>
            }

            {selectedMainCoursesAssign && selectedMainCoursesAssign.length > 0 && page == 2 &&
                <EditSelectedMainCourses
                    selectedMainCoursesAssign={selectedMainCoursesAssign}
                    setData={setSelectedMainCoursesAssign}
                    setPage={setPage}
                    page={page}
                    apiLecturer={apiLecturer}
                    apiAdmin={apiAdmin}
                />
            }

        </div>
    )
}

export default CourseAssignAction