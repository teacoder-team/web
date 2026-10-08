import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp'

interface OtpInputProps {
	value: string
	onChange: (value: string) => void
	disabled?: boolean
}

export function OtpInput({ value, onChange, disabled }: OtpInputProps) {
	return (
		<InputOTP
			maxLength={6}
			value={value}
			onChange={onChange}
			disabled={disabled}
		>
			<InputOTPGroup>
				<InputOTPSlot index={0} />
				<InputOTPSlot index={1} />
				<InputOTPSlot index={2} />
				<InputOTPSlot index={3} />
				<InputOTPSlot index={4} />
				<InputOTPSlot index={5} />
			</InputOTPGroup>
		</InputOTP>
	)
}
