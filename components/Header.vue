<template>
    <div class="header">
        <div>
            <b-navbar toggleable="lg" type="dark" variant="dark">
                <b-navbar-brand href="#">
                    <NuxtLink to="/">MITRE | AdvML</NuxtLink>
                </b-navbar-brand>

                <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

                <b-collapse id="nav-collapse" is-nav>

                    <!-- Right aligned nav items -->
                    <b-navbar-nav class="ml-auto">
                        <b-navbar-nav>
                        <b-nav-item href="">
                            <NuxtLink to="/matrixpage">Matrix</NuxtLink>
                        </b-nav-item>
                        <b-nav-item href="">
                            <NuxtLink to="/content/?page=case-studies-page">Case Studies</NuxtLink>
                        </b-nav-item>
                        <b-nav-item-dropdown text="Resources" class="resources-list">
                            <b-dropdown-item href="">
                                <NuxtLink to="/content/?page=adversarial-ml-101">Adversarial ML 101</NuxtLink>
                            </b-dropdown-item>
                            <b-dropdown-item href="">
                                <NuxtLink to="/content/?page=contributors">Contribute</NuxtLink>
                            </b-dropdown-item>
                            <b-dropdown-item href="">
                                <NuxtLink to="/content/?page=feedback">Feedback</NuxtLink>
                            </b-dropdown-item>
                        </b-nav-item-dropdown>
                    </b-navbar-nav>
                        <b-nav-form>
                            <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
                            <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
                        </b-nav-form>
                    </b-navbar-nav>
                </b-collapse>
            </b-navbar>
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style>

a {
    text-decoration: none;
    color: white;
}

.resources-list a  {
    text-decoration: none;
    color: black;
}

NuxtLink {
    color: blue;
}

</style>
