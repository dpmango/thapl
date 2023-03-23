declare module '#app' {
  interface NuxtApp {
    $log: {
      log: (...x: any) => void
      logServer: (...x: any) => void
      warn: (...x: any) => void
      error: (...x: any) => void
    }
    $env: { [key: string]: string }
  }
}

declare global {
  namespace ymaps {
    export function Polygon(...x: any): void
  }
}

export {}
