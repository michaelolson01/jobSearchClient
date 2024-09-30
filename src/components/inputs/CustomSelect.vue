<script setup lang="ts">
import { ref, type Ref } from 'vue'
import type { Company } from '../../common-types.ts'

const props = defineProps<{
	initialValue: Company,
	availableEntries: Array<Company>,
	jobName?: string,
	onChange: (change: Company) => void
}>()

const selectModel = ref(props.initialValue)
const updateSelectionDialog = ref(false)
const dialogSelectModel: Ref<Company> = ref({id: -1, name: ''})

function modifySelection() {
	dialogSelectModel.value = selectModel.value
	updateSelectionDialog.value = true;
}

function updateSelection() {
	updateSelectionDialog.value = false
	selectModel.value = dialogSelectModel.value
	props.onChange(selectModel.value)
}

</script>

<template>
	<v-text-field density="compact" variant="solo" readonly hide-details v-model="selectModel.name"
		style="min-width: 150px; overflow: hidden; text-overflow: ellipsis;" @click="modifySelection">
		<v-tooltip :text="selectModel.name" activator="parent" location="center" />
	</v-text-field>
	<v-dialog v-model="updateSelectionDialog" persistent>
		<v-card>
			<v-card-title>
				Modify Notes for {{ props.jobName ?? 'Unknown Job' }}
			</v-card-title>
			<v-card-text>
				<v-select v-model="dialogSelectModel" :items="availableEntries" hide-details variant="solo"
					item-title="name" return-object />
			</v-card-text>
			<v-card-actions>
				<v-btn @click=" updateSelectionDialog=false">
					Cancel
				</v-btn>
				<v-btn @click="updateSelection">
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
