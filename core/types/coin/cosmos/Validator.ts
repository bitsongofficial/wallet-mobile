export interface Validator {
	commission: {
		rate: {
			max: number,
			current: number,
		},
		change: {
			max: number,
			last: Date,
		}
	}
	operator: string,
	tokens: number,
	uptime: number,
} 