import React from 'react'

const LinkedInSignin = () => {
  return (
    <button className='btn bg-[#0967C2] text-[1.2rem] text-white border-[#0059b3] w-full'>
      <svg
        aria-label='LinkedIn logo'
        width='26'
        height='26'
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 32 32'
      >
        <path
          fill='white'
          d='M26.111,3H5.889c-1.595,0-2.889,1.293-2.889,2.889V26.111c0,1.595,1.293,2.889,2.889,2.889H26.111c1.595,0,2.889-1.293,2.889-2.889V5.889c0-1.595-1.293-2.889-2.889-2.889ZM10.861,25.389h-3.877V12.87h3.877v12.519Zm-1.957-14.158c-1.267,0-2.293-1.034-2.293-2.31s1.026-2.31,2.293-2.31,2.292,1.034,2.292,2.31-1.026,2.31-2.292,2.31Zm16.485,14.158h-3.858v-6.571c0-1.802-.685-2.809-2.111-2.809-1.551,0-2.362,1.048-2.362,2.809v6.571h-3.718V12.87h3.718v1.686s1.118-2.069,3.775-2.069,4.556,1.621,4.556,4.975v7.926Z'
          fillRule='evenodd'
        ></path>
      </svg>
      Login with LinkedIn
    </button>
  )
}

export default LinkedInSignin
