import React, { Component } from 'react'
import cookie from 'cookie';
import { Modal, Button, Stack } from 'react-bootstrap';

export class CurrentDate extends Component {
  state = {
    date: "",
    dateToSalary: null,
    dateToSalaryInDays: null,
    modalIsOpen: false,
    id: null,
  };
 
  componentDidMount() {
    const cookies = typeof window !== 'undefined' ? document.cookie : '';
    const { token } = cookie.parse(cookies);
    console.log('token: ', token);

    if (!token) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return;
    }
    fetch( process.env.NEXT_PUBLIC_API_URL + 'api/users/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => res.json())
      .then((data) => {
        if (!data.salary_date) {
          this.editSalaryDate();
          this.setState({ id: data.id });
        } else {
          this.setState({ dateToSalary: data.salary_date });
          this.getDate();
            const dateToSalary = new Date(data.salary_date);
            const today = new Date();
            const timeDiff = dateToSalary.getTime() - today.getTime();
            const daysToSalary = timeDiff / (1000 * 3600 * 24);
            this.setState({ dateToSalaryInDays: Math.round(daysToSalary) });
            console.log('daysToSalary: ', daysToSalary);
            this.setState({ id: data.id });
            console.log('id: ', data.id);
             // Check if the salary date is past today's date
      if (dateToSalary < today) {
        // Set the salary date to the same day of the next month
        const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, dateToSalary.getDate() + 1);
        this.editSalaryDate(nextMonth);
      }
        }
      })
      .catch(console.log)
    }

 
  getDate = () => {
    var today = new Date(),
 
    date = today.getDate() + '-' +  (today.getMonth() + 1) + '-' + today.getFullYear() ;
 
    this.setState({ date });
  };

  getDateToSalary = () => {
    var today = new Date();

    if (today.getDate() > this.state.dateToSalary) {
      this.updateSalaryDate();
    }

    const dateToSalary = new Date(this.state.dateToSalary);
    const timeDiff = dateToSalary.getTime() - today.getTime();
    const daysToSalary = timeDiff / (1000 * 3600 * 24);
    this.setState({ dateToSalaryInDays: Math.round(daysToSalary) });
  };

  updateSalaryDate = () => {
    var today = new Date();
    var nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, this.state.dateToSalary);
    this.editSalaryDate(nextMonth);
  };
 

  editSalaryDate = (newDate) => {
    
    const salaryDate = newDate ? newDate : this.state.dateToSalary;

    const cookies = typeof window !== 'undefined' ? document.cookie : '';
    const { token } = cookie.parse(cookies);

    fetch( process.env.NEXT_PUBLIC_API_URL + 'api/users/' + this.state.id, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ salary_date: salaryDate }),
    })
    .then(res => res.json())
    .then((data) => {
      console.log('Salary date updated: ', data.salary_date);
      // Update the state with the new salary date
      this.setState({ dateToSalary: data.salary_date });
      this.getDateToSalary();
      // reload the page
      window.location.reload(false);
    })
    .catch(console.log)
  };

  
  openModal = () => {
    this.setState({ modalIsOpen: true });
  };

  closeModal = () => {
    this.setState({ modalIsOpen: false });
  };

  handleDateChange = (event) => {
    this.setState({ dateToSalary: event.target.value });
  };

  handleSave = () => {
    this.editSalaryDate(this.state.dateToSalary);
    this.closeModal();
  };

  render() {
  
      return (
       
        <div>
          
        {this.state.dateToSalary === null ? (
          <>
          <p> You have not set your salary date yet. </p>
          <Button onClick={this.openModal}>Set Salary Date</Button>
          <Modal show={this.state.modalIsOpen} onHide={this.closeModal}>
            <Modal.Header closeButton>
              <Modal.Title>Set Salary Date</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <input
                type="date"
                value={this.state.dateToSalary}
                onChange={this.handleDateChange}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.closeModal}>
                Close
              </Button>
              <Button variant="primary" onClick={this.handleSave}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
          </>

       
          ) : (
            <>
            <p> Your salary date is {
              new Date(this.state.dateToSalary).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })
            } </p>
            <p> Days to salary: {this.state.dateToSalaryInDays} </p>
            <Button onClick={this.openModal}>Change Salary Date</Button>
            <Modal show={this.state.modalIsOpen} onHide={this.closeModal}>
              <Modal.Header closeButton>
                <Modal.Title>Change Salary Date</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <input
                  type="date"
                  value={this.state.dateToSalary}
                  onChange={this.handleDateChange}
                />
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={this.closeModal}>
                  Close
                </Button>
                <Button variant="primary" onClick={this.handleSave}>
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>
            </>
          )}
        </div>
      );
  }
}

export default CurrentDate

