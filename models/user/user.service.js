const addGoogleUser = (User) => (userDetails) => {

  const users = new User(userDetails)
  return users.save()
}

const addLocalUser =  (User) => ({ id, email, name, password }) => {
  const users = new User({
    id, email, name, password, source: "local"
  })

  return users.save()
}

const getUsers = (User) => () => {
  return User.find({}).exec()
}

const getUserByEmail = (User) => async ({ email }) => {
  return await User.findOne({ email }).exec()
}



module.exports = (User) => {
  return {
    addGoogleUser: addGoogleUser(User),
    addLocalUser: addLocalUser(User),
    getUsers: getUsers(User),
    getUserByEmail: getUserByEmail(User)
  }
}