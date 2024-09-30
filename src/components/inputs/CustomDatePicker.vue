<script setup lang="ts">
import { ref, type Ref } from 'vue'

const props = defineProps<{
	initialValue: Date,
	jobName?: string,
	onChange: (change: Date) => void
}>()

const datePickerModel = ref(props.initialValue)
const modifyDateDialog = ref(false)
const dialogDatePicker: Ref<Date> = ref(new Date())

function modifyDate() {
	dialogDatePicker.value = datePickerModel.value
	modifyDateDialog.value = true;
}

function updateDate() {
	modifyDateDialog.value = false
	datePickerModel.value = dialogDatePicker.value
	props.onChange(datePickerModel.value)
}

</script>

<template>
	<div @click="modifyDate">
		{{ datePickerModel.toLocaleDateString() }}
		<v-tooltip :text="datePickerModel.toLocaleDateString()" activator="parent" location="center" />
	</div>
	<v-dialog v-model="modifyDateDialog" persistent>
		<v-card>
			<v-card-title>
				Modify Date for {{ props.jobName ?? 'Unknown Job' }}
			</v-card-title>
			<v-card-text>
				<v-date-picker v-model="dialogDatePicker" />
			</v-card-text>
			<v-card-actions>
				<v-btn @click="modifyDateDialog = false">
					Cancel
				</v-btn>
				<v-btn @click="updateDate">
					Approve
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<style lang="scss" scoped>
:deep(.v-field__input) {
	overflow: scroll;
	text-overflow: ellipsis;
}
</style>
