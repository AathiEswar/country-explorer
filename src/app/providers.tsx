'use client';

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new ApolloClient({
    uri: 'https://restcountries.com/v3.1',
    cache: new InMemoryCache(),
  }));

  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  );
} 