<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
	initialValue: string | number,
	onChange: (change: number) => void
}>()


const numberSpinnerModel = ref(
	typeof props.initialValue === 'string'
	? parseInt(props.initialValue)
	: props.initialValue
)

watch(numberSpinnerModel, () => {
	props.onChange(numberSpinnerModel.value)
})

</script><template>
	<v-text-field hide-details rounded density="compact" single-line variant="outlined" type="number" min="0" max="10"
		v-model="numberSpinnerModel" style="max-width: 75px;">
	</v-text-field>
</template>
