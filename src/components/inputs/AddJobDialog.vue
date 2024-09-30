<script setup lang="ts">
import { ref, computed } from 'vue'
import _ from 'lodash'

const props = defineProps<{ vModel: boolean }>()

</script>

<template>
	<v-dialog v-model="dialog" persistent>
		<v-card>
			<v-card-title>
				Add a job
			</v-card-title>
			<v-card-text>
				<v-row>
					<v-col>
						<v-text-field label="Name">
						</v-text-field>
					</v-col>
				</v-row>
			</v-card-text>
			<v-card-actions>
				<v-btn @click="props.vModel = false">
					Close
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<style scoped>
.read-the-docs {
	color: #888;
}
</style>
