import React, { Component } from 'react';

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "I shouldn\'t be here"
    }
  }

  componentDidMount() {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => this.setState({message: data.message}))
  }

  render() {
    return (
      <ul>
        <li>here</li>
        <li>{this.state.message}</li>
      </ul>
    )
  }
}

export default Users;