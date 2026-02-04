import React from "react";
import "./chat.css";
import UserImage from "../../img/ChatUser.jpg";
import { IoSearchOutline } from "react-icons/io5";
import { PiDotsThreeOutlineFill } from "react-icons/pi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { GoPlus } from "react-icons/go";

import UserListImg from "../../img/User2.jpg";
import UserListImg2 from "../../img/User3.jpg";
import UserListImg3 from "../../img/user4.jpg";

const Chat = () => {
  const data = [
    {
      UserListImg: UserListImg,
      UserName: "Ritika Mandal",
      Time: "12:00 AM",
      LastMessage: "This is the last message you....",
    },
    {
      UserListImg: UserListImg2,
      UserName: "Priyanka Rajput",
      Time: "Yesterday",
      LastMessage: "This is the last message you....",
    },
    {
      UserListImg: UserListImg3,
      UserName: "Priyanka Rajput",
      Time: "10:00 AM",
      LastMessage: "This is the last message you....",
    },
    {
      UserListImg: UserListImg,
      UserName: "Priyanka Rajput",
      Time: "9:00 PM",
      LastMessage: "This is the last message you....",
    },
  ];
  return (
    <div className="container-fluid max_width">
    <div className="row">
      <div className="col-lg-3 border border-1 m-0 p-0">
      <div className='chat-container'>
       <div className="AllChat_container">
        <div className="user_bar d-flex align-items-center justify-content-between ">
          <div className="user_image_controller">
            <img src={UserImage} alt="image" />
          </div>
          <div className="search_member">
            <input type="text" placeholder="search" />
            <div className="search_btn_icon">
              <IoSearchOutline />
            </div>
          </div>
          <div className="options">
            <GoPlus className="add_icon" />
            <BsThreeDotsVertical />
          </div>
        </div>
        <div className="row m-auto my-3 mx-2">
          <select className="py-1">
            <option value="Manager">Manager</option>
            <option value="HR">HR</option>
            <option value="Manager">Admin</option>
            <option value="Manager">Employee</option>
          </select>
        </div>
        <div className="user_list">
        {data.map((user, index) => (
        <div className="user_list my-4 px-2 d-flex" key={index}>
          <div className="user_image_container">
            <div className="user_list_image_controller">
              <img src={user.UserListImg} alt="image" />
            </div>
          </div>
          <div className="name_user_list px-1">
            <div className="namee d-flex justify-content-between ">
              <h6 className="m-0 p-0">{user.UserName}</h6>

              <p
                className="m-0 p-0 px-1"
                style={{ color: "grey", fontSize: "11px" }}
              >
                {user.Time}
              </p>
            </div>
            <p className="my-1 p-0" style={{ color: "grey", fontSize: "14px" }}>
              {user.LastMessage}
            </p>
          </div>
        </div>
      ))}
        </div>
      </div>
     
    </div>
      </div>
      <div className="col-lg-9 border border-1 m-0 p-0">col2</div>
    </div>
  </div>
   
  )
}

export default Chat
