<template>
  <div>
    <PageSectionTitle :pageTitle="title" />

    <section>
      <h2>Explore MITRE ATLAS with AI</h2>
      <p>
        The ATLAS Knowledge Base Agent is an open-source AI assistant for exploring
        the MITRE ATLAS Knowledge Base.
      </p>

      <p>
        It gives you three ways to work with ATLAS:
      </p>
      <ol>
        <li>
          <strong>A natural-language guide for any user</strong><br>
          Learn about ATLAS tactics, techniques, mitigations, and case studies by
          asking questions in plain English.
        </li>
        <li>
          <strong>MCP server and API access</strong><br>
          Use the agent and its capabilities inside compatible tools, workflows, and
          custom applications.
        </li>
        <li>
          <strong>Fully open-source and customizable</strong><br>
          Inspect, modify, and tailor prompts, behavior, and subagents to fit
          specific security workflows and research needs.
        </li>
      </ol>
      <br />

      <p>
        <strong>
          Ask questions. Explore relationships. Generate knowledge graphs. Integrate
          ATLAS into your workflow.
        </strong>
      </p>

      <p>
        <a href="https://github.com/mitre-atlas/atlas-knowledge-base-agent">
          Try the ATLAS Agent ->
        </a>
      </p>

      <video autoplay loop muted playsinline controls width="85%">
        <source :src="videoUrl" type="video/webm" />
        Your browser does not support the video tag.
      </video>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PageSectionTitle from '@//components/PageSectionTitle.vue'
import { MITRE_TITLE, SHORT_NAME } from '@/config/env'
import videoUrl from '@/assets/atlas-agent.webm'

const title = ref(SHORT_NAME + ' Knowledge Base Agent')
</script>
