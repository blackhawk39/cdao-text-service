import React from "react";
import ChatSearch from "./ChatSearch";

function Chat() {
  return (
    <div className="h-[92vh] w-screen relative bg-[#E8EDF0] border-[1px] border-[#E8EDF0]">
      <div className="user_field flex items-end justify-center gap-3 my-3">
        <div className="bg-green-400/80 min-h-[6vh] w-[80vw] rounded-md text-white flex items-center justify-center px-3 py-2">
          <p className="text-sm text-wrap">
            Lorem ipsum dolor sit amet consectetur adipisicing.Lorem ipsum dolor
            sit amet consectetur adipisicing.Lorem ipsum dolor sit amet
            consectetur adipisicing.Lorem ipsum dolor sit amet consectetur
            adipisicing.Lorem ipsum dolor sit amet consectetur adipisicing.Lorem
          </p>
        </div>
        <div className="h-[5vh] w-[5vh] rounded-full overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSm1CsmtsoTKY-DZRfluy1YGP3q921p4Y1L5Q&s"
            alt=""
          />
        </div>
      </div>
      <div className="chat_field flex items-end justify-center gap-3 my-3">
        <div className="h-[5vh] w-[5vh] rounded-full overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSm1CsmtsoTKY-DZRfluy1YGP3q921p4Y1L5Q&s"
            alt=""
          />
        </div>
        <div className="bg-zinc-300 min-h-[6vh] w-[80vw] rounded-md  text-black flex items-center justify-center px-3 py-2">
          <p className="text-sm text-wrap">
            Lorem ipsum dolor sit amet consectetur adipisicing.Lorem ipsum dolor
            sit amet consectetur adipisicing.Lorem ipsum dolor sit amet
            consectetur adipisicing.Lorem ipsum dolor sit amet consectetur
            adipisicing.Lorem ipsum dolor sit amet consectetur adipisicing.Lorem
            ipsum dolor sit amet consectetur adipisicing.Lorem ipsum dolor sit
            amet consectetur adipisicing.Lorem ipsum dolor sit amet consectetur
            adipisicing.Lorem ipsum dolor sit amet consectetur adipisicing.Lorem
            ipsum dolor sit amet consectetur adipisicing.Lorem ipsum dolor sit
            amet consectetur adipisicing.Lorem ipsum dolor sit amet consectetur
            adipisicing.Lorem ipsum dolor sit amet consectetur adipisicing.Lorem
            ipsum dolor sit amet consectetur adipisicing.Lorem ipsum dolor sit
            amet consectetur adipisicing.Lorem ipsum dolor sit amet consectetur
            adipisicing.Lorem ipsum dolor sit amet consectetur adipisicing.
          </p>
        </div>
      </div>
      <ChatSearch />
    </div>
  );
}

export default Chat;
