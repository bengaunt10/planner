//Copilot assisted file will this make me lose marks?

/* eslint-disable no-undef */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Form from '../components/Form';
import { MemoryRouter } from 'react-router-dom';

// Mock the fetch function
global.fetch = vi.fn();

const mockingNavigation = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockingNavigation,
  };
});
describe('Form Component - Register and Login tests', () => {
  const setup = (result = 'login') => {
    const route = result === 'login' ? '/token/' : '/user/create/';
    return render(
      <MemoryRouter>
        <Form route={route} result={result} />
      </MemoryRouter>
    );
  };
  it('Username and Password Input box Test', async () => {
    setup('login');
    const user = userEvent.setup();
    
    const usernameInputBox = screen.getByPlaceholderText('UserName');
    const passwordInputBox = screen.getByPlaceholderText('Password');

    await user.type(usernameInputBox, 'testingtheusername');
    await user.type(passwordInputBox, 'testingthepassword');

    expect(usernameInputBox).toHaveValue('testingtheusername');
    expect(passwordInputBox).toHaveValue('testingthepassword');
  });


  
  it('Login Successful Test', async () => {
    const testingTokens = {
      access: 'test-access-token',
      refresh: 'test-refresh-token'
    };
    
    //doing a fake fetch request to act as a backend response. ok:true mimics a successful http status response and returns my tokens like the actual API does. 
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => testingTokens,
    });

    setup('login');
    const user = userEvent.setup();
    
    const testingUsername = 'testingtheusername';
    const testingPassword = 'testingthepassword';

    await user.type(screen.getByPlaceholderText('UserName'), testingUsername);
    await user.type(screen.getByPlaceholderText('Password'), testingPassword);
    await user.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(localStorage.getItem('access')).toBe(testingTokens.access);
      expect(localStorage.getItem('refresh')).toBe(testingTokens.refresh);
      expect(localStorage.getItem('username')).toBe(testingUsername);
      
      expect(mockingNavigation).toHaveBeenCalledWith('/');
    });
  });


  it('Error displayed when Login Failed Test', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({}),
    });

    setup('login');
    const user = userEvent.setup();
    
    await user.type(screen.getByPlaceholderText('UserName'), 'testingtheusername');
    await user.type(screen.getByPlaceholderText('Password'), 'incorrectpassword');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(screen.getByText('Login Failed')).toBeInTheDocument();
    });
  });

  it('Confirm Password Test', async () => {
    //mock fetch request where my backend would return the response of passwords not matching
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ reason: "Passwords don't match" }),
    });

    setup('register');
    const user = userEvent.setup();
    
    await user.type(screen.getByPlaceholderText('UserName'), 'testingtheusername');
    await user.type(screen.getByPlaceholderText('Password'), 'testingthepassword');
    await user.type(screen.getByPlaceholderText('Confirm Password'), 'nonmatchingpassword');
    await user.click(screen.getByRole('button', { name: 'Register' }));

    await waitFor(() => {
      expect(screen.getByText("Passwords don't match")).toBeInTheDocument();
    });
  });

it('Register Successful Test', async () => {
    fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
    });

    setup('register');
    const user = userEvent.setup();
    
    const testingUsername = 'usercreatetest';
    const testingPassword = 'usercreatepassword';

    await user.type(screen.getByPlaceholderText('UserName'), testingUsername);
    await user.type(screen.getByPlaceholderText('Password'), testingPassword);
    await user.type(screen.getByPlaceholderText('Confirm Password'), testingPassword);
    await user.click(screen.getByRole('button', { name: 'Register' }));

    await waitFor(() => {
        expect(mockingNavigation).toHaveBeenCalledWith('/login');
    });
});

});

//inspired fro, deepseek