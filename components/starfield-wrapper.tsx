"use client"

import dynamic from "next/dynamic"

const Starfield = dynamic(() => import("./starfield"), {
  ssr: false,
  loading: () => null,
})

export function StarfieldWrapper() {
  return <Starfield />
}
