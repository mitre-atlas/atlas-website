import{_ as N}from"./PageSectionTitle.vue_vue_type_script_setup_true_lang-McPhvpzo.js";import{e as T,D as H,q as p,o as d,b,g as a,w as c,F as U,s as W,c as v,E as z,v as B,G as F,n as K,t as m,z as $,ae as J,af as e,ag as X,r as Y,h as Q,i as f,ah as Z}from"./index-DP1IgBSD.js";const L=`#### June 2021

##### Website v2.0.0 - 2.1.3

Official launch of https://atlas.mitre.org, allowing users to browse the ATLAS matrix and initial set of case studies.

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/3FN9v-y-C-w" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>


##### Data v2.0.0

This version of ATLAS data contains 16 tactics, 30 techniques, 27 sub-techniques, and 13 case studies.  14 of the tactics and several techniques used in case studies were imported from MITRE ATT&CK&reg; Enterprise v9.
`,ee=Object.freeze(Object.defineProperty({__proto__:null,default:L},Symbol.toStringTag,{value:"Module"})),M=`#### July 2021


##### Website v2.2.0 - 2.2.2

ATLAS Navigator layers are available for case studies, highlighting techniques used in each procedure.  See the "ATLAS Navigator layer" button on the case study pages for to view and download the layer files.

##### Data v2.0.1

This version of ATLAS data contains 16 tactics, 30 techniques, 27 sub-techniques, and 13 case studies.  14 of the tactics and several techniques used in case studies were imported from MITRE ATT&CK&reg; Enterprise v9.
`,te=Object.freeze(Object.defineProperty({__proto__:null,default:M},Symbol.toStringTag,{value:"Module"})),y=`#### October 2021


##### Website v2.3.0 - 2.3.2

Technique pages display examples of how techniques have been used in case studies, drawn from procedure steps.


##### Data v2.2.0

This version of ATLAS data contains 16 tactics, 30 techniques, 27 sub-techniques, and 15 case studies.  14 of the tactics and several techniques used in case studies were imported from MITRE ATT&CK&reg; Enterprise v9.

New case studies:
- [Backdoor Attack on Deep Learning Models in Mobile Apps](https://atlas.mitre.org/studies/AML.CS0013)
- [Confusing Antimalware Neural Networks](https://atlas.mitre.org/studies/AML.CS0014)
`,ne=Object.freeze(Object.defineProperty({__proto__:null,default:y},Symbol.toStringTag,{value:"Module"})),S=`#### March 2022


##### Website v3.0.0

This website update adds new functionality in the form of the Case Study Builder. The builder can be used to craft submission files for new case studies with details and technique mappings.

The [Case Study Builder](https://atlas.mitre.org/studies/create) can be found in the “Build Case Study” subsection located under the “Case Study” tab in the navigation menu.

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/Np_ip14YJGg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>


###### How to Use the Case Study Builder:

1.	Fill out the form.
2.	Download the generated case study .yaml file (and PowerPoint .pptx version if selected).
3.	Email the case study file to atlas@mitre.org

To view or edit an existing case study, click the "Load Case Study" button and upload the .yaml file. Make any necessary adjustments, then re-download the file. The ATLAS team will review the submission and follow up with feedback.


###### Case Study Considerations:

1.	The attack exploits one or more vulnerabilities that compromise the confidentiality, integrity, or availability of an AI system.
2.	The attack is against a production/commercial AI system. This can be on MLaaS or AI systems embedded in clients/at the edge.
3.	Ensure you have permission to share this information and/or publish this research. Please follow the proper channels before reporting a new attack and make sure you are practicing responsible disclosure.

We are especially excited for new case-studies! We look forward to contributions from both industry and academic researchers.


##### Data v3.0.0

This version of ATLAS data contains 12 tactics, 36 techniques, 27 sub-techniques, and 15 case studies.

Prior usage of MITRE ATT&CK&reg; Enterprise tactics and techniques have been adapted into the ATLAS framework, with ATLAS IDs and updated machine learning-specific descriptions.
`,ie=Object.freeze(Object.defineProperty({__proto__:null,default:S},Symbol.toStringTag,{value:"Module"})),q=`#### July 2022


##### Website v3.1.0

This website update adds new functionality to support display of multiple matrices and custom object types, as well as string properties in data objects.

Usability improvements include wider availability of navigation breadcrumbs, matrix item hierarchies in side navigation bars, and data object hover previews, as well as better support for small screens.  Additional updates for case study builder validation, upcoming events, and various fixes.


##### Data v3.1.0 - 4.0.0

This version of ATLAS data contains 1 matrix, 12 tactics, 36 techniques, 27 sub-techniques, and 15 case studies.

New features include support for custom data object types and IDs, as well as multiple matrices.

There is a new top level key in the output YAML for \`matrices\`, and the updated format is as follows:
  \`\`\`yaml
  id: ATLAS
  name: Adversarial Threat Landscape for AI Systems
  version: Version number for this data release

  matrices: List of matrix data
  - id: ATLAS
    name: ATLAS Machine Learning Threat Matrix
    tactics: List of tactics objects
    techniques: List of technique and subtechnique objects

  case-studies: List of case study objects
  \`\`\`


##### Navigator Data v1.1.0

Supports output of multiple matrices and collections for ATT&CK Workbench compatibility.
`,se=Object.freeze(Object.defineProperty({__proto__:null,default:q},Symbol.toStringTag,{value:"Module"})),w=`#### October 2022


##### Website v3.2.0

This website update refreshes existing case studies and shows updated tactic and technique descriptions.

New fields have been added to case studies: case study type, reporter, target, and actor.  See the new [FAQ](/resources/faq) for definitions. Additional updates were also added for case study builder validation and various bug fixes.


##### Data v4.1.0

This version of ATLAS data contains 1 matrix, 12 tactics, 37 techniques, 27 sub-techniques, and 15 case studies.

New technique: [System Misuse for External Effect](/techniques/AML.T0048)

Updated descriptions and content for tactics, techniques, and case studies.

The case study YAML format has been updated to support the new case study version, with the added fields: case study type, reporter, target, and actor. The update format is as follows:

  \`\`\`yaml
  study:
    name: Name
    summary: Summary
    incident-date: 2017-08-01
    incident-date-granularity: DATE
    procedure:
      - tactic: AML.TA0005
        technique: AML.T0011
        description: Description
    reporter: Reporter
    actor: Actor
    target: Target
    case-study-type: incident
    references: []
  \`\`\`
  *Note that the reporter field is only required if the case study type is "incident", otherwise it can be omitted*


##### Navigator Data v1.2.0

Updated ATLAS STIX and Navigator layer files for the added technique and refreshed case studies in ATLAS Data v4.1.0.
`,ae=Object.freeze(Object.defineProperty({__proto__:null,default:w},Symbol.toStringTag,{value:"Module"})),P=`#### January 2023


##### Website v3.3.0

This website update indicates when ATLAS tactics and techniques have been adapted from ATT&CK, displaying a red \`&\` in the matrix and list views and linking to the ATT&CK website on individual tactic and technique pages.  Additional updates for [upcoming events](/resources/contact) and various bug fixes.


##### Data v4.2.0

This version of ATLAS data contains 1 matrix, 12 tactics, 38 techniques, 27 sub-techniques, and 16 case studies.

- New technique: [Data from Local System](/techniques/AML.T0037)
- New case study: [Compromised PyTorch Dependency Chain](/studies/AML.CS0015)


##### Navigator Data v1.3.0

The ATLAS STIX now also includes ATT&CK Enterprise v12 for comparison purposes. Any ATLAS techniques adapted from ATT&CK are additionally denoted with "(ATLAS)" to distinguish the names.

Updated ATLAS STIX and Navigator layer files for the added technique and new case study in ATLAS Data v4.2.0.
`,oe=Object.freeze(Object.defineProperty({__proto__:null,default:P},Symbol.toStringTag,{value:"Module"})),I=`#### February 2023


##### Website v3.4.0

This website update displays the new case study and additional techniques.


##### Data v4.3.0

This version of ATLAS data contains 1 matrix, 12 tactics, 40 techniques, 27 sub-techniques, and 17 case studies.

- New techniques
  + [Exploit Public-Facing Application](/techniques/AML.T0049)
  + [Command and Scripting Interpreter](/techniques/AML.T0050)
- New case study: [Achieving Code Execution in MathGPT via Prompt Injection](/studies/AML.CS0016)


##### Navigator Data v1.4.0

Updated ATLAS STIX and Navigator layer files for the added techniques and new case study in ATLAS Data v4.3.0.
`,re=Object.freeze(Object.defineProperty({__proto__:null,default:I},Symbol.toStringTag,{value:"Module"})),C=`#### April 2023


##### Website v3.5.0

This website update includes initial mitigations.


##### Data v4.4.0

This version of ATLAS data contains 1 matrix, 12 tactics, 40 techniques, 27 sub-techniques, 19 mitigations, and 17 case studies.
`,ce=Object.freeze(Object.defineProperty({__proto__:null,default:C},Symbol.toStringTag,{value:"Module"})),D=`#### October 2023

New large language model (LLM) content and updated mitigations.


##### Website v3.6.0

This website update includes updated mitigations and new tactics, techniques, and case studies inspired by large language models (LLMs).


##### Data v4.5.0

This version of ATLAS data contains 1 matrix, 14 tactics, 46 techniques, 36 sub-techniques, 19 mitigations, and 22 case studies.

###### Tactics and techniques
- Added new tactics
  + [Privilege Escalation](https://atlas.mitre.org/tactics/AML.TA0012)
  + [Credential Access](https://atlas.mitre.org/tactics/AML.TA0013)

- Added new techniques
  + [Develop Capabilities](https://atlas.mitre.org/techniques/AML.T0017)
  + [Develop Capabilities: Adversarial ML Attacks](https://atlas.mitre.org/techniques/AML.T0017.000)
    - Previously known as "Develop Adversarial ML Attack Capabilities"
  + [LLM Prompt Injection](https://atlas.mitre.org/techniques/AML.T0051)
  + [LLM Prompt Injection: Direct](https://atlas.mitre.org/techniques/AML.T0051.000)
  + [LLM Prompt Injection: Indirect](https://atlas.mitre.org/techniques/AML.T0051.001)
  + [Phishing](https://atlas.mitre.org/techniques/AML.T0052)
  + [Phishing: Spearphishing via Social Engineering LLM](https://atlas.mitre.org/techniques/AML.T0052.000)
  + [Compromise LLM Plugins](https://atlas.mitre.org/techniques/AML.T0053)
  + [LLM Jailbreak](https://atlas.mitre.org/techniques/AML.T0054)
  + [Unsecured Credentials](https://atlas.mitre.org/techniques/AML.T0055)
  + [LLM Meta Prompt Extraction](https://atlas.mitre.org/techniques/AML.T0056)
  + [LLM Data Leakage](https://atlas.mitre.org/techniques/AML.T0057)
  + [External Harms](https://atlas.mitre.org/techniques/AML.T0048)
     - Previously this technique ID was known as "System Misuse for External Effect"
  + [External Harms: Financial Harm](https://atlas.mitre.org/techniques/AML.T0048.000)
  + [External Harms: Reputational Harm](https://atlas.mitre.org/techniques/AML.T0048.001)
  + [External Harms: Societal Harm](https://atlas.mitre.org/techniques/AML.T0048.002)
  + [External Harms: User Harm](https://atlas.mitre.org/techniques/AML.T0048.003)
  + [External Harms: ML Intellectual Property Theft](https://atlas.mitre.org/techniques/AML.T0048.004)
     - Previously was a top-level technique "ML Intellectual Property Theft", note the ID change

###### Case studies
- Added new case studies
  + [Bypassing ID.me Identity Verification](https://atlas.mitre.org/studies/AML.CS0017)
  + [Arbitrary Code Execution with Google Colab](https://atlas.mitre.org/studies/AML.CS0018)
  + [PoisonGPT](https://atlas.mitre.org/studies/AML.CS0019)
  + [Indirect Prompt Injection Threats: Bing Chat Data Pirate](https://atlas.mitre.org/studies/AML.CS0020)
  + [ChatGPT Plugin Privacy Leak](https://atlas.mitre.org/studies/AML.CS0021)

- Refreshed existing case studies with LLM techniques
  + [Achieving Code Execution in MathGPT via Prompt Injection](https://atlas.mitre.org/studies/AML.CS0016)

###### Mitigations
Added machine learning lifecycle stages and new categories to mitigations`,de=Object.freeze(Object.defineProperty({__proto__:null,default:D},Symbol.toStringTag,{value:"Module"})),E=`#### January 2024


##### Website v3.6.1

This website update includes a [new ATLAS fact sheet](https:/atlas.mitre.org/pdf-files/MITRE_ATLAS_Fact_Sheet.pdf), an updated events list and LinkedIn page, as well as mitigations updates below and updated STIX and Excel representations.


##### Data v4.5.1

This version of ATLAS data contains 1 matrix, 14 tactics, 46 techniques, 36 sub-techniques, 20 mitigations, and 22 case studies.

###### Mitigations

- Added new mitigation
  + [Control Access to ML Models and Data in Production](https://atlas.mitre.org/mitigations/AML.M0019)
- Minor updates to mitigation descriptions and techniques used


##### Navigator Data v1.6.1

Updated ATLAS STIX with ATT&CK Enterprise v14.1.
`,ue=Object.freeze(Object.defineProperty({__proto__:null,default:E},Symbol.toStringTag,{value:"Module"})),x=`#### March 2024


##### Website v4.0.0

This website update contains a redesigned look and migrates the code base from Nuxt.js 2 to Vue 3.


##### Data v4.5.2

This version of ATLAS data contains 1 matrix, 14 tactics, 46 techniques, 36 sub-techniques, 20 mitigations, and 22 case studies.

###### Techniques and Case Studies
- Minor fixes for typos
`,le=Object.freeze(Object.defineProperty({__proto__:null,default:x},Symbol.toStringTag,{value:"Module"})),O=`#### October 2024

Generative AI updates

##### Website v4.2.0

This website update includes new mitigations, techniques, and case studies related to generative AI.

##### Data v4.7.0

This version of ATLAS data contains 1 matrix, 14 tactics, 52 techniques, 39 sub-techniques, 26 mitigations, and 26 case studies.

###### Mitigations

- Added new mitigations

  - [Generative AI Guardrails](https://atlas.mitre.org/mitigations/AML.M0020)
  - [Generative AI Guidelines](https://atlas.mitre.org/mitigations/AML.M0021)
  - [Generative AI Model Alignment](https://atlas.mitre.org/mitigations/AML.M0022)
  - [AI Bill of Materials](https://atlas.mitre.org/mitigations/AML.M0023)
  - [AI Telemetry Logging](https://atlas.mitre.org/mitigations/AML.M0024)
  - [Maintain AI Dataset Provenance](https://atlas.mitre.org/mitigations/AML.M0025)

- Refreshed existing mitigations
  - [Limit Public Release of Information](https://atlas.mitre.org/mitigations/AML.M0000)
    - Previously known as "Limit Release of Public Information"

###### Techniques

- Added new techniques

  - [Publish Poisoned Models](https://atlas.mitre.org/techniques/AML.T0058)
  - [Erode Dataset Integrity](https://atlas.mitre.org/techniques/AML.T0059)
  - [User Execution: Malicious Package](https://atlas.mitre.org/techniques/AML.T0011.001)
  - [Publish Hallucinated Entities](https://atlas.mitre.org/techniques/AML.T0060)
  - [LLM Prompt Self-Replication](https://atlas.mitre.org/techniques/AML.T0061)
  - [Discover LLM Hallucinations](https://atlas.mitre.org/techniques/AML.T0062)
  - [Acquire Infrastructure: Domains](https://atlas.mitre.org/techniques/AML.T0008.002)
  - [Acquire Infrastructure: Physical Countermeasures](https://atlas.mitre.org/techniques/AML.T0008.003)
  - [Discover AI Model Outputs](https://atlas.mitre.org/techniques/AML.T0063)

- Refreshed existing techniques
  - [Acquire Infrastructure](https://atlas.mitre.org/techniques/AML.T0008)
  - [ML Supply Chain Compromise: Hardware](https://atlas.mitre.org/techniques/AML.T0010.000)
    - Previously known as "ML Supply Chain Compromise: GPU Hardware"
  - [AI Model Inference API Access](https://atlas.mitre.org/techniques/AML.T0040)
    - Previously known as "ML Model Inference API Access"

###### Case Studies

- Added new studies

  - [ChatGPT Package Hallucination](https://atlas.mitre.org/studies/AML.CS0022)
  - [ShadowRay](https://atlas.mitre.org/studies/AML.CS0023)
  - [Morris II Worm: RAG-Based Attack](https://atlas.mitre.org/studies/AML.CS0024)
  - [Web-Scale Data Poisoning: Split-View Attack](https://atlas.mitre.org/studies/AML.CS0025)

- Refreshed existing studies
  - [Bypassing Cylance's AI Malware Detection](https://atlas.mitre.org/studies/AML.CS0003)
  - [Attack on Machine Translation Services](https://atlas.mitre.org/studies/AML.CS0005)
  - [ProofPoint Evasion](https://atlas.mitre.org/studies/AML.CS0008)
  - [Face Identification System Evasion via Physical Countermeasures](https://atlas.mitre.org/studies/AML.CS0012)
`,he=Object.freeze(Object.defineProperty({__proto__:null,default:O},Symbol.toStringTag,{value:"Module"})),j=`#### March 2025

##### Website v4.3.0

This website update includes new a new case study and associated techniques.

##### Data v4.8.0

This version of ATLAS data contains 1 matrix, 14 tactics, 60 techniques, 44 sub-techniques, 26 mitigations, and 27 case studies.

###### Techniques

- Added new techniques

  - [Gather RAG-Indexed Targets](https://atlas.mitre.org/techniques/AML.T0064)
  - [LLM Prompt Crafting](https://atlas.mitre.org/techniques/AML.T0065)
  - [Retrieval Content Crafting](https://atlas.mitre.org/techniques/AML.T0066)
  - [LLM Trusted Output Components Manipulation](https://atlas.mitre.org/techniques/AML.T0067)
  - [LLM Prompt Obfuscation](https://atlas.mitre.org/techniques/AML.T0068)
  - [Discover LLM System Information](https://atlas.mitre.org/techniques/AML.T0069)
  - [RAG Poisoning](https://atlas.mitre.org/techniques/AML.T0070)
  - [False RAG Entry Injection](https://atlas.mitre.org/techniques/AML.T0071)

###### Case Studies

- Added new case studies

  - [Financial Transaction Hijacking with M365 Copilot as an Insider](https://atlas.mitre.org/studies/AML.CS0026)
`,pe=Object.freeze(Object.defineProperty({__proto__:null,default:j},Symbol.toStringTag,{value:"Module"})),R=`#### April 2025

##### Website v4.4.0

This website update includes new case studies, and associated TTPs from user submissions.

Updated the [AI Security 101 page](/resources/ai-security-101) to include topics on AI in Autonomous Systems and the Malicious Use of AI.

Added an article, [AI Security for Autonomous Systems](/resources/ai-security-autonomous-systems).

##### Data v4.9.0

This version of ATLAS data contains 1 matrix, 15 tactics, 68 techniques, 47 sub-techniques, 26 mitigations, and 32 case studies.

###### General

The language in TTP names and descriptions has been updated to consistently prefer AI / artificial intelligence over ML / machine learning.

###### Tactics

- Added new tactics

  - [Command and Control](/tactics/AML.TA0014)

###### Techniques

- Added new techniques

  - [Reverse Shell](/techniques/AML.T0072)
  - [Impersonation](/techniques/AML.T0073)
  - [Masquerading](/techniques/AML.T0074)
  - [Cloud Service Discovery](/techniques/AML.T0075)
  - [Corrupt AI Model](/techniques/AML.T0076)
  - [LLM Response Rendering](/techniques/AML.T0077)
  - [Drive-by Compromise](/techniques/AML.T0078)
  - [Stage Capabilities](/techniques/AML.T0079)
  - [Manipulate AI Model: Embed Malware](/techniques/AML.T0018.002)
  - [AI Supply Chain Compromise: Container Registry](/techniques/AML.T0010.004)
  - [Acquire Infrastructure: Serverless](/techniques/AML.T0008.004)

- Updated existing techniques

  - [Search Open Technical Databases](/techniques/AML.T0000)
    - (previously Search for Victim's Publicly Available Research Materials)
  - [Search Open AI Vulnerability Analysis](/techniques/AML.T0001)
    - (previously Search for Publicly Available Adversarial Vulnerability Analysis)
  - [Manipulate AI Model](/techniques/AML.T0018)
    - (previously Backdoor ML Model)
  - [Manipulate AI Model: Poison AI Model](/techniques/AML.T0018.000)
    - (previously Backdoor ML Model: Poison ML Model)
  - [Manipulate AI Model: Modify AI Model Architecture](/techniques/AML.T0018.001)
    - (previously Backdoor ML Model: Inject Payload)

###### Mitigations

- Updated existing mitigations

  - [Vulnerability Scanning](/mitigations/AML.M0016)
  - [AI Telemetry Logging](/mitigations/AML.M0024)

###### Case Studies

- Added new case studies

  - [Organization Confusion on Hugging Face](/studies/AML.CS0027)
  - [AI Model Tampering via Supply Chain Attack](/studies/AML.CS0028)
  - [Google Bard Conversation Exfiltration](/studies/AML.CS0029)
  - [LLM Jacking](/studies/AML.CS0030)
  - [Malicious Models on Hugging Face](/studies/AML.CS0031)

- Updated existing case studies

  - [PoisonGPT](/studies/AML.CS0019)
  - [Indirect Prompt Injection Threats: Bing Chat Data Pirate](/studies/AML.CS0020)
  - [ChatGPT Conversation Exfiltration and Plugin Compromise](/studies/AML.CS0021)
`,me=Object.freeze(Object.defineProperty({__proto__:null,default:R},Symbol.toStringTag,{value:"Module"})),k=`#### August 2025

##### Website v4.5.0

Added an article, [SAFE-AI: A Framework for Securing AI-Enabled Systems](/resources/safe-ai).

##### Data v4.9.1

Minor language tweaks and typo fixes.
`,Ae=Object.freeze(Object.defineProperty({__proto__:null,default:k},Symbol.toStringTag,{value:"Module"})),V=`#### September 2025

##### Website v4.6.0

This website update includes new case studies, and associated TTPs from user submissions.

##### Data v5.0.0

This version of ATLAS data contains 1 matrix, 15 tactics, 66 techniques, 46 sub-techniques, 26 mitigations, and 33 case studies.

###### General

This version adds the new "Technique Maturity" field to the distributed ATLAS.yaml file. Technique maturity is defined as the level of evidence behind the technique's use:
- Feasible – The technique has been shown to work in a research or academic setting
- Demonstrated – The technique has been shown to be effective in a red team exercise or demonstration on a realistic AI-enabled system
- Realized – The technique has been used by a threat actor in a real-world incident targeting an AI-enab

###### Techniques

- Added new techniques

  - [AI Agent Context Poisoning](/techniques/AML.T0080)
  - [AI Agent Context Poisoning: Memory](/techniques/AML.T0080.001)
  - [AI Agent Context Poisoning: Thread](/techniques/AML.T0080.001)
  - [Modify AI Agent Configuration](/techniques/AML.T0081)
  - [RAG Credential Harvesting](/techniques/AML.T0082)
  - [Credentials from AI Agent Configuration](/techniques/AML.T0083)
  - [Discover AI Agent Configuration](/techniques/AML.T0084)
  - [Discover AI Agent Configuration: Embedded Knowledge](/techniques/AML.T0084.000)
  - [Discover AI Agent Configuration: Tool Definitions](/techniques/AML.T0084.001)
  - [Discover AI Agent Configuration: Activation Triggers](/techniques/AML.T0084.002)
  - [Data from AI Services](/techniques/AML.T0085)
  - [Data from AI Services: RAG Databases](/techniques/AML.T0085.000)
  - [Data from AI Services: AI Agent Tools](/techniques/AML.T0085.001)
  - [Exfiltration via AI Agent Tool Invocation](/techniques/AML.T0086)
  - [LLM Prompt Injection: Triggered](/techniques/AML.T0051.002)

- Updated existing techniques

  - [AI Agent Tool Invocation](/techniques/AML.T0053)
    - (previously LLM Plugin Compromise)

###### Case Studies

- Added a new case study

  - [Attempted Evasion of ML Phishing Webpage Detection System](/studies/AML.CS0032)

###### Release Statement

©2025 The MITRE Corporation. ALL RIGHTS RESERVED

Approved for public release. Distribution unlimited 25-02579-1.
`,ge=Object.freeze(Object.defineProperty({__proto__:null,default:V},Symbol.toStringTag,{value:"Module"})),G=`#### October 2025

##### Website v4.7.0

Added technique maturity filter to matrix view and tooltip to technique pages.

##### Data v5.0.1

Minor language tweaks and typo fixes.

##### Release Statement

©2025 The MITRE Corporation. ALL RIGHTS RESERVED

Approved for public release. Distribution unlimited 25-02579-2.
`,_e=Object.freeze(Object.defineProperty({__proto__:null,default:G},Symbol.toStringTag,{value:"Module"})),fe=b("div",{class:"text-h6"},"All Updates",-1),Te=["to"],be={__name:"UpdatesTable",setup(u){const{mdAndUp:t}=T(),n=H([]),i=Object.assign({"/public/content/update-files/2021-06.md":L,"/public/content/update-files/2021-07.md":M,"/public/content/update-files/2021-10.md":y,"/public/content/update-files/2022-03.md":S,"/public/content/update-files/2022-07.md":q,"/public/content/update-files/2022-10.md":w,"/public/content/update-files/2023-01.md":P,"/public/content/update-files/2023-02.md":I,"/public/content/update-files/2023-04.md":C,"/public/content/update-files/2023-10.md":D,"/public/content/update-files/2024-01.md":E,"/public/content/update-files/2024-03.md":x,"/public/content/update-files/2024-10.md":O,"/public/content/update-files/2025-03.md":j,"/public/content/update-files/2025-04.md":R,"/public/content/update-files/2025-08.md":k,"/public/content/update-files/2025-09.md":V,"/public/content/update-files/2025-10.md":G}),o=/(\d{4}-\d{2}).md/,r=/#+ (\w+) (\d{4})/;for(const[l,A]of Object.entries(i)){const s={},h=o.exec(l);if(h){const _=h[1];s.route=_}const g=r.exec(A);if(g){const _=`${g[1].substring(0,3)} ${g[2]}`;s.date=_}n.push(s)}return n.reverse(),(l,A)=>(d(),p("div",{class:K(`${m(t)?"text-right":"text-left"} pr-10 pt-7 `),style:{"min-width":"150px"}},[fe,a(F,null,{default:c(()=>[(d(!0),p(U,null,W(n,(s,h)=>(d(),v(z,{key:h,class:"text-h6 pa-0 text-blue text-wrap",to:s.route},{default:c(()=>[b("div",{to:s.route},B(s.date),9,Te)]),_:2},1032,["to"]))),128))]),_:1})],2))}},ve=(u,t,n)=>{const i=u[t];return i?typeof i=="function"?i():Promise.resolve(i):new Promise((o,r)=>{(typeof queueMicrotask=="function"?queueMicrotask:setTimeout)(r.bind(null,new Error("Unknown variable dynamic import: "+t+(t.split("/").length!==n?". Note that variables only represent file names one level deep.":""))))})},Le=["innerHTML"],Me={__name:"UpdateContent",props:{date:String},async setup(u){let t,n;const i=$("markdownit"),{date:o}=u,r=([t,n]=J(()=>ve(Object.assign({"../../public/content/update-files/2021-06.md":()=>e(()=>Promise.resolve().then(()=>ee),void 0),"../../public/content/update-files/2021-07.md":()=>e(()=>Promise.resolve().then(()=>te),void 0),"../../public/content/update-files/2021-10.md":()=>e(()=>Promise.resolve().then(()=>ne),void 0),"../../public/content/update-files/2022-03.md":()=>e(()=>Promise.resolve().then(()=>ie),void 0),"../../public/content/update-files/2022-07.md":()=>e(()=>Promise.resolve().then(()=>se),void 0),"../../public/content/update-files/2022-10.md":()=>e(()=>Promise.resolve().then(()=>ae),void 0),"../../public/content/update-files/2023-01.md":()=>e(()=>Promise.resolve().then(()=>oe),void 0),"../../public/content/update-files/2023-02.md":()=>e(()=>Promise.resolve().then(()=>re),void 0),"../../public/content/update-files/2023-04.md":()=>e(()=>Promise.resolve().then(()=>ce),void 0),"../../public/content/update-files/2023-10.md":()=>e(()=>Promise.resolve().then(()=>de),void 0),"../../public/content/update-files/2024-01.md":()=>e(()=>Promise.resolve().then(()=>ue),void 0),"../../public/content/update-files/2024-03.md":()=>e(()=>Promise.resolve().then(()=>le),void 0),"../../public/content/update-files/2024-10.md":()=>e(()=>Promise.resolve().then(()=>he),void 0),"../../public/content/update-files/2025-03.md":()=>e(()=>Promise.resolve().then(()=>pe),void 0),"../../public/content/update-files/2025-04.md":()=>e(()=>Promise.resolve().then(()=>me),void 0),"../../public/content/update-files/2025-08.md":()=>e(()=>Promise.resolve().then(()=>Ae),void 0),"../../public/content/update-files/2025-09.md":()=>e(()=>Promise.resolve().then(()=>ge),void 0),"../../public/content/update-files/2025-10.md":()=>e(()=>Promise.resolve().then(()=>_e),void 0)}),`../../public/content/update-files/${o}.md`,6)),t=await t,n(),t),l=i.render(r.default);return(A,s)=>(d(),p("div",{innerHTML:m(l)},null,8,Le))}},qe={__name:"UpdatesListView",setup(u){const t=X(),{date:n}=t.params,{mdAndUp:i}=T(),o=Y("Updates");return(r,l)=>(d(),p("div",null,[a(N,{pageTitle:o.value},null,8,["pageTitle"]),a(Q,null,{default:c(()=>[a(f,{cols:`${m(i)?2:12}`},{default:c(()=>[a(be)]),_:1},8,["cols"]),a(f,{cols:"10"},{default:c(()=>[(d(),v(Z,null,{default:c(()=>[a(Me,{date:m(n)},null,8,["date"])]),_:1}))]),_:1})]),_:1})]))}};export{qe as default};
