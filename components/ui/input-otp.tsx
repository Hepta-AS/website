"use client"

import * as React from "react"
import OtpInput from "react18-input-otp"

import { cn } from "@/lib/utils"

interface InputOTPProps {
  value: string
  length?: number
  onChange: (value: string) => void
  className?: string
  disabled?: boolean
  isInputNum?: boolean
  autoFocus?: boolean
}

const InputOTP = React.forwardRef<HTMLDivElement, InputOTPProps>(
  ({ className, value, length = 6, onChange, disabled, isInputNum = true, autoFocus = false, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center gap-2", className)} {...props}>
      <OtpInput
        value={value}
        onChange={onChange}
        numInputs={length}
        isDisabled={disabled}
        isInputNum={isInputNum}
        shouldAutoFocus={autoFocus}
        containerStyle="flex gap-2"
        inputStyle={cn(
          "w-10 h-10 border border-input rounded-md text-center text-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        separator={<span className="text-muted-foreground">-</span>}
      />
    </div>
  )
)
InputOTP.displayName = "InputOTP"

const InputOTPGroup = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center", className)} {...props} />
))
InputOTPGroup.displayName = "InputOTPGroup"

const InputOTPSlot = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & {
    char: string | null
    hasFakeCaret: boolean
    isActive: boolean
  }
>(({ className, char, hasFakeCaret, isActive, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center border-y border-r border-input text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
        isActive && "z-10 ring-2 ring-ring ring-offset-background",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  )
})
InputOTPSlot.displayName = "InputOTPSlot"

const InputOTPSeparator = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ ...props }, ref) => (
  <div ref={ref} role="separator" {...props}>
    <span className="text-muted-foreground">-</span>
  </div>
))
InputOTPSeparator.displayName = "InputOTPSeparator"

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
