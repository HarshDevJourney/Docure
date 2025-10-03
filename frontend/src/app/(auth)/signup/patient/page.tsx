import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <>
      <div>sign</div>
      {"     "}
      <Link href={"/login/patient"}>login</Link>
    </>
  );
}

export default page