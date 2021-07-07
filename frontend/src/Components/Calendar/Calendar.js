import React, { Component, useEffect, useState } from 'react';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import {
  ScheduleComponent,
  ViewsDirective,
  ViewDirective,
  Day,
  Week,
  WorkWeek,
  Month,
  Agenda,
  Inject,
  Resize,
  DragAndDrop,
} from '@syncfusion/ej2-react-schedule';
import '../../assets/css/calendar.css';
import { DataManager } from '@syncfusion/ej2-data';
import { extend } from '@syncfusion/ej2-base';
import { ToastComponent } from '@syncfusion/ej2-react-notifications';
import { SampleBase } from './SampleBase';
import jwtDecode from 'jwt-decode';
import axios from 'axios';

if (localStorage.token) {
  const token = localStorage.token;
  const decoded = jwtDecode(token);
  var userId = decoded.user.id;
}

function Calendar(props) {
  const [d, setData] = useState([]);
  const [tempkey,setkey] = useState(1) ;

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
          // setkey((Math.random()*10000))
          console.log('DDDd', d);
          // window.location.reload() ;
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
        setData(res.data.events);
        console.log('cdm------', d);
      });
  }, [tempkey]);

  return (
    <div key={tempkey} className='schedule-control-section'>
      <div className='control-section'>
        <div className='control-wrapper'>
          <ScheduleComponent
            height='650px'
            id='schedule'
            eventSettings={{ dataSource: d }}
            actionBegin={handleSave}
          >
            <ViewsDirective>
              <ViewDirective option='Day' />
              <ViewDirective option='Week' />
              <ViewDirective option='WorkWeek' />
              <ViewDirective option='Month' />
              <ViewDirective option='Agenda' />
            </ViewsDirective>
            <Inject
              services={[
                Day,
                Week,
                WorkWeek,
                Month,
                Agenda,
                Resize,
                DragAndDrop,
              ]}
            />
          </ScheduleComponent>
        </div>
      </div>
    </div>
  );
}

export default Calendar;

// templatedata() {
//   return (
//     <div className='e-toast-template e-toast-info'>
//       <div className='e-toast-message'>
//         <div className='e-toast-title'>{this.data[0].Subject}</div>
//       </div>
//     </div>
//   );
// }

//             {/* <ToastComponent
//               ref={(toast) => {
//                 this.toastObj = toast;
//               }}
//               id='toast_default'
//               newestOnTop={true}
//               showCloseButton={true}
//               timeOut={5000}
//               target='#schedule'
//               position={this.position}
//               template={this.templatedata.bind(this)}
//             /> */}

//   onCreated() {
//     console.log('Caleed');
//     window.setInterval(function () {
//       var scheduleObj = document.querySelector('.e-schedule').ej2_instances[0];
//       var eventCollection = scheduleObj.getCurrentViewEvents();
//       eventCollection.forEach((event, i) => {
//         var dateFormat = (date) =>
//           new Date(
//             date.getFullYear(),
//             date.getMonth(),
//             date.getDate(),
//             date.getHours(),
//             date.getMinutes()
//           );
//         var alertBeforeMinutes = 5;
//         var startTime = dateFormat(event[scheduleObj.eventFields.startTime]);
//         var currentTime = dateFormat(new Date());
//         if (
//           currentTime.getTime() ===
//           startTime.getTime() - 1000 * 60 * alertBeforeMinutes
//         ) {
//           var toastObjReminder =
//             document.querySelector('.e-toast').ej2_instances[0];
//           toastObjReminder.show();
//         }
//       });
//     }, 60000);
//   }
