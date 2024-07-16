const LoginForm = ({ 
  username, password, handleLogin, 
  handleUsernameChange,
  handlePasswordChange
}) => (
  <>
    <h2>Log in to bloglistApp</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
            <input type='text' 
                    value={username} name="Username"
                    onChange={handleUsernameChange}
            />
        </div>
        <div>
          password
            <input type='password' 
                    value={password} name="Password"
                    onChange={handlePasswordChange}
            />
        </div>
        <button type='submit'>Login</button>
      </form>
  </>
)

export default LoginForm