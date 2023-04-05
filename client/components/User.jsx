import React, { Component, useState, useEffect} from 'react';

const Users = () => {
  const [message, newMessage] = useState('I shouldn\'t be here');

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => newMessage(data.message))
    // console.log('I happen once')
  }, [])

  return (
    <ul>
      <li>here</li>
      <li>{message}</li>
    </ul>
  )


}

export default Users;

/*
class Users2 extends Component {
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
*/



/*

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
}*/