import{as as L,u as V,ar as P,o as n,c as v,w as a,q as s,F as w,s as k,g as e,d as y,v as c,t as I,j as C,I as N,G as S,E as j,L as T,b1 as q,b2 as $,aj as M,b as r,b3 as z,ai as O,ag as R,f as x,h as g,a as d,b4 as H,i as b,au as U,b0 as A}from"./index-BJ3ql_OM.js";import{_ as F}from"./ErrorNotFoundView.vue_vue_type_script_setup_true_lang-BkgE4EvQ.js";import{V as E,a as G}from"./VTimelineItem-CYH5DmPL.js";import{V as J,b as Q}from"./VCard-CZlPNh1x.js";import{m as W}from"./powerpointFunctions-Bcu0pZ1s.js";import{_ as K}from"./PageSectionTitle.vue_vue_type_script_setup_true_lang-MdwKFcmm.js";import{V as X}from"./VChip-Dqk5BvvI.js";const Y={__name:"ProcedureTimeline",props:["study"],setup(h){const _=L({html:!0}),o=V();function m(t){return o.getDataObjectById(t).label}function p(t){return o.getDataObjectById(t).name}return(t,f)=>{const l=P("router-link");return n(),v(G,{side:"end",class:"ml-6 mt-6"},{default:a(()=>[(n(!0),s(w,null,k(h.study.procedure,(i,D)=>(n(),v(E,{key:D,"dot-color":"blue",size:"medium",width:"100%"},{default:a(()=>[e(J,null,{title:a(()=>[e(l,{class:"text-black",to:`/techniques/${i.technique}`},{default:a(()=>[y(c(m(i.technique)),1)]),_:2},1032,["to"])]),subtitle:a(()=>[e(l,{class:"text-black",to:`/tactics/${i.tactic}`},{default:a(()=>[y(c(p(i.tactic)),1)]),_:2},1032,["to"])]),default:a(()=>[e(Q,{innerHTML:I(_).render(i.description)},null,8,["innerHTML"])]),_:2},1024)]),_:2},1024))),128))]),_:1})}}},Z={__name:"DownloadDataDropdown",props:["study"],setup(h){const _=V(),{study:o}=h,m=[{title:"PowerPoint (.pptx)",icon:"mdi-file-powerpoint-box-outline",function:()=>p()},{title:"Raw data (.yaml)",icon:"mdi-file",function:()=>$({study:o},o.id)}];async function p(){for(const t of o.procedure){const f=await _.getDataObjectById(t.technique);t.techniqueObject=f}W(o),o.procedure.forEach(t=>{delete t.techniqueObject})}return(t,f)=>(n(),v(q,null,{activator:a(({props:l})=>[e(C,N({color:"inherit"},l,{"prepend-icon":"mdi-download","append-icon":"mdi-menu-down"}),{default:a(()=>[y(" Download Data ")]),_:2},1040)]),default:a(()=>[e(S,null,{default:a(()=>[(n(),s(w,null,k(m,(l,i)=>e(j,{key:i,value:i,title:l.title,onClick:l.function},{prepend:a(()=>[e(T,{icon:l.icon,size:"small",style:{"margin-right":"-18px"}},null,8,["icon"])]),_:2},1032,["value","title","onClick"])),64))]),_:1})]),_:1}))}},tt="/assets/nav-layer-icon-0WQ06N0a.png",et=r("img",{width:"35",height:"35",class:"mr-3 ml-0",src:tt},null,-1),at={__name:"NavigatorLayerDropdown",props:["study"],setup(h){const{study:_}=h,o=M(_.id),m=O(o),p=[{title:"View on ATLAS Navigator",icon:"mdi-open-in-new",function:()=>window.open(m,"_blank")},{title:"Download as raw data (.json)",icon:"mdi-arrow-collapse-down",function:()=>z(o)}];return(t,f)=>(n(),v(q,null,{activator:a(({props:l})=>[e(C,N({color:"inherit"},l,{"append-icon":"mdi-menu-down"}),{prepend:a(()=>[et]),default:a(()=>[y(" Navigator Layer ")]),_:2},1040)]),default:a(()=>[e(S,null,{default:a(()=>[(n(),s(w,null,k(p,(l,i)=>e(j,{key:i,value:i,title:l.title,onClick:l.function},{prepend:a(()=>[e(T,{icon:l.icon,size:"small",style:{"margin-right":"-18px"}},null,8,["icon"])]),_:2},1032,["value","title","onClick"])),64))]),_:1})]),_:1}))}},nt={key:0},lt=r("span",null," Incident Date:  ",-1),st={key:0,class:"font-weight-bold"},ot={key:1},it={key:2,class:"font-weight-bold"},rt=r("br",null,null,-1),ct=r("span",null," Actor:  ",-1),ut={key:3,class:"font-weight-bold"},dt=r("span",null," | Target:  ",-1),_t={key:4,class:"font-weight-bold"},mt=r("p",{class:"text-h5 mt-10 ml-6"},"Summary",-1),pt=["innerHTML"],ht=r("br",null,null,-1),ft=r("div",{class:"text-h5 ml-6 text-capitalize"},"Procedure",-1),yt={key:0,class:"ml-6"},vt=r("p",{class:"text-h5 mt-10"},"Sources",-1),gt=["href"],bt={key:1},wt={key:1},Nt={__name:"StudiesIDView",setup(h){const _=L({html:!0}),o=V(),m=R();let{id:p}=m.params;const t=x(()=>o.getDataObjectById(p)),f=x(()=>H(t.value)),l=x(()=>t.value.name),i=[];return(D,kt)=>t.value!=null?(n(),s("div",nt,[e(g,{class:"align-center"},{default:a(()=>[e(K,{pageTitle:l.value},null,8,["pageTitle"]),e(X,{class:"ma-1 ml-3 text-capitalize",color:t.value["case-study-type"]==="exercise"?"blue":"purple","text-color":t.value["case-study-type"]==="exercise"?"blue":"purple",label:"",variant:"outlined","prepend-icon":t.value["case-study-type"]==="exercise"?"mdi-clipboard-file-outline":"mdi-alert-circle-outline"},{default:a(()=>[y(c(t.value["case-study-type"]),1)]),_:1},8,["color","text-color","prepend-icon"])]),_:1}),e(g,{class:"ml-6"},{default:a(()=>[e(b,{cols:"12",sm:"5",md:"7"},{default:a(()=>[lt,t.value["incident-date"]?(n(),s("span",st,c(f.value)+"  ",1)):d("",!0),t.value.reporter?(n(),s("span",ot," | Reporter:  ")):d("",!0),t.value.reporter?(n(),s("span",it,c(t.value.reporter),1)):d("",!0),rt,ct,t.value.actor?(n(),s("span",ut,c(t.value.actor)+"  ",1)):d("",!0),dt,t.value.target?(n(),s("span",_t,c(t.value.target),1)):d("",!0)]),_:1}),e(U),e(b,{class:"text-right"},{default:a(()=>[e(Z,{study:t.value},null,8,["study"])]),_:1})]),_:1}),mt,r("p",{class:"pl-3 ml-6",innerHTML:I(_).render(t.value.summary)},null,8,pt),ht,e(A,{class:"pb-10"}),e(g,{align:"center"},{default:a(()=>[e(b,null,{default:a(()=>[ft]),_:1}),i.includes(t.value.id)?d("",!0):(n(),v(b,{key:0,class:"text-right"},{default:a(()=>[e(at,{study:t.value},null,8,["study"])]),_:1}))]),_:1}),e(g,null,{default:a(()=>[e(Y,{study:t.value},null,8,["study"])]),_:1}),t.value.references&&t.value.references.length>0?(n(),s("div",yt,[vt,(n(!0),s(w,null,k(t.value.references,(u,B)=>(n(),s("div",{key:u.url,class:"pl-3 mb-2"},[r("span",null,c(B+1)+". ",1),u.url&&u.title?(n(),s("a",{key:0,href:u.url,target:"_blank",rel:"noopener noreferrer"},[y(c(u.title||u.url)+" ",1),e(T,{icon:"mdi-open-in-new",size:"small"})],8,gt)):u.title?(n(),s("div",bt,c(u.title),1)):d("",!0)]))),128))])):d("",!0)])):(n(),s("div",wt,[e(F)]))}};export{Nt as default};