import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import { getProfile, getUserCards, login, resetLoginFormError } from './authSlice';
import { selectLoginFormError } from './selectors';
import { useAppDispatch } from '../../store';

function Login(): JSX.Element {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const error = useSelector(selectLoginFormError);
  const [username, setName] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = React.useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      // 332 делаем диспатч санка
      const dispatchResult = await dispatch(
        login({
          username,
          password,
        })
      );

      // 332 проверяем, что санк login зарезолвился успешно
      if (login.fulfilled.match(dispatchResult)) {
        dispatch(getProfile());
        dispatch(getUserCards());

        if (location.pathname === '/auth/login') {
          navigate('/api/users/my/profile');
        } else if (location.pathname.startsWith('/card-details/')) {
          navigate(location.pathname);
        }
      }

      // 332 выводим в консоль ошибку если санк login зареджектился
      if (login.rejected.match(dispatchResult)) {
        console.error(dispatchResult.error.message);
      }
    },
    [dispatch, username, navigate, password]
  );

  const handleNameChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setName(event.target.value);
      // 332 очищаем ошибку
      dispatch(resetLoginFormError());
    },
    [dispatch]
  );

  const handlePasswordChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(event.target.value);
      // 332 очищаем ошибку
      dispatch(resetLoginFormError());
    },
    [dispatch]
  );

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Log in</h2>
      {error && (
        <div className="invalid-feedback mb-3" style={{ display: 'block' }}>
          {error}
        </div>
      )}
      <div className="mb-3">
        <label htmlFor="name-input" className="form-label">
          Name
        </label>
        <input
          type="text"
          className={`form-control ${error ? 'is-invalid' : ''}`}
          id="name-input"
          name="username"
          value={username}
          onChange={handleNameChange}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="password-input" className="form-label">
          Password
        </label>
        <input
          type="password"
          className={`form-control ${error ? 'is-invalid' : ''}`}
          id="password-input"
          name="password"
          value={password}
          onChange={handlePasswordChange}
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Log in
      </button>
      <Box sx={{ textAlign: 'center' }}>
        <Button color="success" sx={{ mt: '1rem' }} href="#/auth/register">
          <Typography textTransform="capitalize" textAlign="center">
            Not registred?
          </Typography>
        </Button>
      </Box>
    </form>
  );
}

export default Login;
