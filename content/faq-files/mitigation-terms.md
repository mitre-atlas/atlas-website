---
title: Mitigation Terminology
weight: 3
---

#### What are the tags associated with mitigations?

Mitigations tags capture broad categorizations such as machine learning (ML) components and lifecycle stages.

| Tag | Description  |
|---|---|
| Active            | Requires human intervention. Examples include scanning for adversarial threats and alerting maintainers. |
| Data Focused      | Relating to ML model data. Examples include training and validation datasets, as well as model inputs and outputs. |
| Model Development       | Mitigations that can be implemented during the ML model development stage |
| Model Agnostic    | Does not modify the ML model |
| Model Enhancement | Modifies the ML model. Examples include changing parameters, optimizers, and loss functions. |
| Model Focused     | Relating to the ML model itself |
| Model Operations        | Mitigations that can be implemented and used while a model is in production and operational |
| Passive           | Once implemented, does not require further human intervention. Can be a one-time implemention.|

Sources include:
- [Securing Artificial Intelligence: Mitigation Strategy Report](https://www.etsi.org/deliver/etsi_gr/SAI/001_099/005/01.01.01_60/gr_SAI005v010101p.pdf)
- [NIST Adversarial Machine Learning Taxonomy and Terminology](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-2e2023.ipd.pdf)
- [CRISP-ML(Q): The ML Lifecycle Process](https://ml-ops.org/content/crisp-ml)
