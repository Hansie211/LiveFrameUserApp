"use strict";(globalThis["webpackChunklive_frame_webapp"]=globalThis["webpackChunklive_frame_webapp"]||[]).push([[532],{2532:(e,s,t)=>{t.r(s),t.d(s,{default:()=>Q});var o=t(9835),i=t(6970);const r={id:"login-box",class:"flex column q-gutter-y-lg",style:{"max-width":"500px",width:"90%"}},a=(0,o._)("div",{class:"text-h2"},"Sign in",-1),n={id:"login-options",class:"flex column q-gutter-y-md"},l=(0,o._)("span",{class:"q-ml-md text-weight-light"},"Sign in with",-1),c=(0,o._)("div",{id:"spacer",class:"q-mt-xl"},[(0,o._)("hr"),(0,o._)("div",null,[(0,o._)("span",{class:"text-italic text-subtitle1"},"Or")])],-1),u=(0,o._)("div",{class:"q-mt-lg"},[(0,o.Uk)("Don't have an account? "),(0,o._)("span",{class:""},"Register Now!")],-1);function m(e,s,t,m,d,p){const g=(0,o.up)("q-btn"),h=(0,o.up)("user-login-form"),w=(0,o.up)("q-page");return(0,o.wg)(),(0,o.j4)(w,{padding:"",class:"flex column flex-center"},{default:(0,o.w5)((()=>[(0,o._)("div",r,[a,(0,o._)("div",n,[((0,o.wg)(!0),(0,o.iD)(o.HY,null,(0,o.Ko)(e.providers,(s=>((0,o.wg)(),(0,o.j4)(g,{size:"lg",color:"primary",align:"left",icon:"login","no-caps":"",key:s.name,onClick:()=>e.useProvider(s.class)},{default:(0,o.w5)((()=>[l,(0,o.Uk)(" "+(0,i.zw)(s.name),1)])),_:2},1032,["onClick"])))),128)),c,(0,o.Wm)(h,{onSuccess:e.onLogin},null,8,["onSuccess"])])]),u])),_:1})}var d=t(5099),p=t(3830),g=t(1957);const h={style:{position:"relative"}},w={key:0,id:"error-message",class:"text-negative q-mt-none q-mb-md"};function f(e,s,t,r,a,n){const l=(0,o.up)("q-input"),c=(0,o.up)("q-icon"),u=(0,o.up)("q-btn"),m=(0,o.up)("q-form");return(0,o.wg)(),(0,o.iD)("div",h,[(0,o.Wm)(m,{ref:"form",onSubmit:(0,g.iM)(e.onSubmit,["prevent"]),id:"user-login",class:"q-gutter-y-md q-px-md"},{default:(0,o.w5)((()=>[(0,o.Wm)(l,{ref:"emailInput",label:"Email address",autocomplete:"off",hint:"","lazy-rules":"",rules:[e=>!!e||""],modelValue:e.email,"onUpdate:modelValue":s[0]||(s[0]=s=>e.email=s),type:"email"},null,8,["rules","modelValue"]),(0,o.Wm)(l,{label:"Password",type:e.passwordVisible?"text":"password",rules:[e=>!!e||""],modelValue:e.password,"onUpdate:modelValue":s[2]||(s[2]=s=>e.password=s)},{append:(0,o.w5)((()=>[(0,o.Wm)(c,{name:e.passwordVisible?"visibility":"visibility_off",class:"cursor-pointer",onClick:s[1]||(s[1]=s=>e.passwordVisible=!e.passwordVisible)},null,8,["name"])])),_:1},8,["type","rules","modelValue"]),e.errorMessage?((0,o.wg)(),(0,o.iD)("div",w,(0,i.zw)(e.errorMessage),1)):(0,o.kq)("",!0),(0,o.Wm)(u,{label:"Sign in",color:"secondary",class:"full-width",type:"submit"})])),_:1},8,["onSubmit"])])}const b=(0,o.aZ)({emits:["success","error"],setup(){const e=(0,p.K)();return{firebaseStore:e}},data(){return{email:"",password:"",passwordVisible:!1,errorMessage:""}},methods:{onSubmit(){const e=this.email,s=this.password;(0,d.e5)(this.firebaseStore.authentication,e,s).then((e=>{this.$emit("success",e)})).catch((e=>{console.debug(e),this.errorMessage=`Error: ${e.code}`,this.emailInput.focus(),this.password="",this.form.reset(),this.$emit("error",e)}))}},computed:{emailInput(){return this.$refs["emailInput"]},form(){return this.$refs["form"]}}});var v=t(1639),_=t(8326),q=t(4152),y=t(2857),x=t(9379),k=t(9984),S=t.n(k);const V=(0,v.Z)(b,[["render",f],["__scopeId","data-v-301ddc05"]]),Z=V;S()(b,"components",{QForm:_.Z,QInput:q.Z,QIcon:y.Z,QBtn:x.Z});const I=[{name:"Google",class:d.hJ},{name:"Facebook",class:d._O}],$=(0,o.aZ)({components:{UserLoginForm:Z},setup(){const e=(0,p.K)();return{firebaseStore:e,providers:I}},methods:{useProvider(e){const s=new e;s.setCustomParameters({prompt:"select_account"}),this.$q.loading.show({}),setTimeout((()=>{(0,d.rh)(this.firebaseStore.authentication,s).then((()=>{this.onLogin()})).catch((e=>{const s=e.code,t=e.message;console.error(s,t)})).finally((()=>this.$q.loading.hide()))}),800)},onLogin(){this.$router.push({name:"UploadImagePage"})}}});var C=t(9885);const P=(0,v.Z)($,[["render",m]]),Q=P;S()($,"components",{QPage:C.Z,QBtn:x.Z})}}]);