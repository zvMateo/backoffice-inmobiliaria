"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { Eye, EyeOff, LogIn, AlertCircle, CheckCircle2, Mail, Lock } from "lucide-react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const MotionDiv = dynamic(
  () => import("framer-motion").then((m) => m.motion.div),
  { ssr: false }
);

// Schema de validación con mensajes en español
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El email es requerido")
    .email("Por favor ingresa un email válido"),
  password: z
    .string()
    .min(1, "La contraseña es requerida")
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
  remember: z.boolean().default(false),
});

type LoginFormData = z.infer<typeof loginSchema>;

// Componente separado que usa useSearchParams
function LoginFormWithParams() {
  const { login, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // React Hook Form con validación Zod
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
    watch,
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange", // Validación en tiempo real
    defaultValues: {
      email: "",
      password: "",
      remember: true,
    },
  });

  const watchedFields = watch();

  // Función para rellenar datos de administrador demo
  const fillAdminCredentials = () => {
    setValue("email", "admin@demo.com", { shouldValidate: true, shouldDirty: true, shouldTouch: true });
    setValue("password", "admin123", { shouldValidate: true, shouldDirty: true, shouldTouch: true });
    setValue("remember", true, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
    toast.success("Datos de administrador cargados", {
      description: "Puedes hacer clic en 'Ingresar' para continuar",
    });
  };

  useEffect(() => {
    const mediaReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    const handler = (e: MouseEvent) => {
      if (mediaReduce.matches) return; // desactivar si reduce motion
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const dx = (e.clientX - cx) / cx; // -1..1
        const dy = (e.clientY - cy) / cy;
        const o1 = document.getElementById("orbit-1");
        const o2 = document.getElementById("orbit-2");
        const o3 = document.getElementById("orbit-3");
        const tx1 = `translate(-50%, -50%) translate(${dx * 6}px, ${dy * 6}px)`;
        const tx2 = `translate(-50%, -50%) translate(${dx * -8}px, ${dy * -8
          }px)`;
        const tx3 = `translate(-50%, -50%) translate(${dx * 4}px, ${dy * 4}px)`;
        if (o1) o1.style.transform = tx1;
        if (o2) o2.style.transform = tx2;
        if (o3) o3.style.transform = tx3;
      });
    };
    window.addEventListener("mousemove", handler);
    setMounted(true);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", handler);
    };
  }, []);

  // Manejo del envío del formulario mejorado
  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      await login(data.email, data.password);

      // Manejar "recordarme"
      if (data.remember) {
        localStorage.setItem("rememberMe", "true");
        localStorage.setItem("rememberedEmail", data.email);
      } else {
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("rememberedEmail");
      }

      toast.success("¡Bienvenido!", {
        description: "Has iniciado sesión correctamente",
      });

      const redirect = searchParams.get("redirect") || "/";
      router.replace(redirect);
    } catch (e: any) {
      const message = e?.message || "Error al iniciar sesión";
      toast.error("Error de autenticación", {
        description: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Recuperar email recordado al cargar
  useEffect(() => {
    const rememberMe = localStorage.getItem("rememberMe");
    const rememberedEmail = localStorage.getItem("rememberedEmail");

    if (rememberMe === "true" && rememberedEmail) {
      setValue("email", rememberedEmail);
      setValue("remember", true);
    }
  }, [setValue]);

  // Función helper para mostrar estado del campo
  const getFieldState = (fieldName: keyof LoginFormData) => {
    const hasError = !!errors[fieldName];
    const isTouched = touchedFields[fieldName];
    const hasValue = watchedFields[fieldName] && watchedFields[fieldName] !== "";

    if (hasError && isTouched) return "error";
    if (hasValue && isTouched && !hasError) return "success";
    return "default";
  };

  const handleForgotPassword = async (email: string) => {
    // Simular envío de email
    toast.success("Email enviado", {
      description: `Se han enviado las instrucciones a ${email}`,
    });
    setShowForgotPassword(false);
  };

  return (
    <div className="h-screen w-screen bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden" style={{ maxHeight: '100vh', maxWidth: '100vw' }}>
      {/* Toggle de tema */}
      <div className="absolute right-4 top-4 z-50">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-md border bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          {mounted ? (theme === "dark" ? "☀️ Claro" : "🌙 Oscuro") : "Tema"}
        </button>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .floating-animation {
            animation: none !important;
          }
          .orbit-animation {
            display: none !important;
          }
        }
      `}</style>

      {/* Estilos globales para eliminar barras de scroll */}
      <style jsx global>{`
        html, body {
          overflow: hidden !important;
          height: 100vh !important;
          width: 100vw !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        * {
          box-sizing: border-box;
        }
        ::-webkit-scrollbar {
          display: none !important;
        }
        * {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
      `}</style>

      {/* Radial soft center (descentrado) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_60%_40%,rgba(255,255,255,0.95),transparent_72%)] dark:bg-[radial-gradient(ellipse_at_55%_45%,rgba(15,22,51,0.85),transparent_70%)]"
      />

      {/* Grilla tenue - solo en desktop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] dark:opacity-[0.04] hidden md:block"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          color: "#7dd3fc",
        }}
      />

      {/* Aurora animada (solo desktop) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden hidden md:block"
      >
        <div
          className="absolute -top-[75%] left-[45%] -translate-x-1/2 w-[170vw] h-[170vw] rounded-full opacity-30 blur-[180px] animate-[spin_80s_linear_infinite]"
          style={{
            background:
              "conic-gradient(from 180deg at 50% 50%, rgba(14,165,233,0.22), rgba(99,102,241,0.18), rgba(236,72,153,0.18), rgba(14,165,233,0.22))",
          }}
        />
      </div>

      {/* Blobs lentos (más ligeros en mobile) */}
      <div
        aria-hidden
        className="floating-animation pointer-events-none absolute -top-40 -left-56 w-[36rem] h-[36rem] rounded-full bg-sky-300/45 dark:bg-sky-500/20 blur-[100px] animate-[float_18s_ease-in-out_infinite]"
      />
      <div
        aria-hidden
        className="floating-animation pointer-events-none absolute -bottom-52 -right-44 w-[42rem] h-[42rem] rounded-full bg-fuchsia-300/40 dark:bg-fuchsia-500/20 blur-[105px] animate-[float_22s_ease-in-out_infinite_reverse]"
      />

      {/* Órbitas giratorias (solo desktop) */}
      <div
        id="orbits"
        aria-hidden
        className="orbit-animation hidden lg:block pointer-events-none absolute inset-0 overflow-hidden z-10 opacity-80"
      >
        <svg
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-[spin_90s_linear_infinite]"
          width="1200"
          height="1200"
          viewBox="0 0 1200 1200"
        >
          <circle
            cx="600"
            cy="600"
            r="598"
            fill="none"
            stroke="rgb(125 211 252 / 0.3)"
            strokeWidth="2"
          />
        </svg>
        <svg
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-[spin_70s_linear_infinite_reverse]"
          width="900"
          height="900"
          viewBox="0 0 900 900"
        >
          <circle
            cx="450"
            cy="450"
            r="448"
            fill="none"
            stroke="rgb(244 114 182 / 0.25)"
            strokeWidth="2"
          />
        </svg>
        <svg
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 mix-blend-overlay animate-[spin_110s_linear_infinite]"
          width="600"
          height="600"
          viewBox="0 0 600 600"
        >
          <circle
            cx="300"
            cy="300"
            r="298"
            fill="none"
            stroke="rgb(255 255 255 / 0.3)"
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* Contenido */}
      <div className="relative w-full h-full grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
        {/* Lado izquierdo: formulario */}
        <div className="flex items-center justify-center p-4 sm:p-6 lg:p-8 xl:p-12 relative overflow-hidden h-full">
          {/* fondo curvo - solo desktop */}
          <div
            aria-hidden
            className="hidden lg:block absolute inset-y-0 left-0 w-[60vw] max-w-[680px] bg-white/20 dark:bg-slate-900/20 backdrop-blur-2xl"
            style={{ clipPath: "polygon(0% 0%, 75% 0%, 50% 100%, 0% 100%)" }}
          />

          {/* decor conic halo - solo desktop */}
          <div
            className="hidden lg:block pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full opacity-40 blur-3xl"
            style={{
              background:
                "conic-gradient(from 180deg at 50% 50%, rgba(59,130,246,0.3), rgba(236,72,153,0.25), rgba(14,165,233,0.3), rgba(59,130,246,0.3))",
            }}
          />
          <div
            className="hidden lg:block pointer-events-none absolute -bottom-28 -right-28 h-96 w-96 rounded-full opacity-30 blur-3xl"
            style={{
              background:
                "conic-gradient(from 0deg at 50% 50%, rgba(236,72,153,0.25), rgba(59,130,246,0.28), rgba(14,165,233,0.28), rgba(236,72,153,0.25))",
            }}
          />

          {/* hero middle glass card con animación */}
          <MotionDiv
            className="relative w-full max-w-sm md:max-w-md lg:max-w-lg lg:ml-4 xl:ml-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* Marco gradient en claro; en oscuro borde neutro */}
            <div className="w-full rounded-xl lg:rounded-2xl p-[1.5px] bg-gradient-to-r from-primary via-sky-400 to-fuchsia-500 shadow-[0_20px_60px_-20px_rgba(14,165,233,0.35)] hover:shadow-[0_25px_80px_-25px_rgba(14,165,233,0.45)] transition-shadow dark:p-0 dark:shadow-[0_20px_60px_-20px_rgba(2,6,23,0.7)]">
              <Card className="rounded-xl lg:rounded-2xl border-0 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:bg-slate-900/80 dark:border dark:border-white/15">
                <CardHeader className="pb-3 lg:pb-4 p-4 lg:p-6">
                  <CardTitle className="flex items-center gap-2 text-base lg:text-lg xl:text-xl">
                    <LogIn className="h-4 w-4 lg:h-5 lg:w-5 text-primary" /> Iniciar sesión
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 lg:p-6 pt-0">
                  {/* Botón social - mejorado para mobile */}
                  <button
                    type="button"
                    className="w-full h-10 lg:h-11 rounded-lg border bg-white text-foreground flex items-center justify-center gap-2 mb-2 lg:mb-3 shadow-sm hover:bg-muted/50 transition-colors dark:bg-slate-900/60 dark:border-white/10 dark:text-white"
                  >
                    <div className="w-4 h-4 lg:w-5 lg:h-5 bg-gradient-to-r from-red-500 to-yellow-500 rounded text-white text-xs font-bold flex items-center justify-center">
                      G
                    </div>
                    <span className="text-sm lg:text-base font-medium">Continuar con Google</span>
                  </button>

                  {/* Botón para datos de administrador demo */}
                  <button
                    type="button"
                    onClick={fillAdminCredentials}
                    className="w-full h-9 lg:h-10 rounded-lg border-2 border-dashed border-primary/30 bg-primary/5 text-primary flex items-center justify-center gap-2 mb-3 lg:mb-4 shadow-sm hover:bg-primary/10 hover:border-primary/50 transition-all dark:bg-primary/10 dark:border-primary/30 dark:text-primary"
                  >
                    <div className="w-3 h-3 lg:w-4 lg:h-4 bg-primary rounded text-primary-foreground text-xs font-bold flex items-center justify-center">
                      A
                    </div>
                    <span className="text-sm lg:text-base font-medium">Usar credenciales de Admin</span>
                  </button>                    <div className="relative my-4">
                    <div className="h-px bg-border dark:bg-white/10" />
                    <span className="absolute inset-0 m-auto w-fit px-3 text-xs text-muted-foreground bg-white/90 dark:bg-slate-900/80">
                      o continúa con email
                    </span>
                  </div>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 lg:space-y-6">
                    <div className="space-y-1.5 lg:space-y-2">
                      <Label htmlFor="email" className="text-sm lg:text-base font-medium">
                        Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 lg:h-5 lg:w-5 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="tu@email.com"
                          autoComplete="email"
                          value={watchedFields.email || ""}
                          className={cn(
                            "pl-10 lg:pl-12 h-10 lg:h-11 text-sm lg:text-base focus-visible:ring-2 focus-visible:ring-offset-0 dark:bg-slate-900/60 dark:border-white/10 dark:placeholder:text-white/40 transition-all",
                            getFieldState("email") === "error" &&
                            "border-red-500 focus-visible:ring-red-500/60",
                            getFieldState("email") === "success" &&
                            "border-green-500 focus-visible:ring-green-500/60"
                          )}
                          {...register("email")}
                        />
                        {getFieldState("email") === "success" && (
                          <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                        )}
                        {getFieldState("email") === "error" && (
                          <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" />
                        )}
                      </div>
                      {errors.email && (
                        <p className="text-xs text-red-500 flex items-center gap-1 animate-in slide-in-from-left-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5 lg:space-y-2">
                      <Label htmlFor="password" className="text-sm lg:text-base font-medium">
                        Contraseña
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 lg:h-5 lg:w-5 text-muted-foreground" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          autoComplete="current-password"
                          value={watchedFields.password || ""}
                          className={cn(
                            "pl-10 lg:pl-12 pr-12 h-10 lg:h-11 text-sm lg:text-base focus-visible:ring-2 focus-visible:ring-offset-0 dark:bg-slate-900/60 dark:border-white/10 dark:placeholder:text-white/40 transition-all",
                            getFieldState("password") === "error" &&
                            "border-red-500 focus-visible:ring-red-500/60",
                            getFieldState("password") === "success" &&
                            "border-green-500 focus-visible:ring-green-500/60"
                          )}
                          {...register("password")}
                        />
                        <button
                          type="button"
                          className="absolute right-8 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={
                            showPassword
                              ? "Ocultar contraseña"
                              : "Mostrar contraseña"
                          }
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                        {getFieldState("password") === "success" && (
                          <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                        )}
                        {getFieldState("password") === "error" && (
                          <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" />
                        )}
                      </div>
                      {errors.password && (
                        <p className="text-xs text-red-500 flex items-center gap-1 animate-in slide-in-from-left-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.password.message}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 text-xs lg:text-sm text-muted-foreground cursor-pointer">
                        <Checkbox
                          checked={watchedFields.remember}
                          onCheckedChange={(checked) => setValue("remember", !!checked)}
                        />
                        Recordarme por 30 días
                      </label>
                      <Button
                        type="button"
                        variant="link"
                        className="text-xs lg:text-sm text-primary hover:underline p-0 h-auto"
                        onClick={() => setShowForgotPassword(true)}
                      >
                        ¿Olvidaste tu contraseña?
                      </Button>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting || loading || !isValid}
                      className="w-full h-10 lg:h-12 bg-gradient-to-r from-primary to-indigo-500 hover:from-primary/90 hover:to-indigo-500/90 shadow-md disabled:opacity-50 transition-all text-sm lg:text-base"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 lg:w-5 lg:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span className="text-sm lg:text-base">Iniciando sesión...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <LogIn className="h-4 w-4 lg:h-5 lg:w-5" />
                          <span className="text-sm lg:text-base">Ingresar</span>
                        </div>
                      )}
                    </Button>

                    {/* Información de credenciales demo */}
                    <div className="text-xs lg:text-sm text-muted-foreground text-center bg-muted/50 rounded p-2 lg:p-3">
                      <strong>Credenciales de prueba:</strong><br />
                      Email: admin@demo.com | Contraseña: admin123
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </MotionDiv>
        </div>

        {/* Lado derecho: hero imagen tipo showcase */}
        <div className="hidden lg:flex relative h-full items-center justify-center p-4 lg:p-6 xl:p-8 overflow-hidden">
          <div className="w-full max-w-[500px] lg:max-w-[600px] xl:max-w-[700px] rounded-2xl lg:rounded-3xl overflow-hidden shadow-[0_25px_80px_-20px_rgba(0,0,0,0.5)] border border-white/10 relative">
            <img
              src="/villa-house-model-key-drawing-retro-desktop-real-estate-sale-concept.jpg"
              alt="Real Estate"
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/35 to-black/75" />
            {/* Glow sutil bajo la tarjeta */}
            <div className="absolute -bottom-6 left-0 right-0 mx-auto h-10 w-2/3 bg-primary/30 blur-2xl rounded-full opacity-40" />
            <div className="relative z-10 p-6 lg:p-8 xl:p-12 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-6 text-white">
                <div className="w-10 h-10 rounded-xl bg-white/15 grid place-items-center backdrop-blur text-sm font-bold">
                  BO
                </div>
                <div className="text-xl font-semibold">Back Office</div>
              </div>
              <div className="text-white relative">
                {/* Radial glow detrás del título */}
                <div className="pointer-events-none absolute -inset-8 rounded-full bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.18),transparent_50%)]" />
                <h2 className="relative text-3xl lg:text-4xl xl:text-5xl leading-snug font-semibold max-w-3xl">
                  Empezá tu experiencia con Back Office y potenciá tu gestión
                </h2>
                <p className="relative mt-4 text-white/85 max-w-2xl text-sm">
                  A un paso de simplificar la carga de propiedades, filtros y
                  analytics para tu equipo.
                </p>
              </div>
              <div className="mt-auto text-xs text-white/70">
                Foto de ejemplo
              </div>
            </div>
          </div>
        </div>

        {/* Mobile footer - solo visible en mobile y tablet */}
        <div className="lg:hidden px-4 pb-6 text-center">
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
            <div className="w-5 h-5 notebook:w-6 notebook:h-6 rounded bg-primary/20 grid place-items-center text-xs font-bold">
              BO
            </div>
            <span className="text-xs notebook:text-sm">Back Office Inmobiliario</span>
          </div>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Sistema profesional de gestión para agentes inmobiliarios
          </p>
        </div>
      </div>

      {/* Modal de Recuperación de Contraseña */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-semibold mb-2">Recuperar contraseña</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Ingresa tu email y te enviaremos las instrucciones para restablecer tu contraseña.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const email = formData.get("resetEmail") as string;
                if (email) handleForgotPassword(email);
              }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="resetEmail">Email</Label>
                <Input
                  id="resetEmail"
                  name="resetEmail"
                  type="email"
                  placeholder="tu@email.com"
                  required
                  className="mt-1"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForgotPassword(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1">
                  Enviar instrucciones
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.02);
          }
        }
      `}</style>
    </div>
  );
}

// Componente principal con Suspense wrapper
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-sky-50 to-indigo-50 dark:from-[#0b1020] dark:via-[#0c1226] dark:to-[#0f1633]">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          Cargando...
        </div>
      </div>
    }>
      <LoginFormWithParams />
    </Suspense>
  );
}
