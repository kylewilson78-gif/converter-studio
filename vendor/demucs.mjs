var oy=Object.defineProperty;var wt=(e=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(e,{get:(t,i)=>(typeof require<"u"?require:t)[i]}):e)(function(e){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+e+'" is not supported')});var uy=(e,t)=>{for(var i in t)oy(e,i,{get:t[i],enumerable:!0})};var Mf={};uy(Mf,{InferenceSession:()=>Ma,TRACE:()=>dr,TRACE_FUNC_BEGIN:()=>Qe,TRACE_FUNC_END:()=>Le,Tensor:()=>Ke,default:()=>E0,env:()=>_e,registerBackend:()=>It});var Ra=Object.defineProperty,ly=Object.getOwnPropertyDescriptor,dy=Object.getOwnPropertyNames,py=Object.prototype.hasOwnProperty,cy=(e=>typeof wt<"u"?wt:typeof Proxy<"u"?new Proxy(e,{get:(t,i)=>(typeof wt<"u"?wt:t)[i]}):e)(function(e){if(typeof wt<"u")return wt.apply(this,arguments);throw Error('Dynamic require of "'+e+'" is not supported')}),L=(e,t)=>()=>(e&&(t=e(e=0)),t),cr=(e,t)=>{for(var i in t)Ra(e,i,{get:t[i],enumerable:!0})},hy=(e,t,i,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let a of dy(t))!py.call(e,a)&&a!==i&&Ra(e,a,{get:()=>t[a],enumerable:!(r=ly(t,a))||r.enumerable});return e},qr=e=>hy(Ra({},"__esModule",{value:!0}),e),Zt,ct,It,$o,Jd,ep=L(()=>{"use strict";Zt=new Map,ct=[],It=(e,t,i)=>{if(t&&typeof t.init=="function"&&typeof t.createInferenceSessionHandler=="function"){let r=Zt.get(e);if(r===void 0)Zt.set(e,{backend:t,priority:i});else{if(r.priority>i)return;if(r.priority===i&&r.backend!==t)throw new Error(`cannot register backend "${e}" using priority ${i}`)}if(i>=0){let a=ct.indexOf(e);a!==-1&&ct.splice(a,1);for(let o=0;o<ct.length;o++)if(Zt.get(ct[o]).priority<=i){ct.splice(o,0,e);return}ct.push(e)}return}throw new TypeError("not a valid backend")},$o=async e=>{let t=Zt.get(e);if(!t)return"backend not found.";if(t.initialized)return t.backend;if(t.aborted)return t.error;{let i=!!t.initPromise;try{return i||(t.initPromise=t.backend.init(e)),await t.initPromise,t.initialized=!0,t.backend}catch(r){return i||(t.error=`${r}`,t.aborted=!0),t.error}finally{delete t.initPromise}}},Jd=async e=>{let t=e.executionProviders||[],i=t.map(d=>typeof d=="string"?d:d.name),r=i.length===0?ct:i,a,o=[],s=new Set;for(let d of r){let p=await $o(d);typeof p=="string"?o.push({name:d,err:p}):(a||(a=p),a===p&&s.add(d))}if(!a)throw new Error(`no available backend found. ERR: ${o.map(d=>`[${d.name}] ${d.err}`).join(", ")}`);for(let{name:d,err:p}of o)i.includes(d)&&console.warn(`removing requested execution provider "${d}" from session options because it is not available: ${p}`);let l=t.filter(d=>s.has(typeof d=="string"?d:d.name));return[a,new Proxy(e,{get:(d,p)=>p==="executionProviders"?l:Reflect.get(d,p)})]}}),fy=L(()=>{"use strict";ep()}),tp,my=L(()=>{"use strict";tp="1.21.0"}),Si,qe,rp=L(()=>{"use strict";my(),Si="warning",qe={wasm:{},webgl:{},webgpu:{},versions:{common:tp},set logLevel(e){if(e!==void 0){if(typeof e!="string"||["verbose","info","warning","error","fatal"].indexOf(e)===-1)throw new Error(`Unsupported logging level: ${e}`);Si=e}},get logLevel(){return Si}},Object.defineProperty(qe,"logLevel",{enumerable:!0})}),_e,gy=L(()=>{"use strict";rp(),_e=qe}),ip,ap,yy=L(()=>{"use strict";ip=(e,t)=>{let i=typeof document<"u"?document.createElement("canvas"):new OffscreenCanvas(1,1);i.width=e.dims[3],i.height=e.dims[2];let r=i.getContext("2d");if(r!=null){let a,o;t?.tensorLayout!==void 0&&t.tensorLayout==="NHWC"?(a=e.dims[2],o=e.dims[3]):(a=e.dims[3],o=e.dims[2]);let s=t?.format!==void 0?t.format:"RGB",l=t?.norm,d,p;l===void 0||l.mean===void 0?d=[255,255,255,255]:typeof l.mean=="number"?d=[l.mean,l.mean,l.mean,l.mean]:(d=[l.mean[0],l.mean[1],l.mean[2],0],l.mean[3]!==void 0&&(d[3]=l.mean[3])),l===void 0||l.bias===void 0?p=[0,0,0,0]:typeof l.bias=="number"?p=[l.bias,l.bias,l.bias,l.bias]:(p=[l.bias[0],l.bias[1],l.bias[2],0],l.bias[3]!==void 0&&(p[3]=l.bias[3]));let f=o*a,m=0,g=f,w=f*2,_=-1;s==="RGBA"?(m=0,g=f,w=f*2,_=f*3):s==="RGB"?(m=0,g=f,w=f*2):s==="RBG"&&(m=0,w=f,g=f*2);for(let $=0;$<o;$++)for(let x=0;x<a;x++){let v=(e.data[m++]-p[0])*d[0],b=(e.data[g++]-p[1])*d[1],k=(e.data[w++]-p[2])*d[2],T=_===-1?255:(e.data[_++]-p[3])*d[3];r.fillStyle="rgba("+v+","+b+","+k+","+T+")",r.fillRect(x,$,1,1)}if("toDataURL"in i)return i.toDataURL();throw new Error("toDataURL is not supported")}else throw new Error("Can not access image data")},ap=(e,t)=>{let i=typeof document<"u"?document.createElement("canvas").getContext("2d"):new OffscreenCanvas(1,1).getContext("2d"),r;if(i!=null){let a,o,s;t?.tensorLayout!==void 0&&t.tensorLayout==="NHWC"?(a=e.dims[2],o=e.dims[1],s=e.dims[3]):(a=e.dims[3],o=e.dims[2],s=e.dims[1]);let l=t!==void 0&&t.format!==void 0?t.format:"RGB",d=t?.norm,p,f;d===void 0||d.mean===void 0?p=[255,255,255,255]:typeof d.mean=="number"?p=[d.mean,d.mean,d.mean,d.mean]:(p=[d.mean[0],d.mean[1],d.mean[2],255],d.mean[3]!==void 0&&(p[3]=d.mean[3])),d===void 0||d.bias===void 0?f=[0,0,0,0]:typeof d.bias=="number"?f=[d.bias,d.bias,d.bias,d.bias]:(f=[d.bias[0],d.bias[1],d.bias[2],0],d.bias[3]!==void 0&&(f[3]=d.bias[3]));let m=o*a;if(t!==void 0&&(t.format!==void 0&&s===4&&t.format!=="RGBA"||s===3&&t.format!=="RGB"&&t.format!=="BGR"))throw new Error("Tensor format doesn't match input tensor dims");let g=4,w=0,_=1,$=2,x=3,v=0,b=m,k=m*2,T=-1;l==="RGBA"?(v=0,b=m,k=m*2,T=m*3):l==="RGB"?(v=0,b=m,k=m*2):l==="RBG"&&(v=0,k=m,b=m*2),r=i.createImageData(a,o);for(let C=0;C<o*a;w+=g,_+=g,$+=g,x+=g,C++)r.data[w]=(e.data[v++]-f[0])*p[0],r.data[_]=(e.data[b++]-f[1])*p[1],r.data[$]=(e.data[k++]-f[2])*p[2],r.data[x]=T===-1?255:(e.data[T++]-f[3])*p[3]}else throw new Error("Can not access image data");return r}}),kr,np,sp,op,up,lp,_y=L(()=>{"use strict";Ba(),kr=(e,t)=>{if(e===void 0)throw new Error("Image buffer must be defined");if(t.height===void 0||t.width===void 0)throw new Error("Image height and width must be defined");if(t.tensorLayout==="NHWC")throw new Error("NHWC Tensor layout is not supported yet");let{height:i,width:r}=t,a=t.norm??{mean:255,bias:0},o,s;typeof a.mean=="number"?o=[a.mean,a.mean,a.mean,a.mean]:o=[a.mean[0],a.mean[1],a.mean[2],a.mean[3]??255],typeof a.bias=="number"?s=[a.bias,a.bias,a.bias,a.bias]:s=[a.bias[0],a.bias[1],a.bias[2],a.bias[3]??0];let l=t.format!==void 0?t.format:"RGBA",d=t.tensorFormat!==void 0&&t.tensorFormat!==void 0?t.tensorFormat:"RGB",p=i*r,f=d==="RGBA"?new Float32Array(p*4):new Float32Array(p*3),m=4,g=0,w=1,_=2,$=3,x=0,v=p,b=p*2,k=-1;l==="RGB"&&(m=3,g=0,w=1,_=2,$=-1),d==="RGBA"?k=p*3:d==="RBG"?(x=0,b=p,v=p*2):d==="BGR"&&(b=0,v=p,x=p*2);for(let T=0;T<p;T++,g+=m,_+=m,w+=m,$+=m)f[x++]=(e[g]+s[0])/o[0],f[v++]=(e[w]+s[1])/o[1],f[b++]=(e[_]+s[2])/o[2],k!==-1&&$!==-1&&(f[k++]=(e[$]+s[3])/o[3]);return d==="RGBA"?new Ne("float32",f,[1,4,i,r]):new Ne("float32",f,[1,3,i,r])},np=async(e,t)=>{let i=typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement,r=typeof ImageData<"u"&&e instanceof ImageData,a=typeof ImageBitmap<"u"&&e instanceof ImageBitmap,o=typeof e=="string",s,l=t??{},d=()=>{if(typeof document<"u")return document.createElement("canvas");if(typeof OffscreenCanvas<"u")return new OffscreenCanvas(1,1);throw new Error("Canvas is not supported")},p=f=>typeof HTMLCanvasElement<"u"&&f instanceof HTMLCanvasElement||f instanceof OffscreenCanvas?f.getContext("2d"):null;if(i){let f=d();f.width=e.width,f.height=e.height;let m=p(f);if(m!=null){let g=e.height,w=e.width;if(t!==void 0&&t.resizedHeight!==void 0&&t.resizedWidth!==void 0&&(g=t.resizedHeight,w=t.resizedWidth),t!==void 0){if(l=t,t.tensorFormat!==void 0)throw new Error("Image input config format must be RGBA for HTMLImageElement");l.tensorFormat="RGBA",l.height=g,l.width=w}else l.tensorFormat="RGBA",l.height=g,l.width=w;m.drawImage(e,0,0),s=m.getImageData(0,0,w,g).data}else throw new Error("Can not access image data")}else if(r){let f,m;if(t!==void 0&&t.resizedWidth!==void 0&&t.resizedHeight!==void 0?(f=t.resizedHeight,m=t.resizedWidth):(f=e.height,m=e.width),t!==void 0&&(l=t),l.format="RGBA",l.height=f,l.width=m,t!==void 0){let g=d();g.width=m,g.height=f;let w=p(g);if(w!=null)w.putImageData(e,0,0),s=w.getImageData(0,0,m,f).data;else throw new Error("Can not access image data")}else s=e.data}else if(a){if(t===void 0)throw new Error("Please provide image config with format for Imagebitmap");let f=d();f.width=e.width,f.height=e.height;let m=p(f);if(m!=null){let g=e.height,w=e.width;return m.drawImage(e,0,0,w,g),s=m.getImageData(0,0,w,g).data,l.height=g,l.width=w,kr(s,l)}else throw new Error("Can not access image data")}else{if(o)return new Promise((f,m)=>{let g=d(),w=p(g);if(!e||!w)return m();let _=new Image;_.crossOrigin="Anonymous",_.src=e,_.onload=()=>{g.width=_.width,g.height=_.height,w.drawImage(_,0,0,g.width,g.height);let $=w.getImageData(0,0,g.width,g.height);l.height=g.height,l.width=g.width,f(kr($.data,l))}});throw new Error("Input data provided is not supported - aborted tensor creation")}if(s!==void 0)return kr(s,l);throw new Error("Input data provided is not supported - aborted tensor creation")},sp=(e,t)=>{let{width:i,height:r,download:a,dispose:o}=t,s=[1,r,i,4];return new Ne({location:"texture",type:"float32",texture:e,dims:s,download:a,dispose:o})},op=(e,t)=>{let{dataType:i,dims:r,download:a,dispose:o}=t;return new Ne({location:"gpu-buffer",type:i??"float32",gpuBuffer:e,dims:r,download:a,dispose:o})},up=(e,t)=>{let{dataType:i,dims:r,download:a,dispose:o}=t;return new Ne({location:"ml-tensor",type:i??"float32",mlTensor:e,dims:r,download:a,dispose:o})},lp=(e,t,i)=>new Ne({location:"cpu-pinned",type:e,data:t,dims:i??[t.length]})}),St,nr,ki,dp,wy=L(()=>{"use strict";St=new Map([["float32",Float32Array],["uint8",Uint8Array],["int8",Int8Array],["uint16",Uint16Array],["int16",Int16Array],["int32",Int32Array],["bool",Uint8Array],["float64",Float64Array],["uint32",Uint32Array],["int4",Uint8Array],["uint4",Uint8Array]]),nr=new Map([[Float32Array,"float32"],[Uint8Array,"uint8"],[Int8Array,"int8"],[Uint16Array,"uint16"],[Int16Array,"int16"],[Int32Array,"int32"],[Float64Array,"float64"],[Uint32Array,"uint32"]]),ki=!1,dp=()=>{if(!ki){ki=!0;let e=typeof BigInt64Array<"u"&&BigInt64Array.from,t=typeof BigUint64Array<"u"&&BigUint64Array.from,i=globalThis.Float16Array,r=typeof i<"u"&&i.from;e&&(St.set("int64",BigInt64Array),nr.set(BigInt64Array,"int64")),t&&(St.set("uint64",BigUint64Array),nr.set(BigUint64Array,"uint64")),r?(St.set("float16",i),nr.set(i,"float16")):St.set("float16",Uint16Array)}}}),pp,cp,by=L(()=>{"use strict";Ba(),pp=e=>{let t=1;for(let i=0;i<e.length;i++){let r=e[i];if(typeof r!="number"||!Number.isSafeInteger(r))throw new TypeError(`dims[${i}] must be an integer, got: ${r}`);if(r<0)throw new RangeError(`dims[${i}] must be a non-negative integer, got: ${r}`);t*=r}return t},cp=(e,t)=>{switch(e.location){case"cpu":return new Ne(e.type,e.data,t);case"cpu-pinned":return new Ne({location:"cpu-pinned",data:e.data,type:e.type,dims:t});case"texture":return new Ne({location:"texture",texture:e.texture,type:e.type,dims:t});case"gpu-buffer":return new Ne({location:"gpu-buffer",gpuBuffer:e.gpuBuffer,type:e.type,dims:t});case"ml-tensor":return new Ne({location:"ml-tensor",mlTensor:e.mlTensor,type:e.type,dims:t});default:throw new Error(`tensorReshape: tensor location ${e.location} is not supported`)}}}),Ne,Ba=L(()=>{"use strict";yy(),_y(),wy(),by(),Ne=class{constructor(e,t,i){dp();let r,a;if(typeof e=="object"&&"location"in e)switch(this.dataLocation=e.location,r=e.type,a=e.dims,e.location){case"cpu-pinned":{let s=St.get(r);if(!s)throw new TypeError(`unsupported type "${r}" to create tensor from pinned buffer`);if(!(e.data instanceof s))throw new TypeError(`buffer should be of type ${s.name}`);this.cpuData=e.data;break}case"texture":{if(r!=="float32")throw new TypeError(`unsupported type "${r}" to create tensor from texture`);this.gpuTextureData=e.texture,this.downloader=e.download,this.disposer=e.dispose;break}case"gpu-buffer":{if(r!=="float32"&&r!=="float16"&&r!=="int32"&&r!=="int64"&&r!=="uint32"&&r!=="uint8"&&r!=="bool"&&r!=="uint4"&&r!=="int4")throw new TypeError(`unsupported type "${r}" to create tensor from gpu buffer`);this.gpuBufferData=e.gpuBuffer,this.downloader=e.download,this.disposer=e.dispose;break}case"ml-tensor":{if(r!=="float32"&&r!=="float16"&&r!=="int32"&&r!=="int64"&&r!=="uint32"&&r!=="uint64"&&r!=="int8"&&r!=="uint8"&&r!=="bool"&&r!=="uint4"&&r!=="int4")throw new TypeError(`unsupported type "${r}" to create tensor from MLTensor`);this.mlTensorData=e.mlTensor,this.downloader=e.download,this.disposer=e.dispose;break}default:throw new Error(`Tensor constructor: unsupported location '${this.dataLocation}'`)}else{let s,l;if(typeof e=="string")if(r=e,l=i,e==="string"){if(!Array.isArray(t))throw new TypeError("A string tensor's data must be a string array.");s=t}else{let d=St.get(e);if(d===void 0)throw new TypeError(`Unsupported tensor type: ${e}.`);if(Array.isArray(t)){if(e==="float16"&&d===Uint16Array||e==="uint4"||e==="int4")throw new TypeError(`Creating a ${e} tensor from number array is not supported. Please use ${d.name} as data.`);e==="uint64"||e==="int64"?s=d.from(t,BigInt):s=d.from(t)}else if(t instanceof d)s=t;else if(t instanceof Uint8ClampedArray)if(e==="uint8")s=Uint8Array.from(t);else throw new TypeError("A Uint8ClampedArray tensor's data must be type of uint8");else if(e==="float16"&&t instanceof Uint16Array&&d!==Uint16Array)s=new globalThis.Float16Array(t.buffer,t.byteOffset,t.length);else throw new TypeError(`A ${r} tensor's data must be type of ${d}`)}else if(l=t,Array.isArray(e)){if(e.length===0)throw new TypeError("Tensor type cannot be inferred from an empty array.");let d=typeof e[0];if(d==="string")r="string",s=e;else if(d==="boolean")r="bool",s=Uint8Array.from(e);else throw new TypeError(`Invalid element type of data array: ${d}.`)}else if(e instanceof Uint8ClampedArray)r="uint8",s=Uint8Array.from(e);else{let d=nr.get(e.constructor);if(d===void 0)throw new TypeError(`Unsupported type for tensor data: ${e.constructor}.`);r=d,s=e}if(l===void 0)l=[s.length];else if(!Array.isArray(l))throw new TypeError("A tensor's dims must be a number array");a=l,this.cpuData=s,this.dataLocation="cpu"}let o=pp(a);if(this.cpuData&&o!==this.cpuData.length&&!((r==="uint4"||r==="int4")&&Math.ceil(o/2)===this.cpuData.length))throw new Error(`Tensor's size(${o}) does not match data length(${this.cpuData.length}).`);this.type=r,this.dims=a,this.size=o}static async fromImage(e,t){return np(e,t)}static fromTexture(e,t){return sp(e,t)}static fromGpuBuffer(e,t){return op(e,t)}static fromMLTensor(e,t){return up(e,t)}static fromPinnedBuffer(e,t,i){return lp(e,t,i)}toDataURL(e){return ip(this,e)}toImageData(e){return ap(this,e)}get data(){if(this.ensureValid(),!this.cpuData)throw new Error("The data is not on CPU. Use `getData()` to download GPU data to CPU, or use `texture` or `gpuBuffer` property to access the GPU data directly.");return this.cpuData}get location(){return this.dataLocation}get texture(){if(this.ensureValid(),!this.gpuTextureData)throw new Error("The data is not stored as a WebGL texture.");return this.gpuTextureData}get gpuBuffer(){if(this.ensureValid(),!this.gpuBufferData)throw new Error("The data is not stored as a WebGPU buffer.");return this.gpuBufferData}get mlTensor(){if(this.ensureValid(),!this.mlTensorData)throw new Error("The data is not stored as a WebNN MLTensor.");return this.mlTensorData}async getData(e){switch(this.ensureValid(),this.dataLocation){case"cpu":case"cpu-pinned":return this.data;case"texture":case"gpu-buffer":case"ml-tensor":{if(!this.downloader)throw new Error("The current tensor is not created with a specified data downloader.");if(this.isDownloading)throw new Error("The current tensor is being downloaded.");try{this.isDownloading=!0;let t=await this.downloader();return this.downloader=void 0,this.dataLocation="cpu",this.cpuData=t,e&&this.disposer&&(this.disposer(),this.disposer=void 0),t}finally{this.isDownloading=!1}}default:throw new Error(`cannot get data from location: ${this.dataLocation}`)}}dispose(){if(this.isDownloading)throw new Error("The current tensor is being downloaded.");this.disposer&&(this.disposer(),this.disposer=void 0),this.cpuData=void 0,this.gpuTextureData=void 0,this.gpuBufferData=void 0,this.mlTensorData=void 0,this.downloader=void 0,this.isDownloading=void 0,this.dataLocation="none"}ensureValid(){if(this.dataLocation==="none")throw new Error("The tensor is disposed.")}reshape(e){if(this.ensureValid(),this.downloader||this.disposer)throw new Error("Cannot reshape a tensor that owns GPU resource.");return cp(this,e)}}}),Ke,hp=L(()=>{"use strict";Ba(),Ke=Ne}),dr,Ti,Qe,Le,fp=L(()=>{"use strict";rp(),dr=(e,t)=>{(typeof qe.trace>"u"?!qe.wasm.trace:!qe.trace)||console.timeStamp(`${e}::ORT::${t}`)},Ti=(e,t)=>{let i=new Error().stack?.split(/\r\n|\r|\n/g)||[],r=!1;for(let a=0;a<i.length;a++){if(r&&!i[a].includes("TRACE_FUNC")){let o=`FUNC_${e}::${i[a].trim().split(" ")[1]}`;t&&(o+=`::${t}`),dr("CPU",o);return}i[a].includes("TRACE_FUNC")&&(r=!0)}},Qe=e=>{(typeof qe.trace>"u"?!qe.wasm.trace:!qe.trace)||Ti("BEGIN",e)},Le=e=>{(typeof qe.trace>"u"?!qe.wasm.trace:!qe.trace)||Ti("END",e)}}),mp,$y=L(()=>{"use strict";ep(),hp(),fp(),mp=class gp{constructor(t){this.handler=t}async run(t,i,r){Qe();let a={},o={};if(typeof t!="object"||t===null||t instanceof Ke||Array.isArray(t))throw new TypeError("'feeds' must be an object that use input names as keys and OnnxValue as corresponding values.");let s=!0;if(typeof i=="object"){if(i===null)throw new TypeError("Unexpected argument[1]: cannot be null.");if(i instanceof Ke)throw new TypeError("'fetches' cannot be a Tensor");if(Array.isArray(i)){if(i.length===0)throw new TypeError("'fetches' cannot be an empty array.");s=!1;for(let p of i){if(typeof p!="string")throw new TypeError("'fetches' must be a string array or an object.");if(this.outputNames.indexOf(p)===-1)throw new RangeError(`'fetches' contains invalid output name: ${p}.`);a[p]=null}if(typeof r=="object"&&r!==null)o=r;else if(typeof r<"u")throw new TypeError("'options' must be an object.")}else{let p=!1,f=Object.getOwnPropertyNames(i);for(let m of this.outputNames)if(f.indexOf(m)!==-1){let g=i[m];(g===null||g instanceof Ke)&&(p=!0,s=!1,a[m]=g)}if(p){if(typeof r=="object"&&r!==null)o=r;else if(typeof r<"u")throw new TypeError("'options' must be an object.")}else o=i}}else if(typeof i<"u")throw new TypeError("Unexpected argument[1]: must be 'fetches' or 'options'.");for(let p of this.inputNames)if(typeof t[p]>"u")throw new Error(`input '${p}' is missing in 'feeds'.`);if(s)for(let p of this.outputNames)a[p]=null;let l=await this.handler.run(t,a,o),d={};for(let p in l)if(Object.hasOwnProperty.call(l,p)){let f=l[p];f instanceof Ke?d[p]=f:d[p]=new Ke(f.type,f.data,f.dims)}return Le(),d}async release(){return this.handler.dispose()}static async create(t,i,r,a){Qe();let o,s={};if(typeof t=="string"){if(o=t,typeof i=="object"&&i!==null)s=i;else if(typeof i<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof Uint8Array){if(o=t,typeof i=="object"&&i!==null)s=i;else if(typeof i<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof ArrayBuffer||typeof SharedArrayBuffer<"u"&&t instanceof SharedArrayBuffer){let f=t,m=0,g=t.byteLength;if(typeof i=="object"&&i!==null)s=i;else if(typeof i=="number"){if(m=i,!Number.isSafeInteger(m))throw new RangeError("'byteOffset' must be an integer.");if(m<0||m>=f.byteLength)throw new RangeError(`'byteOffset' is out of range [0, ${f.byteLength}).`);if(g=t.byteLength-m,typeof r=="number"){if(g=r,!Number.isSafeInteger(g))throw new RangeError("'byteLength' must be an integer.");if(g<=0||m+g>f.byteLength)throw new RangeError(`'byteLength' is out of range (0, ${f.byteLength-m}].`);if(typeof a=="object"&&a!==null)s=a;else if(typeof a<"u")throw new TypeError("'options' must be an object.")}else if(typeof r<"u")throw new TypeError("'byteLength' must be a number.")}else if(typeof i<"u")throw new TypeError("'options' must be an object.");o=new Uint8Array(f,m,g)}else throw new TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");let[l,d]=await Jd(s),p=await l.createInferenceSessionHandler(o,d);return Le(),new gp(p)}startProfiling(){this.handler.startProfiling()}endProfiling(){this.handler.endProfiling()}get inputNames(){return this.handler.inputNames}get outputNames(){return this.handler.outputNames}}}),Ma,vy=L(()=>{"use strict";$y(),Ma=mp}),xy=L(()=>{"use strict"}),Sy=L(()=>{"use strict"}),ky=L(()=>{"use strict"}),Ty=L(()=>{"use strict"}),yp={};cr(yp,{InferenceSession:()=>Ma,TRACE:()=>dr,TRACE_FUNC_BEGIN:()=>Qe,TRACE_FUNC_END:()=>Le,Tensor:()=>Ke,env:()=>_e,registerBackend:()=>It});var Ze=L(()=>{"use strict";fy(),gy(),vy(),hp(),xy(),Sy(),fp(),ky(),Ty()}),Na=L(()=>{"use strict"}),_p={};cr(_p,{default:()=>wp});var Ii,Ci,wp,Iy=L(()=>{"use strict";xf(),At(),Da(),Ii="ort-wasm-proxy-worker",Ci=globalThis.self?.name===Ii,Ci&&(self.onmessage=e=>{let{type:t,in:i}=e.data;try{switch(t){case"init-wasm":Pa(i.wasm).then(()=>{rn(i).then(()=>{postMessage({type:t})},r=>{postMessage({type:t,err:r})})},r=>{postMessage({type:t,err:r})});break;case"init-ep":{let{epName:r,env:a}=i;an(a,r).then(()=>{postMessage({type:t})},o=>{postMessage({type:t,err:o})});break}case"copy-from":{let{buffer:r}=i,a=jr(r);postMessage({type:t,out:a});break}case"create":{let{model:r,options:a}=i;nn(r,a).then(o=>{postMessage({type:t,out:o})},o=>{postMessage({type:t,err:o})});break}case"release":sn(i),postMessage({type:t});break;case"run":{let{sessionId:r,inputIndices:a,inputs:o,outputIndices:s,options:l}=i;on(r,a,o,s,new Array(s.length).fill(null),l).then(d=>{d.some(p=>p[3]!=="cpu")?postMessage({type:t,err:"Proxy does not support non-cpu tensor location."}):postMessage({type:t,out:d},ln([...o,...d]))},d=>{postMessage({type:t,err:d})});break}case"end-profiling":un(i),postMessage({type:t});break;default:}}catch(r){postMessage({type:t,err:r})}}),wp=Ci?null:e=>new Worker(e??Me,{type:"module",name:Ii})}),bp={};cr(bp,{default:()=>$p});var Ei,zi,$p,vo,Cy=L(()=>{"use strict";zi=(Ei=import.meta.url,async function(e={}){var t,i,r=e,a=new Promise((n,u)=>{t=n,i=u}),o=typeof window=="object",s=typeof WorkerGlobalScope<"u",l=s&&self.name?.startsWith("em-pthread");r.mountExternalData=(n,u)=>{n.startsWith("./")&&(n=n.substring(2)),(r.Bd||(r.Bd=new Map)).set(n,u)},r.unmountExternalData=()=>{delete r.Bd};var d=globalThis.SharedArrayBuffer??new WebAssembly.Memory({initial:0,maximum:0,shared:!0}).buffer.constructor;let p=()=>{let n=(c,h,y)=>(...S)=>{let I=Ye,A=h?.();S=c(...S);let R=h?.();return A!==R&&(c=R,y(A),h=y=null),Ye!=I?new Promise((q,Q)=>{gi={resolve:q,reject:Q}}):S},u=c=>async(...h)=>{try{if(r.Cd)throw Error("Session already started");let y=r.Cd={be:h[0],errors:[]},S=await c(...h);if(r.Cd!==y)throw Error("Session mismatch");r.Dd?.flush();let I=y.errors;if(0<I.length){let A=await Promise.all(I);if(A=A.filter(R=>R),0<A.length)throw Error(A.join(`
`))}return S}finally{r.Cd=null}};r._OrtCreateSession=n(r._OrtCreateSession,()=>r._OrtCreateSession,c=>r._OrtCreateSession=c),r._OrtRun=u(n(r._OrtRun,()=>r._OrtRun,c=>r._OrtRun=c)),r._OrtRunWithBinding=u(n(r._OrtRunWithBinding,()=>r._OrtRunWithBinding,c=>r._OrtRunWithBinding=c)),r._OrtBindInput=n(r._OrtBindInput,()=>r._OrtBindInput,c=>r._OrtBindInput=c),p=void 0};r.jsepInit=(n,u)=>{if(p?.(),n==="webgpu"){[r.Dd,r.Rd,r.Vd,r.Hd,r.Ud,r.hc,r.Wd,r.Zd,r.Sd,r.Td,r.Xd]=u;let c=r.Dd;r.jsepRegisterBuffer=(h,y,S,I)=>c.registerBuffer(h,y,S,I),r.jsepGetBuffer=h=>c.getBuffer(h),r.jsepCreateDownloader=(h,y,S)=>c.createDownloader(h,y,S),r.jsepOnCreateSession=h=>{c.onCreateSession(h)},r.jsepOnReleaseSession=h=>{c.onReleaseSession(h)},r.jsepOnRunStart=h=>c.onRunStart(h),r.$d=(h,y)=>{c.upload(h,y)}}else if(n==="webnn"){[r.Dd,r.Yd,r.Id,r.jsepEnsureTensor,r.Jd,r.jsepDownloadTensor]=u,r.jsepReleaseTensorId=r.Id,r.jsepUploadTensor=r.Jd;let c=r.Dd;r.jsepOnRunStart=h=>c.onRunStart(h),r.jsepOnRunEnd=c.onRunEnd.bind(c),r.jsepRegisterMLContext=(h,y)=>{c.registerMLContext(h,y)},r.jsepOnReleaseSession=h=>{c.onReleaseSession(h)},r.jsepCreateMLTensorDownloader=(h,y)=>c.createMLTensorDownloader(h,y),r.jsepRegisterMLTensor=(h,y,S,I)=>c.registerMLTensor(h,y,S,I),r.jsepCreateMLContext=h=>c.createMLContext(h),r.jsepRegisterMLConstant=(h,y,S,I,A)=>c.registerMLConstant(h,y,S,I,A,r.Bd),r.jsepRegisterGraphInput=c.registerGraphInput.bind(c),r.jsepIsGraphInput=c.isGraphInput.bind(c),r.jsepCreateTemporaryTensor=c.createTemporaryTensor.bind(c)}};var f,m,g=Object.assign({},r),w=(n,u)=>{throw u},_="";(o||s)&&(s?_=self.location.href:typeof document<"u"&&document.currentScript&&(_=document.currentScript.src),Ei&&(_=Ei),_=_.startsWith("blob:")?"":_.slice(0,_.replace(/[?#].*/,"").lastIndexOf("/")+1),s&&(m=n=>{var u=new XMLHttpRequest;return u.open("GET",n,!1),u.responseType="arraybuffer",u.send(null),new Uint8Array(u.response)}),f=async n=>{if(pe(n))return new Promise((c,h)=>{var y=new XMLHttpRequest;y.open("GET",n,!0),y.responseType="arraybuffer",y.onload=()=>{y.status==200||y.status==0&&y.response?c(y.response):h(y.status)},y.onerror=h,y.send(null)});var u=await fetch(n,{credentials:"same-origin"});if(u.ok)return u.arrayBuffer();throw Error(u.status+" : "+u.url)});var $=console.log.bind(console),x=console.error.bind(console),v=$,b=x;Object.assign(r,g),g=null;var k,T,C,E,z,N,W,H,V,G,D,re,te,j=r.wasmBinary,se=!1,pe=n=>n.startsWith("file://");function F(){return k.buffer!=E.buffer&&Oe(),E}function ce(){return k.buffer!=E.buffer&&Oe(),z}function U(){return k.buffer!=E.buffer&&Oe(),N}function K(){return k.buffer!=E.buffer&&Oe(),W}function B(){return k.buffer!=E.buffer&&Oe(),H}function ee(){return k.buffer!=E.buffer&&Oe(),V}function ve(){return k.buffer!=E.buffer&&Oe(),G}function Re(){return k.buffer!=E.buffer&&Oe(),te}if(l){let n=function(u){try{var c=u.data,h=c.yd;if(h==="load"){let y=[];self.onmessage=S=>y.push(S),self.startWorker=()=>{postMessage({yd:"loaded"});for(let S of y)n(S);self.onmessage=n};for(let S of c.Od)r[S]&&!r[S].proxy||(r[S]=(...I)=>{postMessage({yd:"callHandler",Nd:S,args:I})},S=="print"&&(v=r[S]),S=="printErr"&&(b=r[S]));k=c.he,Oe(),xe(c.ie)}else if(h==="run"){Gf(c.xd),bi(c.xd,0,0,1,0,0),$n(),fi(c.xd),tt||(ms(),tt=!0);try{Hf(c.de,c.Fd)}catch(y){if(y!="unwind")throw y}}else c.target!=="setimmediate"&&(h==="checkMailbox"?tt&&mr():h&&(b(`worker: received unknown command ${h}`),b(c)))}catch(y){throw gs(),y}};var Ce=n,xe,tt=!1;b=function(...u){u=u.join(" "),console.error(u)},self.alert=function(...u){postMessage({yd:"alert",text:u.join(" "),fe:xr()})},self.onunhandledrejection=u=>{throw u.reason||u},self.onmessage=n}function Oe(){var n=k.buffer;r.HEAP8=E=new Int8Array(n),r.HEAP16=N=new Int16Array(n),r.HEAPU8=z=new Uint8Array(n),r.HEAPU16=W=new Uint16Array(n),r.HEAP32=H=new Int32Array(n),r.HEAPU32=V=new Uint32Array(n),r.HEAPF32=G=new Float32Array(n),r.HEAPF64=te=new Float64Array(n),r.HEAP64=D=new BigInt64Array(n),r.HEAPU64=re=new BigUint64Array(n)}function hr(){l?startWorker(r):P.Bb()}l||(k=new WebAssembly.Memory({initial:256,maximum:65536,shared:!0}),Oe());var ei,Ft=0,Gt=null;function fn(){if(--Ft==0&&Gt){var n=Gt;Gt=null,n()}}function rt(n){throw b(n="Aborted("+n+")"),se=!0,n=new WebAssembly.RuntimeError(n+". Build with -sASSERTIONS for more info."),i(n),n}function mn(){return{a:{Ta:Ff,Va:Vf,W:jf,la:Kf,b:Zf,u:Xf,R:Yf,Za:Jf,d:em,pb:kn,g:Qf,T:Cn,Ga:En,lb:An,nb:On,Ha:Rn,Ea:Bn,wb:Mn,Da:Nn,pa:Dn,mb:Pn,jb:Un,Fa:Wn,kb:qn,Ma:tm,za:im,eb:am,cb:sm,ya:um,V:lm,N:dm,db:pm,ma:_m,fb:wm,zb:bm,hb:$m,qb:vm,ab:xm,Aa:Sm,yb:fi,Ja:km,S:Tm,Wa:Im,$:zm,G:Am,E:Rm,m:pi,H:Bm,B:Dm,X:Pm,J:Um,v:Wm,O:qm,D:Lm,t:Vm,A:Fm,z:Gm,w:Hm,r:jm,tb:Km,ub:Qm,vb:Zm,rb:ts,sb:rs,bb:is,Oa:Ym,La:tg,y:rg,ja:ig,Ba:ag,Ka:Jm,qa:ng,Ia:sg,ib:og,U:Xm,fa:ug,Sa:lg,gb:dg,Qa:pg,Pa:cg,Ab:os,Ca:us,ob:ni,aa:ls,oa:ds,xb:ps,na:cs,$a:Ug,ia:Yg,sa:iy,ga:Dg,da:Gg,ua:ty,p:Mg,e:wg,c:yg,ea:Vg,f:bg,n:vg,k:Ag,Y:Sg,ka:Og,j:Ng,wa:Lg,Ra:sy,ca:Zg,Ua:ny,P:Fg,K:Tg,_:Qg,Q:Pg,Z:Jg,x:kg,l:_g,va:Kg,i:gg,h:xg,ra:ay,ta:ry,o:$g,q:Ig,s:Eg,I:zg,C:Bg,L:Rg,xa:qg,_a:Wg,F:Xg,Ya:Hg,ba:ey,M:Cg,Xa:jg,ha:fg,a:k,Na:ai}}}var ti={1319426:()=>typeof wasmOffsetConverter<"u",1319483:(n,u,c,h,y)=>{if(r===void 0||!r.Bd)return 1;if((n=Se(Number(n>>>0))).startsWith("./")&&(n=n.substring(2)),!(n=r.Bd.get(n)))return 2;if(u=Number(u>>>0),c=Number(c>>>0),h=Number(h>>>0),u+c>n.byteLength)return 3;try{let S=n.subarray(u,u+c);switch(y){case 0:ce().set(S,h>>>0);break;case 1:r.$d(h,S);break;default:return 4}return 0}catch{return 4}},1320198:(n,u,c)=>{r.Jd(n,ce().subarray(u>>>0,u+c>>>0))},1320261:()=>r.Yd(),1320302:n=>{r.Id(n)},1320338:()=>{r.Sd()},1320369:()=>{r.Td()},1320398:()=>{r.Xd()},1320423:n=>r.Rd(n),1320456:n=>r.Vd(n),1320488:(n,u,c)=>{r.Hd(Number(n),Number(u),Number(c),!0)},1320551:(n,u,c)=>{r.Hd(Number(n),Number(u),Number(c))},1320608:n=>{r.hc("Abs",n,void 0)},1320659:n=>{r.hc("Neg",n,void 0)},1320710:n=>{r.hc("Floor",n,void 0)},1320763:n=>{r.hc("Ceil",n,void 0)},1320815:n=>{r.hc("Reciprocal",n,void 0)},1320873:n=>{r.hc("Sqrt",n,void 0)},1320925:n=>{r.hc("Exp",n,void 0)},1320976:n=>{r.hc("Erf",n,void 0)},1321027:n=>{r.hc("Sigmoid",n,void 0)},1321082:(n,u,c)=>{r.hc("HardSigmoid",n,{alpha:u,beta:c})},1321161:n=>{r.hc("Log",n,void 0)},1321212:n=>{r.hc("Sin",n,void 0)},1321263:n=>{r.hc("Cos",n,void 0)},1321314:n=>{r.hc("Tan",n,void 0)},1321365:n=>{r.hc("Asin",n,void 0)},1321417:n=>{r.hc("Acos",n,void 0)},1321469:n=>{r.hc("Atan",n,void 0)},1321521:n=>{r.hc("Sinh",n,void 0)},1321573:n=>{r.hc("Cosh",n,void 0)},1321625:n=>{r.hc("Asinh",n,void 0)},1321678:n=>{r.hc("Acosh",n,void 0)},1321731:n=>{r.hc("Atanh",n,void 0)},1321784:n=>{r.hc("Tanh",n,void 0)},1321836:n=>{r.hc("Not",n,void 0)},1321887:(n,u,c)=>{r.hc("Clip",n,{min:u,max:c})},1321956:n=>{r.hc("Clip",n,void 0)},1322008:(n,u)=>{r.hc("Elu",n,{alpha:u})},1322066:n=>{r.hc("Gelu",n,void 0)},1322118:n=>{r.hc("Relu",n,void 0)},1322170:(n,u)=>{r.hc("LeakyRelu",n,{alpha:u})},1322234:(n,u)=>{r.hc("ThresholdedRelu",n,{alpha:u})},1322304:(n,u)=>{r.hc("Cast",n,{to:u})},1322362:n=>{r.hc("Add",n,void 0)},1322413:n=>{r.hc("Sub",n,void 0)},1322464:n=>{r.hc("Mul",n,void 0)},1322515:n=>{r.hc("Div",n,void 0)},1322566:n=>{r.hc("Pow",n,void 0)},1322617:n=>{r.hc("Equal",n,void 0)},1322670:n=>{r.hc("Greater",n,void 0)},1322725:n=>{r.hc("GreaterOrEqual",n,void 0)},1322787:n=>{r.hc("Less",n,void 0)},1322839:n=>{r.hc("LessOrEqual",n,void 0)},1322898:(n,u,c,h,y)=>{r.hc("ReduceMean",n,{keepDims:!!u,noopWithEmptyAxes:!!c,axes:h?Array.from(B().subarray(Number(h)>>>0,Number(y)>>>0)):[]})},1323073:(n,u,c,h,y)=>{r.hc("ReduceMax",n,{keepDims:!!u,noopWithEmptyAxes:!!c,axes:h?Array.from(B().subarray(Number(h)>>>0,Number(y)>>>0)):[]})},1323247:(n,u,c,h,y)=>{r.hc("ReduceMin",n,{keepDims:!!u,noopWithEmptyAxes:!!c,axes:h?Array.from(B().subarray(Number(h)>>>0,Number(y)>>>0)):[]})},1323421:(n,u,c,h,y)=>{r.hc("ReduceProd",n,{keepDims:!!u,noopWithEmptyAxes:!!c,axes:h?Array.from(B().subarray(Number(h)>>>0,Number(y)>>>0)):[]})},1323596:(n,u,c,h,y)=>{r.hc("ReduceSum",n,{keepDims:!!u,noopWithEmptyAxes:!!c,axes:h?Array.from(B().subarray(Number(h)>>>0,Number(y)>>>0)):[]})},1323770:(n,u,c,h,y)=>{r.hc("ReduceL1",n,{keepDims:!!u,noopWithEmptyAxes:!!c,axes:h?Array.from(B().subarray(Number(h)>>>0,Number(y)>>>0)):[]})},1323943:(n,u,c,h,y)=>{r.hc("ReduceL2",n,{keepDims:!!u,noopWithEmptyAxes:!!c,axes:h?Array.from(B().subarray(Number(h)>>>0,Number(y)>>>0)):[]})},1324116:(n,u,c,h,y)=>{r.hc("ReduceLogSum",n,{keepDims:!!u,noopWithEmptyAxes:!!c,axes:h?Array.from(B().subarray(Number(h)>>>0,Number(y)>>>0)):[]})},1324293:(n,u,c,h,y)=>{r.hc("ReduceSumSquare",n,{keepDims:!!u,noopWithEmptyAxes:!!c,axes:h?Array.from(B().subarray(Number(h)>>>0,Number(y)>>>0)):[]})},1324473:(n,u,c,h,y)=>{r.hc("ReduceLogSumExp",n,{keepDims:!!u,noopWithEmptyAxes:!!c,axes:h?Array.from(B().subarray(Number(h)>>>0,Number(y)>>>0)):[]})},1324653:n=>{r.hc("Where",n,void 0)},1324706:(n,u,c)=>{r.hc("Transpose",n,{perm:u?Array.from(B().subarray(Number(u)>>>0,Number(c)>>>0)):[]})},1324830:(n,u,c,h)=>{r.hc("DepthToSpace",n,{blocksize:u,mode:Se(c),format:h?"NHWC":"NCHW"})},1324963:(n,u,c,h)=>{r.hc("DepthToSpace",n,{blocksize:u,mode:Se(c),format:h?"NHWC":"NCHW"})},1325096:(n,u,c,h,y,S,I,A,R,q,Q,J,ue,ye,Ue)=>{r.hc("ConvTranspose",n,{format:R?"NHWC":"NCHW",autoPad:u,dilations:[c],group:h,kernelShape:[y],pads:[S,I],strides:[A],wIsConst:()=>!!F()[q>>>0],outputPadding:Q?Array.from(B().subarray(Number(Q)>>>0,Number(J)>>>0)):[],outputShape:ue?Array.from(B().subarray(Number(ue)>>>0,Number(ye)>>>0)):[],activation:Se(Ue)})},1325529:(n,u,c,h,y,S,I,A,R,q,Q,J,ue,ye)=>{r.hc("ConvTranspose",n,{format:A?"NHWC":"NCHW",autoPad:u,dilations:Array.from(B().subarray(Number(c)>>>0,2+(Number(c)>>>0)>>>0)),group:h,kernelShape:Array.from(B().subarray(Number(y)>>>0,2+(Number(y)>>>0)>>>0)),pads:Array.from(B().subarray(Number(S)>>>0,4+(Number(S)>>>0)>>>0)),strides:Array.from(B().subarray(Number(I)>>>0,2+(Number(I)>>>0)>>>0)),wIsConst:()=>!!F()[R>>>0],outputPadding:q?Array.from(B().subarray(Number(q)>>>0,Number(Q)>>>0)):[],outputShape:J?Array.from(B().subarray(Number(J)>>>0,Number(ue)>>>0)):[],activation:Se(ye)})},1326190:(n,u,c,h,y,S,I,A,R,q,Q,J,ue,ye,Ue)=>{r.hc("ConvTranspose",n,{format:R?"NHWC":"NCHW",autoPad:u,dilations:[c],group:h,kernelShape:[y],pads:[S,I],strides:[A],wIsConst:()=>!!F()[q>>>0],outputPadding:Q?Array.from(B().subarray(Number(Q)>>>0,Number(J)>>>0)):[],outputShape:ue?Array.from(B().subarray(Number(ue)>>>0,Number(ye)>>>0)):[],activation:Se(Ue)})},1326623:(n,u,c,h,y,S,I,A,R,q,Q,J,ue,ye)=>{r.hc("ConvTranspose",n,{format:A?"NHWC":"NCHW",autoPad:u,dilations:Array.from(B().subarray(Number(c)>>>0,2+(Number(c)>>>0)>>>0)),group:h,kernelShape:Array.from(B().subarray(Number(y)>>>0,2+(Number(y)>>>0)>>>0)),pads:Array.from(B().subarray(Number(S)>>>0,4+(Number(S)>>>0)>>>0)),strides:Array.from(B().subarray(Number(I)>>>0,2+(Number(I)>>>0)>>>0)),wIsConst:()=>!!F()[R>>>0],outputPadding:q?Array.from(B().subarray(Number(q)>>>0,Number(Q)>>>0)):[],outputShape:J?Array.from(B().subarray(Number(J)>>>0,Number(ue)>>>0)):[],activation:Se(ye)})},1327284:(n,u)=>{r.hc("GlobalAveragePool",n,{format:u?"NHWC":"NCHW"})},1327375:(n,u,c,h,y,S,I,A,R,q,Q,J,ue,ye)=>{r.hc("AveragePool",n,{format:ye?"NHWC":"NCHW",auto_pad:u,ceil_mode:c,count_include_pad:h,storage_order:y,dilations:S?Array.from(B().subarray(Number(S)>>>0,Number(I)>>>0)):[],kernel_shape:A?Array.from(B().subarray(Number(A)>>>0,Number(R)>>>0)):[],pads:q?Array.from(B().subarray(Number(q)>>>0,Number(Q)>>>0)):[],strides:J?Array.from(B().subarray(Number(J)>>>0,Number(ue)>>>0)):[]})},1327854:(n,u)=>{r.hc("GlobalAveragePool",n,{format:u?"NHWC":"NCHW"})},1327945:(n,u,c,h,y,S,I,A,R,q,Q,J,ue,ye)=>{r.hc("AveragePool",n,{format:ye?"NHWC":"NCHW",auto_pad:u,ceil_mode:c,count_include_pad:h,storage_order:y,dilations:S?Array.from(B().subarray(Number(S)>>>0,Number(I)>>>0)):[],kernel_shape:A?Array.from(B().subarray(Number(A)>>>0,Number(R)>>>0)):[],pads:q?Array.from(B().subarray(Number(q)>>>0,Number(Q)>>>0)):[],strides:J?Array.from(B().subarray(Number(J)>>>0,Number(ue)>>>0)):[]})},1328424:(n,u)=>{r.hc("GlobalMaxPool",n,{format:u?"NHWC":"NCHW"})},1328511:(n,u,c,h,y,S,I,A,R,q,Q,J,ue,ye)=>{r.hc("MaxPool",n,{format:ye?"NHWC":"NCHW",auto_pad:u,ceil_mode:c,count_include_pad:h,storage_order:y,dilations:S?Array.from(B().subarray(Number(S)>>>0,Number(I)>>>0)):[],kernel_shape:A?Array.from(B().subarray(Number(A)>>>0,Number(R)>>>0)):[],pads:q?Array.from(B().subarray(Number(q)>>>0,Number(Q)>>>0)):[],strides:J?Array.from(B().subarray(Number(J)>>>0,Number(ue)>>>0)):[]})},1328986:(n,u)=>{r.hc("GlobalMaxPool",n,{format:u?"NHWC":"NCHW"})},1329073:(n,u,c,h,y,S,I,A,R,q,Q,J,ue,ye)=>{r.hc("MaxPool",n,{format:ye?"NHWC":"NCHW",auto_pad:u,ceil_mode:c,count_include_pad:h,storage_order:y,dilations:S?Array.from(B().subarray(Number(S)>>>0,Number(I)>>>0)):[],kernel_shape:A?Array.from(B().subarray(Number(A)>>>0,Number(R)>>>0)):[],pads:q?Array.from(B().subarray(Number(q)>>>0,Number(Q)>>>0)):[],strides:J?Array.from(B().subarray(Number(J)>>>0,Number(ue)>>>0)):[]})},1329548:(n,u,c,h,y)=>{r.hc("Gemm",n,{alpha:u,beta:c,transA:h,transB:y})},1329652:n=>{r.hc("MatMul",n,void 0)},1329706:(n,u,c,h)=>{r.hc("ArgMax",n,{keepDims:!!u,selectLastIndex:!!c,axis:h})},1329814:(n,u,c,h)=>{r.hc("ArgMin",n,{keepDims:!!u,selectLastIndex:!!c,axis:h})},1329922:(n,u)=>{r.hc("Softmax",n,{axis:u})},1329985:(n,u)=>{r.hc("Concat",n,{axis:u})},1330045:(n,u,c,h,y)=>{r.hc("Split",n,{axis:u,numOutputs:c,splitSizes:h?Array.from(B().subarray(Number(h)>>>0,Number(y)>>>0)):[]})},1330201:n=>{r.hc("Expand",n,void 0)},1330255:(n,u)=>{r.hc("Gather",n,{axis:Number(u)})},1330326:(n,u)=>{r.hc("GatherElements",n,{axis:Number(u)})},1330405:(n,u)=>{r.hc("GatherND",n,{batch_dims:Number(u)})},1330484:(n,u,c,h,y,S,I,A,R,q,Q)=>{r.hc("Resize",n,{antialias:u,axes:c?Array.from(B().subarray(Number(c)>>>0,Number(h)>>>0)):[],coordinateTransformMode:Se(y),cubicCoeffA:S,excludeOutside:I,extrapolationValue:A,keepAspectRatioPolicy:Se(R),mode:Se(q),nearestMode:Se(Q)})},1330846:(n,u,c,h,y,S,I)=>{r.hc("Slice",n,{starts:u?Array.from(B().subarray(Number(u)>>>0,Number(c)>>>0)):[],ends:h?Array.from(B().subarray(Number(h)>>>0,Number(y)>>>0)):[],axes:S?Array.from(B().subarray(Number(S)>>>0,Number(I)>>>0)):[]})},1331110:n=>{r.hc("Tile",n,void 0)},1331162:(n,u,c)=>{r.hc("InstanceNormalization",n,{epsilon:u,format:c?"NHWC":"NCHW"})},1331276:(n,u,c)=>{r.hc("InstanceNormalization",n,{epsilon:u,format:c?"NHWC":"NCHW"})},1331390:n=>{r.hc("Range",n,void 0)},1331443:(n,u)=>{r.hc("Einsum",n,{equation:Se(u)})},1331524:(n,u,c,h,y)=>{r.hc("Pad",n,{mode:u,value:c,pads:h?Array.from(B().subarray(Number(h)>>>0,Number(y)>>>0)):[]})},1331667:(n,u,c,h,y,S)=>{r.hc("BatchNormalization",n,{epsilon:u,momentum:c,spatial:!!y,trainingMode:!!h,format:S?"NHWC":"NCHW"})},1331836:(n,u,c,h,y,S)=>{r.hc("BatchNormalization",n,{epsilon:u,momentum:c,spatial:!!y,trainingMode:!!h,format:S?"NHWC":"NCHW"})},1332005:(n,u,c)=>{r.hc("CumSum",n,{exclusive:Number(u),reverse:Number(c)})},1332102:(n,u,c)=>{r.hc("DequantizeLinear",n,{axis:u,blockSize:c})},1332192:(n,u,c,h,y)=>{r.hc("GridSample",n,{align_corners:u,mode:Se(c),padding_mode:Se(h),format:y?"NHWC":"NCHW"})},1332362:(n,u,c,h,y)=>{r.hc("GridSample",n,{align_corners:u,mode:Se(c),padding_mode:Se(h),format:y?"NHWC":"NCHW"})},1332532:(n,u)=>{r.hc("ScatterND",n,{reduction:Se(u)})},1332617:(n,u,c,h,y,S,I,A,R)=>{r.hc("Attention",n,{numHeads:u,isUnidirectional:c,maskFilterValue:h,scale:y,doRotary:S,qkvHiddenSizes:I?Array.from(B().subarray(Number(A)>>>0,Number(A)+I>>>0)):[],pastPresentShareBuffer:!!R})},1332889:n=>{r.hc("BiasAdd",n,void 0)},1332944:n=>{r.hc("BiasSplitGelu",n,void 0)},1333005:n=>{r.hc("FastGelu",n,void 0)},1333061:(n,u,c,h,y,S,I,A,R,q,Q,J,ue,ye,Ue,Qt)=>{r.hc("Conv",n,{format:J?"NHWC":"NCHW",auto_pad:u,dilations:c?Array.from(B().subarray(Number(c)>>>0,Number(h)>>>0)):[],group:y,kernel_shape:S?Array.from(B().subarray(Number(S)>>>0,Number(I)>>>0)):[],pads:A?Array.from(B().subarray(Number(A)>>>0,Number(R)>>>0)):[],strides:q?Array.from(B().subarray(Number(q)>>>0,Number(Q)>>>0)):[],w_is_const:()=>!!F()[Number(ue)>>>0],activation:Se(ye),activation_params:Ue?Array.from(ve().subarray(Number(Ue)>>>0,Number(Qt)>>>0)):[]})},1333645:n=>{r.hc("Gelu",n,void 0)},1333697:(n,u,c,h,y,S,I,A,R)=>{r.hc("GroupQueryAttention",n,{numHeads:u,kvNumHeads:c,scale:h,softcap:y,doRotary:S,rotaryInterleaved:I,smoothSoftmax:A,localWindowSize:R})},1333914:(n,u,c,h)=>{r.hc("LayerNormalization",n,{axis:u,epsilon:c,simplified:!!h})},1334025:(n,u,c,h)=>{r.hc("LayerNormalization",n,{axis:u,epsilon:c,simplified:!!h})},1334136:(n,u,c,h,y,S)=>{r.hc("MatMulNBits",n,{k:u,n:c,accuracyLevel:h,bits:y,blockSize:S})},1334263:(n,u,c,h,y,S)=>{r.hc("MultiHeadAttention",n,{numHeads:u,isUnidirectional:c,maskFilterValue:h,scale:y,doRotary:S})},1334422:(n,u)=>{r.hc("QuickGelu",n,{alpha:u})},1334486:(n,u,c,h,y)=>{r.hc("RotaryEmbedding",n,{interleaved:!!u,numHeads:c,rotaryEmbeddingDim:h,scale:y})},1334625:(n,u,c)=>{r.hc("SkipLayerNormalization",n,{epsilon:u,simplified:!!c})},1334727:(n,u,c)=>{r.hc("SkipLayerNormalization",n,{epsilon:u,simplified:!!c})},1334829:(n,u,c,h)=>{r.hc("GatherBlockQuantized",n,{gatherAxis:u,quantizeAxis:c,blockSize:h})},1334950:n=>{r.Wd(n)},1334984:(n,u)=>r.Zd(Number(n),Number(u),r.Cd.be,r.Cd.errors)};function Vf(n,u,c){return Qn(async()=>{await r.Ud(Number(n),Number(u),Number(c))})}function Ff(){return typeof wasmOffsetConverter<"u"}class ri{name="ExitStatus";constructor(u){this.message=`Program terminated with exit(${u})`,this.status=u}}var gn=n=>{n.terminate(),n.onmessage=()=>{}},ii=[],yn=n=>{ut.length==0&&(xn(),vn(ut[0]));var u=ut.pop();if(!u)return 6;Ht.push(u),_t[n.xd]=u,u.xd=n.xd;var c={yd:"run",de:n.ce,Fd:n.Fd,xd:n.xd};return u.postMessage(c,n.Ld),0},ot=0,we=(n,u,...c)=>{for(var h=2*c.length,y=ne(),S=vi(8*h),I=S>>>3,A=0;A<c.length;A++){var R=c[A];typeof R=="bigint"?(D[I+2*A]=1n,D[I+2*A+1]=R):(D[I+2*A]=0n,Re()[I+2*A+1>>>0]=R)}return n=ys(n,0,h,S,u),ae(y),n};function ai(n){if(l)return we(0,1,n);if(C=n,!(0<ot)){for(var u of Ht)gn(u);for(u of ut)gn(u);ut=[],Ht=[],_t={},se=!0}w(0,new ri(n))}function _n(n){if(l)return we(1,0,n);ni(n)}var ni=n=>{if(C=n,l)throw _n(n),"unwind";ai(n)},ut=[],Ht=[],wn=[],_t={},bn=n=>{var u=n.xd;delete _t[u],ut.push(n),Ht.splice(Ht.indexOf(n),1),n.xd=0,_s(u)};function $n(){wn.forEach(n=>n())}var vn=n=>new Promise(u=>{n.onmessage=y=>{var S=(y=y.data).yd;if(y.Ed&&y.Ed!=xr()){var I=_t[y.Ed];I?I.postMessage(y,y.Ld):b(`Internal error! Worker sent a message "${S}" to target pthread ${y.Ed}, but that thread no longer exists!`)}else S==="checkMailbox"?mr():S==="spawnThread"?yn(y):S==="cleanupThread"?bn(_t[y.ee]):S==="loaded"?(n.loaded=!0,u(n)):S==="alert"?alert(`Thread ${y.fe}: ${y.text}`):y.target==="setimmediate"?n.postMessage(y):S==="callHandler"?r[y.Nd](...y.args):S&&b(`worker sent an unknown command ${S}`)},n.onerror=y=>{throw b(`worker sent an error! ${y.filename}:${y.lineno}: ${y.message}`),y};var c,h=[];for(c of[])r.propertyIsEnumerable(c)&&h.push(c);n.postMessage({yd:"load",Od:h,he:k,ie:T})});function xn(){var n=new Worker(import.meta.url.startsWith("file:")?new URL("ort.bundle.min.mjs",import.meta.url):new URL(import.meta.url),{type:"module",workerData:"em-pthread",name:"em-pthread"});ut.push(n)}var Gf=n=>{Oe();var u=ee()[n+52>>>2>>>0];n=ee()[n+56>>>2>>>0],$s(u,u-n),ae(u)},Hf=(n,u)=>{ot=0,n=xi(n,u),0<ot?C=n:$i(n)},fr=[];function jf(n){var u=new si(n>>>=0);if(F()[u.wd+12>>>0]==0){var c=1;F()[u.wd+12>>>0]=c}return c=0,F()[u.wd+13>>>0]=c,fr.push(u),xs(n),ks(n)}var Bt=0,Kf=()=>{oe(0,0);var n=fr.pop();vs(n.Gd),Bt=0};class si{constructor(u){this.Gd=u,this.wd=u-24}}function Qf(n){throw Bt||=n>>>0,Bt}var oi=n=>{var u=Bt;if(!u)return Kt(0),0;var c=new si(u);ee()[c.wd+16>>>2>>>0]=u;var h=ee()[c.wd+4>>>2>>>0];if(!h)return Kt(0),u;for(var y of n){if(y===0||y===h)break;if(Ss(y,h,c.wd+16))return Kt(y),u}return Kt(h),u};function Zf(){return oi([])}function Xf(n){return oi([n>>>0])}function Yf(n,u){return oi([n>>>0,u>>>0])}var Jf=()=>{var n=fr.pop();n||rt("no exception to throw");var u=n.Gd;if(F()[n.wd+13>>>0]==0){fr.push(n);var c=1;F()[n.wd+13>>>0]=c,c=0,F()[n.wd+12>>>0]=c}throw Bt=u};function em(n,u,c){var h=new si(n>>>=0);throw u>>>=0,c>>>=0,ee()[h.wd+16>>>2>>>0]=0,ee()[h.wd+4>>>2>>>0]=u,ee()[h.wd+8>>>2>>>0]=c,Bt=n}function Sn(n,u,c,h){return l?we(2,1,n,u,c,h):kn(n,u,c,h)}function kn(n,u,c,h){if(n>>>=0,c>>>=0,h>>>=0,d===void 0)return 6;var y=[];return l&&y.length===0?Sn(n,u>>>=0,c,h):(n={ce:c,xd:n,Fd:h,Ld:y},l?(n.yd="spawnThread",postMessage(n,y),0):yn(n))}var Tn=typeof TextDecoder<"u"?new TextDecoder:void 0,In=(n,u=0,c=NaN)=>{var h=(u>>>=0)+c;for(c=u;n[c]&&!(c>=h);)++c;if(16<c-u&&n.buffer&&Tn)return Tn.decode(n.buffer instanceof ArrayBuffer?n.subarray(u,c):n.slice(u,c));for(h="";u<c;){var y=n[u++];if(128&y){var S=63&n[u++];if((224&y)==192)h+=String.fromCharCode((31&y)<<6|S);else{var I=63&n[u++];65536>(y=(240&y)==224?(15&y)<<12|S<<6|I:(7&y)<<18|S<<12|I<<6|63&n[u++])?h+=String.fromCharCode(y):(y-=65536,h+=String.fromCharCode(55296|y>>10,56320|1023&y))}}else h+=String.fromCharCode(y)}return h},Se=(n,u)=>(n>>>=0)?In(ce(),n,u):"";function Cn(n,u,c){return l?we(3,1,n,u,c):0}function En(n,u){if(l)return we(4,1,n,u)}var zn=n=>{for(var u=0,c=0;c<n.length;++c){var h=n.charCodeAt(c);127>=h?u++:2047>=h?u+=2:55296<=h&&57343>=h?(u+=4,++c):u+=3}return u},Mt=(n,u,c)=>{var h=ce();if(u>>>=0,0<c){var y=u;c=u+c-1;for(var S=0;S<n.length;++S){var I=n.charCodeAt(S);if(55296<=I&&57343>=I&&(I=65536+((1023&I)<<10)|1023&n.charCodeAt(++S)),127>=I){if(u>=c)break;h[u++>>>0]=I}else{if(2047>=I){if(u+1>=c)break;h[u++>>>0]=192|I>>6}else{if(65535>=I){if(u+2>=c)break;h[u++>>>0]=224|I>>12}else{if(u+3>=c)break;h[u++>>>0]=240|I>>18,h[u++>>>0]=128|I>>12&63}h[u++>>>0]=128|I>>6&63}h[u++>>>0]=128|63&I}}h[u>>>0]=0,n=u-y}else n=0;return n};function An(n,u){if(l)return we(5,1,n,u)}function On(n,u,c){if(l)return we(6,1,n,u,c)}function Rn(n,u,c){return l?we(7,1,n,u,c):0}function Bn(n,u){if(l)return we(8,1,n,u)}function Mn(n,u,c){if(l)return we(9,1,n,u,c)}function Nn(n,u,c,h){if(l)return we(10,1,n,u,c,h)}function Dn(n,u,c,h){if(l)return we(11,1,n,u,c,h)}function Pn(n,u,c,h){if(l)return we(12,1,n,u,c,h)}function Un(n){if(l)return we(13,1,n)}function Wn(n,u){if(l)return we(14,1,n,u)}function qn(n,u,c){if(l)return we(15,1,n,u,c)}var Ln,lt,tm=()=>rt(""),Xe=n=>{for(var u="";ce()[n>>>0];)u+=Ln[ce()[n++>>>0]];return u},ui={},li={},rm={};function it(n,u,c={}){return(function(h,y,S={}){var I=y.name;if(!h)throw new lt(`type "${I}" must have a positive integer typeid pointer`);if(li.hasOwnProperty(h)){if(S.Pd)return;throw new lt(`Cannot register type '${I}' twice`)}li[h]=y,delete rm[h],ui.hasOwnProperty(h)&&(y=ui[h],delete ui[h],y.forEach(A=>A()))})(n,u,c)}var Vn=(n,u,c)=>{switch(u){case 1:return c?h=>F()[h>>>0]:h=>ce()[h>>>0];case 2:return c?h=>U()[h>>>1>>>0]:h=>K()[h>>>1>>>0];case 4:return c?h=>B()[h>>>2>>>0]:h=>ee()[h>>>2>>>0];case 8:return c?h=>D[h>>>3]:h=>re[h>>>3];default:throw new TypeError(`invalid integer width (${u}): ${n}`)}};function im(n,u,c){c>>>=0,it(n>>>=0,{name:u=Xe(u>>>0),fromWireType:h=>h,toWireType:function(h,y){if(typeof y!="bigint"&&typeof y!="number")throw y=y===null?"null":(h=typeof y)=="object"||h==="array"||h==="function"?y.toString():""+y,new TypeError(`Cannot convert "${y}" to ${this.name}`);return typeof y=="number"&&(y=BigInt(y)),y},zd:dt,readValueFromPointer:Vn(u,c,u.indexOf("u")==-1),Ad:null})}var dt=8;function am(n,u,c,h){it(n>>>=0,{name:u=Xe(u>>>0),fromWireType:function(y){return!!y},toWireType:function(y,S){return S?c:h},zd:dt,readValueFromPointer:function(y){return this.fromWireType(ce()[y>>>0])},Ad:null})}var di=[],at=[];function pi(n){9<(n>>>=0)&&--at[n+1]==0&&(at[n]=void 0,di.push(n))}var Be=n=>{if(!n)throw new lt("Cannot use deleted val. handle = "+n);return at[n]},Pe=n=>{switch(n){case void 0:return 2;case null:return 4;case!0:return 6;case!1:return 8;default:let u=di.pop()||at.length;return at[u]=n,at[u+1]=1,u}};function ci(n){return this.fromWireType(ee()[n>>>2>>>0])}var nm={name:"emscripten::val",fromWireType:n=>{var u=Be(n);return pi(n),u},toWireType:(n,u)=>Pe(u),zd:dt,readValueFromPointer:ci,Ad:null};function sm(n){return it(n>>>0,nm)}var om=(n,u)=>{switch(u){case 4:return function(c){return this.fromWireType(ve()[c>>>2>>>0])};case 8:return function(c){return this.fromWireType(Re()[c>>>3>>>0])};default:throw new TypeError(`invalid float width (${u}): ${n}`)}};function um(n,u,c){c>>>=0,it(n>>>=0,{name:u=Xe(u>>>0),fromWireType:h=>h,toWireType:(h,y)=>y,zd:dt,readValueFromPointer:om(u,c),Ad:null})}function lm(n,u,c,h,y){if(n>>>=0,c>>>=0,u=Xe(u>>>0),y===-1&&(y=4294967295),y=A=>A,h===0){var S=32-8*c;y=A=>A<<S>>>S}var I=u.includes("unsigned")?function(A,R){return R>>>0}:function(A,R){return R};it(n,{name:u,fromWireType:y,toWireType:I,zd:dt,readValueFromPointer:Vn(u,c,h!==0),Ad:null})}function dm(n,u,c){function h(S){var I=ee()[S>>>2>>>0];return S=ee()[S+4>>>2>>>0],new y(F().buffer,S,I)}var y=[Int8Array,Uint8Array,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array,BigInt64Array,BigUint64Array][u];it(n>>>=0,{name:c=Xe(c>>>0),fromWireType:h,zd:dt,readValueFromPointer:h},{Pd:!0})}function pm(n,u){it(n>>>=0,{name:u=Xe(u>>>0),fromWireType:function(c){for(var h,y=ee()[c>>>2>>>0],S=c+4,I=S,A=0;A<=y;++A){var R=S+A;A!=y&&ce()[R>>>0]!=0||(I=Se(I,R-I),h===void 0?h=I:(h+="\0",h+=I),I=R+1)}return Je(c),h},toWireType:function(c,h){h instanceof ArrayBuffer&&(h=new Uint8Array(h));var y=typeof h=="string";if(!(y||h instanceof Uint8Array||h instanceof Uint8ClampedArray||h instanceof Int8Array))throw new lt("Cannot pass non-string to std::string");var S=y?zn(h):h.length,I=Sr(4+S+1),A=I+4;if(ee()[I>>>2>>>0]=S,y)Mt(h,A,S+1);else if(y)for(y=0;y<S;++y){var R=h.charCodeAt(y);if(255<R)throw Je(I),new lt("String has UTF-16 code units that do not fit in 8 bits");ce()[A+y>>>0]=R}else for(y=0;y<S;++y)ce()[A+y>>>0]=h[y];return c!==null&&c.push(Je,I),I},zd:dt,readValueFromPointer:ci,Ad(c){Je(c)}})}var Fn=typeof TextDecoder<"u"?new TextDecoder("utf-16le"):void 0,cm=(n,u)=>{for(var c=n>>1,h=c+u/2;!(c>=h)&&K()[c>>>0];)++c;if(32<(c<<=1)-n&&Fn)return Fn.decode(ce().slice(n,c));for(c="",h=0;!(h>=u/2);++h){var y=U()[n+2*h>>>1>>>0];if(y==0)break;c+=String.fromCharCode(y)}return c},hm=(n,u,c)=>{if(c??=2147483647,2>c)return 0;var h=u;c=(c-=2)<2*n.length?c/2:n.length;for(var y=0;y<c;++y){var S=n.charCodeAt(y);U()[u>>>1>>>0]=S,u+=2}return U()[u>>>1>>>0]=0,u-h},fm=n=>2*n.length,mm=(n,u)=>{for(var c=0,h="";!(c>=u/4);){var y=B()[n+4*c>>>2>>>0];if(y==0)break;++c,65536<=y?(y-=65536,h+=String.fromCharCode(55296|y>>10,56320|1023&y)):h+=String.fromCharCode(y)}return h},gm=(n,u,c)=>{if(u>>>=0,c??=2147483647,4>c)return 0;var h=u;c=h+c-4;for(var y=0;y<n.length;++y){var S=n.charCodeAt(y);if(55296<=S&&57343>=S&&(S=65536+((1023&S)<<10)|1023&n.charCodeAt(++y)),B()[u>>>2>>>0]=S,(u+=4)+4>c)break}return B()[u>>>2>>>0]=0,u-h},ym=n=>{for(var u=0,c=0;c<n.length;++c){var h=n.charCodeAt(c);55296<=h&&57343>=h&&++c,u+=4}return u};function _m(n,u,c){if(n>>>=0,u>>>=0,c=Xe(c>>>=0),u===2)var h=cm,y=hm,S=fm,I=A=>K()[A>>>1>>>0];else u===4&&(h=mm,y=gm,S=ym,I=A=>ee()[A>>>2>>>0]);it(n,{name:c,fromWireType:A=>{for(var R,q=ee()[A>>>2>>>0],Q=A+4,J=0;J<=q;++J){var ue=A+4+J*u;J!=q&&I(ue)!=0||(Q=h(Q,ue-Q),R===void 0?R=Q:(R+="\0",R+=Q),Q=ue+u)}return Je(A),R},toWireType:(A,R)=>{if(typeof R!="string")throw new lt(`Cannot pass non-string to C++ string type ${c}`);var q=S(R),Q=Sr(4+q+u);return ee()[Q>>>2>>>0]=q/u,y(R,Q+4,q+u),A!==null&&A.push(Je,Q),Q},zd:dt,readValueFromPointer:ci,Ad(A){Je(A)}})}function wm(n,u){it(n>>>=0,{Qd:!0,name:u=Xe(u>>>0),zd:0,fromWireType:()=>{},toWireType:()=>{}})}function bm(n){bi(n>>>0,!s,1,!o,131072,!1),$n()}var hi=n=>{if(!se)try{if(n(),!(0<ot))try{l?$i(C):ni(C)}catch(u){u instanceof ri||u=="unwind"||w(0,u)}}catch(u){u instanceof ri||u=="unwind"||w(0,u)}};function fi(n){n>>>=0,typeof Atomics.ge=="function"&&(Atomics.ge(B(),n>>>2,n).value.then(mr),n+=128,Atomics.store(B(),n>>>2,1))}var mr=()=>{var n=xr();n&&(fi(n),hi(bs))};function $m(n,u){(n>>>=0)==u>>>0?setTimeout(mr):l?postMessage({Ed:n,yd:"checkMailbox"}):(n=_t[n])&&n.postMessage({yd:"checkMailbox"})}var mi=[];function vm(n,u,c,h,y){for(u>>>=0,h/=2,mi.length=h,c=y>>>0>>>3,y=0;y<h;y++)mi[y]=D[c+2*y]?D[c+2*y+1]:Re()[c+2*y+1>>>0];return(u?ti[u]:mg[n])(...mi)}var xm=()=>{ot=0};function Sm(n){n>>>=0,l?postMessage({yd:"cleanupThread",ee:n}):bn(_t[n])}function km(n){}var gr=(n,u)=>{var c=li[n];if(c===void 0)throw n=fs(n),c=Xe(n),Je(n),new lt(`${u} has unknown type ${c}`);return c},Gn=(n,u,c)=>{var h=[];return n=n.toWireType(h,c),h.length&&(ee()[u>>>2>>>0]=Pe(h)),n};function Tm(n,u,c){return u>>>=0,c>>>=0,n=Be(n>>>0),u=gr(u,"emval::as"),Gn(u,c,n)}function Im(n,u){return u>>>=0,n=Be(n>>>0),(u=gr(u,"emval::as")).toWireType(null,n)}var yr=n=>{try{n()}catch(u){rt(u)}},pt=0,Ye=null,Hn=0,_r=[],jn={},Kn={},Cm=0,gi=null,Em=[];function Qn(n){return(function(u){if(!se){if(pt===0){var c=!1,h=!1;u((y=0)=>{if(!se&&(Hn=y,c=!0,h)){pt=2,yr(()=>wo(Ye)),typeof MainLoop<"u"&&MainLoop.Md&&MainLoop.resume(),y=!1;try{var S=(function(){var R=B()[Ye+8>>>2>>>0];return R=P[Kn[R]],--ot,R()})()}catch(R){S=R,y=!0}var I=!1;if(!Ye){var A=gi;A&&(gi=null,(y?A.reject:A.resolve)(S),I=!0)}if(y&&!I)throw S}}),h=!0,c||(pt=1,Ye=(function(){var y=Sr(65548),S=y+12;ee()[y>>>2>>>0]=S,ee()[y+4>>>2>>>0]=S+65536,S=_r[0];var I=jn[S];return I===void 0&&(I=Cm++,jn[S]=I,Kn[I]=S),S=I,B()[y+8>>>2>>>0]=S,y})(),typeof MainLoop<"u"&&MainLoop.Md&&MainLoop.pause(),yr(()=>yo(Ye)))}else pt===2?(pt=0,yr(bo),Je(Ye),Ye=null,Em.forEach(hi)):rt(`invalid state: ${pt}`);return Hn}})(u=>{n().then(u)})}function zm(n){return n>>>=0,Qn(async()=>{var u=await Be(n);return Pe(u)})}var wr=[];function Am(n,u,c,h){return c>>>=0,h>>>=0,(n=wr[n>>>0])(null,u=Be(u>>>0),c,h)}var Om={},br=n=>{var u=Om[n];return u===void 0?Xe(n):u};function Rm(n,u,c,h,y){return c>>>=0,h>>>=0,y>>>=0,(n=wr[n>>>0])(u=Be(u>>>0),u[c=br(c)],h,y)}var Zn=()=>typeof globalThis=="object"?globalThis:Function("return this")();function Bm(n){return(n>>>=0)==0?Pe(Zn()):(n=br(n),Pe(Zn()[n]))}var Mm=n=>{var u=wr.length;return wr.push(n),u},Nm=(n,u)=>{for(var c=Array(n),h=0;h<n;++h)c[h]=gr(ee()[u+4*h>>>2>>>0],"parameter "+h);return c},Xn=(n,u)=>Object.defineProperty(u,"name",{value:n});function Dm(n,u,c){var h=(u=Nm(n,u>>>0)).shift();n--;var y=`return function (obj, func, destructorsRef, args) {
`,S=0,I=[];c===0&&I.push("obj");for(var A=["retType"],R=[h],q=0;q<n;++q)I.push("arg"+q),A.push("argType"+q),R.push(u[q]),y+=`  var arg${q} = argType${q}.readValueFromPointer(args${S?"+"+S:""});
`,S+=u[q].zd;return y+=`  var rv = ${c===1?"new func":"func.call"}(${I.join(", ")});
`,h.Qd||(A.push("emval_returnValue"),R.push(Gn),y+=`  return emval_returnValue(retType, destructorsRef, rv);
`),A.push(y+`};
`),n=(function(Q){var J=Function;if(!(J instanceof Function))throw new TypeError(`new_ called with constructor type ${typeof J} which is not a function`);var ue=Xn(J.name||"unknownFunctionName",function(){});return ue.prototype=J.prototype,ue=new ue,(Q=J.apply(ue,Q))instanceof Object?Q:ue})(A)(...R),c=`methodCaller<(${u.map(Q=>Q.name).join(", ")}) => ${h.name}>`,Mm(Xn(c,n))}function Pm(n){return n=br(n>>>0),Pe(r[n])}function Um(n,u){return u>>>=0,n=Be(n>>>0),u=Be(u),Pe(n[u])}function Wm(n){9<(n>>>=0)&&(at[n+1]+=1)}function qm(){return Pe([])}function Lm(n){n=Be(n>>>0);for(var u=Array(n.length),c=0;c<n.length;c++)u[c]=n[c];return Pe(u)}function Vm(n){return Pe(br(n>>>0))}function Fm(){return Pe({})}function Gm(n){for(var u=Be(n>>>=0);u.length;){var c=u.pop();u.pop()(c)}pi(n)}function Hm(n,u,c){u>>>=0,c>>>=0,n=Be(n>>>0),u=Be(u),c=Be(c),n[u]=c}function jm(n,u){return u>>>=0,n=(n=gr(n>>>0,"_emval_take_value")).readValueFromPointer(u),Pe(n)}function Km(n,u){n=-9007199254740992>n||9007199254740992<n?NaN:Number(n),u>>>=0,n=new Date(1e3*n),B()[u>>>2>>>0]=n.getUTCSeconds(),B()[u+4>>>2>>>0]=n.getUTCMinutes(),B()[u+8>>>2>>>0]=n.getUTCHours(),B()[u+12>>>2>>>0]=n.getUTCDate(),B()[u+16>>>2>>>0]=n.getUTCMonth(),B()[u+20>>>2>>>0]=n.getUTCFullYear()-1900,B()[u+24>>>2>>>0]=n.getUTCDay(),n=(n.getTime()-Date.UTC(n.getUTCFullYear(),0,1,0,0,0,0))/864e5|0,B()[u+28>>>2>>>0]=n}var Yn=n=>n%4==0&&(n%100!=0||n%400==0),Jn=[0,31,60,91,121,152,182,213,244,274,305,335],es=[0,31,59,90,120,151,181,212,243,273,304,334];function Qm(n,u){n=-9007199254740992>n||9007199254740992<n?NaN:Number(n),u>>>=0,n=new Date(1e3*n),B()[u>>>2>>>0]=n.getSeconds(),B()[u+4>>>2>>>0]=n.getMinutes(),B()[u+8>>>2>>>0]=n.getHours(),B()[u+12>>>2>>>0]=n.getDate(),B()[u+16>>>2>>>0]=n.getMonth(),B()[u+20>>>2>>>0]=n.getFullYear()-1900,B()[u+24>>>2>>>0]=n.getDay();var c=(Yn(n.getFullYear())?Jn:es)[n.getMonth()]+n.getDate()-1|0;B()[u+28>>>2>>>0]=c,B()[u+36>>>2>>>0]=-60*n.getTimezoneOffset(),c=new Date(n.getFullYear(),6,1).getTimezoneOffset();var h=new Date(n.getFullYear(),0,1).getTimezoneOffset();n=0|(c!=h&&n.getTimezoneOffset()==Math.min(h,c)),B()[u+32>>>2>>>0]=n}function Zm(n){n>>>=0;var u=new Date(B()[n+20>>>2>>>0]+1900,B()[n+16>>>2>>>0],B()[n+12>>>2>>>0],B()[n+8>>>2>>>0],B()[n+4>>>2>>>0],B()[n>>>2>>>0],0),c=B()[n+32>>>2>>>0],h=u.getTimezoneOffset(),y=new Date(u.getFullYear(),6,1).getTimezoneOffset(),S=new Date(u.getFullYear(),0,1).getTimezoneOffset(),I=Math.min(S,y);return 0>c?B()[n+32>>>2>>>0]=+(y!=S&&I==h):0<c!=(I==h)&&(y=Math.max(S,y),u.setTime(u.getTime()+6e4*((0<c?I:y)-h))),B()[n+24>>>2>>>0]=u.getDay(),c=(Yn(u.getFullYear())?Jn:es)[u.getMonth()]+u.getDate()-1|0,B()[n+28>>>2>>>0]=c,B()[n>>>2>>>0]=u.getSeconds(),B()[n+4>>>2>>>0]=u.getMinutes(),B()[n+8>>>2>>>0]=u.getHours(),B()[n+12>>>2>>>0]=u.getDate(),B()[n+16>>>2>>>0]=u.getMonth(),B()[n+20>>>2>>>0]=u.getYear(),n=u.getTime(),BigInt(isNaN(n)?-1:n/1e3)}function ts(n,u,c,h,y,S,I){return l?we(16,1,n,u,c,h,y,S,I):-52}function rs(n,u,c,h,y,S){if(l)return we(17,1,n,u,c,h,y,S)}var jt={},Xm=()=>performance.timeOrigin+performance.now();function is(n,u){if(l)return we(18,1,n,u);if(jt[n]&&(clearTimeout(jt[n].id),delete jt[n]),!u)return 0;var c=setTimeout(()=>{delete jt[n],hi(()=>ws(n,performance.timeOrigin+performance.now()))},u);return jt[n]={id:c,ke:u},0}function Ym(n,u,c,h){n>>>=0,u>>>=0,c>>>=0,h>>>=0;var y=new Date().getFullYear(),S=new Date(y,0,1).getTimezoneOffset();y=new Date(y,6,1).getTimezoneOffset();var I=Math.max(S,y);ee()[n>>>2>>>0]=60*I,B()[u>>>2>>>0]=+(S!=y),n=(u=A=>{var R=Math.abs(A);return`UTC${0<=A?"-":"+"}${String(Math.floor(R/60)).padStart(2,"0")}${String(R%60).padStart(2,"0")}`})(S),u=u(y),y<S?(Mt(n,c,17),Mt(u,h,17)):(Mt(n,h,17),Mt(u,c,17))}var Jm=()=>Date.now(),eg=1;function tg(n,u,c){if(!(0<=n&&3>=n))return 28;if(n===0)n=Date.now();else{if(!eg)return 52;n=performance.timeOrigin+performance.now()}return D[c>>>0>>>3]=BigInt(Math.round(1e6*n)),0}var yi=[],as=(n,u)=>{yi.length=0;for(var c;c=ce()[n++>>>0];){var h=c!=105;u+=(h&=c!=112)&&u%8?4:0,yi.push(c==112?ee()[u>>>2>>>0]:c==106?D[u>>>3]:c==105?B()[u>>>2>>>0]:Re()[u>>>3>>>0]),u+=h?8:4}return yi};function rg(n,u,c){return n>>>=0,u=as(u>>>0,c>>>0),ti[n](...u)}function ig(n,u,c){return n>>>=0,u=as(u>>>0,c>>>0),ti[n](...u)}var ag=()=>{};function ng(n,u){return b(Se(n>>>0,u>>>0))}var sg=()=>{throw ot+=1,"unwind"};function og(){return 4294901760}var ug=()=>navigator.hardwareConcurrency;function lg(){return rt("Cannot use emscripten_pc_get_function without -sUSE_OFFSET_CONVERTER"),0}function dg(n){n>>>=0;var u=ce().length;if(n<=u||4294901760<n)return!1;for(var c=1;4>=c;c*=2){var h=u*(1+.2/c);h=Math.min(h,n+100663296);e:{h=(Math.min(4294901760,65536*Math.ceil(Math.max(n,h)/65536))-k.buffer.byteLength+65535)/65536|0;try{k.grow(h),Oe();var y=1;break e}catch{}y=void 0}if(y)return!0}return!1}var $r=()=>(rt("Cannot use convertFrameToPC (needed by __builtin_return_address) without -sUSE_OFFSET_CONVERTER"),0),Nt={},ns=n=>{n.forEach(u=>{var c=$r();c&&(Nt[c]=u)})};function pg(){var n=Error().stack.toString().split(`
`);return n[0]=="Error"&&n.shift(),ns(n),Nt.Kd=$r(),Nt.ae=n,Nt.Kd}function cg(n,u,c){if(n>>>=0,u>>>=0,Nt.Kd==n)var h=Nt.ae;else(h=Error().stack.toString().split(`
`))[0]=="Error"&&h.shift(),ns(h);for(var y=3;h[y]&&$r()!=n;)++y;for(n=0;n<c&&h[n+y];++n)B()[u+4*n>>>2>>>0]=$r();return n}var _i,wi={},ss=()=>{if(!_i){var n,u={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:(typeof navigator=="object"&&navigator.languages&&navigator.languages[0]||"C").replace("-","_")+".UTF-8",_:"./this.program"};for(n in wi)wi[n]===void 0?delete u[n]:u[n]=wi[n];var c=[];for(n in u)c.push(`${n}=${u[n]}`);_i=c}return _i};function os(n,u){if(l)return we(19,1,n,u);n>>>=0,u>>>=0;var c=0;return ss().forEach((h,y)=>{var S=u+c;for(y=ee()[n+4*y>>>2>>>0]=S,S=0;S<h.length;++S)F()[y++>>>0]=h.charCodeAt(S);F()[y>>>0]=0,c+=h.length+1}),0}function us(n,u){if(l)return we(20,1,n,u);n>>>=0,u>>>=0;var c=ss();ee()[n>>>2>>>0]=c.length;var h=0;return c.forEach(y=>h+=y.length+1),ee()[u>>>2>>>0]=h,0}function ls(n){return l?we(21,1,n):52}function ds(n,u,c,h){return l?we(22,1,n,u,c,h):52}function ps(n,u,c,h){return l?we(23,1,n,u,c,h):70}var hg=[null,[],[]];function cs(n,u,c,h){if(l)return we(24,1,n,u,c,h);u>>>=0,c>>>=0,h>>>=0;for(var y=0,S=0;S<c;S++){var I=ee()[u>>>2>>>0],A=ee()[u+4>>>2>>>0];u+=8;for(var R=0;R<A;R++){var q=ce()[I+R>>>0],Q=hg[n];q===0||q===10?((n===1?v:b)(In(Q)),Q.length=0):Q.push(q)}y+=A}return ee()[h>>>2>>>0]=y,0}function fg(n){return n>>>0}l||(function(){for(var n=r.numThreads-1;n--;)xn();ii.unshift(()=>{Ft++,(function(u){l?u():Promise.all(ut.map(vn)).then(u)})(()=>fn())})})();for(var hs=Array(256),vr=0;256>vr;++vr)hs[vr]=String.fromCharCode(vr);Ln=hs,lt=r.BindingError=class extends Error{constructor(n){super(n),this.name="BindingError"}},r.InternalError=class extends Error{constructor(n){super(n),this.name="InternalError"}},at.push(0,1,void 0,1,null,1,!0,1,!1,1),r.count_emval_handles=()=>at.length/2-5-di.length;var P,mg=[ai,_n,Sn,Cn,En,An,On,Rn,Bn,Mn,Nn,Dn,Pn,Un,Wn,qn,ts,rs,is,os,us,ls,ds,ps,cs];(async function(){function n(h,y){return P=h.exports,P=(function(){var S=P,I={};for(let[A,R]of Object.entries(S))I[A]=typeof R=="function"?(...q)=>{_r.push(A);try{return R(...q)}finally{se||(_r.pop(),Ye&&pt===1&&_r.length===0&&(pt=0,ot+=1,yr(_o),typeof Fibers<"u"&&Fibers.le()))}}:R;return I})(),P=(function(){var S=P,I=R=>q=>R(q)>>>0,A=R=>()=>R()>>>0;return(S=Object.assign({},S)).Cb=I(S.Cb),S.fc=A(S.fc),S.ic=I(S.ic),S.vc=I(S.vc),S.wc=A(S.wc),S.Ac=I(S.Ac),S})(),wn.push(P.jc),T=y,fn(),P}Ft++;var u=mn();if(r.instantiateWasm)return new Promise(h=>{r.instantiateWasm(u,(y,S)=>{n(y,S),h(y.exports)})});if(l)return new Promise(h=>{xe=y=>{var S=new WebAssembly.Instance(y,mn());h(n(S,y))}});ei??=r.locateFile?r.locateFile?r.locateFile("ort-wasm-simd-threaded.jsep.wasm",_):_+"ort-wasm-simd-threaded.jsep.wasm":new URL("ort-wasm-simd-threaded.jsep.wasm",import.meta.url).href;try{var c=await(async function(h){var y=ei;if(!j&&typeof WebAssembly.instantiateStreaming=="function"&&!pe(y))try{var S=fetch(y,{credentials:"same-origin"});return await WebAssembly.instantiateStreaming(S,h)}catch(I){b(`wasm streaming compile failed: ${I}`),b("falling back to ArrayBuffer instantiation")}return(async function(I,A){try{var R=await(async function(q){if(!j)try{var Q=await f(q);return new Uint8Array(Q)}catch{}if(q==ei&&j)q=new Uint8Array(j);else{if(!m)throw"both async and sync fetching of the wasm failed";q=m(q)}return q})(I);return await WebAssembly.instantiate(R,A)}catch(q){b(`failed to asynchronously prepare wasm: ${q}`),rt(q)}})(y,h)})(u);return n(c.instance,c.module)}catch(h){return i(h),Promise.reject(h)}})();var fs=n=>(fs=P.Cb)(n),ms=()=>(ms=P.Db)();r._OrtInit=(n,u)=>(r._OrtInit=P.Eb)(n,u),r._OrtGetLastError=(n,u)=>(r._OrtGetLastError=P.Fb)(n,u),r._OrtCreateSessionOptions=(n,u,c,h,y,S,I,A,R,q)=>(r._OrtCreateSessionOptions=P.Gb)(n,u,c,h,y,S,I,A,R,q),r._OrtAppendExecutionProvider=(n,u)=>(r._OrtAppendExecutionProvider=P.Hb)(n,u),r._OrtAddFreeDimensionOverride=(n,u,c)=>(r._OrtAddFreeDimensionOverride=P.Ib)(n,u,c),r._OrtAddSessionConfigEntry=(n,u,c)=>(r._OrtAddSessionConfigEntry=P.Jb)(n,u,c),r._OrtReleaseSessionOptions=n=>(r._OrtReleaseSessionOptions=P.Kb)(n),r._OrtCreateSession=(n,u,c)=>(r._OrtCreateSession=P.Lb)(n,u,c),r._OrtReleaseSession=n=>(r._OrtReleaseSession=P.Mb)(n),r._OrtGetInputOutputCount=(n,u,c)=>(r._OrtGetInputOutputCount=P.Nb)(n,u,c),r._OrtGetInputName=(n,u)=>(r._OrtGetInputName=P.Ob)(n,u),r._OrtGetOutputName=(n,u)=>(r._OrtGetOutputName=P.Pb)(n,u),r._OrtFree=n=>(r._OrtFree=P.Qb)(n),r._OrtCreateTensor=(n,u,c,h,y,S)=>(r._OrtCreateTensor=P.Rb)(n,u,c,h,y,S),r._OrtGetTensorData=(n,u,c,h,y)=>(r._OrtGetTensorData=P.Sb)(n,u,c,h,y),r._OrtReleaseTensor=n=>(r._OrtReleaseTensor=P.Tb)(n),r._OrtCreateRunOptions=(n,u,c,h)=>(r._OrtCreateRunOptions=P.Ub)(n,u,c,h),r._OrtAddRunConfigEntry=(n,u,c)=>(r._OrtAddRunConfigEntry=P.Vb)(n,u,c),r._OrtReleaseRunOptions=n=>(r._OrtReleaseRunOptions=P.Wb)(n),r._OrtCreateBinding=n=>(r._OrtCreateBinding=P.Xb)(n),r._OrtBindInput=(n,u,c)=>(r._OrtBindInput=P.Yb)(n,u,c),r._OrtBindOutput=(n,u,c,h)=>(r._OrtBindOutput=P.Zb)(n,u,c,h),r._OrtClearBoundOutputs=n=>(r._OrtClearBoundOutputs=P._b)(n),r._OrtReleaseBinding=n=>(r._OrtReleaseBinding=P.$b)(n),r._OrtRunWithBinding=(n,u,c,h,y)=>(r._OrtRunWithBinding=P.ac)(n,u,c,h,y),r._OrtRun=(n,u,c,h,y,S,I,A)=>(r._OrtRun=P.bc)(n,u,c,h,y,S,I,A),r._OrtEndProfiling=n=>(r._OrtEndProfiling=P.cc)(n),r._JsepOutput=(n,u,c)=>(r._JsepOutput=P.dc)(n,u,c),r._JsepGetNodeName=n=>(r._JsepGetNodeName=P.ec)(n);var xr=()=>(xr=P.fc)(),Je=r._free=n=>(Je=r._free=P.gc)(n),Sr=r._malloc=n=>(Sr=r._malloc=P.ic)(n),bi=(n,u,c,h,y,S)=>(bi=P.kc)(n,u,c,h,y,S),gs=()=>(gs=P.lc)(),ys=(n,u,c,h,y)=>(ys=P.mc)(n,u,c,h,y),_s=n=>(_s=P.nc)(n),$i=n=>($i=P.oc)(n),ws=(n,u)=>(ws=P.pc)(n,u),bs=()=>(bs=P.qc)(),oe=(n,u)=>(oe=P.rc)(n,u),Kt=n=>(Kt=P.sc)(n),$s=(n,u)=>($s=P.tc)(n,u),ae=n=>(ae=P.uc)(n),vi=n=>(vi=P.vc)(n),ne=()=>(ne=P.wc)(),vs=n=>(vs=P.xc)(n),xs=n=>(xs=P.yc)(n),Ss=(n,u,c)=>(Ss=P.zc)(n,u,c),ks=n=>(ks=P.Ac)(n),Ts=r.dynCall_iii=(n,u,c)=>(Ts=r.dynCall_iii=P.Bc)(n,u,c),Is=r.dynCall_vi=(n,u)=>(Is=r.dynCall_vi=P.Cc)(n,u),xi=r.dynCall_ii=(n,u)=>(xi=r.dynCall_ii=P.Dc)(n,u),Cs=r.dynCall_vii=(n,u,c)=>(Cs=r.dynCall_vii=P.Ec)(n,u,c),Es=r.dynCall_iiii=(n,u,c,h)=>(Es=r.dynCall_iiii=P.Fc)(n,u,c,h),zs=r.dynCall_viii=(n,u,c,h)=>(zs=r.dynCall_viii=P.Gc)(n,u,c,h),As=r.dynCall_iiiii=(n,u,c,h,y)=>(As=r.dynCall_iiiii=P.Hc)(n,u,c,h,y),Os=r.dynCall_viiii=(n,u,c,h,y)=>(Os=r.dynCall_viiii=P.Ic)(n,u,c,h,y),Rs=r.dynCall_viiiiii=(n,u,c,h,y,S,I)=>(Rs=r.dynCall_viiiiii=P.Jc)(n,u,c,h,y,S,I),Bs=r.dynCall_viiiiiii=(n,u,c,h,y,S,I,A)=>(Bs=r.dynCall_viiiiiii=P.Kc)(n,u,c,h,y,S,I,A),Ms=r.dynCall_ji=(n,u)=>(Ms=r.dynCall_ji=P.Lc)(n,u),Ns=r.dynCall_v=n=>(Ns=r.dynCall_v=P.Mc)(n),Ds=r.dynCall_viiiii=(n,u,c,h,y,S)=>(Ds=r.dynCall_viiiii=P.Nc)(n,u,c,h,y,S),Ps=r.dynCall_i=n=>(Ps=r.dynCall_i=P.Oc)(n),Us=r.dynCall_fii=(n,u,c)=>(Us=r.dynCall_fii=P.Pc)(n,u,c),Ws=r.dynCall_viiiiiiii=(n,u,c,h,y,S,I,A,R)=>(Ws=r.dynCall_viiiiiiii=P.Qc)(n,u,c,h,y,S,I,A,R),qs=r.dynCall_viiiiiiiiii=(n,u,c,h,y,S,I,A,R,q,Q)=>(qs=r.dynCall_viiiiiiiiii=P.Rc)(n,u,c,h,y,S,I,A,R,q,Q),Ls=r.dynCall_jiii=(n,u,c,h)=>(Ls=r.dynCall_jiii=P.Sc)(n,u,c,h),Vs=r.dynCall_dii=(n,u,c)=>(Vs=r.dynCall_dii=P.Tc)(n,u,c),Fs=r.dynCall_viiiiiiiii=(n,u,c,h,y,S,I,A,R,q)=>(Fs=r.dynCall_viiiiiiiii=P.Uc)(n,u,c,h,y,S,I,A,R,q),Gs=r.dynCall_viiiiiiiiiii=(n,u,c,h,y,S,I,A,R,q,Q,J)=>(Gs=r.dynCall_viiiiiiiiiii=P.Vc)(n,u,c,h,y,S,I,A,R,q,Q,J),Hs=r.dynCall_iiiiii=(n,u,c,h,y,S)=>(Hs=r.dynCall_iiiiii=P.Wc)(n,u,c,h,y,S),js=r.dynCall_iij=(n,u,c)=>(js=r.dynCall_iij=P.Xc)(n,u,c),Ks=r.dynCall_iiiiiiiiii=(n,u,c,h,y,S,I,A,R,q)=>(Ks=r.dynCall_iiiiiiiiii=P.Yc)(n,u,c,h,y,S,I,A,R,q),Qs=r.dynCall_iiiiiiiiiii=(n,u,c,h,y,S,I,A,R,q,Q)=>(Qs=r.dynCall_iiiiiiiiiii=P.Zc)(n,u,c,h,y,S,I,A,R,q,Q),Zs=r.dynCall_vij=(n,u,c)=>(Zs=r.dynCall_vij=P._c)(n,u,c),Xs=r.dynCall_iiif=(n,u,c,h)=>(Xs=r.dynCall_iiif=P.$c)(n,u,c,h),Ys=r.dynCall_iiij=(n,u,c,h)=>(Ys=r.dynCall_iiij=P.ad)(n,u,c,h),Js=r.dynCall_fiii=(n,u,c,h)=>(Js=r.dynCall_fiii=P.bd)(n,u,c,h),eo=r.dynCall_viiiiiiiiiiiii=(n,u,c,h,y,S,I,A,R,q,Q,J,ue,ye)=>(eo=r.dynCall_viiiiiiiiiiiii=P.cd)(n,u,c,h,y,S,I,A,R,q,Q,J,ue,ye),to=r.dynCall_vjiii=(n,u,c,h,y)=>(to=r.dynCall_vjiii=P.dd)(n,u,c,h,y),ro=r.dynCall_vif=(n,u,c)=>(ro=r.dynCall_vif=P.ed)(n,u,c),io=r.dynCall_iiiiiii=(n,u,c,h,y,S,I)=>(io=r.dynCall_iiiiiii=P.fd)(n,u,c,h,y,S,I),ao=r.dynCall_iiiij=(n,u,c,h,y)=>(ao=r.dynCall_iiiij=P.gd)(n,u,c,h,y),no=r.dynCall_iiiiiiii=(n,u,c,h,y,S,I,A)=>(no=r.dynCall_iiiiiiii=P.hd)(n,u,c,h,y,S,I,A),so=r.dynCall_viiiiiiiiiiii=(n,u,c,h,y,S,I,A,R,q,Q,J,ue)=>(so=r.dynCall_viiiiiiiiiiii=P.id)(n,u,c,h,y,S,I,A,R,q,Q,J,ue),oo=r.dynCall_diii=(n,u,c,h)=>(oo=r.dynCall_diii=P.jd)(n,u,c,h),uo=r.dynCall_jiiii=(n,u,c,h,y)=>(uo=r.dynCall_jiiii=P.kd)(n,u,c,h,y),lo=r.dynCall_viiij=(n,u,c,h,y)=>(lo=r.dynCall_viiij=P.ld)(n,u,c,h,y),po=r.dynCall_fiiii=(n,u,c,h,y)=>(po=r.dynCall_fiiii=P.md)(n,u,c,h,y),co=r.dynCall_viiif=(n,u,c,h,y)=>(co=r.dynCall_viiif=P.nd)(n,u,c,h,y),ho=r.dynCall_diiii=(n,u,c,h,y)=>(ho=r.dynCall_diiii=P.od)(n,u,c,h,y),fo=r.dynCall_viiid=(n,u,c,h,y)=>(fo=r.dynCall_viiid=P.pd)(n,u,c,h,y),mo=r.dynCall_iiiijii=(n,u,c,h,y,S,I)=>(mo=r.dynCall_iiiijii=P.qd)(n,u,c,h,y,S,I),go=r.dynCall_iiiiiij=(n,u,c,h,y,S,I)=>(go=r.dynCall_iiiiiij=P.rd)(n,u,c,h,y,S,I),yo=n=>(yo=P.sd)(n),_o=()=>(_o=P.td)(),wo=n=>(wo=P.ud)(n),bo=()=>(bo=P.vd)();function gg(n,u,c){var h=ne();try{Cs(n,u,c)}catch(y){if(ae(h),y!==y+0)throw y;oe(1,0)}}function yg(n,u,c){var h=ne();try{return Ts(n,u,c)}catch(y){if(ae(h),y!==y+0)throw y;oe(1,0)}}function _g(n,u){var c=ne();try{Is(n,u)}catch(h){if(ae(c),h!==h+0)throw h;oe(1,0)}}function wg(n,u){var c=ne();try{return xi(n,u)}catch(h){if(ae(c),h!==h+0)throw h;oe(1,0)}}function bg(n,u,c,h){var y=ne();try{return Es(n,u,c,h)}catch(S){if(ae(y),S!==S+0)throw S;oe(1,0)}}function $g(n,u,c,h,y){var S=ne();try{Os(n,u,c,h,y)}catch(I){if(ae(S),I!==I+0)throw I;oe(1,0)}}function vg(n,u,c,h,y){var S=ne();try{return As(n,u,c,h,y)}catch(I){if(ae(S),I!==I+0)throw I;oe(1,0)}}function xg(n,u,c,h){var y=ne();try{zs(n,u,c,h)}catch(S){if(ae(y),S!==S+0)throw S;oe(1,0)}}function Sg(n,u,c,h,y,S,I){var A=ne();try{return io(n,u,c,h,y,S,I)}catch(R){if(ae(A),R!==R+0)throw R;oe(1,0)}}function kg(n){var u=ne();try{Ns(n)}catch(c){if(ae(u),c!==c+0)throw c;oe(1,0)}}function Tg(n,u,c){var h=ne();try{return js(n,u,c)}catch(y){if(ae(h),y!==y+0)throw y;oe(1,0)}}function Ig(n,u,c,h,y,S){var I=ne();try{Ds(n,u,c,h,y,S)}catch(A){if(ae(I),A!==A+0)throw A;oe(1,0)}}function Cg(n,u,c){var h=ne();try{Zs(n,u,c)}catch(y){if(ae(h),y!==y+0)throw y;oe(1,0)}}function Eg(n,u,c,h,y,S,I){var A=ne();try{Rs(n,u,c,h,y,S,I)}catch(R){if(ae(A),R!==R+0)throw R;oe(1,0)}}function zg(n,u,c,h,y,S,I,A){var R=ne();try{Bs(n,u,c,h,y,S,I,A)}catch(q){if(ae(R),q!==q+0)throw q;oe(1,0)}}function Ag(n,u,c,h,y,S){var I=ne();try{return Hs(n,u,c,h,y,S)}catch(A){if(ae(I),A!==A+0)throw A;oe(1,0)}}function Og(n,u,c,h,y,S,I,A){var R=ne();try{return no(n,u,c,h,y,S,I,A)}catch(q){if(ae(R),q!==q+0)throw q;oe(1,0)}}function Rg(n,u,c,h,y,S,I,A,R,q){var Q=ne();try{Fs(n,u,c,h,y,S,I,A,R,q)}catch(J){if(ae(Q),J!==J+0)throw J;oe(1,0)}}function Bg(n,u,c,h,y,S,I,A,R){var q=ne();try{Ws(n,u,c,h,y,S,I,A,R)}catch(Q){if(ae(q),Q!==Q+0)throw Q;oe(1,0)}}function Mg(n){var u=ne();try{return Ps(n)}catch(c){if(ae(u),c!==c+0)throw c;oe(1,0)}}function Ng(n,u,c,h,y,S,I,A,R,q){var Q=ne();try{return Ks(n,u,c,h,y,S,I,A,R,q)}catch(J){if(ae(Q),J!==J+0)throw J;oe(1,0)}}function Dg(n,u,c){var h=ne();try{return Us(n,u,c)}catch(y){if(ae(h),y!==y+0)throw y;oe(1,0)}}function Pg(n,u,c,h){var y=ne();try{return Ls(n,u,c,h)}catch(S){if(ae(y),S!==S+0)throw S;return oe(1,0),0n}}function Ug(n,u,c){var h=ne();try{return Vs(n,u,c)}catch(y){if(ae(h),y!==y+0)throw y;oe(1,0)}}function Wg(n,u,c,h,y,S,I,A,R,q,Q,J){var ue=ne();try{Gs(n,u,c,h,y,S,I,A,R,q,Q,J)}catch(ye){if(ae(ue),ye!==ye+0)throw ye;oe(1,0)}}function qg(n,u,c,h,y,S,I,A,R,q,Q){var J=ne();try{qs(n,u,c,h,y,S,I,A,R,q,Q)}catch(ue){if(ae(J),ue!==ue+0)throw ue;oe(1,0)}}function Lg(n,u,c,h,y,S,I,A,R,q,Q){var J=ne();try{return Qs(n,u,c,h,y,S,I,A,R,q,Q)}catch(ue){if(ae(J),ue!==ue+0)throw ue;oe(1,0)}}function Vg(n,u,c,h){var y=ne();try{return Xs(n,u,c,h)}catch(S){if(ae(y),S!==S+0)throw S;oe(1,0)}}function Fg(n,u,c,h){var y=ne();try{return Ys(n,u,c,h)}catch(S){if(ae(y),S!==S+0)throw S;oe(1,0)}}function Gg(n,u,c,h){var y=ne();try{return Js(n,u,c,h)}catch(S){if(ae(y),S!==S+0)throw S;oe(1,0)}}function Hg(n,u,c,h,y,S,I,A,R,q,Q,J,ue,ye){var Ue=ne();try{eo(n,u,c,h,y,S,I,A,R,q,Q,J,ue,ye)}catch(Qt){if(ae(Ue),Qt!==Qt+0)throw Qt;oe(1,0)}}function jg(n,u,c,h,y){var S=ne();try{to(n,u,c,h,y)}catch(I){if(ae(S),I!==I+0)throw I;oe(1,0)}}function Kg(n,u,c){var h=ne();try{ro(n,u,c)}catch(y){if(ae(h),y!==y+0)throw y;oe(1,0)}}function Qg(n,u){var c=ne();try{return Ms(n,u)}catch(h){if(ae(c),h!==h+0)throw h;return oe(1,0),0n}}function Zg(n,u,c,h,y){var S=ne();try{return ao(n,u,c,h,y)}catch(I){if(ae(S),I!==I+0)throw I;oe(1,0)}}function Xg(n,u,c,h,y,S,I,A,R,q,Q,J,ue){var ye=ne();try{so(n,u,c,h,y,S,I,A,R,q,Q,J,ue)}catch(Ue){if(ae(ye),Ue!==Ue+0)throw Ue;oe(1,0)}}function Yg(n,u,c,h){var y=ne();try{return oo(n,u,c,h)}catch(S){if(ae(y),S!==S+0)throw S;oe(1,0)}}function Jg(n,u,c,h,y){var S=ne();try{return uo(n,u,c,h,y)}catch(I){if(ae(S),I!==I+0)throw I;return oe(1,0),0n}}function ey(n,u,c,h,y){var S=ne();try{lo(n,u,c,h,y)}catch(I){if(ae(S),I!==I+0)throw I;oe(1,0)}}function ty(n,u,c,h,y){var S=ne();try{return po(n,u,c,h,y)}catch(I){if(ae(S),I!==I+0)throw I;oe(1,0)}}function ry(n,u,c,h,y){var S=ne();try{co(n,u,c,h,y)}catch(I){if(ae(S),I!==I+0)throw I;oe(1,0)}}function iy(n,u,c,h,y){var S=ne();try{return ho(n,u,c,h,y)}catch(I){if(ae(S),I!==I+0)throw I;oe(1,0)}}function ay(n,u,c,h,y){var S=ne();try{fo(n,u,c,h,y)}catch(I){if(ae(S),I!==I+0)throw I;oe(1,0)}}function ny(n,u,c,h,y,S,I){var A=ne();try{return mo(n,u,c,h,y,S,I)}catch(R){if(ae(A),R!==R+0)throw R;oe(1,0)}}function sy(n,u,c,h,y,S,I){var A=ne();try{return go(n,u,c,h,y,S,I)}catch(R){if(ae(A),R!==R+0)throw R;oe(1,0)}}return r.stackSave=()=>ne(),r.stackRestore=n=>ae(n),r.stackAlloc=n=>vi(n),r.setValue=function(n,u,c="i8"){switch(c.endsWith("*")&&(c="*"),c){case"i1":case"i8":F()[n>>>0]=u;break;case"i16":U()[n>>>1>>>0]=u;break;case"i32":B()[n>>>2>>>0]=u;break;case"i64":D[n>>>3]=BigInt(u);break;case"float":ve()[n>>>2>>>0]=u;break;case"double":Re()[n>>>3>>>0]=u;break;case"*":ee()[n>>>2>>>0]=u;break;default:rt(`invalid type for setValue: ${c}`)}},r.getValue=function(n,u="i8"){switch(u.endsWith("*")&&(u="*"),u){case"i1":case"i8":return F()[n>>>0];case"i16":return U()[n>>>1>>>0];case"i32":return B()[n>>>2>>>0];case"i64":return D[n>>>3];case"float":return ve()[n>>>2>>>0];case"double":return Re()[n>>>3>>>0];case"*":return ee()[n>>>2>>>0];default:rt(`invalid type for getValue: ${u}`)}},r.UTF8ToString=Se,r.stringToUTF8=Mt,r.lengthBytesUTF8=zn,(function n(){if(0<Ft)Gt=n;else if(l)t(r),hr();else{for(;0<ii.length;)ii.shift()(r);0<Ft?Gt=n:(r.calledRun=!0,se||(hr(),t(r)))}})(),r.PTR_SIZE=4,a}),$p=zi,vo=globalThis.self?.name?.startsWith("em-pthread"),vo&&zi()}),Ai,xo,Me,vp,Tr,So,ko,Oi,To,Ri,xp,Bi,Sp,Da=L(()=>{"use strict";Na(),Ai=typeof location>"u"?void 0:location.origin,xo=()=>import.meta.url?.startsWith("file:")?new URL(new URL("ort.bundle.min.mjs",import.meta.url).href,Ai).href:import.meta.url,Me=xo(),vp=()=>{if(Me&&!Me.startsWith("blob:"))return Me.substring(0,Me.lastIndexOf("/")+1)},Tr=(e,t)=>{try{let i=t??Me;return(i?new URL(e,i):new URL(e)).origin===Ai}catch{return!1}},So=(e,t)=>{let i=t??Me;try{return(i?new URL(e,i):new URL(e)).href}catch{return}},ko=(e,t)=>`${t??"./"}${e}`,Oi=async e=>{let t=await(await fetch(e,{credentials:"same-origin"})).blob();return URL.createObjectURL(t)},To=async e=>(await import(e)).default,Ri=(Iy(),qr(_p)).default,xp=async()=>{if(!Me)throw new Error("Failed to load proxy worker: cannot determine the script source URL.");if(Tr(Me))return[void 0,Ri()];let e=await Oi(Me);return[e,Ri(e)]},Bi=(Cy(),qr(bp)).default,Sp=async(e,t,i)=>{if(!e&&!t&&Bi&&Me&&Tr(Me))return[void 0,Bi];{let r="ort-wasm-simd-threaded.jsep.mjs",a=e??So(r,t),o=i&&a&&!Tr(a,t),s=o?await Oi(a):a??ko(r,t);return[o?s:void 0,await To(s)]}}}),Mi,Ir,Xt,Ni,Io,Co,Pa,ke,At=L(()=>{"use strict";Da(),Ir=!1,Xt=!1,Ni=!1,Io=()=>{if(typeof SharedArrayBuffer>"u")return!1;try{return typeof MessageChannel<"u"&&new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)),WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,5,4,1,3,1,1,10,11,1,9,0,65,0,254,16,2,0,26,11]))}catch{return!1}},Co=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,30,1,28,0,65,0,253,15,253,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,253,186,1,26,11]))}catch{return!1}},Pa=async e=>{if(Ir)return Promise.resolve();if(Xt)throw new Error("multiple calls to 'initializeWebAssembly()' detected.");if(Ni)throw new Error("previous call to 'initializeWebAssembly()' failed.");Xt=!0;let t=e.initTimeout,i=e.numThreads;if(!Co())throw new Error("WebAssembly SIMD is not supported in the current environment.");let r=Io();i>1&&!r&&(typeof self<"u"&&!self.crossOriginIsolated&&console.warn("env.wasm.numThreads is set to "+i+", but this will not work unless you enable crossOriginIsolated mode. See https://web.dev/cross-origin-isolation-guide/ for more info."),console.warn("WebAssembly multi-threading is not supported in the current environment. Falling back to single-threading."),e.numThreads=i=1);let a=e.wasmPaths,o=typeof a=="string"?a:void 0,s=a?.mjs,l=s?.href??s,d=a?.wasm,p=d?.href??d,f=e.wasmBinary,[m,g]=await Sp(l,o,i>1),w=!1,_=[];if(t>0&&_.push(new Promise($=>{setTimeout(()=>{w=!0,$()},t)})),_.push(new Promise(($,x)=>{let v={numThreads:i};if(f)v.wasmBinary=f;else if(p||o)v.locateFile=b=>p??o+b;else if(l&&l.indexOf("blob:")!==0)v.locateFile=b=>new URL(b,l).href;else if(m){let b=vp();b&&(v.locateFile=k=>b+k)}g(v).then(b=>{Xt=!1,Ir=!0,Mi=b,$(),m&&URL.revokeObjectURL(m)},b=>{Xt=!1,Ni=!0,x(b)})})),await Promise.race(_),w)throw new Error(`WebAssembly backend initializing failed due to timeout: ${t}ms`)},ke=()=>{if(Ir&&Mi)return Mi;throw new Error("WebAssembly is not initialized yet.")}}),Ee,Lr,me,Ua=L(()=>{"use strict";At(),Ee=(e,t)=>{let i=ke(),r=i.lengthBytesUTF8(e)+1,a=i._malloc(r);return i.stringToUTF8(e,a,r),t.push(a),a},Lr=(e,t,i,r)=>{if(typeof e=="object"&&e!==null){if(i.has(e))throw new Error("Circular reference in options");i.add(e)}Object.entries(e).forEach(([a,o])=>{let s=t?t+a:a;if(typeof o=="object")Lr(o,s+".",i,r);else if(typeof o=="string"||typeof o=="number")r(s,o.toString());else if(typeof o=="boolean")r(s,o?"1":"0");else throw new Error(`Can't handle extra config type: ${typeof o}`)})},me=e=>{let t=ke(),i=t.stackSave();try{let r=t.PTR_SIZE,a=t.stackAlloc(2*r);t._OrtGetLastError(a,a+r);let o=Number(t.getValue(a,r===4?"i32":"i64")),s=t.getValue(a+r,"*"),l=s?t.UTF8ToString(s):"";throw new Error(`${e} ERROR_CODE: ${o}, ERROR_MESSAGE: ${l}`)}finally{t.stackRestore(i)}}}),kp,Ey=L(()=>{"use strict";At(),Ua(),kp=e=>{let t=ke(),i=0,r=[],a=e||{};try{if(e?.logSeverityLevel===void 0)a.logSeverityLevel=2;else if(typeof e.logSeverityLevel!="number"||!Number.isInteger(e.logSeverityLevel)||e.logSeverityLevel<0||e.logSeverityLevel>4)throw new Error(`log serverity level is not valid: ${e.logSeverityLevel}`);if(e?.logVerbosityLevel===void 0)a.logVerbosityLevel=0;else if(typeof e.logVerbosityLevel!="number"||!Number.isInteger(e.logVerbosityLevel))throw new Error(`log verbosity level is not valid: ${e.logVerbosityLevel}`);e?.terminate===void 0&&(a.terminate=!1);let o=0;return e?.tag!==void 0&&(o=Ee(e.tag,r)),i=t._OrtCreateRunOptions(a.logSeverityLevel,a.logVerbosityLevel,!!a.terminate,o),i===0&&me("Can't create run options."),e?.extra!==void 0&&Lr(e.extra,"",new WeakSet,(s,l)=>{let d=Ee(s,r),p=Ee(l,r);t._OrtAddRunConfigEntry(i,d,p)!==0&&me(`Can't set a run config entry: ${s} - ${l}.`)}),[i,r]}catch(o){throw i!==0&&t._OrtReleaseRunOptions(i),r.forEach(s=>t._free(s)),o}}}),Eo,zo,Ao,Oo,Tp,zy=L(()=>{"use strict";At(),Ua(),Eo=e=>{switch(e){case"disabled":return 0;case"basic":return 1;case"extended":return 2;case"all":return 99;default:throw new Error(`unsupported graph optimization level: ${e}`)}},zo=e=>{switch(e){case"sequential":return 0;case"parallel":return 1;default:throw new Error(`unsupported execution mode: ${e}`)}},Ao=e=>{e.extra||(e.extra={}),e.extra.session||(e.extra.session={});let t=e.extra.session;t.use_ort_model_bytes_directly||(t.use_ort_model_bytes_directly="1"),e.executionProviders&&e.executionProviders.some(i=>(typeof i=="string"?i:i.name)==="webgpu")&&(e.enableMemPattern=!1)},Oo=(e,t,i)=>{for(let r of t){let a=typeof r=="string"?r:r.name;switch(a){case"webnn":if(a="WEBNN",typeof r!="string"){let s=r?.deviceType;if(s){let l=Ee("deviceType",i),d=Ee(s,i);ke()._OrtAddSessionConfigEntry(e,l,d)!==0&&me(`Can't set a session config entry: 'deviceType' - ${s}.`)}}break;case"webgpu":if(a="JS",typeof r!="string"){let s=r;if(s?.preferredLayout){if(s.preferredLayout!=="NCHW"&&s.preferredLayout!=="NHWC")throw new Error(`preferredLayout must be either 'NCHW' or 'NHWC': ${s.preferredLayout}`);let l=Ee("preferredLayout",i),d=Ee(s.preferredLayout,i);ke()._OrtAddSessionConfigEntry(e,l,d)!==0&&me(`Can't set a session config entry: 'preferredLayout' - ${s.preferredLayout}.`)}}break;case"wasm":case"cpu":continue;default:throw new Error(`not supported execution provider: ${a}`)}let o=Ee(a,i);ke()._OrtAppendExecutionProvider(e,o)!==0&&me(`Can't append execution provider: ${a}.`)}},Tp=e=>{let t=ke(),i=0,r=[],a=e||{};Ao(a);try{let o=Eo(a.graphOptimizationLevel??"all"),s=zo(a.executionMode??"sequential"),l=typeof a.logId=="string"?Ee(a.logId,r):0,d=a.logSeverityLevel??2;if(!Number.isInteger(d)||d<0||d>4)throw new Error(`log serverity level is not valid: ${d}`);let p=a.logVerbosityLevel??0;if(!Number.isInteger(p)||p<0||p>4)throw new Error(`log verbosity level is not valid: ${p}`);let f=typeof a.optimizedModelFilePath=="string"?Ee(a.optimizedModelFilePath,r):0;if(i=t._OrtCreateSessionOptions(o,!!a.enableCpuMemArena,!!a.enableMemPattern,s,!!a.enableProfiling,0,l,d,p,f),i===0&&me("Can't create session options."),a.executionProviders&&Oo(i,a.executionProviders,r),a.enableGraphCapture!==void 0){if(typeof a.enableGraphCapture!="boolean")throw new Error(`enableGraphCapture must be a boolean value: ${a.enableGraphCapture}`);let m=Ee("enableGraphCapture",r),g=Ee(a.enableGraphCapture.toString(),r);t._OrtAddSessionConfigEntry(i,m,g)!==0&&me(`Can't set a session config entry: 'enableGraphCapture' - ${a.enableGraphCapture}.`)}if(a.freeDimensionOverrides)for(let[m,g]of Object.entries(a.freeDimensionOverrides)){if(typeof m!="string")throw new Error(`free dimension override name must be a string: ${m}`);if(typeof g!="number"||!Number.isInteger(g)||g<0)throw new Error(`free dimension override value must be a non-negative integer: ${g}`);let w=Ee(m,r);t._OrtAddFreeDimensionOverride(i,w,g)!==0&&me(`Can't set a free dimension override: ${m} - ${g}.`)}return a.extra!==void 0&&Lr(a.extra,"",new WeakSet,(m,g)=>{let w=Ee(m,r),_=Ee(g,r);t._OrtAddSessionConfigEntry(i,w,_)!==0&&me(`Can't set a session config entry: ${m} - ${g}.`)}),[i,r]}catch(o){throw i!==0&&t._OrtReleaseSessionOptions(i)!==0&&me("Can't release session options."),r.forEach(s=>t._free(s)),o}}}),Pt,kt,Tt,Wa,Vr,qa,La,wa,ie=L(()=>{"use strict";Pt=e=>{switch(e){case"int8":return 3;case"uint8":return 2;case"bool":return 9;case"int16":return 5;case"uint16":return 4;case"int32":return 6;case"uint32":return 12;case"float16":return 10;case"float32":return 1;case"float64":return 11;case"string":return 8;case"int64":return 7;case"uint64":return 13;case"int4":return 22;case"uint4":return 21;default:throw new Error(`unsupported data type: ${e}`)}},kt=e=>{switch(e){case 3:return"int8";case 2:return"uint8";case 9:return"bool";case 5:return"int16";case 4:return"uint16";case 6:return"int32";case 12:return"uint32";case 10:return"float16";case 1:return"float32";case 11:return"float64";case 8:return"string";case 7:return"int64";case 13:return"uint64";case 22:return"int4";case 21:return"uint4";default:throw new Error(`unsupported data type: ${e}`)}},Tt=(e,t)=>{let i=[-1,4,1,1,2,2,4,8,-1,1,2,8,4,8,-1,-1,-1,-1,-1,-1,-1,.5,.5][e],r=typeof t=="number"?t:t.reduce((a,o)=>a*o,1);return i>0?Math.ceil(r*i):void 0},Wa=e=>{switch(e){case"float16":return typeof Float16Array<"u"&&Float16Array.from?Float16Array:Uint16Array;case"float32":return Float32Array;case"uint8":return Uint8Array;case"int8":return Int8Array;case"uint16":return Uint16Array;case"int16":return Int16Array;case"int32":return Int32Array;case"bool":return Uint8Array;case"float64":return Float64Array;case"uint32":return Uint32Array;case"int64":return BigInt64Array;case"uint64":return BigUint64Array;default:throw new Error(`unsupported type: ${e}`)}},Vr=e=>{switch(e){case"verbose":return 0;case"info":return 1;case"warning":return 2;case"error":return 3;case"fatal":return 4;default:throw new Error(`unsupported logging level: ${e}`)}},qa=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",La=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint64"||e==="int8"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",wa=e=>{switch(e){case"none":return 0;case"cpu":return 1;case"cpu-pinned":return 2;case"texture":return 3;case"gpu-buffer":return 4;case"ml-tensor":return 5;default:throw new Error(`unsupported data location: ${e}`)}}}),Va,Ip=L(()=>{"use strict";Na(),Va=async e=>{if(typeof e=="string"){let t=await fetch(e);if(!t.ok)throw new Error(`failed to load external data file: ${e}`);let i=t.headers.get("Content-Length"),r=i?parseInt(i,10):0;if(r<1073741824)return new Uint8Array(await t.arrayBuffer());{if(!t.body)throw new Error(`failed to load external data file: ${e}, no response body.`);let a=t.body.getReader(),o;try{o=new ArrayBuffer(r)}catch(l){if(l instanceof RangeError){let d=Math.ceil(r/65536);o=new WebAssembly.Memory({initial:d,maximum:d}).buffer}else throw l}let s=0;for(;;){let{done:l,value:d}=await a.read();if(l)break;let p=d.byteLength;new Uint8Array(o,s,p).set(d),s+=p}return new Uint8Array(o,0,r)}}else return e instanceof Blob?new Uint8Array(await e.arrayBuffer()):e instanceof Uint8Array?e:new Uint8Array(e)}}),Ro,Bo,Mo,No,Fa,Do,he,st=L(()=>{"use strict";ie(),Ro=["V","I","W","E","F"],Bo=(e,t)=>{console.log(`[${Ro[e]},${new Date().toISOString()}]${t}`)},Fa=(e,t)=>{Mo=e,No=t},Do=(e,t)=>{let i=Vr(e),r=Vr(Mo);i>=r&&Bo(i,typeof t=="function"?t():t)},he=(...e)=>{No&&Do(...e)}}),Ga,Cp=L(()=>{"use strict";ie(),Ga=(e,t)=>new(Wa(t))(e)}),Ha=L(()=>{"use strict"}),Di,Cr,Er,Po,Uo,Pi,ba,Wo,Ep,Ay=L(()=>{"use strict";st(),Ha(),Di=new Map([[64,250],[128,200],[256,200],[512,200],[2048,230],[4096,200],[8192,50],[16384,50],[32768,50],[65536,50],[131072,50],[262144,50],[524288,50],[1048576,50],[2097152,30],[4194304,20],[8388608,10],[12582912,10],[16777216,10],[26214400,15],[33554432,22],[44236800,2],[58982400,6],[67108864,6],[134217728,6],[167772160,6]]),Cr=[],Er=e=>Math.ceil(Number(e)/16)*16,Po=e=>{for(let t=0;t<Cr.length;t++){let i=Cr[t];if(e<=i)return i}return Math.ceil(e/16)*16},Uo=1,Pi=()=>Uo++,ba=async(e,t,i,r)=>{let a=Er(i),o=e.device.createBuffer({size:a,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});try{let s=e.getCommandEncoder();e.endComputePass(),s.copyBufferToBuffer(t,0,o,0,a),e.flush(),await o.mapAsync(GPUMapMode.READ);let l=o.getMappedRange();if(r){let d=r();return d.set(new Uint8Array(l,0,i)),d}else return new Uint8Array(l.slice(0,i))}finally{o.destroy()}},Wo=class{constructor(e){this.backend=e,this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.buffersPending=[],this.capturedPendingBuffers=new Map;for(let[t]of Di)Cr.push(t),this.freeBuffers.set(t,[]),this.freeUniformBuffers.set(t,[]);this.sessionCount=0}upload(e,t){let i=t.buffer,r=t.byteOffset,a=t.byteLength,o=Er(a),s=this.storageCache.get(e);if(!s)throw new Error("gpu data for uploading does not exist");if(Number(s.originalSize)!==a)throw new Error(`inconsistent data size. gpu data size=${s.originalSize}, data size=${a}`);let l=this.backend.device.createBuffer({mappedAtCreation:!0,size:o,usage:GPUBufferUsage.MAP_WRITE|GPUBufferUsage.COPY_SRC}),d=l.getMappedRange();new Uint8Array(d).set(new Uint8Array(i,r,a)),l.unmap();let p=this.backend.device.createCommandEncoder();p.copyBufferToBuffer(l,0,s.gpuData.buffer,0,o),this.backend.device.queue.submit([p.finish()]),l.destroy(),he("verbose",()=>`[WebGPU] GpuDataManager.upload(id=${e})`)}memcpy(e,t){let i=this.storageCache.get(e);if(!i)throw new Error("source gpu data for memcpy does not exist");let r=this.storageCache.get(t);if(!r)throw new Error("destination gpu data for memcpy does not exist");if(i.originalSize!==r.originalSize)throw new Error("inconsistent source and destination gpu data size");let a=Er(i.originalSize),o=this.backend.getCommandEncoder();this.backend.endComputePass(),o.copyBufferToBuffer(i.gpuData.buffer,0,r.gpuData.buffer,0,a)}registerExternalBuffer(e,t,i){let r;if(i){if(r=i[0],e===i[1])return he("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${r}, buffer is the same, skip.`),r;if(this.backend.capturedCommandList.has(this.backend.currentSessionId))throw new Error(`Registering a different external buffer under graph capture mode is not supported yet.
             Please use the previous external buffer!`)}else r=Pi();return this.storageCache.set(r,{gpuData:{id:r,type:0,buffer:e},originalSize:t}),he("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${r}, registered.`),r}unregisterExternalBuffer(e){e!==void 0&&(this.storageCache.delete(e),he("verbose",()=>`[WebGPU] GpuDataManager.unregisterExternalBuffer() => id=${e}`))}create(e,t=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST){let i=Po(e),r,a=(t&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE,o=(t&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM;if(a||o){let l=(a?this.freeBuffers:this.freeUniformBuffers).get(i);l?l.length>0?r=l.pop():r=this.backend.device.createBuffer({size:i,usage:t}):r=this.backend.device.createBuffer({size:i,usage:t})}else r=this.backend.device.createBuffer({size:i,usage:t});let s={id:Pi(),type:0,buffer:r};return this.storageCache.set(s.id,{gpuData:s,originalSize:Number(e)}),he("verbose",()=>`[WebGPU] GpuDataManager.create(size=${e}) => id=${s.id}`),s}get(e){return this.storageCache.get(e)?.gpuData}release(e){let t=typeof e=="bigint"?Number(e):e,i=this.storageCache.get(t);if(!i){if(this.storageCache.size===0)return 0;throw new Error("releasing data does not exist")}return he("verbose",()=>`[WebGPU] GpuDataManager.release(id=${t}), gpuDataId=${i.gpuData.id}`),this.storageCache.delete(t),this.buffersPending.push(i.gpuData.buffer),i.originalSize}async download(e,t){let i=this.storageCache.get(Number(e));if(!i)throw new Error("data does not exist");await ba(this.backend,i.gpuData.buffer,i.originalSize,t)}refreshPendingBuffers(){if(this.buffersPending.length!==0)if(this.backend.sessionStatus==="default"){for(let e of this.buffersPending){let t=Di.get(e.size);if((e.usage&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE){let i=this.freeBuffers.get(e.size)||[];t===void 0||i.length>=t?e.destroy():i.push(e)}else if((e.usage&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM){let i=this.freeUniformBuffers.get(e.size)||[];t===void 0||i.length>=t?e.destroy():i.push(e)}else e.destroy()}this.buffersPending=[]}else{let e=this.capturedPendingBuffers.get(this.backend.currentSessionId);e||(e=[],this.capturedPendingBuffers.set(this.backend.currentSessionId,e));for(let t of this.buffersPending)e.push(t);this.buffersPending=[]}}dispose(){this.freeBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.freeUniformBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.storageCache.forEach(e=>{e.gpuData.buffer.destroy()}),this.capturedPendingBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.capturedPendingBuffers=new Map}onCreateSession(){this.sessionCount+=1}onReleaseSession(e){let t=this.capturedPendingBuffers.get(e);t&&(t.forEach(i=>{i.destroy()}),this.capturedPendingBuffers.delete(e)),this.sessionCount-=1,this.sessionCount===0&&(he("warning",()=>"[WebGPU] Clearing webgpu buffer cache"),this.storageCache.forEach(i=>{i.gpuData.buffer.destroy()}),this.storageCache=new Map)}},Ep=(...e)=>new Wo(...e)}),qo,ge,$e=L(()=>{"use strict";qo=class{constructor(e){Object.assign(this,e)}get cacheKey(){return this.key||(this.key=Object.getOwnPropertyNames(this).sort().map(e=>`${this[e]}`).join(";")),this.key}},ge=e=>new qo(e)}),Lo,Wt,O,Fr,zp,Ap,Op,le=L(()=>{"use strict";Lo=class{static calcMatMulShape(e,t){return e[1]!==t[0]?void 0:[e[0],t[1]]}},Wt=class{static calcShape(e,t,i=!1){let r=e.length,a=t.length;if(r===0)return t;if(a===0)return e;let o=Math.max(e.length,t.length),s=new Array(o);if(i){if(r<2||a<2)return;let l=Lo.calcMatMulShape([e[r-2],e[r-1]],[t[a-2],t[a-1]]);if(l===void 0)return;[s[o-2],s[o-1]]=l}for(let l=i?3:1;l<=o;l++){let d=r-l<0?1:e[r-l],p=a-l<0?1:t[a-l];if(d!==p&&d>1&&p>1)return;let f=Math.max(d,p);if(d&&p)s[o-l]=Math.max(d,p);else{if(f>1)return;s[o-l]=0}}return s}static isValidBroadcast(e,t){let i=e.length,r=t.length;if(i>r)return!1;for(let a=1;a<=i;a++)if(e[i-a]!==1&&e[i-a]!==t[r-a])return!1;return!0}},O=class Ur{static size(t){return Ur.getSizeFromDimensionRange(t,0,t.length)}static convertShape(t,i=4){let r=t.length;if(r===0)return[];let a=new Array(r),o=r-1;for(;o>=0;){if(t[o]%i===0){a[o]=t[o]/i;break}if(i%t[o]!==0)throw new Error("cannot convert shape");a[o]=1,i/=t[o],o--}for(o--;o>=0;o--)a[o]=t[o];return a}static sizeFromDimension(t,i){if(i<0||i>t.length)throw new Error(`invalid dimension of ${i} for sizeFromDimension as Tensor has ${t.length} dimensions.`);return Ur.getSizeFromDimensionRange(t,i,t.length)}static sizeToDimension(t,i){if(i<0||i>t.length)throw new Error(`invalid dimension of ${i} for sizeToDimension as Tensor has ${t.length} dimensions.`);return Ur.getSizeFromDimensionRange(t,0,i)}static getSizeFromDimensionRange(t,i,r){let a=1;for(let o=i;o<r;o++){if(t[o]<0)throw new Error("cannot get valid size from specified dimension range. Most likely the range contains negative values in them.");a*=Number(t[o])}return a}static computeStrides(t){let i=t.length;if(i===0)return[];if(i===1)return[1];let r=new Array(i);r[i-1]=1,r[i-2]=t[i-1];for(let a=i-3;a>=0;--a)r[a]=r[a+1]*t[a+1];return r}static normalizeAxis(t,i){if(t<-i&&t>=i)throw new Error("unsupported axis for this operation.");return t<0?t+i:t}static normalizeAxes(t,i){return t.map(r=>this.normalizeAxis(r,i??t.length))}static sortBasedOnPerm(t,i){return i?i.map(r=>t[r]):t.slice().reverse()}static padShape(t,i){let r=t.length;return t.map((a,o)=>a+i[o]+i[o+r])}static areEqual(t,i){return t.length!==i.length?!1:t.every((r,a)=>r===i[a])}},Fr=class sr{static adjustPoolAttributes(t,i,r,a,o,s){if(!t&&r.length!==i.length-2)throw new Error("length of specified kernel shapes should be 2 less than length of input dimensions");if(t)for(let l=0;l<i.length-2;l++)l>=r.length?r.push(i[l+2]):r[l]=i[l+2];for(let l=0;l<r.length;l++)if(l<a.length){if(a[l]<0)throw new Error("strides should be greater than or equal to 1")}else a.push(1);for(let l=0;l<r.length;l++)if(l<o.length){if(o[l]<0)throw new Error("dilations should be greater than or equal to 1")}else o.push(1);for(let l=0;l<r.length*2;l++)if(l<s.length){if(s[l]<0)throw new Error("pad should be greater than or equal to 1")}else s.push(0);for(let l=0;l<r.length;l++){if(r[l]<=0)throw new Error("kernel shapes need to be greater than 0");if(s[l]>=r[l]||s[l+r.length]>=r[l])throw new Error("pads should be smaller than kernel")}}static adjustPadsBasedOnAutoPad(t,i,r,a,o,s,l){if(l){if(o.length!==2*(t.length-2))throw new Error("length of pads should be twice the length of data dimensions");if(i.length!==t.length-2)throw new Error("length of strides should be the length of data dimensions");if(a.length!==t.length-2)throw new Error("length of kernel shapes should be the length of data dimensions");for(let d=0;d<t.length-2;d++)sr.adjustPadAndReturnShape(t[d+(s?1:2)],i[d],r[d],a[d],o,d,d+t.length-2,l)}}static computePoolOutputShape(t,i,r,a,o,s,l){if(i.length<=0)throw new Error("input shape must be of size greater than 0");let d=[i[0],i[1]];return sr.computeShapeHelper(t,i,d,r,a,o,s,l),d}static computeConvOutputShape(t,i,r,a,o,s,l){if(t.length<=0||i.length<=0)throw new Error("invalid input tensor dims or invalid filter tensor dims");let d=[t[0],i[0]];return sr.computeShapeHelper(!1,t,d,r,a,o,s,l),d}static computeShapeHelper(t,i,r,a,o,s,l,d){if(t)for(let p=0;p<i.length-2;p++)r.push(1);else for(let p=0;p<i.length-2;p++)r.push(sr.adjustPadAndReturnShape(i[p+2],a[p],o[p],s[p],l,p,p+i.length-2,d))}static adjustPadAndReturnShape(t,i,r,a,o,s,l,d){let p=r*(a-1)+1;if(d&&d!=="NOTSET")switch(d){case"VALID":return o[s]=0,o[l]=0,Math.floor((t-p)/i+1);case"SAME_LOWER":case"SAME_UPPER":if(r!==1)throw new Error("Dilation not supported for SAME_UPPER or SAME_LOWER");{let f=((t+i-1)/i-1)*i+a-t;return o[s]=Math.floor(d==="SAME_LOWER"?(f+1)/2:f/2),o[l]=f-o[s],Math.floor((t+f-a)/i+1)}default:throw new Error("Unsupported AutoPad type")}else return Math.floor((t+o[s]+o[l]-p)/i+1)}},zp=class{static getShapeOfGemmResult(e,t,i,r,a){if(e.length!==2||i.length!==2)throw new Error("shape need to be of size 2");let o,s,l;t?(o=e[1],s=e[0]):(o=e[0],s=e[1]);let d=-1;if(r?(l=i[0],d=1):(l=i[1],d=0),i[d]!==s)throw new Error("dimension mismatch");if(o<=0||l<=0||s<=0)throw new Error("invalid shape specified");if(a&&!Wt.isValidBroadcast(a,[o,l]))throw new Error("gemm: invalid bias shape for broadcast");return[o,l,s]}},Ap=-34028234663852886e22,Op=34028234663852886e22}),qt,zr,Te,ze,Y,be,$a,Ut,mt,X,Yt,M,Z,Rp,ja,Vo,Bp,de=L(()=>{"use strict";ie(),le(),qt=64,zr=(e,t)=>{if(t===3)throw new Error("vec3 has same alignment as vec4, use vec4 instead");switch(Number(e)){case 10:return t>1?`vec${t}<f16>`:"f16";case 1:return t>1?`vec${t}<f32>`:"f32";case 6:return t>1?`vec${t}<i32>`:"i32";case 12:return t>1?`vec${t}<u32>`:"u32";case 7:if(t>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","i32"];case 13:if(t>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","u32"];case 9:if(t!==4)throw new Error("bool must be vec4");return["u32","vec4<bool>"];case 22:return"i32";case 21:return"u32";default:throw new Error(`Unknown data type: ${e}`)}},Te=(e,t=1)=>{let i=zr(e,t);return typeof i=="string"?i:i[0]},ze=(e,t=1)=>{let i=zr(e,t);return typeof i=="string"?i:i[1]},Y=(...e)=>{let t=[];return e.forEach(i=>{i.length!==0&&t.push({type:12,data:i},{type:12,data:O.computeStrides(i)})}),t},be=e=>e%4===0?4:e%2===0?2:1,$a=(e="f32",t,i="0")=>!t||t===1?`${e}(${i})`:`vec${t}<${e}>(${i})`,Ut=(e,t,i)=>e==="f32"?i:t===1?`f32(${i})`:`vec${t}<f32>(${i})`,mt=(e,t)=>t===4?`(${e}.x + ${e}.y + ${e}.z + ${e}.w)`:t===2?`(${e}.x + ${e}.y)`:t===3?`(${e}.x + ${e}.y + ${e}.z)`:e,X=(e,t,i,r)=>e.startsWith("uniforms.")&&i>4?typeof t=="string"?r==="f16"?`${e}[(${t}) / 8][(${t}) % 8 / 4][(${t}) % 8 % 4]`:`${e}[(${t}) / 4][(${t}) % 4]`:r==="f16"?`${e}[${Math.floor(t/8)}][${Math.floor(t%8/4)}][${t%8%4}]`:`${e}[${Math.floor(t/4)}][${t%4}]`:i>1?`${e}[${t}]`:e,Yt=(e,t,i,r,a)=>{let o=typeof i=="number",s=o?i:i.length,l=[...new Array(s).keys()],d=s<2?"u32":s<=4?`vec${s}<u32>`:`array<u32, ${s}>`,p=zr(t,a),f=typeof p=="string"?p:p[1],m=typeof p=="string"?p:p[0],g={indices:d,value:f,storage:m,tensor:t},w=U=>typeof U=="string"?U:`${U}u`,_={offsetToIndices:!1,indicesToOffset:!1,broadcastedIndicesToOffset:!1,set:!1,setByIndices:!1,get:!1,getByIndices:!1},$=o?"uniforms.":"",x=`${$}${e}_shape`,v=`${$}${e}_strides`,b="";for(let U=0;U<s-1;U++)b+=`
    let dim${U} = current / ${X(v,U,s)};
    let rest${U} = current % ${X(v,U,s)};
    indices[${U}] = dim${U};
    current = rest${U};
    `;b+=`indices[${s-1}] = current;`;let k=s<2?"":`
  fn o2i_${e}(offset: u32) -> ${g.indices} {
    var indices: ${g.indices};
    var current = offset;
    ${b}
    return indices;
  }`,T=U=>(_.offsetToIndices=!0,s<2?U:`o2i_${e}(${U})`),C=[];if(s>=2)for(let U=s-1;U>=0;U--)C.push(`${X(v,U,s)} * (indices[${U}])`);let E=s<2?"":`
  fn i2o_${e}(indices: ${g.indices}) -> u32 {
    return ${C.join("+")};
  }`,z=U=>(_.indicesToOffset=!0,s<2?U:`i2o_${e}(${U})`),N=(...U)=>s===0?"0u":`${g.indices}(${U.map(w).join(",")})`,W=(U,K)=>s<2?`${U}`:`${X(U,K,s)}`,H=(U,K,B)=>s<2?`${U}=${B};`:`${X(U,K,s)}=${B};`,V={},G=(U,K)=>{_.broadcastedIndicesToOffset=!0;let B=`${K.name}broadcastedIndicesTo${e}Offset`;if(B in V)return`${B}(${U})`;let ee=[];for(let ve=s-1;ve>=0;ve--){let Re=K.indicesGet("outputIndices",ve+K.rank-s);ee.push(`${W(v,ve)} * (${Re} % ${W(x,ve)})`)}return V[B]=`fn ${B}(outputIndices: ${K.type.indices}) -> u32 {
             return ${ee.length>0?ee.join("+"):"0u"};
           }`,`${B}(${U})`},D=(U,K)=>(()=>{if(g.storage===g.value)return`${e}[${U}]=${K};`;if(g.storage==="vec2<u32>"&&g.value==="i32")return`${e}[${U}]=vec2<u32>(u32(${K}), select(0u, 0xFFFFFFFFu, ${K} < 0));`;if(g.storage==="vec2<u32>"&&g.value==="u32")return`${e}[${U}]=vec2<u32>(u32(${K}), 0u);`;if(g.storage==="u32"&&g.value==="vec4<bool>")return`${e}[${U}]=dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(${K}));`;throw new Error(`not supported combination of storage type ${g.storage} and value type ${g.value} yet`)})(),re=U=>(()=>{if(g.storage===g.value)return`${e}[${U}]`;if(g.storage==="vec2<u32>"&&g.value==="i32")return`i32(${e}[${U}].x)`;if(g.storage==="vec2<u32>"&&g.value==="u32")return`u32(${e}[${U}].x)`;if(g.storage==="u32"&&g.value==="vec4<bool>")return`vec4<bool>(bool(${e}[${U}] & 0xFFu), bool(${e}[${U}] & 0xFF00u), bool(${e}[${U}] & 0xFF0000u), bool(${e}[${U}] & 0xFF000000u))`;throw new Error(`not supported combination of storage type ${g.storage} and value type ${g.value} yet`)})(),te=s<2?"":`
  fn get_${e}ByIndices(indices: ${g.indices}) -> ${f} {
    return ${re(`i2o_${e}(indices)`)};
  }`,j=s<2?"":(()=>{let U=l.map(B=>`d${B}: u32`).join(", "),K=l.map(B=>`d${B}`).join(", ");return`
  fn get_${e}(${U}) -> ${f} {
    return get_${e}ByIndices(${N(K)});
  }`})(),se=(...U)=>{if(U.length!==s)throw new Error(`indices length must be ${s}`);let K=U.map(w).join(",");return s===0?re("0u"):s===1?re(K[0]):(_.get=!0,_.getByIndices=!0,_.indicesToOffset=!0,`get_${e}(${K})`)},pe=U=>s<2?re(U):(_.getByIndices=!0,_.indicesToOffset=!0,`get_${e}ByIndices(${U})`),F=s<2?"":`
  fn set_${e}ByIndices(indices: ${g.indices}, value: ${f}) {
    ${D(`i2o_${e}(indices)`,"value")}
  }`,ce=s<2?"":(()=>{let U=l.map(B=>`d${B}: u32`).join(", "),K=l.map(B=>`d${B}`).join(", ");return`
  fn set_${e}(${U}, value: ${f}) {
    set_${e}ByIndices(${N(K)}, value);
  }`})();return{impl:()=>{let U=[],K=!1;return _.offsetToIndices&&(U.push(k),K=!0),_.indicesToOffset&&(U.push(E),K=!0),_.broadcastedIndicesToOffset&&(Object.values(V).forEach(B=>U.push(B)),K=!0),_.set&&(U.push(ce),K=!0),_.setByIndices&&(U.push(F),K=!0),_.get&&(U.push(j),K=!0),_.getByIndices&&(U.push(te),K=!0),!o&&K&&U.unshift(`const ${x} = ${g.indices}(${i.join(",")});`,`const ${v} = ${g.indices}(${O.computeStrides(i).join(",")});`),U.join(`
`)},type:g,offsetToIndices:T,indicesToOffset:z,broadcastedIndicesToOffset:G,indices:N,indicesGet:W,indicesSet:H,set:(...U)=>{if(U.length!==s+1)throw new Error(`indices length must be ${s}`);let K=U[s];if(typeof K!="string")throw new Error("value must be string");let B=U.slice(0,s).map(w).join(",");return s===0?D("0u",K):s===1?D(B[0],K):(_.set=!0,_.setByIndices=!0,_.indicesToOffset=!0,`set_${e}(${B}, ${K})`)},setByOffset:D,setByIndices:(U,K)=>s<2?D(U,K):(_.setByIndices=!0,_.indicesToOffset=!0,`set_${e}ByIndices(${U}, ${K});`),get:se,getByOffset:re,getByIndices:pe,usage:r,name:e,strides:v,shape:x,rank:s}},M=(e,t,i,r=1)=>Yt(e,t,i,"input",r),Z=(e,t,i,r=1)=>Yt(e,t,i,"output",r),Rp=(e,t,i)=>Yt(e,t,i,"atomicOutput",1),ja=(e,t,i,r=1)=>Yt(e,t,i,"internal",r),Vo=class{constructor(e,t){this.normalizedDispatchGroup=e,this.limits=t,this.internalVariables=[],this.variables=[],this.uniforms=[],this.variableIndex=0}guardAgainstOutOfBoundsWorkgroupSizes(e){return`if (global_idx >= ${typeof e=="number"?`${e}u`:e}) { return; }`}mainStart(e=qt){let t=typeof e=="number"?e:e[0],i=typeof e=="number"?1:e[1],r=typeof e=="number"?1:e[2];if(t>this.limits.maxComputeWorkgroupSizeX||i>this.limits.maxComputeWorkgroupSizeY||r>this.limits.maxComputeWorkgroupSizeZ)throw new Error(`workgroup size [${t}, ${i}, ${r}] exceeds the maximum workgroup size [${this.limits.maxComputeWorkgroupSizeX}, ${this.limits.maxComputeWorkgroupSizeY}, ${this.limits.maxComputeWorkgroupSizeZ}].`);if(t*i*r>this.limits.maxComputeInvocationsPerWorkgroup)throw new Error(`workgroup size [${t}, ${i}, ${r}] exceeds the maximum workgroup invocations ${this.limits.maxComputeInvocationsPerWorkgroup}.`);let a=this.normalizedDispatchGroup[1]===1&&this.normalizedDispatchGroup[2]===1,o=a?`@builtin(global_invocation_id) global_id : vec3<u32>,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(local_invocation_id) local_id : vec3<u32>`:`@builtin(global_invocation_id) global_id : vec3<u32>,
                                             @builtin(local_invocation_id) local_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(num_workgroups) num_workgroups : vec3<u32>`,s=a?`let global_idx = global_id.x;
         let workgroup_index = workgroup_id.x;`:`let workgroup_index = workgroup_id.z * num_workgroups[0] * num_workgroups[1] +
             workgroup_id.y * num_workgroups[0] + workgroup_id.x;
         let global_idx = workgroup_index * ${t*i*r}u + local_idx;`;return`@compute @workgroup_size(${t}, ${i}, ${r})
  fn main(${o}) {
    ${s}
  `}appendVariableUniforms(e){e.rank!==0&&(e.shape.startsWith("uniforms.")&&this.uniforms.push({name:e.shape.replace("uniforms.",""),type:"u32",length:e.rank}),e.strides.startsWith("uniforms.")&&this.uniforms.push({name:e.strides.replace("uniforms.",""),type:"u32",length:e.rank}))}declareVariable(e,t){if(e.usage==="internal")throw new Error("cannot use internal variable with declareVariable(). use registerInternalVariables() instead.");this.variables.push(e),this.appendVariableUniforms(e);let i=e.usage==="input"?"read":"read_write",r=e.usage==="atomicOutput"?"atomic<i32>":e.type.storage;return`@group(0) @binding(${t}) var<storage, ${i}> ${e.name}: array<${r}>;`}declareVariables(...e){return e.map(t=>this.declareVariable(t,this.variableIndex++)).join(`
`)}registerInternalVariable(e){if(e.usage!=="internal")throw new Error("cannot use input or output variable with registerInternalVariable(). use declareVariables() instead.");this.internalVariables.push(e),this.appendVariableUniforms(e)}registerInternalVariables(...e){return e.forEach(t=>this.registerInternalVariable(t)),this}registerUniform(e,t,i=1){return this.uniforms.push({name:e,type:t,length:i}),this}registerUniforms(e){return this.uniforms=this.uniforms.concat(e),this}uniformDeclaration(){if(this.uniforms.length===0)return"";let e=[];for(let{name:t,type:i,length:r}of this.uniforms)if(r&&r>4)i==="f16"?e.push(`@align(16) ${t}:array<mat2x4<${i}>, ${Math.ceil(r/8)}>`):e.push(`${t}:array<vec4<${i}>, ${Math.ceil(r/4)}>`);else{let a=r==null||r===1?i:`vec${r}<${i}>`;e.push(`${t}:${a}`)}return`
      struct Uniforms { ${e.join(", ")} };
      @group(0) @binding(${this.variableIndex}) var<uniform> uniforms: Uniforms;`}get additionalImplementations(){return this.uniformDeclaration()+this.variables.map(e=>e.impl()).join(`
`)+this.internalVariables.map(e=>e.impl()).join(`
`)}get variablesInfo(){if(this.uniforms.length===0)return;let e=t=>[12,10,1,6][["u32","f16","f32","i32"].indexOf(t)];return this.uniforms.map(t=>[e(t.type),t.length??1])}},Bp=(e,t)=>new Vo(e,t)}),Fo,Ui,Go,Ho,jo,Ko,De,Mp,Np,gt=L(()=>{"use strict";ie(),le(),$e(),de(),Fo=(e,t)=>{if(!e||e.length!==1)throw new Error("Transpose requires 1 input.");if(t.length!==0&&t.length!==e[0].dims.length)throw new Error(`perm size ${t.length} does not match input rank ${e[0].dims.length}`)},Ui=(e,t)=>t.length!==0?t:[...new Array(e).keys()].reverse(),Go=(e,t)=>O.sortBasedOnPerm(e,Ui(e.length,t)),Ho=(e,t,i,r)=>{let a=`fn perm(i: ${r.type.indices}) -> ${i.type.indices} {
    var a: ${i.type.indices};`;for(let o=0;o<t;++o)a+=`a[${e[o]}]=i[${o}];`;return a+="return a;}"},jo=(e,t)=>{let i=[],r=[];for(let a=0;a<e.length;++a)e[a]!==1&&i.push(e[a]),e[t[a]]!==1&&r.push(t[a]);return{newShape:i,newPerm:r}},Ko=(e,t)=>{let i=0;for(let r=0;r<e.length;++r)if(t[e[r]]!==1){if(e[r]<i)return!1;i=e[r]}return!0},De=(e,t)=>{let i=e.dataType,r=e.dims.length,a=Ui(r,t),o=Go(e.dims,a),s=e.dims,l=o,d=r<2||Ko(a,e.dims),p;if(d)return p=_=>{let $=M("input",i,s,4),x=Z("output",i,l,4);return`
  ${_.registerUniform("output_size","u32").declareVariables($,x)}
  ${_.mainStart()}
    ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    output[global_idx] = input[global_idx];
  }`},{name:"TransposeCopy",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let _=O.size(o);return{outputs:[{dims:o,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(_/64/4)},programUniforms:[{type:12,data:Math.ceil(_/4)}]}},getShaderSource:p};let{newShape:f,newPerm:m}=jo(e.dims,a),g=O.areEqual(m,[2,3,1]),w=O.areEqual(m,[3,1,2]);if(f.length===2||g||w){s=g?[f[0],f[1]*f[2]]:w?[f[0]*f[1],f[2]]:f,l=[s[1],s[0]];let _=16;return p=$=>{let x=M("a",i,s.length),v=Z("output",i,l.length);return`
  ${$.registerUniform("output_size","u32").declareVariables(x,v)}
  var<workgroup> tile : array<array<${v.type.value}, ${_+1}>, ${_}>;
  ${$.mainStart([_,_,1])}
    let stride = (uniforms.output_shape[1] - 1) / ${_} + 1;
    let workgroup_id_x = workgroup_index % stride;
    let workgroup_id_y = workgroup_index / stride;
    let input_col = workgroup_id_y * ${_}u + local_id.x;
    let input_row = workgroup_id_x * ${_}u + local_id.y;
    if (input_row < uniforms.a_shape[0] && input_col < uniforms.a_shape[1]) {
      tile[local_id.y][local_id.x] = ${x.getByIndices(`${x.type.indices}(input_row, input_col)`)};
    }
    workgroupBarrier();

    let output_col = workgroup_id_x * ${_}u + local_id.x;
    let output_row = workgroup_id_y * ${_}u + local_id.y;
    if (output_row < uniforms.output_shape[0] && output_col < uniforms.output_shape[1]) {
      ${v.setByIndices(`${v.type.indices}(output_row, output_col)`,"tile[local_id.x][local_id.y]")}
    }
  }`},{name:"TransposeShared",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let $=O.size(o);return{outputs:[{dims:o,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(l[1]/_),y:Math.ceil(l[0]/_)},programUniforms:[{type:12,data:$},...Y(s,l)]}},getShaderSource:p}}return p=_=>{let $=M("a",i,s.length),x=Z("output",i,l.length);return`
  ${_.registerUniform("output_size","u32").declareVariables($,x)}

  ${Ho(a,r,$,x)}

  ${_.mainStart()}
    ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${x.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${x.setByOffset("global_idx",$.getByIndices("aIndices"))}
  }`},{name:"Transpose",shaderCache:{hint:`${t}`,inputDependencies:["rank"]},getRunData:()=>{let _=O.size(o);return{outputs:[{dims:o,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(_/64)},programUniforms:[{type:12,data:_},...Y(s,l)]}},getShaderSource:p}},Mp=(e,t)=>{Fo(e.inputs,t.perm),e.compute(De(e.inputs[0],t.perm))},Np=e=>ge({perm:e.perm})}),Qo,Zo,Xo,Yo,Jo,eu,tu,ru,iu,au,Ve,Dp,Pp,Up,Wp,qp,Lp,Vp,Fp,Gp,Hp,Oy=L(()=>{"use strict";ie(),le(),de(),Ka(),gt(),Qo={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate * candidate",logSumExp:"bestValue + exp(candidate)",l1:"bestValue + abs(candidate)",l2:"bestValue + candidate * candidate",logSum:"bestValue + candidate"},Zo={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate",logSumExp:"bestValue + candidate",l1:"bestValue + candidate",l2:"bestValue + candidate",logSum:"bestValue + candidate"},Xo={max:"_A[offset]",min:"_A[offset]",mean:"0",sum:"0",prod:"1",sumSquare:"0",logSumExp:"0",l1:"0",l2:"0",logSum:"0"},Yo={max:"bestValue",min:"bestValue",sum:"bestValue",prod:"bestValue",sumSquare:"bestValue",logSumExp:"log(bestValue)",l1:"bestValue",l2:"sqrt(bestValue)",logSum:"log(bestValue)"},Jo=(e,t)=>{let i=[];for(let r=t-e;r<t;++r)i.push(r);return i},eu=(e,t)=>{let i=[],r=e.length;for(let o=0;o<r;o++)t.indexOf(o)===-1&&i.push(e[o]);let a=t.map(o=>e[o]);return[i,a]},tu=(e,t)=>{let i=e.length+t.length,r=[],a=0;for(let o=0;o<i;o++)t.indexOf(o)===-1?r.push(e[a++]):r.push(1);return r},ru=(e,t)=>{for(let i=0;i<e.length;++i)if(e[e.length-i-1]!==t-1-i)return!1;return!0},iu=(e,t)=>{let i=[];if(!ru(e,t)){for(let r=0;r<t;++r)e.indexOf(r)===-1&&i.push(r);e.forEach(r=>i.push(r))}return i},au=(e,t,i,r,a,o,s)=>{let l=i[0].dims,d=O.size(o),p=O.size(s),f=M("_A",i[0].dataType,l),m=Z("output",a,o),g=64;d===1&&(g=256);let w=`
          var<workgroup> aBestValues : array<f32, ${g}>;
       `,_=$=>`
        ${$.registerUniform("reduceSize","u32").declareVariables(f,m)}
        ${w}
        fn DIV_CEIL(a : u32, b : u32) -> u32 {
          return ((a - 1u) / b + 1u);
         }
         ${$.mainStart(g)}

          let outputIndex = global_idx / ${g};
          let offset = outputIndex * uniforms.reduceSize;

          var bestValue = f32(${Xo[r]});
          let Length = uniforms.reduceSize;
          for (var k = local_idx; k < Length; k = k + ${g}) {
           let candidate = f32(${f.getByOffset("offset + k")});
           bestValue = ${Qo[r]};
          }
          aBestValues[local_idx] = bestValue;
          workgroupBarrier();

         var reduceSize = min(Length, ${g}u);
         for (var currentSize = reduceSize / 2u; reduceSize > 1u;
             currentSize = reduceSize / 2u) {
           let interval = DIV_CEIL(reduceSize, 2u);
           if (local_idx < currentSize) {
            let candidate = aBestValues[local_idx + interval];
            bestValue = ${Zo[r]};
            aBestValues[local_idx] = bestValue;
           }
           reduceSize = interval;
           workgroupBarrier();
         }

         if (local_idx == 0u) {
          ${m.setByOffset("outputIndex",`${r==="mean"?`${m.type.storage}(bestValue / f32(uniforms.reduceSize))`:`${m.type.storage}(${Yo[r]})`}`)};
         }
        }`;return{name:e,shaderCache:{hint:`${t};${g}`,inputDependencies:["type"]},getShaderSource:_,getRunData:()=>({outputs:[{dims:o,dataType:a}],dispatchGroup:{x:d},programUniforms:[{type:12,data:p}]})}},Ve=(e,t,i,r)=>{let a=e.inputs.length===1?i:va(e.inputs,i),o=a.axes;o.length===0&&!a.noopWithEmptyAxes&&(o=e.inputs[0].dims.map((w,_)=>_));let s=O.normalizeAxes(o,e.inputs[0].dims.length),l=s,d=e.inputs[0],p=iu(l,e.inputs[0].dims.length);p.length>0&&(d=e.compute(De(e.inputs[0],p),{inputs:[0],outputs:[-1]})[0],l=Jo(l.length,d.dims.length));let[f,m]=eu(d.dims,l),g=f;a.keepDims&&(g=tu(f,s)),e.compute(au(t,a.cacheKey,[d],r,e.inputs[0].dataType,g,m),{inputs:[d]})},Dp=(e,t)=>{Ve(e,"ReduceMeanShared",t,"mean")},Pp=(e,t)=>{Ve(e,"ReduceL1Shared",t,"l1")},Up=(e,t)=>{Ve(e,"ReduceL2Shared",t,"l2")},Wp=(e,t)=>{Ve(e,"ReduceLogSumExpShared",t,"logSumExp")},qp=(e,t)=>{Ve(e,"ReduceMaxShared",t,"max")},Lp=(e,t)=>{Ve(e,"ReduceMinShared",t,"min")},Vp=(e,t)=>{Ve(e,"ReduceProdShared",t,"prod")},Fp=(e,t)=>{Ve(e,"ReduceSumShared",t,"sum")},Gp=(e,t)=>{Ve(e,"ReduceSumSquareShared",t,"sumSquare")},Hp=(e,t)=>{Ve(e,"ReduceLogSumShared",t,"logSum")}}),Fe,nu,Gr,va,Ge,su,ou,uu,lu,du,pu,cu,hu,fu,mu,He,jp,Kp,Qp,Zp,Xp,Yp,Jp,ec,tc,rc,Ka=L(()=>{"use strict";ie(),le(),$e(),de(),Oy(),Fe=e=>{if(!e||e.length===0||e.length>2)throw new Error("Reduce op requires 1 or 2 inputs.");if(e.length===2&&e[1].dims.length!==1)throw new Error("Invalid axes input dims.")},nu=e=>["","",`var value = ${e.getByIndices("input_indices")};`,""],Gr=(e,t,i,r,a,o,s=!1,l=!1)=>{let d=[],p=i[0].dims,f=p.length,m=O.normalizeAxes(a,f),g=!l&&m.length===0;p.forEach(($,x)=>{g||m.indexOf(x)>=0?s&&d.push(1):d.push($)});let w=d.length,_=O.size(d);return{name:e,shaderCache:t,getShaderSource:$=>{let x=[],v=M("_A",i[0].dataType,f),b=Z("output",o,w),k=r(v,b,m),T=k[2];for(let C=0,E=0;C<f;C++)g||m.indexOf(C)>=0?(s&&E++,T=`for(var j${C}: u32 = 0; j${C} < ${p[C]}; j${C}++) {
                  ${k[2].includes("last_index")?`let last_index = j${C};`:""}
                  ${v.indicesSet("input_indices",C,`j${C}`)}
                  ${T}
                }`):(x.push(`${v.indicesSet("input_indices",C,b.indicesGet("output_indices",E))};`),E++);return`

        ${$.registerUniform("output_size","u32").declareVariables(v,b)}

        ${$.mainStart()}
          ${$.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          var input_indices: ${v.type.indices};
          let output_indices = ${b.offsetToIndices("global_idx")};

          ${x.join(`
`)}
          ${k[0]}       // init ops for reduce max/min
          ${k[1]}
          ${T}
          ${k[3]}
          ${k.length===4?b.setByOffset("global_idx","value"):k.slice(4).join(`
`)}
        }`},getRunData:()=>({outputs:[{dims:d,dataType:o}],dispatchGroup:{x:Math.ceil(_/64)},programUniforms:[{type:12,data:_},...Y(p,d)]})}},va=(e,t)=>{let i=[];return e[1].dims[0]>0&&e[1].getBigInt64Array().forEach(r=>i.push(Number(r))),ge({axes:i,keepDims:t.keepDims,noopWithEmptyAxes:t.noopWithEmptyAxes})},Ge=(e,t,i,r)=>{let a=e.inputs,o=a.length===1?i:va(a,i);e.compute(Gr(t,{hint:o.cacheKey,inputDependencies:["rank"]},[a[0]],o.noopWithEmptyAxes&&o.axes.length===0?nu:r,o.axes,a[0].dataType,o.keepDims,o.noopWithEmptyAxes),{inputs:[0]})},su=(e,t)=>{Fe(e.inputs),Ge(e,"ReduceLogSum",t,(i,r)=>[`var value = ${r.type.storage}(0);`,"",`value += ${i.getByIndices("input_indices")};`,"value = log(value);"])},ou=(e,t)=>{Fe(e.inputs),Ge(e,"ReduceL1",t,(i,r)=>[`var value = ${r.type.storage}(0);`,"",`value += abs(${i.getByIndices("input_indices")});`,""])},uu=(e,t)=>{Fe(e.inputs),Ge(e,"ReduceL2",t,(i,r)=>[`var t = ${r.type.value}(0); var value = ${r.type.value}(0);`,"",`t = ${i.getByIndices("input_indices")}; value += (t * t);`,"value = sqrt(value);"])},lu=(e,t)=>{Fe(e.inputs),Ge(e,"ReduceLogSumExp",t,(i,r)=>[`var value = ${r.type.storage}(0);`,"",`value += exp(${i.getByIndices("input_indices")});`,"value = log(value);"])},du=(e,t)=>{Fe(e.inputs),Ge(e,"ReduceMax",t,(i,r,a)=>{let o=[];for(let s=0;s<i.rank;s++)(a.indexOf(s)>=0||a.length===0)&&o.push(i.indicesSet("input_indices",s,0));return[`${o.join(`
`)}`,`var value = ${i.getByIndices("input_indices")};`,`value = max(value, ${i.getByIndices("input_indices")});`,""]})},pu=(e,t)=>{Fe(e.inputs),Ge(e,"ReduceMean",t,(i,r,a)=>{let o=1;for(let s=0;s<i.rank;s++)(a.indexOf(s)>=0||a.length===0)&&(o*=e.inputs[0].dims[s]);return["var sum = f32(0);","",`sum += f32(${i.getByIndices("input_indices")});`,`let value = ${r.type.value}(sum / ${o});`]})},cu=(e,t)=>{Fe(e.inputs),Ge(e,"ReduceMin",t,(i,r,a)=>{let o=[];for(let s=0;s<i.rank;s++)(a.indexOf(s)>=0||a.length===0)&&o.push(`input_indices[${s}] = 0;`);return[`${o.join(`
`)}`,`var value = ${i.getByIndices("input_indices")};`,`value = min(value, ${i.getByIndices("input_indices")});`,""]})},hu=(e,t)=>{Fe(e.inputs),Ge(e,"ReduceProd",t,(i,r)=>[`var value = ${r.type.storage}(1);`,"",`value *= ${i.getByIndices("input_indices")};`,""])},fu=(e,t)=>{Fe(e.inputs),Ge(e,"ReduceSum",t,(i,r)=>[`var value = ${r.type.storage}(0);`,"",`value += ${i.getByIndices("input_indices")};`,""])},mu=(e,t)=>{Fe(e.inputs),Ge(e,"ReduceSumSquare",t,(i,r)=>[`var t = ${r.type.value}(0); var value = ${r.type.value}(0);`,"",`t = ${i.getByIndices("input_indices")}; value += t * t;`,""])},He=(e,t,i)=>{if(t.length===0)return i;let r=1,a=1;for(let o=0;o<t.length;o++)t.indexOf(o)===-1?r*=e[o]:a*=e[o];return a<32&&r>1024},jp=(e,t)=>{He(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?pu(e,t):Dp(e,t)},Kp=(e,t)=>{He(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?ou(e,t):Pp(e,t)},Qp=(e,t)=>{He(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?uu(e,t):Up(e,t)},Zp=(e,t)=>{He(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?lu(e,t):Wp(e,t)},Xp=(e,t)=>{He(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?du(e,t):qp(e,t)},Yp=(e,t)=>{He(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?cu(e,t):Lp(e,t)},Jp=(e,t)=>{He(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?hu(e,t):Vp(e,t)},ec=(e,t)=>{He(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?fu(e,t):Fp(e,t)},tc=(e,t)=>{He(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?mu(e,t):Gp(e,t)},rc=(e,t)=>{He(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?su(e,t):Hp(e,t)}}),Wi,ic,ac,xa,Ry=L(()=>{"use strict";ie(),$e(),Ka(),Wi=e=>{if(!e||e.length===0||e.length>2)throw new Error("ArgMinMaxOp op requires 1 or 2 inputs.");if(e[0].dataType!==1)throw new Error("Invalid input type.")},ic=(e,t)=>{Wi(e.inputs);let i=(r,a,o)=>{let s=[];for(let l=0;l<r.rank;l++)(o.indexOf(l)>=0||o.length===0)&&s.push(`input_indices[${l}] = 0;`);return[`${s.join(`
`)}`,`var value = ${r.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${r.getByIndices("input_indices")} ${t.selectLastIndex>0?"<=":"<"} value) {
         value = ${r.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",a.setByOffset("global_idx","best_index")]};e.compute(Gr("ArgMin",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],i,[t.axis],7,t.keepDims),{inputs:[0]})},ac=(e,t)=>{Wi(e.inputs);let i=(r,a,o)=>{let s=[];for(let l=0;l<r.rank;l++)(o.indexOf(l)>=0||o.length===0)&&s.push(`input_indices[${l}] = 0;`);return[`${s.join(`
`)}`,`var value = ${r.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${r.getByIndices("input_indices")} ${t.selectLastIndex>0?">=":">"} value) {
         value = ${r.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",a.setByOffset("global_idx","best_index")]};e.compute(Gr("argMax",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],i,[t.axis],7,t.keepDims),{inputs:[0]})},xa=e=>ge(e)}),gu,Ar,yu,_u,wu,pr,bu,nc,Qa=L(()=>{"use strict";ie(),le(),Ha(),de(),gu=(e,t)=>{let i=e[0],r=e[1],a=e[2],o=e[3],s=e[4],l=e[5];if(s&&l)throw new Error("Attention cannot have both past and attention_bias");if(i.dims.length!==3)throw new Error('Input "input" must have 3 dimensions');let d=i.dims[0],p=i.dims[1],f=i.dims[2];if(a.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimensions');if(r.dims.length!==2)throw new Error('Input "weights" is expected to have 2 dimensions');if(r.dims[0]!==f)throw new Error("Input 1 dimension 0 should have same length as dimension 2 of input 0");if(a.dims[0]!==r.dims[1])throw new Error('Input "bias" dimension 0 should have same length as dimension 1 of input "weights"');let m=a.dims[0]/3,g=m,w=g;if(t.qkvHiddenSizes.length>0){if(t.qkvHiddenSizes.length!==3)throw new Error("qkv_hidden_sizes attribute should have 3 elements");for(let k of t.qkvHiddenSizes)if(k%t.numHeads!==0)throw new Error("qkv_hidden_sizes should be divisible by num_heads");m=t.qkvHiddenSizes[0],g=t.qkvHiddenSizes[1],w=t.qkvHiddenSizes[2]}let _=p;if(m!==g)throw new Error("qkv_hidden_sizes first element should be same as the second");if(a.dims[0]!==m+g+w)throw new Error('Input "bias" dimension 0 should have same length as sum of Q/K/V hidden sizes');let $=0;if(s){if(g!==w)throw new Error('Input "past" expect k_hidden_size == v_hidden_size');if(s.dims.length!==5)throw new Error('Input "past" must have 5 dimensions');if(s.dims[0]!==2)throw new Error('Input "past" first dimension must be 2');if(s.dims[1]!==d)throw new Error('Input "past" second dimension must be batch_size');if(s.dims[2]!==t.numHeads)throw new Error('Input "past" third dimension must be num_heads');if(s.dims[4]!==g/t.numHeads)throw new Error('Input "past" fifth dimension must be k_hidden_size / num_heads');t.pastPresentShareBuffer||($=s.dims[3])}let x=_+$,v=-1,b=0;if(o)throw new Error("Mask not supported");if(s)throw new Error("past is not supported");if(l){if(l.dims.length!==4)throw new Error('Input "attention_bias" must have 4 dimensions');if(l.dims[0]!==d||l.dims[1]!==t.numHeads||l.dims[2]!==p||l.dims[3]!==x)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:d,sequenceLength:p,pastSequenceLength:$,kvSequenceLength:_,totalSequenceLength:x,maxSequenceLength:v,inputHiddenSize:f,hiddenSize:m,vHiddenSize:w,headSize:Math.floor(m/t.numHeads),vHeadSize:Math.floor(w/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:b,scale:t.scale,broadcastResPosBias:!1,passPastInKv:!1,qkvFormat:1}},Ar=(e,t,i)=>t&&e?`
      let total_sequence_length_input = u32(${t.getByOffset("0")});
      let present_sequence_length = max(total_sequence_length_input, uniforms.past_sequence_length);
      let is_subsequent_prompt: bool = sequence_length > 1 && sequence_length != total_sequence_length_input;
      let is_first_prompt: bool = is_subsequent_prompt == false && sequence_length == total_sequence_length_input;
      total_sequence_length = u32(${e?.getByOffset("batchIdx")}) + 1;
      var past_sequence_length: u32 = 0;
      if (is_first_prompt == false) {
        past_sequence_length = total_sequence_length - sequence_length;
      }
       `:`
    ${i?"let past_sequence_length = uniforms.past_sequence_length":""};
    let present_sequence_length = total_sequence_length;
    `,yu=(e,t,i,r,a,o,s,l)=>{let d=be(s?1:o),p=64,f=o/d;f<p&&(p=32);let m=Math.ceil(o/d/p),g=[{type:12,data:t},{type:12,data:i},{type:12,data:r},{type:12,data:a},{type:12,data:f},{type:12,data:m}],w=Te(e.dataType,d),_=ze(1,d),$=["type"];s&&$.push("type"),l&&$.push("type");let x=v=>{let b=Z("x",e.dataType,e.dims,d),k=[b],T=s?M("seq_lens",s.dataType,s.dims):void 0;T&&k.push(T);let C=l?M("total_sequence_length_input",l.dataType,l.dims):void 0;C&&k.push(C);let E=ze(e.dataType),z=[{name:"batch_size",type:"u32"},{name:"num_heads",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"sequence_length",type:"u32"},{name:"total_sequence_length",type:"u32"},{name:"elements_per_thread",type:"u32"}];return`
  var<workgroup> thread_max: array<f32, ${p}>;
  var<workgroup> thread_sum: array<f32, ${p}>;
  ${v.registerUniforms(z).declareVariables(...k)}
  ${v.mainStart([p,1,1])}
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let sequence_length = uniforms.sequence_length;
    var total_sequence_length = uniforms.total_sequence_length;
    ${Ar(T,C,!1)}
    let local_offset = local_idx * uniforms.elements_per_thread;
    let offset = (global_idx / ${p}) * uniforms.total_sequence_length + local_offset;
    let seq_causal_length = ${s?"u32(past_sequence_length + workgroup_id.y + 1)":"total_sequence_length"};
    var thread_max_vector = ${_}(-3.402823e+38f);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      thread_max_vector = max(${_}(x[offset + i]), thread_max_vector);
    }
    thread_max[local_idx] = ${(()=>{switch(d){case 1:return"thread_max_vector";case 2:return"max(thread_max_vector.x, thread_max_vector.y)";case 4:return"max(max(thread_max_vector.x, thread_max_vector.y), max(thread_max_vector.z, thread_max_vector.w))";default:throw new Error(`Unsupported components: ${d}`)}})()};
    workgroupBarrier();

    var max_value =  f32(-3.402823e+38f);
    for (var i = 0u; i < ${p}; i++) {
      max_value = max(thread_max[i], max_value);
    }

    var sum_vector = ${_}(0);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      sum_vector += exp(${_}(x[offset + i]) - max_value);
    }
    thread_sum[local_idx] = ${(()=>{switch(d){case 1:return"sum_vector";case 2:return"sum_vector.x + sum_vector.y";case 4:return"sum_vector.x + sum_vector.y + sum_vector.z + sum_vector.w";default:throw new Error(`Unsupported components: ${d}`)}})()};
    workgroupBarrier();

    var sum: f32 = 0;
    for (var i = 0u; i < ${p}; i++) {
      sum += thread_sum[i];
    }

    if (sum == 0) {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        x[offset + i] = ${b.type.value}(${E}(1.0) / ${E}(seq_causal_length));
      }
    } else {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        var f32input = ${_}(x[offset + i]);
        x[offset + i] = ${b.type.value}(exp(f32input - max_value) / sum);
      }
    }
      ${s?`
        for (var total_seq_id: u32 = seq_causal_length; total_seq_id + local_offset < uniforms.total_sequence_length; total_seq_id++) {
          x[offset + total_seq_id] = ${b.type.value}(${E}(0));
        }`:""};
  }`};return{name:"AttentionProbsSoftmax",shaderCache:{hint:`${p};${w};${d}`,inputDependencies:$},getShaderSource:x,getRunData:()=>({outputs:[],dispatchGroup:{x:Math.ceil(o/p),y:a,z:t*i},programUniforms:g})}},_u=(e,t,i,r,a,o,s,l,d)=>{let p=s+o.kvSequenceLength,f=[o.batchSize,o.numHeads,o.sequenceLength,p],m=e>1&&r,g=o.kvNumHeads?o.kvNumHeads:o.numHeads,w=m?[o.batchSize,g,p,o.headSize]:void 0,_=o.nReps?o.nReps:1,$=o.scale===0?1/Math.sqrt(o.headSize):o.scale,x=be(o.headSize),v=o.headSize/x,b=12,k={x:Math.ceil(p/b),y:Math.ceil(o.sequenceLength/b),z:o.batchSize*o.numHeads},T=[{type:12,data:o.sequenceLength},{type:12,data:v},{type:12,data:p},{type:12,data:o.numHeads},{type:12,data:o.headSize},{type:1,data:$},{type:12,data:s},{type:12,data:o.kvSequenceLength},{type:12,data:_}],C=m&&r&&O.size(r.dims)>0,E=["type","type"];C&&E.push("type"),a&&E.push("type"),l&&E.push("type"),d&&E.push("type");let z=[{dims:f,dataType:t.dataType,gpuDataType:0}];m&&z.push({dims:w,dataType:t.dataType,gpuDataType:0});let N=W=>{let H=M("q",t.dataType,t.dims,x),V=M("key",i.dataType,i.dims,x),G=[H,V];if(C){let F=M("past_key",r.dataType,r.dims,x);G.push(F)}a&&G.push(M("attention_bias",a.dataType,a.dims));let D=l?M("seq_lens",l.dataType,l.dims):void 0;D&&G.push(D);let re=d?M("total_sequence_length_input",d.dataType,d.dims):void 0;re&&G.push(re);let te=Z("output",t.dataType,f),j=[te];m&&j.push(Z("present_key",t.dataType,w,x));let se=ze(1,x),pe=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"alpha",type:"f32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${b}u;

  var<workgroup> tileQ: array<${H.type.storage}, ${b*b}>;
  var<workgroup> tileK: array<${H.type.storage}, ${b*b}>;
  ${W.registerUniforms(pe).declareVariables(...G,...j)}
  ${W.mainStart([b,b,1])}
    // x holds the N and y holds the M
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let kvHeadIdx = ${_===1?"headIdx":"headIdx / uniforms.n_reps"};
    let kv_num_heads = ${_===1?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let m = workgroup_id.y * TILE_SIZE;
    let n = workgroup_id.x * TILE_SIZE;
    let sequence_length = uniforms.M;
    var total_sequence_length = uniforms.N;
    ${Ar(D,re,!0)}
    let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx;
    let qOffset = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
    ${C&&m?"let pastKeyOffset = absKvHeadIdx * uniforms.past_sequence_length * uniforms.K;":""};
    let kOffset = absKvHeadIdx * uniforms.kv_sequence_length * uniforms.K;
    ${m?"let presentKeyOffset = absKvHeadIdx * uniforms.N * uniforms.K;":""}
    var value = ${se}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (global_id.y < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = q[qOffset + local_id.y * uniforms.K + w + local_id.x];
      }
      if (n + local_id.y < uniforms.N && w + local_id.x < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
      ${C&&m?`
              if (n + local_id.y < past_sequence_length) {
                tileK[idx] = past_key[pastKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
              } else if (n + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
                tileK[idx] = key[kOffset + (n + local_id.y - past_sequence_length) * uniforms.K + w + local_id.x];
              }`:`
          if (n + local_id.y < uniforms.kv_sequence_length) {
            tileK[idx] = key[kOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
          }`}
      ${m?`if (n + local_id.y < present_sequence_length) {
        present_key[presentKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x] = tileK[idx];
      }`:""}
      }
      workgroupBarrier();

      for (var k: u32 = 0u; k < TILE_SIZE && w+k < uniforms.K; k++) {
          value += ${se}(tileQ[TILE_SIZE * local_id.y + k] * tileK[TILE_SIZE * local_id.x + k]);
      }

      workgroupBarrier();
    }

    if (global_id.y < uniforms.M && global_id.x < total_sequence_length) {
      let headOffset = workgroup_id.z * uniforms.M * uniforms.N;
      let outputIdx = headOffset + global_id.y * uniforms.N + global_id.x;
      var sum: f32 = ${(()=>{switch(x){case 1:return"value";case 2:return"value.x + value.y";case 4:return"value.x + value.y + value.z + value.w";default:throw new Error(`Unsupported components: ${x}`)}})()};
        output[outputIdx] = ${te.type.value} (sum * uniforms.alpha) + ${a?"attention_bias[outputIdx]":"0.0"};
    }
  }`};return{name:"AttentionProbs",shaderCache:{hint:`${x};${a!==void 0};${r!==void 0};${e}`,inputDependencies:E},getRunData:()=>({outputs:z,dispatchGroup:k,programUniforms:T}),getShaderSource:N}},wu=(e,t,i,r,a,o,s=void 0,l=void 0)=>{let d=o+a.kvSequenceLength,p=a.nReps?a.nReps:1,f=a.vHiddenSize*p,m=e>1&&r,g=a.kvNumHeads?a.kvNumHeads:a.numHeads,w=m?[a.batchSize,g,d,a.headSize]:void 0,_=[a.batchSize,a.sequenceLength,f],$=12,x={x:Math.ceil(a.vHeadSize/$),y:Math.ceil(a.sequenceLength/$),z:a.batchSize*a.numHeads},v=[{type:12,data:a.sequenceLength},{type:12,data:d},{type:12,data:a.vHeadSize},{type:12,data:a.numHeads},{type:12,data:a.headSize},{type:12,data:f},{type:12,data:o},{type:12,data:a.kvSequenceLength},{type:12,data:p}],b=m&&r&&O.size(r.dims)>0,k=["type","type"];b&&k.push("type"),s&&k.push("type"),l&&k.push("type");let T=[{dims:_,dataType:t.dataType,gpuDataType:0}];m&&T.push({dims:w,dataType:t.dataType,gpuDataType:0});let C=E=>{let z=M("probs",t.dataType,t.dims),N=M("v",i.dataType,i.dims),W=[z,N];b&&W.push(M("past_value",r.dataType,r.dims));let H=s?M("seq_lens",s.dataType,s.dims):void 0;s&&W.push(H);let V=l?M("total_sequence_length_input",l.dataType,l.dims):void 0;l&&W.push(V);let G=[Z("output",t.dataType,_)];m&&G.push(Z("present_value",t.dataType,w));let D=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"v_hidden_size",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${$}u;
  var<workgroup> tileQ: array<${z.type.value}, ${$*$}>;
  var<workgroup> tileV: array<${z.type.value}, ${$*$}>;
  ${E.registerUniforms(D).declareVariables(...W,...G)}
  ${E.mainStart([$,$,1])}
   let headIdx = workgroup_id.z % uniforms.num_heads;
   let batchIdx = workgroup_id.z / uniforms.num_heads;
   let kvHeadIdx = ${p===1?"headIdx":"headIdx / uniforms.n_reps"};
   let kv_num_heads = ${p===1?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
   let m = global_id.y;
   let n = global_id.x;
   let sequence_length = uniforms.M;
   var total_sequence_length = uniforms.K;
   ${Ar(H,V,!0)}
   let offsetA = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
   let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx; // kvHeadIdx is relative to the batch
   ${b&&m?"let pastValueOffset = absKvHeadIdx * uniforms.N * uniforms.past_sequence_length + n;":""};
   let vOffset = absKvHeadIdx * uniforms.N * uniforms.kv_sequence_length + n;
   ${m?"let presentValueOffset = absKvHeadIdx * uniforms.N * uniforms.K + n;":""}
   var value = ${z.type.storage}(0);
   for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = probs[offsetA + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
        ${b&&m?`
        if (w + local_id.y < past_sequence_length) {
          tileV[idx] = past_value[pastValueOffset + (w + local_id.y) * uniforms.N];
        } else if (w + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
          tileV[idx] = v[vOffset + (w + local_id.y - past_sequence_length) * uniforms.N];
        }
      `:`
            if (w + local_id.y < uniforms.kv_sequence_length) {
              tileV[idx] = v[vOffset + (w + local_id.y) * uniforms.N];
            }`}
        ${m?`
            if (w + local_id.y < present_sequence_length) {
          present_value[presentValueOffset + (w + local_id.y) * uniforms.N] = tileV[idx];
        }`:""}
      }
     workgroupBarrier();
     for (var k: u32 = 0u; k < TILE_SIZE && w+k < total_sequence_length; k++) {
       value += tileQ[TILE_SIZE * local_id.y + k] * tileV[TILE_SIZE * k + local_id.x];
     }
     workgroupBarrier();
   }

   // we need to transpose output from BNSH_v to BSND_v
   if (m < uniforms.M && n < uniforms.N) {
     let outputIdx = batchIdx * uniforms.M * uniforms.v_hidden_size + m * uniforms.v_hidden_size
       + headIdx * uniforms.N + n;
     output[outputIdx] = value;
   }
  }`};return{name:"AttentionScore",shaderCache:{hint:`${r!==void 0};${e}`,inputDependencies:k},getRunData:()=>({outputs:T,dispatchGroup:x,programUniforms:v}),getShaderSource:C}},pr=(e,t,i,r,a,o,s,l,d,p,f=void 0,m=void 0)=>{let g=Math.min(e.outputCount,1+(s?1:0)+(l?1:0)),w=g>1?p.pastSequenceLength:0,_=w+p.kvSequenceLength,$=d&&O.size(d.dims)>0?d:void 0,x=[t,i];g>1&&s&&O.size(s.dims)>0&&x.push(s),$&&x.push($),f&&x.push(f),m&&x.push(m);let v=e.compute(_u(g,t,i,s,$,p,w,f,m),{inputs:x,outputs:g>1?[-1,1]:[-1]})[0];e.compute(yu(v,p.batchSize,p.numHeads,w,p.sequenceLength,_,f,m),{inputs:f&&m?[v,f,m]:[v],outputs:[]});let b=[v,r];g>1&&l&&O.size(l.dims)>0&&b.push(l),f&&b.push(f),m&&b.push(m),e.compute(wu(g,v,r,l,p,w,f,m),{inputs:b,outputs:g>1?[0,2]:[0]})},bu=(e,t)=>{let i=[t.batchSize,t.numHeads,t.sequenceLength,t.headSize],r=t.sequenceLength,a=t.inputHiddenSize,o=t.headSize,s=12,l={x:Math.ceil(t.headSize/s),y:Math.ceil(t.sequenceLength/s),z:t.batchSize*t.numHeads},d=[e.inputs[0],e.inputs[1],e.inputs[2]],p=[{type:12,data:r},{type:12,data:a},{type:12,data:o},{type:12,data:t.numHeads},{type:12,data:t.headSize},{type:12,data:t.hiddenSize},{type:12,data:t.hiddenSize+t.hiddenSize+t.vHiddenSize}],f=m=>{let g=Z("output_q",d[0].dataType,i),w=Z("output_k",d[0].dataType,i),_=Z("output_v",d[0].dataType,i),$=M("input",d[0].dataType,d[0].dims),x=M("weight",d[1].dataType,d[1].dims),v=M("bias",d[2].dataType,d[2].dims),b=$.type.storage,k=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"hidden_size",type:"u32"},{name:"ldb",type:"u32"}];return`
  const TILE_SIZE = ${s}u;
  var<workgroup> tileInput: array<${b}, ${s*s}>;
  var<workgroup> tileWeightQ: array<${b}, ${s*s}>;
  var<workgroup> tileWeightK: array<${b}, ${s*s}>;
  var<workgroup> tileWeightV: array<${b}, ${s*s}>;
  ${m.registerUniforms(k).declareVariables($,x,v,g,w,_)}
  ${m.mainStart([s,s,1])}
    let batchIndex = workgroup_id.z / uniforms.num_heads;
    let headNumber = workgroup_id.z % uniforms.num_heads;
    let m = global_id.y;
    let n = global_id.x;

    let inputOffset = batchIndex * (uniforms.M * uniforms.K) + m * uniforms.K;
    let biasOffsetQ = headNumber * uniforms.head_size;
    let biasOffsetK = uniforms.hidden_size + biasOffsetQ;
    let biasOffsetV = uniforms.hidden_size + biasOffsetK;

    var valueQ = ${b}(0);
    var valueK = ${b}(0);
    var valueV = ${b}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileInput[TILE_SIZE * local_id.y + local_id.x] = input[inputOffset + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        let offset = n + (w + local_id.y) * uniforms.ldb;
        tileWeightQ[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetQ + offset];
        tileWeightK[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetK + offset];
        tileWeightV[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetV + offset];
      }
      workgroupBarrier();
      for (var k: u32 = 0u; k<TILE_SIZE && w+k < uniforms.K; k++) {
        let inputTileOffset = TILE_SIZE * local_id.y + k;
        let weightTileOffset = TILE_SIZE * k + local_id.x;
        valueQ += tileInput[inputTileOffset] * tileWeightQ[weightTileOffset];
        valueK += tileInput[inputTileOffset] * tileWeightK[weightTileOffset];
        valueV += tileInput[inputTileOffset] * tileWeightV[weightTileOffset];
      }

      workgroupBarrier();
    }

    let headOffset = (m * uniforms.N + n) % uniforms.head_size;
    valueQ += bias[headOffset + biasOffsetQ];
    valueK += bias[headOffset + biasOffsetK];
    valueV += bias[headOffset + biasOffsetV];

    let offset = workgroup_id.z * uniforms.M * uniforms.N;
    if (m < uniforms.M && n < uniforms.N) {
      let outputIdx = offset + m * uniforms.N + n;
      output_q[outputIdx] = valueQ;
      output_k[outputIdx] = valueK;
      output_v[outputIdx] = valueV;
    }
  }`};return e.compute({name:"AttentionPrepare",shaderCache:{inputDependencies:["type","type","type"]},getRunData:()=>({outputs:[{dims:i,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:i,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:i,dataType:e.inputs[0].dataType,gpuDataType:0}],dispatchGroup:l,programUniforms:p}),getShaderSource:f},{inputs:d,outputs:[-1,-1,-1]})},nc=(e,t)=>{let i=gu(e.inputs,t),[r,a,o]=bu(e,i);return pr(e,r,a,o,e.inputs[4],void 0,void 0,void 0,e.inputs[5],i)}}),$u,vu,xu,sc,By=L(()=>{"use strict";Ze(),ie(),le(),$e(),de(),$u=(e,t)=>{if(!e||e.length!==5)throw new Error("BatchNormalization requires 5 inputs");let i=(r,a,o)=>{let s=a.length;if(s!==r.length)throw new Error(`${o}: num dimensions != ${s}`);a.forEach((l,d)=>{if(l!==r[d])throw new Error(`${o}: dim[${d}] do not match`)})};if(e[0].dims.length>1){let r=t.format==="NHWC"?t.spatial?e[0].dims.slice(-1):e[0].dims.slice(-1).concat(e[0].dims.slice(1,e[0].dims.length-1)):e[0].dims.slice(1,t.spatial?2:void 0);i(e[1].dims,r,"Invalid input scale"),i(e[2].dims,r,"Invalid input B"),i(e[3].dims,r,"Invalid input mean"),i(e[4].dims,r,"Invalid input var")}else i(e[1].dims,[1],"Invalid input scale"),i(e[2].dims,[1],"Invalid input B"),i(e[3].dims,[1],"Invalid input mean"),i(e[4].dims,[1],"Invalid input var")},vu=(e,t)=>{let{epsilon:i,spatial:r,format:a}=t,o=e[0].dims,s=r?be(o[o.length-1]):1,l=a==="NHWC"&&o.length>1?s:1,d=O.size(o)/s,p=r,f=p?o.length:o,m=M("x",e[0].dataType,e[0].dims,s),g=M("scale",e[1].dataType,e[1].dims,l),w=M("bias",e[2].dataType,e[2].dims,l),_=M("inputMean",e[3].dataType,e[3].dims,l),$=M("inputVar",e[4].dataType,e[4].dims,l),x=Z("y",e[0].dataType,f,s),v=()=>{let k="";if(r)k=`let cOffset = ${o.length===1?"0u":a==="NHWC"?`outputIndices[${o.length-1}] / ${s}`:"outputIndices[1]"};`;else if(a==="NCHW")k=`
            ${x.indicesSet("outputIndices","0","0")}
            let cOffset = ${x.indicesToOffset("outputIndices")};`;else{k=`var cIndices = ${g.type.indices}(0);
                       cIndices[0] = outputIndices[${o.length-1}];`;for(let T=1;T<g.rank;T++)k+=`cIndices[${T}] = outputIndices[${T}];`;k+=`let cOffset = ${g.indicesToOffset("cIndices")};`}return k},b=k=>`
  const epsilon = ${i};
  ${k.registerUniform("outputSize","u32").declareVariables(m,g,w,_,$,x)}
  ${k.mainStart()}
  ${k.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
    var outputIndices = ${x.offsetToIndices(`global_idx * ${s}`)};
    ${v()}
    let scale = ${g.getByOffset("cOffset")};
    let bias = ${w.getByOffset("cOffset")};
    let inputMean = ${_.getByOffset("cOffset")};
    let inputVar = ${$.getByOffset("cOffset")};
    let x = ${m.getByOffset("global_idx")};
    let value = (x - inputMean) * inverseSqrt(inputVar + epsilon) * scale + bias;
    ${x.setByOffset("global_idx","value")}
  }`;return{name:"BatchNormalization",shaderCache:{hint:`${t.epsilon}_${t.format}_${r}_${s}`,inputDependencies:p?["rank","type","type","type","type"]:void 0},getShaderSource:b,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:p?[{type:12,data:d},...Y(o)]:[{type:12,data:d}]})}},xu=e=>ge(e),sc=(e,t)=>{let{inputs:i,outputCount:r}=e,a=xu({...t,outputCount:r});if(_e.webgpu.validateInputContent&&$u(i,a),t.trainingMode)throw new Error("BatchNormalization trainingMode is not supported yet.");e.compute(vu(i,a))}}),Su,ku,oc,My=L(()=>{"use strict";le(),de(),Su=e=>{if(e[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![320,640,1280].includes(e[0].dims[2]))throw new Error("number of channels should be 320, 640 or 1280");if(e[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw new Error("last dimension of input and bias are not the same")},ku=e=>{let t=e[0].dims,i=e[0].dims[2],r=O.size(t)/4,a=e[0].dataType,o=M("input",a,t,4),s=M("bias",a,[i],4),l=M("residual",a,t,4),d=Z("output",a,t,4);return{name:"BiasAdd",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(r/64)}}),getShaderSource:p=>`
  const channels = ${i}u / 4;
  ${p.declareVariables(o,s,l,d)}

  ${p.mainStart()}
    ${p.guardAgainstOutOfBoundsWorkgroupSizes(r)}
    let value = ${o.getByOffset("global_idx")}
      + ${s.getByOffset("global_idx % channels")} + ${l.getByOffset("global_idx")};
    ${d.setByOffset("global_idx","value")}
  }`}},oc=e=>{Su(e.inputs),e.compute(ku(e.inputs))}}),Tu,fe,uc,lc,dc,pc,cc,hc,fc,mc,gc,Iu,yc,_c,wc,bc,or,$c,Wr,vc,xc,Sc,kc,Tc,Ic,Cc,Ec,zc,Ac,Oc,Rc,Bc,Mc,Nc,Dc,qi,Pc,Sa,ka,Uc,Wc,qc,Cu,Eu,Lc,Za=L(()=>{"use strict";ie(),le(),$e(),de(),Tu=(e,t,i,r,a,o,s)=>{let l=Math.ceil(t/4),d="";typeof a=="string"?d=`${a}(a)`:d=a("a");let p=M("inputData",i,[l],4),f=Z("outputData",r,[l],4),m=[{name:"vec_size",type:"u32"}];return s&&m.push(...s),`
      ${e.registerUniforms(m).declareVariables(p,f)}

  ${o??""}

  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}

    let a = ${p.getByOffset("global_idx")};
    ${f.setByOffset("global_idx",d)}
  }`},fe=(e,t,i,r,a,o=e.dataType,s,l)=>{let d=[{type:12,data:Math.ceil(O.size(e.dims)/4)}];return s&&d.push(...s),{name:t,shaderCache:{hint:a,inputDependencies:["type"]},getShaderSource:p=>Tu(p,O.size(e.dims),e.dataType,o,i,r,l),getRunData:p=>({outputs:[{dims:e.dims,dataType:o}],dispatchGroup:{x:Math.ceil(O.size(p[0].dims)/64/4)},programUniforms:d})}},uc=e=>{e.compute(fe(e.inputs[0],"Abs","abs"))},lc=e=>{e.compute(fe(e.inputs[0],"Acos","acos"))},dc=e=>{e.compute(fe(e.inputs[0],"Acosh","acosh"))},pc=e=>{e.compute(fe(e.inputs[0],"Asin","asin"))},cc=e=>{e.compute(fe(e.inputs[0],"Asinh","asinh"))},hc=e=>{e.compute(fe(e.inputs[0],"Atan","atan"))},fc=e=>{e.compute(fe(e.inputs[0],"Atanh","atanh"))},mc=e=>ge(e),gc=(e,t)=>{let i;switch(t.to){case 10:i="vec4<f16>";break;case 1:i="vec4<f32>";break;case 12:i="vec4<u32>";break;case 6:i="vec4<i32>";break;case 9:i="vec4<bool>";break;default:throw new RangeError(`not supported type (specified in attribute 'to' from 'Cast' operator): ${t.to}`)}e.compute(fe(e.inputs[0],"Cast",i,void 0,t.cacheKey,t.to))},Iu=e=>{let t,i,r=e.length>=2&&e[1].data!==0,a=e.length>=3&&e[2].data!==0;switch(e[0].dataType){case 1:t=r?e[1].getFloat32Array()[0]:-34028234663852886e22,i=a?e[2].getFloat32Array()[0]:34028234663852886e22;break;case 10:t=r?e[1].getUint16Array()[0]:64511,i=a?e[2].getUint16Array()[0]:31743;break;default:throw new Error("Unsupport data type")}return ge({min:t,max:i})},yc=(e,t)=>{let i=t||Iu(e.inputs),r=ze(e.inputs[0].dataType);e.compute(fe(e.inputs[0],"Clip",a=>`clamp(${a}, vec4<${r}>(uniforms.min), vec4<${r}>(uniforms.max))`,void 0,i.cacheKey,void 0,[{type:e.inputs[0].dataType,data:i.min},{type:e.inputs[0].dataType,data:i.max}],[{name:"min",type:r},{name:"max",type:r}]),{inputs:[0]})},_c=e=>{e.compute(fe(e.inputs[0],"Ceil","ceil"))},wc=e=>{e.compute(fe(e.inputs[0],"Cos","cos"))},bc=e=>{e.compute(fe(e.inputs[0],"Cosh","cosh"))},or=e=>ge(e),$c=(e,t)=>{let i=ze(e.inputs[0].dataType);e.compute(fe(e.inputs[0],"Elu",r=>`elu_vf32(${r})`,`
  const elu_alpha_ = ${i}(${t.alpha});

  fn elu_f32(a: ${i}) -> ${i} {
  return select((exp(a) - 1.0) * elu_alpha_, a, a >= 0.0);
  }

  fn elu_vf32(v: vec4<${i}>) -> vec4<${i}> {
  return vec4(elu_f32(v.x), elu_f32(v.y), elu_f32(v.z), elu_f32(v.w));
  }`,t.cacheKey))},Wr=(e="f32")=>`
const r0: ${e} = 0.3275911;
const r1: ${e} = 0.254829592;
const r2: ${e} = -0.284496736;
const r3: ${e} = 1.421413741;
const r4: ${e} = -1.453152027;
const r5: ${e} = 1.061405429;

fn erf_vf32(v: vec4<${e}>) -> vec4<${e}> {
  let absv = abs(v);
  let x = 1.0 / (1.0 + r0 * absv);
  return sign(v) * (1.0 - ((((r5 * x + r4) * x + r3) * x + r2) * x + r1) * x * exp(-absv * absv));
}`,vc=e=>{let t=ze(e.inputs[0].dataType);e.compute(fe(e.inputs[0],"Erf",i=>`erf_vf32(${i})`,Wr(t)))},xc=e=>{e.compute(fe(e.inputs[0],"Exp","exp"))},Sc=e=>{e.compute(fe(e.inputs[0],"Floor","floor"))},kc=e=>{let t=ze(e.inputs[0].dataType);e.compute(fe(e.inputs[0],"Gelu",i=>`0.5 * ${i} * (1.0 + erf_vf32(${i} * 0.7071067811865475))`,Wr(t)))},Tc=(e,t)=>{let i=ze(e.inputs[0].dataType);e.compute(fe(e.inputs[0],"LeakyRelu",r=>`select(leaky_relu_alpha_ * ${r}, ${r}, ${r} >= vec4<${i}>(0.0))`,`const leaky_relu_alpha_ = ${i}(${t.alpha});`,t.cacheKey))},Ic=e=>{e.compute(fe(e.inputs[0],"Not",t=>`!${t}`))},Cc=e=>{e.compute(fe(e.inputs[0],"Neg",t=>`-${t}`))},Ec=e=>{e.compute(fe(e.inputs[0],"Reciprocal",t=>`1.0/${t}`))},zc=e=>{let t=ze(e.inputs[0].dataType);e.compute(fe(e.inputs[0],"Relu",i=>`select(vec4<${t}>(0.0), ${i}, ${i} > vec4<${t}>(0.0))`))},Ac=e=>{e.compute(fe(e.inputs[0],"Sigmoid",t=>`(1.0 / (1.0 + exp(-${t})))`))},Oc=e=>ge(e),Rc=(e,t)=>{let i=ze(e.inputs[0].dataType);e.compute(fe(e.inputs[0],"HardSigmoid",r=>`max(vec4<${i}>(0.0), min(vec4<${i}>(1.0), ${t.alpha} * ${r} + vec4<${i}>(${t.beta})))`,void 0,t.cacheKey))},Bc=e=>{e.compute(fe(e.inputs[0],"Sin","sin"))},Mc=e=>{e.compute(fe(e.inputs[0],"Sinh","sinh"))},Nc=e=>{e.compute(fe(e.inputs[0],"Sqrt","sqrt"))},Dc=e=>{e.compute(fe(e.inputs[0],"Tan","tan"))},qi=e=>`sign(${e}) * (1 - exp(-2 * abs(${e}))) / (1 + exp(-2 * abs(${e})))`,Pc=e=>{e.compute(fe(e.inputs[0],"Tanh",qi))},Sa=(e="f32")=>`
const fast_gelu_a: ${e} = 0.5;
const fast_gelu_b: ${e} = 0.7978845608028654;
const fast_gelu_c: ${e} = 0.035677408136300125;

fn tanh_v(v: vec4<${e}>) -> vec4<${e}> {
  return ${qi("v")};
}
`,ka=e=>`(fast_gelu_a + fast_gelu_a * tanh_v(${e} * (fast_gelu_c * ${e} * ${e} + fast_gelu_b))) * ${e}`,Uc=e=>{let t=ze(e.inputs[0].dataType);e.compute(fe(e.inputs[0],"FastGelu",ka,Sa(t),void 0,e.inputs[0].dataType))},Wc=(e,t)=>{let i=ze(e.inputs[0].dataType);return e.compute(fe(e.inputs[0],"ThresholdedRelu",r=>`select(vec4<${i}>(0.0), ${r}, ${r} > thresholded_relu_alpha_)`,`const thresholded_relu_alpha_ = vec4<${i}>(${t.alpha});`,t.cacheKey)),0},qc=e=>{e.compute(fe(e.inputs[0],"Log","log"))},Cu=(e,t)=>`
const alpha = vec4<${e}>(${t});
const one = ${e}(1.0);
const zero = ${e}(0.0);

fn quick_gelu_impl(x: vec4<${e}>) -> vec4<${e}> {
  let v = x *alpha;
  var x1 : vec4<${e}>;
  for (var i = 0; i < 4; i = i + 1) {
    if (v[i] >= zero) {
      x1[i] = one / (one + exp(-v[i]));
    } else {
      x1[i] = one - one / (one + exp(v[i]));
    }
  }
  return x * x1;
}
`,Eu=e=>`quick_gelu_impl(${e})`,Lc=(e,t)=>{let i=ze(e.inputs[0].dataType);e.compute(fe(e.inputs[0],"QuickGelu",Eu,Cu(i,t.alpha),t.cacheKey,e.inputs[0].dataType))}}),zu,Au,Vc,Ny=L(()=>{"use strict";le(),de(),Za(),zu=e=>{if(e[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![2560,5120,10240].includes(e[0].dims[2]))throw new Error("hidden state should be 2560, 5120 or 10240");if(e[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw new Error("last dimension of input and bias are not the same")},Au=e=>{let t=e[0].dims.slice();t[2]=t[2]/2;let i=M("input",e[0].dataType,e[0].dims,4),r=M("bias",e[0].dataType,[e[0].dims[2]],4),a=Z("output",e[0].dataType,t,4),o=O.size(t)/4,s=Te(e[0].dataType);return{name:"BiasSplitGelu",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(o/64)}}),getShaderSource:l=>`
  const M_SQRT2 = sqrt(2.0);
  const halfChannels = ${e[0].dims[2]/4/2}u;

  ${l.declareVariables(i,r,a)}

  ${Wr(s)}

  ${l.mainStart()}
    ${l.guardAgainstOutOfBoundsWorkgroupSizes(o)}
    let biasIdx = global_idx % halfChannels;
    let batchIndex = global_idx / halfChannels;
    let inputOffset = biasIdx + batchIndex * halfChannels * 2;
    let valueLeft = input[inputOffset] + bias[biasIdx];
    let valueRight = input[inputOffset + halfChannels] + bias[biasIdx + halfChannels];
    let geluRight = valueRight * 0.5 * (erf_vf32(valueRight / M_SQRT2) + 1);

    ${a.setByOffset("global_idx","valueLeft * geluRight")}
  }`}},Vc=e=>{zu(e.inputs),e.compute(Au(e.inputs))}}),Ou,Ru,je,Fc,Gc,Hc,jc,Kc,Qc,Zc,Xc,Yc,Jc,Dy=L(()=>{"use strict";ie(),le(),de(),Ou=(e,t,i,r,a,o,s,l,d,p,f,m)=>{let g,w;typeof l=="string"?g=w=(b,k)=>`${l}((${b}),(${k}))`:typeof l=="function"?g=w=l:(g=l.scalar,w=l.vector);let _=Z("outputData",f,r.length,4),$=M("aData",d,t.length,4),x=M("bData",p,i.length,4),v;if(a)if(o){let b=O.size(t)===1,k=O.size(i)===1,T=t.length>0&&t[t.length-1]%4===0,C=i.length>0&&i[i.length-1]%4===0;b||k?v=_.setByOffset("global_idx",w(b?`${$.type.value}(${$.getByOffset("0")}.x)`:$.getByOffset("global_idx"),k?`${x.type.value}(${x.getByOffset("0")}.x)`:x.getByOffset("global_idx"))):v=`
            let outputIndices = ${_.offsetToIndices("global_idx * 4u")};
            let offsetA = ${$.broadcastedIndicesToOffset("outputIndices",_)};
            let offsetB = ${x.broadcastedIndicesToOffset("outputIndices",_)};
            ${_.setByOffset("global_idx",w(s||T?$.getByOffset("offsetA / 4u"):`${$.type.value}(${$.getByOffset("offsetA / 4u")}[offsetA % 4u])`,s||C?x.getByOffset("offsetB / 4u"):`${x.type.value}(${x.getByOffset("offsetB / 4u")}[offsetB % 4u])`))}
          `}else v=_.setByOffset("global_idx",w($.getByOffset("global_idx"),x.getByOffset("global_idx")));else{if(!o)throw new Error("no necessary to use scalar implementation for element-wise binary op implementation.");let b=(k,T,C="")=>{let E=`aData[indexA${T}][componentA${T}]`,z=`bData[indexB${T}][componentB${T}]`;return`
            let outputIndices${T} = ${_.offsetToIndices(`global_idx * 4u + ${T}u`)};
            let offsetA${T} = ${$.broadcastedIndicesToOffset(`outputIndices${T}`,_)};
            let offsetB${T} = ${x.broadcastedIndicesToOffset(`outputIndices${T}`,_)};
            let indexA${T} = offsetA${T} / 4u;
            let indexB${T} = offsetB${T} / 4u;
            let componentA${T} = offsetA${T} % 4u;
            let componentB${T} = offsetB${T} % 4u;
            ${k}[${T}] = ${C}(${g(E,z)});
          `};f===9?v=`
            var data = vec4<u32>(0);
            ${b("data",0,"u32")}
            ${b("data",1,"u32")}
            ${b("data",2,"u32")}
            ${b("data",3,"u32")}
            outputData[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:v=`
            ${b("outputData[global_idx]",0)}
            ${b("outputData[global_idx]",1)}
            ${b("outputData[global_idx]",2)}
            ${b("outputData[global_idx]",3)}
          `}return`
        ${e.registerUniform("vec_size","u32").declareVariables($,x,_)}

        ${m??""}

        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${v}
      }`},Ru=(e,t,i,r,a,o,s=i.dataType)=>{let l=i.dims.map($=>Number($)??1),d=r.dims.map($=>Number($)??1),p=!O.areEqual(l,d),f=l,m=O.size(l),g=!1,w=!1,_=[p];if(p){let $=Wt.calcShape(l,d,!1);if(!$)throw new Error("Can't perform binary op on the given tensors");f=$.slice(),m=O.size(f);let x=O.size(l)===1,v=O.size(d)===1,b=l.length>0&&l[l.length-1]%4===0,k=d.length>0&&d[d.length-1]%4===0;_.push(x),_.push(v),_.push(b),_.push(k);let T=1;for(let C=1;C<f.length;C++){let E=l[l.length-C],z=d[d.length-C];if(E===z)T*=E;else break}T%4===0?(w=!0,g=!0):(x||v||b||k)&&(g=!0)}else g=!0;return _.push(g),{name:e,shaderCache:{hint:t+_.map($=>$.toString()).join("_"),inputDependencies:["rank","rank"]},getShaderSource:$=>Ou($,l,d,f,g,p,w,a,i.dataType,r.dataType,s,o),getRunData:()=>({outputs:[{dims:f,dataType:s}],dispatchGroup:{x:Math.ceil(m/64/4)},programUniforms:[{type:12,data:Math.ceil(O.size(f)/4)},...Y(l,d,f)]})}},je=(e,t,i,r,a,o)=>{e.compute(Ru(t,a??"",e.inputs[0],e.inputs[1],i,r,o))},Fc=e=>{je(e,"Add",(t,i)=>`${t}+${i}`)},Gc=e=>{je(e,"Div",(t,i)=>`${t}/${i}`)},Hc=e=>{je(e,"Equal",{scalar:(t,i)=>`u32(${t}==${i})`,vector:(t,i)=>`vec4<u32>(${t}==${i})`},void 0,void 0,9)},jc=e=>{je(e,"Mul",(t,i)=>`${t}*${i}`)},Kc=e=>{let t=M("input",e.inputs[0].dataType,e.inputs[0].dims).type.value;je(e,"Pow",{scalar:(i,r)=>`pow_custom(${i},${r})`,vector:(i,r)=>`pow_vector_custom(${i},${r})`},`
    fn pow_custom(a : ${t}, b : ${t}) -> ${t} {
      if (b == ${t}(0.0)) {
        return ${t}(1.0);
      } else if (a < ${t}(0.0) && f32(b) != floor(f32(b))) {
        return ${t}(pow(f32(a), f32(b))); // NaN
      }
      return select(sign(a), ${t}(1.0), round(f32(abs(b) % ${t}(2.0))) != 1.0) * ${t}(${t==="i32"?"round":""}(pow(f32(abs(a)), f32(b))));
    }
    fn pow_vector_custom(a : vec4<${t}>, b : vec4<${t}>) -> vec4<${t}> {
      // TODO: implement vectorized pow
      return vec4<${t}>(pow_custom(a.x, b.x), pow_custom(a.y, b.y), pow_custom(a.z, b.z), pow_custom(a.w, b.w));
    }
      `)},Qc=e=>{je(e,"Sub",(t,i)=>`${t}-${i}`)},Zc=e=>{je(e,"Greater",{scalar:(t,i)=>`u32(${t}>${i})`,vector:(t,i)=>`vec4<u32>(${t}>${i})`},void 0,void 0,9)},Xc=e=>{je(e,"Less",{scalar:(t,i)=>`u32(${t}<${i})`,vector:(t,i)=>`vec4<u32>(${t}<${i})`},void 0,void 0,9)},Yc=e=>{je(e,"GreaterOrEqual",{scalar:(t,i)=>`u32(${t}>=${i})`,vector:(t,i)=>`vec4<u32>(${t}>=${i})`},void 0,void 0,9)},Jc=e=>{je(e,"LessOrEqual",{scalar:(t,i)=>`u32(${t}<=${i})`,vector:(t,i)=>`vec4<u32>(${t}<=${i})`},void 0,void 0,9)}}),Bu,Mu,Nu,Du,eh,th,Py=L(()=>{"use strict";ie(),le(),$e(),de(),Bu=(e,t)=>{if(!e||e.length<1)throw new Error("too few inputs");let i=0,r=e[i],a=r.dataType,o=r.dims.length;e.forEach((s,l)=>{if(l!==i){if(s.dataType!==a)throw new Error("input tensors should be one type");if(s.dims.length!==o)throw new Error("input tensors should have the same shape");s.dims.forEach((d,p)=>{if(p!==t&&d!==r.dims[p])throw new Error("non concat dimensions must match")})}})},Mu=(e,t)=>`
  fn calculateInputIndex(index: u32) -> u32 {
    let sizeInConcatAxis = array<u32, ${e}u>(${t});
    for (var i: u32 = 0u; i < ${e}; i += 1u ) {
      if (index < sizeInConcatAxis[i]) {
        return i;
      }
    }
    return ${e}u;
  }`,Nu=(e,t)=>{let i=e.length,r=[];for(let a=0;a<i;++a){let o=t.setByOffset("global_idx",e[a].getByIndices("indices"));i===1?r.push(o):a===0?r.push(`if (inputIndex == ${a}u) { ${o} }`):a===i-1?r.push(`else { ${o} }`):r.push(`else if (inputIndex == ${a}) { ${o} }`)}return r.join(`
`)},Du=(e,t,i,r)=>{let a=O.size(i),o=new Array(e.length),s=new Array(e.length),l=0,d=[],p=[],f=[{type:12,data:a}];for(let $=0;$<e.length;++$)l+=e[$].dims[t],o[$]=l,p.push(e[$].dims.length),s[$]=M(`input${$}`,r,p[$]),d.push("rank"),f.push({type:12,data:o[$]});for(let $=0;$<e.length;++$)f.push(...Y(e[$].dims));f.push(...Y(i));let m=Z("output",r,i.length),g=m.indicesGet("indices",t),w=Array.from(Array(o.length).keys()).map($=>`uniforms.sizeInConcatAxis${$}`).join(","),_=$=>`

  ${(()=>{$.registerUniform("outputSize","u32");for(let x=0;x<e.length;x++)$.registerUniform(`sizeInConcatAxis${x}`,"u32");return $.declareVariables(...s,m)})()}

  ${Mu(o.length,w)}

  ${$.mainStart()}
    ${$.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

    var indices = ${m.offsetToIndices("global_idx")};

    let inputIndex = calculateInputIndex(${g});
    if (inputIndex != 0u) {
      let sizeInConcatAxis = array<u32, ${o.length}u>(${w});
      ${g} -= sizeInConcatAxis[inputIndex - 1u];
    }

    ${Nu(s,m)}
  }`;return{name:"Concat",shaderCache:{hint:`${t}`,inputDependencies:d},getRunData:()=>({outputs:[{dims:i,dataType:r}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:f}),getShaderSource:_}},eh=(e,t)=>{let i=e.inputs,r=i[0].dims,a=O.normalizeAxis(t.axis,r.length);Bu(i,a);let o=r.slice();o[a]=i.reduce((l,d)=>l+(d.dims.length>a?d.dims[a]:0),0);let s=i.filter(l=>O.size(l.dims)>0);e.compute(Du(s,a,o,i[0].dataType),{inputs:s})},th=e=>ge({axis:e.axis})}),Ct,Et,zt,Xa,Ot=L(()=>{"use strict";ie(),le(),Ct=(e,t,i="f32")=>{switch(e.activation){case"Relu":return`value = max(value, ${t}(0.0));`;case"Sigmoid":return`value = (${t}(1.0) / (${t}(1.0) + exp(-value)));`;case"Clip":return`value = clamp(value, ${t}(${i}(uniforms.clip_min)), ${t}(${i}(uniforms.clip_max)));`;case"HardSigmoid":return`value = max(${t}(0.0), min(${t}(1.0), ${i}(uniforms.alpha) * value + ${i}(uniforms.beta)));`;case"LeakyRelu":return`value = select(${i}(uniforms.alpha) * value, value, value >= ${t}(0.0));`;case"Tanh":return`let e2x = exp(-2.0 * abs(value));
              value = sign(value) * (1.0 - e2x) / (1.0 + e2x);
        `;case"":return"";default:throw new Error(`Unsupported activation ${e.activation}`)}},Et=(e,t)=>{e.activation==="Clip"?t.push({type:1,data:e.clipMax},{type:1,data:e.clipMin}):e.activation==="HardSigmoid"?t.push({type:1,data:e.alpha},{type:1,data:e.beta}):e.activation==="LeakyRelu"&&t.push({type:1,data:e.alpha})},zt=(e,t)=>{e.activation==="Clip"?t.push({name:"clip_max",type:"f32"},{name:"clip_min",type:"f32"}):e.activation==="HardSigmoid"?t.push({name:"alpha",type:"f32"},{name:"beta",type:"f32"}):e.activation==="LeakyRelu"&&t.push({name:"alpha",type:"f32"})},Xa=e=>{let t=e?.activation||"";if(t==="HardSigmoid"){let[i,r]=e?.activation_params||[.2,.5];return{activation:t,alpha:i,beta:r}}else if(t==="Clip"){let[i,r]=e?.activation_params||[Ap,Op];return{activation:t,clipMax:r,clipMin:i}}else if(t==="LeakyRelu"){let[i]=e?.activation_params||[.01];return{activation:t,alpha:i}}return{activation:t}}}),Ie,rh,Ya=L(()=>{"use strict";Ie=(e,t)=>{switch(e){case 1:return t;case 2:return`vec2<${t}>`;case 3:return`vec3<${t}>`;case 4:return`vec4<${t}>`;default:throw new Error(`${e}-component is not supported.`)}},rh=e=>`
      ${e?"value = value + getBiasByOutputCoords(coords);":""}
      `}),ih,Uy=L(()=>{"use strict";ih=e=>`
fn getIndexFromCoords4D(coords : vec4<i32>, shape : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
      shape.y * shape.z * shape.w, shape.z * shape.w, shape.w, 1));
}
fn getOutputIndexFromCoords(coords : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
    i32(${e}.x), i32(${e}.y), i32(${e}.z), 1));
}
`}),lr,Ja,en=L(()=>{"use strict";ie(),le(),de(),Ot(),lr=(e,t,i,r,a)=>{let o=r-i;return`
      ${Array.from({length:i}).map((s,l)=>`
      if (${X(t.shape,l,t.rank)} != 1) {
        ${t.indicesSet(e,l,X(a,l+o,r))}
      } else {
        ${t.indicesSet(e,l,0)}
      }`).join("")}
`},Ja=(e,t,i,r,a=!1,o)=>{let s=e[0].dims,l=e[1].dims,d=s[s.length-2],p=l[l.length-1],f=s[s.length-1],m=be(p),g=be(f),w=be(d),_=O.size(i)/m/w,$=e.length>2,x=r?r.slice(0,-2):i.slice(0,-2),v=[O.size(x),d,p],b=[{type:12,data:_},{type:12,data:d},{type:12,data:p},{type:12,data:f}];Et(t,b),b.push(...Y(x,s,l)),$&&b.push(...Y(e[2].dims)),b.push(...Y(v));let k=T=>{let C=ja("batch_dims",e[0].dataType,x.length),E=M("a",e[0].dataType,s.length,g),z=M("b",e[1].dataType,l.length,m),N=Z("output",e[0].dataType,v.length,m),W=Te(N.type.tensor),H=Ct(t,N.type.value,W),V=[E,z],G="";if($){let te=a?m:1;V.push(M("bias",e[2].dataType,e[2].dims.length,te)),G=`${a?`value += bias[col / ${te}];`:`value += ${N.type.value}(bias[row + i]);`}`}let D=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"}];zt(t,D);let re=()=>{let te=`var a_data: ${E.type.value};`;for(let j=0;j<g;j++)te+=`
              let b_data${j} = b[(b_offset + (k + ${j}) * uniforms.N + col) / ${m}];`;for(let j=0;j<w;j++){te+=`a_data = a[(a_offset + (row + ${j}) * uniforms.K + k) / ${g}];`;for(let se=0;se<g;se++)te+=`
            values[${j}] = fma(${z.type.value}(a_data${g===1?"":`[${se}]`}), b_data${se}, values[${j}]);
`}return te};return`
  ${T.registerUniforms(D).registerInternalVariables(C).declareVariables(...V,N)}
  ${T.mainStart()}
    ${T.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let col = (global_idx % (uniforms.N / ${m})) * ${m};
    var index1 = global_idx / (uniforms.N / ${m});
    let stride1 = uniforms.M / ${w};
    let row = (index1 % stride1) * ${w};
    let batch = index1 / stride1;

    ${i.length===2?"":`let batch_indices = ${C.offsetToIndices("batch")};`}

    var a_indices: ${E.type.indices};
    ${lr("a_indices",E,E.rank-2,C.rank,"batch_indices")}
    ${E.indicesSet("a_indices",E.rank-2,0)}
    ${E.indicesSet("a_indices",E.rank-1,0)}
    let a_offset = ${E.indicesToOffset("a_indices")};

    var b_indices: ${z.type.indices};
    ${lr("b_indices",z,z.rank-2,C.rank,"batch_indices")}
    ${z.indicesSet("b_indices",z.rank-2,0)}
    ${z.indicesSet("b_indices",z.rank-1,0)}
    let b_offset = ${z.indicesToOffset("b_indices")};
    var values: array<${N.type.value}, ${w}>;
    for (var k: u32 = 0u; k < uniforms.K; k = k + ${g}) {
      ${re()}
    }
    for (var i = 0u; i < ${w}u; i++) {
      var value = values[i];
      ${G}
      ${H}
      let cur_indices = ${N.type.indices}(batch, row + i, col);
      let offset = ${N.indicesToOffset("cur_indices")};
      ${N.setByOffset(`offset / ${m}`,"value")};
    }
  }
  `};return{name:"MatMulNaive",shaderCache:{hint:`${t.activation};${m};${g};${w};${a}`,inputDependencies:$?["rank","rank","rank"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:o?o(i):i,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(_/64)},programUniforms:b}),getShaderSource:k}}}),Pu,Uu,Ta,Li,Wu,Ia,qu,Hr,tn=L(()=>{"use strict";ie(),le(),de(),Ot(),en(),Ya(),Pu=(e,t)=>e?`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          kStart + inputRow,
          globalRowStart / innerElementSize + inputCol${t?", batchIndices":""});
        `:`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          globalRow + innerRow,
          kStart / innerElementSize + inputCol${t?", batchIndices":""});
        `,Uu=(e,t)=>e?`
        let ACached0 = mm_Asub[k * innerElementSize][localRow];
        let ACached1 = mm_Asub[k * innerElementSize + 1][localRow];
        let ACached2 = mm_Asub[k * innerElementSize + 2][localRow];
        ${t===3?"":"let ACached3 = mm_Asub[k * innerElementSize + 3][localRow];"}
        for (var i = 0; i < rowPerThread; i = i + 1) {
          acc[i] = BCached0 * ACached0[i] + acc[i];
          acc[i] = BCached1 * ACached1[i] + acc[i];
          acc[i] = BCached2 * ACached2[i] + acc[i];
          ${t===3?"":"acc[i] = BCached3 * ACached3[i] + acc[i];"}
        }`:`
        for (var i = 0; i < rowPerThread; i = i + 1) {
          let ACached = mm_Asub[tileRow + i][k];
          acc[i] = BCached0 * ACached.x + acc[i];
          acc[i] = BCached1 * ACached.y + acc[i];
          acc[i] = BCached2 * ACached.z + acc[i];
          ${t===3?"":"acc[i] = BCached3 * ACached.w + acc[i];"}
        }`,Ta=(e,t,i="f32",r,a=!1,o=32,s=!1,l=32)=>{let d=t[1]*e[1],p=t[0]*e[0],f=a?d:o,m=a?o:d,g=f/t[0],w=o/t[1];if(!((a&&g===4&&e[1]===4||!a&&(g===3||g===4))&&f%t[0]===0&&o%t[1]===0&&e[0]===4))throw new Error(`If transposeA ${a} is true, innerElementSize ${g} and workPerThread[1] ${e[1]} must be 4.
      Otherwise, innerElementSize ${g} must be 3 or 4.
  tileAWidth ${f} must be divisible by workgroupSize[0]${t[0]}. tileInner ${o} must be divisible by workgroupSize[1] ${t[1]}. colPerThread ${e[0]} must be 4.`);return`
var<workgroup> mm_Asub: array<array<vec${g}<${i}>, ${f/g}>, ${m}>;
var<workgroup> mm_Bsub: array<array<vec4<${i}>, ${p/e[0]}>, ${o}>;

const rowPerThread = ${e[1]};
const colPerThread = ${e[0]};
const innerElementSize = ${g};
const tileInner = ${o};

@compute @workgroup_size(${t[0]}, ${t[1]}, ${t[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
  let localRow = i32(localId.y);
  let tileRow = localRow * rowPerThread;
  let tileCol = i32(localId.x);

  let globalRow =i32(globalId.y) * rowPerThread;
  let globalCol = i32(globalId.x);
  let batch = ${s?"0":"i32(globalId.z)"};
  ${r?`let batchIndices = ${r.offsetToIndices("u32(batch)")};`:""}
  let globalRowStart = i32(workgroupId.y) * ${d};

  let num_tiles = ${s?`${Math.ceil(l/o)}`:"(uniforms.dim_inner - 1) / tileInner + 1"};
  var kStart = ${s?`i32(globalId.z) * ${l}`:"0"};

  var acc: array<vec4<${i}>, rowPerThread>;

  // Loop over shared dimension.
  let tileRowB = localRow * ${w};
  for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let inputRow = tileRow + innerRow;
          let inputCol = tileCol;
          ${Pu(a,r)}
      }

      // Load one tile of B into local memory.
      for (var innerRow = 0; innerRow < ${w}; innerRow = innerRow + 1) {
          let inputRow = tileRowB + innerRow;
          let inputCol = tileCol;
          mm_Bsub[inputRow][inputCol] = mm_readB(batch, kStart + inputRow, globalCol${r?", batchIndices":""});
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      for (var k = 0; k < tileInner / innerElementSize; k = k + 1) {
          let BCached0 = mm_Bsub[k * innerElementSize][tileCol];
          let BCached1 = mm_Bsub[k * innerElementSize + 1][tileCol];
          let BCached2 = mm_Bsub[k * innerElementSize + 2][tileCol];
          ${g===3?"":"let BCached3 = mm_Bsub[k * innerElementSize + 3][tileCol];"}

          ${Uu(a,g)}
      }

      workgroupBarrier();
  }

  for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      mm_write(batch, globalRow + innerRow, globalCol, acc[innerRow]);
  }
}`},Li=(e,t)=>e?`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              kStart + inputRow,
              globalRowStart + inputCol${t?", batchIndices":""});
            `:`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              globalRowStart + inputRow,
              kStart + inputCol${t?", batchIndices":""});
            `,Wu=e=>e?"let ACached = mm_Asub[k][tileRow + innerRow];":"let ACached = mm_Asub[tileRow + innerRow][k];",Ia=(e,t,i="f32",r,a=!1,o=32,s=!1,l=32,d=!1)=>{let p=e[1]*t[1],f=e[0]*t[0],m=a?p:o,g=a?o:p;if(!(g%t[1]===0&&m%t[0]===0&&o%t[1]===0))throw new Error(`tileAHight ${g} must be divisible by workgroupSize[1]${t[1]}, tileAWidth ${m} must be divisible by workgroupSize[0]${t[0]}, tileInner ${o} must be divisible by workgroupSize[1]${t[1]}`);let w=g/t[1],_=m/t[0],$=o/t[1],x=d?`
    let localRow = i32(localId.y);
    let localCol = i32(localId.x);
    let globalRowStart = i32(workgroupId.y) * ${p};
    let globalColStart = i32(workgroupId.x) * ${f};

    // Loop over shared dimension.
    for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var inputRow = localRow; inputRow < ${g}; inputRow = inputRow + ${t[1]}) {
        for (var inputCol = localCol; inputCol < ${m}; inputCol = inputCol + ${t[0]}) {
          ${Li(a,r)}
        }
      }
      // Load one tile of B into local memory.
      for (var inputRow = localRow; inputRow < ${o}; inputRow = inputRow + ${t[1]}) {
            for (var inputCol = localCol; inputCol < ${f}; inputCol = inputCol + ${t[0]}) {
          mm_Bsub[inputRow][inputCol] = mm_readB(batch,
            kStart + inputRow,
            globalColStart + inputCol${r?", batchIndices":""});
        }
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      var BCached : array<${i}, colPerThread>;
      for (var k = 0; k < tileInner; k = k + 1) {
        for (var inner = 0; inner < colPerThread; inner = inner + 1) {
          BCached[inner] = mm_Bsub[k][localCol + inner * ${t[0]}];
        }
        for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let ACached = ${a?`mm_Asub[k][localRow + innerRow * ${t[1]}];`:`mm_Asub[localRow + innerRow * ${t[1]}][k];`}
          for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
            acc[innerRow][innerCol] = acc[innerRow][innerCol] +
                ACached * BCached[innerCol];
          }
        }
      }
      workgroupBarrier();
    }
    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      let gRow = globalRowStart + localRow + innerRow * ${t[1]};
      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
        let gCol = globalColStart + localCol + innerCol * ${t[0]};
        mm_write(batch, gRow, gCol, acc[innerRow][innerCol]);
      }
    }
    `:`
let tileRow = i32(localId.y) * rowPerThread;
let tileCol = i32(localId.x) * colPerThread;

let globalRow = i32(globalId.y) * rowPerThread;
let globalCol = i32(globalId.x) * colPerThread;
let globalRowStart = i32(workgroupId.y) * ${p};

let tileRowA = i32(localId.y) * ${w};
let tileColA = i32(localId.x) * ${_};
let tileRowB = i32(localId.y) * ${$};
// Loop over shared dimension.
for (var t = 0; t < num_tiles; t = t + 1) {
  // Load one tile of A into local memory.
  for (var innerRow = 0; innerRow < ${w}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < ${_}; innerCol = innerCol + 1) {
      let inputRow = tileRowA + innerRow;
      let inputCol = tileColA + innerCol;
      ${Li(a,r)}
    }
  }

  // Load one tile of B into local memory.
  for (var innerRow = 0; innerRow < ${$}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
      let inputRow = tileRowB + innerRow;
      let inputCol = tileCol + innerCol;
      mm_Bsub[inputRow][inputCol] = mm_readB(batch,
        kStart + inputRow,
        globalCol + innerCol${r?", batchIndices":""});
    }
  }
  kStart = kStart + tileInner;
  workgroupBarrier();

  // Compute acc values for a single thread.
  var BCached : array<${i}, colPerThread>;
  for (var k = 0; k < tileInner; k = k + 1) {
    for (var inner = 0; inner < colPerThread; inner = inner + 1) {
      BCached[inner] = mm_Bsub[k][tileCol + inner];
    }

    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      ${Wu(a)}
      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
        acc[innerRow][innerCol] = acc[innerRow][innerCol] + ACached * BCached[innerCol];
      }
    }
  }

  workgroupBarrier();
}

for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
  for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
    mm_write(batch, globalRow + innerRow, globalCol + innerCol,
        acc[innerRow][innerCol]);
  }
}
`;return`
  var<workgroup> mm_Asub : array<array<${i}, ${m}>, ${g}>;
  var<workgroup> mm_Bsub : array<array<${i}, ${f}>, ${o}>;
  const rowPerThread = ${e[1]};
  const colPerThread = ${e[0]};
  const tileInner = ${o};

@compute @workgroup_size(${t[0]}, ${t[1]}, ${t[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
    let batch = ${s?"0":"i32(globalId.z)"};
    ${r?`let batchIndices = ${r.offsetToIndices("u32(batch)")};`:""}
    let num_tiles = ${s?`${Math.ceil(l/o)}`:"(uniforms.dim_inner - 1) / tileInner + 1"};
    var kStart = ${s?`i32(globalId.z) * ${l}`:"0"};

    var acc : array<array<${i}, colPerThread>, rowPerThread>;
    ${x}
  }
`},qu=(e,t,i,r,a=!1)=>{let[o,s,l,d]=r,p=Te(r[0].type.tensor);return`
    fn mm_readA(batch: i32, row: i32, colIn: i32, batchIndices: ${o.type.indices}) -> ${Ie(e,p)} {
      var value = ${Ie(e,p)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_a_outer && col < uniforms.dim_inner)
      {
        var aIndices: ${s.type.indices};
        ${lr("aIndices",s,s.rank-2,o.rank,"batchIndices")}
        ${s.indicesSet("aIndices",s.rank-2,"u32(row)")}
        ${s.indicesSet("aIndices",s.rank-1,"u32(colIn)")}
        value = ${s.getByIndices("aIndices")};
      }
      return value;
    }

    fn mm_readB(batch: i32, row: i32, colIn: i32, batchIndices: ${o.type.indices}) -> ${Ie(e,p)} {
      var value = ${Ie(e,p)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_inner && col < uniforms.dim_b_outer)
      {
        var bIndices: ${l.type.indices};
        ${lr("bIndices",l,l.rank-2,o.rank,"batchIndices")}
        ${l.indicesSet("bIndices",l.rank-2,"u32(row)")}
        ${l.indicesSet("bIndices",l.rank-1,"u32(colIn)")}
        value = ${l.getByIndices("bIndices")};
      }
      return value;
    }

    fn mm_write(batch: i32, row: i32, colIn: i32, valueIn: ${Ie(e,p)}) {
      let col = colIn * ${e};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer) {
        var value = valueIn;
        let coords = vec3<i32>(batch, row, colIn);
        ${t?`value = value + ${a?"bias[colIn]":`${Ie(e,p)}(bias[row])`};`:""}
        ${i}
        ${d.setByIndices("vec3<u32>(coords)","value")}
      }
    }
    `},Hr=(e,t,i,r,a=!1,o)=>{let s=e[0].dims,l=e[1].dims,d=s.slice(0,-2),p=l.slice(0,-2),f=r?r.slice(0,-2):i.slice(0,-2),m=O.size(f),g=s[s.length-2],w=s[s.length-1],_=l[l.length-1],$=w%4===0&&_%4===0,x=g<=8?[4,1,1]:[4,4,1],v=[8,8,1],b=[Math.ceil(_/v[0]/x[0]),Math.ceil(g/v[1]/x[1]),Math.ceil(m/v[2]/x[2])],k=$?4:1,T=[...d,g,w/k],C=T.length,E=[...p,w,_/k],z=E.length,N=[m,g,_/k],W=[{type:6,data:g},{type:6,data:_},{type:6,data:w}];Et(t,W),W.push(...Y(f,T,E));let H=["rank","rank"],V=e.length>2;V&&(W.push(...Y(e[2].dims)),H.push("rank")),W.push(...Y(N));let G=D=>{let re=f.length,te=ja("batchDims",e[0].dataType,re,1),j=Te(e[0].dataType),se=M("a",e[0].dataType,C,k),pe=M("b",e[1].dataType,z,k),F=Z("result",e[0].dataType,N.length,k),ce=[se,pe];if(V){let ve=a?k:1;ce.push(M("bias",e[2].dataType,e[2].dims.length,ve))}let U=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"}];zt(t,U);let K=Te(F.type.tensor),B=Ct(t,F.type.value,K),ee=qu(k,V,B,[te,se,pe,F],a);return`
  ${D.registerUniforms(U).registerInternalVariables(te).declareVariables(...ce,F)}
  ${ee}
  ${$?Ta(x,v,j,te):Ia(x,v,j,te)}
                   `};return{name:"MatMul",shaderCache:{hint:`${x};${t.activation};${$};${a}`,inputDependencies:H},getRunData:()=>({outputs:[{dims:o?o(i):i,dataType:e[0].dataType}],dispatchGroup:{x:b[0],y:b[1],z:b[2]},programUniforms:W}),getShaderSource:G}}}),Lu,ah,Wy=L(()=>{"use strict";ie(),st(),de(),Ot(),Ya(),Uy(),tn(),Lu=(e,t,i,r,a=!1,o,s=4,l=4,d=4,p="f32")=>{let f=W=>{switch(W){case 1:return"resData = x[xIndex];";case 3:return`resData = vec3<${p}>(x[xIndex], x[xIndex + 1], x[xIndex + 2]);`;case 4:return"resData = x[xIndex / 4];";default:throw new Error(`innerElementSize ${W} is not supported.`)}},m=W=>{switch(W){case 1:return"return w[row * i32(uniforms.w_shape[3]) + colIn];";case 4:return"return w[row * i32(uniforms.w_shape[3]) / 4 + colIn];";default:throw new Error(`innerElementSize ${W} is not supported.`)}},g=e?`
    let coord = vec4<i32>(batch, xRow, xCol, xCh);
    `:`
    let coord = vec4<i32>(batch, xCh, xRow, xCol);
    `,w=e?`
    let coords = vec4<i32>(
      batch,
      row / outWidth,
      row % outWidth,
      col);
    `:`
    let coords = vec4<i32>(
      batch,
      row,
      col / outWidth,
      col % outWidth);
    `,_=e?"i32(uniforms.x_shape[1])":"i32(uniforms.x_shape[2])",$=e?"i32(uniforms.x_shape[2])":"i32(uniforms.x_shape[3])",x=e?"row":"col",v=e?"col":"row",b=`
    let inChannels = i32(uniforms.w_shape[2]);
    let outWidth = ${e?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
    let outRow = ${x} / outWidth;
    let outCol = ${x} % outWidth;

    let WRow = ${v} / (i32(uniforms.w_shape[1]) * inChannels);
    let WCol = ${v} / inChannels % i32(uniforms.w_shape[1]);
    let xRow = outRow * uniforms.stride[0] + uniforms.dilation[0] * WRow - uniforms.pad[0];
    let xCol = outCol * uniforms.stride[1] + uniforms.dilation[1] * WCol - uniforms.pad[1];
    let xCh = ${v} % inChannels;
    var resData = ${Ie(s,p)}(0.0);
    // The bounds checking is always needed since we use it to pad zero for
    // the 'same' padding type.
    if (xRow >= 0 && xRow < ${_} && xCol >= 0 && xCol < ${$}) {
      ${g}
      let xIndex = getIndexFromCoords4D(coord, vec4<i32>(uniforms.x_shape));
      ${f(s)}
    }
    return resData;`,k=e?t&&r?`
    let col = colIn * ${s};
    ${b}`:`
    let col = colIn * ${s};
    if (row < uniforms.dim_a_outer && col < uniforms.dim_inner) {
      ${b}
    }
    return ${Ie(s,p)}(0.0);`:r&&i?`
    let col = colIn * ${s};
    ${b}`:`
    let col = colIn * ${s};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${b}
    }
    return ${Ie(s,p)}(0.0);`,T=e?r&&i?m(l):`
    let col = colIn * ${l};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${m(l)}
    }
    return ${Ie(l,p)}(0.0);`:`
    let col = colIn * ${l};
    if (row < uniforms.dim_inner && col < uniforms.dim_a_outer) {
      ${m(l)}
    }
    return ${Ie(l,p)}(0.0);`,C=Ie(d,p),E=Ie(e?s:l,p),z=Ie(e?l:s,p),N=Ct(o,C,p);return`
    fn mm_readA(batch: i32, row : i32, colIn : i32) -> ${E} {
      ${e?k:T}
    }

    fn mm_readB(batch: i32, row : i32, colIn : i32) -> ${z} {
      ${e?T:k}
    }

    fn mm_write(batch: i32, row : i32, colIn : i32, valueIn : ${C}) {
      let col = colIn * ${d};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer)
      {
      var value = valueIn;
      let outWidth = ${e?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
      ${w}
      ${rh(a)}
      ${N}
      setOutputAtCoords(coords[0], coords[1], coords[2], coords[3], value);
      }
    }`},ah=(e,t,i,r,a,o,s,l,d)=>{let p=t.format==="NHWC",f=p?e[0].dims[3]:e[0].dims[1],m=i[0],g=p?i[2]:i[3],w=p?i[1]:i[2],_=p?i[3]:i[1],$=p&&(f%4===0||f%3===0)&&_%4===0,x=p?_:g*w,v=p?g*w:_,b=[8,8,1],k=r<=8?[4,1,1]:[4,4,1],T=[Math.ceil(x/b[0]/k[0]),Math.ceil(v/b[1]/k[1]),Math.ceil(m/b[2]/k[2])];he("verbose",()=>`[conv2d_mm_webgpu] dispatch = ${T}`);let C=$?p&&f%4!==0?3:4:1,E=b[1]*k[1],z=b[0]*k[0],N=Math.max(b[0]*C,b[1]),W=r%E===0,H=a%z===0,V=o%N===0,G=$?[C,4,4]:[1,1,1],D=[{type:6,data:r},{type:6,data:a},{type:6,data:o},{type:6,data:[t.pads[0],t.pads[1]]},{type:6,data:t.strides},{type:6,data:t.dilations}];Et(t,D),D.push(...Y(e[0].dims,e[1].dims));let re=["rank","rank"];s&&(D.push(...Y(e[2].dims)),re.push("rank")),D.push(...Y(i));let te=j=>{let se=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"},{name:"pad",type:"i32",length:2},{name:"stride",type:"i32",length:2},{name:"dilation",type:"i32",length:2}];zt(t,se);let pe=$?4:1,F=Te(e[0].dataType),ce=`
      fn setOutputAtIndex(flatIndex : i32, value : ${$?`vec4<${F}>`:F}) {
        result[flatIndex] = ${$?`vec4<${F}>`:F}(value);
      }
      fn setOutputAtCoords(d0 : i32, d1 : i32, d2 : i32, d3 : i32, value : ${$?`vec4<${F}>`:F}) {
        let flatIndex = getOutputIndexFromCoords(vec4<i32>(d0, d1, d2, d3));
        setOutputAtIndex(flatIndex ${$?"/ 4":""}, value);
      }`,U=M("x",e[0].dataType,e[0].dims.length,C===3?1:C),K=M("w",e[1].dataType,e[1].dims.length,pe),B=[U,K],ee=Z("result",e[0].dataType,i.length,pe);if(s){let ve=M("bias",e[2].dataType,e[2].dims.length,pe);B.push(ve),ce+=`
        fn getBiasByOutputCoords(coords : vec4<i32>) -> ${$?`vec4<${F}>`:F} {
          return bias[coords.${p?"w":"y"}${$?"/ 4":""}];
        }`}return`
        ${ih("uniforms.result_strides")}
        //struct Uniforms { xShape : vec4<i32>, wShape : vec4<i32>, outShape : vec4<i32>,
        //  outShapeStrides: vec3<i32>, filterDims : vec2<i32>, pad : vec2<i32>, stride : vec2<i32>,
        //  dilation : vec2<i32>, dimAOuter : i32, dimBOuter : i32, dimInner : i32 };
        ${j.registerUniforms(se).declareVariables(...B,ee)}
        ${ce}
        ${Lu(p,W,H,V,s,t,G[0],G[1],G[2],F)}
        ${$?Ta(k,b,F,void 0,!p,N):Ia(k,b,F,void 0,!p,N,!1,void 0,l)}`};return{name:"Conv2DMatMul",shaderCache:{hint:`${t.cacheKey};${C};${$};${W};${H};${V};${E};${z};${N}`,inputDependencies:re},getRunData:()=>({outputs:[{dims:d?d(i):i,dataType:e[0].dataType}],dispatchGroup:{x:T[0],y:T[1],z:T[2]},programUniforms:D}),getShaderSource:te}}}),Vu,Vi,Jt,Fu,Fi,Gu,nh,sh,qy=L(()=>{"use strict";ie(),st(),le(),de(),Ot(),Ya(),Vu=e=>{let t=1;for(let i=0;i<e.length;i++)t*=e[i];return t},Vi=e=>typeof e=="number"?[e,e,e]:e,Jt=(e,t)=>t<=1?e:e+(e-1)*(t-1),Fu=(e,t,i,r=1)=>{let a=Jt(t,r);return Math.floor((e[0]*(i-1)-i+a)/2)},Fi=(e,t,i,r,a)=>{a==null&&(a=Fu(e,t[0],r[0]));let o=[0,0,0,i];for(let s=0;s<3;s++)e[s]+2*a>=t[s]&&(o[s]=Math.trunc((e[s]-t[s]+2*a)/r[s]+1));return o},Gu=(e,t,i,r,a,o,s,l,d,p)=>{let f,m,g,w;if(e==="VALID"&&(e=0),typeof e=="number"){f={top:e,bottom:e,left:e,right:e,front:e,back:e};let _=Fi([t,i,r,1],[l,d,p],1,[a,o,s],e);m=_[0],g=_[1],w=_[2]}else if(Array.isArray(e)){if(!e.every(($,x,v)=>$===v[0]))throw Error(`Unsupported padding parameter: ${e}`);f={top:e[0],bottom:e[1],left:e[2],right:e[3],front:e[4],back:e[5]};let _=Fi([t,i,r,1],[l,d,p],1,[a,o,s],e[0]);m=_[0],g=_[1],w=_[2]}else if(e==="SAME_UPPER"){m=Math.ceil(t/a),g=Math.ceil(i/o),w=Math.ceil(r/s);let _=(m-1)*a+l-t,$=(g-1)*o+d-i,x=(w-1)*s+p-r,v=Math.floor(_/2),b=_-v,k=Math.floor($/2),T=$-k,C=Math.floor(x/2),E=x-C;f={top:k,bottom:T,left:C,right:E,front:v,back:b}}else throw Error(`Unknown padding parameter: ${e}`);return{padInfo:f,outDepth:m,outHeight:g,outWidth:w}},nh=(e,t,i,r,a,o=!1,s="channelsLast")=>{let l,d,p,f,m;if(s==="channelsLast")[l,d,p,f,m]=e;else if(s==="channelsFirst")[l,m,d,p,f]=e;else throw new Error(`Unknown dataFormat ${s}`);let[g,,w,_,$]=t,[x,v,b]=Vi(i),[k,T,C]=Vi(r),E=Jt(w,k),z=Jt(_,T),N=Jt($,C),{padInfo:W,outDepth:H,outHeight:V,outWidth:G}=Gu(a,d,p,f,x,v,b,E,z,N),D=o?g*m:g,re=[0,0,0,0,0];return s==="channelsFirst"?re=[l,D,H,V,G]:s==="channelsLast"&&(re=[l,H,V,G,D]),{batchSize:l,dataFormat:s,inDepth:d,inHeight:p,inWidth:f,inChannels:m,outDepth:H,outHeight:V,outWidth:G,outChannels:D,padInfo:W,strideDepth:x,strideHeight:v,strideWidth:b,filterDepth:w,filterHeight:_,filterWidth:$,effectiveFilterDepth:E,effectiveFilterHeight:z,effectiveFilterWidth:N,dilationDepth:k,dilationHeight:T,dilationWidth:C,inShape:e,outShape:re,filterShape:t}},sh=(e,t,i,r,a,o)=>{let s=o==="channelsLast",l=s?e[0].dims[3]:e[0].dims[1],d=!1,p=[64,1,1],f={x:i.map((b,k)=>k)},m=[Math.ceil(Vu(f.x.map(b=>i[b]))/p[0]),1,1];he("verbose",()=>`[conv3d_naive_webgpu] dispatch = ${m}`);let g=d?s&&l%4!==0?3:4:1,w=O.size(i),_=[{type:12,data:w},{type:12,data:r},{type:12,data:a},{type:12,data:t.strides},{type:12,data:t.dilations}];Et(t,_),_.push(...Y(e[0].dims,e[1].dims));let $=["rank","rank"],x=e.length===3;x&&(_.push(...Y(e[2].dims)),$.push("rank")),_.push(...Y(i));let v=b=>{let k=[{name:"output_size",type:"u32"},{name:"filter_dims",type:"u32",length:r.length},{name:"pads",type:"u32",length:a.length},{name:"strides",type:"u32",length:t.strides.length},{name:"dilations",type:"u32",length:t.dilations.length}];zt(t,k);let T=d?4:1,C=Te(e[0].dataType),E=M("x",e[0].dataType,e[0].dims.length,g===3?1:g),z=M("W",e[1].dataType,e[1].dims.length,T),N=[E,z],W=Z("result",e[0].dataType,i.length,T),H="";if(x){let D=M("bias",e[2].dataType,e[2].dims.length,T);N.push(D),H+=`
        fn getBiasByOutputCoords(coords : array<u32, 5>) -> ${d?`vec4<${C}>`:C} {
          return bias[${s?X("coords",4,5):X("coords",1,5)}${d?"/ 4":""}];
        }`}let V=Ie(g,C),G=Ct(t,V,C);return`
            ${H}
            fn getX(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> f32 {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${E.getByIndices("aIndices")};
            }
            fn getW(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> f32 {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${z.getByIndices("aIndices")};
            }
          ${b.registerUniforms(k).declareVariables(...N,W)}
          ${b.mainStart()}
          ${b.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
              let coords = ${W.offsetToIndices("global_idx")};
              let batch = ${X("coords",0,E.rank)};
              let d2 = ${s?X("coords",E.rank-1,E.rank):X("coords",1,E.rank)};
              let xFRCCorner = vec3<u32>(${s?X("coords",1,E.rank):X("coords",2,E.rank)},
              ${s?X("coords",2,E.rank):X("coords",3,E.rank)},
              ${s?X("coords",3,E.rank):X("coords",4,E.rank)}) * uniforms.strides - uniforms.pads;
              let xFCorner = xFRCCorner.x;
              let xRCorner = xFRCCorner.y;
              let xCCorner = xFRCCorner.z;
              let xShapeY = ${s?X("uniforms.x_shape",1,E.rank):X("uniforms.x_shape",2,E.rank)};
              let xShapeZ = ${s?X("uniforms.x_shape",2,E.rank):X("uniforms.x_shape",3,E.rank)};
              let xShapeW = ${s?X("uniforms.x_shape",3,E.rank):X("uniforms.x_shape",4,E.rank)};
              let xShapeU = ${s?X("uniforms.x_shape",4,E.rank):X("uniforms.x_shape",1,E.rank)};
              let inputDepthNearestVec4 = (xShapeU / 4) * 4;
              let inputDepthVec4Remainder = xShapeU % 4;

              var value = 0.0;
              for (var wF = 0u; wF < uniforms.filter_dims[0]; wF++) {
                let xF = xFCorner + wF * uniforms.dilations[0];
                if (xF < 0 || xF >= xShapeY) {
                  continue;
                }

                for (var wR = 0u; wR < uniforms.filter_dims[1]; wR++) {
                  let xR = xRCorner + wR * uniforms.dilations[1];
                  if (xR < 0 || xR >= xShapeZ) {
                    continue;
                  }

                  for (var wC = 0u; wC < uniforms.filter_dims[2]; wC++) {
                    let xC = xCCorner + wC * uniforms.dilations[2];
                    if (xC < 0 || xC >= xShapeW) {
                      continue;
                    }

                    for (var d1 = 0u; d1 < inputDepthNearestVec4; d1 += 4) {
                      ${s?`let xValues = vec4<f32>(
                               getX(batch, xF, xR, xC, d1),
                               getX(batch, xF, xR, xC, d1 + 1),
                               getX(batch, xF, xR, xC, d1 + 2),
                               getX(batch, xF, xR, xC, d1 + 3));
                            `:`let xValues = vec4<f32>(
                               getX(batch, d1, xF, xR, xC),
                               getX(batch, d1 + 1, xF, xR, xC),
                               getX(batch, d1 + 2, xF, xR, xC),
                               getX(batch, d1 + 3, xF, xR, xC));
                            `}
                            let wValues = vec4<f32>(
                              getW(d2, d1, wF, wR, wC),
                              getW(d2, d1 + 1, wF, wR, wC),
                              getW(d2, d1 + 2, wF, wR, wC),
                              getW(d2, d1 + 3, wF, wR, wC));
                      value += dot(xValues, wValues);
                    }
                    if (inputDepthVec4Remainder == 1) {
                        ${s?`value += getX(batch, xF, xR, xC, inputDepthNearestVec4)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`:`value += getX(batch, inputDepthNearestVec4, xF, xR, xC)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`}
                    } else if (inputDepthVec4Remainder == 2) {
                      ${s?`let xValues = vec2<f32>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1));
                      `:`let xValues = vec2<f32>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC));
                    `}
                    let wValues = vec2<f32>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC));
                      value += dot(xValues, wValues);
                    } else if (inputDepthVec4Remainder == 3) {
                      ${s?`let xValues = vec3<f32>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 2));
                      `:`let xValues = vec3<f32>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 2, xF, xR, xC));
                    `}
                    let wValues = vec3<f32>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 2, wF, wR, wC));
                      value += dot(xValues, wValues);
                    }
                  }
                }
              }
              ${x?"value = value + getBiasByOutputCoords(coords)":""};
              ${G}
              result[global_idx] = f32(value);
          }`};return{name:"Conv3DNaive",shaderCache:{hint:`${t.cacheKey};${s};${g};${x}`,inputDependencies:$},getRunData:()=>({outputs:[{dims:i,dataType:e[0].dataType}],dispatchGroup:{x:m[0],y:m[1],z:m[2]},programUniforms:_}),getShaderSource:v}}}),oh,uh,Ly=L(()=>{"use strict";ie(),le(),de(),Ot(),oh=(e,t,i,r)=>{let a=e.length>2,o=a?"value += b[output_channel];":"",s=e[0].dims,l=e[1].dims,d=t.format==="NHWC",p=d?i[3]:i[1],f=p/t.group,m=d&&f>=4?be(p):1,g=O.size(i)/m,w=[{type:12,data:g},{type:12,data:t.dilations},{type:12,data:[t.strides[0],t.strides[1]]},{type:12,data:[t.pads[0],t.pads[1]]},{type:12,data:f}];Et(t,w),w.push(...Y(s,[l[0],l[1],l[2],l[3]/m]));let _=a?["rank","rank","rank"]:["rank","rank"];w.push(...Y([i[0],i[1],i[2],i[3]/m]));let $=x=>{let v=Z("output",e[0].dataType,i.length,m),b=Te(v.type.tensor),k=Ct(t,v.type.value,b),T=M("x",e[0].dataType,s.length),C=M("w",e[1].dataType,l.length,m),E=[T,C];a&&E.push(M("b",e[2].dataType,e[2].dims,m));let z=[{name:"output_size",type:"u32"},{name:"dilations",type:"u32",length:t.dilations.length},{name:"strides",type:"u32",length:2},{name:"pads",type:"u32",length:2},{name:"output_channels_per_group",type:"u32"}];zt(t,z);let N=d?`
      for (var wHeight: u32 = 0u; wHeight < uniforms.w_shape[0]; wHeight++) {
        let xHeight = xRCCorner.x + wHeight * uniforms.dilations[0];

        if (xHeight < 0u || xHeight >= uniforms.x_shape[1]) {
          continue;
        }

        for (var wWidth: u32 = 0u; wWidth < uniforms.w_shape[1]; wWidth++) {
          let xWidth = xRCCorner.y + wWidth * uniforms.dilations[1];
          if (xWidth < 0u || xWidth >= uniforms.x_shape[2]) {
            continue;
          }

          for (var wInChannel: u32 = 0u; wInChannel < uniforms.w_shape[2]; wInChannel++) {
            let input_channel = in_channel_offset + wInChannel;
            let xVal = ${T.get("batch","xHeight","xWidth","input_channel")};
            let wVal = ${C.get("wHeight","wWidth","wInChannel","output_channel")};
            value += xVal * wVal;
          }
        }
      }
      `:`
      for (var wInChannel: u32 = 0u; wInChannel < uniforms.w_shape[1]; wInChannel++) {
        let input_channel = in_channel_offset + wInChannel;
        for (var wHeight: u32 = 0u; wHeight < uniforms.w_shape[2]; wHeight++) {
          let xHeight = xRCCorner.x + wHeight * uniforms.dilations[0];

          if (xHeight < 0u || xHeight >= uniforms.x_shape[2]) {
            continue;
          }

          for (var wWidth: u32 = 0u; wWidth < uniforms.w_shape[3]; wWidth++) {
            let xWidth = xRCCorner.y + wWidth * uniforms.dilations[1];
            if (xWidth < 0u || xWidth >= uniforms.x_shape[3]) {
              continue;
            }

            let xVal = ${T.get("batch","input_channel","xHeight","xWidth")};
            let wVal = ${C.get("output_channel","wInChannel","wHeight","wWidth")};
            value += xVal * wVal;
          }
        }
      }
      `;return`
  ${x.registerUniforms(z).declareVariables(...E,v)}

  ${x.mainStart()}
    ${x.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let outputIndices = ${v.offsetToIndices("global_idx")};
    let batch: u32 = outputIndices[0];
    let output_channel: u32 = outputIndices[${d?3:1}];
    let xRCCorner: vec2<u32> = vec2<u32>(outputIndices[${d?1:2}], outputIndices[${d?2:3}]) * uniforms.strides - uniforms.pads;
    let group_id: u32 = output_channel * ${m} / uniforms.output_channels_per_group;
    var in_channel_offset = group_id * uniforms.w_shape[${d?2:1}];

    var value: ${v.type.value} = ${v.type.value}(0);
    ${N}
    ${o}
    ${k}
    ${v.setByOffset("global_idx","value")}
  }`};return{name:"GroupedConv",shaderCache:{hint:`${t.cacheKey}_${m}`,inputDependencies:_},getRunData:()=>({outputs:[{dims:r?r(i):i,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(g/64)},programUniforms:w}),getShaderSource:$}},uh=(e,t,i,r)=>{let a=e.length>2,o=be(i[3]),s=be(i[2]),l=O.size(i)/o/s,d=[e[0].dims[0],e[0].dims[1],e[0].dims[2],e[0].dims[3]/o],p=[e[1].dims[0],e[1].dims[1],e[1].dims[2],e[1].dims[3]/o],f=[i[0],i[1],i[2],i[3]/o],m=[{type:12,data:l},{type:6,data:[t.strides[0],t.strides[1]]},{type:6,data:[t.pads[0],t.pads[1]]}];Et(t,m),m.push(...Y(d,p,f));let g=(s-1)*t.strides[1]+p[1],w=_=>{let $=Z("output",e[0].dataType,f.length,o),x=Te($.type.tensor),v=Ct(t,$.type.value,x),b=M("x",e[0].dataType,d.length,o),k=M("w",e[1].dataType,p.length,o),T=[b,k];a&&T.push(M("b",e[2].dataType,e[2].dims,o));let C=a?"value += b[output_channel];":"",E=[{name:"output_size",type:"u32"},{name:"strides",type:"i32",length:2},{name:"pads",type:"i32",length:2}];return zt(t,E),`
  ${_.registerUniforms(E).declareVariables(...T,$)}
  ${_.mainStart()}
    ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let width0 = uniforms.output_shape[3];
    let output_channel = global_idx % width0;
    var index1 = global_idx / width0;
    let width1 = uniforms.output_shape[2] / ${s}u;
    let col = (index1 % width1) * ${s}u;
    index1 = index1 / width1;
    let row = index1 % uniforms.output_shape[1];
    let batch = index1 / uniforms.output_shape[1];

    let x_corner = vec2<i32>(i32(row), i32(col)) * uniforms.strides - uniforms.pads;

    var x_vals: array<${b.type.value}, ${g}>;
    var values: array<${$.type.value}, ${s}>;
    let input_channel = output_channel;
    // Use constant instead of uniform can give better performance for w's height/width.
    for (var w_height: u32 = 0u; w_height < ${p[0]}; w_height++) {
      let x_height = x_corner.x + i32(w_height);
      if (x_height >= 0 && u32(x_height) < uniforms.x_shape[1]) {
        for (var i = 0; i < ${g}; i++) {
          let x_width = x_corner.y + i;
          if (x_width >= 0 && u32(x_width) < uniforms.x_shape[2]) {
            x_vals[i] = ${b.get("batch","u32(x_height)","u32(x_width)","input_channel")};
          } else {
            x_vals[i] = ${b.type.value}(0);
          }
        }
        for (var w_width: u32 = 0u; w_width < ${p[1]}; w_width++) {
          let w_val = ${k.get("w_height","w_width","0","output_channel")};
          for (var i = 0u; i < ${s}u; i++) {
            values[i] = fma(x_vals[i * u32(uniforms.strides[1]) + w_width], w_val, values[i]);
          }
        }
      }
    }

    for (var i = 0u; i < ${s}u; i++) {
      var value = values[i];
      ${C}
      ${v}
      ${$.set("batch","row","col + i","output_channel","value")};
    }
  }`};return{name:"GroupedConv-Vectorize",shaderCache:{hint:`${t.cacheKey};${o};${s};${g};${p[0]};${p[1]}`,inputDependencies:a?["rank","rank","type"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:r?r(i):i,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:m}),getShaderSource:w}}}),Hu,Or,ju,Rr,Ca,Gi,Ku,Qu,Ea,Vy=L(()=>{"use strict";le(),Wy(),qy(),tn(),Ly(),Ot(),en(),gt(),Hu=(e,t,i,r,a,o)=>{let s=e[0],l=e.slice(o?1:2,o?3:4),d=l.length,p=t[0],f=t.slice(2).map((g,w)=>g+(g-1)*(i[w]-1)),m=l.map((g,w)=>g+r[w]+r[w+d]).map((g,w)=>Math.floor((g-f[w]+a[w])/a[w]));return m.splice(0,0,s),m.splice(o?3:1,0,p),m},Or=[2,3,1,0],ju=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length>5)throw new Error("greater than 5D is not supported");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");let i=e[0].dims[t.format==="NHWC"?e[0].dims.length-1:1],r=e[1].dims[1]*t.group;if(i!==r)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");if(e.length===3&&(e[2].dims.length!==1||e[1].dims[0]!==e[2].dims[0]))throw new Error("invalid bias");let a=e[0].dims.length-2;if(t.dilations.length!==a)throw new Error(`dilations should be ${a}D`);if(t.strides.length!==a)throw new Error(`strides should be ${a}D`);if(t.pads.length!==a*2)throw new Error(`pads should be ${a*2}D`);if(t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape")},Rr=(e,t)=>{let i=e.kernelShape.slice();i.length<t[1].dims.length-2&&i.push(...Array(t[1].dims.length-2-i.length).fill(0));for(let o=2;o<t[1].dims.length;++o)i[o-2]===0&&(i[o-2]=t[1].dims[o]);let r=e.pads.slice();Fr.adjustPadsBasedOnAutoPad(t[0].dims,e.strides,e.dilations,i,r,e.format==="NHWC",e.autoPad);let a=Object.assign({},e);return Object.assign(a,{kernelShape:i,pads:r}),a},Ca=e=>{let t=Xa(e),i=e.format,r=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],a=e.dilations,o=e.group,s=e.kernel_shape,l=e.pads,d=e.strides,p=e.w_is_const();return{autoPad:r,format:i,dilations:a,group:o,kernelShape:s,pads:l,strides:d,wIsConst:p,...t,cacheKey:`${e.format};${t.activation};`}},Gi=(e,t,i,r)=>{let a=i.format==="NHWC",o=Hu(t[0].dims,t[1].dims,i.dilations,i.pads,i.strides,a);if(i.group!==1){let E=[t[0]];if(a){let z=e.kernelCustomData.wT??e.compute(De(t[1],Or),{inputs:[1],outputs:[i.wIsConst?-2:-1]})[0];i.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=z),E.push(z)}else E.push(t[1]);t.length===3&&E.push(t[2]),!e.adapterInfo.isArchitecture("ampere")&&a&&t[1].dims[0]===i.group&&t[1].dims[1]===1&&i.dilations[0]===1&&i.dilations[1]===1?e.compute(uh(E,i,o,r),{inputs:E}):e.compute(oh(E,i,o,r),{inputs:E});return}let s=t.length===3,l=t[0].dims[a?1:2],d=t[0].dims[a?2:3],p=t[0].dims[a?3:1],f=t[1].dims[2],m=t[1].dims[3],g=o[a?1:2],w=o[a?2:3],_=o[a?3:1],$=a&&f===l&&m===d&&i.pads[0]===0&&i.pads[1]===0;if($||f===1&&m===1&&i.dilations[0]===1&&i.dilations[1]===1&&i.strides[0]===1&&i.strides[1]===1&&i.pads[0]===0&&i.pads[1]===0){let E=o[0],z,N,W,H=[];if(a){let D=e.kernelCustomData.wT??e.compute(De(t[1],Or),{inputs:[1],outputs:[i.wIsConst?-2:-1]})[0];if(i.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=D),$){let re=l*d*p;z=t[0].reshape([1,E,re]),N=D.reshape([1,re,_]),W=[1,E,_]}else z=t[0].reshape([E,l*d,p]),N=D.reshape([1,p,_]),W=[E,g*w,_];H.push(z),H.push(N)}else z=t[0].reshape([E,p,l*d]),N=t[1].reshape([1,_,p]),W=[E,_,g*w],H.push(N),H.push(z);s&&H.push(t[2]);let V=W[2],G=H[0].dims[H[0].dims.length-1];V<8&&G<8?e.compute(Ja(H,i,o,W,a,r),{inputs:H}):e.compute(Hr(H,i,o,W,a,r),{inputs:H});return}let x=!0,v=e.kernelCustomData.wT??e.compute(De(t[1],Or),{inputs:[1],outputs:[i.wIsConst?-2:-1]})[0];i.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=v);let b=[t[0],v];s&&b.push(t[2]);let k=a?g*w:_,T=a?_:g*w,C=f*m*p;e.compute(ah(b,i,o,k,T,C,s,x,r),{inputs:b})},Ku=(e,t)=>{let i=t.format==="NHWC",r=[e.inputs[0].reshape(i?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&r.push(e.inputs[2]);let a=[0,t.pads[0],0,t.pads[1]],o=[1].concat(t.strides),s=[1].concat(t.dilations),l=[1].concat(t.kernelShape),d=Rr({...t,pads:a,strides:o,dilations:s,kernelShape:l},r);Gi(e,r,d,p=>i?[p[0],p[2],p[3]]:[p[0],p[1],p[3]])},Qu=(e,t,i)=>{let r=i.format==="NHWC"?"channelsLast":"channelsFirst",a=Rr(i,t),o=i.autoPad==="NOTSET"?i.pads:i.autoPad,s=nh(t[0].dims,t[1].dims,i.strides,i.dilations,o,!1,r);e.compute(sh(t,a,s.outShape,[s.filterDepth,s.filterHeight,s.filterWidth],[s.padInfo.front,s.padInfo.top,s.padInfo.left],r))},Ea=(e,t)=>{if(ju(e.inputs,t),e.inputs[0].dims.length===3)Ku(e,t);else if(e.inputs[0].dims.length===5)Qu(e,e.inputs,t);else{let i=Rr(t,e.inputs);Gi(e,e.inputs,i)}}}),lh,Fy=L(()=>{"use strict";ie(),st(),le(),de(),lh=(e,t,i)=>{let r=e.length>2,a=t.outputShape,o=t.format==="NHWC",s=t.group,l=e[1].dims,d=l[2]/s,p=l[3],f=o?be(d):1,m=o?be(p):1,g=o?p===1?f:m:1,w=O.size(a)/m,_=[Math.ceil(w/64),1,1];he("verbose",()=>`[conv2d_backprop_webgpu] dispatch = ${_}`);let $=["rank","rank"],x=[t.strides[0],t.strides[1]],v=[t.kernelShape[o?1:2],t.kernelShape[o?2:3]],b=[t.dilations[0],t.dilations[1]],k=[v[0]+(t.dilations[0]<=1?0:(t.kernelShape[o?1:2]-1)*(t.dilations[0]-1)),v[1]+(t.dilations[1]<=1?0:(t.kernelShape[o?2:3]-1)*(t.dilations[1]-1))],T=[k[0]-1-Math.floor((t.pads[0]+t.pads[2])/2),k[1]-1-Math.floor((t.pads[1]+t.pads[3])/2)],C=[{type:12,data:w},{type:12,data:x},{type:12,data:v},{type:12,data:b},{type:12,data:k},{type:6,data:T},{type:12,data:d},{type:12,data:p},...Y(e[0].dims,e[1].dims)];r&&(C.push(...Y(e[2].dims)),$.push("rank")),C.push(...Y(a));let E=z=>{let N=[{name:"output_size",type:"u32"},{name:"strides",type:"u32",length:x.length},{name:"filter_dims",type:"u32",length:v.length},{name:"dilations",type:"u32",length:v.length},{name:"effective_filter_dims",type:"u32",length:k.length},{name:"pads",type:"i32",length:T.length},{name:"input_channels_per_group",type:"u32"},{name:"output_channels_per_group",type:"u32"}],W=Te(e[0].dataType),H=o?1:2,V=o?2:3,G=o?3:1,D=M("W",e[1].dataType,e[1].dims.length,g),re=M("Dy",e[0].dataType,e[0].dims.length,f),te=[re,D];r&&te.push(M("bias",e[2].dataType,[a[G]].length,m));let j=Z("result",e[0].dataType,a.length,m),se=()=>{let F="";if(f===1)F+=`
        let w_offset = ${D.indicesToOffset(`${D.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel, wOutChannel)`)};
        let wValue = ${D.getByOffset(`w_offset / ${g}`)};
        dotProd = dotProd + xValue * wValue;`;else if(p===1)F+=`
          let wValue = ${D.getByOffset(`${D.indicesToOffset(`${D.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel, wOutChannel)`)} / ${g}`)};
          dotProd = dotProd + dot(xValue, wValue);`;else for(let ce=0;ce<f;ce++)F+=`
            let wValue${ce} = ${D.getByOffset(`${D.indicesToOffset(`${D.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel + ${ce}, wOutChannel)`)} / ${g}`)};
            dotProd = dotProd + xValue[${ce}] * wValue${ce};`;return F},pe=`
            let outputIndices = ${j.offsetToIndices(`global_idx * ${m}`)};
            let batch = ${j.indicesGet("outputIndices",0)};
            let d1 = ${j.indicesGet("outputIndices",G)};
            let r = ${j.indicesGet("outputIndices",H)};
            let c = ${j.indicesGet("outputIndices",V)};
            let dyCorner = vec2<i32>(i32(r), i32(c)) - uniforms.pads;
            let dyRCorner = dyCorner.x;
            let dyCCorner = dyCorner.y;
            let groupId = d1 / uniforms.output_channels_per_group;
            let wOutChannel = d1 - groupId * uniforms.output_channels_per_group;
            // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).
            // ? = to be determined. : = across all values in that axis.
            var dotProd = ${j.type.value}(0.0);
            var wR: u32 = 0;
            if (uniforms.dilations.x == 1) {
              // Minimum wR >= 0 that satisfies (dyRCorner + wR) % (uniforms.strides.x) == 0
              wR = u32(((dyRCorner + i32(uniforms.strides.x) - 1) / i32(uniforms.strides.x)) * i32(uniforms.strides.x) - dyRCorner);
            }
            for (; wR < uniforms.effective_filter_dims.x; wR = wR + 1) {
              if (wR % uniforms.dilations.x != 0) {
                continue;
              }
              let dyR = (${W}(dyRCorner) + ${W}(wR)) / ${W}(uniforms.strides[0]);
              let wRPerm = uniforms.filter_dims.x - 1 - wR / uniforms.dilations.x;
              if (dyR < 0.0 || dyR >= ${W}(uniforms.Dy_shape[${H}]) || fract(dyR) > 0.0 ||
                  wRPerm < 0) {
                continue;
              }
              let idyR: u32 = u32(dyR);
              var wC: u32 = 0;
              if (uniforms.dilations.y == 1) {
                // Minimum wC >= 0 that satisfies (dyCCorner + wC) % (uniforms.strides.y) == 0
                wC = u32(((dyCCorner + i32(uniforms.strides.y) - 1) / i32(uniforms.strides.y)) * i32(uniforms.strides.y) - dyCCorner);
              }

              for (; wC < uniforms.effective_filter_dims.y; wC = wC + 1) {
                if (wC % uniforms.dilations.y != 0) {
                  continue;
                }
                let dyC = (${W}(dyCCorner) + ${W}(wC)) / ${W}(uniforms.strides.y);
                let wCPerm = uniforms.filter_dims.y - 1 - wC / uniforms.dilations.y;
                if (dyC < 0.0 || dyC >= ${W}(uniforms.Dy_shape[${V}]) ||
                    fract(dyC) > 0.0 || wCPerm < 0) {
                  continue;
                }
                let idyC: u32 = u32(dyC);
                var inputChannel = groupId * uniforms.input_channels_per_group;
                for (var d2: u32 = 0; d2 < uniforms.input_channels_per_group; d2 = d2 + ${f}) {
                  let xValue = ${o?re.getByOffset(`${re.indicesToOffset(`${re.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${f}`):re.get("batch","inputChannel","idyR","idyC")};
                  ${se()}
                  inputChannel = inputChannel + ${f};
                }
                wC = wC + uniforms.strides.y - 1;
              }
              wR = wR + uniforms.strides[0] - 1;
            }
            let value = dotProd${r?` + bias[d1 / ${m}]`:""};
            ${j.setByOffset("global_idx","value")};
          `;return`
    ${z.registerUniforms(N).declareVariables(...te,j)}
      ${z.mainStart()}
      ${z.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")};
    ${pe}}`};return{name:"ConvTranspose2D",shaderCache:{hint:`${t.cacheKey};${f}${g}${m}${p===1}`,inputDependencies:$},getRunData:()=>({dispatchGroup:{x:_[0],y:_[1],z:_[2]},outputs:[{dims:i?i(a):a,dataType:e[0].dataType}],programUniforms:C}),getShaderSource:E}}}),Zu,Xu,Yu,Hi,dh,Ju,ji,el,ph,Gy=L(()=>{"use strict";Fy(),Ot(),gt(),Zu=(e,t,i,r,a,o)=>(e-1)*t+i+(r-1)*a+1-o,Xu=(e,t,i,r,a)=>{let o=Math.floor(e/2);t==="SAME_UPPER"?(i[r]=o,i[a]=e-o):t==="SAME_LOWER"&&(i[r]=e-o,i[a]=o)},Yu=(e,t,i,r,a,o,s,l,d,p)=>{let f=e.length-2,m=p.length===0;d.length<f&&d.push(...Array(f-d.length).fill(0));let g=e[0],w=t[l?3:1]*a;for(let _=0,$=e.length-f-(l?1:0);_<f;++_,++$){let x=e[$],v=m?x*s[_]:p[_],b=Zu(x,s[_],o[_],t[$],i[_],v);Xu(b,r,o,_,_+f),m&&p.push(s[_]*(x-1)+d[_]+(t[$]-1)*i[_]+1-o[_]-o[_+f])}p.splice(0,0,g),p.splice(l?3:1,0,w)},Hi=(e,t)=>{let i=e.kernelShape.slice();if(e.kernelShape.length===0||e.kernelShape.reduce((m,g)=>m*g,1)===0){i.length=0;for(let m=2;m<t[1].dims.length;++m)i.push(t[1].dims[m])}let r=e.format==="NHWC";i.splice(0,0,t[1].dims[0]),i.splice(r?3:1,0,t[1].dims[1]);let a=e.pads.slice(),o=e.outputShape.slice(),s=e.outputPadding.slice(),l=t[0].dims,d=e.dilations.slice();if(d.reduce((m,g)=>m+g,0)===0){let m=t[0].dims.length-2;d=new Array(m).fill(1)}let p=e.strides.slice();if(p.reduce((m,g)=>m+g,0)===0){let m=t[0].dims.length-2;p=new Array(m).fill(1)}Yu(l,i,d,e.autoPad,e.group,a,p,r,s,o);let f=Object.assign({},e);return Object.assign(f,{kernelShape:i,pads:a,outputPadding:s,outputShape:o,dilations:d,strides:p}),f},dh=e=>{let t=Xa(e),i=e.format,r=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][typeof e.autoPad>"u"?0:e.autoPad],a=e.dilations,o=e.group,s=e.kernelShape,l=e.pads,d=e.strides,p=e.wIsConst(),f=e.outputPadding,m=e.outputShape;return{autoPad:r,format:i,dilations:a,group:o,kernelShape:s,outputPadding:f,outputShape:m,pads:l,strides:d,wIsConst:p,...t,cacheKey:`${e.format};${t.activation};`}},Ju=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length!==4&&e[0].dims.length!==3)throw new Error("currently only support 2-dimensional conv");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");let i=e[0].dims[t.format==="NHWC"?e[0].dims.length-1:1],r=e[1].dims[0];if(i!==r)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");let a=e[1].dims[1]*t.group;if(e.length===3&&(e[2].dims.length!==1||e[2].dims[0]!==a))throw new Error("invalid bias");let o=e[0].dims.length-2;if(t.dilations.reduce((s,l)=>s+l,0)>0&&t.dilations.length!==o)throw new Error(`dilations should be ${o}D`);if(t.strides.reduce((s,l)=>s+l,0)>0&&t.strides.length!==o)throw new Error(`strides should be ${o}D`);if(t.pads.reduce((s,l)=>s+l,0)>0&&t.pads.length!==o*2)throw new Error(`pads should be ${o*2}D`);if(t.outputPadding.length!==o&&t.outputPadding.length!==0)throw new Error(`output_padding should be ${o}D`);if(t.kernelShape.reduce((s,l)=>s+l,0)>0&&t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape");if(t.outputShape.length!==0&&t.outputShape.length!==e[0].dims.length-2)throw new Error("invalid output shape")},ji=(e,t,i,r)=>{let a=e.kernelCustomData.wT??e.compute(De(t[1],[2,3,0,1]),{inputs:[1],outputs:[i.wIsConst?-2:-1]})[0];i.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=a);let o=[t[0],a];t.length===3&&o.push(t[2]),e.compute(lh(o,i,r),{inputs:o})},el=(e,t)=>{let i=t.format==="NHWC",r=[e.inputs[0].reshape(i?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&r.push(e.inputs[2]);let a=t.kernelShape;(a.length===0||a[0]===0)&&(a=[e.inputs[1].dims[2]]);let o=t.dilations;(o.length===0||o[0]===0)&&(o=[1]);let s=t.strides;(s.length===0||s[0]===0)&&(s=[1]);let l=t.pads;l.length===0&&(l=[0,0]),l=[0,l[0],0,l[1]],s=[1].concat(s),o=[1].concat(o),a=[1].concat(a);let d=t.outputPadding;d=[0].concat(d);let p=Hi({...t,pads:l,strides:s,dilations:o,kernelShape:a,outputPadding:d},r);ji(e,r,p,f=>i?[f[0],f[2],f[3]]:[f[0],f[1],f[3]])},ph=(e,t)=>{if(Ju(e.inputs,t),e.inputs[0].dims.length===3)el(e,t);else{let i=Hi(t,e.inputs);ji(e,e.inputs,i)}}}),tl,ch,hh,Hy=L(()=>{"use strict";ie(),le(),$e(),de(),tl=(e,t,i,r)=>{let a=O.size(t),o=t.length,s=M("input",e,o),l=Z("output",e,o),d=i.dataType===6?i.getInt32Array()[0]:Number(i.getBigInt64Array()[0]),p=O.normalizeAxis(d,o),f=m=>{let g=` i32(${s.indicesGet("inputIndices","uniforms.axis")}) `,w=X("uniforms.input_shape","uniforms.axis",o),_=r.reverse?g+(r.exclusive?" + 1":""):"0",$=r.reverse?w:g+(r.exclusive?"":" + 1");return`
                ${m.registerUniform("outputSize","u32").registerUniform("axis","u32").declareVariables(s,l)}
                ${m.mainStart()}
                  ${m.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
                  var inputIndices = ${l.offsetToIndices("global_idx")};
                  var sum = ${l.type.value}(0);
                  let first : i32 = ${_};
                  let last : i32 = ${$};
                  for (var i : i32 = first; i < last; i++) {
                    ${s.indicesSet("inputIndices","uniforms.axis","u32(i)")};
                    sum = sum + ${s.getByIndices("inputIndices")};
                  }
                  ${l.setByOffset("global_idx","sum")};
                }`};return{name:"CumSum",shaderCache:{hint:r.cacheKey,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:t,dataType:e}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:[{type:12,data:a},{type:12,data:p},...Y(t,t)]}),getShaderSource:f}},ch=(e,t)=>{let i=e.inputs[0].dims,r=e.inputs[0].dataType,a=e.inputs[1];e.compute(tl(r,i,a,t),{inputs:[0]})},hh=e=>{let t=e.exclusive===1,i=e.reverse===1;return ge({exclusive:t,reverse:i})}}),rl,il,al,fh,mh,jy=L(()=>{"use strict";ie(),le(),$e(),de(),rl=e=>{if(!e||e.length!==1)throw new Error("DepthToSpace requires 1 input.");if(e[0].dims.length!==4)throw new Error("DepthToSpace requires 4D input.")},il=(e,t,i,r)=>{let a=[];a.push(`fn perm(i: ${r.type.indices}) -> ${i.type.indices} {
    var a: ${i.type.indices};`);for(let o=0;o<t;++o)a.push(i.indicesSet("a",e[o],`i[${o}]`));return a.push("return a;}"),a.join(`
`)},al=(e,t)=>{let i,r,a,o,s,l,d=t.format==="NHWC",p=t.blocksize,f=t.mode==="DCR";d?([i,r,a,o]=e.dims,s=f?[i,r,a,p,p,o/p**2]:[i,r,a,o/p**2,p,p],l=f?[0,1,3,2,4,5]:[0,1,4,2,5,3]):([i,r,a,o]=[e.dims[0],e.dims[2],e.dims[3],e.dims[1]],s=f?[i,p,p,o/p**2,r,a]:[i,o/p**2,p,p,r,a],l=f?[0,3,4,1,5,2]:[0,1,4,2,5,3]);let m=e.reshape(s),g=m.dims.length,w=e.dataType,_=M("a",w,g),$=Z("output",w,g),x=v=>`
  ${v.registerUniform("output_size","u32").declareVariables(_,$)}

  ${il(l,g,_,$)}

  ${v.mainStart()}
    ${v.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${$.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${$.setByOffset("global_idx",_.getByIndices("aIndices"))}
  }`;return{name:"DepthToSpace",shaderCache:{hint:`${e.dims};${t.blocksize};${t.mode}`,inputDependencies:["rank"]},getRunData:v=>{let b=d?[i,r*p,a*p,o/p**2]:[i,o/p**2,r*p,a*p],k=O.size(b),T=m.dims,C=O.sortBasedOnPerm(T,l);return{outputs:[{dims:b,dataType:v[0].dataType}],dispatchGroup:{x:Math.ceil(k/64)},programUniforms:[{type:12,data:k},...Y(T,C)]}},getShaderSource:x}},fh=(e,t)=>{rl(e.inputs),e.compute(al(e.inputs[0],t))},mh=e=>ge({blocksize:e.blocksize,mode:e.mode,format:e.format})}),Br,er,Ki,nl,sl,ol,ul,Qi,ll,gh,yh,Ky=L(()=>{"use strict";ie(),le(),$e(),de(),Br="[a-zA-Z]|\\.\\.\\.",er="("+Br+")+",Ki="^"+er+"$",nl="("+er+",)*"+er,sl="^"+nl+"$",ol=class{constructor(e=-1){this.symbolToIndices=new Map,this.inputIndex=e}addSymbol(e,t){let i=this.symbolToIndices.get(e);i===void 0?i=[t]:i.push(t),this.symbolToIndices.set(e,i)}},ul=class{constructor(e,t){this.equation=t,this.hasEllipsis=!1,this.symbolToInfo=new Map,this.lhs=new Array,this.outputDims=[];let[i,r]=t.includes("->")?t.split("->",2):[t,""];if(!i.match(RegExp(sl)))throw new Error("Invalid LHS term");if(i.split(",").forEach((a,o)=>{let s=e[o].dims.slice();if(!a.match(RegExp(Ki)))throw new Error("Invalid LHS term");let l=this.processTerm(a,!0,s,o);this.lhs.push(l)}),r==="")r+=[...this.symbolToInfo.entries()].filter(([a,o])=>o.count===1||a==="...").map(([a])=>a).join("");else if(!r.match(RegExp(er)))throw new Error("Invalid RHS");r.match(RegExp(Br,"g"))?.forEach(a=>{if(a==="...")this.outputDims=this.outputDims.concat(this.ellipsisDims);else{let o=this.symbolToInfo.get(a);if(o===void 0)throw new Error("Invalid RHS symbol");this.outputDims.push(o.dimValue)}}),this.rhs=this.processTerm(r,!1,this.outputDims)}addSymbol(e,t,i){let r=this.symbolToInfo.get(e);if(r!==void 0){if(r.dimValue!==t&&r.count!==1)throw new Error("Dimension mismatch");r.count++,r.inputIndices.push(i)}else r={count:1,dimValue:t,inputIndices:[i]};this.symbolToInfo.set(e,r)}processTerm(e,t,i,r=-1){let a=i.length,o=!1,s=[],l=0;if(!e.match(RegExp(Ki))&&!t&&e!=="")throw new Error("Invalid LHS term");let d=e.match(RegExp(Br,"g")),p=new ol(r);return d?.forEach((f,m)=>{if(f==="..."){if(o)throw new Error("Only one ellipsis is allowed per input term");o=!0;let g=a-d.length+1;if(g<0)throw new Error("Ellipsis out of bounds");if(s=i.slice(l,l+g),this.hasEllipsis){if(this.ellipsisDims.length!==s.length||this.ellipsisDims.toString()!==s.toString())throw new Error("Ellipsis dimensions mismatch")}else if(t)this.hasEllipsis=!0,this.ellipsisDims=s;else throw new Error("Ellipsis must be specified in the LHS");for(let w=0;w<s.length;w++){let _=String.fromCharCode(48+w);p.addSymbol(_,m+w),this.addSymbol(_,i[l++],r)}}else p.addSymbol(f,m+(this.hasEllipsis?this.ellipsisDims.length-1:0)),this.addSymbol(f,i[l++],r)}),p}},Qi=e=>e+"_max",ll=(e,t,i,r)=>{let a=e.map(p=>p.length).map((p,f)=>M(`input${f}`,t,p)),o=O.size(r),s=Z("output",t,r.length),l=[...i.symbolToInfo.keys()].filter(p=>!i.rhs.symbolToIndices.has(p)),d=p=>{let f=[],m="var prod = 1.0;",g="var sum = 0.0;",w="sum += prod;",_=[],$=[],x=[],v=[],b=i.symbolToInfo.size===i.rhs.symbolToIndices.size;i.symbolToInfo.forEach((T,C)=>{if(i.rhs.symbolToIndices.has(C)){let E=i.rhs.symbolToIndices.get(C)?.[0];E!==void 0&&i.lhs.forEach((z,N)=>{if(T.inputIndices.includes(N)){let W=z.symbolToIndices.get(C);if(W===void 0)throw new Error("Invalid symbol error");W.forEach(H=>{f.push(`${a[N].indicesSet(`input${N}Indices`,H,s.indicesGet("outputIndices",E))}`)})}})}else i.lhs.forEach((E,z)=>{if(T.inputIndices.includes(z)){let N=E.symbolToIndices.get(C);if(N===void 0)throw new Error("Invalid symbol error");N.forEach(W=>{_.push(`${a[z].indicesSet(`input${z}Indices`,W,`${C}`)}`)}),v.push(`prod *= ${a[z].getByIndices(`input${z}Indices`)};`)}}),$.push(`for(var ${C}: u32 = 0; ${C} < uniforms.${Qi(C)}; ${C}++) {`),x.push("}")});let k=b?[...f,`let sum = ${a.map((T,C)=>T.getByIndices(`input${C}Indices`)).join(" * ")};`]:[...f,g,...$,..._,m,...v,w,...x];return`
            ${p.registerUniforms(l.map(T=>({name:`${Qi(T)}`,type:"u32"}))).registerUniform("outputSize","u32").declareVariables(...a,s)}

            ${p.mainStart()}
            ${p.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
            var outputIndices = ${s.offsetToIndices("global_idx")};
            ${a.map((T,C)=>`var input${C}Indices: ${a[C].type.indices};`).join(`
`)}
            ${k.join(`
`)};
            ${s.setByOffset("global_idx","sum")};
          }`};return{name:"Einsum",shaderCache:{hint:i.equation,inputDependencies:e.map(()=>"rank")},getRunData:()=>{let p=l.filter(m=>i.symbolToInfo.has(m)).map(m=>({type:12,data:i.symbolToInfo.get(m)?.dimValue||0}));p.push({type:12,data:o});let f=e.map((m,g)=>[...Y(m)]).reduce((m,g)=>m.concat(g),p);return f.push(...Y(r)),{outputs:[{dims:r,dataType:t}],dispatchGroup:{x:Math.ceil(o/64)},programUniforms:f}},getShaderSource:d}},gh=(e,t)=>{let i=new ul(e.inputs,t.equation),r=i.outputDims,a=e.inputs.map((o,s)=>o.dims);e.compute(ll(a,e.inputs[0].dataType,i,r))},yh=e=>{let t=e.equation.replace(/\s+/g,"");return ge({equation:t})}}),dl,Zi,pl,cl,_h,Qy=L(()=>{"use strict";ie(),le(),de(),dl=e=>{if(!e||e.length!==2)throw new Error("Expand requires 2 input.");let t=e[0].dims,i=Array.from(e[1].getBigInt64Array(),Number),r=i.length<t.length?0:i.length-t.length,a=t.length<i.length?0:t.length-i.length;for(;r<i.length&&a<t.length;++r,++a)if(i[r]!==t[a]&&i[r]!==1&&t[a]!==1)throw new Error("Expand requires shape to be broadcastable to input")},Zi=(e,t)=>{let i=e.length-t.length,r=[];for(let a=0;a<i;++a)r.push(e[a]);for(let a=0;a<t.length;++a)r.push(t[a]===1?e[a+i]:t[a]);return r},pl=(e,t)=>e.length>t.length?Zi(e,t):Zi(t,e),cl=e=>{let t=e[0].dims,i=Array.from(e[1].getBigInt64Array(),Number),r=pl(t,i),a=e[0].dataType,o=a===9||O.size(t)===1,s=a===9||t.length>0&&t[t.length-1]%4===0?4:1,l=o||r.length>0&&r[r.length-1]%4===0?4:1,d=Math.ceil(O.size(r)/l),p=m=>{let g=M("input",a,t.length,s),w=Z("output",a,r.length,l),_;if(a===9){let $=(x,v,b="")=>`
          let outputIndices${v} = ${w.offsetToIndices(`outputOffset + ${v}u`)};
          let offset${v} = ${g.broadcastedIndicesToOffset(`outputIndices${v}`,w)};
          let index${v} = offset${v} / 4u;
          let component${v} = offset${v} % 4u;
          ${x}[${v}] = ${b}(${g.getByOffset(`index${v}`)}[component${v}]);
        `;_=`
        let outputOffset = global_idx * ${l};
        var data = vec4<u32>(0);
        ${$("data",0,"u32")}
        ${$("data",1,"u32")}
        ${$("data",2,"u32")}
        ${$("data",3,"u32")}
        ${w.setByOffset("global_idx","data")}
      }`}else _=`
        let outputIndices = ${w.offsetToIndices(`global_idx * ${l}`)};
        let inputOffset = ${g.broadcastedIndicesToOffset("outputIndices",w)};
        let data = ${w.type.value}(${g.getByOffset(`inputOffset / ${s}`)});
        ${w.setByOffset("global_idx","data")}
      }`;return`
    ${m.registerUniform("vec_size","u32").declareVariables(g,w)}
    ${m.mainStart()}
    ${m.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
    ${_}`},f=[{type:12,data:d},...Y(t,r)];return{name:"Expand",shaderCache:{hint:`${r.length};${s}${l}`,inputDependencies:["rank"]},getShaderSource:p,getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:f})}},_h=e=>{dl(e.inputs),e.compute(cl(e.inputs),{inputs:[0]})}}),hl,wh,Zy=L(()=>{"use strict";ie(),le(),de(),Za(),hl=e=>{let t=e[0].dataType,i=O.size(e[0].dims),r=O.size(e[1].dims),a=r%4===0,o=s=>{let l=M("x",t,[1],4),d=M("bias",t,[1],4),p=Z("y",t,[1],4),f=[{name:"output_vec_size",type:"u32"},{name:"bias_size",type:"u32"}],m=w=>`
      let bias${w}_offset: u32 = (global_idx * 4 + ${w}) % uniforms.bias_size;
      let bias${w} = ${d.getByOffset(`bias${w}_offset / 4`)}[bias${w}_offset % 4];`,g=a?`
      let bias = ${d.getByOffset("global_idx % (uniforms.bias_size / 4)")};`:`${m(0)}${m(1)}${m(2)}${m(3)}
      let bias = ${l.type.value}(bias0, bias1, bias2, bias3);`;return`${s.registerUniforms(f).declareVariables(l,d,p)}

    ${Sa(ze(t))}

    ${s.mainStart(qt)}
      ${s.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_vec_size")}

      let x = ${l.getByOffset("global_idx")};
      ${g}
      let x_in = x + bias;
      ${p.setByOffset("global_idx",ka("x_in"))}
    }`};return{name:"FastGeluWithBias",shaderCache:{hint:`${a}`,inputDependencies:["type","type"]},getShaderSource:o,getRunData:s=>({outputs:[{dims:s[0].dims,dataType:s[0].dataType}],programUniforms:[{type:12,data:Math.ceil(i/4)},{type:12,data:r}],dispatchGroup:{x:Math.ceil(i/qt/4)}})}},wh=e=>{e.inputs.length<2||O.size(e.inputs[1].dims)===0?Uc(e):e.compute(hl(e.inputs))}}),fl,ml,bh,$h,Xy=L(()=>{"use strict";ie(),le(),$e(),de(),fl=e=>{if(!e||e.length!==2)throw new Error("Gather requires 2 inputs.")},ml=(e,t)=>{let i=e[0].dims,r=e[1].dims,a=i.length,o=O.normalizeAxis(t.axis,a),s=i.slice(0);s.splice(o,1,...r);let l=i[o],d=e[0].dataType===9?4:1,p=Math.ceil(O.size(s)/d),f=[{type:12,data:p},{type:6,data:l},{type:12,data:o},...Y(e[0].dims,e[1].dims,s)],m=g=>{let w=M("data",e[0].dataType,e[0].dims.length,d),_=M("inputIndices",e[1].dataType,e[1].dims.length),$=Z("output",e[0].dataType,s.length,d),x=b=>{let k=r.length,T=`var indicesIndices${b}  = ${_.type.indices}(0);`;for(let C=0;C<k;C++)T+=`${k>1?`indicesIndices${b}[${C}]`:`indicesIndices${b}`} = ${s.length>1?`outputIndices${b}[uniforms.axis + ${C}]`:`outputIndices${b}`};`;T+=`
          var idx${b} = ${_.getByIndices(`indicesIndices${b}`)};
          if (idx${b} < 0) {
            idx${b} = idx${b} + uniforms.axisDimLimit;
          }
          var dataIndices${b} : ${w.type.indices};
        `;for(let C=0,E=0;C<a;C++)C===o?(T+=`${a>1?`dataIndices${b}[${C}]`:`dataIndices${b}`} = u32(idx${b});`,E+=k):(T+=`${a>1?`dataIndices${b}[${C}]`:`dataIndices${b}`} = ${s.length>1?`outputIndices${b}[${E}]`:`outputIndices${b}`};`,E++);return T},v;if(e[0].dataType===9){let b=(k,T,C="")=>`
          let outputIndices${T} = ${$.offsetToIndices(`outputOffset + ${T}u`)};
          ${x(T)};
          let offset${T} = ${w.indicesToOffset(`dataIndices${T}`)};
          let index${T} = offset${T} / 4u;
          let component${T} = offset${T} % 4u;
          ${k}[${T}] = ${C}(${w.getByOffset(`index${T}`)}[component${T}]);
        `;v=`
        let outputOffset = global_idx * ${d};
        var value = vec4<u32>(0);
        ${b("value",0,"u32")}
        ${b("value",1,"u32")}
        ${b("value",2,"u32")}
        ${b("value",3,"u32")}
        ${$.setByOffset("global_idx","value")}
      `}else v=`
      let outputIndices = ${$.offsetToIndices("global_idx")};
      ${x("")};
      let value = ${w.getByIndices("dataIndices")};
      ${$.setByOffset("global_idx","value")};
      `;return`
      ${g.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(w,_,$)}
      ${g.mainStart()}
        ${g.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        ${v}
      }`};return{name:"Gather",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:s,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(p/64)},programUniforms:f}),getShaderSource:m}},bh=e=>ge({axis:e.axis}),$h=(e,t)=>{let i=e.inputs;fl(i),e.compute(ml(e.inputs,t))}}),gl,vh,xh,Yy=L(()=>{"use strict";ie(),le(),de(),gl=(e,t,i,r,a,o,s,l,d)=>{let p=[{type:12,data:o},{type:12,data:r},{type:12,data:a},{type:12,data:i},{type:12,data:s},{type:12,data:l},{type:12,data:d}],f=[o];p.push(...Y(t.dims,f));let m=g=>{let w=M("indices_data",t.dataType,t.dims.length),_=Z("input_slice_offsets_data",12,1,1),$=[w,_],x=[{name:"output_size",type:"u32"},{name:"batch_dims",type:"u32"},{name:"input_dims",type:"u32",length:a.length},{name:"sizes_from_slice_dims_data",type:"u32",length:i.length},{name:"num_slices_per_batch",type:"u32"},{name:"input_batch_stride",type:"u32"},{name:"num_slice_dims",type:"u32"}];return`
  ${g.registerUniforms(x).declareVariables(...$)}
  ${g.mainStart()}
    ${g.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let batch_idx = global_idx / uniforms.num_slices_per_batch;
    let base_offset = batch_idx * uniforms.input_batch_stride;

    let slice_indices_base_offset = global_idx * uniforms.num_slice_dims;
    var relative_slice_offset = 0;
    for (var dim_idx = 0u; dim_idx < uniforms.num_slice_dims; dim_idx ++) {
      var index = i32(indices_data[dim_idx + slice_indices_base_offset].x);
      let input_dim_idx = uniforms.batch_dims + dim_idx;
      if (index < 0) {
        ${a.length===1?"index += i32(uniforms.input_dims);":"index += i32(uniforms.input_dims[input_dim_idx]);"}
      }
      ${i.length===1?"relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data);":"relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data[dim_idx]);"}
    }

    input_slice_offsets_data[global_idx] =  base_offset + u32(relative_slice_offset);
  }`};return e.compute({name:"computeSliceOffsets",shaderCache:{hint:`${a.length}_${i.length}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:f,dataType:e.inputs[1].dataType}],dispatchGroup:{x:Math.ceil(o/64)},programUniforms:p}),getShaderSource:m},{inputs:[t],outputs:[-1]})[0]},vh=(e,t)=>{let i=e.inputs,r=i[0].dims,a=i[0].dataType,o=i[1].dims,s=o[o.length-1],l=O.sizeToDimension(o,o.length-1),d=O.sizeFromDimension(r,t.batchDims+s),p=O.sizeToDimension(r,t.batchDims),f=O.sizeFromDimension(r,t.batchDims),m=l/p,g=new Array(s),w=d;for(let T=0;T<s;++T)g[s-1-T]=w,w*=r[t.batchDims+s-1-T];let _=gl(e,i[1],g,t.batchDims,r,l,m,f,s),$=t.batchDims+s;if($>r.length)throw new Error("last dimension of indices must not be larger than rank of input tensor");let x=o.slice(0,-1).concat(r.slice($)),v=O.size(x),b=[{type:12,data:v},{type:12,data:d},...Y(i[0].dims,_.dims,x)],k=T=>{let C=M("data",i[0].dataType,i[0].dims.length),E=M("slice_offsets",12,_.dims.length),z=Z("output",i[0].dataType,x.length);return`
          ${T.registerUniform("output_size","u32").registerUniform("slice_size","u32").declareVariables(C,E,z)}
            ${T.mainStart()}
            ${T.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let slice_offset = slice_offsets[global_idx / uniforms.slice_size];
          output[global_idx] = data[u32(slice_offset) + global_idx % uniforms.slice_size];
        }`};e.compute({name:"GatherND",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:x,dataType:a}],dispatchGroup:{x:Math.ceil(v/64)},programUniforms:b}),getShaderSource:k},{inputs:[i[0],_]})},xh=e=>({batchDims:e.batch_dims,cacheKey:""})}),yl,_l,Sh,kh,Jy=L(()=>{"use strict";ie(),le(),$e(),de(),yl=(e,t)=>{if(e.length<3||e.length>4)throw new Error("GatherBlockQuantized requires 3 or 4 inputs.");let i=O.normalizeAxis(t.quantizeAxis,e[0].dims.length),r=t.blockSize,a=e[0],o=e[2],s=e.length===4?e[3]:void 0;if(o.dims.length!==a.dims.length||!a.dims.map((l,d)=>d===i?Math.ceil(l/r)===o.dims[d]:l===o.dims[d]).reduce((l,d)=>l&&d,!0))throw new Error("Scales must have the same rank as the input tensor and the dims should match except on gatherAxis.");if(s){if(s.dataType!==a.dataType)throw new Error("Zero point must have the same data type as the input tensor.");if(s.dims.length!==o.dims.length||!s.dims.map((l,d)=>l===o.dims[d]).reduce((l,d)=>l&&d,!0))throw new Error("Zero point must have the same rank as the input tensor and the dims should match except on quantizeAxis.")}},_l=(e,t)=>{let i=e[0].dims,r=e[1].dims,a=i.length,o=O.normalizeAxis(t.gatherAxis,a),s=O.normalizeAxis(t.quantizeAxis,a),l=i.slice(0);l.splice(o,1,...r);let d=O.size(l),p=e[2].dataType,f=e[0].dataType===22,m=[{type:12,data:d},{type:12,data:s},{type:12,data:o},{type:12,data:t.blockSize},...Y(...e.map((w,_)=>w.dims),l)],g=w=>{let _=M("data",e[0].dataType,e[0].dims.length),$=M("inputIndices",e[1].dataType,e[1].dims.length),x=M("scales",e[2].dataType,e[2].dims.length),v=e.length>3?M("zeroPoint",e[3].dataType,e[3].dims.length):void 0,b=Z("output",p,l.length),k=[_,$,x];v&&k.push(v);let T=[{name:"output_size",type:"u32"},{name:"quantize_axis",type:"u32"},{name:"gather_axis",type:"u32"},{name:"block_size",type:"u32"}];return`
        ${w.registerUniforms(T).declareVariables(...k,b)}
        ${w.mainStart()}
        let output_indices = ${b.offsetToIndices("global_idx")};
        var indices_indices = ${$.type.indices}(0);
        ${r.length>1?`
          for (var i: u32 = 0; i < ${r.length}; i++) {
            let index = ${b.indicesGet("output_indices","uniforms.gather_axis + i")};
            ${$.indicesSet("indices_indices","i","index")};
          }`:`indices_indices = ${b.indicesGet("output_indices","uniforms.gather_axis")};`};
        var data_indices = ${_.type.indices}(0);
        for (var i: u32 = 0; i < uniforms.gather_axis; i++) {
          let index = ${b.indicesGet("output_indices","i")};
          ${_.indicesSet("data_indices","i","index")};
        }
        var index_from_indices = ${$.getByIndices("indices_indices")};
        if (index_from_indices < 0) {
          index_from_indices += ${i[o]};
        }
        ${_.indicesSet("data_indices","uniforms.gather_axis","u32(index_from_indices)")};
        for (var i = uniforms.gather_axis + 1; i < ${l.length}; i++) {
          let index = ${b.indicesGet("output_indices",`i + ${r.length} - 1`)};
          ${_.indicesSet("data_indices","i","index")};
        }
        let data_offset = ${_.indicesToOffset("data_indices")};
        let data_index = data_offset % 8;
        // Convert 4-bit packed data to 8-bit packed data.
        let packed_4bit_quantized_data = ${_.getByOffset("data_offset / 8")};
        let packed_8bit_quantized_data = (packed_4bit_quantized_data >> (4 * (data_index % 2))) & 0x0f0f0f0f;
        let quantized_data_vec = ${f?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_quantized_data));
        let quantized_data = quantized_data_vec[data_index / 2];
        var scale_indices = data_indices;
        let quantize_axis_index = ${x.indicesGet("data_indices","uniforms.quantize_axis")} / uniforms.block_size;
        ${x.indicesSet("scale_indices","uniforms.quantize_axis","quantize_axis_index")};
        var scale = ${x.getByIndices("scale_indices")};
        ${v?`
              let zero_point_indices = scale_indices;
              let zero_point_offset = ${v.indicesToOffset("zero_point_indices")};
              let zero_point_index = zero_point_offset % 8;
              let packed_4bit_zero_points = ${v.getByOffset("zero_point_offset / 8")};
              let packed_8bit_zero_points = (packed_4bit_zero_points >> (4 * (zero_point_index % 2))) & 0x0f0f0f0f;
              let zero_point_vec = ${f?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_zero_points));
              let zero_point = zero_point_vec[zero_point_index / 2];`:"var zero_point = 0"};
        let dequantized_data = ${ze(p)}(quantized_data - zero_point) * scale;
        ${b.setByOffset("global_idx","dequantized_data")};
    }`};return{name:"GatherBlockQuantized",shaderCache:{hint:`${t.cacheKey};${e.filter((w,_)=>_!==1).map(w=>w.dims.join("_")).join(";")}`,inputDependencies:Array.from({length:e.length},(w,_)=>"rank")},getRunData:()=>({outputs:[{dims:l,dataType:p}],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:m}),getShaderSource:g}},Sh=(e,t)=>{let i=e.inputs;yl(i,t),e.compute(_l(e.inputs,t))},kh=e=>ge({blockSize:e.blockSize,gatherAxis:e.gatherAxis,quantizeAxis:e.quantizeAxis})}),wl,bl,Th,Ih,e0=L(()=>{"use strict";ie(),le(),$e(),de(),wl=e=>{if(!e||e.length!==2)throw new Error("GatherElements requires 2 inputs.");if(e[0].dims.length<1)throw new Error("GatherElements requires that the data input be rank >= 1.");if(e[0].dims.length!==e[1].dims.length)throw new Error(`GatherElements requires that the data input and
                     indices input tensors be of same rank.`)},bl=(e,t)=>{let i=e[0].dims,r=e[0].dataType,a=i.length,o=e[1].dims,s=e[1].dataType,l=O.normalizeAxis(t.axis,a),d=i[l],p=o.slice(0),f=O.size(p),m=M("input",r,a),g=M("indicesInput",s,o.length),w=Z("output",r,p.length),_=[{type:12,data:f},{type:6,data:d},{type:12,data:l}];return _.push(...Y(i,o,p)),{name:"GatherElements",shaderCache:{inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:p,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(f/64)},programUniforms:_}),getShaderSource:$=>`
      ${$.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(m,g,w)}
      ${$.mainStart()}
      ${$.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

      let outputIndices = ${w.offsetToIndices("global_idx")};

      var idx = ${g.getByOffset("global_idx")};
      if (idx < 0) {
        idx = idx + uniforms.axisDimLimit;
      }
      var inputIndices = ${m.type.indices}(outputIndices);
      ${m.indicesSet("inputIndices","uniforms.axis","u32(idx)")};
      let value = ${m.getByIndices("inputIndices")};

      ${w.setByOffset("global_idx","value")};
  }`}},Th=e=>ge({axis:e.axis}),Ih=(e,t)=>{let i=e.inputs;wl(i),e.compute(bl(e.inputs,t))}}),$l,vl,Ch,Eh,t0=L(()=>{"use strict";ie(),le(),de(),$l=e=>{if(!e)throw new Error("Input is missing");if(e.length<2||e.length>3)throw new Error("Invaid input number.");if(e.length===3&&e[2].dims.length>2)throw new Error("Invalid input shape of C");if(e[0].dataType!==e[1].dataType||e.length===3&&e[0].dataType!==e[2].dataType)throw new Error("Input types are mismatched")},vl=(e,t)=>{let i=e[0].dims.slice(),r=e[1].dims.slice(),[a,o,s]=zp.getShapeOfGemmResult(i,t.transA,r,t.transB,e.length===3?e[2].dims:void 0),l=[a,o];if(!l)throw new Error("Can't use gemm on the given tensors");let d=16,p=Math.ceil(o/d),f=Math.ceil(a/d),m=!0,g=O.size(l),w=[{type:12,data:m?p:g},{type:12,data:a},{type:12,data:o},{type:12,data:s},{type:1,data:t.alpha},{type:1,data:t.beta}],_=["type","type"];e.length===3&&(w.push(...Y(e[2].dims)),_.push("rank")),w.push(...Y(l));let $=v=>{let b="";t.transA&&t.transB?b="value += a[k * uniforms.M + m] * b[n * uniforms.K + k];":t.transA&&!t.transB?b="value += a[k * uniforms.M + m] * b[k * uniforms.N + n];":!t.transA&&t.transB?b="value += a[m * uniforms.K + k] * b[n * uniforms.K + k];":!t.transA&&!t.transB&&(b="value += a[m * uniforms.K + k] * b[k * uniforms.N + n];");let k=t.alpha===1?"":"value *= uniforms.alpha;",T=M("a",e[0].dataType,e[0].dims),C=M("b",e[1].dataType,e[1].dims),E=T.type.value,z=null,N=[T,C];e.length===3&&(z=M("c",e[2].dataType,e[2].dims.length),N.push(z));let W=Z("output",e[0].dataType,l.length);N.push(W);let H=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}];return`
  ${v.registerUniforms(H).declareVariables(...N)}

  ${v.mainStart()}
    ${v.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let m = global_idx / uniforms.N;
    let n = global_idx % uniforms.N;

    var value = ${E}(0);
    for (var k: u32 = 0u; k < uniforms.K; k++) {
      ${b}
    }

    ${k}
    ${z!=null?`let cOffset = ${z.broadcastedIndicesToOffset("vec2(m, n)",W)}; value += ${E}(uniforms.beta) * ${z.getByOffset("cOffset")};`:""}
    output[global_idx] = value;
  }`},x=v=>{let b=M("a",e[0].dataType,e[0].dims),k=M("b",e[1].dataType,e[1].dims),T=null,C=[b,k];e.length===3&&(T=M("c",e[2].dataType,e[2].dims.length),C.push(T));let E=Z("output",e[0].dataType,l.length);C.push(E);let z=[{name:"num_tile_n",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}],N="",W="";t.transA&&t.transB?(W=`
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${b.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${k.type.value}(0);
      }
      `,N="value += tile_a[k][local_id.y] * tile_b[local_id.x][k];"):t.transA&&!t.transB?(W=`
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${b.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${k.type.value}(0);
      }
      `,N="value += tile_a[k][local_id.y] * tile_b[k][local_id.x];"):!t.transA&&t.transB?(W=`
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${b.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${k.type.value}(0);
      }
      `,N="value += tile_a[local_id.y][k] * tile_b[local_id.x][k];"):!t.transA&&!t.transB&&(W=`
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${b.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${k.type.value}(0);
      }
      `,N="value += tile_a[local_id.y][k] * tile_b[k][local_id.x];");let H=t.alpha===1?"":"value *= uniforms.alpha;";return`
  ${v.registerUniforms(z).declareVariables(...C)}
  var<workgroup> tile_a: array<array<${b.type.storage}, ${d}>, ${d}>;
  var<workgroup> tile_b: array<array<${k.type.storage}, ${d}>, ${d}>;
  ${v.mainStart([d,d,1])}
    let tile_col_start = (workgroup_index % uniforms.num_tile_n) * ${d};
    let tile_row_start = (workgroup_index / uniforms.num_tile_n) * ${d};
    let num_tiles = (uniforms.K - 1) / ${d} + 1;
    var k_start = 0u;
    var value = ${E.type.value}(0);
    for (var t: u32 = 0u; t < num_tiles; t++) {
      ${W}
      k_start = k_start + ${d};
      workgroupBarrier();

      for (var k: u32 = 0u; k < ${d}; k++) {
        ${N}
      }
      workgroupBarrier();
    }

    ${H}
    let m = tile_row_start + local_id.y;
    let n = tile_col_start + local_id.x;
    ${T!=null?`let cOffset = ${T.broadcastedIndicesToOffset("vec2(m, n)",E)}; value += ${E.type.value}(uniforms.beta) * ${T.getByOffset("cOffset")};`:""}
    if (m < uniforms.M && n < uniforms.N) {
      output[m * uniforms.N + n] = value;
    }
  }`};return m?{name:"GemmShared",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:_},getRunData:()=>({outputs:[{dims:l,dataType:e[0].dataType}],dispatchGroup:{x:p*f},programUniforms:w}),getShaderSource:x}:{name:"Gemm",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:_},getRunData:()=>({outputs:[{dims:l,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(g/64)},programUniforms:w}),getShaderSource:$}},Ch=e=>{let t=e.transA,i=e.transB,r=e.alpha,a=e.beta;return{transA:t,transB:i,alpha:r,beta:a,cacheKey:`${e.transA};${e.transB};${e.alpha===1}`}},Eh=(e,t)=>{$l(e.inputs),e.compute(vl(e.inputs,t))}}),et,nt,bt,$t,xl,Sl,kl,Tl,Il,Cl,El,zl,zh,Ah,r0=L(()=>{"use strict";ie(),le(),$e(),de(),[et,nt,bt,$t]=[0,1,2,3],xl=e=>{if(e[0].dims.length!==4)throw new Error("only 4-D tensor is supported.");if(e[0].dims.length!==e[1].dims.length)throw new Error("input dimensions must be equal to grid dimensions");if(e[0].dims.length-2!==e[1].dims[e[1].dims.length-1])throw new Error(`last dimension of grid must be equal to ${e[0].dims.length-2}`);if(e[0].dims[0]!==e[1].dims[0])throw new Error("grid batch size must match input batch size")},Sl=`
  fn gs_get_cubic_coeffs(x: f32) -> vec4<f32> {
    let cubic_alpha = -0.75f;
    let x_abs = abs(x);
    var coeffs: vec4<f32>;
    coeffs[0] = (((cubic_alpha * (x_abs + 1) - 5 * cubic_alpha) * (x_abs + 1) + 8 * cubic_alpha) * (x_abs + 1) - 4 * cubic_alpha);
    coeffs[1] = (((cubic_alpha + 2) * x_abs - (cubic_alpha + 3)) * x_abs * x_abs + 1);
    coeffs[2] = (((cubic_alpha + 2) * (1 - x_abs) - (cubic_alpha + 3)) * (1 - x_abs) * (1 - x_abs) + 1);
    coeffs[3] = (((cubic_alpha * (2 - x_abs) - 5 * cubic_alpha) * (2 - x_abs) + 8 * cubic_alpha) * (2 - x_abs) - 4 * cubic_alpha);
    return coeffs;
  }
`,kl=e=>`
  fn gs_bicubic_interpolate(p: mat4x4<${e}>, x: f32, y: f32) -> ${e} {
    var v: vec4<f32>;
    var coeffs = gs_get_cubic_coeffs(x);
    for (var i = 0; i < 4; i++) {
      v[i] = coeffs[0] * p[i][0] + coeffs[1] * p[i][1] + coeffs[2] * p[i][2] + coeffs[3] * p[i][3];
    }
    coeffs = gs_get_cubic_coeffs(y);
    let pixel = ${e}(coeffs[0] * v[0] + coeffs[1] * v[1] + coeffs[2] * v[2] + coeffs[3] * v[3]);
    return pixel;
  }
`,Tl=e=>`
  fn gs_denormalize(n: f32, length: i32) -> f32 {
    ${e.alignCorners===0?`
    // alignCorners: false => [-1, 1] to [-0.5, length - 0.5]
    return ((n + 1.0) * f32(length) - 1.0) / 2.0;
    `:`
    // alignCorners: true => [-1, 1] to [0, length - 1]
    return (n + 1.0) / 2.0 * (f32(length - 1));
    `}
  }
`,Il=e=>`
  ${e.paddingMode==="reflection"?`
      fn gs_reflect(x: i32, x_min: f32, x_max: f32) -> u32 {
        var dx = 0.0;
        var fx = f32(x);
        let range = x_max - x_min;
        if (fx < x_min) {
          dx = x_min - fx;
          let n = u32(dx / range);
          let r = dx - f32(n) * range;
          if (n % 2 == 0) {
            fx = x_min + r;
          } else {
            fx = x_max - r;
          }
        } else if (fx > x_max) {
          dx = fx - x_max;
          let n = u32(dx / range);
          let r = dx - f32(n) * range;
          if (n % 2 == 0) {
            fx = x_max - r;
          } else {
            fx = x_min + r;
          }
        }
        return u32(fx);
      }`:""}
`,Cl=(e,t,i)=>`
  fn pixel_at_grid(r: i32, c: i32, H: i32, W: i32, batch: u32, channel: u32, border: vec4<f32>) -> ${t} {
     var pixel = ${t}(0);
     var indices = vec4<u32>(0);
     indices[${et}] = batch;
     indices[${nt}] = channel;`+(()=>{switch(i.paddingMode){case"zeros":return`
          if (r >= 0 && r < H && c >=0 && c < W) {
            indices[${bt}] = u32(r);
            indices[${$t}] = u32(c);
          }
        `;case"border":return`
          indices[${bt}] = u32(clamp(r, 0, H - 1));
          indices[${$t}] = u32(clamp(c, 0, W - 1));
        `;case"reflection":return`
          indices[${bt}] = gs_reflect(r, border[1], border[3]);
          indices[${$t}] = gs_reflect(c, border[0], border[2]);
        `;default:throw new Error(`padding mode ${i.paddingMode} is not supported`)}})()+`
    return ${e.getByIndices("indices")};
  }
`,El=(e,t,i)=>(()=>{switch(i.mode){case"nearest":return`
          let result = pixel_at_grid(i32(round(y)), i32(round(x)), H_in, W_in, indices[${et}], indices[${nt}], border);
        `;case"bilinear":return`
          let x1 = i32(floor(x));
          let y1 = i32(floor(y));
          let x2 = x1 + 1;
          let y2 = y1 + 1;

          let p11 = pixel_at_grid(y1, x1, H_in, W_in, indices[${et}], indices[${nt}], border);
          let p12 = pixel_at_grid(y1, x2, H_in, W_in, indices[${et}], indices[${nt}], border);
          let p21 = pixel_at_grid(y2, x1, H_in, W_in, indices[${et}], indices[${nt}], border);
          let p22 = pixel_at_grid(y2, x2, H_in, W_in, indices[${et}], indices[${nt}], border);

          let dx2 = ${t}(f32(x2) - x);
          let dx1 = ${t}(x - f32(x1));
          let dy2 = ${t}(f32(y2) - y);
          let dy1 = ${t}(y - f32(y1));
          let result = dy2 * (dx2 * p11 + dx1 * p12) + dy1 * (dx2 * p21 + dx1 * p22);
        `;case"bicubic":return`
          let x0 = i32(floor(x)) - 1;
          let y0 = i32(floor(y)) - 1;
          var p: mat4x4<${t}>;
          for (var h = 0; h < 4; h++) {
            for (var w = 0; w < 4; w++) {
              p[h][w] = pixel_at_grid(h + y0, w + x0, H_in, W_in, indices[${et}], indices[${nt}], border);
            }
          }

          let dx = x - f32(x0 + 1);
          let dy = y - f32(y0 + 1);
          let result = gs_bicubic_interpolate(p, dx, dy);
        `;default:throw new Error(`mode ${i.mode} is not supported`)}})()+`${e.setByOffset("global_idx","result")}`,zl=(e,t)=>{let i=M("x",e[0].dataType,e[0].dims.length),r=[e[1].dims[0],e[1].dims[1],e[1].dims[2]],a=M("grid",e[1].dataType,r.length,2),o=[e[0].dims[0],e[0].dims[1],e[1].dims[1],e[1].dims[2]];t.format==="NHWC"&&(o=[e[0].dims[0],e[1].dims[1],e[1].dims[2],e[0].dims[3]],[et,nt,bt,$t]=[0,3,1,2]);let s=Z("output",e[0].dataType,o.length),l=i.type.value,d=O.size(o),p=[{type:12,data:d},...Y(e[0].dims,r,o)],f=m=>`
  ${m.registerUniform("output_size","u32").declareVariables(i,a,s)}
  ${Sl}
  ${kl(l)}
  ${Tl(t)}
  ${Il(t)}
  ${Cl(i,l,t)}

  ${m.mainStart()}
    ${m.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let H_in = i32(uniforms.x_shape[${bt}]);
      let W_in = i32(uniforms.x_shape[${$t}]);

      ${t.alignCorners===0?`
      let x_min = -0.5;
      let x_max = f32(W_in) - 0.5;
      let y_min = -0.5;
      let y_max = f32(H_in) - 0.5;
      `:`
      let x_min = 0.0;
      let x_max = f32(W_in) - 1.0;
      let y_min = 0.0;
      let y_max = f32(H_in) - 1.0;
      `};
      let border = vec4<f32>(x_min, y_min, x_max, y_max);

      let indices = ${s.offsetToIndices("global_idx")};
      var grid_indices = vec3<u32>(indices[${et}], indices[${bt}], indices[${$t}]);
      let nxy = ${a.getByIndices("grid_indices")};
      var x = gs_denormalize(f32(nxy[0]), W_in);
      var y = gs_denormalize(f32(nxy[1]), H_in);

      ${El(s,l,t)}
  }`;return{name:"GridSample",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:["type","type"]},getRunData:m=>{let g=O.size(o);return{outputs:[{dims:o,dataType:m[0].dataType}],dispatchGroup:{x:Math.ceil(g/64)},programUniforms:p}},getShaderSource:f}},zh=(e,t)=>{xl(e.inputs),e.compute(zl(e.inputs,t))},Ah=e=>ge({alignCorners:e.align_corners,mode:e.mode,paddingMode:e.padding_mode,format:e.format})}),Ae,Al,Oh,Xi,Ol,ur,Rh,Bh=L(()=>{"use strict";ie(),le(),$e(),Ha(),Qa(),de(),gt(),Ae=(e,t)=>e.length>t&&e[t].dims.length>0?e[t]:void 0,Al=(e,t)=>{let i=e[0],r=Ae(e,1),a=Ae(e,2),o=Ae(e,3),s=Ae(e,4),l=Ae(e,5),d=Ae(e,6),p=Ae(e,7);if(i.dims.length!==3&&i.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let f=i.dims[0],m=i.dims[1],g=i.dims.length===3?i.dims[2]:t.numHeads*i.dims[4],w=m,_=0,$=0,x=Math.floor(g/t.numHeads);if(d&&p&&O.size(d.dims)&&O.size(p.dims)){if(d.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(d.dims[0]!==f||d.dims[1]!==t.numHeads||d.dims[3]!==x)throw new Error('Input "past_key" shape (batch_size, num_heads, past_sequence_length, head_size)');if(p.dims[0]!==f||p.dims[1]!==t.numHeads||p.dims[3]!==x)throw new Error('Input "past_value" shape (batch_size, num_heads, past_sequence_length, head_size)');if(d.dims[2]!==p.dims[2])throw new Error('Input "past_key" and "past_value" shall have same dim 2 (past_sequence_length)');if(p.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');_=d.dims[2],$=d.dims[2]}else if(d&&O.size(d.dims)||p&&O.size(p.dims))throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let v;if(r&&O.size(r.dims)>0){if(i.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(r.dims.length<3||r.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(i.dims[0]!==r.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(r.dims.length===3){if(r.dims[2]!==i.dims[2])throw new Error('Input "query" and "key" shall have same dim 2 (hidden_size)');v=2,w=r.dims[1]}else if(r.dims.length===5){if(r.dims[2]!==t.numHeads||r.dims[3]!==2||r.dims[4]!==x)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(a)throw new Error('Expect "value" be none when "key" has packed kv format.');v=5,w=r.dims[1]}else{if(r.dims[1]!==t.numHeads||r.dims[3]!==x)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');v=0,w=r.dims[2]}}else{if(i.dims.length!==5)throw new Error('Input "query" is expected to have 5 dimensions when key is empty');if(i.dims[2]!==t.numHeads||i.dims[3]!==3)throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');v=3}if(o&&O.size(o.dims)>0){if(o.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimension');if(r&&r.dims.length===5&&r.dims[3]===2)throw new Error("bias is not allowed for packed kv.")}let b=_+w,k=0;if(s&&O.size(s.dims)>0){k=8;let z=s.dims;throw z.length===1?z[0]===f?k=1:z[0]===3*f+2&&(k=3):z.length===2&&z[0]===f&&z[1]===b&&(k=5),k===8?new Error('Input "key_padding_mask" shape shall be (batch_size) or (batch_size, total_sequence_length)'):new Error("Mask not supported")}let T=!1,C=g;if(a&&O.size(a.dims)>0){if(a.dims.length!==3&&a.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(i.dims[0]!==a.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(a.dims.length===3){if(w!==a.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');C=a.dims[2]}else{if(w!==a.dims[2])throw new Error('Input "key" and "value" shall have the same dim 2 (kv_sequence_length)');C=a.dims[1]*a.dims[3],T=!0}}let E=!1;if(s&&O.size(s.dims)>0)throw new Error("Key padding mask is not supported");if(l&&O.size(l.dims)>0){if(l.dims.length!==4)throw new Error('Input "attention_bias" is expected to have 4 dimensions');if(l.dims[0]!==f||l.dims[1]!==t.numHeads||l.dims[2]!==m||l.dims[3]!==b)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:f,sequenceLength:m,pastSequenceLength:_,kvSequenceLength:w,totalSequenceLength:b,maxSequenceLength:$,inputHiddenSize:0,hiddenSize:g,vHiddenSize:C,headSize:x,vHeadSize:Math.floor(C/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:k,scale:t.scale,broadcastResPosBias:E,passPastInKv:T,qkvFormat:v}},Oh=e=>ge({...e}),Xi=ge({perm:[0,2,1,3]}),Ol=(e,t,i,r,a,o,s)=>{let l=[r,a,o],d=O.size(l),p=[{type:12,data:d},{type:12,data:s},{type:12,data:o}],f=m=>{let g=Z("qkv_with_bias",t.dataType,l),w=M("qkv",t.dataType,l),_=M("bias",i.dataType,l),$=[{name:"output_size",type:"u32"},{name:"bias_offset",type:"u32"},{name:"hidden_size",type:"u32"}];return`
  ${m.registerUniforms($).declareVariables(w,_,g)}
  ${m.mainStart()}
    ${m.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let bias_offset_idx = (global_idx % uniforms.hidden_size) + uniforms.bias_offset;

    qkv_with_bias[global_idx] = qkv[global_idx] + bias[bias_offset_idx];
  }`};return e.compute({name:"MultiHeadAttentionAddBias",shaderCache:{inputDependencies:["type","type"]},getRunData:()=>({outputs:[{dims:l,dataType:t.dataType,gpuDataType:0}],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:p}),getShaderSource:f},{inputs:[t,i],outputs:[-1]})[0]},ur=(e,t,i,r,a,o,s,l)=>{let d=o;if(s&&O.size(s.dims)>0){if(r===1)throw new Error("AddBiasReshape is not implemented. Please export your model with packed QKV or KV");return d=Ol(e,o,s,t,r,i*a,l),d=d.reshape([t,r,i,a]),i===1||r===1?d:e.compute(De(d,Xi.perm),{inputs:[d],outputs:[-1]})[0]}else return o.dims.length===3&&(d=o.reshape([t,r,i,a])),i===1||r===1?d:e.compute(De(d,Xi.perm),{inputs:[d],outputs:[-1]})[0]},Rh=(e,t)=>{let i=Al(e.inputs,t),r=e.inputs[0],a=Ae(e.inputs,1),o=Ae(e.inputs,2),s=Ae(e.inputs,3),l=Ae(e.inputs,4),d=Ae(e.inputs,5),p=Ae(e.inputs,6),f=Ae(e.inputs,7);if(r.dims.length===5)throw new Error("Packed QKV is not implemented");if(a?.dims.length===5)throw new Error("Packed KV is not implemented");let m=a&&o&&a.dims.length===4&&o.dims.length===4,g=ur(e,i.batchSize,i.numHeads,i.sequenceLength,i.headSize,r,s,0);if(m)return pr(e,g,a,o,l,void 0,p,f,d,i);if(!a||!o)throw new Error("key and value must be provided");let w=ur(e,i.batchSize,i.numHeads,i.kvSequenceLength,i.headSize,a,s,i.hiddenSize),_=ur(e,i.batchSize,i.numHeads,i.kvSequenceLength,i.vHeadSize,o,s,2*i.hiddenSize);pr(e,g,w,_,l,void 0,p,f,d,i)}}),Rl,Bl,Ml,Nl,za,Mh,Nh,Dh=L(()=>{"use strict";ie(),le(),$e(),de(),Rl=e=>{if(!e||e.length<1)throw new Error("too few inputs")},Bl=(e,t)=>{let i=[],r=t.numOutputs;return e[1].dims[0]>0&&(e[1].getBigInt64Array().forEach(a=>i.push(Number(a))),r=i.length),ge({numOutputs:r,axis:t.axis,splitSizes:i})},Ml=e=>`
fn calculateOutputIndex(index: u32) -> u32 {
    for (var i: u32 = 0u; i < ${e}u; i += 1u ) {
    if (index < ${X("uniforms.size_in_split_axis","i",e)}) {
        return i;
    }
    }
    return ${e}u;
}`,Nl=e=>{let t=e.length,i=[];for(let r=0;r<t;++r){let a=e[r].setByIndices("indices","input[global_idx]");t===1?i.push(a):r===0?i.push(`if (output_number == ${r}u) { ${a} }`):r===t-1?i.push(`else { ${a} }`):i.push(`else if (output_number == ${r}) { ${a} }`)}return`
      fn writeBufferData(output_number: u32, indices: ${e[0].type.indices}, global_idx: u32) {
        ${i.join(`
`)}
      }`},za=(e,t)=>{let i=e[0].dims,r=O.size(i),a=e[0].dataType,o=O.normalizeAxis(t.axis,i.length),s=new Array(t.numOutputs),l=M("input",a,i.length),d=new Array(t.numOutputs),p=[],f=[],m=0,g=[{type:12,data:r}];for(let _=0;_<t.numOutputs;_++){m+=t.splitSizes[_],d[_]=m;let $=i.slice();$[o]=t.splitSizes[_],f.push($),s[_]=Z(`output${_}`,a,$.length),p.push({dims:f[_],dataType:e[0].dataType})}g.push({type:12,data:d},...Y(i,...f));let w=_=>`
  ${_.registerUniform("input_size","u32").registerUniform("size_in_split_axis","u32",d.length).declareVariables(l,...s)}
  ${Ml(d.length)}
  ${Nl(s)}

  ${_.mainStart()}
    ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.input_size")}

    var indices = ${l.offsetToIndices("global_idx")};
    var index = ${l.indicesGet("indices",o)};
    let output_number = calculateOutputIndex(index);
    if (output_number != 0) {
      index -= ${X("uniforms.size_in_split_axis","output_number - 1u",d.length)};
      ${l.indicesSet("indices",o,"index")};
    }
    writeBufferData(output_number, indices, global_idx);
  }`;return{name:"Split",shaderCache:{hint:t.cacheKey,inputDependencies:["rank"]},getShaderSource:w,getRunData:()=>({outputs:p,dispatchGroup:{x:Math.ceil(r/64)},programUniforms:g})}},Mh=(e,t)=>{Rl(e.inputs);let i=e.inputs.length===1?t:Bl(e.inputs,t);e.compute(za(e.inputs,i),{inputs:[0]})},Nh=e=>{let t=e.axis,i=e.splitSizes,r=e.numOutputs<0?i.length:e.numOutputs;if(r!==i.length)throw new Error("numOutputs and splitSizes lengh must be equal");return ge({axis:t,numOutputs:r,splitSizes:i})}}),Dl,Pl,Yi,Ph,i0=L(()=>{"use strict";$e(),Qa(),Bh(),Dh(),gt(),Dl=(e,t)=>{if(t.doRotary)throw new Error("GroupQuerryAttention do_rotary attribute is not supported");if(t.doRotary&&e.length<=7)throw new Error("cos_cache and sin_cache inputs are required if do_rotary is specified");let i=e[0],r=e[1],a=e[2],o=e[3],s=e[4];if(t.localWindowSize!==-1)throw new Error("Local attention is not supported");if(t.softcap!==0)throw new Error("Softcap is not supported");if(t.rotaryInterleaved!==0)throw new Error("Rotary interleaved is not supported");if(t.smoothSoftmax)throw new Error("Smooth softmax is not supported");if(i.dims.length!==3&&i.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let l=!1,d=i.dims[0],p=i.dims[1],f=i.dims.length===3?l?i.dims[2]/3:i.dims[2]:t.numHeads*i.dims[4],m=p,g=0,w=!r||r.dims.length===0,_=Math.floor(w?f/(t.numHeads+2*t.kvNumHeads):f/t.numHeads);w&&(f=_*t.numHeads);let $=o&&o.dims.length!==0,x=s&&s.dims.length!==0;if($&&o.dims.length===4&&o.dims[0]===d&&o.dims[1]!==t.kvNumHeads&&o.dims[2]===t.kvNumHeads&&o.dims[3]===_)throw new Error("BSNH pastKey/pastValue is not supported");if($&&x){if(o.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(s.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');g=o.dims[2]}else if($||x)throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let v=1;if(r&&r.dims.length>0){if(i.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(r.dims.length<3||r.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(i.dims[0]!==r.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(r.dims.length===3){if(i.dims[2]%r.dims[2]!==0)throw new Error('Dimension 2 of "query" should be a multiple of "key"');m=r.dims[1]}else if(r.dims.length===5){if(r.dims[2]!==t.numHeads||r.dims[3]!==2||r.dims[4]!==_)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(a)throw new Error('Expect "value" be none when "key" has packed kv format.');m=r.dims[1]}else{if(r.dims[1]!==t.numHeads||r.dims[3]!==_)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');m=r.dims[2]}}else{if(i.dims.length!==3&&i.dims.length!==5)throw new Error('Input "query" is expected to have 3 or 5 dimensions when key is empty');if(i.dims.length===5&&(i.dims[2]!==t.numHeads||i.dims[3]!==3))throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');v=3}let b=0,k=!1,T=t.kvNumHeads?_*t.kvNumHeads:f;if(a&&a.dims.length>0){if(a.dims.length!==3&&a.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(i.dims[0]!==a.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(a.dims.length===3){if(m!==a.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');T=a.dims[2]}else{if(m!==a.dims[2])throw new Error('Input "past_key" and "past_value" shall have the same dim 2 (kv_sequence_length)');T=a.dims[1]*a.dims[3],k=!0}}let C=e.length>4?e[5]:void 0;if(C&&C.dims.length!==1&&C.dims[0]!==d)throw new Error('Input "seqlens" is expected to have 1 dimension and the same dim 0 as batch_size');return{batchSize:d,sequenceLength:p,pastSequenceLength:g,kvSequenceLength:m,totalSequenceLength:-1,maxSequenceLength:-1,inputHiddenSize:0,hiddenSize:f,vHiddenSize:T,headSize:_,vHeadSize:Math.floor(T/t.kvNumHeads),numHeads:t.numHeads,kvNumHeads:t.kvNumHeads,nReps:t.numHeads/t.kvNumHeads,pastPresentShareBuffer:!1,maskType:b,scale:t.scale,broadcastResPosBias:!1,passPastInKv:k,qkvFormat:v}},Pl=ge({perm:[0,2,1,3]}),Yi=(e,t,i)=>{let r=t,a=i.kvNumHeads;return t.dims.length===3&&i.kvSequenceLength!==0&&(r=t.reshape([i.batchSize,i.kvSequenceLength,a,i.headSize]),r=e.compute(De(r,Pl.perm),{inputs:[r],outputs:[-1]})[0]),r},Ph=(e,t)=>{let i=Dl(e.inputs,t);if(e.inputs[0].dims.length===5)throw new Error("Packed QKV is not implemented");if(e.inputs[1]?.dims.length===5)throw new Error("Packed KV is not implemented");let r=e.inputs[0],a=e.inputs[1]&&e.inputs[1].dims.length>0?e.inputs[1]:void 0,o=e.inputs[2]&&e.inputs[2].dims.length>0?e.inputs[2]:void 0,s=e.inputs[3]&&e.inputs[3].dims.length!==0?e.inputs[3]:void 0,l=e.inputs[4]&&e.inputs[4].dims.length!==0?e.inputs[4]:void 0,d=e.inputs.length>4?e.inputs[5]:void 0,p=e.inputs.length>5?e.inputs[6]:void 0,f=i.kvNumHeads?i.kvNumHeads:i.numHeads,m=ge({axis:2,numOutputs:3,splitSizes:[i.numHeads*i.headSize,f*i.headSize,f*i.headSize]}),[g,w,_]=!a&&!o?e.compute(za([r],m),{inputs:[r],outputs:[-1,-1,-1]}):[r,a,o],$=ur(e,i.batchSize,i.numHeads,i.sequenceLength,i.headSize,g,void 0,0);pr(e,$,Yi(e,w,i),Yi(e,_,i),void 0,void 0,s,l,void 0,i,d,p)}}),Ji,Ul,Wl,Uh,a0=L(()=>{"use strict";ie(),le(),gt(),de(),Ji=(e,t,i,r,a,o,s,l)=>{let d=be(o),p=d===1?"f32":`vec${d}f`,f=d===1?"vec2f":`mat2x${d}f`,m=a*s,g=64;m===1&&(g=256);let w=[a,s,o/d],_=[a,s,2],$=["rank","type","type"],x=[];x.push(...Y(w,_));let v=b=>{let k=M("x",t.dataType,3,d),T=M("scale",i.dataType,i.dims),C=M("bias",r.dataType,r.dims),E=Z("output",1,3,2),z=[k,T,C,E];return`
  var<workgroup> workgroup_shared : array<${f}, ${g}>;
  const workgroup_size = ${g}u;
  ${b.declareVariables(...z)}
  ${b.mainStart(g)}
    let batch = workgroup_index / uniforms.x_shape[1];
    let channel = workgroup_index % uniforms.x_shape[1];
    let hight = uniforms.x_shape[2];
    // initialize workgroup memory
    var sum = ${p}(0);
    var squared_sum = ${p}(0);
    for (var h = local_idx; h < hight; h += workgroup_size) {
      let value = ${p}(${k.get("batch","channel","h")});
      sum += value;
      squared_sum += value * value;
    }
    workgroup_shared[local_idx] = ${f}(sum, squared_sum);
    workgroupBarrier();

    for (var currSize = workgroup_size >> 1;  currSize > 0; currSize = currSize >> 1) {
      if (local_idx < currSize) {
        workgroup_shared[local_idx] = workgroup_shared[local_idx] + workgroup_shared[local_idx + currSize];
      }
      workgroupBarrier();
    }
    if (local_idx == 0) {
      let sum_final = ${mt("workgroup_shared[0][0]",d)} / f32(hight * ${d});
      let squared_sum_final = ${mt("workgroup_shared[0][1]",d)} / f32(hight * ${d});

      let inv_std_dev = inverseSqrt(squared_sum_final - sum_final * sum_final + f32(${l}));
      let channel_scale = inv_std_dev * f32(scale[channel]);
      let channel_shift = f32(bias[channel]) - sum_final * channel_scale;
      output[workgroup_index] = vec2f(channel_scale, channel_shift);
    }
  }`};return e.compute({name:"InstanceNormComputeChannelScaleShift",shaderCache:{hint:`${d};${l};${g}`,inputDependencies:$},getRunData:()=>({outputs:[{dims:_,dataType:1}],dispatchGroup:{x:m},programUniforms:x}),getShaderSource:v},{inputs:[t,i,r],outputs:[-1]})[0]},Ul=(e,t,i)=>{let r=t[0].dims,a=r,o=2,s=r[0],l=r[1],d=O.sizeFromDimension(r,o),p=be(d),f=O.size(a)/p,m=Ji(e,t[0],t[1],t[2],s,d,l,i.epsilon),g=[s,l,d/p],w=[s,l],_=["type","none"],$=x=>{let v=M("x",t[0].dataType,g.length,p),b=M("scale_shift",1,w.length,2),k=Z("output",t[0].dataType,g.length,p),T=[v,b,k];return`
  ${x.registerUniform("output_size","u32").declareVariables(...T)}
  ${x.mainStart()}
  ${x.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let outputIndices = ${k.offsetToIndices("global_idx")};
      let batch = outputIndices[0];
      let channel = outputIndices[1];
      let scale_shift = ${b.getByIndices("vec2<u32>(batch, channel)")};
      let value = ${v.getByOffset("global_idx")} * ${k.type.value}(scale_shift.x) + ${k.type.value}(scale_shift.y);
      ${k.setByOffset("global_idx","value")};
  }`};e.compute({name:"InstanceNormalization",shaderCache:{hint:`${p}`,inputDependencies:_},getRunData:()=>({outputs:[{dims:a,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(f/64)},programUniforms:[{type:12,data:f},...Y(g,w,g)]}),getShaderSource:$},{inputs:[t[0],m]})},Wl=(e,t,i)=>{let r=t[0].dims,a=r,o=r[0],s=r[r.length-1],l=O.sizeFromDimension(r,1)/s,d=be(s),p=O.size(a)/d,f=[{type:12,data:l},{type:12,data:Math.floor(s/d)}],m=["type","type"],g=!1,w=[0,r.length-1];for(let v=0;v<r.length-2;v++)g=g||r[v+1]!==1,w.push(v+1);g=g&&r[r.length-1]!==1;let _=g?e.compute(De(e.inputs[0],w),{inputs:[e.inputs[0]],outputs:[-1]})[0]:e.inputs[0].reshape(Array.from({length:r.length},(v,b)=>r[w[b]])),$=Ji(e,_,t[1],t[2],o,l,s,i.epsilon),x=v=>{let b=Te(t[0].dataType),k=d===1?"vec2f":`mat${d}x2f`,T=z=>{let N=z===0?"x":"y",W=d===1?"f32":`vec${d}f`;switch(d){case 1:return`${b}(${W}(scale.${N}))`;case 2:return`vec2<${b}>(${W}(scale[0].${N}, scale[1].${N}))`;case 4:return`vec4<${b}>(${W}(scale[0].${N}, scale[1].${N}, scale[2].${N}, scale[3].${N}))`;default:throw new Error(`Not supported compoents ${d}`)}},C=M("input",t[0].dataType,t[0].dims,d),E=Z("output",t[0].dataType,a,d);return`
  @group(0) @binding(0) var<storage, read> input : array<${C.type.storage}>;
  @group(0) @binding(1) var<storage, read> scale_input : array<${k}>;
  @group(0) @binding(2) var<storage, read_write> output : array<${E.type.storage}>;
  struct Uniforms {H: u32, C : u32};
  @group(0) @binding(3) var<uniform> uniforms: Uniforms;

  ${v.mainStart()}
    let current_image_number = global_idx / (uniforms.C * uniforms.H);
    let current_channel_number = global_idx % uniforms.C;

    let scale_offset = current_image_number * uniforms.C + current_channel_number;
    let scale = scale_input[scale_offset];
    output[global_idx] = fma(input[global_idx], ${T(0)}, ${T(1)});
  }`};e.compute({name:"InstanceNormalizationNHWC",shaderCache:{hint:`${d}`,inputDependencies:m},getRunData:()=>({outputs:[{dims:a,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(p/64)},programUniforms:f}),getShaderSource:x},{inputs:[t[0],$]})},Uh=(e,t)=>{t.format==="NHWC"?Wl(e,e.inputs,t):Ul(e,e.inputs,t)}}),ql,Ll,Wh,n0=L(()=>{"use strict";ie(),le(),de(),ql=e=>{if(!e||e.length<2)throw new Error("layerNorm requires at least 2 inputs.")},Ll=(e,t,i)=>{let r=t.simplified,a=e[0].dims,o=e[1],s=!r&&e[2],l=a,d=O.normalizeAxis(t.axis,a.length),p=O.sizeToDimension(a,d),f=O.sizeFromDimension(a,d),m=O.size(o.dims),g=s?O.size(s.dims):0;if(m!==f||s&&g!==f)throw new Error(`Size of X.shape()[axis:] == ${f}.
       Size of scale and bias (if provided) must match this.
       Got scale size of ${m} and bias size of ${g}`);let w=[];for(let C=0;C<a.length;++C)C<d?w.push(a[C]):w.push(1);let _=be(f),$=["type","type"],x=[{type:12,data:p},{type:1,data:f},{type:12,data:Math.floor(f/_)},{type:1,data:t.epsilon}];s&&$.push("type");let v=i>1,b=i>2,k=C=>{let E=Te(e[0].dataType),z=[M("x",e[0].dataType,e[0].dims,_),M("scale",o.dataType,o.dims,_)];s&&z.push(M("bias",s.dataType,s.dims,_)),z.push(Z("output",e[0].dataType,l,_)),v&&z.push(Z("mean_data_output",1,w)),b&&z.push(Z("inv_std_output",1,w));let N=[{name:"norm_count",type:"u32"},{name:"norm_size",type:"f32"},{name:"norm_size_vectorized",type:"u32"},{name:"epsilon",type:"f32"}];return`
  ${C.registerUniforms(N).declareVariables(...z)}
  ${C.mainStart()}
    ${C.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.norm_count")}
    let offset = global_idx * uniforms.norm_size_vectorized;
    var mean_vector = ${$a("f32",_)};
    var mean_square_vector = ${$a("f32",_)};

    for (var h: u32 = 0u; h < uniforms.norm_size_vectorized; h++) {
      let value = ${Ut(E,_,"x[h + offset]")};
      mean_vector += value;
      mean_square_vector += value * value;
    }
    let mean = ${mt("mean_vector",_)} / uniforms.norm_size;
    let inv_std_dev = inverseSqrt(${mt("mean_square_vector",_)} / uniforms.norm_size ${r?"":"- mean * mean"} + uniforms.epsilon);

    for (var j: u32 = 0; j < uniforms.norm_size_vectorized; j++) {
      let f32input = ${Ut(E,_,"x[j + offset]")};
      let f32scale = ${Ut(E,_,"scale[j]")};
      output[j + offset] = ${z[0].type.value}((f32input ${r?"":"- mean"}) * inv_std_dev * f32scale
        ${s?`+ ${Ut(E,_,"bias[j]")}`:""}
      );
    }

    ${v?"mean_data_output[global_idx] = mean":""};
    ${b?"inv_std_output[global_idx] = inv_std_dev":""};
  }`},T=[{dims:l,dataType:e[0].dataType}];return v&&T.push({dims:w,dataType:1}),b&&T.push({dims:w,dataType:1}),{name:"LayerNormalization",shaderCache:{hint:`${_};${i};${r}`,inputDependencies:$},getRunData:()=>({outputs:T,dispatchGroup:{x:Math.ceil(p/64)},programUniforms:x}),getShaderSource:k}},Wh=(e,t)=>{ql(e.inputs),e.compute(Ll(e.inputs,t,e.outputCount))}}),Vl,qh,s0=L(()=>{"use strict";le(),en(),tn(),Vl=e=>{if(!e||e.length!==2)throw new Error("MatMul requires 2 inputs.");if(e[0].dims[e[0].dims.length-1]!==e[1].dims[e[1].dims.length-2])throw new Error("shared dimension does not match.")},qh=e=>{Vl(e.inputs);let t=Wt.calcShape(e.inputs[0].dims,e.inputs[1].dims,!0);if(!t)throw new Error("Can't use matmul on the given tensors");let i=t[t.length-1],r=e.inputs[0].dims[e.inputs[0].dims.length-1];if(i<8&&r<8)e.compute(Ja(e.inputs,{activation:""},t));else{let a=t[t.length-2],o=O.size(e.inputs[0].dims.slice(0,-2)),s=O.size(e.inputs[1].dims.slice(0,-2));if(o!==1&&a===1&&s===1){let l=e.inputs[0].reshape([1,o,r]),d=e.inputs[1].reshape([1,r,i]),p=[1,o,i],f=[l,d];e.compute(Hr(f,{activation:""},t,p),{inputs:f})}else e.compute(Hr(e.inputs,{activation:""},t))}}}),Fl,Gl,Hl,Lh,Vh,o0=L(()=>{"use strict";ie(),le(),$e(),de(),Fl=(e,t)=>{if(e.length<3||e.length>4)throw new Error("MatMulNBits requires 3 or 4 inputs");let i=e[0],r=i.dims.length;if(i.dims[r-1]!==t.k)throw new Error("The last dim of input shape does not match the k value");let a=Math.floor((t.k+t.blockSize-1)/t.blockSize),o=t.blockSize/8*t.bits,s=e[1];if(!O.areEqual(s.dims,[t.n,a,o]))throw new Error("The second inputs must be 3D tensor with shape N X nBlocksPerCol X blobSize");let l=e[2].dims;if(O.size(l)!==t.n*a)throw new Error("scales input size error.");if(e.length===4){let d=e[3].dims,p=t.bits>4?t.n*a:t.n*Math.floor((a+1)/2);if(O.size(d)!==p)throw new Error("zeroPoints input size error.")}},Gl=(e,t)=>{let i=e[0].dims,r=i.length,a=i[r-2],o=t.k,s=t.n,l=i.slice(0,r-2),d=O.size(l),p=e[1].dims[2]/4,f=e[0].dataType,m=be(t.k),g=be(p),w=be(s),_=l.concat([a,s]),$=a>1&&s/w%2===0?2:1,x=O.size(_)/w/$,v=64,b=[],k=[d,a,o/m],T=O.convertShape(e[1].dims).slice();T.splice(-1,1,p/g),b.push(...Y(k)),b.push(...Y(T)),b.push(...Y(e[2].dims)),e.length===4&&b.push(...Y(O.convertShape(e[3].dims)));let C=[d,a,s/w];b.push(...Y(C));let E=z=>{let N=k.length,W=M("a",e[0].dataType,N,m),H=M("b",12,T.length,g),V=M("scales",e[2].dataType,e[2].dims.length),G=[W,H,V],D=e.length===4?M("zero_points",12,e[3].dims.length):void 0;D&&G.push(D);let re=C.length,te=Z("output",e[0].dataType,re,w),j=Te(e[0].dataType),se=(()=>{switch(m){case 1:return`array<${j}, 8>`;case 2:return`mat4x2<${j}>`;case 4:return`mat2x4<${j}>`;default:throw new Error(`${m}-component is not supported.`)}})(),pe=()=>{let U=`
          // reuse a data
            var input_offset = ${W.indicesToOffset(`${W.type.indices}(batch, row, word_offset)`)};
            var a_data: ${se};
            for (var j: u32 = 0; j < ${8/m}; j++) {
              a_data[j] = ${W.getByOffset("input_offset")};
              input_offset++;
            }
          `;for(let K=0;K<w*$;K++)U+=`
            b_value = ${g===1?`b${K}_data`:`b${K}_data[i]`};
            b_value_lower = unpack4xU8(b_value & b_mask);
            b_value_upper = unpack4xU8((b_value >> 4) & b_mask);
            b_quantized_values = ${se}(${Array.from({length:4},(B,ee)=>`${j}(b_value_lower[${ee}]), ${j}(b_value_upper[${ee}])`).join(", ")});
            b_dequantized_values = ${m===1?`${se}(${Array.from({length:8},(B,ee)=>`(b_quantized_values[${ee}] - ${D?`zero_point${K}`:"zero_point"}) * scale${K}`).join(", ")});`:`(b_quantized_values - ${se}(${Array(8).fill(`${D?`zero_point${K}`:"zero_point"}`).join(",")})) * scale${K};`};
            workgroup_shared[local_id.x * ${$} + ${Math.floor(K/w)}]${w>1?`[${K%w}]`:""} += ${Array.from({length:8/m},(B,ee)=>`${m===1?`a_data[${ee}] * b_dequantized_values[${ee}]`:`dot(a_data[${ee}], b_dequantized_values[${ee}])`}`).join(" + ")};
          `;return U},F=()=>{let U=`
            var col_index = col * ${w};
            ${D?`
            let zero_point_bytes_per_col = (nBlocksPerCol + 1) / 2;
            var zero_point_byte_count: u32;
            var zero_point_word_index: u32;
            var zero_point_byte_offset: u32;
            let zero_point_nibble_offset: u32 = block & 0x1u;
            var zero_point_bits_offset: u32;
            var zero_point_word: u32;`:`
            // The default zero point is 8 for unsigned 4-bit quantization.
            let zero_point = ${j}(8);`}
            `;for(let K=0;K<w*$;K++)U+=`
            let scale${K} = ${V.getByOffset("col_index * nBlocksPerCol + block")};
            ${D?`
            zero_point_byte_count = col_index * zero_point_bytes_per_col + (block >> 0x1u);
            zero_point_word_index = zero_point_byte_count >> 0x2u;
            zero_point_byte_offset = zero_point_byte_count & 0x3u;
            zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_nibble_offset << 2);
            zero_point_word = ${D.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point${K} = ${j}((zero_point_word) & 0xFu);`:""}
            col_index += 1;`;return U},ce=()=>{let U=`col_index = col * ${w};`;for(let K=0;K<w*$;K++)U+=`
            let b${K}_data = ${H.getByIndices(`${H.type.indices}(col_index, block, word)`)};
            col_index += 1;`;return U+=`
            var b_value: u32;
            let b_mask: u32 = 0x0F0F0F0Fu;
            var b_value_lower: vec4<u32>;
            var b_value_upper: vec4<u32>;
            var b_quantized_values: ${se};
            var b_dequantized_values: ${se};`,U};return`
        var<workgroup> workgroup_shared: array<${te.type.value}, ${$*v}>;
        ${z.declareVariables(...G,te)}
        ${z.mainStart([v,1,1])}
          let output_indices = ${te.offsetToIndices(`(global_idx / ${v}) * ${$}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let nBlocksPerCol = uniforms.b_shape[1];

          for (var block = local_id.x; block < nBlocksPerCol; block += ${v}) {
            //process one block
            var word_offset: u32 = block * ${t.blockSize/m};
            ${F()}
            for (var word: u32 = 0; word < ${p}; word += ${g}) {
              ${ce()}
              for (var i: u32 = 0; i < ${g}; i++) {
                ${pe()}
                word_offset += ${8/m};
              }
            }
          }
          workgroupBarrier();

          if (local_id.x < ${$}) {
            var output_value: ${te.type.value} = ${te.type.value}(0);
            var workgroup_shared_offset: u32 = local_id.x;
            for (var b: u32 = 0u; b < ${v}u; b++) {
              output_value += workgroup_shared[workgroup_shared_offset];
              workgroup_shared_offset += ${$};
            }
            ${te.setByIndices(`${te.type.indices}(batch, row, col + local_id.x)`,"output_value")};
          }
        }`};return{name:"MatMulNBits",shaderCache:{hint:`${t.blockSize};${t.bits};${m};${g};${w};${$};${v}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:_,dataType:f}],dispatchGroup:{x},programUniforms:b}),getShaderSource:E}},Hl=(e,t)=>{let i=e[0].dims,r=i.length,a=i[r-2],o=t.k,s=t.n,l=i.slice(0,r-2),d=O.size(l),p=e[1].dims[2]/4,f=e[0].dataType,m=be(t.k),g=be(p),w=l.concat([a,s]),_=128,$=s%8===0?8:s%4===0?4:1,x=_/$,v=x*g*8,b=v/m,k=v/t.blockSize,T=O.size(w)/$,C=[],E=[d,a,o/m],z=O.convertShape(e[1].dims).slice();z.splice(-1,1,p/g),C.push(...Y(E)),C.push(...Y(z)),C.push(...Y(e[2].dims)),e.length===4&&C.push(...Y(O.convertShape(e[3].dims)));let N=[d,a,s];C.push(...Y(N));let W=H=>{let V=E.length,G=M("a",e[0].dataType,V,m),D=M("b",12,z.length,g),re=M("scales",e[2].dataType,e[2].dims.length),te=[G,D,re],j=e.length===4?M("zero_points",12,e[3].dims.length):void 0;j&&te.push(j);let se=N.length,pe=Z("output",e[0].dataType,se),F=Te(e[0].dataType),ce=()=>{switch(m){case 1:return`
          let a_data0 = vec4<${F}>(sub_a[word_offset], sub_a[word_offset + 1], sub_a[word_offset + 2], sub_a[word_offset + 3]);
          let a_data1 = vec4<${F}>(sub_a[word_offset + 4], sub_a[word_offset + 5], sub_a[word_offset + 6], sub_a[word_offset + 7]);`;case 2:return`
          let a_data0 = vec4<${F}>(sub_a[word_offset], sub_a[word_offset + 1]);
          let a_data1 = vec4<${F}>(sub_a[word_offset + 2], sub_a[word_offset + 3]);`;case 4:return`
          let a_data0 = sub_a[word_offset];
          let a_data1 = sub_a[word_offset + 1];`;default:throw new Error(`${m}-component is not supported.`)}};return`
        var<workgroup> sub_a: array<${G.type.value}, ${b}>;
        var<workgroup> inter_results: array<array<${pe.type.value}, ${x}>, ${$}>;
        ${H.declareVariables(...te,pe)}
        ${H.mainStart([x,$,1])}
          let output_indices = ${pe.offsetToIndices(`workgroup_index * ${$}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let n_blocks_per_col = uniforms.b_shape[1];
          let num_tiles =  (n_blocks_per_col - 1) / ${k} + 1;

          // Loop over shared dimension.
          for (var tile: u32 = 0; tile < num_tiles; tile += 1) {
            let a_col_start = tile * ${b};
            // load one tile A data into shared memory.
            for (var a_offset = local_idx; a_offset < ${b}; a_offset += ${_})
            {
              let a_col = a_col_start + a_offset;
              if (a_col < uniforms.a_shape[2])
              {
                sub_a[a_offset] = ${G.getByIndices(`${G.type.indices}(batch, row, a_col)`)};
              } else {
                sub_a[a_offset] = ${G.type.value}(0);
              }
            }
            workgroupBarrier();

            // each thread process one block
            let b_row = col + local_id.y;
            let block = tile * ${k} + local_id.x;
            ${j?`
            let zero_point_bytes_per_col = (n_blocks_per_col + 1) / 2;
            let zero_point_byte_count = b_row * zero_point_bytes_per_col + (block >> 0x1u);
            let zero_point_word_index = zero_point_byte_count >> 0x2u;
            let zero_point_byte_offset = zero_point_byte_count & 0x3u;
            let zero_point_nibble_offset: u32 = block & 0x1u;
            let zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_nibble_offset << 2);
            let zero_point_word = ${j.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point = ${F}((zero_point_word) & 0xFu);`:`
            // The default zero point is 8 for unsigned 4-bit quantization.
            let zero_point = ${F}(8);`}
            let scale = ${re.getByOffset("b_row * n_blocks_per_col + block")};
            let b_data = ${D.getByIndices(`${D.type.indices}(b_row, block, 0)`)};
            var word_offset = local_id.x * ${t.blockSize/m};
            for (var i: u32 = 0; i < ${g}; i++) {
              ${ce()}
              let b_value = ${g===1?"b_data":"b_data[i]"};
              let b_value_lower = unpack4xU8(b_value & 0x0F0F0F0Fu);
              let b_value_upper = unpack4xU8((b_value >> 4) & 0x0F0F0F0Fu);
              let b_quantized_values = mat2x4<${F}>(${Array.from({length:4},(U,K)=>`${F}(b_value_lower[${K}]), ${F}(b_value_upper[${K}])`).join(", ")});
              let b_dequantized_values = (b_quantized_values - mat2x4<${F}>(${Array(8).fill("zero_point").join(",")})) * scale;
              inter_results[local_id.y][local_id.x] += ${Array.from({length:2},(U,K)=>`${`dot(a_data${K}, b_dequantized_values[${K}])`}`).join(" + ")};
              word_offset += ${8/m};
            }
            workgroupBarrier();
          }

          if (local_idx < ${$}) {
            var output_value: ${pe.type.value} = ${pe.type.value}(0);
            for (var b = 0u; b < ${x}; b++) {
              output_value += inter_results[local_idx][b];
            }
            if (col + local_idx < uniforms.output_shape[2])
            {
              ${pe.setByIndices(`${pe.type.indices}(batch, row, col + local_idx)`,"output_value")}
            }
          }
        }`};return{name:"BlockwiseMatMulNBits32",shaderCache:{hint:`${t.blockSize};${m};${g};${x};${$}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:w,dataType:f}],dispatchGroup:{x:T},programUniforms:C}),getShaderSource:W}},Lh=(e,t)=>{Fl(e.inputs,t),t.blockSize===32&&e.adapterInfo.isVendor("intel")&&e.adapterInfo.isArchitecture("gen-12lp")?e.compute(Hl(e.inputs,t)):e.compute(Gl(e.inputs,t))},Vh=e=>ge(e)}),jl,Kl,Ql,Zl,Xl,Yl,Jl,ed,Fh,u0=L(()=>{"use strict";ie(),le(),de(),jl=e=>{if(!e||e.length<1)throw new Error("Too few inputs");if(e[0].dataType!==1&&e[0].dataType!==10)throw new Error("Input type must be float or float16.");if(e.length>=2){let t=e[0].dims.length*2===e[1].dims[0];if(e.length===4&&(t=e[3].dims[0]*2===e[1].dims[0]),!t)throw new Error("The pads should be a 1D tensor of shape [2 * input_rank] or [2 * num_axes].")}},Kl=(e,t,i)=>{let r="";for(let a=t-1;a>=0;--a)r+=`
            k = i32(${e.indicesGet("indices",a)}) - ${X("uniforms.pads",a,i)};
            if (k < 0) {
              break;
            }
            if (k >= i32(${X("uniforms.x_shape",a,t)})) {
              break;
            }
            offset += k * i32(${X("uniforms.x_strides",a,t)});
        `;return`
          value = ${e.type.value}(uniforms.constant_value);
          for (var i = 0; i < 1; i++) {
            var offset = 0;
            var k = 0;
            ${r}
            value = x[offset];
          }
      `},Ql=(e,t,i)=>{let r="";for(let a=t-1;a>=0;--a)r+=`
                k = i32(${e.indicesGet("indices",a)}) - ${X("uniforms.pads",a,i)};
                if (k < 0) {
                  k = -k;
                }
                {
                  let _2n_1 = 2 * (i32(${X("uniforms.x_shape",a,t)}) - 1);
                  k = k % _2n_1;
                  if(k >= i32(${X("uniforms.x_shape",a,t)})) {
                    k = _2n_1 - k;
                  }
                }
                offset += k * i32(${X("uniforms.x_strides",a,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${r}
              value = x[offset];
          `},Zl=(e,t,i)=>{let r="";for(let a=t-1;a>=0;--a)r+=`
                k = i32(${e.indicesGet("indices",a)}) - ${X("uniforms.pads",a,i)};
                if (k < 0) {
                  k = 0;
                }
                if (k >= i32(${X("uniforms.x_shape",a,t)})) {
                  k = i32(${X("uniforms.x_shape",a,t)}) - 1;
                }
                offset += k * i32(${X("uniforms.x_strides",a,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${r}
              value = x[offset];
          `},Xl=(e,t,i)=>{let r="";for(let a=t-1;a>=0;--a)r+=`
                k = i32(${e.indicesGet("indices",a)}) - ${X("uniforms.pads",a,i)};
                if (k < 0)  {
                  k += i32(${X("uniforms.x_shape",a,t)}]);
                }
                if (k >= i32(${X("uniforms.x_shape",a,t)})) {
                  k -= i32(${X("uniforms.x_shape",a,t)});
                }
                offset += k * i32(${X("uniforms.x_strides",a,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${r}
              value = x[offset];
          `},Yl=(e,t,i)=>{switch(i.mode){case 0:return Kl(e,t,i.pads.length);case 1:return Ql(e,t,i.pads.length);case 2:return Zl(e,t,i.pads.length);case 3:return Xl(e,t,i.pads.length);default:throw new Error("Invalid mode")}},Jl=(e,t)=>{let i=O.padShape(e[0].dims.slice(),t.pads),r=e[0].dims,a=O.size(i),o=[{type:12,data:a},{type:6,data:t.pads}],s=e.length>=3&&e[2].data;t.mode===0&&o.push({type:s?e[2].dataType:1,data:t.value}),o.push(...Y(e[0].dims,i));let l=["rank"],d=p=>{let f=Z("output",e[0].dataType,i.length),m=M("x",e[0].dataType,r.length),g=m.type.value,w=Yl(f,r.length,t),_=[{name:"output_size",type:"u32"},{name:"pads",type:"i32",length:t.pads.length}];return t.mode===0&&_.push({name:"constant_value",type:s?g:"f32"}),`
            ${p.registerUniforms(_).declareVariables(m,f)}
            ${p.mainStart()}
            ${p.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

            let indices = ${f.offsetToIndices("global_idx")};

            var value = ${g}(0);
            ${w}
            output[global_idx] = value;
        }`};return{name:"Pad",shaderCache:{hint:`${t.mode}${s}`,inputDependencies:l},getRunData:()=>({outputs:[{dims:i,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(O.size(i)/64)},programUniforms:o}),getShaderSource:d}},ed=(e,t)=>{if(e.length>1){let i=e[1].getBigInt64Array(),r=e.length>=3&&e[2].data?e[2].dataType===10?e[2].getUint16Array()[0]:e[2].getFloat32Array()[0]:0,a=e[0].dims.length,o=new Int32Array(2*a).fill(0);if(e.length>=4){let l=e[3].getBigInt64Array();for(let d=0;d<l.length;d++)o[Number(l[d])]=Number(i[d]),o[Number(l[d])+a]=Number(i[d+l.length])}else i.forEach((l,d)=>o[Number(d)]=Number(l));let s=[];return o.forEach(l=>s.push(l)),{mode:t.mode,value:r,pads:s}}else return t},Fh=(e,t)=>{jl(e.inputs);let i=ed(e.inputs,t);e.compute(Jl(e.inputs,i),{inputs:[0]})}}),tr,ea,ta,ra,ia,td,rd,aa,na,Gh,Hh,sa,jh,Kh,oa,Qh,Zh,Xh,Yh,l0=L(()=>{"use strict";Ze(),ie(),le(),de(),tr=e=>{if(_e.webgpu.validateInputContent&&(!e||e.length!==1))throw new Error("Pool ops requires 1 input.")},ea=(e,t,i)=>{let r=t.format==="NHWC",a=e.dims.slice();r&&a.splice(1,0,a.pop());let o=Object.hasOwnProperty.call(t,"dilations"),s=t.kernelShape.slice(),l=t.strides.slice(),d=o?t.dilations.slice():[],p=t.pads.slice();Fr.adjustPoolAttributes(i,a,s,l,d,p);let f=Fr.computePoolOutputShape(i,a,l,d,s,p,t.autoPad),m=Object.assign({},t);o?Object.assign(m,{kernelShape:s,strides:l,pads:p,dilations:d,cacheKey:t.cacheKey}):Object.assign(m,{kernelShape:s,strides:l,pads:p,cacheKey:t.cacheKey});let g=f.slice();return g.push(g.splice(1,1)[0]),[m,r?g:f]},ta=(e,t)=>{let i=t.format==="NHWC",r=O.size(e),a=O.size(t.kernelShape),o=[{type:12,data:r},{type:12,data:a}],s=[{name:"outputSize",type:"u32"},{name:"kernelSize",type:"u32"}];if(t.kernelShape.length<=2){let l=t.kernelShape[t.kernelShape.length-1],d=t.strides[t.strides.length-1],p=t.pads[t.pads.length/2-1],f=t.pads[t.pads.length-1],m=!!(p+f);o.push({type:12,data:l},{type:12,data:d},{type:12,data:p},{type:12,data:f}),s.push({name:"kw",type:"u32"},{name:"sw",type:"u32"},{name:"pwStart",type:"u32"},{name:"pwEnd",type:"u32"});let g=!1;if(t.kernelShape.length===2){let w=t.kernelShape[t.kernelShape.length-2],_=t.strides[t.strides.length-2],$=t.pads[t.pads.length/2-2],x=t.pads[t.pads.length-2];g=!!($+x),o.push({type:12,data:w},{type:12,data:_},{type:12,data:$},{type:12,data:x}),s.push({name:"kh",type:"u32"},{name:"sh",type:"u32"},{name:"phStart",type:"u32"},{name:"phEnd",type:"u32"})}return[o,s,!0,m,g]}else{if(i)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let l=O.computeStrides(t.kernelShape);o.push({type:12,data:l},{type:12,data:t.pads},{type:12,data:t.strides}),s.push({name:"kernelStrides",type:"u32",length:l.length},{name:"pads",type:"u32",length:t.pads.length},{name:"strides",type:"u32",length:t.strides.length});let d=t.pads.reduce((p,f)=>p+f);return[o,s,!!d,!1,!1]}},ra=(e,t,i,r,a,o,s,l,d,p,f,m)=>{let g=a.format==="NHWC",w=t.type.value,_=Z("output",t.type.tensor,r);if(a.kernelShape.length<=2){let $="",x="",v="",b=i-(g?2:1);if(f?$=`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${b}] = indices[${b}] * uniforms.sw - uniforms.pwStart + i;
                  if (xIndices[${b}] < 0 || xIndices[${b}]
                      >= uniforms.x_shape[${b}]) {
                    pad++;
                    continue;
                  }
                  let x_val = x[${t.indicesToOffset("xIndices")}];
                  ${o}
                }`:$=`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${b}] = indices[${b}] * uniforms.sw - uniforms.pwStart + i;
                  let x_val = x[${t.indicesToOffset("xIndices")}];
                  ${o}
                }`,a.kernelShape.length===2){let k=i-(g?3:2);m?x=`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${k}] = indices[${k}] * uniforms.sh - uniforms.phStart + j;
                  if (xIndices[${k}] < 0 || xIndices[${k}] >= uniforms.x_shape[${k}]) {
                    pad += i32(uniforms.kw);
                    continue;
                  }
              `:x=`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${k}] = indices[${k}] * uniforms.sh - uniforms.phStart + j;
                `,v=`
              }
            `}return`
            ${e.registerUniforms(d).declareVariables(t,_)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

              let indices = ${_.offsetToIndices("global_idx")};
              var xIndices = ${_.offsetToIndices("global_idx")};

              var value = ${w}(${l});
              var pad = 0;
              ${x}
              ${$}
              ${v}
              ${s}

              output[global_idx] = value;
            }`}else{if(g)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let $=a.kernelShape.length,x=a.pads.length,v="";return p?v=`
                if (xIndices[j] >= uniforms.x_shape[j]) {
                  pad++;
                  isPad = true;
                  break;
                }
              }
              if (!isPad) {
                let x_val = x[${t.indicesToOffset("xIndices")}];
                ${o}
              }`:v=`
              }
              let x_val = x[${t.indicesToOffset("xIndices")}];
              ${o}
            `,`
            ${e.registerUniforms(d).declareVariables(t,_)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
              let indices = ${_.offsetToIndices("global_idx")};
              var xIndices = ${_.offsetToIndices("global_idx")};

              var offsets: array<u32, ${$}>;

              var value = ${w}(${l});
              var pad = 0;
              var isPad = false;

              for (var i: u32 = 0u; i < uniforms.kernelSize; i++) {
                var offset = i;
                for (var j = 0u; j < ${$-1}u; j++) {
                  offsets[j] = offset / ${X("uniforms.kernelStrides","j",$)};
                  offset -= offsets[j] * ${X("uniforms.kernelStrides","j",$)};
                }
                offsets[${$-1}] = offset;

                isPad = false;
                for (var j = ${i-$}u; j < ${i}u; j++) {
                  xIndices[j] = indices[j] * ${X("uniforms.strides",`j - ${i-$}u`,$)}
                    + offsets[j - ${i-$}u] - ${X("uniforms.pads","j - 2u",x)};
                  ${v}
              }
              ${s}

              output[global_idx] = value;
            }`}},ia=e=>`${e.format};${e.ceilMode};${e.autoPad};${e.kernelShape.length}`,td=e=>`${ia(e)};${e.countIncludePad}`,rd=e=>`${ia(e)};${e.storageOrder};${e.dilations}`,aa=e=>({format:e.format,autoPad:["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],ceilMode:e.ceil_mode,kernelShape:e.kernel_shape,strides:e.strides,pads:e.pads}),na=(e,t,i,r)=>{let[a,o]=ea(t,r,i),s=M("x",t.dataType,t.dims.length),l=s.type.value,d="value += x_val;",p="";a.countIncludePad?p+=`value /= ${l}(uniforms.kernelSize);`:p+=`value /= ${l}(i32(uniforms.kernelSize) - pad);`;let[f,m,g,w,_]=ta(o,a);f.push(...Y(t.dims,o));let $=["rank"];return{name:e,shaderCache:{hint:`${r.cacheKey};${g};${w};${_}`,inputDependencies:$},getRunData:()=>({outputs:[{dims:o,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(O.size(o)/64)},programUniforms:f}),getShaderSource:x=>ra(x,s,t.dims.length,o.length,a,d,p,0,m,g,w,_)}},Gh=e=>{let t=e.count_include_pad!==0,i=aa(e);if(i.ceilMode!==0)throw new Error("using ceil() in shape computation is not yet supported for AveragePool");let r={countIncludePad:t,...i,cacheKey:""};return{...r,cacheKey:td(r)}},Hh=(e,t)=>{tr(e.inputs),e.compute(na("AveragePool",e.inputs[0],!1,t))},sa={autoPad:"",ceilMode:0,countIncludePad:!1,kernelShape:[],strides:[],pads:[],storageOrder:0,dilations:[]},jh=e=>{let t=e.format;return{format:t,...sa,cacheKey:t}},Kh=(e,t)=>{tr(e.inputs),e.compute(na("GlobalAveragePool",e.inputs[0],!0,t))},oa=(e,t,i,r)=>{let[a,o]=ea(t,r,i),s=`
      value = max(x_val, value);
    `,l="",d=M("x",t.dataType,t.dims.length),p=["rank"],[f,m,g,w,_]=ta(o,a);return f.push(...Y(t.dims,o)),{name:e,shaderCache:{hint:`${r.cacheKey};${g};${w};${_}`,inputDependencies:p},getRunData:()=>({outputs:[{dims:o,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(O.size(o)/64)},programUniforms:f}),getShaderSource:$=>ra($,d,t.dims.length,o.length,a,s,l,t.dataType===10?-65504:-1e5,m,g,w,_)}},Qh=(e,t)=>{tr(e.inputs),e.compute(oa("MaxPool",e.inputs[0],!1,t))},Zh=e=>{let t=e.storage_order,i=e.dilations,r=aa(e);if(t!==0)throw new Error("column major storage order is not yet supported for MaxPool");if(r.ceilMode!==0)throw new Error("using ceil() in shape computation is not yet supported for MaxPool");let a={storageOrder:t,dilations:i,...r,cacheKey:""};return{...a,cacheKey:rd(a)}},Xh=e=>{let t=e.format;return{format:t,...sa,cacheKey:t}},Yh=(e,t)=>{tr(e.inputs),e.compute(oa("GlobalMaxPool",e.inputs[0],!0,t))}}),id,ad,Jh,ef,d0=L(()=>{"use strict";ie(),le(),$e(),de(),id=(e,t)=>{if(e.length<2||e.length>3)throw new Error("DequantizeLinear requires 2 or 3 inputs.");if(e.length===3&&e[1].dims===e[2].dims)throw new Error("x-scale and x-zero-point must have the same shape.");if(e.length===3&&e[0].dataType!==e[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(e[0].dataType===6&&e.length>2)throw new Error("In the case of dequantizing int32 there is no zero point.");if(e[1].dims.length!==0&&e[1].dims.length!==1&&e[1].dims.length!==e[0].dims.length)throw new Error("scale input must be a scalar, a 1D tensor, or have the same rank as the input tensor.");if(e.length>2){if(e[0].dataType!==e[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(e[1].dims.length!==e[2].dims.length)throw new Error("scale and zero-point inputs must have the same rank.");if(!e[1].dims.map((i,r)=>i===e[2].dims[r]).reduce((i,r)=>i&&r,!0))throw new Error("scale and zero-point inputs must have the same shape.")}if(t.blockSize>0){if(e[1].dims.length===0||e[1].dims.length===1&&e[1].dims[0]===1)throw new Error("blockSize must be set only for block quantization.");if(!e[1].dims.map((a,o)=>o===t.axis||a===e[0].dims[o]).reduce((a,o)=>a&&o,!0))throw new Error("For block qunatization, scale input shape to match the input shape except for the axis");if(e[1].dims.length!==e[0].dims.length)throw new Error("For block qunatization the scale input rank must be the same as the x rank.");let i=e[0].dims[t.axis],r=e[1].dims[t.axis];if(t.blockSize<Math.ceil(i/r)||t.blockSize>Math.ceil(i/(r-1)-1))throw new Error("blockSize must be with in the range [ceil(dI / Si), ceil(dI / (Si - 1) - 1)].")}},ad=(e,t)=>{let i=O.normalizeAxis(t.axis,e[0].dims.length),r=e[0].dataType,a=r===3,o=e[0].dims,s=e[1].dataType,l=O.size(o),d=r===3||r===2,p=d?[Math.ceil(O.size(e[0].dims)/4)]:e[0].dims,f=e[1].dims,m=e.length>2?e[2]:void 0,g=m?d?[Math.ceil(O.size(m.dims)/4)]:m.dims:void 0,w=f.length===0||f.length===1&&f[0]===1,_=w===!1&&f.length===1,$=be(l),x=w&&(!d||$===4),v=x?$:1,b=x&&!d?$:1,k=M("input",d?12:r,p.length,b),T=M("scale",s,f.length),C=m?M("zero_point",d?12:r,g.length):void 0,E=Z("output",s,o.length,v),z=[k,T];C&&z.push(C);let N=[p,f];m&&N.push(g);let W=[{type:12,data:l/v},{type:12,data:i},{type:12,data:t.blockSize},...Y(...N,o)],H=V=>{let G=[{name:"output_size",type:"u32"},{name:"axis",type:"u32"},{name:"block_size",type:"u32"}];return`
      ${V.registerUniforms(G).declareVariables(...z,E)}
      ${V.mainStart()}
          ${V.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let output_indices = ${E.offsetToIndices("global_idx")};

          // Set input x
          ${d?`
            let input = ${k.getByOffset("global_idx / 4")};
            let x_vec = ${a?"unpack4xI8(input)":"unpack4xU8(input)"};
            let x_value = ${v===1?"x_vec[global_idx % 4]":"x_vec"};`:`let x_value = ${k.getByOffset("global_idx")};`};

          // Set scale input
          ${w?`let scale_value= ${T.getByOffset("0")}`:_?`
            let scale_index = ${E.indicesGet("output_indices","uniforms.axis")};
            let scale_value= ${T.getByOffset("scale_index")};`:`
            var scale_indices: ${T.type.indices} = output_indices;
            let index = ${T.indicesGet("scale_indices","uniforms.axis")} / uniforms.block_size;
            ${T.indicesSet("scale_indices","uniforms.axis","index")};
            let scale_value= ${T.getByIndices("scale_indices")};`};

          // Set zero-point input
          ${C?w?d?`
                let zero_point_input = ${C.getByOffset("0")};
                let zero_point_vec =  ${a?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value= zero_point_vec[0]`:`let zero_point_value = ${C.getByOffset("0")}`:_?d?`
                let zero_point_index = ${E.indicesGet("output_indices","uniforms.axis")};
                let zero_point_input = ${C.getByOffset("zero_point_index / 4")};
                let zero_point_vec =  ${a?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_index % 4]`:`
                let zero_point_index = ${E.indicesGet("output_indices","uniforms.axis")};
                let zero_point_value = ${C.getByOffset("zero_point_index")};`:d?`
                let zero_point_offset = ${T.indicesToOffset("scale_indices")};
                let zero_point_input = ${C.getByOffset("zero_point_offset / 4")};
                let zero_point_vec = ${a?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_offset % 4];`:`let zero_point_value = ${C.getByIndices("scale_indices")};`:`let zero_point_value = ${d?a?"i32":"u32":k.type.value}(0);`};
      // Compute and write output
      ${E.setByOffset("global_idx",`${E.type.value}(x_value - zero_point_value) * scale_value`)};
      }`};return{name:"DequantizeLinear",shaderCache:{hint:t.cacheKey,inputDependencies:C?["rank","rank","rank"]:["rank","rank"]},getShaderSource:H,getRunData:()=>({outputs:[{dims:o,dataType:s}],dispatchGroup:{x:Math.ceil(l/v/64),y:1,z:1},programUniforms:W})}},Jh=(e,t)=>{id(e.inputs,t),e.compute(ad(e.inputs,t))},ef=e=>ge({axis:e.axis,blockSize:e.blockSize})}),nd,sd,tf,p0=L(()=>{"use strict";Ze(),ie(),de(),nd=(e,t,i)=>{let r=e===t,a=e<t&&i<0,o=e>t&&i>0;if(r||a||o)throw new Error("Range these inputs' contents are invalid.")},sd=(e,t,i,r)=>{let a=Math.abs(Math.ceil((t-e)/i)),o=[a],s=a,l=[{type:12,data:s},{type:r,data:e},{type:r,data:i},...Y(o)],d=p=>{let f=Z("output",r,o.length),m=f.type.value,g=[{name:"outputSize",type:"u32"},{name:"start",type:m},{name:"delta",type:m}];return`
        ${p.registerUniforms(g).declareVariables(f)}
        ${p.mainStart()}
        ${p.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        output[global_idx] = uniforms.start + ${m}(global_idx) * uniforms.delta;
      }`};return{name:"Range",shaderCache:{hint:`${r}`},getShaderSource:d,getRunData:()=>({outputs:[{dims:o,dataType:r}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:l})}},tf=e=>{let t=0,i=0,r=0;e.inputs[0].dataType===6?(t=e.inputs[0].getInt32Array()[0],i=e.inputs[1].getInt32Array()[0],r=e.inputs[2].getInt32Array()[0]):e.inputs[0].dataType===1&&(t=e.inputs[0].getFloat32Array()[0],i=e.inputs[1].getFloat32Array()[0],r=e.inputs[2].getFloat32Array()[0]),_e.webgpu.validateInputContent&&nd(t,i,r),e.compute(sd(t,i,r,e.inputs[0].dataType),{inputs:[]})}}),od,ud,rf,af,c0=L(()=>{"use strict";ie(),le(),$e(),de(),od=(e,t,i,r)=>{if(e!=="none"&&r!=="i32"&&r!=="u32"&&r!=="f32")throw new Error(`Input ${r} is not supported with reduction ${e}.`);let a=`{
                var oldValue = 0;
                loop {
                  let newValueF32 =`,o=`;
                  let newValue = bitcast<i32>(newValueF32);
                  let res = atomicCompareExchangeWeak(&${t}, oldValue, newValue);
                  if res.exchanged {
                    break;
                  }
                  oldValue = res.old_value;
                }
              }`;switch(e){case"none":return`${t}=${i};`;case"add":return r==="i32"||r==="u32"?`atomicAdd(&${t}, bitcast<${r}>(${i}));`:`
              ${a}bitcast<${r}>(oldValue) + (${i})${o}`;case"max":return r==="i32"||r==="u32"?`atomicMax(&${t}, bitcast<${r}>(${i}));`:`
                ${a}max(bitcast<f32>(oldValue), (${i}))${o}`;case"min":return r==="i32"||r==="u32"?`atomicMin(&${t}, bitcast<${r}>(${i}));`:`${a}min(bitcast<${r}>(oldValue), (${i}))${o}`;case"mul":return`${a}(bitcast<${r}>(oldValue) * (${i}))${o}`;default:throw new Error(`Reduction ${e} is not supported.`)}},ud=(e,t)=>{let i=e[0].dims,r=e[1].dims,a=i,o=1,s=Math.ceil(O.size(r)/o),l=r[r.length-1],d=O.sizeFromDimension(i,l),p=[{type:12,data:s},{type:12,data:l},{type:12,data:d},...Y(e[1].dims,e[2].dims,a)],f=m=>{let g=M("indices",e[1].dataType,e[1].dims.length),w=M("updates",e[2].dataType,e[2].dims.length,o),_=t.reduction!=="none"&&t.reduction!==""?Rp("output",e[0].dataType,a.length):Z("output",e[0].dataType,a.length,o);return`
      ${m.registerUniform("output_size","u32").registerUniform("last_index_dimension","u32").registerUniform("num_updates_elements","u32").declareVariables(g,w,_)}
      ${m.mainStart()}
        ${m.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
  var hasDuplicates = false;
  if (${t.reduction==="none"}) {
    let n = ${O.size(r)};
    for (var i = 0; i < n; i = i + 1) {
      for (var j = i + 1; j < n; j = j + 1) {
        var index_i = i32(indices[i].x);
        var index_j = i32(indices[j].x);
        if (index_i == index_j) {
          hasDuplicates = true;
          break;
        }
      }
      if (hasDuplicates) {
        break;
      }
    }
  }

  var data_offset = 0u;
  var indices_start = uniforms.last_index_dimension * global_idx;
  if (${t.reduction==="none"} && hasDuplicates) {
    if (global_idx != 0u) {
      return;
    }
    indices_start = 0u;
  }
  let indices_end = indices_start + uniforms.last_index_dimension;
  for (var i = indices_start; i < indices_end; i++) {
    var index = i32(indices[i].x);
    ${e[0].dims.length===1?`
    let element_count_dim = uniforms.output_strides;
    let dim_value = uniforms.output_shape;`:`
    let element_count_dim = uniforms.output_strides[i - indices_start];
    let dim_value = uniforms.output_shape[i - indices_start + uniforms.last_index_dimension];`}
    if (index >= 0) {
      if (index >= i32(dim_value)) {
        index = i32(dim_value - 1);
      }
    } else {
      if (index < -i32(dim_value)) {
        index = 0;
      } else {
        index += i32(dim_value);
      }
    }
    data_offset += u32((u32(index) * element_count_dim));
  }

  for (var i = 0u; i < uniforms.num_updates_elements; i++) {
    let value = updates[uniforms.num_updates_elements * global_idx + i];
    ${od(t.reduction,"output[data_offset + i]","value",_.type.value)}
  }

      }`};return{name:"ScatterND",shaderCache:{hint:`${t.cacheKey}_${t.reduction}`,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:a,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:p}),getShaderSource:f}},rf=e=>ge({reduction:e.reduction}),af=(e,t)=>{e.compute(ud(e.inputs,t),{inputs:[e.inputs[1],e.inputs[2]],outputs:[]})}}),ld,dd,pd,ua,cd,hd,fd,md,gd,yd,_d,wd,la,bd,$d,vd,xd,Sd,nf,sf,h0=L(()=>{"use strict";ie(),le(),$e(),de(),ld=(e,t)=>{if(e.every(i=>i>0||(()=>{throw new Error("Resize requires scales input values to be positive")})),e.length>0){if(t.mode==="linear"){if(!(e.length===2||e.length===3||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1||e.length===5&&e[0]===1&&e[1]===1))throw new Error(`For linear mode, Resize requires scales to be 2D, 3D, 4D with either two outermost or one innermost and
            one outermost scale values equal to 1, or 5D with two outermost scale values equal to 1`)}else if(t.mode==="cubic"&&!(e.length===2||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1))throw new Error("Resize requires scales input size to be 2 or 4 for cubic mode")}},dd=(e,t,i)=>{t.every(a=>a>=0&&a<i||(()=>{throw new Error("Resize requires axes input values to be positive and less than rank")}));let r=new Array(i).fill(1);return t.forEach((a,o)=>r[a]=e[o]),r},pd=(e,t,i,r,a,o)=>{let[s,l,d]=i>10?[1,2,3]:[-1,e.length>1?1:-1,-1],p=e[0].dims.length;if(s>0&&e.length>s&&e[s].dims.length>0)e[s].getFloat32Array().forEach(f=>o.push(f));else if(t.coordinateTransformMode==="tf_crop_and_resize")throw new Error("Resize requires RoI input to be specified when coordinateTransformMode is tfCropAndResize");if(l>0&&e.length>l&&e[l].dims.length===1&&e[l].dims[0]>0){if(e[l].getFloat32Array().forEach(f=>r.push(f)),r.length!==0&&r.length!==p&&i>=18&&r.length!==t.axes.length)throw new Error("Resize requires scales input size to be same as input rank or axes size for opset 18 and up");ld(r,t),t.axes.length>0&&dd(r,t.axes,p).forEach((f,m)=>r[m]=f)}if(d>0&&e.length>d&&e[d].dims.length===1&&e[d].dims[0]>0&&(e[d].getBigInt64Array().forEach(f=>a.push(Number(f))),a.length!==0&&a.length!==p&&i>=18&&a.length!==t.axes.length))throw new Error("Resize requires sizes input size to be same as input rank or axes size for opset 18 and up");if(t.axes.length>0){if(r.length!==0&&r.length!==t.axes.length)throw new Error('Resize requires "scales" input size to be of axes rank when axes attributes is specified');if(a.length!==0&&a.length!==t.axes.length)throw new Error('Resize requires "sizes" input size to be of rank axes rank when axes attributes is specified')}if(typeof r<"u"&&typeof a<"u"&&r.length>0&&a.length>p)throw new Error("Resize requires only of scales or sizes to be specified")},ua=(e,t,i,r)=>`
  // The whole part and the fractional part are calculated separately due to inaccuracy of floating
  // point division. As an example, f32(21) / f32(7) may evaluate to 2.99... instead of 3, causing an
  // offset-by-one error later in floor().
  let big = (${e}) * (${t});
  let whole = ${r}(big / (${i}));
  let fract = ${r}(big % (${i})) / ${r}(${i});
  return whole + fract;
`,cd=(e,t)=>`fn getOriginalCoordinateFromResizedCoordinate(xResized: u32, xScale: f32, lengthResized: u32,
     lengthOriginal: u32, roiStart: f32, roiEnd: f32) -> ${t} { `+(()=>{switch(e){case"asymmetric":return`
          if (xScale < 1.0 || floor(xScale) != xScale) {
            return ${t}(xResized) / ${t}(xScale);
          } else {
            ${ua("xResized","lengthOriginal","lengthResized",t)}
          }
        `;case"pytorch_half_pixel":return`if (lengthResized > 1) {
                    return (${t}(xResized) + 0.5) / ${t}(xScale) - 0.5;
                  } else {
                    return 0.0;
                  }`;case"tf_half_pixel_for_nn":return`return (${t}(xResized) + 0.5) / ${t}(xScale);`;case"align_corners":return`if (lengthResized == 1) {
                    return 0.0;
                  } else {
                    ${ua("xResized","lengthOriginal - 1","lengthResized - 1",t)}
                  }`;case"tf_crop_and_resize":return`if (lengthResized > 1) {
                    return ${t}(roiStart) * ${t}(lengthOriginal - 1) +
                        (${t}(xResized) * ${t}(roiEnd - roiStart) * ${t}(lengthOriginal - 1)) /
                        ${t}(lengthResized - 1);
                  } else {
                    return 0.5 * ${t}(roiStart + roiEnd) * ${t}(lengthOriginal - 1);
                  }`;case"half_pixel_symmetric":return`const outputWidth = ${t}xScale * ${t}(lengthResized);
                  const adjustment = ${t}(lengthResized) / outputWidth;
                  const center = ${t}(lengthOriginal) / 2;
                  const offset = center * (1 - adjustment);
                  return offset + ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;case"half_pixel":return`return ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;default:throw new Error(`Coordinate transform mode ${e} is not supported`)}})()+"}",hd=(e,t,i)=>`fn getNearestPixelFromOriginal(xOriginal: ${i}, isDownSample: bool) -> ${i} {`+(()=>{switch(e){case"round_prefer_ceil":return"if (fract(xOriginal) == 0.5) {             return ceil(xOriginal);           } else {             return round(xOriginal);           }";case"floor":return"return floor(xOriginal);";case"ceil":return"return ceil(xOriginal);";case"round_prefer_floor":return"if (fract(xOriginal) == 0.5) {                     return floor(xOriginal);                   } else {                     return round(xOriginal);                   }";default:if(t<11)return"if (isDownSample)                     {                       return ceil(xOriginal);                     } else {                       return xOriginal;                     }";throw new Error(`Nearest mode ${e} is not supported`)}})()+"}",fd=(e,t,i)=>{let r=new Array(i).fill(0).concat(new Array(i).fill(1)),a=e.length===0?r:e.slice();return t.length>0?(t.forEach((o,s)=>{r[o]=a[s],r[s+i]=a[t.length+s]}),r):a},md=(e,t,i,r)=>{let a=[];if(i.length>0)if(r.length>0){if(e.forEach(o=>a.push(o)),Math.max(...r)>e.length)throw new Error("axes is out of bound");r.forEach((o,s)=>a[o]=i[s])}else i.forEach(o=>a.push(o));else{if(t.length===0)throw new Error("Resize requires either scales or sizes.");a=e.map((o,s)=>Math.round(o*t[s]))}return a},gd=(e,t,i)=>{let r=(()=>{switch(i.keepAspectRatioPolicy){case"not_larger":return i.axes.length>0?Math.min(...i.axes.map(o=>t[o]),Number.MAX_VALUE):Math.min(...t,Number.MAX_VALUE);case"not_smaller":return i.axes.length>0?Math.max(...i.axes.map(o=>t[o]),Number.MIN_VALUE):Math.max(...t,Number.MIN_VALUE);default:throw new Error(`Keep aspect ratio policy ${i.keepAspectRatioPolicy} is not supported`)}})();t.fill(1,0,t.length);let a=e.slice();return i.axes.length>0?(i.axes.forEach(o=>t[o]=r),i.axes.forEach(o=>a[o]=Math.round(e[o]*t[o]))):(t.fill(r,0,t.length),a.forEach((o,s)=>a[s]=Math.round(o*t[s]))),a},yd=(e,t,i,r,a)=>`
    fn calculateOriginalIndicesFromOutputIndices(output_indices: ${e.type.indices}) -> array<${e.type.value}, ${i.length}> {
      var original_indices: array<${e.type.value}, ${i.length}>;
      for (var i:u32 = 0; i < ${i.length}; i++) {
        var output_index = ${e.indicesGet("output_indices","i")};
        var scale = ${X("uniforms.scales","i",r)};
        var roi_low = ${X("uniforms.roi","i",a)};
        var roi_hi = ${X("uniforms.roi",`i + ${t.length}`,a)};
        if (scale == 1.0) {
          original_indices[i] = ${e.type.value}(output_index);
        } else {
          var input_shape_i = ${X("uniforms.input_shape","i",t.length)};
          var output_shape_i = ${X("uniforms.output_shape","i",i.length)};
          original_indices[i] = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                           input_shape_i, roi_low, roi_hi);
        }
      }
      return original_indices;
    }`,_d=(e,t,i,r,a,o,s)=>`
    fn calculateInputIndicesFromOutputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
      var input_indices: ${e.type.indices};
      for (var i:u32 = 0; i < ${r.length}; i++) {
        var output_index = ${t.indicesGet("output_indices","i")};
        var input_index: u32;
        var scale = ${X("uniforms.scales","i",a)};
        if (scale == 1.0) {
          input_index = output_index;
        } else {
          var roi_low = ${X("uniforms.roi","i",o)};
          var roi_hi = ${X("uniforms.roi",`i + ${i.length}`,o)};
          var input_shape_i = ${X("uniforms.input_shape","i",i.length)};
          var output_shape_i = ${X("uniforms.output_shape","i",r.length)};
          var original_idx = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                        input_shape_i, roi_low, roi_hi);
          if (!${s} || (original_idx >= 0 && original_idx < ${t.type.value}(input_shape_i))) {
            if (original_idx < 0) {
              input_index = 0;
            } else if (original_idx > ${t.type.value}(input_shape_i - 1)) {
              input_index = input_shape_i - 1;
            } else {
              input_index = u32(getNearestPixelFromOriginal(original_idx, scale < 1));
            }
          } else {
            input_index = u32(original_idx);
          }
        }
        ${e.indicesSet("input_indices","i","input_index")}
      }
      return input_indices;
    }`,wd=(e,t)=>`
    fn checkInputIndices(input_indices: ${e.type.indices}) -> bool {
      for (var i:u32 = 0; i < ${t.length}; i++) {
        var input_index = ${e.indicesGet("input_indices","i")};
        if (input_index < 0 || input_index >= ${X("uniforms.input_shape","i",t.length)}) {
          return false;
        }
      }
      return true;
    }`,la=(e,t,i,r)=>e.rank>r?`
    ${e.indicesSet("input_indices",t,"channel")};
    ${e.indicesSet("input_indices",i,"batch")};
`:"",bd=(e,t,i,r,a)=>{let[o,s,l,d]=i.length===2?[-1,0,1,-1]:[0,2,3,1],p=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, row: u32, col: u32) -> ${p} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",s,`max(0, min(row, ${i[s]} - 1))`)};
      ${e.indicesSet("input_indices",l,`max(0, min(col, ${i[l]} - 1))`)};
      ${la(e,d,o,2)}
      return ${e.getByIndices("input_indices")};
    }

    fn bilinearInterpolation(output_indices: ${t.type.indices}) -> ${p} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var row:${p} = originalIndices[${s}];
      var col:${p} = originalIndices[${l}];
      ${r?`if (row < 0 || row > (${i[s]} - 1) || col < 0 || col > (${i[l]} - 1)) {
        return ${a};
      }`:""};
      row = max(0, min(row, ${i[s]} - 1));
      col = max(0, min(col, ${i[l]} - 1));
      var row1: u32 = u32(row);
      var col1: u32 = u32(col);
      var row2: u32 = u32(row + 1);
      var col2: u32 = u32(col + 1);
      var channel: u32 = ${i.length>2?`u32(originalIndices[${d}])`:"0"};
      var batch: u32 =  ${i.length>2?`u32(originalIndices[${o}])`:"0"};
      var x11: ${p} = getInputValue(batch, channel, row1, col1);
      var x12: ${p} = getInputValue(batch, channel, row1, col2);
      var x21: ${p} = getInputValue(batch, channel, row2, col1);
      var x22: ${p} = getInputValue(batch, channel, row2, col2);
      var dx1: ${p} = abs(row - ${p}(row1));
      var dx2: ${p} = abs(${p}(row2) - row);
      var dy1: ${p} = abs(col - ${p}(col1));
      var dy2: ${p} = abs(${p}(col2) - col);
      if (row1 == row2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (col1 == col2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      return (x11 * dx2 * dy2 + x12 * dx2 * dy1 + x21 * dx1 * dy2 + x22 * dx1 * dy1);
    }`},$d=(e,t,i,r,a,o,s,l,d,p)=>{let f=i.length===2,m=!0,[g,w]=f?[0,1]:m?[2,3]:[1,2],_=e.type.value,$=x=>{let v=x===g?"row":"col";return`
      fn ${v}CubicInterpolation(input_indices: ${e.type.indices}, output_indices: ${t.type.indices}) -> ${_} {
        var output_index = ${t.indicesGet("output_indices",x)};
        var originalIdx: ${_} = getOriginalCoordinateFromResizedCoordinate(output_index, ${a[x]},
        ${r[x]}, ${i[x]}, ${o[x]}, ${o[x]} + ${i.length});
        var fractOriginalIdx: ${_} = originalIdx - floor(originalIdx);
        var coefs = getCubicInterpolationCoefs(fractOriginalIdx);

        if (${l} && (originalIdx < 0 || originalIdx > (${i[x]} - 1))) {
          return ${d};
        }
        var data: array<${_}, 4> = array<${_}, 4>(0.0, 0.0, 0.0, 0.0);
        for (var i: i32 = -1; i < 3; i++) {
          var ${v}: ${_} = originalIdx + ${_}(i);
          if (${v} < 0 || ${v} >= ${i[x]}) {
            ${p?`coefs[i + 1] = 0.0;
                        continue;`:l?`return ${d};`:`${v} = max(0, min(${v}, ${i[x]} - 1));`};
          }
        var input_indices_copy: ${e.type.indices} = input_indices;
          ${e.indicesSet("input_indices_copy",x,`u32(${v})`)};
          data[i + 1] = ${x===g?e.getByIndices("input_indices_copy"):"rowCubicInterpolation(input_indices_copy, output_indices)"};
        }
        return cubicInterpolation1D(data, coefs);
      }`};return`
    ${$(g)};
    ${$(w)};
  fn getCubicInterpolationCoefs(s: ${_}) -> array<${_}, 4> {
    var absS = abs(s);
    var coeffs: array<${_}, 4> = array<${_}, 4>(0.0, 0.0, 0.0, 0.0);
    var oneMinusAbsS: ${_} = 1.0 - absS;
    var twoMinusAbsS: ${_} = 2.0 - absS;
    var onePlusAbsS: ${_} = 1.0 + absS;
    coeffs[0] = ((${s} * onePlusAbsS - 5 * ${s}) * onePlusAbsS + 8 * ${s}) * onePlusAbsS - 4 * ${s};
    coeffs[1] = ((${s} + 2) * absS - (${s} + 3)) * absS * absS + 1;
    coeffs[2] = ((${s} + 2) * oneMinusAbsS - (${s} + 3)) * oneMinusAbsS * oneMinusAbsS + 1;
    coeffs[3] = ((${s} * twoMinusAbsS - 5 * ${s}) * twoMinusAbsS + 8 * ${s}) * twoMinusAbsS - 4 * ${s};
    return coeffs;
  }

  fn cubicInterpolation1D(x: array<${_}, 4>, coefs: array<${_}, 4>) -> ${_} {
    var coefsSum: ${_} = coefs[0] + coefs[1] + coefs[2] + coefs[3];
    return (x[0] * coefs[0] + x[1] * coefs[1]+ x[2] * coefs[2]+ x[3] * coefs[3]) / coefsSum;
  }

  fn bicubicInterpolation(output_indices: ${t.type.indices}) -> ${_} {
    var input_indices: ${e.type.indices} = output_indices;
    return colCubicInterpolation(input_indices, output_indices);
  }
    `},vd=(e,t,i,r,a)=>{let[o,s,l,d,p]=i.length===3?[-1,0,1,2,-1]:[0,2,3,4,1],f=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, depth:u32, height: u32, width: u32) -> ${f} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",s,`max(0, min(depth, ${i[s]} - 1))`)};
      ${e.indicesSet("input_indices",l,`max(0, min(height, ${i[l]} - 1))`)};
      ${e.indicesSet("input_indices",d,`max(0, min(width, ${i[d]} - 1))`)};
      ${la(e,p,o,3)}
      return ${e.getByIndices("input_indices")};
    }

    fn trilinearInterpolation(output_indices: ${t.type.indices}) -> ${f} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var depth:${f} = originalIndices[${s}];
      var height:${f} = originalIndices[${l}];
      var width:${f} = originalIndices[${d}];
      ${r?`if (depth < 0 || depth > (${i[s]} - 1) || height < 0 || height > (${i[l]} - 1) || width < 0 || (width > ${i[d]} - 1)) {
      return ${a};
        }`:""};

    depth = max(0, min(depth, ${i[s]} - 1));
      height = max(0, min(height, ${i[l]} - 1));
      width = max(0, min(width, ${i[d]} - 1));
      var depth1: u32 = u32(depth);
      var height1: u32 = u32(height);
      var width1: u32 = u32(width);
      var depth2: u32 = u32(depth + 1);
      var height2: u32 = u32(height + 1);
      var width2: u32 = u32(width + 1);
      var channel: u32 = ${i.length>3?`u32(originalIndices[${p}])`:"0"};
      var batch: u32 =  ${i.length>3?`u32(originalIndices[${o}])`:"0"};

      var x111: ${f} = getInputValue(batch, channel, depth1, height1, width1);
      var x112: ${f} = getInputValue(batch, channel, depth1, height1, width2);
      var x121: ${f} = getInputValue(batch, channel, depth1, height2, width1);
      var x122: ${f} = getInputValue(batch, channel, depth1, height2, width2);
      var x211: ${f} = getInputValue(batch, channel, depth2, height1, width1);
      var x212: ${f} = getInputValue(batch, channel, depth2, height1, width2);
      var x221: ${f} = getInputValue(batch, channel, depth2, height2, width1);
      var x222: ${f} = getInputValue(batch, channel, depth2, height2, width2);
      var dx1: ${f} = abs(depth - ${f}(depth1));
      var dx2: ${f} = abs(${f}(depth2) - depth);
      var dy1: ${f} = abs(height - ${f}(height1));
      var dy2: ${f} = abs(${f}(height2) - height);
      var dz1: ${f} = abs(width - ${f}(width1));
      var dz2: ${f} = abs(${f}(width2) - width);
      if (depth1 == depth2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (height1 == height2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      if (width1 == width2) {
        dz1 = 0.5;
        dz2 = 0.5;
      }
      return (x111 * dx2 * dy2 * dz2 + x112 * dx2 * dy2 * dz1 + x121 * dx2 * dy1 *dz2 + x122 * dx2 * dy1 * dz1 +
              x211 * dx1 * dy2 * dz2 + x212 * dx1 * dy2 * dz1 + x221 * dx1 * dy1 *dz2 + x222 * dx1 * dy1 * dz1);
    }`},xd=(e,t,i,r,a,o)=>{let s=e.dims,l=fd(o,t.axes,s.length),d=md(s,r,a,t.axes),p=r.slice();r.length===0&&(p=s.map((b,k)=>b===0?1:d[k]/b),t.keepAspectRatioPolicy!=="stretch"&&(d=gd(s,p,t)));let f=Z("output",e.dataType,d.length),m=M("input",e.dataType,s.length),g=O.size(d),w=s.length===d.length&&s.every((b,k)=>b===d[k]),_=t.coordinateTransformMode==="tf_crop_and_resize",$=t.extrapolationValue,x=m.type.value,v=b=>`
      ${w?"":`
      ${cd(t.coordinateTransformMode,x)};
      ${(()=>{switch(t.mode){case"nearest":return`
              ${wd(m,s)};
              ${hd(t.nearestMode,i,x)};
              ${_d(m,f,s,d,p.length,l.length,_)};
              `;case"linear":return`
              ${yd(f,s,d,p.length,l.length)};
              ${(()=>{if(s.length===2||s.length===4)return`${bd(m,f,s,_,$)}`;if(s.length===3||s.length===5)return`${vd(m,f,s,_,$)}`;throw Error("Linear mode only supports input dims 2, 3, 4 and 5 are supported in linear mode.")})()};
            `;case"cubic":return`
            ${(()=>{if(s.length===2||s.length===4)return`${$d(m,f,s,d,p,l,t.cubicCoeffA,_,t.extrapolationValue,t.excludeOutside)}`;throw Error("Cubic mode only supports input dims 2 and 4 are supported in linear mode.")})()};
            `;default:throw Error("Invalid resize mode")}})()};
      `}
      ${b.registerUniform("output_size","u32").registerUniform("scales","f32",p.length).registerUniform("roi","f32",l.length).declareVariables(m,f)}
      ${b.mainStart()}
        ${b.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
        ${w?"output[global_idx] = input[global_idx];":`
        let output_indices = ${f.offsetToIndices("global_idx")};
        var input_indices: ${m.type.indices};
        ${(()=>{switch(t.mode){case"nearest":return`input_indices = calculateInputIndicesFromOutputIndices(output_indices);
                if (checkInputIndices(input_indices)) {
                  output[global_idx] = ${m.getByIndices("input_indices")};
                } else {
                  output[global_idx] = ${t.extrapolationValue};
                }`;case"linear":return`output[global_idx] = ${s.length===2||s.length===4?"bilinearInterpolation":"trilinearInterpolation"}(output_indices);`;case"cubic":return"output[global_idx] = bicubicInterpolation(output_indices);";default:throw Error(`Unsupported resize mode: ${t.mode}`)}})()};
`}
      }`;return{name:"Resize",shaderCache:{hint:`${t.cacheKey}|${i}|${p.length>0?t.mode==="cubic"?p:p.length:""}|${a.length>0?a:""}|${l.length>0?l:""}|${w}|${t.mode==="nearest"?s.length:s}`,inputDependencies:["rank"]},getShaderSource:v,getRunData:()=>({outputs:[{dims:d,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(g/64)},programUniforms:[{type:12,data:g},{type:1,data:p},{type:1,data:l},...Y(s,d)]})}},Sd=e=>{let t=e.customDataBuffer;return new Uint32Array(t,t.byteOffset,1)[0]},nf=(e,t)=>{let i=[],r=[],a=[],o=Sd(e);if(t.antialias!==0)throw Error("Only default value (0) for Antialias attribute is supported");pd(e.inputs,t,o,i,r,a),e.compute(xd(e.inputs[0],t,o,i,r,a),{inputs:[0]})},sf=e=>{let t=e.antialias,i=e.axes,r=e.coordinateTransformMode,a=e.cubicCoeffA,o=e.excludeOutside!==0,s=e.extrapolationValue,l=e.keepAspectRatioPolicy,d=e.mode,p=e.nearestMode===""?"simple":e.nearestMode;return ge({antialias:t,axes:i,coordinateTransformMode:r,cubicCoeffA:a,excludeOutside:o,extrapolationValue:s,keepAspectRatioPolicy:l,mode:d,nearestMode:p})}}),kd,Td,of,f0=L(()=>{"use strict";ie(),le(),$e(),de(),kd=(e,t)=>{let[i,r,a,o]=e,{numHeads:s,rotaryEmbeddingDim:l}=t;if(i.dims.length!==3&&i.dims.length!==4)throw new Error(`Input 'x' is expected to have 3 or 4 dimensions, got ${i.dims.length}`);if(!O.areEqual(r.dims,[])&&!O.areEqual(r.dims,[1])&&r.dims.length!==2)throw new Error(`Input 'position_ids' is expected to have 0, 1, or 2 dimensions, got ${r.dims.length}`);if(a.dims.length!==2)throw new Error(`Input 'cos_cache' is expected to have 2 dimensions, got ${a.dims.length}`);if(o.dims.length!==2)throw new Error(`Input 'sin_cache' is expected to have 2 dimensions, got ${o.dims.length}`);if(!O.areEqual(a.dims,o.dims))throw new Error("Inputs 'cos_cache' and 'sin_cache' are expected to have the same shape");if(l>0&&s===0)throw new Error("num_heads must be provided if rotary_embedding_dim is specified");let d=i.dims[0],p=i.dims[i.dims.length-2],f=a.dims[0],m=O.sizeFromDimension(i.dims,1)/p,g=l===0?a.dims[1]*2:m/s;if(l>g)throw new Error("rotary_embedding_dim must be less than or equal to head_size");if(r.dims.length===2){if(d!==r.dims[0])throw new Error(`Input 'position_ids' dimension 0 should be of size batch_size, got ${r.dims[0]}`);if(p!==r.dims[1])throw new Error(`Input 'position_ids' dimension 1 should be of size sequence_length, got ${r.dims[1]}`)}if(g/2!==a.dims[1]&&l/2!==a.dims[1])throw new Error(`Input 'cos_cache' dimension 1 should be same as head_size / 2 or rotary_embedding_dim / 2, got ${a.dims[1]}`);if(p>f)throw new Error("Updating cos_cache and sin_cache in RotaryEmbedding is not currently supported")},Td=(e,t)=>{let{interleaved:i,numHeads:r,rotaryEmbeddingDim:a,scale:o}=t,s=e[0].dims[0],l=O.sizeFromDimension(e[0].dims,1),d=e[0].dims[e[0].dims.length-2],p=l/d,f=e[2].dims[1],m=a===0?f*2:p/r,g=new Array(s,d,p/m,m-f),w=O.computeStrides(g),_=[{type:1,data:o},{type:12,data:g},{type:12,data:w},...e[0].dims.length===3?new Array({type:12,data:[l,p,m,1]}):[],...e[0].dims.length===4?new Array({type:12,data:[l,m,d*m,1]}):[],...Y(e[0].dims,e[1].dims,e[2].dims,e[3].dims,e[0].dims)],$=x=>{let v=M("input",e[0].dataType,e[0].dims.length),b=M("position_ids",e[1].dataType,e[1].dims.length),k=M("cos_cache",e[2].dataType,e[2].dims.length),T=M("sin_cache",e[3].dataType,e[3].dims.length),C=Z("output",e[0].dataType,e[0].dims.length);return x.registerUniforms([{name:"scale",type:"f32"},{name:"global_shape",type:"u32",length:g.length},{name:"global_strides",type:"u32",length:w.length},{name:"input_output_strides",type:"u32",length:w.length}]),`
        ${x.declareVariables(v,b,k,T,C)}

        ${x.mainStart(qt)}
          let half_rotary_emb_dim = uniforms.${k.name}_shape[1];
          let bsnh = global_idx / uniforms.global_strides % uniforms.global_shape;
          let size = uniforms.global_shape[0] * uniforms.global_strides[0];
          ${x.guardAgainstOutOfBoundsWorkgroupSizes("size")}

          if (bsnh[3] < half_rotary_emb_dim) {
            let position_ids_idx =
                ${b.broadcastedIndicesToOffset("bsnh.xy",Z("",b.type.tensor,2))};
            let position_id =
                u32(${b.getByOffset("position_ids_idx")}) + select(0, bsnh[1], position_ids_idx == 0);
            let i = dot(bsnh, uniforms.input_output_strides) + select(0, bsnh[3], ${i});
            let j = i + select(half_rotary_emb_dim, 1, ${i});
            let re = ${v.getByOffset("i")} * ${k.get("position_id","bsnh[3]")} -
                ${v.getByOffset("j")} * ${T.get("position_id","bsnh[3]")};
            ${C.setByOffset("i","re")}
            let im = ${v.getByOffset("i")} * ${T.get("position_id","bsnh[3]")} +
                ${v.getByOffset("j")} * ${k.get("position_id","bsnh[3]")};
            ${C.setByOffset("j","im")}
          } else {
            let k = dot(bsnh, uniforms.input_output_strides) + half_rotary_emb_dim;
            ${C.setByOffset("k",v.getByOffset("k"))}
          }
        }`};return{name:"RotaryEmbedding",shaderCache:{hint:ge({interleaved:i}).cacheKey,inputDependencies:["rank","rank","rank","rank"]},getShaderSource:$,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(O.size(g)/qt)},programUniforms:_})}},of=(e,t)=>{kd(e.inputs,t),e.compute(Td(e.inputs,t))}}),Id,Cd,uf,m0=L(()=>{"use strict";ie(),le(),de(),Id=e=>{if(!e||e.length<3)throw new Error("layerNorm requires at least 3 inputs.");let t=e[0],i=e[1],r=e[2];if(t.dataType!==i.dataType||t.dataType!==r.dataType)throw new Error("All inputs must have the same data type");if(t.dims.length!==3&&t.dims.length!==2)throw new Error("Input must be 2D or 3D");if(i.dims.length!==3&&i.dims.length!==2)throw new Error("Skip must be 2D or 3D");let a=t.dims[t.dims.length-1],o=t.dims[t.dims.length-2];if(i.dims[i.dims.length-1]!==a)throw new Error("Skip must have the same hidden size as input");if(i.dims[i.dims.length-2]!==o)throw new Error("Skip must have the same sequence length as input");if(r.dims.length!==1)throw new Error("Gamma must be 1D");if(r.dims[r.dims.length-1]!==a)throw new Error("Gamma must have the same hidden size as input");if(e.length>3){let s=e[3];if(s.dims.length!==1)throw new Error("Beta must be 1D");if(s.dims[s.dims.length-1]!==a)throw new Error("Beta must have the same hidden size as input")}if(e.length>4){let s=e[4];if(s.dims.length!==1)throw new Error("Bias must be 1D");if(s.dims[s.dims.length-1]!==a)throw new Error("Bias must have the same hidden size as input")}},Cd=(e,t,i,r)=>{let a=t.simplified,o=e[0].dims,s=O.size(o),l=o,d=s,p=o.slice(-1)[0],f=r?o.slice(0,-1).concat(1):[],m=!a&&e.length>3,g=e.length>4,w=r&&i>1,_=r&&i>2,$=i>3,x=64,v=be(p),b=[{type:12,data:d},{type:12,data:v},{type:12,data:p},{type:1,data:t.epsilon}],k=C=>{let E=[{name:"output_size",type:"u32"},{name:"components",type:"u32"},{name:"hidden_size",type:"u32"},{name:"epsilon",type:"f32"}],z=[M("x",e[0].dataType,e[0].dims,v),M("skip",e[1].dataType,e[1].dims,v),M("gamma",e[2].dataType,e[2].dims,v)];m&&z.push(M("beta",e[3].dataType,e[3].dims,v)),g&&z.push(M("bias",e[4].dataType,e[4].dims,v)),z.push(Z("output",e[0].dataType,l,v)),w&&z.push(Z("mean_output",1,f)),_&&z.push(Z("inv_std_output",1,f)),$&&z.push(Z("input_skip_bias_sum",e[0].dataType,l,v));let N=Te(e[0].dataType),W=Te(1,v);return`

      ${C.registerUniforms(E).declareVariables(...z)}
      var<workgroup> sum_shared : array<${W}, ${x}>;
      var<workgroup> sum_squared_shared : array<${W}, ${x}>;

      ${C.mainStart([x,1,1])}
        let ix = local_id.x;
        let iy = global_id.x / ${x};

        let hidden_size_vectorized: u32 = uniforms.hidden_size / uniforms.components;
        var stride = hidden_size_vectorized / ${x};
        let offset = ix * stride + iy * hidden_size_vectorized;
        let offset1d = stride * ix;
        if (ix == ${x-1}) {
          stride = hidden_size_vectorized - stride * ix;
        }
        for (var i: u32 = 0; i < stride; i++) {
          let skip_value = skip[offset + i];
          let bias_value = ${g?"bias[offset1d + i]":N+"(0.0)"};
          let input_value = x[offset + i];
          let value = input_value + skip_value + bias_value;
          ${$?"input_skip_bias_sum[offset + i] = value;":""}
          output[offset + i] = value;
          let f32_value = ${Ut(N,v,"value")};
          sum_shared[ix] += f32_value;
          sum_squared_shared[ix] += f32_value * f32_value;
        }
        workgroupBarrier();

        var reduce_size : u32 = ${x};
        for (var curr_size = reduce_size >> 1;  curr_size > 0; curr_size = reduce_size >> 1) {
          reduce_size = curr_size + (reduce_size & 1);
          if (ix < curr_size) {
            sum_shared[ix] += sum_shared[ix + reduce_size];
            sum_squared_shared[ix] += sum_squared_shared[ix + reduce_size];
          }
          workgroupBarrier();
        }

        let sum = sum_shared[0];
        let square_sum = sum_squared_shared[0];
        let mean = ${mt("sum",v)} / f32(uniforms.hidden_size);
        let inv_std_dev = inverseSqrt(${mt("square_sum",v)} / f32(uniforms.hidden_size) ${a?"":"- mean * mean"} + uniforms.epsilon);
        ${w?"mean_output[global_idx] = mean;":""}
        ${_?"inv_std_output[global_idx] = inv_std_dev;":""}

        for (var i: u32 = 0; i < stride; i++) {
          output[offset + i] = (output[offset + i] ${a?"":`- ${N}(mean)`}) *
            ${N}(inv_std_dev) * gamma[offset1d + i]
            ${m?"+ beta[offset1d + i]":""};
        }
      }`},T=[{dims:l,dataType:e[0].dataType}];return i>1&&T.push({dims:f,dataType:1}),i>2&&T.push({dims:f,dataType:1}),i>3&&T.push({dims:o,dataType:e[0].dataType}),{name:"SkipLayerNormalization",shaderCache:{hint:`${v};${w};${_};${$}`,inputDependencies:e.map((C,E)=>"type")},getShaderSource:k,getRunData:()=>({outputs:T,dispatchGroup:{x:Math.ceil(d/p)},programUniforms:b})}},uf=(e,t)=>{Id(e.inputs);let i=[0];e.outputCount>1&&i.push(-3),e.outputCount>2&&i.push(-3),e.outputCount>3&&i.push(3),e.compute(Cd(e.inputs,t,e.outputCount,!1),{outputs:i})}}),Ed,rr,zd,da,Ad,Od,lf,df,g0=L(()=>{"use strict";ie(),le(),$e(),de(),Ed=(e,t)=>{if(!e||e.length<1)throw new Error("too few inputs");if(t.axes.length!==0){if(t.axes.length!==t.starts.length||t.axes.length!==t.ends.length)throw new Error("axes, starts and ends must have the same length")}else if(t.starts.length!==t.ends.length)throw new Error("starts and ends must have the same length");e.slice(1).forEach((i,r)=>{if(e[r+1].dataType!==6&&e[r+1].dataType!==7)throw new Error(`Input ${r} must be an array of int32 or int64`)})},rr=(e,t)=>{let i=[];if(e.length>t)if(e[t].dataType===7)e[t].getBigInt64Array().forEach(r=>i.push(Number(r)));else if(e[t].dataType===6)e[t].getInt32Array().forEach(r=>i.push(Number(r)));else throw new Error(`Input ${t} must be an array of int32 or int64`);return i},zd=(e,t)=>{if(e.length>1){let i=rr(e,1),r=rr(e,2),a=rr(e,3);return a.length===0&&(a=[...Array(e[0].dims.length).keys()]),ge({starts:i,ends:r,axes:a})}else return t},da=(e,t,i,r,a)=>{let o=e;return e<0&&(o+=i[r[t]]),a[t]<0?Math.max(0,Math.min(o,i[r[t]]-1)):Math.max(0,Math.min(o,i[r[t]]))},Ad=(e,t,i)=>`fn calculateInputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
          var input_indices: ${e.type.indices};
          var carry = 0u;
          for (var i = ${i.length}; i >= 0; i--) {
            let input_shape_i = ${X("uniforms.input_shape","i",i.length)};
            let steps_i = ${X("uniforms.steps","i",i.length)};
            let signs_i = ${X("uniforms.signs","i",i.length)};
            let starts_i = ${X("uniforms.starts","i",i.length)};
            var output_index = ${t.indicesGet("output_indices","i")};
            var input_index = output_index * steps_i + starts_i + carry;
            carry = input_index / input_shape_i;
            input_index = input_index % input_shape_i;
            if (signs_i < 0) {
              input_index = input_shape_i - input_index - 1u + starts_i;
            }
            ${e.indicesSet("input_indices","i","input_index")};
          }
          return input_indices;
      }`,Od=(e,t)=>{let i=e[0].dims,r=O.size(i),a=t.axes.length>0?O.normalizeAxes(t.axes,i.length):[...Array(i.length).keys()],o=rr(e,4);o.forEach(v=>v!==0||(()=>{throw new Error("step cannot be 0")})),o.length===0&&(o=Array(a.length).fill(1));let s=t.starts.map((v,b)=>da(v,b,i,a,o)),l=t.ends.map((v,b)=>da(v,b,i,a,o));if(a.length!==s.length||a.length!==l.length)throw new Error("start, ends and axes should have the same number of elements");if(a.length!==i.length)for(let v=0;v<i.length;++v)a.includes(v)||(s.splice(v,0,0),l.splice(v,0,i[v]),o.splice(v,0,1));let d=o.map(v=>Math.sign(v));o.forEach((v,b,k)=>{if(v<0){let T=(l[b]-s[b])/v,C=s[b],E=C+T*o[b];s[b]=E,l[b]=C,k[b]=-v}});let p=i.slice(0);a.forEach((v,b)=>{p[v]=Math.ceil((l[v]-s[v])/o[v])});let f={dims:p,dataType:e[0].dataType},m=Z("output",e[0].dataType,p.length),g=M("input",e[0].dataType,e[0].dims.length),w=O.size(p),_=[{name:"outputSize",type:"u32"},{name:"starts",type:"u32",length:s.length},{name:"signs",type:"i32",length:d.length},{name:"steps",type:"u32",length:o.length}],$=[{type:12,data:w},{type:12,data:s},{type:6,data:d},{type:12,data:o},...Y(e[0].dims,p)],x=v=>`
      ${v.registerUniforms(_).declareVariables(g,m)}
        ${Ad(g,m,i)}
        ${v.mainStart()}
          ${v.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
          let output_indices = ${m.offsetToIndices("global_idx")};
          let input_indices = calculateInputIndices(output_indices);
          ${m.setByOffset("global_idx",g.getByIndices("input_indices"))}
      }`;return{name:"Slice",shaderCache:{hint:`${d.length}_${s.length}_${o.length}`,inputDependencies:["rank"]},getShaderSource:x,getRunData:()=>({outputs:[f],dispatchGroup:{x:Math.ceil(r/64)},programUniforms:$})}},lf=(e,t)=>{Ed(e.inputs,t);let i=zd(e.inputs,t);e.compute(Od(e.inputs,i),{inputs:[0]})},df=e=>{let t=e.starts,i=e.ends,r=e.axes;return ge({starts:t,ends:i,axes:r})}}),Rd,Bd,pf,cf,y0=L(()=>{"use strict";ie(),le(),$e(),gt(),de(),Rd=e=>{if(!e||e.length!==1)throw new Error("Softmax op requires 1 input.")},Bd=(e,t)=>{let i=e.inputs[0],r=i.dims,a=O.size(r),o=r.length,s=O.normalizeAxis(t.axis,o),l=s<r.length-1,d,p=[];l?(p=Array.from({length:o},(z,N)=>N),p[s]=o-1,p[o-1]=s,d=e.compute(De(i,p),{inputs:[i],outputs:[-1]})[0]):d=i;let f=d.dims,m=f[o-1],g=a/m,w=be(m),_=m/w,$=64;g===1&&($=256);let x=(z,N)=>N===4?`max(max(${z}.x, ${z}.y), max(${z}.z, ${z}.w))`:N===2?`max(${z}.x, ${z}.y)`:N===3?`max(max(${z}.x, ${z}.y), ${z}.z)`:z,v=M("x",d.dataType,d.dims,w),b=Z("result",d.dataType,d.dims,w),k=v.type.value,T=Te(d.dataType)==="f32"?`var threadMax = ${k}(-3.402823e+38f);`:`var threadMax = ${k}(-65504.0h);`,C=z=>`
      var<workgroup> rowMaxShared : ${k};
      var<workgroup> rowSumShared : ${k};
      var<workgroup> threadShared : array<${k}, ${$}>;

      fn getValue(row: i32, col: i32, row_stride: i32) -> ${k} {
        let index = row * row_stride + col;
        return x[index];
      }

      fn setValue(row: i32, col: i32, row_stride: i32, value: ${k}) {
        let index = row * row_stride + col;
        result[index] = value;
      }
      ${z.registerUniform("packedCols","i32").declareVariables(v,b)}
      ${z.mainStart($)}
        let gindex = i32(global_idx);
        let lindex = i32(local_idx);
        const wg = ${$};
        let row = gindex / wg;
        let cols = uniforms.packedCols;
        let row_stride : i32 = uniforms.packedCols;

        // find the rows max
        ${T}
        for (var col = lindex; col < cols; col += wg) {
          let value = getValue(row, col, row_stride);
          threadMax = max(threadMax, value);
        }
        if (lindex < cols) {
          threadShared[lindex] = threadMax;
        }
        workgroupBarrier();

        var reduceSize = min(cols, wg);
        for (var currSize = reduceSize >> 1;  currSize > 0; currSize = reduceSize >> 1) {
          reduceSize = currSize + (reduceSize & 1);
          if (lindex < currSize) {
            threadShared[lindex] = max(threadShared[lindex], threadShared[lindex + reduceSize]);
          }
          workgroupBarrier();
        }
        if (lindex == 0) {
          rowMaxShared = ${k}(${x("threadShared[0]",w)});
        }
        workgroupBarrier();

        // find the rows sum
        var threadSum = ${k}(0.0);
        for (var col = lindex; col < cols; col += wg) {
          let subExp = exp(getValue(row, col, row_stride) - rowMaxShared);
          threadSum += subExp;
        }
        threadShared[lindex] = threadSum;
        workgroupBarrier();

        for (var currSize = wg >> 1;  currSize > 0; currSize = currSize >> 1) {
          if (lindex < currSize) {
            threadShared[lindex] = threadShared[lindex] + threadShared[lindex + currSize];
          }
          workgroupBarrier();
        }
        if (lindex == 0) {
          rowSumShared = ${k}(${mt("threadShared[0]",w)});
        }
        workgroupBarrier();

        // calculate final value for each element in the row
        for (var col = lindex; col < cols; col += wg) {
          let value = exp(getValue(row, col, row_stride) - rowMaxShared) / rowSumShared;
          setValue(row, col, row_stride, value);
        }
      }`,E=e.compute({name:"Softmax",shaderCache:{hint:`${w};${$}`,inputDependencies:["type"]},getRunData:()=>({outputs:[{dims:f,dataType:d.dataType}],dispatchGroup:{x:g},programUniforms:[{type:6,data:_}]}),getShaderSource:C},{inputs:[d],outputs:[l?-1:0]})[0];l&&e.compute(De(E,p),{inputs:[E]})},pf=(e,t)=>{Rd(e.inputs),Bd(e,t)},cf=e=>ge({axis:e.axis})}),pa,Md,Nd,Dd,hf,_0=L(()=>{"use strict";ie(),le(),de(),pa=e=>Array.from(e.getBigInt64Array(),Number),Md=e=>{if(!e||e.length!==2)throw new Error("Tile requires 2 inputs.");if(e[0].dataType!==1&&e[0].dataType!==10&&e[0].dataType!==6&&e[0].dataType!==12)throw new Error("Tile only support float, float16, int32, and uint32 data types");if(e[1].dataType!==7)throw new Error("Tile `repeats` input should be of int64 data type");if(e[1].dims.length!==1)throw new Error("Tile `repeats` input should be 1-D");if(pa(e[1]).length!==e[0].dims.length)throw new Error("Tile `repeats` input should have same number of elements as rank of input data tensor")},Nd=(e,t)=>{let i=[];for(let r=0;r<e.length;++r)i.push(e[r]*t[r]);return i},Dd=(e,t)=>{let i=e[0].dims,r=t??pa(e[1]),a=Nd(i,r),o=O.size(a),s=e[0].dataType,l=M("input",s,i.length),d=Z("output",s,a.length),p=f=>`
      const inputShape = ${l.indices(...i)};
      ${f.registerUniform("output_size","u32").declareVariables(l,d)}
      ${f.mainStart()}
      ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let output_indices = ${d.offsetToIndices("global_idx")};
      var input_indices: ${l.type.indices};
      for (var i = 0; i < ${i.length}; i++) {
        let input_dim_i = ${l.indicesGet("uniforms.input_shape","i")};
        let input_dim_value = ${d.indicesGet("output_indices","i")}  % input_dim_i;

        ${l.indicesSet("input_indices","i","input_dim_value")}
      }
      ${d.setByOffset("global_idx",l.getByIndices("input_indices"))}
    }`;return{name:"Tile",shaderCache:{hint:`${r}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:a,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(o/64)},programUniforms:[{type:12,data:o},...Y(e[0].dims,a)]}),getShaderSource:p}},hf=e=>{Md(e.inputs),e.compute(Dd(e.inputs),{inputs:[0]})}}),Pd,Ud,ff,w0=L(()=>{"use strict";ie(),le(),de(),Pd=(e,t,i,r,a)=>{let o=Z("output_data",a,i.length,4),s=M("a_data",t[1].dataType,t[1].dims.length,4),l=M("b_data",t[2].dataType,t[2].dims.length,4),d=M("c_data",t[0].dataType,t[0].dims.length,4),p,f=(m,g,w)=>`select(${g}, ${m}, ${w})`;if(!r)p=o.setByOffset("global_idx",f(s.getByOffset("global_idx"),l.getByOffset("global_idx"),d.getByOffset("global_idx")));else{let m=(g,w,_="")=>{let $=`a_data[index_a${w}][component_a${w}]`,x=`b_data[index_b${w}][component_b${w}]`,v=`bool(c_data[index_c${w}] & (0xffu << (component_c${w} * 8)))`;return`
            let output_indices${w} = ${o.offsetToIndices(`global_idx * 4u + ${w}u`)};
            let offset_a${w} = ${s.broadcastedIndicesToOffset(`output_indices${w}`,o)};
            let offset_b${w} = ${l.broadcastedIndicesToOffset(`output_indices${w}`,o)};
            let offset_c${w} = ${d.broadcastedIndicesToOffset(`output_indices${w}`,o)};
            let index_a${w} = offset_a${w} / 4u;
            let index_b${w} = offset_b${w} / 4u;
            let index_c${w} = offset_c${w} / 4u;
            let component_a${w} = offset_a${w} % 4u;
            let component_b${w} = offset_b${w} % 4u;
            let component_c${w} = offset_c${w} % 4u;
            ${g}[${w}] = ${_}(${f($,x,v)});
          `};a===9?p=`
            var data = vec4<u32>(0);
            ${m("data",0,"u32")}
            ${m("data",1,"u32")}
            ${m("data",2,"u32")}
            ${m("data",3,"u32")}
            output_data[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:p=`
            ${m("output_data[global_idx]",0)}
            ${m("output_data[global_idx]",1)}
            ${m("output_data[global_idx]",2)}
            ${m("output_data[global_idx]",3)}
          `}return`
        ${e.registerUniform("vec_size","u32").declareVariables(d,s,l,o)}
        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${p}
      }`},Ud=e=>{let t=e[1].dims,i=e[2].dims,r=e[0].dims,a=e[1].dataType,o=!(O.areEqual(t,i)&&O.areEqual(i,r)),s=t,l=O.size(t);if(o){let p=Wt.calcShape(Wt.calcShape(t,i,!1),r,!1);if(!p)throw new Error("Can't perform where op on the given tensors");s=p,l=O.size(s)}let d=Math.ceil(l/4);return{name:"Where",shaderCache:{inputDependencies:["rank","rank","rank"]},getShaderSource:p=>Pd(p,e,s,o,a),getRunData:()=>({outputs:[{dims:s,dataType:a}],dispatchGroup:{x:Math.ceil(l/64/4)},programUniforms:[{type:12,data:d},...Y(r,t,i,s)]})}},ff=e=>{e.compute(Ud(e.inputs))}}),mf,b0=L(()=>{"use strict";Ry(),Qa(),By(),My(),Ny(),Dy(),Py(),Vy(),Gy(),Hy(),jy(),Ky(),Qy(),Zy(),Xy(),Yy(),Jy(),e0(),t0(),r0(),i0(),a0(),n0(),s0(),o0(),Bh(),u0(),l0(),d0(),p0(),c0(),Ka(),h0(),f0(),m0(),g0(),y0(),Dh(),_0(),gt(),Za(),w0(),mf=new Map([["Abs",[uc]],["Acos",[lc]],["Acosh",[dc]],["Add",[Fc]],["ArgMax",[ac,xa]],["ArgMin",[ic,xa]],["Asin",[pc]],["Asinh",[cc]],["Atan",[hc]],["Atanh",[fc]],["Attention",[nc]],["AveragePool",[Hh,Gh]],["BatchNormalization",[sc]],["BiasAdd",[oc]],["BiasSplitGelu",[Vc]],["Cast",[gc,mc]],["Ceil",[_c]],["Clip",[yc]],["Concat",[eh,th]],["Conv",[Ea,Ca]],["ConvTranspose",[ph,dh]],["Cos",[wc]],["Cosh",[bc]],["CumSum",[ch,hh]],["DepthToSpace",[fh,mh]],["DequantizeLinear",[Jh,ef]],["Div",[Gc]],["Einsum",[gh,yh]],["Elu",[$c,or]],["Equal",[Hc]],["Erf",[vc]],["Exp",[xc]],["Expand",[_h]],["FastGelu",[wh]],["Floor",[Sc]],["FusedConv",[Ea,Ca]],["Gather",[$h,bh]],["GatherElements",[Ih,Th]],["GatherBlockQuantized",[Sh,kh]],["GatherND",[vh,xh]],["Gelu",[kc]],["Gemm",[Eh,Ch]],["GlobalAveragePool",[Kh,jh]],["GlobalMaxPool",[Yh,Xh]],["Greater",[Zc]],["GreaterOrEqual",[Yc]],["GridSample",[zh,Ah]],["GroupQueryAttention",[Ph]],["HardSigmoid",[Rc,Oc]],["InstanceNormalization",[Uh]],["LayerNormalization",[Wh]],["LeakyRelu",[Tc,or]],["Less",[Xc]],["LessOrEqual",[Jc]],["Log",[qc]],["MatMul",[qh]],["MatMulNBits",[Lh,Vh]],["MaxPool",[Qh,Zh]],["Mul",[jc]],["MultiHeadAttention",[Rh,Oh]],["Neg",[Cc]],["Not",[Ic]],["Pad",[Fh]],["Pow",[Kc]],["QuickGelu",[Lc,or]],["Range",[tf]],["Reciprocal",[Ec]],["ReduceMin",[Yp]],["ReduceMean",[jp]],["ReduceMax",[Xp]],["ReduceSum",[ec]],["ReduceProd",[Jp]],["ReduceL1",[Kp]],["ReduceL2",[Qp]],["ReduceLogSum",[rc]],["ReduceLogSumExp",[Zp]],["ReduceSumSquare",[tc]],["Relu",[zc]],["Resize",[nf,sf]],["RotaryEmbedding",[of]],["ScatterND",[af,rf]],["Sigmoid",[Ac]],["Sin",[Bc]],["Sinh",[Mc]],["Slice",[lf,df]],["SkipLayerNormalization",[uf]],["Split",[Mh,Nh]],["Sqrt",[Nc]],["Softmax",[pf,cf]],["Sub",[Qc]],["Tan",[Dc]],["Tanh",[Pc]],["ThresholdedRelu",[Wc,or]],["Tile",[hf]],["Transpose",[Mp,Np]],["Where",[ff]]])}),gf,$0=L(()=>{"use strict";Ze(),st(),de(),gf=class{constructor(e){this.backend=e,this.repo=new Map,this.attributesBound=!1}getArtifact(e){return this.repo.get(e)}setArtifact(e,t){this.repo.set(e,t)}run(e,t,i,r,a){Qe(e.programInfo.name);let o=this.backend.device,s=this.backend.getComputePassEncoder();this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2);let l=[];for(let p of t)l.push({binding:l.length,resource:{buffer:p.buffer}});for(let p of i)l.push({binding:l.length,resource:{buffer:p.buffer}});a&&l.push({binding:l.length,resource:a});let d=o.createBindGroup({layout:e.computePipeline.getBindGroupLayout(0),entries:l,label:e.programInfo.name});if(this.backend.sessionStatus==="capturing"){let p={kernelId:this.backend.currentKernelId,computePipeline:e.computePipeline,bindGroup:d,dispatchGroup:r};this.backend.capturedCommandList.get(this.backend.currentSessionId).push(p)}s.setPipeline(e.computePipeline),s.setBindGroup(0,d),s.dispatchWorkgroups(...r),this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2+1),this.backend.pendingDispatchNumber++,(this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber||this.backend.queryType==="at-passes")&&this.backend.endComputePass(),this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber&&this.backend.flush(),Le(e.programInfo.name)}dispose(){}build(e,t){Qe(e.name);let i=this.backend.device,r=[];[{feature:"shader-f16",extension:"f16"},{feature:"subgroups",extension:"subgroups"},{feature:"subgroups-f16",extension:"subgroups_f16"}].forEach(p=>{i.features.has(p.feature)&&r.push(`enable ${p.extension};`)});let a=Bp(t,this.backend.device.limits),o=e.getShaderSource(a),s=`${r.join(`
`)}
${a.additionalImplementations}
${o}`,l=i.createShaderModule({code:s,label:e.name});he("verbose",()=>`[WebGPU] ${e.name} shader code: ${s}`);let d=i.createComputePipeline({compute:{module:l,entryPoint:"main"},layout:"auto",label:e.name});return Le(e.name),{programInfo:e,computePipeline:d,uniformVariablesInfo:a.variablesInfo}}normalizeDispatchGroupSize(e){let t=typeof e=="number"?e:e.x,i=typeof e=="number"?1:e.y||1,r=typeof e=="number"?1:e.z||1,a=this.backend.device.limits.maxComputeWorkgroupsPerDimension;if(t<=a&&i<=a&&r<=a)return[t,i,r];let o=t*i*r,s=Math.ceil(Math.sqrt(o));if(s>a){if(s=Math.ceil(Math.cbrt(o)),s>a)throw new Error("Total dispatch size exceeds WebGPU maximum.");return[s,s,s]}else return[s,s,1]}}}),Wd,qd,Ld,Vd,yf,v0=L(()=>{"use strict";Ze(),ie(),st(),Cp(),Ay(),b0(),$0(),Wd=(e,t)=>{if(t.length!==e.length)throw new Error(`inputDependencies length ${t.length} is not equal to inputTensors length ${e.length}.`);let i=[];for(let r=0;r<e.length;++r){let a=e[r].dataType;switch(t[r]){case"none":{i.push("");break}case"type":{i.push(`${a}`);break}case"rank":{let o=e[r].dims.length;i.push(`${a};${o}`);break}case"dims":{let o=e[r].dims.join(",");i.push(`${a};${o}`);break}default:throw new Error(`unsupported input dependency: ${t[r]}`)}}return i.join("|")},qd=(e,t,i)=>{let r=e.name;return e.shaderCache?.hint&&(r+="["+e.shaderCache.hint+"]"),r+=":"+i+`:${Wd(t,e.shaderCache?.inputDependencies??new Array(t.length).fill("dims"))}`,r},Ld=class{constructor(e){e&&(this.architecture=e.architecture,this.vendor=e.vendor)}isArchitecture(e){return this.architecture===e}isVendor(e){return this.vendor===e}},Vd=class{constructor(e){this.subgroupsSupported=e.features.has("subgroups"),this.subgroupsF16Supported=e.features.has("subgroups");let t=e.limits;!this.subgroupsSupported||!t.minSubgroupSize||!t.maxSubgroupSize?this.subgroupSizeRange=void 0:this.subgroupSizeRange=[t.minSubgroupSize,t.maxSubgroupSize]}},yf=class{constructor(){this.currentSessionId=null,this.currentKernelId=null,this.commandEncoder=null,this.computePassEncoder=null,this.maxDispatchNumber=16,this.pendingDispatchNumber=0,this.pendingKernels=[],this.pendingQueries=new Map,this.sessionStatus="default",this.capturedCommandList=new Map,this.capturedPendingKernels=new Map,this.sessionExternalDataMapping=new Map}get currentKernelCustomData(){if(this.currentKernelId===null)throw new Error("currentKernelCustomData(): currentKernelId is null. (should not happen)");let e=this.kernelCustomData.get(this.currentKernelId);return e||(e={},this.kernelCustomData.set(this.currentKernelId,e)),e}async initialize(e,t){this.env=e;let i=[],r={requiredLimits:{maxComputeWorkgroupStorageSize:t.limits.maxComputeWorkgroupStorageSize,maxComputeWorkgroupsPerDimension:t.limits.maxComputeWorkgroupsPerDimension,maxStorageBufferBindingSize:t.limits.maxStorageBufferBindingSize,maxBufferSize:t.limits.maxBufferSize,maxComputeInvocationsPerWorkgroup:t.limits.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupSizeX:t.limits.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:t.limits.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:t.limits.maxComputeWorkgroupSizeZ},requiredFeatures:i},a=o=>t.features.has(o)&&i.push(o)&&!0;a("chromium-experimental-timestamp-query-inside-passes")||a("timestamp-query"),a("shader-f16"),a("subgroups")&&a("subgroups-f16"),this.device=await t.requestDevice(r),this.deviceInfo=new Vd(this.device),this.adapterInfo=new Ld(t.info||await t.requestAdapterInfo()),this.gpuDataManager=Ep(this),this.programManager=new gf(this),this.kernels=new Map,this.kernelPersistentData=new Map,this.kernelCustomData=new Map,Fa(e.logLevel,!!e.debug),this.device.onuncapturederror=o=>{o.error instanceof GPUValidationError&&console.error(`An uncaught WebGPU validation error was raised: ${o.error.message}`)},Object.defineProperty(this.env.webgpu,"device",{value:this.device,writable:!1,enumerable:!0,configurable:!1}),Object.defineProperty(this.env.webgpu,"adapter",{value:t,writable:!1,enumerable:!0,configurable:!1}),this.setQueryType()}dispose(){typeof this.querySet<"u"&&this.querySet.destroy(),this.gpuDataManager.dispose()}getCommandEncoder(){return this.commandEncoder||(this.commandEncoder=this.device.createCommandEncoder()),this.commandEncoder}getComputePassEncoder(){if(!this.computePassEncoder){let e=this.getCommandEncoder(),t={};this.queryType==="at-passes"&&(t.timestampWrites={querySet:this.querySet,beginningOfPassWriteIndex:this.pendingDispatchNumber*2,endOfPassWriteIndex:this.pendingDispatchNumber*2+1}),this.computePassEncoder=e.beginComputePass(t)}return this.computePassEncoder}endComputePass(){this.computePassEncoder&&(this.computePassEncoder.end(),this.computePassEncoder=null)}flush(){if(!this.commandEncoder)return;Qe(),this.endComputePass();let e;this.queryType!=="none"&&(this.commandEncoder.resolveQuerySet(this.querySet,0,this.pendingDispatchNumber*2,this.queryResolveBuffer,0),e=this.device.createBuffer({size:this.pendingDispatchNumber*2*8,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),this.pendingQueries.set(e,this.pendingKernels),this.pendingKernels=[],this.commandEncoder.copyBufferToBuffer(this.queryResolveBuffer,0,e,0,this.pendingDispatchNumber*2*8)),this.device.queue.submit([this.commandEncoder.finish()]),this.gpuDataManager.refreshPendingBuffers(),this.commandEncoder=null,this.pendingDispatchNumber=0,this.queryType!=="none"&&e.mapAsync(GPUMapMode.READ).then(()=>{let t=new BigUint64Array(e.getMappedRange()),i=this.pendingQueries.get(e);for(let r=0;r<t.length/2;r++){let a=i[r],o=a.kernelId,s=this.kernels.get(o),l=s.kernelType,d=s.kernelName,p=a.programName,f=a.inputTensorViews,m=a.outputTensorViews,g=t[r*2],w=t[r*2+1];typeof this.queryTimeBase>"u"&&(this.queryTimeBase=g);let _=Number(g-this.queryTimeBase),$=Number(w-this.queryTimeBase);if(!Number.isSafeInteger(_)||!Number.isSafeInteger($))throw new RangeError("incorrect timestamp range");if(this.env.webgpu.profiling?.ondata)this.env.webgpu.profiling.ondata({version:1,inputsMetadata:f.map(x=>({dims:x.dims,dataType:kt(x.dataType)})),outputsMetadata:m.map(x=>({dims:x.dims,dataType:kt(x.dataType)})),kernelId:o,kernelType:l,kernelName:d,programName:p,startTime:_,endTime:$});else{let x="";f.forEach((b,k)=>{x+=`input[${k}]: [${b.dims}] | ${kt(b.dataType)}, `});let v="";m.forEach((b,k)=>{v+=`output[${k}]: [${b.dims}] | ${kt(b.dataType)}, `}),console.log(`[profiling] kernel "${o}|${l}|${d}|${p}" ${x}${v}execution time: ${$-_} ns`)}dr("GPU",`${p}::${g}::${w}`)}e.unmap(),this.pendingQueries.delete(e)}),Le()}run(e,t,i,r,a,o){Qe(e.name);let s=[];for(let b=0;b<t.length;++b){let k=t[b].data;if(k===0)continue;let T=this.gpuDataManager.get(k);if(!T)throw new Error(`no GPU data for input: ${k}`);s.push(T)}let{outputs:l,dispatchGroup:d,programUniforms:p}=e.getRunData(t),f=i.length===0?l.map((b,k)=>k):i;if(f.length!==l.length)throw new Error(`Output size ${f.length} must be equal to ${l.length}.`);let m=[],g=[];for(let b=0;b<l.length;++b){if(!Number.isInteger(f[b])||f[b]<-3||f[b]>=o)throw new Error(`Invalid output index: ${f[b]}`);if(f[b]===-3)continue;let k=f[b]===-1,T=f[b]===-2,C=k||T?a(l[b].dataType,l[b].dims):r(f[b],l[b].dataType,l[b].dims);if(m.push(C),C.data===0)continue;let E=this.gpuDataManager.get(C.data);if(!E)throw new Error(`no GPU data for output: ${C.data}`);if(k&&this.temporaryData.push(E),T){let z=this.kernelPersistentData.get(this.currentKernelId);z||(z=[],this.kernelPersistentData.set(this.currentKernelId,z)),z.push(E)}g.push(E)}if(s.length!==t.length||g.length!==m.length){if(g.length===0)return Le(e.name),m;throw new Error(`Program ${e.name} has zero-sized tensor(s) in inputs or outputs. This is not supported now.`)}let w;if(p){let b=0,k=[];p.forEach(z=>{let N=typeof z.data=="number"?[z.data]:z.data;if(N.length===0)return;let W=z.type===10?2:4,H,V;z.type===10?(V=N.length>4?16:N.length>2?8:N.length*W,H=N.length>4?16:W*N.length):(V=N.length<=2?N.length*W:16,H=16),b=Math.ceil(b/V)*V,k.push(b);let G=z.type===10?8:4;b+=N.length>4?Math.ceil(N.length/G)*H:N.length*W});let T=16;b=Math.ceil(b/T)*T;let C=new ArrayBuffer(b);p.forEach((z,N)=>{let W=k[N],H=typeof z.data=="number"?[z.data]:z.data;if(z.type===6)new Int32Array(C,W,H.length).set(H);else if(z.type===12)new Uint32Array(C,W,H.length).set(H);else if(z.type===10)new Uint16Array(C,W,H.length).set(H);else if(z.type===1)new Float32Array(C,W,H.length).set(H);else throw new Error(`Unsupported uniform type: ${kt(z.type)}`)});let E=this.gpuDataManager.create(b,GPUBufferUsage.COPY_DST|GPUBufferUsage.UNIFORM);this.device.queue.writeBuffer(E.buffer,0,C,0,b),this.gpuDataManager.release(E.id),w={offset:0,size:b,buffer:E.buffer}}let _=this.programManager.normalizeDispatchGroupSize(d),$=_[1]===1&&_[2]===1,x=qd(e,t,$),v=this.programManager.getArtifact(x);if(v||(v=this.programManager.build(e,_),this.programManager.setArtifact(x,v),he("info",()=>`[artifact] key: ${x}, programName: ${e.name}`)),p&&v.uniformVariablesInfo){if(p.length!==v.uniformVariablesInfo.length)throw new Error(`Uniform variables count mismatch: expect ${v.uniformVariablesInfo.length}, got ${p.length} in program "${v.programInfo.name}".`);for(let b=0;b<p.length;b++){let k=p[b],T=k.type,C=typeof k.data=="number"?1:k.data.length,[E,z]=v.uniformVariablesInfo[b];if(T!==E||C!==z)throw new Error(`Uniform variable ${b} mismatch: expect type ${E} with size ${z}, got type ${T} with size ${C} in program "${v.programInfo.name}".`)}}if(he("info",()=>`[ProgramManager] run "${e.name}" (key=${x}) with ${_[0]}x${_[1]}x${_[2]}`),this.queryType!=="none"||this.sessionStatus==="capturing"){let b={kernelId:this.currentKernelId,programName:v.programInfo.name,inputTensorViews:t,outputTensorViews:m};this.pendingKernels.push(b),this.sessionStatus==="capturing"&&this.capturedPendingKernels.get(this.currentSessionId).push(b)}return this.programManager.run(v,s,g,_,w),Le(e.name),m}upload(e,t){this.gpuDataManager.upload(e,t)}memcpy(e,t){this.gpuDataManager.memcpy(e,t)}async download(e,t){await this.gpuDataManager.download(e,t)}alloc(e){return this.gpuDataManager.create(e).id}free(e){return this.gpuDataManager.release(e)}createKernel(e,t,i,r){let a=mf.get(e);if(!a)throw new Error(`kernel not implemented: ${e}`);let o={kernelType:e,kernelName:r,kernelEntry:a[0],attributes:[a[1],i]};this.kernels.set(t,o)}releaseKernel(e){let t=this.kernelPersistentData.get(e);if(t){for(let i of t)this.gpuDataManager.release(i.id);this.kernelPersistentData.delete(e)}this.kernelCustomData.delete(e),this.kernels.delete(e)}computeKernel(e,t,i){let r=this.kernels.get(e);if(!r)throw new Error(`kernel not created: ${e}`);let a=r.kernelType,o=r.kernelName,s=r.kernelEntry,l=r.attributes;if(this.currentKernelId!==null)throw new Error(`kernel "[${a}] ${o}" is not allowed to be called recursively`);this.currentKernelId=e,l[0]&&(l[1]=l[0](l[1]),l[0]=void 0),he("info",()=>`[WebGPU] Start to run kernel "[${a}] ${o}"...`);let d=this.env.debug;this.temporaryData=[];try{return d&&this.device.pushErrorScope("validation"),s(t,l[1]),0}catch(p){return i.push(Promise.resolve(`[WebGPU] Kernel "[${a}] ${o}" failed. ${p}`)),1}finally{d&&i.push(this.device.popErrorScope().then(p=>p?`GPU validation error for kernel "[${a}] ${o}": ${p.message}`:null));for(let p of this.temporaryData)this.gpuDataManager.release(p.id);this.temporaryData=[],this.currentKernelId=null}}registerBuffer(e,t,i,r){let a=this.sessionExternalDataMapping.get(e);a||(a=new Map,this.sessionExternalDataMapping.set(e,a));let o=a.get(t),s=this.gpuDataManager.registerExternalBuffer(i,r,o);return a.set(t,[s,i]),s}unregisterBuffers(e){let t=this.sessionExternalDataMapping.get(e);t&&(t.forEach(i=>this.gpuDataManager.unregisterExternalBuffer(i[0])),this.sessionExternalDataMapping.delete(e))}getBuffer(e){let t=this.gpuDataManager.get(e);if(!t)throw new Error(`no GPU data for buffer: ${e}`);return t.buffer}createDownloader(e,t,i){return async()=>{let r=await ba(this,e,t);return Ga(r.buffer,i)}}writeTimestamp(e){this.queryType==="inside-passes"&&this.computePassEncoder.writeTimestamp(this.querySet,e)}setQueryType(){this.queryType="none",(this.env.webgpu.profiling?.mode==="default"||(typeof this.env.trace>"u"?this.env.wasm.trace:this.env.trace))&&(this.device.features.has("chromium-experimental-timestamp-query-inside-passes")?this.queryType="inside-passes":this.device.features.has("timestamp-query")&&(this.queryType="at-passes"),this.queryType!=="none"&&typeof this.querySet>"u"&&(this.querySet=this.device.createQuerySet({type:"timestamp",count:this.maxDispatchNumber*2}),this.queryResolveBuffer=this.device.createBuffer({size:this.maxDispatchNumber*2*8,usage:GPUBufferUsage.COPY_SRC|GPUBufferUsage.QUERY_RESOLVE})))}captureBegin(){he("info","captureBegin"),this.capturedCommandList.get(this.currentSessionId)||this.capturedCommandList.set(this.currentSessionId,[]),this.capturedPendingKernels.get(this.currentSessionId)||this.capturedPendingKernels.set(this.currentSessionId,[]),this.flush(),this.sessionStatus="capturing"}captureEnd(){he("info","captureEnd"),this.flush(),this.sessionStatus="default"}replay(){he("info","replay"),this.sessionStatus="replaying";let e=this.capturedCommandList.get(this.currentSessionId),t=this.capturedPendingKernels.get(this.currentSessionId),i=e.length;this.pendingKernels=[];for(let r=0;r<i;r++){let a=this.getComputePassEncoder(),o=e[r];this.writeTimestamp(this.pendingDispatchNumber*2),a.setPipeline(o.computePipeline),a.setBindGroup(0,o.bindGroup),a.dispatchWorkgroups(...o.dispatchGroup),this.writeTimestamp(this.pendingDispatchNumber*2+1),this.pendingDispatchNumber++,this.queryType!=="none"&&this.pendingKernels.push(t[r]),(this.pendingDispatchNumber>=this.maxDispatchNumber||this.queryType==="at-passes")&&this.endComputePass(),this.pendingDispatchNumber>=this.maxDispatchNumber&&this.flush()}this.flush(),this.sessionStatus="default"}onCreateSession(){this.gpuDataManager.onCreateSession()}onReleaseSession(e){this.unregisterBuffers(e),this.capturedCommandList.has(e)&&this.capturedCommandList.delete(e),this.capturedPendingKernels.has(e)&&this.capturedPendingKernels.delete(e),this.gpuDataManager.onReleaseSession(e)}onRunStart(e){this.currentSessionId=e,this.setQueryType()}}}),Fd,ca,Gd,ha,fa,ma,Hd,_f,x0=L(()=>{"use strict";st(),Fd=1,ca=()=>Fd++,Gd=new Map([["float32",32],["float16",16],["int32",32],["uint32",32],["int64",64],["uint64",64],["int8",8],["uint8",8],["int4",4],["uint4",4]]),ha=(e,t)=>{let i=Gd.get(e);if(!i)throw new Error("Unsupported data type.");return t.length>0?Math.ceil(t.reduce((r,a)=>r*a)*i/8):0},fa=class{constructor(e){this.sessionId=e.sessionId,this.mlContext=e.context,this.mlTensor=e.tensor,this.dataType=e.dataType,this.tensorShape=e.shape}get tensor(){return this.mlTensor}get type(){return this.dataType}get shape(){return this.tensorShape}get byteLength(){return ha(this.dataType,this.tensorShape)}destroy(){he("verbose",()=>"[WebNN] TensorWrapper.destroy"),this.mlTensor.destroy()}write(e){this.mlContext.writeTensor(this.mlTensor,e)}async read(e){return e?this.mlContext.readTensor(this.mlTensor,e):this.mlContext.readTensor(this.mlTensor)}canReuseTensor(e,t,i){return this.mlContext===e&&this.dataType===t&&this.tensorShape.length===i.length&&this.tensorShape.every((r,a)=>r===i[a])}},ma=class{constructor(e,t){this.tensorManager=e,this.wrapper=t}get tensorWrapper(){return this.wrapper}releaseTensor(){this.tensorWrapper&&(this.tensorManager.releaseTensor(this.tensorWrapper),this.wrapper=void 0)}async ensureTensor(e,t,i,r){let a=this.tensorManager.getMLContext(e);if(this.wrapper){if(this.wrapper.canReuseTensor(a,t,i))return this.wrapper.tensor;if(r){if(this.wrapper.byteLength!==ha(t,i))throw new Error("Unable to copy data to tensor with different size.");this.activeUpload=new Uint8Array(await this.wrapper.read())}this.tensorManager.releaseTensor(this.wrapper)}let o=typeof MLTensorUsage>"u"?void 0:MLTensorUsage.READ|MLTensorUsage.WRITE;return this.wrapper=await this.tensorManager.getCachedTensor(e,t,i,o,!0,!0),r&&this.activeUpload&&(this.wrapper.write(this.activeUpload),this.activeUpload=void 0),this.wrapper.tensor}upload(e){if(this.wrapper)if(e.byteLength===this.wrapper.byteLength){this.wrapper.write(e);return}else he("verbose",()=>"Data size does not match tensor size. Releasing tensor."),this.releaseTensor();this.activeUpload?this.activeUpload.set(e):this.activeUpload=new Uint8Array(e)}async download(e){if(this.activeUpload)if(e){e instanceof ArrayBuffer?new Uint8Array(e).set(this.activeUpload):new Uint8Array(e.buffer,e.byteOffset,e.byteLength).set(this.activeUpload);return}else return this.activeUpload.buffer;if(!this.wrapper)throw new Error("Tensor has not been created.");return e?this.wrapper.read(e):this.wrapper.read()}},Hd=class{constructor(e){this.backend=e,this.tensorTrackersById=new Map,this.freeTensors=[],this.externalTensors=new Set}getMLContext(e){let t=this.backend.getMLContext(e);if(!t)throw new Error("MLContext not found for session.");return t}reserveTensorId(){let e=ca();return this.tensorTrackersById.set(e,new ma(this)),e}releaseTensorId(e){let t=this.tensorTrackersById.get(e);t&&(this.tensorTrackersById.delete(e),t.tensorWrapper&&this.releaseTensor(t.tensorWrapper))}async ensureTensor(e,t,i,r,a){he("verbose",()=>`[WebNN] TensorManager.ensureTensor {tensorId: ${t}, dataType: ${i}, shape: ${r}, copyOld: ${a}}`);let o=this.tensorTrackersById.get(t);if(!o)throw new Error("Tensor not found.");return o.ensureTensor(e,i,r,a)}upload(e,t){let i=this.tensorTrackersById.get(e);if(!i)throw new Error("Tensor not found.");i.upload(t)}async download(e,t){he("verbose",()=>`[WebNN] TensorManager.download {tensorId: ${e}, dstBuffer: ${t?.byteLength}}`);let i=this.tensorTrackersById.get(e);if(!i)throw new Error("Tensor not found.");return i.download(t)}releaseTensorsForSession(e){for(let t of this.freeTensors)t.sessionId===e&&t.destroy();this.freeTensors=this.freeTensors.filter(t=>t.sessionId!==e)}registerTensor(e,t,i,r){let a=this.getMLContext(e),o=ca(),s=new fa({sessionId:e,context:a,tensor:t,dataType:i,shape:r});return this.tensorTrackersById.set(o,new ma(this,s)),this.externalTensors.add(s),o}async getCachedTensor(e,t,i,r,a,o){let s=this.getMLContext(e);for(let[d,p]of this.freeTensors.entries())if(p.canReuseTensor(s,t,i)){he("verbose",()=>`[WebNN] Reusing tensor {dataType: ${t}, shape: ${i}}`);let f=this.freeTensors.splice(d,1)[0];return f.sessionId=e,f}he("verbose",()=>`[WebNN] MLContext.createTensor {dataType: ${t}, shape: ${i}}`);let l=await s.createTensor({dataType:t,shape:i,dimensions:i,usage:r,writable:a,readable:o});return new fa({sessionId:e,context:s,tensor:l,dataType:t,shape:i})}releaseTensor(e){this.externalTensors.has(e)&&this.externalTensors.delete(e),this.freeTensors.push(e)}},_f=(...e)=>new Hd(...e)}),Mr,jd,wf,S0=L(()=>{"use strict";ie(),At(),Cp(),x0(),st(),Mr=new Map([[1,"float32"],[10,"float16"],[6,"int32"],[12,"uint32"],[7,"int64"],[13,"uint64"],[22,"int4"],[21,"uint4"],[3,"int8"],[2,"uint8"],[9,"uint8"]]),jd=(e,t)=>{if(e===t)return!0;if(e===void 0||t===void 0)return!1;let i=Object.keys(e).sort(),r=Object.keys(t).sort();return i.length===r.length&&i.every((a,o)=>a===r[o]&&e[a]===t[a])},wf=class{constructor(e){this.tensorManager=_f(this),this.mlContextBySessionId=new Map,this.sessionIdsByMLContext=new Map,this.mlContextCache=[],this.sessionGraphInputs=new Map,this.temporaryGraphInputs=[],this.temporarySessionTensorIds=new Map,Fa(e.logLevel,!!e.debug)}get currentSessionId(){if(this.activeSessionId===void 0)throw new Error("No active session");return this.activeSessionId}onRunStart(e){he("verbose",()=>`[WebNN] onRunStart {sessionId: ${e}}`),this.activeSessionId=e}onRunEnd(e){he("verbose",()=>`[WebNN] onRunEnd {sessionId: ${e}}`);let t=this.temporarySessionTensorIds.get(e);if(t){for(let i of t)he("verbose",()=>`[WebNN] releasing temporary tensor {tensorId: ${i}}`),this.tensorManager.releaseTensorId(i);this.temporarySessionTensorIds.delete(e),this.activeSessionId=void 0}}async createMLContext(e){if(e instanceof GPUDevice){let i=this.mlContextCache.findIndex(r=>r.gpuDevice===e);if(i!==-1)return this.mlContextCache[i].mlContext;{let r=await navigator.ml.createContext(e);return this.mlContextCache.push({gpuDevice:e,mlContext:r}),r}}else if(e===void 0){let i=this.mlContextCache.findIndex(r=>r.options===void 0&&r.gpuDevice===void 0);if(i!==-1)return this.mlContextCache[i].mlContext;{let r=await navigator.ml.createContext();return this.mlContextCache.push({mlContext:r}),r}}let t=this.mlContextCache.findIndex(i=>jd(i.options,e));if(t!==-1)return this.mlContextCache[t].mlContext;{let i=await navigator.ml.createContext(e);return this.mlContextCache.push({options:e,mlContext:i}),i}}registerMLContext(e,t){this.mlContextBySessionId.set(e,t);let i=this.sessionIdsByMLContext.get(t);i||(i=new Set,this.sessionIdsByMLContext.set(t,i)),i.add(e),this.temporaryGraphInputs.length>0&&(this.sessionGraphInputs.set(e,this.temporaryGraphInputs),this.temporaryGraphInputs=[])}onReleaseSession(e){this.sessionGraphInputs.delete(e);let t=this.mlContextBySessionId.get(e);if(!t)return;this.tensorManager.releaseTensorsForSession(e),this.mlContextBySessionId.delete(e);let i=this.sessionIdsByMLContext.get(t);if(i.delete(e),i.size===0){this.sessionIdsByMLContext.delete(t);let r=this.mlContextCache.findIndex(a=>a.mlContext===t);r!==-1&&this.mlContextCache.splice(r,1)}}getMLContext(e){return this.mlContextBySessionId.get(e)}reserveTensorId(){return this.tensorManager.reserveTensorId()}releaseTensorId(e){he("verbose",()=>`[WebNN] releaseTensorId {tensorId: ${e}}`),this.tensorManager.releaseTensorId(e)}async ensureTensor(e,t,i,r,a){let o=Mr.get(i);if(!o)throw new Error(`Unsupported ONNX data type: ${i}`);return this.tensorManager.ensureTensor(e??this.currentSessionId,t,o,r,a)}async createTemporaryTensor(e,t,i){he("verbose",()=>`[WebNN] createTemporaryTensor {onnxDataType: ${t}, shape: ${i}}`);let r=Mr.get(t);if(!r)throw new Error(`Unsupported ONNX data type: ${t}`);let a=this.tensorManager.reserveTensorId();await this.tensorManager.ensureTensor(e,a,r,i,!1);let o=this.temporarySessionTensorIds.get(e);return o?o.push(a):this.temporarySessionTensorIds.set(e,[a]),a}uploadTensor(e,t){if(!ke().shouldTransferToMLTensor)throw new Error("Trying to upload to a MLTensor while shouldTransferToMLTensor is false");he("verbose",()=>`[WebNN] uploadTensor {tensorId: ${e}, data: ${t.byteLength}}`),this.tensorManager.upload(e,t)}async downloadTensor(e,t){return this.tensorManager.download(e,t)}createMLTensorDownloader(e,t){return async()=>{let i=await this.tensorManager.download(e);return Ga(i,t)}}registerMLTensor(e,t,i,r){let a=Mr.get(i);if(!a)throw new Error(`Unsupported ONNX data type: ${i}`);let o=this.tensorManager.registerTensor(e,t,a,r);return he("verbose",()=>`[WebNN] registerMLTensor {tensor: ${t}, dataType: ${a}, dimensions: ${r}} -> {tensorId: ${o}}`),o}registerMLConstant(e,t,i,r,a,o){if(!o)throw new Error("External mounted files are not available.");let s=e;e.startsWith("./")&&(s=e.substring(2));let l=o.get(s);if(!l)throw new Error(`File with name ${s} not found in preloaded files.`);if(t+i>l.byteLength)throw new Error("Out of bounds: data offset and length exceed the external file data size.");let d=l.slice(t,t+i).buffer,p;switch(a.dataType){case"float32":p=new Float32Array(d);break;case"float16":p=new Uint16Array(d);break;case"int32":p=new Int32Array(d);break;case"uint32":p=new Uint32Array(d);break;case"int64":p=new BigInt64Array(d);break;case"uint64":p=new BigUint64Array(d);break;case"int8":p=new Int8Array(d);break;case"int4":case"uint4":case"uint8":p=new Uint8Array(d);break;default:throw new Error(`Unsupported data type: ${a.dataType} in creating WebNN Constant from external data.`)}return he("verbose",()=>`[WebNN] registerMLConstant {dataType: ${a.dataType}, shape: ${a.shape}}}`),r.constant(a,p)}registerGraphInput(e){this.temporaryGraphInputs.push(e)}isGraphInput(e,t){let i=this.sessionGraphInputs.get(e);return i?i.includes(t):!1}flush(){}}}),bf={};cr(bf,{init:()=>$f});var Nr,Kd,$f,k0=L(()=>{"use strict";ie(),v0(),st(),le(),S0(),Nr=class vf{constructor(t,i,r,a){this.module=t,this.dataType=i,this.data=r,this.dims=a}getFloat32Array(){if(this.dataType!==1)throw new Error("Invalid data type");let t=O.size(this.dims);return t===0?new Float32Array:new Float32Array(this.module.HEAP8.buffer,this.data,t)}getBigInt64Array(){if(this.dataType!==7)throw new Error("Invalid data type");let t=O.size(this.dims);return t===0?new BigInt64Array:new BigInt64Array(this.module.HEAP8.buffer,this.data,t)}getInt32Array(){if(this.dataType!==6)throw new Error("Invalid data type");let t=O.size(this.dims);return t===0?new Int32Array:new Int32Array(this.module.HEAP8.buffer,this.data,t)}getUint16Array(){if(this.dataType!==10&&this.dataType!==4)throw new Error("Invalid data type");let t=O.size(this.dims);return t===0?new Uint16Array:new Uint16Array(this.module.HEAP8.buffer,this.data,t)}reshape(t){if(O.size(t)!==O.size(this.dims))throw new Error("Invalid new shape");return new vf(this.module,this.dataType,this.data,t)}},Kd=class{constructor(e,t,i){this.module=e,this.backend=t,this.customDataOffset=0,this.customDataSize=0,this.adapterInfo=t.adapterInfo,this.deviceInfo=t.deviceInfo;let r=e.PTR_SIZE,a=i/e.PTR_SIZE,o=r===4?"i32":"i64";this.opKernelContext=Number(e.getValue(r*a++,o));let s=Number(e.getValue(r*a++,o));this.outputCount=Number(e.getValue(r*a++,o)),this.customDataOffset=Number(e.getValue(r*a++,"*")),this.customDataSize=Number(e.getValue(r*a++,o));let l=[];for(let d=0;d<s;d++){let p=Number(e.getValue(r*a++,o)),f=Number(e.getValue(r*a++,"*")),m=Number(e.getValue(r*a++,o)),g=[];for(let w=0;w<m;w++)g.push(Number(e.getValue(r*a++,o)));l.push(new Nr(e,p,f,g))}this.inputs=l}get kernelCustomData(){return this.backend.currentKernelCustomData}get customDataBuffer(){return this.module.HEAPU8.subarray(this.customDataOffset,this.customDataOffset+this.customDataSize)}compute(e,t){let i=t?.inputs?.map(s=>typeof s=="number"?this.inputs[s]:s)??this.inputs,r=t?.outputs??[],a=(s,l,d)=>new Nr(this.module,l,this.output(s,d),d),o=(s,l)=>{let d=Tt(s,l);if(!d)throw new Error(`Unsupported data type: ${s}`);let p=d>0?this.backend.gpuDataManager.create(d).id:0;return new Nr(this.module,s,p,l)};return this.backend.run(e,i,r,a,o,this.outputCount)}output(e,t){let i=this.module.stackSave();try{let r=this.module.PTR_SIZE,a=r===4?"i32":"i64",o=this.module.stackAlloc((1+t.length)*r);this.module.setValue(o,t.length,a);for(let s=0;s<t.length;s++)this.module.setValue(o+r*(s+1),t[s],a);return this.module._JsepOutput(this.opKernelContext,e,o)}catch(r){throw new Error(`Failed to generate kernel's output[${e}] with dims [${t}]. If you are running with pre-allocated output, please make sure the output type/dims are correct. Error: ${r}`)}finally{this.module.stackRestore(i)}}},$f=async(e,t,i,r)=>{let a=t.jsepInit;if(!a)throw new Error("Failed to initialize JSEP. The WebAssembly module is not built with JSEP support.");if(e==="webgpu"){let o=new yf;await o.initialize(i,r),a("webgpu",[o,s=>o.alloc(Number(s)),s=>o.free(s),(s,l,d,p=!1)=>{if(p)he("verbose",()=>`[WebGPU] jsepCopyGpuToGpu: src=${Number(s)}, dst=${Number(l)}, size=${Number(d)}`),o.memcpy(Number(s),Number(l));else{he("verbose",()=>`[WebGPU] jsepCopyCpuToGpu: dataOffset=${Number(s)}, gpuDataId=${Number(l)}, size=${Number(d)}`);let f=t.HEAPU8.subarray(Number(s>>>0),Number(s>>>0)+Number(d));o.upload(Number(l),f)}},async(s,l,d)=>{he("verbose",()=>`[WebGPU] jsepCopyGpuToCpu: gpuDataId=${s}, dataOffset=${l}, size=${d}`),await o.download(Number(s),()=>t.HEAPU8.subarray(Number(l)>>>0,Number(l+d)>>>0))},(s,l,d)=>o.createKernel(s,Number(l),d,t.UTF8ToString(t._JsepGetNodeName(Number(l)))),s=>o.releaseKernel(s),(s,l,d,p)=>{he("verbose",()=>`[WebGPU] jsepRun: sessionHandle=${d}, kernel=${s}, contextDataOffset=${l}`);let f=new Kd(t,o,Number(l));return o.computeKernel(Number(s),f,p)},()=>o.captureBegin(),()=>o.captureEnd(),()=>o.replay()])}else{let o=new wf(i);a("webnn",[o,()=>o.reserveTensorId(),s=>o.releaseTensorId(s),async(s,l,d,p,f)=>o.ensureTensor(s,l,d,p,f),(s,l)=>{o.uploadTensor(s,l)},async(s,l)=>o.downloadTensor(s,l)])}}}),Qd,rn,an,ht,Zd,jr,nn,sn,ga,on,un,ln,xf=L(()=>{"use strict";Ey(),zy(),ie(),At(),Ua(),Ip(),Qd=(e,t)=>{ke()._OrtInit(e,t)!==0&&me("Can't initialize onnxruntime.")},rn=async e=>{Qd(e.wasm.numThreads,Vr(e.logLevel))},an=async(e,t)=>{{let i=(k0(),qr(bf)).init;if(t==="webgpu"){if(typeof navigator>"u"||!navigator.gpu)throw new Error("WebGPU is not supported in current environment");let r=e.webgpu.adapter;if(r){if(typeof r.limits!="object"||typeof r.features!="object"||typeof r.requestDevice!="function")throw new Error("Invalid GPU adapter set in `env.webgpu.adapter`. It must be a GPUAdapter object.")}else{let a=e.webgpu.powerPreference;if(a!==void 0&&a!=="low-power"&&a!=="high-performance")throw new Error(`Invalid powerPreference setting: "${a}"`);let o=e.webgpu.forceFallbackAdapter;if(o!==void 0&&typeof o!="boolean")throw new Error(`Invalid forceFallbackAdapter setting: "${o}"`);if(r=await navigator.gpu.requestAdapter({powerPreference:a,forceFallbackAdapter:o}),!r)throw new Error('Failed to get GPU adapter. You may need to enable flag "--enable-unsafe-webgpu" if you are using Chrome.')}await i("webgpu",ke(),e,r)}if(t==="webnn"){if(typeof navigator>"u"||!navigator.ml)throw new Error("WebNN is not supported in current environment");await i("webnn",ke(),e)}}},ht=new Map,Zd=e=>{let t=ke(),i=t.stackSave();try{let r=t.PTR_SIZE,a=t.stackAlloc(2*r);t._OrtGetInputOutputCount(e,a,a+r)!==0&&me("Can't get session input/output count.");let o=r===4?"i32":"i64";return[Number(t.getValue(a,o)),Number(t.getValue(a+r,o))]}finally{t.stackRestore(i)}},jr=e=>{let t=ke(),i=t._malloc(e.byteLength);if(i===0)throw new Error(`Can't create a session. failed to allocate a buffer of size ${e.byteLength}.`);return t.HEAPU8.set(e,i),[i,e.byteLength]},nn=async(e,t)=>{let i,r,a=ke();Array.isArray(e)?[i,r]=e:e.buffer===a.HEAPU8.buffer?[i,r]=[e.byteOffset,e.byteLength]:[i,r]=jr(e);let o=0,s=0,l=0,d=[],p=[],f=[];try{if([s,d]=Tp(t),t?.externalData&&a.mountExternalData){let b=[];for(let k of t.externalData){let T=typeof k=="string"?k:k.path;b.push(Va(typeof k=="string"?k:k.data).then(C=>{a.mountExternalData(T,C)}))}await Promise.all(b)}for(let b of t?.executionProviders??[])if((typeof b=="string"?b:b.name)==="webnn"){if(a.shouldTransferToMLTensor=!1,typeof b!="string"){let k=b,T=k?.context,C=k?.gpuDevice,E=k?.deviceType,z=k?.powerPreference;T?a.currentContext=T:C?a.currentContext=await a.jsepCreateMLContext(C):a.currentContext=await a.jsepCreateMLContext({deviceType:E,powerPreference:z})}else a.currentContext=await a.jsepCreateMLContext();break}o=await a._OrtCreateSession(i,r,s),o===0&&me("Can't create a session."),a.jsepOnCreateSession?.(),a.currentContext&&(a.jsepRegisterMLContext(o,a.currentContext),a.currentContext=void 0,a.shouldTransferToMLTensor=!0);let[m,g]=Zd(o),w=!!t?.enableGraphCapture,_=[],$=[],x=[];for(let b=0;b<m;b++){let k=a._OrtGetInputName(o,b);k===0&&me("Can't get an input name."),p.push(k),_.push(a.UTF8ToString(k))}for(let b=0;b<g;b++){let k=a._OrtGetOutputName(o,b);k===0&&me("Can't get an output name."),f.push(k);let T=a.UTF8ToString(k);$.push(T);{if(w&&t?.preferredOutputLocation===void 0){x.push("gpu-buffer");continue}let C=typeof t?.preferredOutputLocation=="string"?t.preferredOutputLocation:t?.preferredOutputLocation?.[T]??"cpu";if(C!=="cpu"&&C!=="cpu-pinned"&&C!=="gpu-buffer"&&C!=="ml-tensor")throw new Error(`Not supported preferred output location: ${C}.`);if(w&&C!=="gpu-buffer")throw new Error(`Not supported preferred output location: ${C}. Only 'gpu-buffer' location is supported when enableGraphCapture is true.`);x.push(C)}}let v=null;return x.some(b=>b==="gpu-buffer"||b==="ml-tensor")&&(l=a._OrtCreateBinding(o),l===0&&me("Can't create IO binding."),v={handle:l,outputPreferredLocations:x,outputPreferredLocationsEncoded:x.map(b=>wa(b))}),ht.set(o,[o,p,f,v,w,!1]),[o,_,$]}catch(m){throw p.forEach(g=>a._OrtFree(g)),f.forEach(g=>a._OrtFree(g)),l!==0&&a._OrtReleaseBinding(l)!==0&&me("Can't release IO binding."),o!==0&&a._OrtReleaseSession(o)!==0&&me("Can't release session."),m}finally{a._free(i),s!==0&&a._OrtReleaseSessionOptions(s)!==0&&me("Can't release session options."),d.forEach(m=>a._free(m)),a.unmountExternalData?.()}},sn=e=>{let t=ke(),i=ht.get(e);if(!i)throw new Error(`cannot release session. invalid session id: ${e}`);let[r,a,o,s,l]=i;s&&(l&&t._OrtClearBoundOutputs(s.handle)!==0&&me("Can't clear bound outputs."),t._OrtReleaseBinding(s.handle)!==0&&me("Can't release IO binding.")),t.jsepOnReleaseSession?.(e),a.forEach(d=>t._OrtFree(d)),o.forEach(d=>t._OrtFree(d)),t._OrtReleaseSession(r)!==0&&me("Can't release session."),ht.delete(e)},ga=async(e,t,i,r,a,o=!1)=>{if(!e){t.push(0);return}let s=ke(),l=s.PTR_SIZE,d=e[0],p=e[1],f=e[3],m=f,g,w;if(d==="string"&&(f==="gpu-buffer"||f==="ml-tensor"))throw new Error("String tensor is not supported on GPU.");if(o&&f!=="gpu-buffer")throw new Error(`External buffer must be provided for input/output index ${a} when enableGraphCapture is true.`);if(f==="gpu-buffer"){let x=e[2].gpuBuffer;w=Tt(Pt(d),p);let v=s.jsepRegisterBuffer;if(!v)throw new Error('Tensor location "gpu-buffer" is not supported without using WebGPU.');g=v(r,a,x,w)}else if(f==="ml-tensor"){let x=e[2].mlTensor;w=Tt(Pt(d),p);let v=s.jsepRegisterMLTensor;if(!v)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');g=v(r,x,Pt(d),p)}else{let x=e[2];if(Array.isArray(x)){w=l*x.length,g=s._malloc(w),i.push(g);for(let v=0;v<x.length;v++){if(typeof x[v]!="string")throw new TypeError(`tensor data at index ${v} is not a string`);s.setValue(g+v*l,Ee(x[v],i),"*")}}else{let v=s.jsepIsGraphInput;if(d!=="string"&&v){let b=s._OrtGetInputName(r,a),k=s.UTF8ToString(b);if(v(r,k)){let T=Pt(d);w=Tt(T,p),m="ml-tensor";let C=s.jsepCreateTemporaryTensor,E=s.jsepUploadTensor;if(!C||!E)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');let z=await C(r,T,p);E(z,new Uint8Array(x.buffer,x.byteOffset,x.byteLength)),g=z}else w=x.byteLength,g=s._malloc(w),i.push(g),s.HEAPU8.set(new Uint8Array(x.buffer,x.byteOffset,w),g)}else w=x.byteLength,g=s._malloc(w),i.push(g),s.HEAPU8.set(new Uint8Array(x.buffer,x.byteOffset,w),g)}}let _=s.stackSave(),$=s.stackAlloc(4*p.length);try{p.forEach((v,b)=>s.setValue($+b*l,v,l===4?"i32":"i64"));let x=s._OrtCreateTensor(Pt(d),g,w,$,p.length,wa(m));x===0&&me(`Can't create tensor for input/output. session=${r}, index=${a}.`),t.push(x)}finally{s.stackRestore(_)}},on=async(e,t,i,r,a,o)=>{let s=ke(),l=s.PTR_SIZE,d=ht.get(e);if(!d)throw new Error(`cannot run inference. invalid session id: ${e}`);let p=d[0],f=d[1],m=d[2],g=d[3],w=d[4],_=d[5],$=t.length,x=r.length,v=0,b=[],k=[],T=[],C=[],E=s.stackSave(),z=s.stackAlloc($*l),N=s.stackAlloc($*l),W=s.stackAlloc(x*l),H=s.stackAlloc(x*l);try{[v,b]=kp(o);for(let D=0;D<$;D++)await ga(i[D],k,C,e,t[D],w);for(let D=0;D<x;D++)await ga(a[D],T,C,e,$+r[D],w);for(let D=0;D<$;D++)s.setValue(z+D*l,k[D],"*"),s.setValue(N+D*l,f[t[D]],"*");for(let D=0;D<x;D++)s.setValue(W+D*l,T[D],"*"),s.setValue(H+D*l,m[r[D]],"*");if(g&&!_){let{handle:D,outputPreferredLocations:re,outputPreferredLocationsEncoded:te}=g;if(f.length!==$)throw new Error(`input count from feeds (${$}) is expected to be always equal to model's input count (${f.length}).`);for(let j=0;j<$;j++){let se=t[j];await s._OrtBindInput(D,f[se],k[j])!==0&&me(`Can't bind input[${j}] for session=${e}.`)}for(let j=0;j<x;j++){let se=r[j];a[j]?.[3]?s._OrtBindOutput(D,m[se],T[j],0)!==0&&me(`Can't bind pre-allocated output[${j}] for session=${e}.`):s._OrtBindOutput(D,m[se],0,te[se])!==0&&me(`Can't bind output[${j}] to ${re[j]} for session=${e}.`)}ht.set(e,[p,f,m,g,w,!0])}s.jsepOnRunStart?.(p);let V;g?V=await s._OrtRunWithBinding(p,g.handle,x,W,v):V=await s._OrtRun(p,N,z,$,H,x,W,v),V!==0&&me("failed to call OrtRun().");let G=[];for(let D=0;D<x;D++){let re=Number(s.getValue(W+D*l,"*"));if(re===T[D]){G.push(a[D]);continue}let te=s.stackSave(),j=s.stackAlloc(4*l),se=!1,pe,F=0;try{s._OrtGetTensorData(re,j,j+l,j+2*l,j+3*l)!==0&&me(`Can't access output tensor data on index ${D}.`);let ce=l===4?"i32":"i64",U=Number(s.getValue(j,ce));F=s.getValue(j+l,"*");let K=s.getValue(j+l*2,"*"),B=Number(s.getValue(j+l*3,ce)),ee=[];for(let Ce=0;Ce<B;Ce++)ee.push(Number(s.getValue(K+Ce*l,ce)));s._OrtFree(K)!==0&&me("Can't free memory for tensor dims.");let ve=ee.reduce((Ce,xe)=>Ce*xe,1);pe=kt(U);let Re=g?.outputPreferredLocations[r[D]];if(pe==="string"){if(Re==="gpu-buffer"||Re==="ml-tensor")throw new Error("String tensor is not supported on GPU.");let Ce=[];for(let xe=0;xe<ve;xe++){let tt=s.getValue(F+xe*l,"*"),Oe=s.getValue(F+(xe+1)*l,"*"),hr=xe===ve-1?void 0:Oe-tt;Ce.push(s.UTF8ToString(tt,hr))}G.push([pe,ee,Ce,"cpu"])}else if(Re==="gpu-buffer"&&ve>0){let Ce=s.jsepGetBuffer;if(!Ce)throw new Error('preferredLocation "gpu-buffer" is not supported without using WebGPU.');let xe=Ce(F),tt=Tt(U,ve);if(tt===void 0||!qa(pe))throw new Error(`Unsupported data type: ${pe}`);se=!0,G.push([pe,ee,{gpuBuffer:xe,download:s.jsepCreateDownloader(xe,tt,pe),dispose:()=>{s._OrtReleaseTensor(re)!==0&&me("Can't release tensor.")}},"gpu-buffer"])}else if(Re==="ml-tensor"&&ve>0){let Ce=s.jsepEnsureTensor;if(!Ce)throw new Error('preferredLocation "ml-tensor" is not supported without using WebNN.');if(Tt(U,ve)===void 0||!La(pe))throw new Error(`Unsupported data type: ${pe}`);let xe=await Ce(e,F,U,ee,!1);se=!0,G.push([pe,ee,{mlTensor:xe,download:s.jsepCreateMLTensorDownloader(F,pe),dispose:()=>{s.jsepReleaseTensorId(F),s._OrtReleaseTensor(re)}},"ml-tensor"])}else{let Ce=Wa(pe),xe=new Ce(ve);new Uint8Array(xe.buffer,xe.byteOffset,xe.byteLength).set(s.HEAPU8.subarray(F,F+xe.byteLength)),G.push([pe,ee,xe,"cpu"])}}finally{s.stackRestore(te),pe==="string"&&F&&s._free(F),se||s._OrtReleaseTensor(re),s.jsepOnRunEnd?.(p)}}return g&&!w&&(s._OrtClearBoundOutputs(g.handle)!==0&&me("Can't clear bound outputs."),ht.set(e,[p,f,m,g,w,!1])),G}finally{s.stackRestore(E),k.forEach(V=>s._OrtReleaseTensor(V)),T.forEach(V=>s._OrtReleaseTensor(V)),C.forEach(V=>s._free(V)),v!==0&&s._OrtReleaseRunOptions(v),b.forEach(V=>s._free(V))}},un=e=>{let t=ke(),i=ht.get(e);if(!i)throw new Error("invalid session id");let r=i[0],a=t._OrtEndProfiling(r);a===0&&me("Can't get an profile file name."),t._OrtFree(a)},ln=e=>{let t=[];for(let i of e){let r=i[2];!Array.isArray(r)&&"buffer"in r&&t.push(r.buffer)}return t}}),ft,We,Dt,ir,ar,Dr,ya,Pr,vt,xt,Xd,Sf,kf,Tf,If,Cf,Ef,zf,Af=L(()=>{"use strict";Ze(),xf(),At(),Da(),ft=()=>!!_e.wasm.proxy&&typeof document<"u",Dt=!1,ir=!1,ar=!1,Pr=new Map,vt=(e,t)=>{let i=Pr.get(e);i?i.push(t):Pr.set(e,[t])},xt=()=>{if(Dt||!ir||ar||!We)throw new Error("worker not ready")},Xd=e=>{switch(e.data.type){case"init-wasm":Dt=!1,e.data.err?(ar=!0,ya[1](e.data.err)):(ir=!0,ya[0]()),Dr&&(URL.revokeObjectURL(Dr),Dr=void 0);break;case"init-ep":case"copy-from":case"create":case"release":case"run":case"end-profiling":{let t=Pr.get(e.data.type);e.data.err?t.shift()[1](e.data.err):t.shift()[0](e.data.out);break}default:}},Sf=async()=>{if(!ir){if(Dt)throw new Error("multiple calls to 'initWasm()' detected.");if(ar)throw new Error("previous call to 'initWasm()' failed.");if(Dt=!0,ft())return new Promise((e,t)=>{We?.terminate(),xp().then(([i,r])=>{try{We=r,We.onerror=o=>t(o),We.onmessage=Xd,ya=[e,t];let a={type:"init-wasm",in:_e};!a.in.wasm.wasmPaths&&(i||import.meta.url?.startsWith("file:"))&&(a.in.wasm.wasmPaths={wasm:new URL("ort-wasm-simd-threaded.jsep.wasm",import.meta.url).href}),We.postMessage(a),Dr=i}catch(a){t(a)}},t)});try{await Pa(_e.wasm),await rn(_e),ir=!0}catch(e){throw ar=!0,e}finally{Dt=!1}}},kf=async e=>{if(ft())return xt(),new Promise((t,i)=>{vt("init-ep",[t,i]);let r={type:"init-ep",in:{epName:e,env:_e}};We.postMessage(r)});await an(_e,e)},Tf=async e=>ft()?(xt(),new Promise((t,i)=>{vt("copy-from",[t,i]);let r={type:"copy-from",in:{buffer:e}};We.postMessage(r,[e.buffer])})):jr(e),If=async(e,t)=>{if(ft()){if(t?.preferredOutputLocation)throw new Error('session option "preferredOutputLocation" is not supported for proxy.');return xt(),new Promise((i,r)=>{vt("create",[i,r]);let a={type:"create",in:{model:e,options:{...t}}},o=[];e instanceof Uint8Array&&o.push(e.buffer),We.postMessage(a,o)})}else return nn(e,t)},Cf=async e=>{if(ft())return xt(),new Promise((t,i)=>{vt("release",[t,i]);let r={type:"release",in:e};We.postMessage(r)});sn(e)},Ef=async(e,t,i,r,a,o)=>{if(ft()){if(i.some(s=>s[3]!=="cpu"))throw new Error("input tensor on GPU is not supported for proxy.");if(a.some(s=>s))throw new Error("pre-allocated output tensor is not supported for proxy.");return xt(),new Promise((s,l)=>{vt("run",[s,l]);let d=i,p={type:"run",in:{sessionId:e,inputIndices:t,inputs:d,outputIndices:r,options:o}};We.postMessage(p,ln(d))})}else return on(e,t,i,r,a,o)},zf=async e=>{if(ft())return xt(),new Promise((t,i)=>{vt("end-profiling",[t,i]);let r={type:"end-profiling",in:e};We.postMessage(r)});un(e)}}),_a,Yd,Of,T0=L(()=>{"use strict";Ze(),Af(),ie(),Na(),Ip(),_a=(e,t)=>{switch(e.location){case"cpu":return[e.type,e.dims,e.data,"cpu"];case"gpu-buffer":return[e.type,e.dims,{gpuBuffer:e.gpuBuffer},"gpu-buffer"];case"ml-tensor":return[e.type,e.dims,{mlTensor:e.mlTensor},"ml-tensor"];default:throw new Error(`invalid data location: ${e.location} for ${t()}`)}},Yd=e=>{switch(e[3]){case"cpu":return new Ke(e[0],e[2],e[1]);case"gpu-buffer":{let t=e[0];if(!qa(t))throw new Error(`not supported data type: ${t} for deserializing GPU tensor`);let{gpuBuffer:i,download:r,dispose:a}=e[2];return Ke.fromGpuBuffer(i,{dataType:t,dims:e[1],download:r,dispose:a})}case"ml-tensor":{let t=e[0];if(!La(t))throw new Error(`not supported data type: ${t} for deserializing MLTensor tensor`);let{mlTensor:i,download:r,dispose:a}=e[2];return Ke.fromMLTensor(i,{dataType:t,dims:e[1],download:r,dispose:a})}default:throw new Error(`invalid data location: ${e[3]}`)}},Of=class{async fetchModelAndCopyToWasmMemory(e){return Tf(await Va(e))}async loadModel(e,t){Qe();let i;typeof e=="string"?i=await this.fetchModelAndCopyToWasmMemory(e):i=e,[this.sessionId,this.inputNames,this.outputNames]=await If(i,t),Le()}async dispose(){return Cf(this.sessionId)}async run(e,t,i){Qe();let r=[],a=[];Object.entries(e).forEach(m=>{let g=m[0],w=m[1],_=this.inputNames.indexOf(g);if(_===-1)throw new Error(`invalid input '${g}'`);r.push(w),a.push(_)});let o=[],s=[];Object.entries(t).forEach(m=>{let g=m[0],w=m[1],_=this.outputNames.indexOf(g);if(_===-1)throw new Error(`invalid output '${g}'`);o.push(w),s.push(_)});let l=r.map((m,g)=>_a(m,()=>`input "${this.inputNames[a[g]]}"`)),d=o.map((m,g)=>m?_a(m,()=>`output "${this.outputNames[s[g]]}"`):null),p=await Ef(this.sessionId,a,l,s,d,i),f={};for(let m=0;m<p.length;m++)f[this.outputNames[s[m]]]=o[m]??Yd(p[m]);return Le(),f}startProfiling(){}endProfiling(){zf(this.sessionId)}}}),Rf={};cr(Rf,{OnnxruntimeWebAssemblyBackend:()=>Oa,initializeFlags:()=>Aa,wasmBackend:()=>Bf});var Aa,Oa,Bf,I0=L(()=>{"use strict";Ze(),Af(),T0(),Aa=()=>{if((typeof _e.wasm.initTimeout!="number"||_e.wasm.initTimeout<0)&&(_e.wasm.initTimeout=0),_e.wasm.simd===!1&&console.warn('Deprecated property "env.wasm.simd" is set to false. non-SIMD build is no longer provided, and this setting will be ignored.'),typeof _e.wasm.proxy!="boolean"&&(_e.wasm.proxy=!1),typeof _e.wasm.trace!="boolean"&&(_e.wasm.trace=!1),typeof _e.wasm.numThreads!="number"||!Number.isInteger(_e.wasm.numThreads)||_e.wasm.numThreads<=0)if(typeof self<"u"&&!self.crossOriginIsolated)_e.wasm.numThreads=1;else{let e=typeof navigator>"u"?cy("node:os").cpus().length:navigator.hardwareConcurrency;_e.wasm.numThreads=Math.min(4,Math.ceil((e||1)/2))}},Oa=class{async init(e){Aa(),await Sf(),await kf(e)}async createInferenceSessionHandler(e,t){let i=new Of;return await i.loadModel(e,t),Promise.resolve(i)}},Bf=new Oa});Ze();Ze();Ze();var C0="1.21.0",E0=yp;{let e=(I0(),qr(Rf)).wasmBackend;It("webgpu",e,5),It("webnn",e,5),It("cpu",e,10),It("wasm",e,10)}Object.defineProperty(_e.versions,"web",{value:C0,enumerable:!0});var Kr={SAMPLE_RATE:44100,FFT_SIZE:4096,HOP_SIZE:1024,TRAINING_SAMPLES:343980,MODEL_SPEC_BINS:2048,MODEL_SPEC_FRAMES:336,SEGMENT_OVERLAP:.25,TRACKS:["drums","bass","other","vocals"],DEFAULT_MODEL_URL:"https://huggingface.co/timcsy/demucs-web-onnx/resolve/main/htdemucs_embedded.onnx"};var dn=new Map,pn=new Map,cn=new Map;function z0(e){if(dn.has(e))return dn.get(e);let t=new Float32Array(e/2),i=new Float32Array(e/2);for(let a=0;a<e/2;a++){let o=-2*Math.PI*a/e;t[a]=Math.cos(o),i[a]=Math.sin(o)}let r={real:t,imag:i};return dn.set(e,r),r}function A0(e){if(pn.has(e))return pn.get(e);let t=new Float32Array(e/2),i=new Float32Array(e/2);for(let a=0;a<e/2;a++){let o=2*Math.PI*a/e;t[a]=Math.cos(o),i[a]=Math.sin(o)}let r={real:t,imag:i};return pn.set(e,r),r}function hn(e){if(cn.has(e))return cn.get(e);let t=new Float32Array(e);for(let i=0;i<e;i++)t[i]=.5*(1-Math.cos(2*Math.PI*i/e));return cn.set(e,t),t}function Nf(e,t){let i=0;for(let r=0;r<t;r++)i=i<<1|e&1,e>>=1;return i}function Df(e,t,i,r){let a=Math.log2(r)|0,o=z0(r);for(let s=0;s<r;s++){let l=Nf(s,a);e[s]=i[l],t[s]=0}for(let s=2;s<=r;s*=2){let l=s/2,d=r/s;for(let p=0;p<r;p+=s)for(let f=0;f<l;f++){let m=f*d,g=o.real[m],w=o.imag[m],_=p+f,$=p+f+l,x=e[_],v=t[_],b=e[$]*g-t[$]*w,k=e[$]*w+t[$]*g;e[_]=x+b,t[_]=v+k,e[$]=x-b,t[$]=v-k}}}function Pf(e,t,i,r,a){let o=Math.log2(a)|0,s=A0(a);for(let l=0;l<a;l++){let d=Nf(l,o);e[l]=i[d],t[l]=r[d]}for(let l=2;l<=a;l*=2){let d=l/2,p=a/l;for(let f=0;f<a;f+=l)for(let m=0;m<d;m++){let g=m*p,w=s.real[g],_=s.imag[g],$=f+m,x=f+m+d,v=e[$],b=t[$],k=e[x]*w-t[x]*_,T=e[x]*_+t[x]*w;e[$]=v+k,t[$]=b+T,e[x]=v-k,t[x]=b-T}}for(let l=0;l<a;l++)e[l]/=a,t[l]/=a}function Qr(e,t,i){let r=Math.floor((e.length-t)/i)+1,a=t/2+1,o=hn(t),s=1/Math.sqrt(t),l=new Float32Array(r*a),d=new Float32Array(r*a),p=new Float32Array(t),f=new Float32Array(t),m=new Float32Array(t);for(let g=0;g<r;g++){let w=g*i;for(let $=0;$<t;$++)m[$]=e[w+$]*o[$];Df(p,f,m,t);let _=g*a;for(let $=0;$<a;$++)l[_+$]=p[$]*s,d[_+$]=f[$]*s}return{real:l,imag:d,numFrames:r,numBins:a}}function Zr(e,t,i,r,a,o,s){let l=s||(i-1)*o+a,d=new Float32Array(l),p=new Float32Array(l),f=hn(a),m=Math.sqrt(a),g=new Float32Array(a),w=new Float32Array(a),_=new Float32Array(a),$=new Float32Array(a);for(let x=0;x<i;x++){g.fill(0),w.fill(0);for(let b=0;b<r;b++)g[b]=e[x*r+b],w[b]=t[x*r+b];for(let b=1;b<r-1;b++)g[a-b]=g[b],w[a-b]=-w[b];Pf(_,$,g,w,a);let v=x*o;for(let b=0;b<a&&v+b<l;b++)d[v+b]+=_[b]*f[b]*m,p[v+b]+=f[b]*f[b]}for(let x=0;x<l;x++)p[x]>1e-8&&(d[x]/=p[x]);return d}function Lt(e,t,i){let r=e.length,a=new Float32Array(t+r+i);for(let o=0;o<t;o++){let s=Math.min(t-o,r-1);a[o]=e[s]}a.set(e,t);for(let o=0;o<i;o++){let s=Math.max(0,r-2-o);a[t+r+o]=e[s]}return a}var{SAMPLE_RATE:o_,FFT_SIZE:Rt,HOP_SIZE:Vt,TRAINING_SAMPLES:yt,MODEL_SPEC_BINS:Yr,MODEL_SPEC_FRAMES:Jr,SEGMENT_OVERLAP:O0,TRACKS:Uf}=Kr;function Wf(e){let r=Yr,a=Jr,o=[];for(let s=0;s<4;s++){let l={leftReal:new Float32Array(r*a),leftImag:new Float32Array(r*a),rightReal:new Float32Array(r*a),rightImag:new Float32Array(r*a)};for(let d=0;d<a;d++)for(let p=0;p<r;p++){let f=s*4*r*a,m=p*a+d;l.leftReal[m]=e[f+0*r*a+p*a+d],l.leftImag[m]=e[f+1*r*a+p*a+d],l.rightReal[m]=e[f+2*r*a+p*a+d],l.rightImag[m]=e[f+3*r*a+p*a+d]}o.push(l)}return o}function qf(e,t){let i=Yr,r=Jr,a=Vt,o=i+1,s=r+4,l=(b,k)=>{let T=new Float32Array(s*o),C=new Float32Array(s*o);for(let E=0;E<r;E++)for(let z=0;z<i;z++){let N=z*r+E,H=(E+2)*o+z;T[H]=b[N],C[H]=k[N]}return{real:T,imag:C}},d=l(e.leftReal,e.leftImag),p=l(e.rightReal,e.rightImag),f=Rt/2,m=Math.floor(a/2)*3,g=(s-1)*a+Rt,w=Zr(d.real,d.imag,s,o,Rt,a,g),_=Zr(p.real,p.imag,s,o,Rt,a,g),$=f+m,x=w.subarray($,$+t),v=_.subarray($,$+t);return{left:new Float32Array(x),right:new Float32Array(v)}}function Lf(e,t){let i=yt,r=new Float32Array(i),a=new Float32Array(i),o=Math.min(e.length,i);r.set(e.subarray(0,o)),a.set(t.subarray(0,o));let s=Math.ceil(i/Vt),l=Math.floor(Vt/2)*3,d=l+s*Vt-i,p=Lt(r,l,d),f=Lt(a,l,d),m=Rt/2,g=Lt(p,m,m),w=Lt(f,m,m),_=Qr(g,Rt,Vt),$=Qr(w,Rt,Vt),x=Yr,v=Jr,b=2,k=new Float32Array(4*x*v);for(let C=0;C<v;C++){let E=C+b;for(let z=0;z<x;z++){let N=E*_.numBins+z;k[0*x*v+z*v+C]=_.real[N],k[1*x*v+z*v+C]=_.imag[N],k[2*x*v+z*v+C]=$.real[N],k[3*x*v+z*v+C]=$.imag[N]}}let T=new Float32Array(2*i);return T.set(r,0),T.set(a,i),{waveform:T,magSpec:k,numBins:x,numFrames:v,originalLength:e.length}}var Xr=class{constructor(t={}){this.ort=t.ort||null,this.session=null,this.modelPath=t.modelPath||"./htdemucs_embedded.onnx",this.sessionOptions=t.sessionOptions||{},this.onProgress=t.onProgress||(()=>{}),this.onLog=t.onLog||(()=>{}),this.onDownloadProgress=t.onDownloadProgress||(()=>{})}async loadModel(t){if(!this.ort)throw new Error("ONNX Runtime not provided. Pass ort in constructor options.");this.onLog("model","Loading model...");let i;if(t instanceof ArrayBuffer)i=t;else{let a=await fetch(t||this.modelPath),o=a.headers.get("Content-Length");if(o&&a.body){let s=parseInt(o,10),l=a.body.getReader(),d=[],p=0;for(;;){let{done:g,value:w}=await l.read();if(g)break;d.push(w),p+=w.length,this.onDownloadProgress(p,s)}let f=new Uint8Array(p),m=0;for(let g of d)f.set(g,m),m+=g.length;i=f.buffer}else i=await a.arrayBuffer()}let r={executionProviders:["webgpu","wasm"],graphOptimizationLevel:"basic"};return this.session=await this.ort.InferenceSession.create(i,{...r,...this.sessionOptions}),this.onLog("model","Model loaded successfully"),this.session}async separate(t,i){if(!this.session)throw new Error("Model not loaded. Call loadModel() first.");let r=t.length,a=Math.floor(yt*(1-O0)),o=Math.ceil((r-yt)/a)+1,s=Uf.map(()=>({left:new Float32Array(r),right:new Float32Array(r)})),l=new Float32Array(r),d=0;for(let p=0;p<r;p+=a){let m=Math.min(p+yt,r)-p,g=new Float32Array(yt),w=new Float32Array(yt);for(let V=0;V<m;V++)g[V]=t[p+V],w[V]=i[p+V];let _=Lf(g,w),$=new this.ort.Tensor("float32",_.waveform,[1,2,yt]),x=new this.ort.Tensor("float32",_.magSpec,[1,4,Yr,Jr]),v={};v[this.session.inputNames[0]]=$,this.session.inputNames.length>1&&(v[this.session.inputNames[1]]=x);let b=await this.session.run(v),k=null,T=null,C=null;for(let V of this.session.outputNames){let G=b[V];G.dims.length===4&&G.dims[2]===2?(k=G.data,T=G.dims):G.dims.length===5&&G.dims[2]===4&&(C=G.data)}if(!k)throw new Error("Could not find time-domain output tensor");let E=null;if(C){let V=Wf(C);E=[];for(let G=0;G<4;G++){let D=qf(V[G],yt),re=T[2],te=T[3],j=new Float32Array(te),se=new Float32Array(te);for(let F=0;F<te;F++)j[F]=k[G*re*te+0*te+F],se[F]=k[G*re*te+1*te+F];let pe={left:new Float32Array(te),right:new Float32Array(te)};for(let F=0;F<te;F++)pe.left[F]=j[F]+(D.left[F]||0),pe.right[F]=se[F]+(D.right[F]||0);E.push(pe)}}let z=T[1],N=T[2],W=T[3],H=new Float32Array(m);for(let V=0;V<m;V++){let G=Math.min(V/(a*.5),1),D=Math.min((m-V)/(a*.5),1);H[V]=Math.min(G,D)}for(let V=0;V<z;V++)for(let G=0;G<m&&p+G<r;G++){let D,re;if(E)D=E[V].left[G],re=E[V].right[G];else{let te=V*N*W+0*W+G,j=V*N*W+1*W+G;D=k[te],re=k[j]}s[V].left[p+G]+=D*H[G],s[V].right[p+G]+=re*H[G]}for(let V=0;V<m&&p+V<r;V++)l[p+V]+=H[V];d++,this.onProgress({progress:d/o,currentSegment:d,totalSegments:o})}for(let p=0;p<Uf.length;p++)for(let f=0;f<r;f++)l[f]>0&&(s[p].left[f]/=l[f],s[p].right[f]/=l[f]);return{drums:s[0],bass:s[1],other:s[2],vocals:s[3]}}};export{Kr as CONSTANTS,Xr as DemucsProcessor,Mf as ort};
/*! Bundled license information:

onnxruntime-web/dist/ort.bundle.min.mjs:
  (*!
   * ONNX Runtime Web v1.21.0
   * Copyright (c) Microsoft Corporation. All rights reserved.
   * Licensed under the MIT License.
   *)

onnxruntime-web/dist/ort.bundle.min.mjs:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   *)
  (**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   *)
  (**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   *)
*/
