import React, { Component } from 'react'

export class CurrentDate extends Component {
  state = {
    date: ""
  };
 
  componentDidMount() {
    this.getDate();
  }
 
  getDate = () => {
    var today = new Date(),
 
    date = today.getDate() + '-' +  (today.getMonth() + 1) + '-' + today.getFullYear() ;
 
    this.setState({ date });
  };
 
  render(){
    return (
      <div className="CurrentDate text-dark border border-info rounded p-2 ">
        <p>Today is : {this.state.date}</p>
      </div>
    );
  }
}

export default CurrentDate