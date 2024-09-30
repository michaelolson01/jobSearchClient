import { createApp, provide, h } from 'vue'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { DefaultApolloClient, provideApolloClient } from '@vue/apollo-composable'
import { ApolloClient, InMemoryCache } from '@apollo/client/core'
import { fa } from "vuetify/iconsets/fa"
import { aliases, mdi } from "vuetify/lib/iconsets/mdi"
import "@mdi/font/css/materialdesignicons.css"
import "@fortawesome/fontawesome-free/css/all.css"
import './style.css'
import App from './App.vue'

const vuetify = createVuetify({
	icons: {
		defaultSet: "mdi",
		aliases,
		sets: {
			mdi,
			fa,
		},
	},
	components,
	directives,
})

const cache = new InMemoryCache()

const apolloClient = new ApolloClient({
	cache,
	uri: 'http://localhost:5100/graphql',
})

const app = createApp({
	setup() {
		provide(DefaultApolloClient, apolloClient)
	},
	render: () => h(App),
})

provideApolloClient(apolloClient)

app.use(vuetify)
app.mount('#app')

