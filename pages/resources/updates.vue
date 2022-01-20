<template>
    <div>
        <page-title>{{ title }}</page-title>
        <v-tabs vertical>
            <v-tab v-for="updateFile in updateFilesList" :key="updateFile.slug">
                {{updateFile.slug}}
            </v-tab>
            <v-tab-item v-for="page in pages" :key="page.slug">
                <v-card flat>
                    <v-card-text>
                        <nuxt-content :document="page" />
                    </v-card-text>
                </v-card>
            </v-tab-item>
        </v-tabs>
    </div>
</template>

<script>
import packageData from '../../package.json'
export default {
    async asyncData({ $content }) {
        const updateFilesList = await $content('update-files').only(['title', 'slug']).sortBy('slug', 'desc').fetch()
        const pages = await $content('update-files').sortBy('slug', 'desc').fetch()
        return {
            updateFilesList, pages
        }
    },
    data: ({ $config: { name } }) => ({
        version: packageData.version,
        mitreTitle: name.mitre,
        shortName: name.short,
        title: 'Updates'
    }),
    head() {
        return {
            title: `${this.title} | ${this.mitreTitle}`
        }
    }

}
</script>
