---
title: AI Security 101
---

[[toc]]

#### AI Security

Artificial intelligence (AI) technology is advancing at a rapid rate and adoption is on the rise. Once limited only to highly controlled operational environments and use cases, today we see _AI-enabled systems_ &mdash; software systems with one or more AI components &mdash; effectively integrated into a variety of use cases and available to the public.

_AI security_ can be defined as the tools, strategies, and processes implemented that identify and prevent threats and attacks that could compromise the confidentiality, integrity, or availability of an AI model or AI-enabled system. AI security is a critical component of the AI development cycle to ensure safe and consistent performance throughout operation. In additional to the existence of traditional cybersecurity vulnerabilities, incorporating AI into systems also introduces new threat vectors and vulnerabilities that require a new set of security procedures. Identifying and mitigating these AI-enabled system vulnerabilities is an integral part of AI security and requires a technical and operational response.

In this 101, we describe common threats to AI-enabled systems documented within MITRE ATLAS&trade;, security and the AI lifecycle, and active research areas.

#### Attacks on AI-enabled Systems

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

#### AI Security Policy

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

#### Recommended Reading

- Our [Tactics](/tactics) and [Techniques](/techniques) pages list the methodologies adversaries use to infiltrate and/or compromise vulnerable AI systems. Our [Matrix](/matrices/ATLAS) organizes these potential vulnerabilities graphically and chronologically for easier visual understanding, and our [Mitigations](/mitigations) page contains information how to protect your systems against them.
- For examples of what these system attacks look like “in the wild”, check out our growing list of [Case Studies](/studies).
- Have suggestions on how we can make ATLAS more relevant to you and your organization? [Contact us via Slack, LinkedIn, Email, or Github](/resources/contact). We also welcome case study contributions through our interactive [Case Study Builder tool](/studies/create).
- The [AI Security for Autonomous Systems](/resources/ai-security-autonomous-systems) page contains a high-level approach to the security landscape for AI-enabled autonomous systems that starts with a clearer breakdown of the typical stack for an autonomous system.
- The [SAFE-AI](/resources/safe-ai) page describes a framework that provides guidance on securing AI-enabled systems.
