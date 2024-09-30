export type Company = {
	id: number;
	name: string,
}

export type Job = {
	id?: number,
	companyId: number,
	name: string,
	applicationDate: Date,
	confirmed: boolean,
	interviewCount: number,
	rejected: boolean,
	notes?: string,
	resumeName?: string,
	coverLetterName?: string,
	jobDescription?: string,
	company?: string
}
