'use client';
import { MainSubjectInter } from '@/Domain/Utils-S/appControl/appInter';
import React, { FC, useState } from 'react'
import MainSubjectsList from './MainSubjectsList';
import SelectedMainSubjects from './SelectedMainSubject';
import EditSelectedMainCourses from './EditSelectedMainCourses';


export interface SelectedMainSubjectsAssignProps {
    main_subject_id: number
    main_subject__subject_name: string
    classroom_id: number
    subject_code: string
    subject_type: string
    subject_coefficient: number
    assigned: boolean
    date_assigned: string
    assigned_to_id?: number
}

interface SaleActionProps {
    apiData: any
    searchParams: any
    apiLecturer?: any
    apiAdmin?: any
}

const SubjectAssignAction: FC<SaleActionProps> = ({ apiData, searchParams, apiLecturer, apiAdmin }) => {

    const [page, setPage] = useState<number>(1)
    const [selectedMainSubjectsAssign, setselectedMainSubjectsAssign] = useState<SelectedMainSubjectsAssignProps[]>()
    
    const addMainSubjectItems = (selMainSubject: MainSubjectInter) => {
        if (selectedMainSubjectsAssign) {
            var found = selectedMainSubjectsAssign.find(item => item.main_subject_id == selMainSubject.id)
            if (found) {

            } else {
                let item: SelectedMainSubjectsAssignProps = {
                    main_subject_id: selMainSubject.id,
                    main_subject__subject_name: selMainSubject.subject_name,
                    classroom_id: searchParams.classroom_id,
                    subject_code: "",
                    subject_type: "",
                    date_assigned: new Date().toISOString().slice(0, 10),
                    subject_coefficient: 1,
                    assigned: true,
                };
                setselectedMainSubjectsAssign([...selectedMainSubjectsAssign, item])
            }
        } else {
            let item: SelectedMainSubjectsAssignProps = {
                main_subject_id: selMainSubject.id,
                main_subject__subject_name: selMainSubject.subject_name,
                classroom_id: searchParams.classroom_id,
                subject_code: "",
                subject_type: "",
                date_assigned: new Date().toISOString().slice(0, 10),
                subject_coefficient: 1,
                assigned: true,
            };
            setselectedMainSubjectsAssign([item])
        }
    }

    return (
        <div className='flex flex-col-reverse gap-10 md:flex-row w-full'>

            {apiData && page == 1 &&
                <MainSubjectsList
                    data={apiData}
                    addMainSubjectItems={addMainSubjectItems}
                />
            }

            {selectedMainSubjectsAssign && selectedMainSubjectsAssign.length > 0 && page == 1 &&
                <div className='flex flex-col gap-2 w-2/3'>
                    <div className='flex font-bold items-center justify-center py-2 text-lg tracking-widest'>Selected Courses</div>
                    <SelectedMainSubjects
                        selectedMainSubjectsAssign={selectedMainSubjectsAssign}
                        setPage={setPage}
                        setData={setselectedMainSubjectsAssign}
                        page={page}
                    />
                </div>
            }

            {selectedMainSubjectsAssign && selectedMainSubjectsAssign.length > 0 && page == 2 &&
                <EditSelectedMainCourses
                    selectedMainSubjectsAssign={selectedMainSubjectsAssign}
                    setData={setselectedMainSubjectsAssign}
                    setPage={setPage}
                    page={page}
                    apiLecturer={apiLecturer}
                    apiAdmin={apiAdmin}
                />
            }

        </div>
    )
}

export default SubjectAssignAction