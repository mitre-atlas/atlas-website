import{_ as i}from"./PageSectionTitle.vue_vue_type_script_setup_true_lang-CMwUPSeH.js";import{_ as o,z as s,r,q as c,g as l,b as d,t as f,o as u}from"./index-Dsx3H1jc.js";const h=`---
title: AI Security 101
---

[[toc]]

#### What is AI Security?

Artificial intelligence (AI) technology is advancing at a rapid rate and adoption is on the rise. Once limited only to highly controlled operational environments and use cases, today we see _AI-enabled systems_ &mdash; software systems with one or more AI components &mdash; effectively integrated into a variety of use cases and available to the public.

_AI security_ can be defined as the tools, strategies, and processes implemented that identify and prevent threats and attacks that could compromise the confidentiality, integrity, or availability of an AI model or AI-enabled system. AI security is a critical component of the AI development cycle to ensure safe and consistent performance throughout operation. In additional to the existence of traditional cybersecurity vulnerabilities, incorporating AI into systems also introduces new threat vectors and vulnerabilities that require a new set of security procedures. Identifying and mitigating these AI-enabled system vulnerabilities is an integral part of AI security and requires a technical and operational response.

In this 101, we describe common threats to AI-enabled systems documented within MITRE ATLAS&trade;, security and the AI lifecycle, and active research areas.

#### What are attacks on AI?

Incorporating AI into a larger system can make the system susceptible to novel attacks that specifically target the AI. The techniques that adversaries use to carry out these attacks are distinct from traditional cyber techniques. By improving their understanding of these adversarial techniques, teams can work to mitigate the risks associated with AI incorporation.

To better understand threats the wide range of effective attacks that can be used against to an AI-enabled system, we describe three important concepts that dictate an adversary’s path of attack: AI Access Time, AI Access Points, and System Knowledge.

_AI Access Time_ can be broken into two stages, _training_ and _inference_. The training stage is a process that includes collecting and processing data, training a model, and validating the model’s performance. The end of the training stage and beginning of the inference stage occurs once a model is deployed. During the inference stage, users submit queries, and the model responds with predictions, classifications, or generative content known as the outputs (or inferences).

_AI Access Points_ can either be _digital_ or _physical_. A common digital access point within an AI-enabled system is API (application programing interface) access, where an adversary can interact with the model by sending a query and observing the response. A physical access point is used when an adversary interacts with data in the real world and influences the model’s behavior by physically modifying the data collected.

_System Knowledge_ refers to the amount of information an adversary knows about the ML components of the system. This knowledge can range from white-box, where adversaries have access to the model architecture, model weights and training data, to black-box where access and knowledge is limited to input and output responses during the inference stage (e.g. API access).

The figure below depicts an example of an AI-enabled system containing a trained AI model and the different types of access time, access points and system knowledge an adversary could leverage.

<p>
<figure>
    <div class="v-responsive v-img" style="height: 400px;">
      <img src="/content/aisec101/ai-enabled-system.png" alt="AI-enabled system" class="v-img__img v-img__img--contain" />
    </div>
    <figcaption class="text-caption text-center mb-4">
    Figure 1: An AI-enabled system and key concepts.
    </figcaption>
</figure>
</p>

The table below provides high-level descriptions of adversarial attacks and their possible effects on AI-enabled systems.
For a comprehensive list we recommend exploring the [ATLAS matrix](/matrices/ATLAS).

| Attack                   | Overview                                                                                                                                                                                                                                                                                                                                    |
| :----------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Poisoning Attack         | Attacker modifies the training data of an AI system to get a desired outcome at inference time. With influence over training data, an attacker can create backdoors in the model where an input with the specified trigger will result in a particular output.                                                                              |
| Evasion Attack           | Attacker elicits an incorrect response from a model by crafting adversarial inputs. Typically, these inputs are designed to be indistinguishable from normal data. These attacks can be targeted, where the attacker tries to produce a specific classification, or untargeted, where they attempt to produce any incorrect classification. |
| Functional Extraction    | Attacker recovers a functionally equivalent model by iteratively querying the model. This allows an attacker to examine the offline copy of the model before further attacking the online model.                                                                                                                                            |
| Inversion Attack         | Attacker recovers sensitive information about the training data. This can include full reconstructions of the data, or attributes or properties of the data. This can be a successful attack on its own or can be used to perform other attacks such as Model Evasion.                                                                      |
| Prompt Injection Attack  | Attacker crafts malicious prompts as inputs to a large language model (LLM) that cause the LLM to act in unintended ways. These "prompt injections" are often designed to cause the model to ignore aspects of its original instructions and follow the adversary's instructions instead.                                                   |
| Traditional Cyber Attack | Attacker uses well-established Tactics, Techniques, and Procedures (TTPs) from the cyber domain to attain their goal. These attacks may target model artifacts, API keys, data servers, or other foundational aspects of AI compute infrastructure distinct from the model itself.                                                          |

#### How does security fit into AI model lifecycles?

An important consideration to countering attacks on AI-enabled systems is establishing clear operational procedures for managing a model throughout its lifecycle. Developing and deploying a robust AI model involves multiple phases of effort that typically involve different teams, developers, and stakeholders. Just as with the Software Development and Operations (DevOps) methodology, the field of Machine Learning Operations (MLOps) defines best practices and tools for deploying reliable, reproducible, and adaptable models. A good example of a model development pipeline with a MLOps focus is [CRISP-ML(Q)](https://ml-ops.org/content/crisp-ml), the Cross-Industry Standard Process for the development of Machine Learning applications with Quality assurance.

CRISP-ML(Q) defines six phases in the model lifecycle:

1. _Business and Data Understanding_
2. _Data Engineering (Data Preparation)_
3. _Machine Learning Model Engineering_
4. _Quality Assurance for Machine Learning Applications_
5. _Deployment_
6. _Monitoring and Maintenance_

<figure>
    <div class="v-responsive v-img" style="height: 400px;">
      <img src="/content/aisec101/crisp-ml-process.jpg" alt="CRISP-ML(Q) Machine Learning Development Life Cycle Process Diagram" class="v-img__img v-img__img--contain" />
    </div>
    <figcaption class="text-caption text-center mb-4">
    Figure 2: "<a href="https://ml-ops.org/content/crisp-ml">The Machine Learning Development Life Cycle Process</a>" by <a href="https://github.com/visenger">visenger</a>. <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>.
    </figcaption>
</figure>

Each phase begins with defining the requirements and constraints of the task, then cycles through a process of risk identification, risk evaluation, and risk mitigation until requirements are met. Teams often revisit earlier phases and loop through the pipeline multiple times as stakeholders define new requirements and constraints.

It is expected that during the _Monitoring and Maintenance_ phase that the process will return to earlier development phases in response to changing real-world conditions, such as concept drift, data drift, or malicious actions.

In ATLAS, we tag [mitigations](/mitigations) with phases from the CRISP-ML(Q) lifecycle to help each phase’s teams identify vulnerabilities that could impact their task requirements and possible ways to respond. We also encourage interested parties to read [the original paper on CRISP-ML(Q)](https://arxiv.org/pdf/2003.05155.pdf)

#### AI Security Topics

AI Security is a constantly evolving field with subfields emerging as the technologies mature. We describe developments in three notable sub-fields below:

##### LLM Security

Large Language Models (LLMs) are a particular category of natural language models trained on hundreds of billions of words that can generate text or images and videos in response to natural language prompts. They vaulted to public popularity with the release of OpenAI’s ChatGPT in November of 2022 due to their ability to perform multiple complex tasks such as content generation, style transfer, and text summarization, all with a single model.

From a security perspective, these systems introduce unique challenges to an AI pipeline due to the massive size of the training dataset, opaque internal architecture of the model, and use of natural language for input prompting. For example, [indirect prompt injection attacks](/techniques/AML.T0051.001) can be used to [extract a user’s personally identifiable information (PII)](/studies/AML.CS0021) or [influence the user to visit malicious websites](/studies/AML.CS0020). For sample adversarial techniques, see [LLM Prompt Injection](/techniques/AML.T0051), [Compromise LLM Plugins](/techniques/AML.T0053), and [LLM Jailbreak](/techniques/AML.T0054).

We [updated ATLAS in Fall 2023](https://www.mitre.org/news-insights/news-release/mitre-and-microsoft-collaborate-address-generative-ai-security-risks) to incorporate a new LLM focus that includes real-world case studies of adversarial attacks. In addition to this ATLAS work, we recommend [this external list](https://llmsecurity.net/) of LLM security related papers, articles, and tools for those interested in learning more.

##### Hardware Security

Hardware security has been studied extensively in classical cybersecurity settings and is now being examined in relation to AI systems. Example hardware security attacks include:

1. Side channel attacks &mdash; information about the system is deduced from alternative information streams such as voltage measurements or response timing,
2. Fault injection attacks &mdash; systems are actively disrupted by faulty input data or physical environment disruptions, and
3. Hardware Trojan attacks &mdash; malicious backdoors are inserted into the hardware of the systems including GPUs and other platform circuitry.

We refer interested readers to the following survey papers on this topic:

- [Zhou et al. (2021): Deep Neural Network Security From a Hardware Perspective](https://ieeexplore.ieee.org/abstract/document/9642246)
- [Xu et al. (2021): Security of Neural Networks from Hardware Perspective: A Survey and Beyond.](https://ieeexplore.ieee.org/document/9371637)

##### Autonomous Systems

Our MITRE ATLAS team is conducting ongoing research on this intersection of AI security and autonomous systems and options for integrating the unique security considerations for AI-enabled autonomous systems into our existing matrix. As that continues, we wanted to write this article to introduce our initial high-level approach to the security landscape for AI-enabled autonomous systems that starts with a clearer breakdown of the typical stack for an autonomous system. Considering each component of the autonomy stack allows for better identification and understanding of the unique AI integrations and thus vulnerabilities. On the [AI Security for Autonomous Systems page](/resources/ai-security-autonomous-systems) you’ll find more information discussing our breakdown of the different components of the autonomy stack to highlight areas that can be enabled with AI.

##### Malicious Use of AI - Cyber Domain

We have observed a growing area of concern with respect to applying and leveraging AI technology, in particular generative models such as ChatGPT, towards the attack chain development against cyber systems. This domain, which we have coined “Malicious Use of AI for Cybersecurity”, does not directly align with the current scope or TTP structure of MITRE ATLAS or MITRE ATT&CK.

Our ATLAS team is currently researching this malicious use of AI to uniquely enable cybersecurity attacks with the goal of illuminating cyber-centric insights into these threats. We are examining existing use cases and attack techniques where adversaries are leveraging AI to enhance or develop attack chains against specific operations and sectors such as critical infrastructure, focusing on real-world impacts and outcomes.

For example, the integration of AI into cyber environments may offer asymmetric advantages for certain cyber operations against US supply chains or critical infrastructure. An outline of our current research is referenced in the table below. Future efforts are also intended to identify relevant intersections with the ATLAS and/or ATT&CK matrices, mapping out connections and developing new potential ATLAS products to ensure alignment with existing frameworks while addressing emerging AI-enhanced threats.

<table style="width:60%; margin:0 auto; border:0; border-collapse: separate; border-spacing: 3px 12px;">
  <caption class="text-caption text-center mb-4" style="caption-side: bottom;">
    Figure: An outline of our current investigation scope, which is focused on capturing the effects and outcomes of malicious applications of AI towards various cyber operations and sectors. This scope is a work in progress.
  </caption>

  <tr>
    <th colspan=100% style="border:0; font-size:24px; font-weight:bold;">Effects & Outcomes</th>
  </tr>
  <tr>
    <th rowspan=4 style="background-color:#ffffff; border:0; min-width:50px; writing-mode:vertical-rl; font-size:24px; font-weight:bold;">Operations</th>
  </tr>
  <tr>
    <td style="background-color:#0d2f4f; color:#ffffff; text-align:center; font-size: 18px; font-weight:bold;">Asymmetric Advantage</td>
    <td style="background-color:#005b94; color:#ffffff">Lowered barrier of entry for attacks.</td>
    <td style="background-color:#005b94; color:#ffffff;">Accelerated evolution of attacks.</td>
    <td style="background-color:#005b94; color:#ffffff;">Increased attack complexity.</td>
    <td style="background-color:#005b94; color:#ffffff;"></td>
  </tr>
  <tr>
    <td style="background-color:#0D2F4F; color:#ffffff; text-align:center; font-size: 18px; font-weight:bold;">New attack Vectors</td>
    <td style="background-color:#005b94; color:#ffffff;">AI-powered reconnaissance and vulnerability scanning.</td>
    <td style="background-color:#005b94; color:#ffffff;">Instantaneous evasion and adaptation.</td>
    <td style="background-color:#005b94; color:#ffffff;">Automated and AI-aided development.</td>
    <td style="background-color:#005b94; color:#ffffff;">Personalized phishing and social engineering.</td>
  </tr>
  <tr>
    <td style="background-color:#0D2F4F; color:#ffffff; text-align:center; font-size: 18px; font-weight:bold;">Enhanced Threat Targeting</td>
    <td style="background-color:#005b94; color:#ffffff;">AI-powered reconnaissance and vulnerability scanning.</td>
    <td style="background-color:#005b94; color:#ffffff;">Identification of evolving attack tactics.</td>
    <td style="background-color:#005b94; color:#ffffff;">Accelerated vulnerability discovery.</td>
    <td style="background-color:#005b94; color:#ffffff;"></td>
  </tr>

  <tr>
    <th rowspan=4 style="background-color:#ffffff; border:0; min-width:50px; writing-mode:vertical-rl; font-size:24px; font-weight:bold;">Sectors</th>
  </tr>
  <tr>
    <td style="background-color:#0D2F4F; color:#ffffff; text-align:center; font-size: 18px; font-weight:bold;">Supply Chain</td>
    <td style="background-color:#005b94; color:#ffffff;">Targeted supply chain compromise.</td>
    <td style="background-color:#005b94; color:#ffffff;">Supply chain attack persistence.</td>
    <td style="background-color:#005b94; color:#ffffff;">Predictive attack planning.</td>
    <td style="background-color:#005b94; color:#ffffff;">Automated system sabotage.</td>
  </tr>
  <tr>
    <td style="background-color:#0D2F4F; color:#ffffff; text-align:center; font-size: 18px; font-weight:bold;">Critical Infrastructure</td>
    <td style="background-color:#005b94; color:#ffffff;">Disruption of critical infrastructure operations.</td>
    <td style="background-color:#005b94; color:#ffffff;">Countermeasure deception.</td>
    <td style="background-color:#005b94; color:#ffffff;">Rapid identification of interdependencies.</td>
    <td style="background-color:#005b94; color:#ffffff;"></td>
  </tr>
</table>

References: 

- [Mapping Misuse of Generative AI](https://deepmind.google/discover/blog/mapping-the-misuse-of-generative-ai/) – Google Deepmind
- [Evaluating Malicious Generative AI Capabilities](https://cetas.turing.ac.uk/publications/evaluating-malicious-generative-ai-capabilities) – Alan Turing Institute

##### Policy

As the significance of vulnerabilities in AI-enabled systems becomes more widely known, policy makers and political leaders have been exploring the best way to balance interests of privacy and innovation. In the United States, several federal agencies have enacted guidance on AI (e.g., [GSA AI Guide for Government](https://coe.gsa.gov/coe/ai-guide-for-government/print-all/index.html), [DoD Responsible AI Strategy](https://www.defense.gov/News/Releases/Release/Article/3588743/cdao-releases-responsible-ai-rai-toolkit-for-ensuring-alignment-with-rai-best-p/)), but legislation over academic and private sector bodies remains a complex issue with technological, economic, and ethical considerations. The most effective way to balance these factors is an open research question.

We list a few leading relevant publications on this topic below:

- [AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework), NIST
- [Guidelines for Secure AI System Development](https://www.ncsc.gov.uk/files/Guidelines-for-secure-AI-system-development.pdf), UK National Cyber Security Centre
- [A Unified Framework of Five Principles for AI in Society](https://hdsr.mitpress.mit.edu/pub/l0jsh9d1/release/8), Harvard Data Science Review
- [A Taxonomy of Trustworthiness for Artificial Intelligence, UC Berkeley Center for Long-Term Cybersecurity](https://cltc.berkeley.edu/publication/a-taxonomy-of-trustworthiness-for-artificial-intelligence/)
- [Ethics and Governance of Artificial Intelligence for Health](https://www.who.int/publications/i/item/9789240029200), World Health Organization
- [A Sensible Regulatory Framework for AI Security](https://www.mitre.org/news-insights/publication/sensible-regulatory-framework-ai-security), MITRE
- [Strengthening and Democratizing the US Artificial Intelligence Innovation Ecosystem: An Implementation Plan for a National Artificial Intelligence Research Resource](https://resourcecenter.cis.ieee.org/government/usa/cisgovph0020), National Artificial Intelligence Research Resource Task Force
- [Artificial Intelligence Bill of Rights](https://hai.stanford.edu/white-paper-stanford-hai-artificial-intelligence-bill-rights), Stanford University Human-Centered Artificial Intelligence
- [S.3572 Algorithmic Accountability Act of 2022](https://www.congress.gov/bill/117th-congress/senate-bill/3572), 117th United States Congress
- [EU Artificial Intelligence Act](https://www.europarl.europa.eu/news/en/headlines/society/20230601STO93804/eu-ai-act-first-regulation-on-artificial-intelligence), European Parliament

#### Other recommended reading

- Our [Tactics](/tactics) and [Techniques](/techniques) pages list the methodologies adversaries use to infiltrate and/or compromise vulnerable AI systems. Our [Matrix](/matrices/ATLAS) organizes these potential vulnerabilities graphically and chronologically for easier visual understanding, and our [Mitigations](/mitigations) page contains information how to protect your systems against them.
- For examples of what these system attacks look like “in the wild”, check out our growing list of [Case Studies](/studies). We also have a publicly available [database of vulnerabilities found in common models](https://airisk.io).
- Have suggestions on how we can make ATLAS more relevant to you and your organization? [Contact us via Slack, LinkedIn, Email, or Github](/resources/contact). We also welcome case study contributions through our interactive [Case Study Builder tool](/studies/create).
`,g=["innerHTML"],p={__name:"AiSecurity101View",setup(m){const t=s("markdownit"),e={},n=t.render(h,e),a=r(e.frontmatter.title);return(y,b)=>(u(),c("div",null,[l(i,{pageTitle:a.value},null,8,["pageTitle"]),d("div",{innerHTML:f(n),class:"mx-10"},null,8,g)]))}},A=o(p,[["__scopeId","data-v-a7f6894c"]]);export{A as default};
