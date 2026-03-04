/**
 * Provider Event Mappings
 *
 * Maps CMS standard events to each provider's specific event API calls.
 * Only events that a provider actually supports are included.
 */

import type {
  ScriptProviderType,
  StandardEventName,
} from "@otl-core/cms-types";

export interface ProviderEventMapping {
  /** JavaScript function call pattern, e.g. "gtag('event', '{event}', {params})" */
  call_pattern: string;
  /** Provider-specific event name */
  provider_event_name: string;
  /** Map CMS param keys to provider param keys */
  param_map: Record<string, string>;
}

// ---------------------------------------------------------------------------
// Google Analytics 4
// ---------------------------------------------------------------------------

const GA4_CALL_PATTERN = "gtag('event', '{event}', {params})";

const GA4_MAPPINGS: Partial<Record<StandardEventName, ProviderEventMapping>> = {
  page_view: {
    call_pattern: GA4_CALL_PATTERN,
    provider_event_name: "page_view",
    param_map: {
      page_title: "page_title",
      page_location: "page_location",
      page_path: "page_path",
    },
  },
  scroll_depth: {
    call_pattern: GA4_CALL_PATTERN,
    provider_event_name: "scroll",
    param_map: {
      percent: "percent_scrolled",
    },
  },
  outbound_click: {
    call_pattern: GA4_CALL_PATTERN,
    provider_event_name: "click",
    param_map: {
      url: "link_url",
      link_text: "link_text",
    },
  },
  internal_link_click: {
    call_pattern: GA4_CALL_PATTERN,
    provider_event_name: "click",
    param_map: {
      url: "link_url",
      link_text: "link_text",
    },
  },
  file_download: {
    call_pattern: GA4_CALL_PATTERN,
    provider_event_name: "file_download",
    param_map: {
      file_name: "file_name",
      file_extension: "file_extension",
      file_url: "link_url",
    },
  },
  form_start: {
    call_pattern: GA4_CALL_PATTERN,
    provider_event_name: "form_start",
    param_map: {
      form_id: "form_id",
    },
  },
  form_submit: {
    call_pattern: GA4_CALL_PATTERN,
    provider_event_name: "generate_lead",
    param_map: {
      form_id: "form_id",
      form_name: "form_name",
    },
  },
  form_error: {
    call_pattern: GA4_CALL_PATTERN,
    provider_event_name: "form_error",
    param_map: {
      form_id: "form_id",
    },
  },
  search: {
    call_pattern: GA4_CALL_PATTERN,
    provider_event_name: "search",
    param_map: {
      search_term: "search_term",
    },
  },
  video_start: {
    call_pattern: GA4_CALL_PATTERN,
    provider_event_name: "video_start",
    param_map: {
      video_title: "video_title",
      video_url: "video_url",
    },
  },
  video_progress: {
    call_pattern: GA4_CALL_PATTERN,
    provider_event_name: "video_progress",
    param_map: {
      video_title: "video_title",
      percent: "video_percent",
    },
  },
  video_complete: {
    call_pattern: GA4_CALL_PATTERN,
    provider_event_name: "video_complete",
    param_map: {
      video_title: "video_title",
    },
  },
  share: {
    call_pattern: GA4_CALL_PATTERN,
    provider_event_name: "share",
    param_map: {
      method: "method",
      content_type: "content_type",
      item_id: "item_id",
    },
  },
  content_view: {
    call_pattern: GA4_CALL_PATTERN,
    provider_event_name: "content_view",
    param_map: {
      seconds: "engagement_time_msec",
      page_path: "page_path",
    },
  },
  purchase: {
    call_pattern: GA4_CALL_PATTERN,
    provider_event_name: "purchase",
    param_map: {
      value: "value",
      currency: "currency",
      transaction_id: "transaction_id",
    },
  },
  add_to_cart: {
    call_pattern: GA4_CALL_PATTERN,
    provider_event_name: "add_to_cart",
    param_map: {
      value: "value",
      currency: "currency",
    },
  },
  begin_checkout: {
    call_pattern: GA4_CALL_PATTERN,
    provider_event_name: "begin_checkout",
    param_map: {
      value: "value",
      currency: "currency",
    },
  },
  sign_up: {
    call_pattern: GA4_CALL_PATTERN,
    provider_event_name: "sign_up",
    param_map: {
      method: "method",
    },
  },
  login: {
    call_pattern: GA4_CALL_PATTERN,
    provider_event_name: "login",
    param_map: {
      method: "method",
    },
  },
  generate_lead: {
    call_pattern: GA4_CALL_PATTERN,
    provider_event_name: "generate_lead",
    param_map: {
      value: "value",
      currency: "currency",
    },
  },
  contact: {
    call_pattern: GA4_CALL_PATTERN,
    provider_event_name: "contact",
    param_map: {},
  },
  subscribe: {
    call_pattern: GA4_CALL_PATTERN,
    provider_event_name: "subscribe",
    param_map: {
      value: "value",
      currency: "currency",
    },
  },
  block_click: {
    call_pattern: GA4_CALL_PATTERN,
    provider_event_name: "block_click",
    param_map: {
      block_type: "block_type",
      event_label: "event_label",
    },
  },
  block_visible: {
    call_pattern: GA4_CALL_PATTERN,
    provider_event_name: "block_visible",
    param_map: {
      block_type: "block_type",
      event_label: "event_label",
    },
  },
  custom: {
    call_pattern: GA4_CALL_PATTERN,
    provider_event_name: "custom",
    param_map: {},
  },
};

// ---------------------------------------------------------------------------
// Google Tag Manager
// ---------------------------------------------------------------------------

const GTM_CALL_PATTERN = "gtag('event', '{event}', {params})";

const GTM_MAPPINGS: Partial<Record<StandardEventName, ProviderEventMapping>> = {
  page_view: {
    call_pattern: GTM_CALL_PATTERN,
    provider_event_name: "page_view",
    param_map: {
      page_title: "page_title",
      page_location: "page_location",
    },
  },
  custom: {
    call_pattern: GTM_CALL_PATTERN,
    provider_event_name: "custom",
    param_map: {},
  },
};

// ---------------------------------------------------------------------------
// Meta Pixel
// ---------------------------------------------------------------------------

const META_CALL_PATTERN = "fbq('track', '{event}', {params})";
const META_CUSTOM_CALL_PATTERN = "fbq('trackCustom', '{event}', {params})";

const META_MAPPINGS: Partial<Record<StandardEventName, ProviderEventMapping>> =
  {
    page_view: {
      call_pattern: META_CALL_PATTERN,
      provider_event_name: "PageView",
      param_map: {},
    },
    form_submit: {
      call_pattern: META_CALL_PATTERN,
      provider_event_name: "Lead",
      param_map: {
        form_name: "content_name",
        consent_category: "content_category",
      },
    },
    generate_lead: {
      call_pattern: META_CALL_PATTERN,
      provider_event_name: "Lead",
      param_map: {
        value: "value",
        currency: "currency",
      },
    },
    purchase: {
      call_pattern: META_CALL_PATTERN,
      provider_event_name: "Purchase",
      param_map: {
        value: "value",
        currency: "currency",
      },
    },
    add_to_cart: {
      call_pattern: META_CALL_PATTERN,
      provider_event_name: "AddToCart",
      param_map: {
        value: "value",
        currency: "currency",
        content_name: "content_name",
      },
    },
    begin_checkout: {
      call_pattern: META_CALL_PATTERN,
      provider_event_name: "InitiateCheckout",
      param_map: {
        value: "value",
        num_items: "num_items",
      },
    },
    sign_up: {
      call_pattern: META_CALL_PATTERN,
      provider_event_name: "CompleteRegistration",
      param_map: {},
    },
    search: {
      call_pattern: META_CALL_PATTERN,
      provider_event_name: "Search",
      param_map: {
        search_term: "search_string",
      },
    },
    contact: {
      call_pattern: META_CALL_PATTERN,
      provider_event_name: "Contact",
      param_map: {},
    },
    subscribe: {
      call_pattern: META_CALL_PATTERN,
      provider_event_name: "Subscribe",
      param_map: {
        value: "value",
        currency: "currency",
      },
    },
    schedule: {
      call_pattern: META_CALL_PATTERN,
      provider_event_name: "Schedule",
      param_map: {},
    },
    custom: {
      call_pattern: META_CUSTOM_CALL_PATTERN,
      provider_event_name: "custom",
      param_map: {},
    },
  };

// ---------------------------------------------------------------------------
// LinkedIn Insight
// ---------------------------------------------------------------------------

const LINKEDIN_CALL_PATTERN = "lintrk('track', { conversion_id: {id} })";

const LINKEDIN_MAPPINGS: Partial<
  Record<StandardEventName, ProviderEventMapping>
> = {
  form_submit: {
    call_pattern: LINKEDIN_CALL_PATTERN,
    provider_event_name: "convert",
    param_map: {
      conversion_id: "conversion_id",
    },
  },
  purchase: {
    call_pattern: LINKEDIN_CALL_PATTERN,
    provider_event_name: "convert",
    param_map: {},
  },
  custom: {
    call_pattern: "lintrk('track', {params})",
    provider_event_name: "track",
    param_map: {},
  },
};

// ---------------------------------------------------------------------------
// TikTok Pixel
// ---------------------------------------------------------------------------

const TIKTOK_CALL_PATTERN = "ttq.track('{event}', {params})";

const TIKTOK_MAPPINGS: Partial<
  Record<StandardEventName, ProviderEventMapping>
> = {
  page_view: {
    call_pattern: TIKTOK_CALL_PATTERN,
    provider_event_name: "ViewContent",
    param_map: {},
  },
  form_submit: {
    call_pattern: TIKTOK_CALL_PATTERN,
    provider_event_name: "SubmitForm",
    param_map: {},
  },
  purchase: {
    call_pattern: TIKTOK_CALL_PATTERN,
    provider_event_name: "CompletePayment",
    param_map: {
      value: "value",
      currency: "currency",
    },
  },
  add_to_cart: {
    call_pattern: TIKTOK_CALL_PATTERN,
    provider_event_name: "AddToCart",
    param_map: {
      value: "value",
      currency: "currency",
    },
  },
  sign_up: {
    call_pattern: TIKTOK_CALL_PATTERN,
    provider_event_name: "CompleteRegistration",
    param_map: {},
  },
};

// ---------------------------------------------------------------------------
// Plausible
// ---------------------------------------------------------------------------

const PLAUSIBLE_CALL_PATTERN = "plausible('{event}', { props: {params} })";

const PLAUSIBLE_MAPPINGS: Partial<
  Record<StandardEventName, ProviderEventMapping>
> = {
  page_view: {
    call_pattern: PLAUSIBLE_CALL_PATTERN,
    provider_event_name: "pageview",
    param_map: {},
  },
  custom: {
    call_pattern: PLAUSIBLE_CALL_PATTERN,
    provider_event_name: "custom",
    param_map: {},
  },
  form_submit: {
    call_pattern: PLAUSIBLE_CALL_PATTERN,
    provider_event_name: "Form Submit",
    param_map: {
      form_id: "form_id",
      form_name: "form_name",
    },
  },
  outbound_click: {
    call_pattern: PLAUSIBLE_CALL_PATTERN,
    provider_event_name: "Outbound Link: Click",
    param_map: {
      url: "url",
    },
  },
  file_download: {
    call_pattern: PLAUSIBLE_CALL_PATTERN,
    provider_event_name: "File Download",
    param_map: {
      file_url: "url",
    },
  },
};

// ---------------------------------------------------------------------------
// PostHog
// ---------------------------------------------------------------------------

const POSTHOG_CALL_PATTERN = "posthog.capture('{event}', {params})";

const POSTHOG_MAPPINGS: Partial<
  Record<StandardEventName, ProviderEventMapping>
> = {
  page_view: {
    call_pattern: POSTHOG_CALL_PATTERN,
    provider_event_name: "$pageview",
    param_map: {
      page_title: "$title",
      page_location: "$current_url",
      page_path: "$pathname",
    },
  },
  scroll_depth: {
    call_pattern: POSTHOG_CALL_PATTERN,
    provider_event_name: "scroll_depth",
    param_map: { percent: "percent" },
  },
  outbound_click: {
    call_pattern: POSTHOG_CALL_PATTERN,
    provider_event_name: "outbound_click",
    param_map: { url: "url", link_text: "link_text" },
  },
  file_download: {
    call_pattern: POSTHOG_CALL_PATTERN,
    provider_event_name: "file_download",
    param_map: {
      file_url: "file_url",
      file_name: "file_name",
      file_extension: "file_extension",
    },
  },
  form_start: {
    call_pattern: POSTHOG_CALL_PATTERN,
    provider_event_name: "form_start",
    param_map: { form_id: "form_id" },
  },
  form_submit: {
    call_pattern: POSTHOG_CALL_PATTERN,
    provider_event_name: "form_submit",
    param_map: { form_id: "form_id", form_name: "form_name" },
  },
  search: {
    call_pattern: POSTHOG_CALL_PATTERN,
    provider_event_name: "search",
    param_map: { search_term: "search_term" },
  },
  purchase: {
    call_pattern: POSTHOG_CALL_PATTERN,
    provider_event_name: "purchase",
    param_map: {
      value: "value",
      currency: "currency",
      transaction_id: "transaction_id",
    },
  },
  sign_up: {
    call_pattern: POSTHOG_CALL_PATTERN,
    provider_event_name: "sign_up",
    param_map: { method: "method" },
  },
  custom: {
    call_pattern: POSTHOG_CALL_PATTERN,
    provider_event_name: "custom",
    param_map: {},
  },
};

// ---------------------------------------------------------------------------
// Mixpanel
// ---------------------------------------------------------------------------

const MIXPANEL_CALL_PATTERN = "mixpanel.track('{event}', {params})";

const MIXPANEL_MAPPINGS: Partial<
  Record<StandardEventName, ProviderEventMapping>
> = {
  page_view: {
    call_pattern: MIXPANEL_CALL_PATTERN,
    provider_event_name: "page_view",
    param_map: {
      page_title: "page_title",
      page_location: "page_location",
      page_path: "page_path",
    },
  },
  scroll_depth: {
    call_pattern: MIXPANEL_CALL_PATTERN,
    provider_event_name: "scroll_depth",
    param_map: { percent: "percent" },
  },
  outbound_click: {
    call_pattern: MIXPANEL_CALL_PATTERN,
    provider_event_name: "outbound_click",
    param_map: { url: "url", link_text: "link_text" },
  },
  file_download: {
    call_pattern: MIXPANEL_CALL_PATTERN,
    provider_event_name: "file_download",
    param_map: {
      file_url: "file_url",
      file_name: "file_name",
      file_extension: "file_extension",
    },
  },
  form_submit: {
    call_pattern: MIXPANEL_CALL_PATTERN,
    provider_event_name: "form_submit",
    param_map: { form_id: "form_id", form_name: "form_name" },
  },
  search: {
    call_pattern: MIXPANEL_CALL_PATTERN,
    provider_event_name: "search",
    param_map: { search_term: "search_term" },
  },
  purchase: {
    call_pattern: MIXPANEL_CALL_PATTERN,
    provider_event_name: "purchase",
    param_map: {
      value: "value",
      currency: "currency",
      transaction_id: "transaction_id",
    },
  },
  sign_up: {
    call_pattern: MIXPANEL_CALL_PATTERN,
    provider_event_name: "sign_up",
    param_map: { method: "method" },
  },
  custom: {
    call_pattern: MIXPANEL_CALL_PATTERN,
    provider_event_name: "custom",
    param_map: {},
  },
};

// ---------------------------------------------------------------------------
// Segment
// ---------------------------------------------------------------------------

const SEGMENT_TRACK_PATTERN = "analytics.track('{event}', {params})";
const SEGMENT_PAGE_PATTERN = "analytics.page({params})";

const SEGMENT_MAPPINGS: Partial<
  Record<StandardEventName, ProviderEventMapping>
> = {
  page_view: {
    call_pattern: SEGMENT_PAGE_PATTERN,
    provider_event_name: "page",
    param_map: { page_title: "name", page_path: "path", page_location: "url" },
  },
  scroll_depth: {
    call_pattern: SEGMENT_TRACK_PATTERN,
    provider_event_name: "Scroll Depth",
    param_map: { percent: "percent" },
  },
  outbound_click: {
    call_pattern: SEGMENT_TRACK_PATTERN,
    provider_event_name: "Outbound Click",
    param_map: { url: "url", link_text: "link_text" },
  },
  file_download: {
    call_pattern: SEGMENT_TRACK_PATTERN,
    provider_event_name: "File Download",
    param_map: {
      file_url: "file_url",
      file_name: "file_name",
      file_extension: "file_extension",
    },
  },
  form_submit: {
    call_pattern: SEGMENT_TRACK_PATTERN,
    provider_event_name: "Form Submitted",
    param_map: { form_id: "form_id", form_name: "form_name" },
  },
  search: {
    call_pattern: SEGMENT_TRACK_PATTERN,
    provider_event_name: "Products Searched",
    param_map: { search_term: "query" },
  },
  purchase: {
    call_pattern: SEGMENT_TRACK_PATTERN,
    provider_event_name: "Order Completed",
    param_map: {
      value: "revenue",
      currency: "currency",
      transaction_id: "order_id",
    },
  },
  add_to_cart: {
    call_pattern: SEGMENT_TRACK_PATTERN,
    provider_event_name: "Product Added",
    param_map: { value: "price", currency: "currency" },
  },
  begin_checkout: {
    call_pattern: SEGMENT_TRACK_PATTERN,
    provider_event_name: "Checkout Started",
    param_map: { value: "revenue", currency: "currency" },
  },
  sign_up: {
    call_pattern: SEGMENT_TRACK_PATTERN,
    provider_event_name: "Signed Up",
    param_map: { method: "type" },
  },
  custom: {
    call_pattern: SEGMENT_TRACK_PATTERN,
    provider_event_name: "custom",
    param_map: {},
  },
};

// ---------------------------------------------------------------------------
// Pinterest Tag
// ---------------------------------------------------------------------------

const PINTEREST_CALL_PATTERN = "pintrk('track', '{event}', {params})";

const PINTEREST_MAPPINGS: Partial<
  Record<StandardEventName, ProviderEventMapping>
> = {
  page_view: {
    call_pattern: PINTEREST_CALL_PATTERN,
    provider_event_name: "pagevisit",
    param_map: {},
  },
  form_submit: {
    call_pattern: PINTEREST_CALL_PATTERN,
    provider_event_name: "lead",
    param_map: {},
  },
  purchase: {
    call_pattern: PINTEREST_CALL_PATTERN,
    provider_event_name: "checkout",
    param_map: { value: "value", currency: "currency" },
  },
  add_to_cart: {
    call_pattern: PINTEREST_CALL_PATTERN,
    provider_event_name: "addtocart",
    param_map: { value: "value", currency: "currency" },
  },
  sign_up: {
    call_pattern: PINTEREST_CALL_PATTERN,
    provider_event_name: "signup",
    param_map: {},
  },
  search: {
    call_pattern: PINTEREST_CALL_PATTERN,
    provider_event_name: "search",
    param_map: { search_term: "search_query" },
  },
  custom: {
    call_pattern: PINTEREST_CALL_PATTERN,
    provider_event_name: "custom",
    param_map: {},
  },
};

// ---------------------------------------------------------------------------
// Google Ads
// ---------------------------------------------------------------------------

const GOOGLE_ADS_CALL_PATTERN = "gtag('event', '{event}', {params})";

const GOOGLE_ADS_MAPPINGS: Partial<
  Record<StandardEventName, ProviderEventMapping>
> = {
  purchase: {
    call_pattern: GOOGLE_ADS_CALL_PATTERN,
    provider_event_name: "conversion",
    param_map: {
      value: "value",
      currency: "currency",
      transaction_id: "transaction_id",
    },
  },
  form_submit: {
    call_pattern: GOOGLE_ADS_CALL_PATTERN,
    provider_event_name: "conversion",
    param_map: {},
  },
  custom: {
    call_pattern: GOOGLE_ADS_CALL_PATTERN,
    provider_event_name: "conversion",
    param_map: {},
  },
};

// ---------------------------------------------------------------------------
// Bing UET
// ---------------------------------------------------------------------------

const BING_CALL_PATTERN = "window.uetq.push('event', '{event}', {params})";

const BING_MAPPINGS: Partial<Record<StandardEventName, ProviderEventMapping>> =
  {
    page_view: {
      call_pattern: BING_CALL_PATTERN,
      provider_event_name: "page_view",
      param_map: {},
    },
    purchase: {
      call_pattern: BING_CALL_PATTERN,
      provider_event_name: "purchase",
      param_map: { value: "revenue_value", currency: "currency" },
    },
    custom: {
      call_pattern: BING_CALL_PATTERN,
      provider_event_name: "custom",
      param_map: {},
    },
  };

// ---------------------------------------------------------------------------
// Twitter (X) Pixel
// ---------------------------------------------------------------------------

const TWITTER_CALL_PATTERN = "twq('event', '{event}', {params})";

const TWITTER_MAPPINGS: Partial<
  Record<StandardEventName, ProviderEventMapping>
> = {
  page_view: {
    call_pattern: TWITTER_CALL_PATTERN,
    provider_event_name: "tw-pageview",
    param_map: {},
  },
  purchase: {
    call_pattern: TWITTER_CALL_PATTERN,
    provider_event_name: "tw-purchase",
    param_map: { value: "value", currency: "currency" },
  },
  sign_up: {
    call_pattern: TWITTER_CALL_PATTERN,
    provider_event_name: "tw-signup",
    param_map: {},
  },
  custom: {
    call_pattern: TWITTER_CALL_PATTERN,
    provider_event_name: "custom",
    param_map: {},
  },
};

// ---------------------------------------------------------------------------
// Snapchat Pixel
// ---------------------------------------------------------------------------

const SNAPCHAT_CALL_PATTERN = "snaptr('track', '{event}', {params})";

const SNAPCHAT_MAPPINGS: Partial<
  Record<StandardEventName, ProviderEventMapping>
> = {
  page_view: {
    call_pattern: SNAPCHAT_CALL_PATTERN,
    provider_event_name: "PAGE_VIEW",
    param_map: {},
  },
  purchase: {
    call_pattern: SNAPCHAT_CALL_PATTERN,
    provider_event_name: "PURCHASE",
    param_map: { value: "price", currency: "currency" },
  },
  add_to_cart: {
    call_pattern: SNAPCHAT_CALL_PATTERN,
    provider_event_name: "ADD_CART",
    param_map: { value: "price", currency: "currency" },
  },
  sign_up: {
    call_pattern: SNAPCHAT_CALL_PATTERN,
    provider_event_name: "SIGN_UP",
    param_map: {},
  },
  custom: {
    call_pattern: SNAPCHAT_CALL_PATTERN,
    provider_event_name: "CUSTOM_EVENT_1",
    param_map: {},
  },
};

// ---------------------------------------------------------------------------
// Amplitude
// ---------------------------------------------------------------------------

const AMPLITUDE_CALL_PATTERN = "amplitude.track('{event}', {params})";

const AMPLITUDE_MAPPINGS: Partial<
  Record<StandardEventName, ProviderEventMapping>
> = {
  page_view: {
    call_pattern: AMPLITUDE_CALL_PATTERN,
    provider_event_name: "Page Viewed",
    param_map: { page_title: "page_title", page_path: "page_path" },
  },
  form_submit: {
    call_pattern: AMPLITUDE_CALL_PATTERN,
    provider_event_name: "Form Submitted",
    param_map: { form_id: "form_id", form_name: "form_name" },
  },
  purchase: {
    call_pattern: AMPLITUDE_CALL_PATTERN,
    provider_event_name: "Purchase",
    param_map: { value: "revenue", currency: "currency" },
  },
  sign_up: {
    call_pattern: AMPLITUDE_CALL_PATTERN,
    provider_event_name: "Sign Up",
    param_map: { method: "method" },
  },
  custom: {
    call_pattern: AMPLITUDE_CALL_PATTERN,
    provider_event_name: "custom",
    param_map: {},
  },
};

// ---------------------------------------------------------------------------
// Master Registry
// ---------------------------------------------------------------------------

/**
 * Provider event mappings.
 *
 * Only includes providers that have event-tracking APIs. Providers that are
 * purely recording-based (Hotjar, FullStory, LogRocket, Mouseflow, Lucky
 * Orange, Smartlook, Crazy Egg) or consent platforms are intentionally omitted.
 */
export const PROVIDER_EVENT_MAPPINGS: Partial<
  Record<
    ScriptProviderType,
    Partial<Record<StandardEventName, ProviderEventMapping>>
  >
> = {
  google_analytics_4: GA4_MAPPINGS,
  google_tag_manager: GTM_MAPPINGS,
  meta_pixel: META_MAPPINGS,
  linkedin_insight: LINKEDIN_MAPPINGS,
  tiktok_pixel: TIKTOK_MAPPINGS,
  plausible: PLAUSIBLE_MAPPINGS,
  posthog: POSTHOG_MAPPINGS,
  mixpanel: MIXPANEL_MAPPINGS,
  segment: SEGMENT_MAPPINGS,
  pinterest_tag: PINTEREST_MAPPINGS,
  google_ads: GOOGLE_ADS_MAPPINGS,
  bing_uet: BING_MAPPINGS,
  twitter_pixel: TWITTER_MAPPINGS,
  snapchat_pixel: SNAPCHAT_MAPPINGS,
  amplitude: AMPLITUDE_MAPPINGS,
};
