const User = require('../models/User');
const ChatRoom = require('../models/ChatRoom');
const Reminder = require('../models/Reminder');
const transporter = require('../config/nodemailer');

module.exports.getChatList = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findOne({ _id: userId }).populate({
      path: 'joinedRooms',
      options: {sort:{'updatedAt':-1}}
    });
    const roomsArray = user.joinedRooms ;

    return res.status(200).json({ roomsArray });
  } catch (error) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports.getChatRoom = async (req, res) => {
  try {
    const roomId = req.params.roomid;
    const room = await ChatRoom.findById(roomId)
      .populate('joinedUsers', 'name')
      .populate('Meet');
    const participants = [];

    for (const ju of room.joinedUsers) {
      participants.push(ju.name);
    }

    return res.status(200).json({ room, participants, Meet: room.Meet });
  } catch (error) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports.createChatMeetRoom = async (req, res) => {
  try {
    // console.log(req.body);
    const { roomLink, emailArr, roomName, joinedUsers, StartTime, EndTime } =
      req.body;

    let event = new Reminder({
      Description: roomLink,
      StartTime,
      EndTime,
      isAllDay: false,
      Subject: roomName,
      userId: joinedUsers[0],
    });

    await event.save(async function (err, result) {
      if (err) {
        console.log('Event save error: **', err);
        return;
      }

      let meetId = result._id ;
      try {
        let meetRoom = new ChatRoom({
          title: roomName,
          joinedUsers,
          Meet: result._id,
        });

        await meetRoom.save(async function (err, result) {
          if (err) {
            console.log('Chat room save error: **', err);
            return;
          }

          try {
            console.log('Updating user with room ids!');
            const roomid = result._id;
            await User.updateOne(
              { _id: joinedUsers[0] },
              { $push: { joinedRooms: roomid } }
            );

            let finalRoomLink = `/room/${roomid}` 
            await Reminder.updateOne({_id:meetId},{
              Description : finalRoomLink
            })

            let user = await User.findById(joinedUsers[0]) ;
            emailArr.forEach((email) => {
              mailFunction(email,roomName,StartTime,user.name,user.email,roomid);
            });

            return res
              .status(200)
              .json({ msg: 'Meet Created', type: 'success' });
          } catch (error) {
            console.log('Chat room save error:', err);
          }
        });
      } catch (error) {
        console.log('Event save error:', err);
      }
    });
  } catch (error) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports.updateChatRoom = async (req, res) => {
  try {
  } catch (error) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports.joinChatRoom = async (req, res) => {
  try {
    const chatRoomId = req.params.chatRoomId;
    const userId = req.user.id;
    ChatRoom.findById(chatRoomId, function (err, room) {
      if (err) {
        return res
          .status(200)
          .json({ success: false, msg: 'Room does not exist' });
      } else {
        if (room.joinedUsers.includes(userId)) {
          return res.status(200).json({ success: true, msg: 'Already joined' });
        } else {
          ChatRoom.findOneAndUpdate(
            { _id: chatRoomId },
            { $push: { joinedUsers: userId } },
            { new: true },
            (err, doc) => {
              if (err) {
                console.log('Something wrong when updating data!');
                return res
                  .status(200)
                  .json({ msg: 'Error while joining', success: false });
              } else {
                // if meet add to calendar
                if(doc.Meet){
                  Reminder.findById(doc.Meet,async (err,meet) => {
                    if (err) {
                      console.log('Something wrong when adding to Calendar!');
                      return res
                        .status(200)
                        .json({ msg: 'Error while Adding to Calendar', success: false });
                    }else{
                      let newMeet = new Reminder({
                        Description:meet.Description,
                        StartTime:meet.StartTime,
                        EndTime:meet.EndTime ,
                        userId : userId ,
                        Subject:meet.Subject
                      }) ;
                      await newMeet.save() ;
                    }
                  })
                }
                User.findOneAndUpdate(
                  { _id: userId },
                  { $push: { joinedRooms: chatRoomId } },
                  { new: true },
                  (err, doc) => {
                    if (err) {
                      console.log('Something wrong when updating data!');
                      return res
                        .status(200)
                        .json({ msg: 'Error while joining', success: false });
                    } else {
                      return res.status(200).json({ success: true });
                    }
                  }
                );
              }
            }
          );
        }
      }
    });
  } catch (error) {
    console.error(err.message);
    return res.status(500).json({ msg: 'Unable to join', success: false });
  }
};

const mailFunction = (sendTo,roomName,StartTime,userName,userEmail,roomid) => {
  let smtpTransport = transporter;
  let date = new Date(StartTime) ;

  let mailOptions = {
    from: 'microsoftteamsclonemailer@gmail.com',
    to: `${sendTo}`,
    subject: 'Invite Mail',
    html: `
            <h1> Invitation to meeting: <u>${roomName}</u> on ${date} by ${userName} with email : ${userEmail}  </h1>
            <br />
            <h5> <a href="https://connect-x.vercel.app/invite/${roomid}"> Accept Invite and Add To Calendar </a> </h5>
        `,
  };

  smtpTransport.sendMail(mailOptions, (err, response) => {
    if (err) {
      console.log('Mail Not Sent', err);
    } else {
      console.log('Mail Sent');
    }
  });
};
