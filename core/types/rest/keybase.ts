export interface Keybase {
	keybaseHash: string,
	picture?: string,
	updated?: string | Date,
}

export interface KeybaseResponseStatus {
	code: number,
	name: string,
}

export interface KeybaseUser {
	full_name: string | null,
	is_followee: boolean,
	picture_url: string,
	raw_score: number,
	stellar: string | null,
	uid: string,
	username: string,
}

export interface KeybaseService {
	service_name: string,
	username?: string,
}

export interface KeybaseItem {
	keybase: KeybaseUser,
	score: number,
	services_summary: KeybaseServicesSummary,
}

export interface KeybaseResponse {
	list: KeybaseItem[],
	status: KeybaseResponseStatus,
}

export type KeybaseServicesSummary = { [key: string]: KeybaseService }