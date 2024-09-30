<script setup lang="ts">
import { ref, computed, Ref } from 'vue'
import gql from 'graphql-tag'
import { useQuery, useMutation } from '@vue/apollo-composable'
import _ from 'lodash'
import CustomCheckBox from './inputs/CustomCheckBox.vue'
import CustomNumberSpinner from './inputs/CustomNumberSpinner.vue'
import NotesField from './inputs/NotesField.vue'
import CustomTextField from './inputs/CustomTextField.vue'
import CustomSelect from './inputs/CustomSelect.vue'
import CustomDatePicker from './inputs/CustomDatePicker.vue'
import type { Company, Job } from '../common-types.ts'

const JOBS_QUERY = gql`query JobQuery {
	jobs {
		id,
		companyId,
		name,
		applicationDate,
		confirmed,
		interviewCount,
		rejected,
		notes,
		resumeName,
		coverLetterName,
		jobDescription,
	}
}`

const ADD_JOB_MUTATION = gql`mutation AddJob($name: String!, $companyId: Int!) {
	addJob(
		input: {
			name: $name
			companyId: $companyId
		}
	) {
		job {
			id
			name
		}
	}
}`

const ADD_COMPANY_MUTATION = gql`mutation AddCompany($name: String!) {
	addCompany(
		input: {
			name: $name
		}
	) {
		company {
			id
			name
		}
	}
}`

const DELETE_JOB_MUTATION = gql`mutation DeleteJob($jobId: Int!) {
	deleteJob(
		input: {
			jobId: $jobId
		}) {
		int
	}
}`


const UPDATE_JOB_MUTATION = gql`mutation UpdateJob(
	$id: Int!,
	$name: String,
	$companyId: Int,
	$applicationDate: Date,
	$confirmed: Boolean,
	$interviewCount: Int,
	$rejected: Boolean,
	$notes: String,
	$resumeName: String,
	$coverLetterName: String,
	$jobDescription: String) {
		updateJob(
			input: {
				id: $id,
				name: $name,
				companyId: $companyId,
				applicationDate: $applicationDate,
				confirmed: $confirmed,
				interviewCount: $interviewCount,
				rejected: $rejected,
				notes: $notes,
				resumeName: $resumeName,
				coverLetterName: $coverLetterName,
				jobDescription: $jobDescription
			}) {
				boolean
			}
	}`

const COMPANIES_QUERY = gql`query CompaniesQuery {
	companies {
		id
		name
	}
}`

const { result: jobsResult, loading: jobsLoading, error: jobsError, refetch: jobsRefetch } = useQuery(JOBS_QUERY)

const { result: companiesResult, loading: companiesLoading, error: companiesError, refetch: companiesRefetch } = useQuery(COMPANIES_QUERY)

function getCompanyName(companyId: number) {
	if (companiesResult.value == null) return undefined
	return _.chain(companiesResult.value.companies)
		.find(company => company.id == companyId)
		.value().name
}

const jobsArray = computed((): Array<Job> | undefined => {
	if (jobsResult.value == null || companiesResult.value == null) return undefined
	return _.chain(jobsResult.value.jobs)
		.map(job => {
			return {
				...job,
				company: getCompanyName(job.companyId),
			}
		})
			.sortBy(job => job.id)
		.value()
})

const companiesArray = computed((): Array<Company> | undefined => {
	if (companiesResult.value == null) return undefined
	return _.chain(companiesResult.value.companies)
		.map(company => {
			return {
				name: company.name,
				id: company.id,
			}
		})
		.sortBy(company => company.id)
		.value()
})

const headers = [
	{ title: 'Job', align: 'start', key: 'name', style: "min-width: 2000px;" },
	{ title: 'Company', key: 'company', align: 'start' },
	{ title: 'Applied', key: 'applicationDate', align: 'start' },
	{ title: 'Confirmed', key: 'confirmed', align: 'start' },
	{ title: '# of Interviews', key: 'interviewCount', align: 'start' },
	{ title: 'Rejected', key: 'rejected', align: 'start' },
	{ title: 'Resume', key: 'resumeName', align: 'start' },
	{ title: 'Cover Letter', key: 'coverLetterName', align: 'start' },
	{ title: 'Job Description', key: 'jobDescription', align: 'start' },
	{ title: 'Notes', key: 'notes', align: 'start' },
	{ title: 'Delete', key: '', align: 'start' },
]

const addJobDialog = ref(false)

const removeJobDialog = ref(false)

const addJobName = ref('');
const addJobCompanyId: Ref<number | undefined> = ref()

function addJob() {
	if (companiesLoading.value) return
	addJobName.value = ''
	addJobCompanyId.value = companiesResult.value.companies[0].id
	addJobDialog.value = true
}

async function addToJobs() {
	// For some reason that this get set to undefined after it was set to a value,
	// dont do anything. (because typescript is stupid)
	if (addJobCompanyId.value == undefined) return
	addJobDialog.value = false

	const newJob: Job = {
		id: 0,
		name: addJobName.value,
		confirmed: false,
		interviewCount: 0,
		rejected: false,
		companyId: addJobCompanyId.value,
		// new date defaults to the current date.
		applicationDate: new Date(),
	}
	// Now to do a mutation.
	const { mutate: onDone } = useMutation(ADD_JOB_MUTATION, { variables: { name: newJob.name, companyId: newJob.companyId } })

	await onDone()
	jobsRefetch()
}

const addCompanyDialog = ref(false)

const addCompanyName = ref('')

function addCompany() {
	addCompanyName.value = ''
	addCompanyDialog.value = true
}

async function addToCompanies() {
	addCompanyDialog.value = false

	// Now to do a mutation.
	const { mutate: onDone } = useMutation(ADD_COMPANY_MUTATION, { variables: { name: addCompanyName.value } })

	await onDone()
	companiesRefetch()
}

function translateToNumber(input: string | number) {
	if (typeof input === 'string') return parseInt(input)
	input
}

async function deleteJob(input: string | number | undefined) {
	if (input == null) return
	removeJobDialog.value = false
	const translatedInput = translateToNumber(input)
	// Now to do a mutation.
	const { mutate: onDone } = useMutation(DELETE_JOB_MUTATION, { variables: { jobId: translatedInput } })

	await onDone()
	jobsRefetch()
}

async function changeConfirmed(input: string | number | undefined, newValue: boolean) {
	if (input == null) return
	const translatedInput = translateToNumber(input)
	// Now to do a mutation.
	const { mutate: onDone } = useMutation(UPDATE_JOB_MUTATION,
		{
			variables: {
				id: translatedInput,
				confirmed: newValue,
			}
		}
	)

	await onDone()
	jobsRefetch()
}

async function changeRejected(input: string | number | undefined, newValue: boolean) {
	if (input == null) return
	const translatedInput = translateToNumber(input)
	// Now to do a mutation.
	const { mutate: onDone } = useMutation(UPDATE_JOB_MUTATION,
		{
			variables: {
				id: translatedInput,
				rejected: newValue,
			}
		}
	)

	await onDone()
	jobsRefetch()
}

async function changeInterviewCount(input: string | number | undefined, newValue: number | string) {
	if (input == null) return
	const translatedInput = translateToNumber(input)
	const translatedInterviewCount = translateToNumber(newValue)
	// Now to do a mutation.
	const { mutate: onDone } = useMutation(UPDATE_JOB_MUTATION,
		{
			variables: {
				id: translatedInput,
				interviewCount: translatedInterviewCount,
			}
		}
	)

	await onDone()
	jobsRefetch()
}

async function changeNotes(input: string | number | undefined, newValue: string) {
	if (input == null) return
	const translatedInput = translateToNumber(input)
	// Now to do a mutation.
	const { mutate: onDone } = useMutation(UPDATE_JOB_MUTATION,
		{
			variables: {
				id: translatedInput,
				notes: newValue,
			}
		}
	)

	await onDone()
	jobsRefetch()
}

async function changeJobName(input: string | number | undefined, newValue: string) {
	if (input == null) return
	const translatedInput = translateToNumber(input)
	// Now to do a mutation.
	const { mutate: onDone } = useMutation(UPDATE_JOB_MUTATION,
		{
			variables: {
				id: translatedInput,
				name: newValue,
			}
		}
	)

	await onDone()
	jobsRefetch()
}

async function changeJobDescription(input: string | number | undefined, newValue: string) {
	if (input == null) return
	const translatedInput = translateToNumber(input)
	// Now to do a mutation.
	const { mutate: onDone } = useMutation(UPDATE_JOB_MUTATION,
		{
			variables: {
				id: translatedInput,
				jobDescription: newValue,
			}
		}
	)

	await onDone()
	jobsRefetch()
}

async function changeResumeName(input: string | number | undefined, newValue: string) {
	if (input == null) return
	const translatedInput = translateToNumber(input)
	// Now to do a mutation.
	const { mutate: onDone } = useMutation(UPDATE_JOB_MUTATION,
		{
			variables: {
				id: translatedInput,
				resumeName: newValue,
			}
		}
	)

	await onDone()
	jobsRefetch()
}

async function changeCoverLetterName(input: string | number | undefined, newValue: string) {
	if (input == null) return
	const translatedInput = translateToNumber(input)
	// Now to do a mutation.
	const { mutate: onDone } = useMutation(UPDATE_JOB_MUTATION,
		{
			variables: {
				id: translatedInput,
				coverLetterName: newValue,
			}
		}
	)

	await onDone()
	jobsRefetch()
}

async function changeJobCompany(input: string | number | undefined, newValue: { name: string, id: number }) {
	if (input == null) return
	const translatedInput = translateToNumber(input)
	// Now to do a mutation.
	const { mutate: onDone } = useMutation(UPDATE_JOB_MUTATION,
		{
			variables: {
				id: translatedInput,
				companyId: newValue.id
			}
		}
	)

	await onDone()
	jobsRefetch()
}

async function changeApplicationDate(input: string | number | undefined, newValue: Date) {
	if (input == null) return
	const translatedInput = translateToNumber(input)
	// Now to do a mutation.
	const { mutate: onDone } = useMutation(UPDATE_JOB_MUTATION,
		{
			variables: {
				id: translatedInput,
				applicationDate: newValue
			}
		}
	)

	await onDone()
	jobsRefetch()
}

</script>

<template>
	<v-row>
		<v-col>
			<v-card>
				<v-card-title>
					Job List
				</v-card-title>
				<v-divider />
				<v-card-text>
					<v-row>
						<v-col>
							<v-data-table :headers="headers" :items="jobsArray">
								<template v-slot:item="props">
									<tr>
										<td>
											<CustomTextField :initial-value="props.item.name ?? ''"
												:job-name="props.item.name + ' at ' + (props.item.company ?? 'Unknown Company')"
												:on-change="(newValue) => changeJobName(props.item.id, newValue)" />
										</td>
										<td>
											<CustomSelect
												:initial-value="{name: props.item.company ?? '', id: props.item.companyId }"
												:availableEntries="companiesArray ?? [{ name: 'Loading', id: -1}]"
												:job-name="'Updating company for ' + props.item.name"
												:on-change="(newValue) => changeJobCompany(props.item.id, newValue)" />
										</td>
										<td>
											<!-- Note: if this is used in any other time zone, the CST may have to change. -->
											<CustomDatePicker :initial-value="new Date(props.item.applicationDate.toString() + ' CST')"
												:job-name="props.item.name + ' at ' + (props.item.company ?? 'Unknown Company')"
												:on-change="(newValue) => changeApplicationDate(props.item.id, newValue)" />
										</td>
										<td>
											<CustomCheckBox :initial-value="props.item.confirmed.toString()"
												:on-change="(newValue) => changeConfirmed(props.item.id, newValue)" />
										</td>
										<td>
											<CustomNumberSpinner :initial-value="props.item.interviewCount"
												:on-change="(newValue) => changeInterviewCount(props.item.id, newValue)" />
										</td>
										<td>
											<CustomCheckBox :initial-value="props.item.rejected.toString()"
												:on-change="(newValue) => changeRejected(props.item.id, newValue)" />
										</td>
										<td>
											<CustomTextField :initial-value="props.item.resumeName ?? ''"
												:job-name="props.item.name + ' at ' + (props.item.company ?? 'Unknown Company')"
												:on-change="(newValue) => changeResumeName(props.item.id, newValue)" />
										</td>
										<td>
											<CustomTextField :initial-value="props.item.coverLetterName ?? ''"
												:job-name="props.item.name + ' at ' + (props.item.company ?? 'Unknown Company')"
												:on-change="(newValue) => changeCoverLetterName(props.item.id, newValue)" />
										</td>
										<td>
											<NotesField :initial-value="props.item.jobDescription ?? ''"
												:job-name="props.item.name + ' at ' + (props.item.company ?? 'Unknown Company')"
												:on-change="(newValue) => changeJobDescription(props.item.id, newValue)" />
										</td>
										<td>
											<NotesField :initial-value="props.item.notes ?? ''"
												:job-name="props.item.name + ' at ' + (props.item.company ?? 'Unknown Company')"
												:on-change="(newValue) => changeNotes(props.item.id, newValue)" />
										</td>
										<td>
											<v-btn @click="deleteJob(props.item.id)" size="x-small" icon="mdi-delete"
												color="red" />
										</td>
									</tr>
								</template>
							</v-data-table>
						</v-col>
					</v-row>
				</v-card-text>
				<v-divider />
				<v-card-actions>
					<v-spacer />
					<v-btn elevation="1" @click="addJob">
						Add Job
					</v-btn>
					<v-btn elevation="1" @click="addCompany">
						Add Company
					</v-btn>
				</v-card-actions>
			</v-card>
			<v-dialog v-model="addJobDialog" persistent>
				<v-card>
					<v-card-title>
						Add a job
					</v-card-title>
					<v-card-text>
						<v-row>
							<v-col>
								<v-text-field label="Name" v-model="addJobName" placeholder="New Job Name"
									:rules="[value => !!value || 'Field is Required']">
								</v-text-field>
							</v-col>
							<v-col>
								<v-select label="Company" v-model="addJobCompanyId" :items="companiesResult.companies"
									item-title="name" item-value="id">
								</v-select>
							</v-col>
						</v-row>
					</v-card-text>
					<v-card-actions>
						<v-btn @click="addToJobs" :disabled="addJobName == null || addJobName === ''" elevation="1">
							Commence
						</v-btn>
						<v-btn @click="addJobDialog = false" elevation="1">
							Cancel
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
			<v-dialog v-model="addCompanyDialog" persistent>
				<v-card>
					<v-card-title>
						Add a Company
					</v-card-title>
					<v-card-text>
						<v-row>
							<v-col>
								<v-text-field label="Name" v-model="addCompanyName" placeholder="New Company Name"
									:rules="[value => !!value || 'Field is Required']">
								</v-text-field>
							</v-col>
						</v-row>
					</v-card-text>
					<v-card-actions>
						<v-btn @click="addToCompanies" :disabled="addCompanyName == null || addCompanyName === ''"
							elevation="1">
							Commence
						</v-btn>
						<v-btn @click="addCompanyDialog = false" elevation="1">
							Cancel
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
		</v-col>
	</v-row>
</template>
