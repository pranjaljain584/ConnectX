import React, { useEffect, useState } from 'react';
import '../../assets/css/messenger.css';

function Messenger({
  msg,
  setMsg,
  handleSubmit,
  incomingMsg,
  head,
  participants,
}) {
  const [msgArray, setMsgArray] = useState([]);
  useEffect(() => {
    setMsgArray((prevState) => {
      return [...prevState, incomingMsg];
    });

    console.log(incomingMsg);
  }, [incomingMsg]);
  return (
    <div className='messenger'>
      {head == 'Chat' ? (
        <>
          <div className='msg-list' id='style2'>
            {msgArray.length > 0 &&
              msgArray
                .filter((m) => {
                  return m != null;
                })
                .map((m, key) => {
                  return (
                    <div key={key} className='msg-bubble'>
                      <p className='msg-top2'>{m?.user}</p>
                      <p className='msg-mid2'>{m?.msg}</p>
                      <p className='msg-bottom2'> {m?.time}</p>
                    </div>
                  );
                })}
          </div>
          <div className='footer'>
            <input
              type='text'
              placeholder='type a messgae...'
              value={msg}
              onChange={(e) => {
                console.log(e.target.value);
                setMsg(e.target.value);
              }}
            ></input>
            <button
              type='submit'
              onClick={(e) => {
                // console.log('here');
                handleSubmit(e);
              }}
            >
              Send
            </button>
          </div>
        </>
      ) : (
        <div className='participants-list'>
          {Object.keys(participants).map((key, index) => {
            let name = participants[key].displayName;
            return (
              <div className="p" >
                <p>{name}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Messenger;
