"use client";

import { Component, ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("Error en el mapa inmobiliario:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 p-4">
          <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-xl text-red-900">
                Error en el Mapa
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                Ocurrió un error inesperado al cargar el mapa inmobiliario.
              </p>
              <p className="text-sm text-gray-500">
                {this.state.error?.message || "Error desconocido"}
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={() => window.location.reload()}
                  className="flex-1 gap-2"
                  variant="default"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reintentar
                </Button>
                <Link href="/" className="flex-1">
                  <Button variant="outline" className="w-full gap-2">
                    <Home className="h-4 w-4" />
                    Ir al Dashboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
