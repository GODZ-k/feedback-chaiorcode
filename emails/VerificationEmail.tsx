import * as React from 'react';

interface VerificationEmail {
  username: string;
  otp:string;
}

export const VerificationEmailTemplate: React.FC<Readonly<VerificationEmail>> = ({username,otp}) => (
  <div>
    <h1>Welcome, {username}! your verification code is {otp}</h1>
  </div>
);
