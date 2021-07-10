import React, { useEffect, useState } from 'react';
import {
  ScheduleComponent,
  ViewsDirective,
  ViewDirective,
  Day,
  Week,
  WorkWeek,
  Month,
  Inject,
  Resize,
} from '@syncfusion/ej2-react-schedule';
import '../../assets/css/calendar.css';
// import { ToastComponent } from '@syncfusion/ej2-react-notifications';
import jwtDecode from 'jwt-decode';
import axios from 'axios';

function Calendar(props) {
  const [d, setData] = useState([]);
  const [tempkey,setkey] = useState(1) ;
  const {userId} = props ;
  console.log(userId) ;

  const handleSave = (e) => {
    console.log('Beginnnnn', e);
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.token,
      },
    };
    let data = e.data;

    if (e.requestType === 'eventCreate') {
      const body = {
        userId: userId,
        data: data[0],
      };

      axios
        .post(`${process.env.REACT_APP_API_URL}/api/event`, body, config)
        .then((res) => {
          setData(res.data.events);
          console.log('Data', d);
        })
        .catch((err) => console.log(err));
    }
    if (e.requestType === 'eventRemove') {
      axios
        .get(
          `${process.env.REACT_APP_API_URL}/api/event/${e.deletedRecords[0]._id}`,
          config
        )
        .then((res) => {
          setkey(Math.random() * 10000);
        });
    }

    if (e.requestType === 'eventChange') {
      let data = e.changedRecords;
      let id = data[0]._id;
      const body = {
        userId: userId,
        data: data[0],
      };
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/api/event/update/${id}`,
          body,
          config
        )
        .then((res) => {
          setkey(Math.random() * 10000);
        });
    }
  };

  useEffect(() => {
    console.log("CALLEDD") ;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.token,
      },
    };
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/event`, config)
      .then((res) => {
        console.log(res.data.events) ;
        setData(res.data.events);
        console.log('cdm------', d);
      });
  }, [tempkey]);

  return (
    <div key={tempkey} className='schedule-control-section'>
      <div className='control-section'>
        <div className='control-wrapper'>
          <ScheduleComponent
            height='90vh'
            id='schedule'
            eventSettings={{ dataSource: d }}
            selectedDate={new Date()}
            actionBegin={handleSave}
            currentView='Month'
          >
            <ViewsDirective>
              <ViewDirective option='Day' />
              <ViewDirective option='Week' />
              <ViewDirective option='WorkWeek' />
              <ViewDirective option='Month' />
            </ViewsDirective>
            <Inject services={[Day, Week, WorkWeek, Month, Resize]} />
          </ScheduleComponent>
        </div>
      </div>
    </div>
  );
}

export default Calendar;
