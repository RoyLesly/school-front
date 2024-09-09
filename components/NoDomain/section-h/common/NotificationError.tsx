'use client'
import React, { FC } from 'react'
// import toast from 'react-hot-toast'
import Swal from 'sweetalert2'


interface Props {
    errorMessage: any
}
const NotificationError:FC<Props> = ({ errorMessage }) => {

    if (errorMessage.success) {
        // toast.success(errorMessage.success.toString());

        const alert = () => {
            Swal.fire({
              title: `${errorMessage.success.toString()}`,
              timer: 3000,
              timerProgressBar: true,
              showConfirmButton: false,
              position: "top-end",
              icon: "success",
            })
          }
          alert()
        return;
    }
    if (errorMessage.created) {
        const alert = () => {
            Swal.fire({
              title: `${errorMessage.created.toString()}`,
              timer: 3000,
              timerProgressBar: true,
              showConfirmButton: false,
              position: "top-end",
              icon: "success",
            })
        }
        alert()        
        return;    }
    if (errorMessage.updated) {
        const alert = () => {
            Swal.fire({
              title: `${errorMessage.updated.toString()}`,
              timer: 3000,
              timerProgressBar: true,
              showConfirmButton: false,
              position: "top-end",
              icon: "success",
            })
        }
        alert()        
        return;
    }
    if (errorMessage.error) {
        const alert = () => {
            Swal.fire({
              title: `${errorMessage.error.toString()}`,
              timer: 3000,
              timerProgressBar: true,
              showConfirmButton: false,
              position: "top-end",
              icon: "error",
            })
        }
        alert()        
        return;
    }
    if (errorMessage.deleted) {
        const alert = () => {
            Swal.fire({
              title: `${errorMessage.deleted.toString()}`,
              timer: 3000,
              timerProgressBar: true,
              showConfirmButton: false,
              position: "top-end",
              icon: "warning",
            })
        }
        alert()        
        return;
    }
    
    return (
        <></>
    )
}

export default NotificationError