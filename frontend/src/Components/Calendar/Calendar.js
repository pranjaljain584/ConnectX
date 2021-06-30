import React, { Component } from 'react';
// import {ScheduleComponent , Day, Week, WorkWeek, Month, Agenda, Inject } from '@syncfusion/ej2-react-schedule' ;
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
import '../../assets/css/calendar.css'

import { extend } from '@syncfusion/ej2-base';
import { ToastComponent } from '@syncfusion/ej2-react-notifications';
import { SampleBase } from './SampleBase';

class Calendar extends Component {
  constructor() {
    super(...arguments);
    this.position = { X: 'Right', Y: 'Top' };
    var startTime = new Date();
    startTime.setMinutes(startTime.getMinutes() + 6);
    var endTime = new Date(startTime.getTime());
    endTime.setHours(endTime.getHours() + 2);
    this.data = [
      {
        Id: 1,
        Subject: 'Explosion of Betelgeuse Star',
        Location: 'Space Centre USA',
        StartTime: startTime,
        EndTime: endTime,
      },
    ];
  }
  templatedata() {
    return (
      <div className='e-toast-template e-toast-info'>
        <div className='e-toast-message'>
          <div className='e-toast-title'>{this.data[0].Subject}</div>
        </div>
      </div>
    );
  }
  // onCreated() {
  //   window.setInterval(function () {
  //     var scheduleObj = document.querySelector('.e-schedule').ej2_instances[0];
  //     var eventCollection = scheduleObj.getCurrentViewEvents();
  //     eventCollection.forEach((event, i) => {
  //       var dateFormat = (date) =>
  //         new Date(
  //           date.getFullYear(),
  //           date.getMonth(),
  //           date.getDate(),
  //           date.getHours(),
  //           date.getMinutes()
  //         );
  //       var alertBeforeMinutes = 5;
  //       var startTime = dateFormat(event[scheduleObj.eventFields.startTime]);
  //       var currentTime = dateFormat(new Date());
  //       if (
  //         currentTime.getTime() ===
  //         startTime.getTime() - 1000 * 60 * alertBeforeMinutes
  //       ) {
  //         var toastObjReminder =
  //           document.querySelector('.e-toast').ej2_instances[0];
  //         toastObjReminder.show();
  //       }
  //     });
  //   }, 60000);
  // }
  render() {
    return (
      <div className='schedule-control-section'>
        <div className='control-section'>
          <div className='control-wrapper'>
            <ScheduleComponent
              height='650px'
              id='schedule'
              // ref={(schedule) => (this.scheduleObj = schedule)}
              eventSettings={{ dataSource: this.data }}
              // created={this.onCreated.bind(this)}
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
            <ToastComponent
              ref={(toast) => {
                this.toastObj = toast;
              }}
              id='toast_default'
              newestOnTop={true}
              showCloseButton={true}
              timeOut={5000}
              target='#schedule'
              position={this.position}
              template={this.templatedata.bind(this)}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Calendar;
