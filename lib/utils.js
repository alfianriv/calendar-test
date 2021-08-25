import Router from 'next/router';
import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';

export function verifyToken(jwtToken) {
  try {
    return jwt.verify(jwtToken, 'secret');
  } catch (e) {
    return null;
  }
}

export function getAppCookies(req) {
  const parsedItems = {};
  if (req.headers.cookie) {
    const cookiesItems = req.headers.cookie.split('; ');
    cookiesItems.forEach(cookies => {
      const parsedItem = cookies.split('=');
      parsedItems[parsedItem[0]] = decodeURI(parsedItem[1]);
    });
  }
  return parsedItems;
}

export function setLogout(e) {
  e.preventDefault();
  Cookies.remove('token');
  Router.push('/');
}