const register = (user) => {
    // console.log(user)
    return fetch('http://localhost:5000/api/user/register', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(user)
      })
      .then((response) => {
        return "res"
      }).catch((err) => console.log(err))
  }
  export {
    register
  }