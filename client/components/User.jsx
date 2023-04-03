import React, { Component } from 'react';

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: "I shouldn\'t be here"
    }
  }

  componentDidMount() {
    // fetch('/api/users')
    //   .then(data => data.json())
    //   .then(users => {
    //     console.log('Users object after fetch:', users)
    //     this.setState({ users })
    //   }).catch(err => {
    //   console.log(`Error: ${err.message}`)
    // })
    fetch('/api/users')
      .then(res => res.json())
      .then(data => this.setState({users: data}))
  }

  render() {
    return (
      <ul>
        <li>here</li>
        <li>{this.state.users}</li>
        {/* {
          this.state.users.map(user => {
            <li>Username: {user.username}, Age {user.age} </li>
          })
        } */}
      </ul>
    )
  }
}

export default Users;