import React, { Component } from 'react'

export class CurrentDate extends Component {
  state = {
    date: "",
    dateToSalary: ""
  };
 
  componentDidMount() {
    this.getDate();
    this.getDateToSalary();
  }
 
  getDate = () => {
    var today = new Date(),
 
    date = today.getDate() + '-' +  (today.getMonth() + 1) + '-' + today.getFullYear() ;
 
    this.setState({ date });
  };

  getDateToSalary = () => {
    var today = new Date()
    var dateToSalaryInDays,

    dateToSalary = (today.getDate() - 23);
 
    dateToSalaryInDays = dateToSalary * -1;
    this.setState({ dateToSalaryInDays });

  };
  
    render(){
    return (
      <>
     
      <div className="CurrentDate text-dark border border-dark rounded p-2 m-2">
        <p>Today is   {this.state.date} </p>
        </div>
        <div className="m-2 CurrentDate text-dark border border-info rounded p-2 ">
        <p> {this.state.dateToSalaryInDays} Days to the next Salary</p>
      </div>
      
      </>
    );
    
  }
}

export default CurrentDate