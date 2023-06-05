import React, { Component, useState, useEffect} from 'react';

const Users = () => {
  const [message1, newMessage1] = useState('I shouldn\'t be here');
  const [message2, newMessage2] = useState('I shouldn\'t be here');
  const [message3, newMessage3] = useState('I shouldn\'t be here');

  useEffect(() => {
    fetch('/api/user')
      .then(res => res.json())
      .then(data => newMessage1(data.message));
    // console.log('I happen once')
  }, []);

  //replaces state of message1 with argument
  newMessage1(message1 + 1);

  return (
    <ul>
      <li>here</li>
      <li>{message1}</li>
    </ul>
  );
};
export default Users;

/*
class Users2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message1: "I shouldn\'t be here",
      message2: "I shouldn\'t be here",
      message3: "I shouldn\'t be here"
    }
  }

  newMessage1(newMessage) {
    this.setState({...this.state, message1: newMessage})
  }

  //newMessage1(this.state.message1 + 1) can't actually be called here. Lame!

  componentDidMount() {
    fetch('/api/user')
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
    fetch('/api/user')
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