function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = []
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}
import{_ as j}from"./PageSectionTitle.vue_vue_type_script_setup_true_lang-BDwGvZEQ.js";import{u as v,D as O,o as c,l as h,b as i,w as r,F as k,r as N,a as T,E as R,e as A,t as V,G as U,n as H,m,C as W,ae as z,af as t,ag as B,y as F,V as K,d as g,ah as $}from"./index-BmQRBLpp.js";const y=`#### June 2021

##### Website v2.0.0 - 2.1.3

Official launch of https://atlas.mitre.org, allowing users to browse the ATLAS matrix and initial set of case studies.

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/3FN9v-y-C-w" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>


##### Data v2.0.0

This version of ATLAS data contains 16 tactics, 30 techniques, 27 sub-techniques, and 13 case studies.  14 of the tactics and several techniques used in case studies were imported from MITRE ATT&CK&reg; Enterprise v9.
`,G=Object.freeze(Object.defineProperty({__proto__:null,default:y},Symbol.toStringTag,{value:"Module"})),L=`#### July 2021


##### Website v2.2.0 - 2.2.2

ATLAS Navigator layers are available for case studies, highlighting techniques used in each procedure.  See the "ATLAS Navigator layer" button on the case study pages for to view and download the layer files.

##### Data v2.0.1

This version of ATLAS data contains 16 tactics, 30 techniques, 27 sub-techniques, and 13 case studies.  14 of the tactics and several techniques used in case studies were imported from MITRE ATT&CK&reg; Enterprise v9.
`,J=Object.freeze(Object.defineProperty({__proto__:null,default:L},Symbol.toStringTag,{value:"Module"})),w=`#### October 2021


##### Website v2.3.0 - 2.3.2

Technique pages display examples of how techniques have been used in case studies, drawn from procedure steps.


##### Data v2.2.0

This version of ATLAS data contains 16 tactics, 30 techniques, 27 sub-techniques, and 15 case studies.  14 of the tactics and several techniques used in case studies were imported from MITRE ATT&CK&reg; Enterprise v9.

New case studies:
- [Backdoor Attack on Deep Learning Models in Mobile Apps](https://atlas.mitre.org/studies/AML.CS0013)
- [Confusing Antimalware Neural Networks](https://atlas.mitre.org/studies/AML.CS0014)
`,X=Object.freeze(Object.defineProperty({__proto__:null,default:w},Symbol.toStringTag,{value:"Module"})),S=`#### March 2022


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
`,Y=Object.freeze(Object.defineProperty({__proto__:null,default:S},Symbol.toStringTag,{value:"Module"})),M=`#### July 2022


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
`,Q=Object.freeze(Object.defineProperty({__proto__:null,default:M},Symbol.toStringTag,{value:"Module"})),q=`#### October 2022


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
`,Z=Object.freeze(Object.defineProperty({__proto__:null,default:q},Symbol.toStringTag,{value:"Module"})),P=`#### January 2023


##### Website v3.3.0

This website update indicates when ATLAS tactics and techniques have been adapted from ATT&CK, displaying a red \`&\` in the matrix and list views and linking to the ATT&CK website on individual tactic and technique pages.  Additional updates for [upcoming events](/resources/contact) and various bug fixes.


##### Data v4.2.0

This version of ATLAS data contains 1 matrix, 12 tactics, 38 techniques, 27 sub-techniques, and 16 case studies.

- New technique: [Data from Local System](/techniques/AML.T0037)
- New case study: [Compromised PyTorch Dependency Chain](/studies/AML.CS0015)


##### Navigator Data v1.3.0

The ATLAS STIX now also includes ATT&CK Enterprise v12 for comparison purposes. Any ATLAS techniques adapted from ATT&CK are additionally denoted with "(ATLAS)" to distinguish the names.

Updated ATLAS STIX and Navigator layer files for the added technique and new case study in ATLAS Data v4.2.0.
`,ee=Object.freeze(Object.defineProperty({__proto__:null,default:P},Symbol.toStringTag,{value:"Module"})),E=`#### February 2023


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
`,te=Object.freeze(Object.defineProperty({__proto__:null,default:E},Symbol.toStringTag,{value:"Module"})),D=`#### April 2023


##### Website v3.5.0

This website update includes initial mitigations.


##### Data v4.4.0

This version of ATLAS data contains 1 matrix, 12 tactics, 40 techniques, 27 sub-techniques, 19 mitigations, and 17 case studies.
`,ne=Object.freeze(Object.defineProperty({__proto__:null,default:D},Symbol.toStringTag,{value:"Module"})),x=`#### October 2023

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
Added machine learning lifecycle stages and new categories to mitigations`,ae=Object.freeze(Object.defineProperty({__proto__:null,default:x},Symbol.toStringTag,{value:"Module"})),C=`#### January 2024


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
`,se=Object.freeze(Object.defineProperty({__proto__:null,default:C},Symbol.toStringTag,{value:"Module"})),I=`#### March 2024


##### Website v4.0.0

This website update contains a redesigned look and migrates the code base from Nuxt.js 2 to Vue 3.


##### Data v4.5.2

This version of ATLAS data contains 1 matrix, 14 tactics, 46 techniques, 36 sub-techniques, 20 mitigations, and 22 case studies.

###### Techniques and Case Studies
- Minor fixes for typos
`,ie=Object.freeze(Object.defineProperty({__proto__:null,default:I},Symbol.toStringTag,{value:"Module"})),oe=A("div",{class:"text-h6"},"All Updates",-1),re=["to"],ce={__name:"UpdatesTable",setup(d){const{mdAndUp:n}=v(),e=O([]),o=Object.assign({"/public/content/update-files/2021-06.md":y,"/public/content/update-files/2021-07.md":L,"/public/content/update-files/2021-10.md":w,"/public/content/update-files/2022-03.md":S,"/public/content/update-files/2022-07.md":M,"/public/content/update-files/2022-10.md":q,"/public/content/update-files/2023-01.md":P,"/public/content/update-files/2023-02.md":E,"/public/content/update-files/2023-04.md":D,"/public/content/update-files/2023-10.md":x,"/public/content/update-files/2024-01.md":C,"/public/content/update-files/2024-03.md":I}),s=/(\d{4}-\d{2}).md/,l=/#+ (\w+) (\d{4})/;for(const[u,_]of Object.entries(o)){const a={},p=s.exec(u);if(p){const b=p[1];a.route=b}const f=l.exec(_);if(f){const b=`${f[1].substring(0,3)} ${f[2]}`;a.date=b}e.push(a)}return e.reverse(),(u,_)=>(c(),h("div",{class:H(`${m(n)?"text-right":"text-left"} pr-10 pt-7 `),style:{"min-width":"150px"}},[oe,i(U,null,{default:r(()=>[(c(!0),h(k,null,N(e,(a,p)=>(c(),T(R,{key:p,class:"text-h6 pa-0 text-blue text-wrap",to:a.route},{default:r(()=>[A("div",{to:a.route},V(a.date),9,re)]),_:2},1032,["to"]))),128))]),_:1})],2))}},de=(d,n)=>{const e=d[n];return e?typeof e=="function"?e():Promise.resolve(e):new Promise((o,s)=>{(typeof queueMicrotask=="function"?queueMicrotask:setTimeout)(s.bind(null,new Error("Unknown variable dynamic import: "+n)))})},ue=["innerHTML"],le={__name:"UpdateContent",props:{date:String},async setup(d){let n,e;const o=W("markdownit"),{date:s}=d,l=([n,e]=z(()=>de(Object.assign({"../../public/content/update-files/2021-06.md":()=>t(()=>Promise.resolve().then(()=>G),void 0),"../../public/content/update-files/2021-07.md":()=>t(()=>Promise.resolve().then(()=>J),void 0),"../../public/content/update-files/2021-10.md":()=>t(()=>Promise.resolve().then(()=>X),void 0),"../../public/content/update-files/2022-03.md":()=>t(()=>Promise.resolve().then(()=>Y),void 0),"../../public/content/update-files/2022-07.md":()=>t(()=>Promise.resolve().then(()=>Q),void 0),"../../public/content/update-files/2022-10.md":()=>t(()=>Promise.resolve().then(()=>Z),void 0),"../../public/content/update-files/2023-01.md":()=>t(()=>Promise.resolve().then(()=>ee),void 0),"../../public/content/update-files/2023-02.md":()=>t(()=>Promise.resolve().then(()=>te),void 0),"../../public/content/update-files/2023-04.md":()=>t(()=>Promise.resolve().then(()=>ne),void 0),"../../public/content/update-files/2023-10.md":()=>t(()=>Promise.resolve().then(()=>ae),void 0),"../../public/content/update-files/2024-01.md":()=>t(()=>Promise.resolve().then(()=>se),void 0),"../../public/content/update-files/2024-03.md":()=>t(()=>Promise.resolve().then(()=>ie),void 0)}),`../../public/content/update-files/${s}.md`)),n=await n,e(),n),u=o.render(l.default);return(_,a)=>(c(),h("div",{innerHTML:m(u)},null,8,ue))}},me={__name:"UpdatesListView",setup(d){const n=B(),{date:e}=n.params,{mdAndUp:o}=v(),s=F("Updates");return(l,u)=>(c(),h("div",null,[i(j,{pageTitle:s.value},null,8,["pageTitle"]),i(K,null,{default:r(()=>[i(g,{cols:`${m(o)?2:12}`},{default:r(()=>[i(ce)]),_:1},8,["cols"]),i(g,{cols:"10"},{default:r(()=>[(c(),T($,null,{default:r(()=>[i(le,{date:m(e)},null,8,["date"])]),_:1}))]),_:1})]),_:1})]))}};export{me as default};
