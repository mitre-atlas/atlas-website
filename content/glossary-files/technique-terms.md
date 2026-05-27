---
title: Techniques
weight: 2
---

Techniques describe the means by which adversaries achieve tactical goals. They represent "how" an adversary achieves a tactical objective by performing an action.[<sup>\[1\]</sup>][1] There can be multiple techniques in an adversary uses to achieve each tactic as there are many ways to achieve tactical objectives.

For example, an adversary may gain initial access by compromising the machine learning (AI) supply chain. Techniques may also represent “what” an adversary gains by performing an action.

###### Maturity

The level of evidence supporting real-world adversary use of a technique.

- **Feasible**: Works in research or controlled settings, but is not necessarily demonstrated in realistic operations.
- **Demonstrated**: Shows effectiveness in realistic exercises, testing, or representative deployment conditions.
- **Realized**: Observed in real-world incidents or adversary operations against AI-enabled systems.

Note: this field is derived automatically from the technique's use in case studies.

###### Platform

The system an adversary is operating within.

- **Predictive AI**: The adversary is operating against AI components of the system that analyze data to classify, score, rank, forecast, or recommend outcomes, targeting components such as features, models, training data, inference logic, and decision thresholds.
- **Generative AI**: The is adversary operating against AI components of the system that generate new content (e.g., text, code, images, audio, video), targeting components such as prompts, model outputs, safety controls, retrieval context, and generation pipelines.
- **Agentic AI**: The adversary is operating against AI components of the system that can autonomously plan, decide, and execute multi-step actions (often with memory, tool use, and workflow orchestration), targeting aspects such as agent logic, planning loops, tool integrations, and control policies.
- **Enterprise**: The adversary is operating against standard organizational IT components of the AI-enabled system (e.g., user endpoints, servers, networks, identity systems, business applications, and cloud/SaaS services) rather than AI-specific components.

Techniques are tagged with one or more platforms, which can help users identify which techniques are relevant to their system.

[1]: https://attack.mitre.org/docs/ATTACK_Design_and_Philosophy_March_2020.pdf "MITRE ATT&CK: Design and Philosophy"
