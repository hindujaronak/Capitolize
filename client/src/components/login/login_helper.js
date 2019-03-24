const login = (user) => {
  return fetch('api/user/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(user)
    })
    .then((response) => {
      return response.json()
    }).catch((err) => console.log(err))
}
export {
  login
}
