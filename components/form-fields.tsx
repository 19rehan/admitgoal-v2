"use client"

import type React from "react"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

interface FieldProps {
  label: string
  type?: string
  placeholder?: string
  icon?: React.ReactNode
  value?: string
  onChange?: (v: string) => void
  required?: boolean
  name?: string
}

export function Field({ label, type = "text", placeholder, icon, value, onChange, required, name }: FieldProps) {
  const [show, setShow] = useState(false)
  const isPassword = type === "password"
  const inputType = isPassword ? (show ? "text" : "password") : type

  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </span>
        )}
        <input
          name={name}
          type={inputType}
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className={`w-full rounded-xl border border-input bg-white/5 py-3 text-sm text-foreground outline-none transition-all duration-200 placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/30 ${
            icon ? "pl-10" : "pl-4"
          } ${isPassword ? "pr-10" : "pr-4"}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
    </label>
  )
}

interface SelectFieldProps {
  label: string
  options: { value: string; label: string }[]
  value?: string
  onChange?: (v: string) => void
  placeholder?: string
}

export function SelectField({ label, options, value, onChange, placeholder }: SelectFieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full rounded-xl border border-input bg-white/5 px-4 py-3 text-sm text-foreground outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/30"
      >
        {placeholder && (
          <option value="" className="bg-card">
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-card">
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}
