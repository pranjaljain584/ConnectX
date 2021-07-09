import React, { useEffect, useRef, useState } from 'react';
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
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    setMsgArray((prevState) => {
      return [...prevState, incomingMsg];
    });
  }, [incomingMsg]);

  useEffect(() => {
    scrollToBottom();
  }, [msgArray]);

  return (
    <div className='messenger'>
      {head === 'Chat' ? (
        <>
          <div className='msg-list' id='style2'>
            {msgArray.length > 0 &&
              msgArray
                .filter((m) => {
                  return m != null;
                })
                .map((m, key) => {
                  return (
                    <div
                      key={key}
                      className={`msg-bubble ${m.whiteboard ? 'admin' : null}`}
                    >
                      {m.whiteboard ? (
                        <span>&nbsp;</span>
                      ) : (
                        <p className='msg-top2'>{m?.user}</p>
                      )}
                      <p className='msg-mid2'>{m?.msg}</p>
                      {m.whiteboard ? null : (
                        <p className='msg-bottom2'> {m?.time}</p>
                      )}
                    </div>
                  );
                })}
            <div ref={messagesEndRef} />
          </div>
          <div className='footer'>
            <form>
              <input
                type='text'
                placeholder='type a messgae...'
                value={msg}
                required
                onChange={(e) => {
                  console.log(e.target.value);
                  setMsg(e.target.value);
                }}
              ></input>
              <button
                type='submit'
                onClick={(e) => {
                  // console.log('here');
                  handleSubmit(e, false);
                }}
              >
                Send
              </button>
            </form>
          </div>
        </>
      ) : (
        <div className='participants-list'>
          {Object.keys(participants).map((key, index) => {
            let name = participants[key].displayName;
            return (
              <div index={index} className='p'>
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
