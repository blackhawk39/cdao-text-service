import React from 'react'

function UserMessages() {
  return (
    <>
      <div className="user min-h-10 w-screen  flex items-center justify-between px-4 py-3">
        <div className="h-16 w-16 rounded-full overflow-hidden">
          <img
            className="h-full w-full object-cover "
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSm1CsmtsoTKY-DZRfluy1YGP3q921p4Y1L5Q&s"
            alt=""
          />
        </div>
        <div>
          <h3>John Doe</h3>
          <p>Lorem ipsum dolor sit amet consectetur</p>
        </div>
        <div className="mark h-4 w-4 bg-green-600 rounded-full"></div>
      </div>
      ;
    </>
  );
}

export default UserMessages