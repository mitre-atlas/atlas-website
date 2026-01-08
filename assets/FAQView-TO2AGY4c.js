import{_ as d}from"./PageSectionTitle.vue_vue_type_script_setup_true_lang-DLXDyqHL.js";import{r as h,C as u,y as m,m as s,g as p,F as g,q as f,o as r,b as o,t as y}from"./index-B2M0gmiM.js";const v=`---
title: Case Study Terminology
weight: 2
---

###### What is an incident date?

The time frame as to when the incident or exercise discussed in the case study occurred.

###### What is an actor?

The group that performed this operation. This could be a threat group or bad actor responsible for the incident, the researchers, AI red team, or security group that performed the demonstration.

###### What is a reporter?

The group that identified and reported this incident or exercise. In the case of an exercise, this may be the Actor.

###### What is a target?

The victim system or organization targeted by the Actor.

###### What is a case study type?

Whether this case study describes a real-world incident or exercise under a realistic threat model and representative Target system.
`,T=`---
title: Staying Informed
weight: 10
---

###### How do I stay up to date with what's happening with ATLAS?

Keep up to date using the resources in our [contact page](/resources/contact).`,_=`---
title: General
weight: 1
---

###### What is a tactic?

Tactics are tactical adversary goals during an attack. They represent the “why” of a technique: the reason for performing an action.
Tactics serve as useful contextual categories for individual techniques and cover standard notations for things adversaries do during an operation.
[<sup>\\[1\\]</sup>][1] MITRE ATLAS<sup>&trade;</sup> tactics represent new adversary goals particular to artificial intelligence systems, as well as tactics adapted from the MITRE ATT&CK<sup>&reg;</sup> Enterprise Matrix.
In those cases, ATT&CK tactic definitions are stretched to include ML concepts.

###### What is a technique?

Techniques describe the means by which adversaries achieve tactical goals. They represent "how" an adversary achieves a tactical objective by performing an action.
For example, an adversary may gain initial access by compromising the machine learning (ML) supply chain. Techniques may also represent “what” an adversary gains by performing an action. This is a useful distinction for the ML Attack Staging tactic,
where the adversary is typically creating or modifying an ML artifact that will be used in a subsequent tactical objective.
There can be multiple techniques in each tactic category as there are many ways to achieve tactical objectives.[<sup>\\[1\\]</sup>][1]

###### What is the ATLAS Navigator?

The MITRE ATLAS™ version of the ATT&CK Navigator displays ATLAS techniques and allows users to create and view complex visualizations. In addition to the matrix, the Navigator also shows a frequency heat map of techniques used in ATLAS case studies.


 [1]: https://attack.mitre.org/docs/ATTACK_Design_and_Philosophy_March_2020.pdf "MITRE ATT&CK: Design and Philosophy"
`,w=`---
title: Mitigation Terminology
weight: 3
---

###### What are the ML lifecycle stages?

The machine learning lifecycle, adapted from [Crisp-ML(Q)](https://ml-ops.org/content/crisp-ml), consists of the following stages:

| Name | Description  |
|---|---|
| Business and Data Understanding            | Defining the scope and requirements of the project and collecting data |
| Data Preparation     | Data cleaning, data augmentation, and developing a robust data pipeline |
| ML Model Engineering      | Defining quality measures, selecting a model architecture, and training a model |
| ML Model Evaluation    | Increasing model explainability and ensuring that the developed model complies with project needs and satisfies risk and safety constraints |
| Deployment | Setting up production environment and productionizing the validated ML model |
|  Monitoring and Maintenance    | Continually evaluating the deployed model to ensure it continues to fulfill quality assurance measures |
`,b={class:"text-h5 mt-10 mb-5"},A=["innerHTML"],S={__name:"FAQView",setup(M){const c=h("FAQ"),l=m("markdownit"),a=u([]);return Object.values(Object.assign({"/public/content/faq-files/case-study-terms.md":v,"/public/content/faq-files/contact.md":T,"/public/content/faq-files/general.md":_,"/public/content/faq-files/mitigation-terms.md":w})).map(t=>{const e={},n=l.render(t,e),i={frontmatter:e.frontmatter,content:n};a.push(i)}),a.sort((t,e)=>"weight"in t.frontmatter&&"weight"in e.frontmatter?t.frontmatter.weight-e.frontmatter.weight:"title"in t.frontmatter&&"title"in e.frontmatter?t.frontmatter.title.localeCompare(e.frontmatter.title):t-e),(t,e)=>(r(),s("div",null,[p(d,{pageTitle:c.value},null,8,["pageTitle"]),(r(!0),s(g,null,f(a,(n,i)=>(r(),s("div",{key:i},[o("div",b,y(n.frontmatter.title),1),o("div",{innerHTML:n.content},null,8,A)]))),128))]))}};export{S as default};
