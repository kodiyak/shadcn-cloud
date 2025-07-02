import type React from 'react';
import { type ReactNode, Component } from 'react';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode | ((err: any) => ReactNode);
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Atualiza o estado para que a próxima renderização mostre a UI alternativa.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Você também pode registrar o erro em um serviço de relatórios de erro
    // console.error('Uncaught error:', error, errorInfo)
    console.error(`Component[${this.constructor.name}]`, error);
    console.error(`Component[${this.constructor.name}]`, errorInfo);

    return { error, errorInfo };
  }

  render() {
    if (this.state.hasError) {
      // Você pode renderizar qualquer UI alternativa
      if (typeof this.props.fallback === 'function') {
        return this.props.fallback(this.state.error);
      }

      return this.props.fallback;
    }

    return this.props.children;
  }
}

export { ErrorBoundary };
