(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[678],{2123:(e,r,t)=>{Promise.resolve().then(t.bind(t,2691))},2691:(e,r,t)=>{"use strict";t.r(r),t.d(r,{default:()=>b});var s=t(5468),a=t(252),n=t(5725),o=t(9184),i=t(3157),l=t(8524),d=t(738),c=t(4217),u=t(6947),m=t(201),f=t(605),x=t(2628),h=t(194),p=t(9119),g=t(3486);function b(){let e=(0,a.mN)({resolver:(0,n.u)(f.zK),defaultValues:{email:"",password:""}}),{register:r,isPending:t}=function(e){let{setFormError:r}=e,t=(0,u.jE)(),s=(0,m.useRouter)(),a=(0,h.j)({mutationFn:async(e,r)=>{let t=await (0,g.X)("".concat(x.F.baseUrl,"/auth/register"),{method:"POST",body:JSON.stringify(r),headers:{"Content-Type":"application/json"},csrf:e});if(!t.ok)throw Error("error registering user");let s=await t.json();return f.WY.parse(s)},onSuccess:e=>{t.setQueryData([p.A],e.csrf),t.setQueriesData({queryKey:["me"]},e.account),s.push("/")},onError:()=>{r("email",{message:"woah"})}});return{...a,register:a.mutate}}({setFormError:e.setError});return(0,s.jsx)("div",{className:"flex items-center justify-center",children:(0,s.jsxs)(d.Zp,{className:"w-full max-w-md",children:[(0,s.jsxs)(d.aR,{children:[(0,s.jsx)(d.ZB,{className:"text-2xl font-bold",children:"LifeOS"}),(0,s.jsx)(d.BT,{children:"Create your account to get started"})]}),(0,s.jsx)(d.Wu,{children:(0,s.jsx)(i.lV,{...e,children:(0,s.jsxs)("form",{onSubmit:e.handleSubmit(e=>{r(e)}),className:"space-y-6",children:[(0,s.jsx)(i.zB,{control:e.control,name:"email",render:e=>{let{field:r}=e;return(0,s.jsxs)(i.eI,{children:[(0,s.jsx)(i.lR,{children:"Email"}),(0,s.jsx)(i.MJ,{children:(0,s.jsx)(l.p,{placeholder:"Enter your email",...r})}),(0,s.jsx)(i.C5,{})]})}}),(0,s.jsx)(i.zB,{control:e.control,name:"password",render:e=>{let{field:r}=e;return(0,s.jsxs)(i.eI,{children:[(0,s.jsx)(i.lR,{children:"Password"}),(0,s.jsx)(i.MJ,{children:(0,s.jsx)(l.p,{type:"password",placeholder:"Create a password",...r})}),(0,s.jsx)(i.C5,{})]})}}),(0,s.jsxs)(o.$,{type:"submit",className:"w-full",disabled:t,children:[t&&(0,s.jsx)(c.y,{className:"mr-2 h-4 w-4 animate-spin"}),"Sign Up"]})]})})}),(0,s.jsx)(d.wL,{className:"flex justify-center",children:(0,s.jsxs)("p",{className:"text-sm text-gray-600",children:["Already have an account?"," ",(0,s.jsx)("a",{href:"#",className:"font-medium text-primary hover:underline",children:"Sign in"})]})})]})})}},4217:(e,r,t)=>{"use strict";t.d(r,{y:()=>a});var s=t(5468);let a=e=>(0,s.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",...e,children:(0,s.jsx)("path",{d:"M21 12a9 9 0 1 1-6.219-8.56"})})},9119:(e,r,t)=>{"use strict";t.d(r,{A:()=>o,U:()=>l});var s=t(9774),a=t(605),n=t(2628);let o=Symbol("CSRF_QUERY_KEY");async function i(){let e=await fetch("".concat(n.F.baseUrl,"/auth/csrf"),{method:"GET",headers:{"X-CSRF-Token":"fetch"},credentials:"include"});if(!e.ok)throw Error("csrf fetch failed");let r=await e.json();return a.UB.parse(r)}function l(){let{retry:e=!1,...r}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=(0,s.I)({...r,retry:e,queryKey:[o],queryFn:async()=>(await i()).token}),a=async()=>{let e=await t.refetch();if("string"!=typeof e.data)throw Error("CSRF token could not refresh");return e.data};return{...t,refresh:a}}},3486:(e,r,t)=>{"use strict";function s(e,r){let{csrf:t,...s}=r;return fetch(e,{...s,headers:{...null==s?void 0:s.headers,"X-Csrf-Token":t},credentials:"same-origin"})}t.d(r,{X:()=>s})},194:(e,r,t)=>{"use strict";t.d(r,{j:()=>n});var s=t(5979),a=t(9119);function n(e){let{mutationFn:r,...t}=e,{data:n}=(0,a.U)();return(0,s.n)({...t,mutationFn:e=>{if(!n)throw Error("no csrf token for mutation");return r(n,e)}})}},2628:(e,r,t)=>{"use strict";t.d(r,{F:()=>a});var s=t(6127);let a=s.z.object({baseUrl:s.z.string().url()}).parse({baseUrl:"http://localhost:3001"})},9184:(e,r,t)=>{"use strict";t.d(r,{$:()=>d});var s=t(5468),a=t(8784),n=t(8849),o=t(4793),i=t(9183);let l=(0,o.F)("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",{variants:{variant:{default:"bg-primary text-primary-foreground hover:bg-primary/90",destructive:"bg-destructive text-destructive-foreground hover:bg-destructive/90",outline:"border border-input bg-background hover:bg-accent hover:text-accent-foreground",secondary:"bg-secondary text-secondary-foreground hover:bg-secondary/80",ghost:"hover:bg-accent hover:text-accent-foreground",link:"text-primary underline-offset-4 hover:underline"},size:{default:"h-10 px-4 py-2",sm:"h-9 rounded-md px-3",lg:"h-11 rounded-md px-8",icon:"h-10 w-10"}},defaultVariants:{variant:"default",size:"default"}}),d=a.forwardRef((e,r)=>{let{className:t,variant:a,size:o,asChild:d=!1,...c}=e,u=d?n.DX:"button";return(0,s.jsx)(u,{className:(0,i.cn)(l({variant:a,size:o,className:t})),ref:r,...c})});d.displayName="Button"},738:(e,r,t)=>{"use strict";t.d(r,{BT:()=>d,Wu:()=>c,ZB:()=>l,Zp:()=>o,aR:()=>i,wL:()=>u});var s=t(5468),a=t(8784),n=t(9183);let o=a.forwardRef((e,r)=>{let{className:t,...a}=e;return(0,s.jsx)("div",{ref:r,className:(0,n.cn)("rounded-lg border bg-card text-card-foreground shadow-sm",t),...a})});o.displayName="Card";let i=a.forwardRef((e,r)=>{let{className:t,...a}=e;return(0,s.jsx)("div",{ref:r,className:(0,n.cn)("flex flex-col space-y-1.5 p-6",t),...a})});i.displayName="CardHeader";let l=a.forwardRef((e,r)=>{let{className:t,...a}=e;return(0,s.jsx)("div",{ref:r,className:(0,n.cn)("text-2xl font-semibold leading-none tracking-tight",t),...a})});l.displayName="CardTitle";let d=a.forwardRef((e,r)=>{let{className:t,...a}=e;return(0,s.jsx)("div",{ref:r,className:(0,n.cn)("text-sm text-muted-foreground",t),...a})});d.displayName="CardDescription";let c=a.forwardRef((e,r)=>{let{className:t,...a}=e;return(0,s.jsx)("div",{ref:r,className:(0,n.cn)("p-6 pt-0",t),...a})});c.displayName="CardContent";let u=a.forwardRef((e,r)=>{let{className:t,...a}=e;return(0,s.jsx)("div",{ref:r,className:(0,n.cn)("flex items-center p-6 pt-0",t),...a})});u.displayName="CardFooter"},3157:(e,r,t)=>{"use strict";t.d(r,{lV:()=>u,MJ:()=>b,Rr:()=>v,zB:()=>f,eI:()=>p,lR:()=>g,C5:()=>w});var s=t(5468),a=t(8784),n=t(8849),o=t(252),i=t(9183),l=t(3073);let d=(0,t(4793).F)("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"),c=a.forwardRef((e,r)=>{let{className:t,...a}=e;return(0,s.jsx)(l.b,{ref:r,className:(0,i.cn)(d(),t),...a})});c.displayName=l.b.displayName;let u=o.Op,m=a.createContext({}),f=e=>{let{...r}=e;return(0,s.jsx)(m.Provider,{value:{name:r.name},children:(0,s.jsx)(o.xI,{...r})})},x=()=>{let e=a.useContext(m),r=a.useContext(h),{getFieldState:t,formState:s}=(0,o.xW)(),n=t(e.name,s);if(!e)throw Error("useFormField should be used within <FormField>");let{id:i}=r;return{id:i,name:e.name,formItemId:"".concat(i,"-form-item"),formDescriptionId:"".concat(i,"-form-item-description"),formMessageId:"".concat(i,"-form-item-message"),...n}},h=a.createContext({}),p=a.forwardRef((e,r)=>{let{className:t,...n}=e,o=a.useId();return(0,s.jsx)(h.Provider,{value:{id:o},children:(0,s.jsx)("div",{ref:r,className:(0,i.cn)("space-y-2",t),...n})})});p.displayName="FormItem";let g=a.forwardRef((e,r)=>{let{className:t,...a}=e,{error:n,formItemId:o}=x();return(0,s.jsx)(c,{ref:r,className:(0,i.cn)(n&&"text-destructive",t),htmlFor:o,...a})});g.displayName="FormLabel";let b=a.forwardRef((e,r)=>{let{...t}=e,{error:a,formItemId:o,formDescriptionId:i,formMessageId:l}=x();return(0,s.jsx)(n.DX,{ref:r,id:o,"aria-describedby":a?"".concat(i," ").concat(l):"".concat(i),"aria-invalid":!!a,...t})});b.displayName="FormControl";let v=a.forwardRef((e,r)=>{let{className:t,...a}=e,{formDescriptionId:n}=x();return(0,s.jsx)("p",{ref:r,id:n,className:(0,i.cn)("text-sm text-muted-foreground",t),...a})});v.displayName="FormDescription";let w=a.forwardRef((e,r)=>{let{className:t,children:a,...n}=e,{error:o,formMessageId:l}=x(),d=o?String(null==o?void 0:o.message):a;return d?(0,s.jsx)("p",{ref:r,id:l,className:(0,i.cn)("text-sm font-medium text-destructive",t),...n,children:d}):null});w.displayName="FormMessage"},8524:(e,r,t)=>{"use strict";t.d(r,{p:()=>o});var s=t(5468),a=t(8784),n=t(9183);let o=a.forwardRef((e,r)=>{let{className:t,type:a,...o}=e;return(0,s.jsx)("input",{type:a,className:(0,n.cn)("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",t),ref:r,...o})});o.displayName="Input"},9183:(e,r,t)=>{"use strict";t.d(r,{cn:()=>n});var s=t(161),a=t(7234);function n(){for(var e=arguments.length,r=Array(e),t=0;t<e;t++)r[t]=arguments[t];return(0,a.QP)((0,s.$)(r))}},605:(e,r,t)=>{"use strict";t.d(r,{UB:()=>o,WY:()=>l,zK:()=>a,aE:()=>n});var s=t(6127);let a=s.z.object({email:s.z.string().email("Email must be a valid email address"),password:s.z.string().min(6,"Password must be at least 6 characters long").regex(/[a-z]/,"Password must have at least one lowercase letter").regex(/[A-Z]/,"Password must have at least one capital letter").regex(/[0-9]/,"Password must have at least one number").regex(/[\W_]/,"Password must have at least one symbol")}),n=s.z.object({email:s.z.string().email("Email must be a valid email address"),password:s.z.string().min(6,"Password must be at least 6 characters long").regex(/[a-z]/,"Password must have at least one lowercase letter").regex(/[A-Z]/,"Password must have at least one capital letter").regex(/[0-9]/,"Password must have at least one number").regex(/[\W_]/,"Password must have at least one symbol"),rememberMe:s.z.boolean()}),o=s.z.object({token:s.z.string()}),i=s.z.object({id:s.z.string(),isEmailVerified:s.z.boolean()});s.z.array(i);let l=s.z.object({account:i,csrf:o})}},e=>{var r=r=>e(e.s=r);e.O(0,[698,280,85,867,143,358],()=>r(2123)),_N_E=e.O()}]);