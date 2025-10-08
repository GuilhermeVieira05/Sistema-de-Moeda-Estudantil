"use client"

interface TextFieldProps {
  label: string
  type?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  error?: string
  multiline?: boolean
  rows?: number
  helperText?: string
  disabled?: boolean
}

export default function TextField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  error,
  multiline = false,
  rows = 3,
  helperText,
  disabled = false,
}: TextFieldProps) {
  const inputClasses = `w-full px-4 py-3 rounded-lg border ${
    error ? "border-error" : "border-border"
  } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all`

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-foreground mb-2">
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </label>

      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          rows={rows}
          className={inputClasses}
          disabled={disabled}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className={inputClasses}
          disabled={disabled}
        />
      )}

      {error && <p className="text-error text-sm mt-1">{error}</p>}
      {!error && helperText && <p className="text-muted-foreground text-sm mt-1">{helperText}</p>}
    </div>
  )
}
