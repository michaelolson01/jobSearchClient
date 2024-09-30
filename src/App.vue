<script setup lang="ts">
import JobSearchPage from './components/JobSearchPage.vue'
</script>

<template>
	<v-container fluid class="fill-width px-0 mx-0">
		<v-layout>
			<v-app-bar title="Mike's Job Search Web App" />
			<v-main>
				<v-container fluid class="px-0">
					<JobSearchPage />
				</v-container>
			</v-main>
		</v-layout>
	</v-container>
</template>

<style>
body {
	padding: 0 !important;
	margin: 0 !important;
}

#app {
	/* Why do I have to set this? What idiot decided that the screen can only be 1280px?*/
	max-width: 100% !important;
	max-height: 100% !important;
}
</style>
