import{E as e,Rt as t,V as n,d as r,ft as i,i as a,m as o,ut as s,y as c,z as l}from"./runtime-core.esm-bundler-Btdg4c3b.js";import{t as u}from"./PageSectionTitle-DLHrzuYm.js";var d=`---
title: Case Study Terminology
weight: 2
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
title: General Terms
weight: 1
---

###### Tactic

Tactics are tactical adversary goals during an attack. They represent the “why” of a technique: the reason for performing an action.
Tactics serve as useful contextual categories for individual techniques and cover standard notations for things adversaries do during an operation.
[<sup>\\[1\\]</sup>][1] MITRE ATLAS<sup>&trade;</sup> tactics represent new adversary goals particular to artificial intelligence systems, as well as tactics adapted from the MITRE ATT&CK<sup>&reg;</sup> Enterprise Matrix.
In those cases, ATT&CK tactic definitions are stretched to include ML concepts.

###### Technique

Techniques describe the means by which adversaries achieve tactical goals. They represent "how" an adversary achieves a tactical objective by performing an action.
For example, an adversary may gain initial access by compromising the machine learning (ML) supply chain. Techniques may also represent “what” an adversary gains by performing an action. This is a useful distinction for the ML Attack Staging tactic,
where the adversary is typically creating or modifying an ML artifact that will be used in a subsequent tactical objective.
There can be multiple techniques in each tactic category as there are many ways to achieve tactical objectives.[<sup>\\[1\\]</sup>][1]

 [1]: https://attack.mitre.org/docs/ATTACK_Design_and_Philosophy_March_2020.pdf "MITRE ATT&CK: Design and Philosophy"
`,p=`---
title: Mitigation Terms
weight: 3
---

###### ML lifecycle stages

The machine learning lifecycle, adapted from [Crisp-ML(Q)](https://ml-ops.org/content/crisp-ml), consists of the following stages:

| Name | Description  |
|---|---|
| Business and Data Understanding            | Defining the scope and requirements of the project and collecting data |
| Data Preparation     | Data cleaning, data augmentation, and developing a robust data pipeline |
| ML Model Engineering      | Defining quality measures, selecting a model architecture, and training a model |
| ML Model Evaluation    | Increasing model explainability and ensuring that the developed model complies with project needs and satisfies risk and safety constraints |
| Deployment | Setting up production environment and productionizing the validated ML model |
|  Monitoring and Maintenance    | Continually evaluating the deployed model to ensure it continues to fulfill quality assurance measures |

In ATLAS, we tag [mitigations](/mitigations) with phases from the CRISP-ML(Q) lifecycle to help each phase’s teams identify vulnerabilities that could impact their task requirements and possible ways to respond.

###### Mitigation Categories

- **Policy**: Relating to procedures and processes that govern how tools are used, maintained, and deployed
- **Technical - ML**: Relating to ML-specific hardware, software, and technological systems implemented to mitigate adversarial threats
- **Technical - Cyber**: Relating to cyber-specific hardware, software, and technological systems implemented to mitigate adversarial threats.
`,m={class:`text-h5 mt-10 mb-5`},h=[`innerHTML`],g={__name:`GlossaryView`,setup(g){let _=i(`ATLAS Glossary`),v=e(`markdownit`),y=s([]);return Object.values(Object.assign({"/public/content/glossary-files/case-study-terms.md":d,"/public/content/glossary-files/general.md":f,"/public/content/glossary-files/mitigation-terms.md":p})).map(e=>{let t={},n=v.render(e,t),r={frontmatter:t.frontmatter,content:n};y.push(r)}),y.sort((e,t)=>`weight`in e.frontmatter&&`weight`in t.frontmatter?e.frontmatter.weight-t.frontmatter.weight:`title`in e.frontmatter&&`title`in t.frontmatter?e.frontmatter.title.localeCompare(t.frontmatter.title):e-t),(e,i)=>(l(),o(`div`,null,[c(u,{pageTitle:_.value},null,8,[`pageTitle`]),(l(!0),o(a,null,n(y,(e,n)=>(l(),o(`div`,{key:n},[r(`div`,m,t(e.frontmatter.title),1),r(`div`,{innerHTML:e.content},null,8,h)]))),128))]))}};export{g as default};