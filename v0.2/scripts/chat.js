"use strict";

const chatRooms = ["Room one", "Room two", "Room three"];

let user = {username: "New user enters chat", session: [{room: chatRooms[0], user: "", date: "", message: ""}]};

let socket = io();

let onlineUsers = [];

let statusForUpdateOfOnlineUsers = true;
let statusForUpdateOfSignOut = false;


// *********************************************************************************************************************
function NewMessageInChat(room,user,date,message)
{
    this.room = room;
    this.user = user;
    this.date = date;
    this.message = message;
}

user.session[0] = new NewMessageInChat("ddd","ddd","ddd","User online!");




$("#log-out-button").on("click", logOutUser);




$(document).ready(function(){
    checkWhoIsHere();
    UserOnlineList();
    setInterval(UserOnlineList,10000);
});


// *********************************************************************************************************************
// ----------- CLIENT-SIDE CHAT:


$(document).on("submit", sendMessage);



function sendMessage(e)
{
    e.preventDefault();

    let messageFromClient =  `${createTimeStamp()}|${user.username}|${document.getElementById("chatmess").value}`;

    socket.emit("chat message", messageFromClient);

    // socket.emit("user active", messageFromClient);

    newMessages();

    $("#chatmess").val("");

}

function checkWhoIsHere() //uppdatera med setInterval istället!
{
    user.username = localStorage.getItem("user");
    console.log(`${user.username} online!`);

    $("#this-is-me").text(user.username);


}

function newMessages()
{
    socket.on("chat message", function(msg)
    {
        let newChatMessage = msg.split("|");
        let tempDate = newChatMessage[0];
        let tempUsername = newChatMessage[1];
        let tempMessage = newChatMessage[2];



        let tempCounter=0;

        for(let i=0;i < user.session.length;i++)
        {

            if(user.session[i].message === tempMessage) tempCounter++;
            else user.session[length].message = tempMessage;

        }

        if(tempCounter <= 1)
        {

            let messageToDisplay = `${tempUsername} ${tempDate}:
            ${tempMessage}`;

            $("<p></p>").text(messageToDisplay).appendTo("#list-of-messages");
            console.log(user.session[length-1].message);

        }

    });

}

// *********************************************************************************************************************
function createTimeStamp()
{
    let currentDate = new Date().toLocaleString('en-GB');
    return `${currentDate}`;
}


// *********************************************************************************************************************
function logOutUser()
{


    window.location.assign("/html/logout.html");

}
// *********************************************************************************************************************
function UserOnlineList()
{

    if(statusForUpdateOfOnlineUsers) $.ajax({
        url: "../data/usersOnline.json",
        success: (response) => {
            $("#list-of-users").empty();

            for(let i in response.online)
            {
                let tempUser = response.online[i].username;

                $("<p></p>").text(tempUser).appendTo("#list-of-users");
            }

        },
        error: () => {
            console.log('An error occured')
        }
    });





}