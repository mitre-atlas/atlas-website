<template>
  <div>
    <PageSectionTitle :pageTitle="title" />
    <p>
      The {{ VITE_MITRE_TITLE }} Knowledge Graph provides an interactive way to explore information
      found within the ATLAS Threat Matrix. Each node represents an ATLAS entity and each edge
      represents a relationship between them.
    </p>

    <div>
      Using the Interactive Visualization:
      <ul>
        <li>
          <b>Inspect nodes:</b> Click and hold a node to view metadata and enter <i>focus mode</i>.
        </li>
        <li>
          <b>Expand relationships:</b> While in focus mode press +/- to expand/reduce the visible
          network, or click additional nodes to explore their connections.
        </li>
        <li><b>Clear focus:</b> Click and hold empty space to reset the view.</li>
        <li><b>Search:</b> Use the search bar to find entities by ID (e.g., AML.T0051) or name.</li>
        <li>
          <b>Filter entities:</b>
          <ul>
            <li>
              <b>Top filters</b> dynamically toggle entity types (e.g., try viewing only tactics and
              techniques).
            </li>
            <li>
              <b>Bottom filters</b> hide or reveal entities in place without changing the graph
              layout.
            </li>
          </ul>
        </li>
      </ul>
    </div>

    <iframe :src="`${VITE_KNOWLEDGE_GRAPH_URL}`" width="100%" height="750" frameborder="0">
    </iframe>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PageSectionTitle from '@//components/PageSectionTitle.vue'

const { VITE_MITRE_TITLE, VITE_SHORT_NAME, VITE_KNOWLEDGE_GRAPH_URL } = import.meta.env
const title = ref(VITE_SHORT_NAME + ' Knowledge Graph')

const loading = ref(true)
</script>
