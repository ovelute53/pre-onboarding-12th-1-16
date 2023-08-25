import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Vaildate from '../../custom/Vaildate';
import { SignInHandle } from '../../util/UserUtil';
import {
  Container,
  Text,
  EmailWrapper,
  PasswordWrapper,
  SignInForm,
  Label,
  EmailInput,
  PasswordInput,
  ErrorMsg,
  SignInBtn,
  SignUpBtn,
} from './SignIn.styled';

const SignIn = () => {
  const navigate = useNavigate();
  const {
    email,
    setEmail,
    password,
    setPassword,
    enableButton,
    handleEmailChange,
    handlePasswordChange,
  } = Vaildate();

  const [error, setError] = useState('');

  const onClickHandler = () => {
    navigate('/signup');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSignIn(e);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enableButton) return;
    try {
      const result = await SignInHandle(email, password);
      if (result.status === 200 && result.data.access_token) {
        localStorage.setItem('jwt_token', result.data.access_token);
        setError('');
        setEmail('');
        setPassword('');
        navigate('/todo');
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 401) {
          setError('아이디 혹은 비밀번호를 다시 확인해주세요!');
        } else if (err.response.status === 404) {
          setError('존재하지 않는 회원입니다!');
        }
      } else {
        console.error(err);
      }
    }
  };
  useEffect(() => {
    if (localStorage.getItem('jwt_token')) navigate('/todo');
  }, [navigate]);

  return (
    <Container>
      <SignInForm onSubmit={handleSignIn}>
        <Text>Sign In</Text>
        <EmailWrapper>
          <Label htmlFor="">Email</Label>
          <EmailInput
            type="text"
            data-testid="email-input"
            placeholder="example@email.com"
            onChange={e => handleEmailChange(e)}
            value={email}
          />
        </EmailWrapper>
        <PasswordWrapper>
          <Label htmlFor="">Password</Label>
          <PasswordInput
            type="password"
            data-testid="password-input"
            placeholder="password"
            value={password}
            onChange={e => handlePasswordChange(e)}
            onKeyDown={handleKeyDown}
          />
          {error && <ErrorMsg>{error}</ErrorMsg>}
        </PasswordWrapper>
        <div>
          <SignInBtn
            data-testid="signin-button"
            type="submit"
            disabled={enableButton ? false : true}
          >
            Sign In
          </SignInBtn>
          <SignUpBtn type="button" onClick={onClickHandler}>
            Sign Up
          </SignUpBtn>
        </div>
      </SignInForm>
    </Container>
  );
};

export default SignIn;
