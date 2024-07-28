import React from "react";
import { IoMenu } from "react-icons/io5";
import { VscSearch } from "react-icons/vsc";

function Navbar({ toggleNavLinks }) {
  return (
    <div className="min-h-[8vh] w-screen flex items-center justify-between px-5 shadow-md">
      <div>
        <IoMenu size={32} onClick={toggleNavLinks} className="cursor-pointer" />
      </div>
      <div>
        <h1 className="text-2xl">Messages</h1>
      </div>
      <div className="flex items-center">
        <VscSearch size={24} />
      </div>
    </div>
  );
}

export default Navbar;
