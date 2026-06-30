import{E as e,Lt as t,V as n,d as r,dt as i,i as a,lt as o,m as s,y as c,z as l}from"./runtime-core.esm-bundler-CamfpX4o.js";import{t as u}from"./PageSectionTitle-B38fbuoR.js";var d=`---
title: Case Studies
weight: 3
---

###### Incident Date

The time frame as to when the incident or exercise discussed in the case study occurred.

###### Actor

The group that performed this operation. This could be a threat group or bad actor responsible for the incident, the researchers, AI red team, or security group that performed the demonstration.

###### Reporter

The group that identified and reported this incident or exercise. In the case of an exercise, this may be the Actor.

###### Target

The victim system or organization targeted by the Actor.

###### Type

Whether this case study describes a real-world incident or exercise under a realistic threat model and representative Target system.
`,f=`---
title: Tactics
weight: 1
---

Tactics are tactical adversary goals during an attack. They represent the “why” of a technique: the reason for performing an action.
Tactics serve as useful contextual categories for individual techniques and cover standard notations for things adversaries do during an operation. [<sup>\\[1\\]</sup>][1]

ATLAS tactics represent new adversary goals particular to artificial intelligence systems, as well as tactics adapted from the MITRE ATT&CK<sup>&reg;</sup> Enterprise Matrix.
In those cases, ATT&amp;CK tactic definitions are expanded to include AI concepts.

[1]: https://attack.mitre.org/docs/ATTACK_Design_and_Philosophy_March_2020.pdf "MITRE ATT&CK: Design and Philosophy"
`,p=`---
title: Mitigation Terms
weight: 4
---

###### AI Lifecycle Phases

Identifies the phase of the AI lifecycle[<sup>\\[1\\]</sup>][1] where a mitigation is primarily planned, implemented, or maintained.

| Phase Name | Description  |
|---|---|
| Business and Data Understanding | Defining the scope and requirements of the project and collecting data |
| Data Preparation                | Data cleaning, data augmentation, and developing a robust data pipeline |
| AI Model Engineering            | Defining quality measures, selecting a model architecture, and training a model |
| AI Model Evaluation             | Increasing model explainability and ensuring that the developed model complies with project needs and satisfies risk and safety constraints |
| Deployment                      | Setting up production environment and productionizing the validated ML model |
| Monitoring and Maintenance      | Continually evaluating the deployed model to ensure it continues to fulfill quality assurance measures |

Mitigations are tagged with one or more lifecycle phases to help teams operating in each phase of the lifecycle to identify threats that could impact their task requirements and possible ways to mitigate those threats.

###### Categories

The broad mitigation approach used to reduce risk from adversary techniques.

- **Policy**: Relating to procedures and processes that govern how tools are used, maintained, and deployed.
- **Technical - AI**: Relating to AI-specific hardware, software, and technological systems implemented to mitigate threats.
- **Technical - Cyber**: Relating to cyber-specific hardware, software, and technological systems implemented to mitigate threats.

Mitigations are tagged with or or more categories to help identify the correct team to implement the mitigation.


[1]: https://attack.mitre.org/docs/ATTACK_Design_and_Philosophy_March_2020.pdf "MITRE ATT&CK: Design and Philosophy"
`,m=`---
title: Techniques
weight: 2
---

Techniques describe the means by which adversaries achieve tactical goals. They represent "how" an adversary achieves a tactical objective by performing an action.[<sup>\\[1\\]</sup>][1] There can be multiple techniques in an adversary uses to achieve each tactic as there are many ways to achieve tactical objectives.

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
`,h={class:`text-h5 mt-10 mb-5`},g=[`innerHTML`],_={__name:`GlossaryView`,setup(_){let v=i(`ATLAS Glossary`),y=e(`markdownit`),b=o([]);return Object.values(Object.assign({"/public/content/glossary-files/case-study-terms.md":d,"/public/content/glossary-files/general.md":f,"/public/content/glossary-files/mitigation-terms.md":p,"/public/content/glossary-files/technique-terms.md":m})).map(e=>{let t={},n=y.render(e,t),r={frontmatter:t.frontmatter,content:n};b.push(r)}),b.sort((e,t)=>`weight`in e.frontmatter&&`weight`in t.frontmatter?e.frontmatter.weight-t.frontmatter.weight:`title`in e.frontmatter&&`title`in t.frontmatter?e.frontmatter.title.localeCompare(t.frontmatter.title):e-t),(e,i)=>(l(),s(`div`,null,[c(u,{pageTitle:v.value},null,8,[`pageTitle`]),(l(!0),s(a,null,n(b,(e,n)=>(l(),s(`div`,{key:n},[r(`div`,h,t(e.frontmatter.title),1),r(`div`,{innerHTML:e.content},null,8,g)]))),128))]))}};export{_ as default};