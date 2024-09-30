<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
	initialValue: string,
	onChange: (change: boolean) => void
}>()

const checkboxModel = ref(props.initialValue === 'false' ? false : true)

watch(checkboxModel, () => {
	props.onChange(checkboxModel.value)
})

</script>

<template>
	<v-checkbox-btn
		v-model="checkboxModel"
	>
	</v-checkbox-btn>
</template>
