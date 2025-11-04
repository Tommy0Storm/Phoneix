import React from 'react';

export interface Service {
  name: string;
  description: string;
  icon: React.ReactElement;
  subServices?: string[];
}

export interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
}