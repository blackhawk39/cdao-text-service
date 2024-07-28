import React from "react";

function NavLinks({ isVisible }) {
  return (
    <div
      className={`min-h-[92vh] w-[65%] flex flex-col items-center justify-start bg-white fixed top-[8vh] left-0 transform transition-transform duration-300 ${
        isVisible ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="userimg relative mt-10">
        <span className="h-[3vh] absolute right-1 w-[3vh] bg-green-600 rounded-full"></span>
        <div className="overflow-hidden h-[10vh] w-[10vh] rounded-full">
          <img
            className="w-full h-full object-cover"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSm1CsmtsoTKY-DZRfluy1YGP3q921p4Y1L5Q&s"
            alt=""
          />
        </div>
      </div>
      <div className="links flex flex-col gap-5 text-black text-3xl mt-[10vh] font-semibold">
        <a href="">Messages</a>
        <a href="">Contacts</a>
        <a href="">Create Group</a>
        <a href="">Invite Friends</a>
        <a href="">Rewards</a>
        <a href="">Settings</a>
      </div>
      <div className="mt-[20vh] text-3xl text-zinc-600">
        <button>Sign Out</button>
      </div>
    </div>
  );
}

export default NavLinks;
