import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const register = (email, password, name) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    const userExists = users.find(u => u.email === email);
    if (userExists) {
      throw new Error('Пользователь с таким email уже существует');
    }
    
    const newUser = {
      id: Date.now(),
      email,
      password,
      name,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    const currentUser = { id: newUser.id, email: newUser.email, name: newUser.name };
    setUser(currentUser);
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    return newUser;
  };

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (!foundUser) {
      throw new Error('Неверный email или пароль');
    }
    
    const currentUser = { id: foundUser.id, email: foundUser.email, name: foundUser.name };
    setUser(currentUser);
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    return foundUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};