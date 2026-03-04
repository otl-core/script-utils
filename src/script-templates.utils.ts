/**
 * Script Template Renderer
 *
 * Contains hardcoded embed snippets for each provider. This is the **only file**
 * that changes when a provider updates their snippet. All config values are
 * parameterized and sanitized before injection.
 */

import type { ScriptPlacement, ScriptProviderType } from "@otl-core/cms-types";

// ---------------------------------------------------------------------------
// Output Interface
// ---------------------------------------------------------------------------

export interface ScriptRenderOutput {
  /** External script URL (for <Script src={...}>) */
  src?: string;
  /** Inline JavaScript (for <Script dangerouslySetInnerHTML>) */
  inline?: string;
  /** <noscript> fallback HTML */
  noscript?: string;
  /** Secondary injection point (e.g., GTM needs head + body) */
  secondary?: {
    placement: ScriptPlacement;
    inline?: string;
    noscript?: string;
  };
}

// ---------------------------------------------------------------------------
// Sanitization Helper
// ---------------------------------------------------------------------------

/**
 * Sanitize a config value to prevent XSS in inline scripts.
 * Strips </script> sequences and other dangerous patterns.
 */
function sanitize(value: string): string {
  return value
    .replace(/<\/script>/gi, "")
    .replace(/<script/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "");
}

/**
 * Get a sanitized config value, returning empty string if missing.
 */
function cfg(config: Record<string, string>, key: string): string {
  const val = config[key];
  if (val === undefined || val === null) return "";
  return sanitize(val);
}

// ---------------------------------------------------------------------------
// Template Functions
// ---------------------------------------------------------------------------

function renderGoogleAnalytics4(
  config: Record<string, string>,
): ScriptRenderOutput {
  const measurementId = cfg(config, "measurement_id");
  return {
    src: `https://www.googletagmanager.com/gtag/js?id=${measurementId}`,
    inline: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${measurementId}');`,
  };
}

function renderGoogleTagManager(
  config: Record<string, string>,
): ScriptRenderOutput {
  const containerId = cfg(config, "container_id");
  return {
    inline: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${containerId}');`,
    secondary: {
      placement: "body_start",
      noscript: `<iframe src="https://www.googletagmanager.com/ns.html?id=${containerId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
    },
  };
}

function renderMatomo(config: Record<string, string>): ScriptRenderOutput {
  const serverUrl = cfg(config, "server_url");
  const siteId = cfg(config, "site_id");
  // Ensure trailing slash
  const url = serverUrl.endsWith("/") ? serverUrl : serverUrl + "/";
  return {
    inline: `var _paq=window._paq=window._paq||[];_paq.push(['trackPageView']);_paq.push(['enableLinkTracking']);(function(){var u='${url}';_paq.push(['setTrackerUrl',u+'matomo.php']);_paq.push(['setSiteId','${siteId}']);var d=document,g=d.createElement('script'),s=d.getElementsByTagName('script')[0];g.async=true;g.src=u+'matomo.js';s.parentNode.insertBefore(g,s);})();`,
  };
}

function renderPlausible(config: Record<string, string>): ScriptRenderOutput {
  const domain = cfg(config, "domain");
  const customApiHost = cfg(config, "custom_api_host");
  const baseUrl = customApiHost || "https://plausible.io";
  return {
    src: `${baseUrl}/js/script.js`,
    // data-domain attribute will be applied via the attributes field on ManagedScript
    // but we also need to ensure the consumer knows to add it
    inline: undefined,
  };
}

function renderFathom(config: Record<string, string>): ScriptRenderOutput {
  const siteId = cfg(config, "site_id");
  const customDomain = cfg(config, "custom_domain");
  const baseUrl = customDomain || "https://cdn.usefathom.com";
  return {
    src: `${baseUrl}/script.js`,
    // data-site attribute should be set via attributes on ManagedScript
    inline: undefined,
  };
}

function renderUmami(config: Record<string, string>): ScriptRenderOutput {
  const websiteId = cfg(config, "website_id");
  const scriptUrl = cfg(config, "script_url");
  return {
    src: scriptUrl,
    // data-website-id attribute should be set via attributes on ManagedScript
    inline: undefined,
  };
}

function renderPirsch(config: Record<string, string>): ScriptRenderOutput {
  const identificationCode = cfg(config, "identification_code");
  return {
    src: `https://api.pirsch.io/pirsch.js`,
    // id and data-code attributes should be set via attributes on ManagedScript
    inline: undefined,
  };
}

function renderSimpleAnalytics(
  config: Record<string, string>,
): ScriptRenderOutput {
  const customDomain = cfg(config, "custom_domain");
  const baseUrl = customDomain || "https://scripts.simpleanalyticscdn.com";
  return {
    src: `${baseUrl}/latest.js`,
    noscript: `<img src="${customDomain ? customDomain.replace("scripts.", "queue.") : "https://queue.simpleanalyticscdn.com"}/noscript.gif" alt="" referrerpolicy="no-referrer-when-downgrade" />`,
  };
}

function renderAdobeAnalytics(
  config: Record<string, string>,
): ScriptRenderOutput {
  const reportSuiteId = cfg(config, "report_suite_id");
  const trackingServer = cfg(config, "tracking_server");
  return {
    inline: `var s_account='${reportSuiteId}';`,
    src: `https://${trackingServer}/b/ss/${reportSuiteId}/1/JS-2.22.0/s_code.js`,
  };
}

function renderMixpanel(config: Record<string, string>): ScriptRenderOutput {
  const token = cfg(config, "token");
  return {
    inline: `(function(f,b){if(!b.__SV){var e,g,i,h;window.mixpanel=b;b._i=[];b.init=function(e,f,c){function g(a,d){var b=d.split('.');2==b.length&&(a=a[b[0]],d=b[1]);a[d]=function(){a.push([d].concat(Array.prototype.slice.call(arguments,0)))}}var a=b;'undefined'!==typeof c?a=b[c]=[]:c='mixpanel';a.people=a.people||[];a.toString=function(a){var d='mixpanel';'mixpanel'!==c&&(d+='.'+c);a||(d+=' (stub)');return d};a.people.toString=function(){return a.toString(1)+'.people (stub)'};i='disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove'.split(' ');for(h=0;h<i.length;h++)g(a,i[h]);var j='set set_once union unset remove delete'.split(' ');a.get_group=function(){function b(c){d[c]=function(){call2_args=arguments;call2=[c].concat(Array.prototype.slice.call(call2_args,0));a.push([e,call2])}}for(var d={},e=['get_group'].concat(Array.prototype.slice.call(arguments,0)),c=0;c<j.length;c++)b(j[c]);return d};b._i.push([e,f,c])};b.__SV=1.2;e=f.createElement('script');e.type='text/javascript';e.async=!0;e.src='undefined'!==typeof MIXPANEL_CUSTOM_LIB_URL?MIXPANEL_CUSTOM_LIB_URL:'file:'===f.location.protocol&&'//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js'.match(/^\\/\\//)? 'https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js':'//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js';g=f.getElementsByTagName('script')[0];g.parentNode.insertBefore(e,g)}})(document,window.mixpanel||[]);mixpanel.init('${token}');`,
  };
}

function renderAmplitude(config: Record<string, string>): ScriptRenderOutput {
  const apiKey = cfg(config, "api_key");
  return {
    inline: `!function(){"use strict";!function(e,t){var r=e.amplitude||{_q:[],_iq:{}};if(r.invoked)e.console&&console.error&&console.error("Amplitude snippet has been loaded.");else{var n=function(e,t){e.prototype[t]=function(){return this._q.push({name:t,args:Array.prototype.slice.call(arguments,0)}),this}},s=function(e,t,r){return function(n){e._q.push({name:t,args:Array.prototype.slice.call(arguments,0),resolve:r})}},o=function(e,t,r){e._q.push({name:t,args:Array.prototype.slice.call(arguments,0)})},i=function(e,t,r){e[t]=function(){if(r)return{promise:new Promise(r)};o(e,t,Array.prototype.slice.call(arguments,0))}},a=function(e){for(var t=0;t<m.length;t++)i(e,m[t],!1);for(var r=0;r<g.length;r++)i(e,g[r],!0)};r.invoked=!0;var c=t.createElement("script");c.type="text/javascript",c.integrity="sha384-PPfHw98myKtJkA9OdPBMQ6n8yvUaYk0EyUQccFSIQGmB0lMHw+kF1gxKJPRvdaU/",c.crossOrigin="anonymous",c.async=!0,c.src="https://cdn.amplitude.com/libs/analytics-browser-2.11.1-min.js.gz",c.onload=function(){e.amplitude.runQueuedFunctions||console.log("[Amplitude] Error: could not load SDK")};var u=t.getElementsByTagName("script")[0];u.parentNode.insertBefore(c,u);for(var l=function(){return this._q=[],this},p=["add","append","clearAll","prepend","set","setOnce","unset","preInsert","postInsert","remove","getUserProperties"],d=0;d<p.length;d++)n(l,p[d]);r.Identify=l;for(var f=function(){return this._q=[],this},v=["getEventProperties","setProductId","setQuantity","setPrice","setRevenue","setRevenueType","setEventProperties"],h=0;h<v.length;h++)n(f,v[h]);r.Revenue=f;var m=["getDeviceId","setDeviceId","getSessionId","setSessionId","getUserId","setUserId","setOptOut","setTransport","reset","extendSession"],g=["init","add","remove","track","logEvent","identify","groupIdentify","setGroup","revenue","flush"];a(r),r.createInstance=function(e){return r._iq[e]={_q:[]},a(r._iq[e]),r._iq[e]},e.amplitude=r}}(window,document)}();amplitude.init('${apiKey}');`,
  };
}

function renderHeap(config: Record<string, string>): ScriptRenderOutput {
  const appId = cfg(config, "app_id");
  return {
    inline: `window.heap=window.heap||[],heap.load=function(e,t){window.heap.appid=e,window.heap.config=t=t||{};var r=document.createElement("script");r.type="text/javascript",r.async=!0,r.src="https://cdn.heapanalytics.com/js/heap-"+e+".js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(r,a);for(var n=function(e){return function(){heap.push([e].concat(Array.prototype.slice.call(arguments,0)))}},p=["addEventProperties","addUserProperties","clearEventProperties","identify","resetIdentity","removeEventProperty","setEventProperties","track","unsetEventProperty"],o=0;o<p.length;o++)heap[p[o]]=n(p[o])};heap.load("${appId}");`,
  };
}

function renderPostHog(config: Record<string, string>): ScriptRenderOutput {
  const apiKey = cfg(config, "api_key");
  const apiHost = cfg(config, "api_host");
  return {
    inline: `!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys onSessionId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);posthog.init('${apiKey}',{api_host:'${apiHost}'});`,
  };
}

function renderSegment(config: Record<string, string>): ScriptRenderOutput {
  const writeKey = cfg(config, "write_key");
  return {
    inline: `!function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware"];analytics.factory=function(e){return function(){var t=Array.prototype.slice.call(arguments);t.unshift(e);analytics.push(t);return analytics}};for(var e=0;e<analytics.methods.length;e++){var key=analytics.methods[e];analytics[key]=analytics.factory(key)}analytics.load=function(key,e){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.src="https://cdn.segment.com/analytics.js/v1/"+key+"/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(t,n);analytics._loadOptions=e};analytics._writeKey="${writeKey}";analytics.SNIPPET_VERSION="4.15.3";analytics.load("${writeKey}");analytics.page()}}();`,
  };
}

function renderMicrosoftClarity(
  config: Record<string, string>,
): ScriptRenderOutput {
  const projectId = cfg(config, "project_id");
  return {
    inline: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script","${projectId}");`,
  };
}

function renderMetaPixel(config: Record<string, string>): ScriptRenderOutput {
  const pixelId = cfg(config, "pixel_id");
  return {
    inline: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixelId}');fbq('track','PageView');`,
    noscript: `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1" />`,
  };
}

function renderGoogleAds(config: Record<string, string>): ScriptRenderOutput {
  const conversionId = cfg(config, "conversion_id");
  const conversionLabel = cfg(config, "conversion_label");
  let inline = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${conversionId}');`;
  if (conversionLabel) {
    inline += `gtag('event','conversion',{'send_to':'${conversionId}/${conversionLabel}'});`;
  }
  return {
    src: `https://www.googletagmanager.com/gtag/js?id=${conversionId}`,
    inline,
  };
}

function renderLinkedInInsight(
  config: Record<string, string>,
): ScriptRenderOutput {
  const partnerId = cfg(config, "partner_id");
  return {
    inline: `_linkedin_partner_id="${partnerId}";window._linkedin_data_partner_ids=window._linkedin_data_partner_ids||[];window._linkedin_data_partner_ids.push(_linkedin_partner_id);(function(l){if(!l){window.lintrk=function(a,b){window.lintrk.q.push([a,b])};window.lintrk.q=[]}var s=document.getElementsByTagName("script")[0];var b=document.createElement("script");b.type="text/javascript";b.async=true;b.src="https://snap.licdn.com/li.lms-analytics/insight.min.js";s.parentNode.insertBefore(b,s);})(window.lintrk);`,
    noscript: `<img height="1" width="1" style="display:none;" alt="" src="https://px.ads.linkedin.com/collect/?pid=${partnerId}&fmt=gif" />`,
  };
}

function renderTikTokPixel(config: Record<string, string>): ScriptRenderOutput {
  const pixelId = cfg(config, "pixel_id");
  return {
    inline: `!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};ttq.load('${pixelId}');ttq.page();}(window,document,'ttq');`,
  };
}

function renderPinterestTag(
  config: Record<string, string>,
): ScriptRenderOutput {
  const tagId = cfg(config, "tag_id");
  return {
    inline: `!function(e){if(!window.pintrk){window.pintrk=function(){window.pintrk.queue.push(Array.prototype.slice.call(arguments))};var n=window.pintrk;n.queue=[],n.version="3.0";var t=document.createElement("script");t.async=!0,t.src=e;var r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(t,r)}}("https://s.pinimg.com/ct/core.js");pintrk('load','${tagId}');pintrk('page');`,
    noscript: `<img height="1" width="1" style="display:none;" alt="" src="https://ct.pinterest.com/v3/?event=init&tid=${tagId}&noscript=1" />`,
  };
}

function renderTwitterPixel(
  config: Record<string, string>,
): ScriptRenderOutput {
  const pixelId = cfg(config, "pixel_id");
  return {
    inline: `!function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments)},s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');twq('config','${pixelId}');`,
  };
}

function renderSnapchatPixel(
  config: Record<string, string>,
): ScriptRenderOutput {
  const pixelId = cfg(config, "pixel_id");
  return {
    inline: `(function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function(){a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};a.queue=[];var s='script';var r=t.createElement(s);r.async=!0;r.src=n;var u=t.getElementsByTagName(s)[0];u.parentNode.insertBefore(r,u)})(window,document,'https://sc-static.net/scevent.min.js');snaptr('init','${pixelId}',{});snaptr('track','PAGE_VIEW');`,
  };
}

function renderRedditPixel(config: Record<string, string>): ScriptRenderOutput {
  const pixelId = cfg(config, "pixel_id");
  return {
    inline: `!function(w,d){if(!w.rdt){var p=w.rdt=function(){p.sendEvent?p.sendEvent.apply(p,arguments):p.callQueue.push(arguments)};p.callQueue=[];var t=d.createElement("script");t.src="https://www.redditstatic.com/ads/pixel.js",t.async=!0;var s=d.getElementsByTagName("script")[0];s.parentNode.insertBefore(t,s)}}(window,document);rdt('init','${pixelId}');rdt('track','PageVisit');`,
  };
}

function renderBingUET(config: Record<string, string>): ScriptRenderOutput {
  const tagId = cfg(config, "tag_id");
  return {
    inline: `(function(w,d,t,r,u){var f,n,i;w[u]=w[u]||[],f=function(){var o={ti:"${tagId}",enableAutoSpaTracking:true};o.q=w[u],w[u]=new UET(o),w[u].push("pageLoad")},n=d.createElement(t),n.src=r,n.async=1,n.onload=n.onreadystatechange=function(){var s=this.readyState;s&&s!=="loaded"&&s!=="complete"||(f(),n.onload=n.onreadystatechange=null)},i=d.getElementsByTagName(t)[0],i.parentNode.insertBefore(n,i)})(window,document,"script","//bat.bing.com/bat.js","uetq");`,
  };
}

function renderCriteo(config: Record<string, string>): ScriptRenderOutput {
  const partnerId = cfg(config, "partner_id");
  return {
    src: `https://dynamic.criteo.com/js/ld/ld.js?a=${partnerId}`,
  };
}

function renderOutbrain(config: Record<string, string>): ScriptRenderOutput {
  const marketerId = cfg(config, "marketer_id");
  return {
    inline: `!function(_window,_document){var OB_ADV_ID='${marketerId}';if(_window.obApi){var toArray=function(object){return Object.prototype.toString.call(object)==='[object Array]'?object:[object]};_window.obApi.marketerId=toArray(_window.obApi.marketerId).concat(toArray(OB_ADV_ID));return}_window.obApi=function(){_window.obApi.dispatch?_window.obApi.dispatch.apply(_window.obApi,arguments):_window.obApi.queue.push(arguments)};_window.obApi.version='1.1';_window.obApi.loaded=!0;_window.obApi.marketerId=OB_ADV_ID;_window.obApi.queue=[];var _script=_document.createElement('script');_script.async=!0;_script.src='https://amplify.outbrain.com/cp/obtp.js';_script.type='text/javascript';var _first=_document.getElementsByTagName('script')[0];_first.parentNode.insertBefore(_script,_first)}(window,document);obApi('track','PAGE_VIEW');`,
  };
}

function renderTaboola(config: Record<string, string>): ScriptRenderOutput {
  const accountId = cfg(config, "account_id");
  return {
    inline: `window._tfa=window._tfa||[];window._tfa.push({notify:'event',name:'page_view',id:1234567});!function(t,f,a,x){if(!document.getElementById(x)){t.async=1;t.src=a;t.id=x;f.parentNode.insertBefore(t,f)}}(document.createElement('script'),document.getElementsByTagName('script')[0],'//cdn.taboola.com/libtrc/unip/${accountId}/tfa.js','tb_tfa_script');`,
  };
}

function renderHotjar(config: Record<string, string>): ScriptRenderOutput {
  const siteId = cfg(config, "site_id");
  return {
    inline: `(function(h,o,t,j,a,r){h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};h._hjSettings={hjid:${siteId},hjsv:6};a=o.getElementsByTagName('head')[0];r=o.createElement('script');r.async=1;r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;a.appendChild(r)})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`,
  };
}

function renderFullStory(config: Record<string, string>): ScriptRenderOutput {
  const orgId = cfg(config, "org_id");
  return {
    inline: `window['_fs_debug']=false;window['_fs_host']='fullstory.com';window['_fs_script']='edge.fullstory.com/s/fs.js';window['_fs_org']='${orgId}';window['_fs_namespace']='FS';(function(m,n,e,t,l,o,g,y){if(e in m){if(m.console&&m.console.log){m.console.log('FullStory namespace conflict. Please set window["_fs_namespace"].')}return}g=m[e]=function(a,b,s){g.q?g.q.push([a,b,s]):g._api(a,b,s)};g.q=[];o=n.createElement(t);o.async=1;o.crossOrigin='anonymous';o.src='https://'+_fs_script;y=n.getElementsByTagName(t)[0];y.parentNode.insertBefore(o,y);g.identify=function(i,v,s){g(l,{uid:i},s);if(v)g(l,v,s)};g.setUserVars=function(v,s){g(l,v,s)};g.event=function(i,v,s){g('event',{n:i,p:v},s)};g.anonymize=function(){g.identify(!!0)};g.shutdown=function(){g('rec',!1)};g.restart=function(){g('rec',!0)};g.log=function(a,b){g('log',[a,b])};g.consent=function(a){g('consent',!arguments.length||a)};g.identifyAccount=function(i,v){o='account';v=v||{};v.acctId=i;g(o,v)};g.clearUserCookie=function(){}})(window,document,window['_fs_namespace'],'script','user');`,
  };
}

function renderLogRocket(config: Record<string, string>): ScriptRenderOutput {
  const appId = cfg(config, "app_id");
  return {
    src: "https://cdn.lr-in-prod.com/LogRocket.min.js",
    inline: `window.LogRocket&&window.LogRocket.init('${appId}');`,
  };
}

function renderMouseflow(config: Record<string, string>): ScriptRenderOutput {
  const websiteId = cfg(config, "website_id");
  return {
    inline: `window._mfq=window._mfq||[];(function(){var mf=document.createElement("script");mf.type="text/javascript";mf.defer=true;mf.src="//cdn.mouseflow.com/projects/${websiteId}.js";document.getElementsByTagName("head")[0].appendChild(mf)})();`,
  };
}

function renderLuckyOrange(config: Record<string, string>): ScriptRenderOutput {
  const siteId = cfg(config, "site_id");
  return {
    inline: `window.__lo_site_id=${siteId};(function(){var wa=document.createElement('script');wa.type='text/javascript';wa.async=true;wa.src='https://d10lpsik1i8c69.cloudfront.net/w.js';var s=document.getElementsByTagName('script')[0];s.parentNode.insertBefore(wa,s)})();`,
  };
}

function renderSmartlook(config: Record<string, string>): ScriptRenderOutput {
  const projectKey = cfg(config, "project_key");
  return {
    inline: `window.smartlook||(function(d){var o=smartlook=function(){o.api.push(arguments)},h=d.getElementsByTagName('head')[0];var c=d.createElement('script');o.api=new Array();c.async=true;c.type='text/javascript';c.charset='utf-8';c.src='https://web-sdk.smartlook.com/recorder.js';h.appendChild(c)})(document);smartlook('init','${projectKey}',{region:'eu'});`,
  };
}

function renderCrazyEgg(config: Record<string, string>): ScriptRenderOutput {
  const accountNumber = cfg(config, "account_number");
  // Crazy Egg formats: first 4 digits / last 4 digits
  const part1 = accountNumber.substring(0, 4).padStart(4, "0");
  const part2 = accountNumber.substring(4, 8).padStart(4, "0");
  return {
    src: `https://script.crazyegg.com/pages/scripts/${part1}/${part2}.js`,
  };
}

function renderHubSpot(config: Record<string, string>): ScriptRenderOutput {
  const portalId = cfg(config, "portal_id");
  return {
    src: `https://js.hs-scripts.com/${portalId}.js`,
  };
}

function renderIntercom(config: Record<string, string>): ScriptRenderOutput {
  const appId = cfg(config, "app_id");
  return {
    inline: `window.intercomSettings={api_base:"https://api-iam.intercom.io",app_id:"${appId}"};(function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings)}else{var d=document;var i=function(){i.c(arguments)};i.q=[];i.c=function(args){i.q.push(args)};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/${appId}';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x)};if(document.readyState==='complete'){l()}else if(w.attachEvent){w.attachEvent('onload',l)}else{w.addEventListener('load',l,false)}}})();`,
  };
}

function renderDrift(config: Record<string, string>): ScriptRenderOutput {
  const embedId = cfg(config, "embed_id");
  return {
    inline: `!function(){var t=window.driftt=window.drift=window.driftt||[];if(!t.init){if(t.invoked)return void(window.console&&console.error&&console.error("Drift snippet included twice."));t.invoked=!0,t.methods=["identify","config","track","reset","debug","show","ping","page","hide","off","on"],t.factory=function(e){return function(){var n=Array.prototype.slice.call(arguments);return n.unshift(e),t.push(n),t}},t.methods.forEach(function(e){t[e]=t.factory(e)}),t.load=function(t){var e=3e5,n=Math.ceil(new Date/e)*e,o=document.createElement("script");o.type="text/javascript",o.async=!0,o.crossorigin="anonymous",o.src="https://js.driftt.com/include/"+n+"/"+t+".js";var i=document.getElementsByTagName("script")[0];i.parentNode.insertBefore(o,i)}}}();drift.SNIPPET_VERSION='0.3.1';drift.load('${embedId}');`,
  };
}

function renderZendesk(config: Record<string, string>): ScriptRenderOutput {
  const key = cfg(config, "key");
  return {
    src: `https://static.zdassets.com/ekr/snippet.js?key=${key}`,
  };
}

function renderCrisp(config: Record<string, string>): ScriptRenderOutput {
  const websiteId = cfg(config, "website_id");
  return {
    inline: `window.$crisp=[];window.CRISP_WEBSITE_ID="${websiteId}";(function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s)})();`,
  };
}

function renderTawkTo(config: Record<string, string>): ScriptRenderOutput {
  const propertyId = cfg(config, "property_id");
  const widgetId = cfg(config, "widget_id");
  return {
    inline: `var Tawk_API=Tawk_API||{},Tawk_LoadStart=new Date();(function(){var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];s1.async=true;s1.src='https://embed.tawk.to/${propertyId}/${widgetId}';s1.charset='UTF-8';s1.setAttribute('crossorigin','*');s0.parentNode.insertBefore(s1,s0)})();`,
  };
}

function renderLiveChat(config: Record<string, string>): ScriptRenderOutput {
  const licenseId = cfg(config, "license_id");
  return {
    inline: `window.__lc=window.__lc||{};window.__lc.license=${licenseId};(function(n,t,c){function i(n){return e._h?e._h.apply(null,n):e._q.push(n)}var e={_q:[],_h:null,_v:"2.0",on:function(){i(["on",c.call(arguments)])},once:function(){i(["once",c.call(arguments)])},off:function(){i(["off",c.call(arguments)])},get:function(){if(!e._h)throw new Error("[LiveChatWidget] You can't use getters before load.");return i(["get",c.call(arguments)])},call:function(){i(["call",c.call(arguments)])},init:function(){var n=t.createElement("script");n.async=!0,n.type="text/javascript",n.src="https://cdn.livechatinc.com/tracking.js",t.head.appendChild(n)}};!n.__lc.asyncInit&&e.init(),n.LiveChatWidget=n.LiveChatWidget||e}(window,document,[].slice));`,
  };
}

function renderOptimizely(config: Record<string, string>): ScriptRenderOutput {
  const projectId = cfg(config, "project_id");
  return {
    src: `https://cdn.optimizely.com/js/${projectId}.js`,
  };
}

function renderVWO(config: Record<string, string>): ScriptRenderOutput {
  const accountId = cfg(config, "account_id");
  return {
    inline: `window._vwo_code||(function(){var account_id=${accountId},version=2.0,settings_tolerance=2000,hide_element='body',hide_element_style='opacity:0 !important;filter:alpha(opacity=0) !important;background:none !important',f=false,w=window,d=document,v=d.querySelector('#vwoCode'),cK='_vwo_'+account_id+'_settings',cc={};try{var c=JSON.parse(localStorage.getItem('_vwo_'+account_id+'_config'));cc=c&&typeof c==='object'?c:{}}catch(e){}var stT=cc.stT==='session'?w.sessionStorage:w.localStorage;code={use_hierarchical_settings:true,library_tolerance:2500,settings_tolerance:settings_tolerance,hide_element_style:hide_element_style,hide_element:hide_element,r498:true,is_hierarchical:true,run_ab:true};var defined=function(a){return typeof a!=='undefined'};w._vwo_settings=function(a){stT.setItem(cK,JSON.stringify(a))};var hasFresh498=defined(googletag);if(!defined(w._vwo_code)){w._vwo_code=code;var url=d.currentScript&&d.currentScript.src||'';url&&(w._vwo_code.url=url);var ta=d.createElement('script'),el=d.getElementsByTagName('script')[0];ta.src='https://dev.visualwebsiteoptimizer.com/j.php?a='+account_id+'&u='+encodeURIComponent(d.URL)+'&f='+(+hasFresh498)+'&vn='+version;ta.type='text/javascript';ta.onerror=function(){w._vwo_code.finish()};el.parentNode.insertBefore(ta,el)}})();`,
  };
}

function renderABTasty(config: Record<string, string>): ScriptRenderOutput {
  const accountId = cfg(config, "account_id");
  return {
    src: `https://try.abtasty.com/${accountId}.js`,
  };
}

function renderCookiebot(config: Record<string, string>): ScriptRenderOutput {
  const cbid = cfg(config, "cbid");
  return {
    src: `https://consent.cookiebot.com/uc.js`,
    // data-cbid attribute should be set via attributes on ManagedScript
    inline: undefined,
  };
}

function renderOneTrust(config: Record<string, string>): ScriptRenderOutput {
  const domainScriptId = cfg(config, "domain_script_id");
  return {
    src: `https://cdn.cookielaw.org/scripttemplates/otSDKStub.js`,
    inline: `function OptanonWrapper(){}`,
    // data-domain-script attribute should be set via attributes on ManagedScript
  };
}

function renderUsercentrics(
  config: Record<string, string>,
): ScriptRenderOutput {
  const settingsId = cfg(config, "settings_id");
  return {
    src: `https://app.usercentrics.eu/browser-ui/latest/loader.js`,
    // data-settings-id attribute should be set via attributes on ManagedScript
    inline: undefined,
  };
}

function renderIubenda(config: Record<string, string>): ScriptRenderOutput {
  const siteId = cfg(config, "site_id");
  const cookiePolicyId = cfg(config, "cookie_policy_id");
  return {
    inline: `var _iub=_iub||[];_iub.csConfiguration={siteId:${siteId},cookiePolicyId:${cookiePolicyId},lang:'en'};`,
    src: `https://cs.iubenda.com/autoblocking/${siteId}.js`,
  };
}

// ---------------------------------------------------------------------------
// Main Render Function
// ---------------------------------------------------------------------------

const RENDER_MAP: Record<
  ScriptProviderType,
  (config: Record<string, string>) => ScriptRenderOutput
> = {
  google_analytics_4: renderGoogleAnalytics4,
  google_tag_manager: renderGoogleTagManager,
  matomo: renderMatomo,
  plausible: renderPlausible,
  fathom: renderFathom,
  umami: renderUmami,
  pirsch: renderPirsch,
  simple_analytics: renderSimpleAnalytics,
  adobe_analytics: renderAdobeAnalytics,
  mixpanel: renderMixpanel,
  amplitude: renderAmplitude,
  heap: renderHeap,
  posthog: renderPostHog,
  segment: renderSegment,
  microsoft_clarity: renderMicrosoftClarity,
  meta_pixel: renderMetaPixel,
  google_ads: renderGoogleAds,
  linkedin_insight: renderLinkedInInsight,
  tiktok_pixel: renderTikTokPixel,
  pinterest_tag: renderPinterestTag,
  twitter_pixel: renderTwitterPixel,
  snapchat_pixel: renderSnapchatPixel,
  reddit_pixel: renderRedditPixel,
  bing_uet: renderBingUET,
  criteo: renderCriteo,
  outbrain: renderOutbrain,
  taboola: renderTaboola,
  hotjar: renderHotjar,
  fullstory: renderFullStory,
  logrocket: renderLogRocket,
  mouseflow: renderMouseflow,
  lucky_orange: renderLuckyOrange,
  smartlook: renderSmartlook,
  crazy_egg: renderCrazyEgg,
  hubspot: renderHubSpot,
  intercom: renderIntercom,
  drift: renderDrift,
  zendesk: renderZendesk,
  crisp: renderCrisp,
  tawk_to: renderTawkTo,
  livechat: renderLiveChat,
  optimizely: renderOptimizely,
  vwo: renderVWO,
  ab_tasty: renderABTasty,
  cookiebot: renderCookiebot,
  onetrust: renderOneTrust,
  usercentrics: renderUsercentrics,
  iubenda: renderIubenda,
};

/**
 * Render the embed snippet for a given provider and configuration.
 */
export function renderProviderScript(
  provider: ScriptProviderType,
  config: Record<string, string>,
): ScriptRenderOutput {
  const renderer = RENDER_MAP[provider];
  if (!renderer) {
    throw new Error(`Unknown provider: ${provider}`);
  }
  return renderer(config);
}
