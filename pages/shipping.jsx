import React from 'react';
import { useRouter } from 'next/router';

export default function Shipping() {
  const router = useRouter();
    router.push('/signin');
  return <div></div>;
}