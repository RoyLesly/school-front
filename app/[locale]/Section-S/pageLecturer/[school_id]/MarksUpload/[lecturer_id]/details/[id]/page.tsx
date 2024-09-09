import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb';
import { getData } from '@/functions';
import { Metadata } from 'next';
import React, { FC } from 'react'
import LayoutLecturer from '@/section-h/compLecturer/LayoutLecturer';
import Link from 'next/link';
import { GetCourseUrl, GetPublishUrl } from '@/NoDomain/Utils-H/appControl/appConfig';
import { GetCourseInter } from '@/NoDomain/Utils-H/appControl/appInter';
import { protocol } from '@/config';

const EditPage = async ({
    params,
    searchParams,
}: {
    params: { school_id: string, lecturer_id: string, id: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const course = await getData( protocol + GetCourseUrl , { id: params.id, fieldList: [ "id", "semester", "main_course__course_name", "specialty__id", "specialty__main_specialty__specialty_name" ]})

  return (
    <LayoutLecturer>
      <>
        <Breadcrumb
          pageName="SELECT" 
          pageName1="Home" 
          pageName2="Courses" 
          link1={`/pageLecturer/${params.school_id}`}
          link2={`/pageLecturer/${params.school_id}/MarksUpload/${params.lecturer_id}`}
        />

        {course && course.id && <Select params={params} course={course} /> }

      </>
    </LayoutLecturer>
  )
}

export default EditPage



export const metadata: Metadata = {
  title:
    "Select-Marks",
  description: "This is Marks Page",
};


interface SelectProps {
  params: any
  course: GetCourseInter
}


const Select:FC<SelectProps> = async ( { params, course }) => {

  const publish = await getData(protocol + GetPublishUrl, { specialty__id: course.specialty__id, fieldList: [ "id", "specialty__id", "semester", "ca", "portal_ca", "portal_exam", "portal_resit" ]})

  console.log(publish)
  console.log(course.specialty__id)

  return (
    <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark flex flex-col gap-10 md:gap-20 py-20 rounded-sm shadow-default">

      <div className='flex font-medium italic items-center justify-center mb-4 text-2xl'>{course.main_course__course_name}</div>


      {/* ==================check 1================================= */}
      { publish.count == 1 && 
        !publish.results[0].portal_ca && !publish.results[0].portal_exam && !publish.results[0].portal_resit 
        && <div className='flex flex-col gap-10 items-center justify-center md:flex-row px-10 py-40'>No Opened Portals</div>}

      { publish.count == 2 && 
        !publish.results[0].portal_ca && !publish.results[0].portal_exam && !publish.results[0].portal_resit &&
        !publish.results[1].portal_ca && !publish.results[1].portal_exam && !publish.results[1].portal_resit 
        && <div className='flex flex-col gap-10 items-center justify-center md:flex-row px-10 py-40'>No Opened Portals</div>}
      {/* ==================end check 1================================= */}


      {/* ==================check 2================================= */}
      { publish.count == 2 && publish.results[0].semester == "I" && course.semester == "I"&&
        !publish.results[0].portal_ca && !publish.results[0].portal_exam && !publish.results[0].portal_resit 
        && <div className='flex flex-col gap-10 items-center justify-center md:flex-row px-10 py-40'>No Opened Portals For This Course</div>}

      { publish.count == 2 && publish.results[1].semester == "II" && course.semester == "II"&&
        !publish.results[1].portal_ca && !publish.results[1].portal_exam && !publish.results[1].portal_resit 
        && <div className='flex flex-col gap-10 items-center justify-center md:flex-row px-10 py-40'>No Opened Portals For This Course</div>}
      {/* ==================end check 2================================= */}


      {/* ==================check 3================================= */}
      { publish.count == 1 && publish.results[0].semester == "I" && course.semester == "I" && <div className='flex flex-col gap-10 items-center justify-center md:flex-row md:py-10 px-10'>
        {publish.results[0].portal_ca && <Link 
          className='bg-blue-800 flex font-semibold h-20 items-center justify-center md:h-24 rounded text-center text-white text-xl tracking-wide w-48'
          href={`/pageLecturer/${params.school_id}/MarksUpload/${params.lecturer_id}/details/${params.id}/FillCA`}
        >
            Sem I - CA
          </Link>}
        {publish.results[0].portal_exam && <Link 
          className='bg-blue-800 flex font-semibold h-20 items-center justify-center md:h-24 rounded text-center text-white text-xl tracking-wide w-48'
          href={`/pageLecturer/${params.school_id}/MarksUpload/${params.lecturer_id}/details/${params.id}/FillExam`}
        >
            Sem I - EXAM
          </Link>}
        {publish.results[0].portal_resit && <Link 
          className='bg-blue-800 flex font-semibold h-20 items-center justify-center md:h-24 rounded text-center text-white text-xl tracking-wide w-48'
          href={`/pageLecturer/${params.school_id}/MarksUpload/${params.lecturer_id}/details/${params.id}/FillResit`}
        >
            Sem I - RESIT
          </Link>}
      </div>}





      { publish.count && publish.count == 2 ? 
        <div className='flex flex-col gap-10 items-center justify-center md:flex-row md:py-10 px-10'>
          {publish.results[0].semester == "I" && course.semester == "I" ? 
            <>
              {publish.results[0].portal_ca && <Link 
                className='bg-blue-800 flex font-semibold h-20 items-center justify-center md:h-24 rounded text-center text-white text-xl tracking-wide w-48'
                href={`/pageLecturer/${params.school_id}/MarksUpload/${params.lecturer_id}/details/${params.id}/FillCA`}
              >
                Sem I - CA
              </Link>}
              {publish.results[0].portal_exam && <Link 
                className='bg-blue-800 flex font-semibold h-20 items-center justify-center md:h-24 rounded text-center text-white text-xl tracking-wide w-48'
                href={`/pageLecturer/${params.school_id}/MarksUpload/${params.lecturer_id}/details/${params.id}/FillExam`}
              >
                Sem I - EXAM
              </Link>}
              {publish.results[0].portal_resit && <Link 
                className='bg-blue-800 flex font-semibold h-20 items-center justify-center md:h-24 rounded text-center text-white text-xl tracking-wide w-48'
                href={`/pageLecturer/${params.school_id}/MarksUpload/${params.lecturer_id}/details/${params.id}/FillResit`}
              >
                Sem I - RESIT
              </Link>}
            </> : <></>
          }

          {publish.results[0].semester == "II" && course.semester == "II" ? 
            <>
              {publish.results[0].portal_ca && <Link 
                className='bg-blue-800 flex font-semibold h-20 items-center justify-center md:h-24 rounded text-center text-white text-xl tracking-wide w-48'
                href={`/pageLecturer/${params.school_id}/MarksUpload/${params.lecturer_id}/details/${params.id}/FillCA`}
              >
                Sem II - CA
              </Link>}
              {publish.results[0].portal_exam && <Link 
                className='bg-blue-800 flex font-semibold h-20 items-center justify-center md:h-24 rounded text-center text-white text-xl tracking-wide w-48'
                href={`/pageLecturer/${params.school_id}/MarksUpload/${params.lecturer_id}/details/${params.id}/FillExam`}
              >
                Sem II - EXAM
              </Link>}
              {publish.results[0].portal_resit && <Link 
                className='bg-blue-800 flex font-semibold h-20 items-center justify-center md:h-24 rounded text-center text-white text-xl tracking-wide w-48'
                href={`/pageLecturer/${params.school_id}/MarksUpload/${params.lecturer_id}/details/${params.id}/FillResit`}
              >
                Sem II - RESIT
              </Link>}
            </> : <></>
          }
          {publish.results[1].semester == "I" && course.semester == "I" ? 
            <>
              {publish.results[1].portal_ca && <Link 
                className='bg-blue-800 flex font-semibold h-20 items-center justify-center md:h-24 rounded text-center text-white text-xl tracking-wide w-48'
                href={`/pageLecturer/${params.school_id}/MarksUpload/${params.lecturer_id}/details/${params.id}/FillCA`}
              >
                Sem I - CA
              </Link>}
              {publish.results[1].portal_exam && <Link 
                className='bg-blue-800 flex font-semibold h-20 items-center justify-center md:h-24 rounded text-center text-white text-xl tracking-wide w-48'
                href={`/pageLecturer/${params.school_id}/MarksUpload/${params.lecturer_id}/details/${params.id}/FillExam`}
              >
                Sem I - EXAM
              </Link>}
              {publish.results[1].portal_resit && <Link 
                className='bg-blue-800 flex font-semibold h-20 items-center justify-center md:h-24 rounded text-center text-white text-xl tracking-wide w-48'
                href={`/pageLecturer/${params.school_id}/MarksUpload/${params.lecturer_id}/details/${params.id}/FillResit`}
              >
                Sem I - RESIT
              </Link>}
            </> : <></>
          }
          {publish.results[1].semester == "II" && course.semester == "II" ? 
            <>
              {publish.results[1].portal_ca && <Link 
                className='bg-blue-800 flex font-semibold h-20 items-center justify-center md:h-24 rounded text-center text-white text-xl tracking-wide w-48'
                href={`/pageLecturer/${params.school_id}/MarksUpload/${params.lecturer_id}/details/${params.id}/FillCA`}
              >
                Sem II - CA
              </Link>}
              {publish.results[1].portal_exam && <Link 
                className='bg-blue-800 flex font-semibold h-20 items-center justify-center md:h-24 rounded text-center text-white text-xl tracking-wide w-48'
                href={`/pageLecturer/${params.school_id}/MarksUpload/${params.lecturer_id}/details/${params.id}/FillExam`}
              >
                Sem II - EXAM
              </Link>}
              {publish.results[1].portal_resit && <Link 
                className='bg-blue-800 flex font-semibold h-20 items-center justify-center md:h-24 rounded text-center text-white text-xl tracking-wide w-48'
                href={`/pageLecturer/${params.school_id}/MarksUpload/${params.lecturer_id}/details/${params.id}/FillResit`}
              >
                Sem II - RESIT
              </Link>}
            </> : <></>
          }
        </div> 

        :

        <div className='flex flex-col gap-10 items-center justify-center md:flex-row md:py-10 px-10'>
        {publish.count == 2 && publish.results[1].semester == "I" && course.semester == "I" ? 
          <>
            {publish.results[1].portal_ca && <Link 
              className='bg-blue-800 flex font-semibold h-20 items-center justify-center md:h-24 rounded text-center text-white text-xl tracking-wide w-48'
              href={`/pageLecturer/${params.school_id}/MarksUpload/${params.lecturer_id}/details/${params.id}/FillCA`}
            >
              Sem I - CA
            </Link>}
            {publish.results[1].portal_ca && <Link 
              className='bg-blue-800 flex font-semibold h-20 items-center justify-center md:h-24 rounded text-center text-white text-xl tracking-wide w-48'
              href={`/pageLecturer/${params.school_id}/MarksUpload/${params.lecturer_id}/details/${params.id}/FillExam`}
            >
              Sem I - EXAM
            </Link>}
            {publish.results[1].portal_ca && <Link 
              className='bg-blue-800 flex font-semibold h-20 items-center justify-center md:h-24 rounded text-center text-white text-xl tracking-wide w-48'
              href={`/pageLecturer/${params.school_id}/MarksUpload/${params.lecturer_id}/details/${params.id}/FillResit`}
            >
              Sem I - RESIT
            </Link>}
            </> : <div className='font-medium text-xl tracking-widest'></div>
        }

        {publish.count == 2 && publish.results[1].semester == "II" && course.semester == "II" ? 
          <>
            {publish.results[1].portal_ca && <Link 
              className='bg-blue-800 flex font-semibold h-20 items-center justify-center md:h-24 rounded text-center text-white text-xl tracking-wide w-48'
              href={`/pageLecturer/${params.school_id}/MarksUpload/${params.lecturer_id}/details/${params.id}/FillCA`}
            >
              Sem II - CA
            </Link>}
            {publish.results[1].portal_ca && <Link 
              className='bg-blue-800 flex font-semibold h-20 items-center justify-center md:h-24 rounded text-center text-white text-xl tracking-wide w-48'
              href={`/pageLecturer/${params.school_id}/MarksUpload/${params.lecturer_id}/details/${params.id}/FillExam`}
            >
              Sem II - EXAM
            </Link>}
            {publish.results[1].portal_ca && <Link 
              className='bg-blue-800 flex font-semibold h-20 items-center justify-center md:h-24 rounded text-center text-white text-xl tracking-wide w-48'
              href={`/pageLecturer/${params.school_id}/MarksUpload/${params.lecturer_id}/details/${params.id}/FillResit`}
            >
              Sem II - RESIT
            </Link>}
          </> : <div className='font-medium text-xl tracking-widest'>No Publish Information For This Semester II</div>
        }
      </div> 
          
      }


    
    </div>
  )
}