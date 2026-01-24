import DoctorListPage from '@/components/patient/doctorListPage'
import { Loader } from 'lucide-react'
import React, { Suspense } from 'react'

const page = () => {
  return (
    <Suspense fallback={<Loader />}>
      <DoctorListPage />
    </Suspense>
  )
}

export default page