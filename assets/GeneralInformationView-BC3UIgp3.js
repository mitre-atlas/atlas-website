import{r as T,z as V,u as R,o as a,q as n,g as i,b as t,t as l,v as c,E as o,w as r,G as m,d as S,A as N,H as D,F as p,s as h,c as d,a as _,I as C,J as M,K as x}from"./index-BJ3ql_OM.js";import{_ as O}from"./PageSectionTitle.vue_vue_type_script_setup_true_lang-MdwKFcmm.js";import{V as v}from"./VChip-Dqk5BvvI.js";const H="4.2.1";var P={VITE_BASE_URL:"/",VITE_SHORT_NAME:"ATLAS",VITE_MITRE_TITLE:"MITRE ATLAS™",VITE_CONTACT_EMAIL:"atlas@mitre.org",VITE_NAVIGATOR_URL:"https://mitre-atlas.github.io/atlas-navigator",VITE_NAVIGATOR_LAYER_GITHUB_URL:"https://raw.githubusercontent.com/mitre-atlas/atlas-navigator-data/main",VITE_ANALYTICS_ID:"G-CE03P4X7S7",VITE_OSANO_SCRIPT:"https://cmp.osano.com/AzyhULTdPkqmy4aDN/7bde26f4-70be-4234-8dd2-86deb9f130bb/osano.js",BASE_URL:"/",MODE:"production",DEV:!1,PROD:!0,SSR:!1};const B={class:"text-h5 my-5"},G=["href"],X={class:"text-h5 my-5"},K=t("p",{class:"text-h5 mt-10"},"Accessing ATLAS Data",-1),Q={class:"px-4"},U=["href"],F=t("p",{class:"text-h5 mt-10"},"Instructional Videos",-1),J={class:"px-4 pb-4"},W=t("a",{target:"_blank",href:"https://youtube.com/playlist?list=PLkTApXQou_8J6-t2_7QTTVDLBQlKFXPOu"},"video playlist",-1),Y=t("p",null,"Videos included:",-1),q={target:"_blank",href:"https://www.youtube.com/watch?v=3FN9v-y-C-w&list=PLkTApXQou_8J6-t2_7QTTVDLBQlKFXPOu&index=1"},z=t("li",null,[t("a",{target:"_blank",href:"https://www.youtube.com/watch?v=Np_ip14YJGg&list=PLkTApXQou_8J6-t2_7QTTVDLBQlKFXPOu&index=2"}," Case Study Builder Walkthrough")],-1),j=t("p",{class:"text-h5 mt-10"},"ATLAS GitHub Repositories",-1),$={class:"text-capitalize"},Z=t("p",{class:"text-h5 mt-10"},"Other ATLAS Resources",-1),rt={__name:"GeneralInformationView",setup(tt){const{VITE_MITRE_TITLE:A,VITE_SHORT_NAME:b}=P,I=T("General Information"),f=V("markdownit"),y=R().getDataAttribute("version"),g=T(["excelGroup"]),k=T([{type:"link",title:"As YAML",subtitle:"Source data files for editing and parsing",url:"https://github.com/mitre-atlas/atlas-data"},{type:"link",title:"As STIX",subtitle:"STIX 2.1 (.json) files, either ATLAS standalone or ATLAS + ATT&CK Enterprise",url:"https://github.com/mitre-atlas/atlas-navigator-data"},{type:"group",title:"As Excel",subtitle:"Excel (.xslx) files, built from the ATLAS STIX data using ATT&CK tools",subitems:[{type:"subHeader",subHeader:'Click on a file below to download.<a href="https://github.com/mitre-atlas/atlas-navigator-data#export-to-excel" target="_blank">&nbsp;See this README for more information.</a>'},{type:"link",url:"https://github.com/mitre-atlas/atlas-website/raw/main/public/excel-files/atlas-matrices.xlsx"},{type:"link",url:"https://github.com/mitre-atlas/atlas-website/raw/main/public/excel-files/atlas-mitigations.xlsx"},{type:"link",url:"https://github.com/mitre-atlas/atlas-website/raw/main/public/excel-files/atlas-tactics.xlsx"},{type:"link",url:"https://github.com/mitre-atlas/atlas-website/raw/main/public/excel-files/atlas-techniques.xlsx"},{type:"link",url:"https://github.com/mitre-atlas/atlas-website/raw/main/public/excel-files/atlas.xlsx"}]}]),w={websites:[{name:"ATLAS Website",description:"Static files for this atlas.mitre.org website.",url:"https://github.com/mitre-atlas/atlas-website"},{name:"ATLAS Navigator",description:"ATLAS Navigator web app - a fork of the MITRE ATT&CK&reg; Navigator.",url:"https://github.com/mitre-atlas/atlas-navigator/tree/atlas"}],data:[{name:"ATLAS Data",description:"Source data for ATLAS tactics, techniques, and case studies, along with scripts and documentation.",url:"https://github.com/mitre-atlas/atlas-data"},{name:"ATLAS Navigator Data",description:"Scripts and outputs for ATLAS data in STIX JSON and ATT&CK Navigator layer formats.",url:"https://github.com/mitre-atlas/atlas-navigator-data"}],tools:[{name:"Almanac",description:"[CALDERA](https://caldera.mitre.org/) adversary emulation platform plugin for exploring ATLAS using the ATLAS Navigator - a fork of the ATT&CK [Compass](https://caldera.readthedocs.io/en/latest/Plugin-library.html#compass) plugin.",url:"https://github.com/mitre-atlas/almanac"},{name:"Arsenal",description:"The Arsenal plugin will help store and create adversarial TTPs defined in ATLAS to interface with [CALDERA](https://caldera.mitre.org/). ",url:"https://github.com/mitre-atlas/arsenal"}]},E=[{name:"AI Incident Sharing",description:"Submit & received anonymized community AI incident data",url:"https://ai-incidents.mitre.org"},{name:"AI Risk Database",description:"Explore AI supply chain risk with the AI Risk Database",url:"https://ai-incidents.mitre.org"}];return(at,L)=>(a(),n("div",null,[i(O,{pageTitle:I.value},null,8,["pageTitle"]),t("p",B,[t("a",{href:l(N)("/pdf-files/MITRE_ATLAS_Fact_Sheet.pdf")},c(l(A))+" Fact Sheet",9,G)]),t("p",X,"Current "+c(l(b))+" Version",1),i(v,{variant:"flat","prepend-icon":"mdi-code-tags",label:"",color:"blue",text:`Website v${l(H)}`,class:"mr-3"},null,8,["text"]),i(v,{variant:"flat","prepend-icon":"mdi-database",label:"",color:"primary",text:`Data v${l(y)}`},null,8,["text"]),i(o,{title:l(D)(),subtitle:"View details and prior versions on the Updates page",class:"mt-5",to:"/resources/updates"},null,8,["title"]),K,t("div",Q,[i(m,{lines:"two",opened:g.value,"onUpdate:opened":L[0]||(L[0]=e=>g.value=e)},{default:r(()=>[(a(!0),n(p,null,h(k.value,e=>(a(),n("div",{key:e.title},[e.type==="link"?(a(),d(o,{key:0,title:e.title,subtitle:e.subtitle,href:e.url,target:"_blank"},null,8,["title","subtitle","href"])):_("",!0),e.type==="group"?(a(),d(M,{key:1,value:"excelGroup"},{activator:r(({props:s})=>[i(o,C(s,{title:e.title,subtitle:e.subtitle}),null,16,["title","subtitle"])]),default:r(()=>[(a(!0),n(p,null,h(e.subitems,(s,u)=>(a(),d(m,{key:u},{default:r(()=>[s.type==="subHeader"?(a(),d(o,{key:0,innerHTML:s.subHeader,class:"text-grey"},null,8,["innerHTML"])):_("",!0),s.type==="link"?(a(),d(o,{key:1,class:"ml-10"},{default:r(()=>[t("a",{href:s.url,download:""},c(s.url.substring(s.url.lastIndexOf("/")+1)),9,U)]),_:2},1024)):_("",!0)]),_:2},1024))),128))]),_:2},1024)):_("",!0)]))),128))]),_:1},8,["opened"])]),F,t("div",J,[t("p",null,[S(" The MITRE YouTube channel houses a "),W,S(" containing a collection of instructional videos for users of the "+c(l(b))+" site. ",1)]),Y,t("ul",null,[t("li",null,[t("a",q,c(l(A))+" Website Overview",1)]),z])]),j,i(m,{lines:"two"},{default:r(()=>[(a(),n(p,null,h(w,(e,s)=>t("div",{key:s},[t("div",$,c(s),1),(a(!0),n(p,null,h(e,u=>(a(),d(o,{key:u.name,title:u.name,href:u.url,target:"_blank"},{default:r(()=>[i(x,{innerHTML:l(f).render(u.description)},null,8,["innerHTML"])]),_:2},1032,["title","href"]))),128))])),64))]),_:1}),Z,i(m,{lines:"two"},{default:r(()=>[(a(),n(p,null,h(E,e=>t("div",{key:e.name},[i(o,{title:e.name,href:e.url,target:"_blank"},{default:r(()=>[i(x,{innerHTML:l(f).render(e.description)},null,8,["innerHTML"])]),_:2},1032,["title","href"])])),64))]),_:1})]))}};export{rt as default};