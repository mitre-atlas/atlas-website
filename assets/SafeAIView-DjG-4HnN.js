import{_ as a}from"./PageSectionTitle.vue_vue_type_script_setup_true_lang-DNL-m-zU.js";import{_ as i,z as o,r,q as c,g as l,b as d,t as m,o as h}from"./index-4qHKuarZ.js";const f=`---
title: "SAFE-AI: A Framework for Securing AI-Enabled Systems"
---

[[toc]]

#### Overview of SAFE-AI
SAFE-AI is a framework that provides guidance on securing AI-enabled systems.

The SAFE-AI framework emphasizes the importance of thoroughly evaluating the risks introduced by AI technologies when they are integrated into system architectures. It advocates for the careful selection of security controls that align with the level of risk posed by these advancements. SAFE-AI aims to strengthen the processes of security control selection and assessment by ensuring that AI-specific threats and concerns are systematically identified and addressed.

SAFE-AI is based on the MITRE Adversarial Threat Landscape for Artificial Intelligence Systems (ATLAS)™ framework and National Institute of Standards and Technology (NIST) standards.

#### SAFE-AI Relationship with ATLAS
MITRE ATLAS is a “globally accessible, living knowledge base of adversary tactics and techniques against AI-enabled systems based on real-world attack observations and realistic demonstrations from AI red teams and security groups”. The ATLAS framework follows from the MITRE ATT&CK framework, and is a compendium of threats, tactics, and mitigations specific to AI-enabled systems.

Not every adversarial action is knowable or controllable, but many can be anticipated, and that is where SAFE-AI elaborates concerns regarding threats to AI and identifies controls that are especially needed to secure AI-enabled systems. One important contribution from ATLAS™ is the taxonomy of tactics and techniques against AI-enabled systems. 

SAFE-AI leverages this taxonomy for identifying AI-specific concerns and determining controls that may be used to mitigate the concern.

#### Why AI-Focused Security Guidance is Necessary
AI is rapidly changing the nature of Information Technology (IT) systems, incorporating advanced techniques for information processing, and, if not effectively managed and controlled, creates new pathways for potential adversarial attacks.

AI contributes to the attack surface through its inherent dependency on data and as well as its learning process. Attacks include adversarial inputs, poisoning, exploiting automated decision-making, exploiting model biases, and exposure of sensitive information.

Another significant concern is the presence of supply chain vulnerabilities and the associated risks stemming from unclear provenance of AI models. AI systems often rely on third-party libraries, frameworks, and pre-trained models, which may contain hidden vulnerabilities or malicious code. The high cost of training new LLM models, for example, means that most organizations will acquire and execute models either from open source or proprietary sources with little or no method of determining the risks associated with executing such a model.

To effectively manage the threat landscape, SAFE-AI recommends controls from the NIST control catalog, Special Publication 800-53, Rev 5 and provides a discussion of residual risk for planning potential mitigations. 

<p style="text-align:center">
  <img src="/content/safe-ai/threat-sample.png"
       alt="SAFE-AI Threat Sample"
       style="max-width:75%; height:auto" />
</p>

<p style="text-align:center">
    Excerpt from AI Threats, Concerns & Residual Risk. For all figures and appendixes, see Downloads below.
</p>

#### SAFE-AI Assessment Guidance
SAFE-AI provides hundreds of Q&A sets that assessors may use to augment the Security Assessment Plan (SAP) for conducting interviews with system owners and other appropriate stakeholders.

When Security Control Assessment (SCA) teams prepare for conducting assessments of applications with AI technology, the assessors should think critically about each control in the context of AI concerns and in view of the system elements: Environment, Platform, AI Models, and AI Data. When applied to a specific System Security Plan (SSP), it should inform the security assessment plan.

The SAFE-AI framework maps each AI control to a set of questions, organized by system elements, that should be raised during security assessment planning to ensure that the risks posed by the associated AI concerns can be addressed and for determining necessary mitigation measures.

<p style="text-align:center">
  <img src="/content/safe-ai/assessment-flow.svg"
       alt="SAFE-AI assessment flow"
       style="max-width:90%; height:auto" />
</p>


<p style="text-align:center">
  The diagram above outlines the elements composing a Theat-Informed Assessment using the SAFE-AI Framework.
</p>

#### Connect with Us
MITRE's Power BI-based tools simplify the development of System Security Plans and optimize the scheduling of assessment activities by leveraging your agency's cybersecurity control baselines with insights from SAFE-AI. Reach out to us to explore innovative solutions and unlock new possibilities.

Contact SAFE-AI via [email](mailto:safe-ai@mitre.org) or Contact ATLAS via
[LinkedIn](https://www.linkedin.com/showcase/mitre-atlas) or 
[GitHub](https://github.com/mitre-atlas).

#### Downloads
- [AI Threats, Concerns & Residual Risk](../pdf-files/SAFEAI_Threats_Concerns_Residual_Risk.pdf)
- [AI Security Controls](../pdf-files/SAFEAI_Security_Controls.pdf)
- [Security Assessment Interview Questionnaire](../pdf-files/SAFEAI_Assessment_Interview_Questions.pdf)

##### [**Read the Full Report**](../pdf-files/SAFEAI_Full_Report.pdf)
`,p=["innerHTML"],u={__name:"SafeAIView",setup(A){const t=o("markdownit"),e={},n=t.render(f,e),s=r(e.frontmatter.title);return(g,y)=>(h(),c("div",null,[l(a,{pageTitle:s.value},null,8,["pageTitle"]),d("div",{innerHTML:m(n),class:"mx-10"},null,8,p)]))}},S=i(u,[["__scopeId","data-v-042cb867"]]);export{S as default};
