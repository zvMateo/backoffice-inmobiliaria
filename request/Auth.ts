import { axiosBackend } from "@/request/Properties";

export type LoginResponse = {
  token: string;
  user?: { id: number; name: string; email: string };
};

export async function loginRequest(
  email: string,
  password: string
): Promise<LoginResponse> {
  try {
    console.log("Intentando login con:", {
      email,
      baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
    });

    // Swagger expone POST /api/Auth/login
    const { data } = await axiosBackend.post<LoginResponse>("Auth/login", {
      email,
      password,
    });

    console.log("Login exitoso:", data);
    return data;
  } catch (error: any) {
    console.error("Login error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    });

    // Mejorar manejo de errores con información específica
    if (error.response?.status === 401) {
      throw new Error(
        "Credenciales incorrectas. Verifica que el email sea 'admin@demo.com' y la contraseña 'admin123'."
      );
    } else if (error.response?.status === 400) {
      throw new Error("Datos de login inválidos. Revisa el formato del email.");
    } else if (error.response?.status === 404) {
      throw new Error(
        "Servicio de autenticación no encontrado. Contacta al administrador."
      );
    } else if (error.code === "NETWORK_ERROR" || !error.response) {
      throw new Error(
        "No se puede conectar al servidor. Verifica que el backend esté ejecutándose."
      );
    } else if (error.response?.status >= 500) {
      throw new Error(
        "Error del servidor. Intenta nuevamente en unos minutos."
      );
    } else {
      // Extraer mensaje específico del backend si existe
      const backendMessage =
        error.response?.data?.message || error.response?.data?.error;
      throw new Error(
        backendMessage ||
          `Error de autenticación (${error.response?.status}). Intenta nuevamente.`
      );
    }
  }
}

export async function seedAdmin(): Promise<{ ok: boolean }> {
  // Swagger expone POST /api/Auth/seed-admin
  await axiosBackend.post("Auth/seed-admin");
  return { ok: true };
}
