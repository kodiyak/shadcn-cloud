'use client';

import { queryClient } from '@/lib/clients/query';
import { QueryClientProvider } from '@tanstack/react-query';
import React, { type PropsWithChildren } from 'react';

export function QueryProvider({ children }: PropsWithChildren) {
  return (
    <>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </>
  );
}
