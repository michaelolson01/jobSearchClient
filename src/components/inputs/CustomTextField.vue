<script setup lang="ts">
import { ref, type Ref } from 'vue'

const props = defineProps<{
	initialValue: string,
	jobName?: string,
	fieldName?: string,
	onChange: (change: string) => void
}>()

const notesFieldModel = ref(props.initialValue)
const modifyNotesDialog = ref(false)
const dialogTextFieldModel: Ref<string> = ref('')

function modifyNotes() {
	dialogTextFieldModel.value = notesFieldModel.value
	modifyNotesDialog.value = true;
}

function updateNotes() {
	modifyNotesDialog.value = false
	notesFieldModel.value = dialogTextFieldModel.value
	props.onChange(notesFieldModel.value)
}

</script>

<template>
	<v-text-field density="compact" variant="solo" readonly hide-details v-model="notesFieldModel"
		style="min-width: 150px; overflow: hidden; text-overflow: ellipsis;" @click="modifyNotes">
		<v-tooltip :text="notesFieldModel" activator="parent" location="center" />
	</v-text-field>
	<v-dialog v-model="modifyNotesDialog" persistent>
		<v-card>
			<v-card-title>
				Modify {{ props.fieldName ?? 'textfield' }} for {{ props.jobName ?? 'Unknown Job' }}
			</v-card-title>
			<v-card-text>
				<v-text-field v-model="dialogTextFieldModel" hide-details variant="outlined" rows="20" no-resize />
			</v-card-text>
			<v-card-actions>
				<v-btn @click="modifyNotesDialog = false">
					Cancel
				</v-btn>
				<v-btn @click="updateNotes">
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
