import React from 'react'
import { Link } from 'react-router-dom'

const Unauthorized = () => {
  return (
    <>
      <div>Unauthorized</div>
      <div>
        <Link to="/">Go back to Verify</Link>
      </div>

    </>
    
    
  )
}

export default Unauthorized