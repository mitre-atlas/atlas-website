#### December 2025

This release adds several case studies focusing on the interesection of generative AI and malware.
It includes a large update to existing mitigations, adding missing links to adversary techniques.
It also continues to add new adversary techniques targeting agentic AI systems.

The ATLAS knowledge base is built from community contributions. We want to acknowledge the following for their contributions for this release:
- The members of the [Center for Threat-Informed Defense](https://ctid.mitre.org/) (CTID) [Secure AI](https://ctid.mitre.org/projects/secure-ai/) project for contributing to mitigations ane feedback on new case studies and techniques.
- Zenity for contributing new adversary techniques and a case study targeting agentic systems:
  - [AI Service API](/techniques/AML.T0096)
  - [AI Agent Tool Credential Harvesting](/techniques/AML.T0098)
  - [AI Agent Tool Data Poisoning](/techniques/AML.T0099)
  - [SesameOp: Novel backdoor uses OpenAI Assistants API for command and control](/studies/AML.CS0042)
- US Bank (Joe Gumke and Dragan Damjanovic) and Vijay Lalwani (x_id: @VijayV_Lalwani for submitting [Malware Prototype with Embedded Prompt Injection](/studies/AML.CS0043)
- US Bank (Joe Gumke and Dragan Damjanovic) for updates to [Obtain Capabilities: Generative AI](/techniques/AML.T0016.002)
- Ishan Dani for updates to [LLM Prompt Obfuscation](/techniques/AML.T0068)
- Fujitsu Research of Europe for updates to [Prompt Infiltration via Public-Facing Application](/techniques/AML.T0093)
- NEC Corporation (Pooja Natarajan, Takeuchi Toshiki, Sareena Karapoola, Abhishek Dhiman) and Accenture (Lustig Vias) for submitting [LAMEHUG: Malware Leveraging Dynamic AI-Generated Commands](/studies/AML.CS0044)
- Microsoft (Simone Curzi) for contributing many missing technique/mitigation links.

##### Website v4.9.0

- Updated the website to use ATLAS Data v5.2.0

##### Data v5.2.0

This version of ATLAS data contains 1 matrix, 16 tactics, 91 techniques, 56 sub-techniques, 35 mitigations, and 45 case studies.

###### Techniques

- Added new techniques

  - [AI Service API](/techniques/AML.T0096)
  - [Virtualization/Sandbox Evasion](/techniques/AML.T0097)
  - [AI Agent Tool Credential Harvesting](/techniques/AML.T0098)
  - [AI Agent Tool Data Poisoning](/techniques/AML.T0099)
  - [AI Agent Clickbait](/techniques/AML.T0100)
  - [Data Destruction via AI Agent Tool Invocation](/techniques/AML.T0101)
  - [Generate Malicious Commands](/techniques/AML.T0102)

- Updated existing techniques

  - [Spamming AI System with Chaff Data](/techniques/AML.T0046)
  - [Prompt Infiltration via Public-Facing Application](/techniques/AML.T0093)
  - [LLM Prompt Obfuscation](/techniques/AML.T0068)
  - [Obtain Capabilities: Generative AI](/techniques/AML.T0016.002)
  - [Cloud Service Discovery](/techniques/AML.T0075)

###### Mitigations

- Added new mitigations
  - [Segmentation of AI Agent Components](/mitigations/AML.M0032)
  - [Input and Output Validation for AI Agent Components](/mitigations/AML.M0033)
  - [Deepfake Detection](/mitigations/AML.M0034)

- Updated existing mitigations
  - [Limit Public Release of Information](/mitigations/AML.M0000)
  - [Limit Model Artifact Release](/mitigations/AML.M0001)
  - [Passive Output Manipulation](/mitigations/AML.M0002)
  - [Model Hardening](/mitigations/AML.M0003)
  - [Restrict Number of AI Model Queries](/mitigations/AML.M0004)
  - [Control Access to AI Models and Data at Rest](/mitigations/AML.M0005)
  - [Use Ensemble Methods](/mitigations/AML.M0006)
  - [Sanitize Training Data](/mitigations/AML.M0007)
  - [Validate AI Model](/mitigations/AML.M0008)
  - [Use Multi-Modal Sensors](/mitigations/AML.M0009)
  - [Input Restoration](/mitigations/AML.M0010)
  - [Restrict Library Loading](/mitigations/AML.M0011)
  - [Encrypt Sensitive Information](/mitigations/AML.M0012)
  - [Code Signing](/mitigations/AML.M0013)
  - [Verify AI Artifacts](/mitigations/AML.M0014)
  - [Adversarial Input Detection](/mitigations/AML.M0015)
  - [Vulnerability Scanning](/mitigations/AML.M0016)
  - [AI Model Distribution Methods](/mitigations/AML.M0017)
  - [User Training](/mitigations/AML.M0018)
  - [Control Access to AI Models and Data in Production](/mitigations/AML.M0019)
  - [Generative AI Guardrails](/mitigations/AML.M0020)
  - [Generative AI Guidelines](/mitigations/AML.M0021)
  - [Generative AI Model Alignment](/mitigations/AML.M0022)
  - [AI Bill of Materials](/mitigations/AML.M0023)
  - [AI Telemetry Logging](/mitigations/AML.M0024)
  - [Maintain Dataset Provenenance](/mitigations/AML.M0025)
  - [Privileged AI Agent Permissions Configuration](/mitigations/AML.M0026)
  - [Single-User AI Agent Permissions Configuration](/mitigations/AML.M0027)
  - [AI Agent Tools Permissions Configuration](/mitigations/AML.M0028)
  - [Human In-the-Loop for AI Agent Actions](/mitigations/AML.M0029)
  - [Restrict AI Agent Tool Invocation on Untrusted Data](/mitigations/AML.M0030)

###### Case Studies

- Added new case studies

  - [SesameOp: Novel backdoor uses OpenAI Assistants API for command and control](/studies/AML.CS0042)
  - [Malware Prototype with Embedded Prompt Injection](/studies/AML.CS0043)
  - [LAMEHUG: Malware Leveraging Dynamic AI-Generated Commands](/studies/AML.CS0044)

- Updated existing casse studies

  - [LLM Jacking](/studies/AML.CS0030)


###### Release Statement

©2025 The MITRE Corporation. ALL RIGHTS RESERVED

Approved for public release. Distribution unlimited 25-02579-7.
