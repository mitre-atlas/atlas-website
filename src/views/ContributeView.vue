<template>
    <div class="ma-3 ma-md-0">
        <v-container class="text-mediumNavy pt-sm-16 mt-sm-16">
            <div class="text-h4 my-3 text-mediumNavy" style="line-height: 44px;">
                Contribute to
                <v-img src="@/assets/graphics/MITRE_ATLAS_dark.svg" width="240px" inline></v-img>
            </div>
            <v-row>
                <v-col cols="12" sm="8">
                    <p>
                        {{ VITE_MITRE_TITLE }} is a continuously growing and evolving knowledge base of how AI systems
                        can
                        be attacked. Its strength comes in large part from the community that fuels it, and that’s where
                        you
                        come in! By sharing your insights, you’ll help make the knowledge base holistic, up-to-date,
                        and ready for the next wave of AI threats.
                    </p>
                    <p style="font-size: 20px; font-weight: 500" class="mb-0 mt-12">
                        Have a fresh tactic, a clever technique, or a new mitigation? Perhaps a combination? Send it our
                        way! While all contributions to ATLAS are appreciated, we’re especially interested in:
                    </p>
                </v-col>
                <v-col style="align-content: center;" cols="4" class="d-sm-block d-none">
                    <v-img src="@/assets/graphics/MITRE_Atlas_logo.svg" max-height="156px" />
                </v-col>
            </v-row>
        </v-container>
        <v-container style="margin-top: 50px;">
            <v-row justify="center">
                <v-col v-for="type in contributeTypes" cols="12" sm="6" lg="3" xl="2">
                    <v-card class="fill-height d-flex flex-column bg-lightNavy rounded-lg py-2">
                        <v-card-title class="text-center" style="font-size: 30px;">{{ type.name }}</v-card-title>
                        <div class="horizontal-divider"></div>
                        <v-card-text class="flex-grow-1 text-center pt-10" v-html="type.text" />
                        <v-card-actions class="justify-space-evenly">
                            <VAtlasBtnPrimary class="ma-auto" :to="type.action" append-icon="mdi-chevron-right">
                                Contribute a {{ type.actionWord }}
                            </VAtlasBtnPrimary>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
        <v-container class="text-center text-mediumNavy pt-8 pb-16 mt-sm-8 mb-sm-16">
            <div class="mb-12">
                <p class="mb-1">Not sure where your contribution fits?</p>
                <router-link to="/contribute/submit?type=other" class="text-info font-weight-bold">
                    Send us a General Contribution!
                </router-link>
            </div>
            <div>
                <p class="mb-1">Notice a tweak or update that might improve the ATLAS Matrix?</p>
                <router-link to="/contribute/submit?action=edit" class="text-info font-weight-bold">
                    Suggest an Edit
                </router-link>
                and let us know!
            </div>
        </v-container>
    </div>
    <v-container class="py-9 mx-3 mx-md-0" fluid style="background-color: #0e2f4f0d;">
        <v-container>
            <div class="text-h4 my-3 text-mediumNavy">Benefits of Contributing</div>
            <v-row justify="space-evenly" class="mt-sm-16 mt-8">
                <v-col v-for="type in benefitTypes" class="text-center" cols="12" sm="4" md="3" xl="2">
                    <v-img :src="getIconPath(type.name)" max-height="100px"></v-img>
                    <div class="text-info text-h6 mt-8">{{ type.name }}</div>
                    <p>{{ type.text }}</p>
                </v-col>
            </v-row>
        </v-container>
    </v-container>
    <div class="ma-3 ma-md-0">
        <v-container class="px-7 px-md-4 pt-6">
            <ContributorsListView></ContributorsListView>
        </v-container>
        <div class="text-center my-16 py-sm-16">
            <div class="text-h5 text-darkInfo font-weight-bold">Thank you for your contribution and expertise!</div>
            <div class="text-mediumNavy mt-12">
                Have questions or need assistance?<br />
                Reach out to <a href="mailto: atlas@mitre.org">atlas@mitre.org</a> — we’re here to help!
            </div>
        </div>

    </div>
</template>
<script setup>
import ContributorsListView from '@/views/resources/ContributorsListView.vue';

const { VITE_MITRE_TITLE } = import.meta.env

const contributeTypes = [
    {
        name: 'Tactics',
        text: 'Tactics are tactical adversary goals during an attack. They represent the “why” of a technique: the reason for performing an action. Tactics serve as useful contextual categories for individual techniques and cover standard notations for activities adversaries conduct during an operation.',
        action: '/contribute/submit?type=tactics',
        actionWord: 'Tactic'
    },
    {
        name: 'Techniques',
        text: 'Techniques describe the means by which adversaries achieve tactical goals. They represent “how” an adversary achieves a tactical objective by performing an action. <br /><br /> Techniques may also represent “what” an adversary gains by performing an action.',
        action: '/contribute/submit?type=techniques',
        actionWord: 'Technique'
    },
    {
        name: 'Mitigations',
        text: 'Mitigations represent security concepts and classes of technologies that can be used to prevent a technique or sub-technique from being successfully executed.',
        action: '/contribute/submit?type=mitigations',
        actionWord: 'Mitigation'
    },
    {
        name: 'Case Studies',
        text: 'Case studies describe real-world attacks on AI systems and the impacts of these attacks.',
        action: '/contribute/submit?type=studies',
        actionWord: 'Case Study'
    }
]

const benefitTypes = [
    {
        name: 'Recognition',
        text: 'Your name (or alias) will be credited in ATLAS for every accepted contribution',
    },
    {
        name: 'Learning',
        text: 'Dive deeper into the latest AI‑adversary research and sharpen your own expertise'
    },
    {
        name: 'Community',
        text: 'Join a vibrant network of security researchers and engineers who share a common goal of securing the future of Artificial Intelligence'
    }
]

const getIconPath = (iconName) => {
    // Adjust the '../assets/' path to match your folder structure
    return new URL(`../assets/icons/${iconName}_Icon.svg`, import.meta.url).href
}
</script>
<style scoped>
.horizontal-divider {
    width: 260px;
    max-width: 75%;
    height: 0;
    border-bottom: .5px solid white;
    margin: auto;
}
</style>
