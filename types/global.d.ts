declare module "@supabase/ssr" {
  export type CookieOptions = any
  export function createServerClient(
    url: string,
    key: string,
    options: {
      cookies: {
        getAll: () => Array<{ name: string; value: string }>
        setAll: (cookies: { name: string; value: string; options: CookieOptions }[]) => void
      }
    }
  ): any
  export function createBrowserClient(url: string, key: string): any
}



