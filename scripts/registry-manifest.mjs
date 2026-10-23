#!/usr/bin/env node
/**
 * registry-manifest.mjs — walks registry/external/ and emits
 * registry/external/index.json: a categorized manifest of every app and
 * component (actions + sources) mirrored into the registry.
 *
 * Node builtins only. Usage: node scripts/registry-manifest.mjs
 */
import { readdir, readFile, stat, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const EXTERNAL = path.join(ROOT, 'registry', 'external');
const OUT_FILE = path.join(EXTERNAL, 'index.json');

export const CATEGORIES = [
  'Developer Tools',
  'Communication',
  'Finance & Payments',
  'CRM & Sales',
  'Marketing',
  'Databases & Data',
  'Cloud & DevOps',
  'Productivity',
  'Social Media',
  'E-Commerce',
  'AI & ML',
  'Analytics',
  'Forms & Surveys',
  'Calendar & Scheduling',
  'File Storage',
  'Support',
  'HR & Recruiting',
  'Security',
  'IoT & Hardware',
  'Other',
];

/** Curated overrides for well-known apps. app -> categories (first is primary). */
const OVERRIDES = {
  // Developer Tools
  github: ['Developer Tools'],
  gitlab: ['Developer Tools'],
  bitbucket: ['Developer Tools'],
  jira: ['Developer Tools', 'Productivity'],
  jira_service_desk: ['Developer Tools', 'Support'],
  linear: ['Developer Tools', 'Productivity'],
  linearb: ['Developer Tools', 'Analytics'],
  jenkins: ['Developer Tools', 'Cloud & DevOps'],
  circleci: ['Developer Tools', 'Cloud & DevOps'],
  travis_ci: ['Developer Tools', 'Cloud & DevOps'],
  buildkite: ['Developer Tools', 'Cloud & DevOps'],
  vercel: ['Developer Tools', 'Cloud & DevOps'],
  netlify: ['Developer Tools', 'Cloud & DevOps'],
  heroku: ['Cloud & DevOps', 'Developer Tools'],
  render: ['Cloud & DevOps'],
  railway: ['Cloud & DevOps'],
  docker: ['Developer Tools', 'Cloud & DevOps'],
  kubernetes: ['Cloud & DevOps'],
  sentry: ['Developer Tools', 'Analytics'],
  datadog: ['Cloud & DevOps', 'Analytics'],
  new_relic: ['Cloud & DevOps', 'Analytics'],
  pagerduty: ['Cloud & DevOps', 'Support'],
  opsgenie: ['Cloud & DevOps', 'Support'],
  postman: ['Developer Tools'],
  swagger: ['Developer Tools'],
  npm: ['Developer Tools'],
  pypi: ['Developer Tools'],
  sonarqube: ['Developer Tools', 'Security'],
  codeclimate: ['Developer Tools'],
  coderabbit: ['Developer Tools', 'AI & ML'],
  cursor: ['Developer Tools', 'AI & ML'],
  repl_it: ['Developer Tools'],
  replit: ['Developer Tools'],
  stack_overflow: ['Developer Tools'],
  confluence: ['Developer Tools', 'Productivity'],
  azure_devops: ['Developer Tools', 'Cloud & DevOps'],
  sourcegraph: ['Developer Tools'],
  launchdarkly: ['Developer Tools'],
  // Communication
  slack: ['Communication'],
  discord: ['Communication'],
  telegram: ['Communication'],
  twilio: ['Communication'],
  sendgrid: ['Communication', 'Marketing'],
  mailgun: ['Communication', 'Marketing'],
  whatsapp: ['Communication'],
  whatsapp_business: ['Communication'],
  microsoft_teams: ['Communication', 'Productivity'],
  zoom: ['Communication', 'Calendar & Scheduling'],
  google_meet: ['Communication', 'Calendar & Scheduling'],
  intercom: ['Communication', 'Support', 'CRM & Sales'],
  zendesk: ['Support', 'Communication'],
  freshdesk: ['Support', 'Communication'],
  front: ['Communication', 'Support'],
  gmail: ['Communication', 'Productivity'],
  microsoft_outlook: ['Communication', 'Productivity'],
  superhuman: ['Communication', 'Productivity'],
  resend: ['Communication', 'Developer Tools'],
  postmark: ['Communication'],
  mailchimp: ['Marketing', 'Communication'],
  klaviyo: ['Marketing', 'Communication'],
  brevo: ['Marketing', 'Communication'],
  customer_io: ['Marketing', 'Communication'],
  vonage: ['Communication'],
  messagebird: ['Communication'],
  ringcentral: ['Communication'],
  dialpad: ['Communication'],
  aircall: ['Communication', 'Support'],
  matrix: ['Communication'],
  mattermost: ['Communication', 'Developer Tools'],
  rocket_chat: ['Communication'],
  zulip: ['Communication'],
  // Finance & Payments
  stripe: ['Finance & Payments'],
  paypal: ['Finance & Payments'],
  square: ['Finance & Payments', 'E-Commerce'],
  braintree: ['Finance & Payments'],
  adyen: ['Finance & Payments'],
  plaid: ['Finance & Payments'],
  quickbooks: ['Finance & Payments'],
  xero: ['Finance & Payments'],
  wise: ['Finance & Payments'],
  razorpay: ['Finance & Payments'],
  paddle: ['Finance & Payments', 'E-Commerce'],
  chargebee: ['Finance & Payments'],
  recurly: ['Finance & Payments'],
  zuora: ['Finance & Payments'],
  brex: ['Finance & Payments'],
  ramp: ['Finance & Payments'],
  mercury: ['Finance & Payments'],
  coinbase: ['Finance & Payments'],
  binance: ['Finance & Payments'],
  kraken: ['Finance & Payments'],
  shopify_payments: ['Finance & Payments', 'E-Commerce'],
  wave: ['Finance & Payments'],
  freshbooks: ['Finance & Payments'],
  bill_com: ['Finance & Payments'],
  expensify: ['Finance & Payments', 'HR & Recruiting'],
  // CRM & Sales
  salesforce: ['CRM & Sales'],
  hubspot: ['CRM & Sales', 'Marketing'],
  pipedrive: ['CRM & Sales'],
  zoho_crm: ['CRM & Sales'],
  zoho: ['CRM & Sales', 'Productivity'],
  close: ['CRM & Sales'],
  copper: ['CRM & Sales'],
  freshsales: ['CRM & Sales'],
  activecampaign: ['CRM & Sales', 'Marketing'],
  outreach: ['CRM & Sales'],
  salesloft: ['CRM & Sales'],
  apollo: ['CRM & Sales'],
  apollo_io: ['CRM & Sales'],
  lemlist: ['CRM & Sales', 'Marketing'],
  instantly: ['CRM & Sales', 'Marketing'],
  reply_io: ['CRM & Sales'],
  monday: ['Productivity', 'CRM & Sales'],
  attio: ['CRM & Sales'],
  folk: ['CRM & Sales'],
  twenty: ['CRM & Sales'],
  gong: ['CRM & Sales', 'AI & ML'],
  chorus: ['CRM & Sales'],
  clearbit: ['CRM & Sales', 'Marketing'],
  zoominfo: ['CRM & Sales'],
  lusha: ['CRM & Sales'],
  hunter: ['CRM & Sales', 'Marketing'],
  // Marketing
  google_ads: ['Marketing', 'Analytics'],
  facebook_ads: ['Marketing', 'Social Media'],
  linkedin_ads: ['Marketing', 'Social Media'],
  tiktok_ads: ['Marketing', 'Social Media'],
  semrush: ['Marketing', 'Analytics'],
  ahrefs: ['Marketing', 'Analytics'],
  hootsuite: ['Social Media', 'Marketing'],
  buffer: ['Social Media', 'Marketing'],
  sprout_social: ['Social Media', 'Marketing'],
  later: ['Social Media', 'Marketing'],
  canva: ['Marketing', 'Productivity'],
  unbounce: ['Marketing'],
  instapage: ['Marketing'],
  webflow: ['Marketing', 'Developer Tools'],
  wordpress: ['Marketing'],
  contentful: ['Marketing', 'Developer Tools'],
  sanity: ['Marketing', 'Developer Tools'],
  strapi: ['Marketing', 'Developer Tools'],
  // Databases & Data
  airtable: ['Databases & Data', 'Productivity'],
  mysql: ['Databases & Data'],
  postgresql: ['Databases & Data'],
  mongodb: ['Databases & Data'],
  redis: ['Databases & Data'],
  elasticsearch: ['Databases & Data'],
  snowflake: ['Databases & Data', 'Analytics'],
  bigquery: ['Databases & Data', 'Analytics'],
  google_bigquery: ['Databases & Data', 'Analytics'],
  supabase: ['Databases & Data', 'Developer Tools'],
  firebase: ['Databases & Data', 'Developer Tools'],
  planetscale: ['Databases & Data'],
  neon: ['Databases & Data'],
  fauna: ['Databases & Data'],
  dynamodb: ['Databases & Data', 'Cloud & DevOps'],
  aws_dynamodb: ['Databases & Data', 'Cloud & DevOps'],
  cassandra: ['Databases & Data'],
  clickhouse: ['Databases & Data', 'Analytics'],
  databricks: ['Databases & Data', 'AI & ML'],
  dbt: ['Databases & Data', 'Developer Tools'],
  fivetran: ['Databases & Data'],
  airbyte: ['Databases & Data'],
  kafka: ['Databases & Data', 'Cloud & DevOps'],
  confluent: ['Databases & Data', 'Cloud & DevOps'],
  // Cloud & DevOps
  aws: ['Cloud & DevOps'],
  amazon_web_services: ['Cloud & DevOps'],
  google_cloud: ['Cloud & DevOps'],
  azure: ['Cloud & DevOps'],
  microsoft_azure: ['Cloud & DevOps'],
  digitalocean: ['Cloud & DevOps'],
  cloudflare: ['Cloud & DevOps', 'Security'],
  linode: ['Cloud & DevOps'],
  vultr: ['Cloud & DevOps'],
  fly_io: ['Cloud & DevOps'],
  terraform: ['Cloud & DevOps', 'Developer Tools'],
  ansible: ['Cloud & DevOps'],
  grafana: ['Cloud & DevOps', 'Analytics'],
  prometheus: ['Cloud & DevOps'],
  cloudwatch: ['Cloud & DevOps'],
  // Productivity
  notion: ['Productivity'],
  google_sheets: ['Productivity', 'Databases & Data'],
  google_docs: ['Productivity'],
  google_drive: ['File Storage', 'Productivity'],
  google_calendar: ['Calendar & Scheduling', 'Productivity'],
  microsoft_excel: ['Productivity', 'Databases & Data'],
  microsoft_onedrive: ['File Storage', 'Productivity'],
  microsoft_sharepoint: ['File Storage', 'Productivity'],
  dropbox: ['File Storage'],
  box: ['File Storage'],
  trello: ['Productivity'],
  asana: ['Productivity'],
  clickup: ['Productivity'],
  todoist: ['Productivity'],
  evernote: ['Productivity'],
  onenote: ['Productivity'],
  microsoft_onenote: ['Productivity'],
  basecamp: ['Productivity', 'Communication'],
  wrike: ['Productivity'],
  smartsheet: ['Productivity', 'Databases & Data'],
  coda: ['Productivity', 'Databases & Data'],
  obsidian: ['Productivity'],
  roam_research: ['Productivity'],
  miro: ['Productivity'],
  figma: ['Productivity', 'Developer Tools'],
  lucidchart: ['Productivity'],
  calendly: ['Calendar & Scheduling', 'Productivity'],
  cal_com: ['Calendar & Scheduling'],
  google_tasks: ['Productivity'],
  microsoft_todo: ['Productivity'],
  docusign: ['Productivity', 'Finance & Payments'],
  pandadoc: ['Productivity', 'CRM & Sales'],
  hellosign: ['Productivity'],
  dropbox_sign: ['Productivity'],
  // Social Media
  twitter: ['Social Media'],
  x: ['Social Media'],
  facebook: ['Social Media'],
  instagram: ['Social Media'],
  linkedin: ['Social Media'],
  tiktok: ['Social Media'],
  youtube: ['Social Media'],
  pinterest: ['Social Media'],
  reddit: ['Social Media'],
  mastodon: ['Social Media'],
  bluesky: ['Social Media'],
  threads: ['Social Media'],
  snapchat: ['Social Media'],
  twitch: ['Social Media'],
  // E-Commerce
  shopify: ['E-Commerce'],
  woocommerce: ['E-Commerce'],
  magento: ['E-Commerce'],
  bigcommerce: ['E-Commerce'],
  prestashop: ['E-Commerce'],
  squarespace: ['E-Commerce', 'Marketing'],
  wix: ['E-Commerce', 'Marketing'],
  etsy: ['E-Commerce'],
  amazon: ['E-Commerce'],
  ebay: ['E-Commerce'],
  stripe_terminal: ['E-Commerce', 'Finance & Payments'],
  printful: ['E-Commerce'],
  printify: ['E-Commerce'],
  shipstation: ['E-Commerce'],
  shippo: ['E-Commerce'],
  easyship: ['E-Commerce'],
  aftership: ['E-Commerce'],
  // AI & ML
  openai: ['AI & ML'],
  anthropic: ['AI & ML'],
  cohere: ['AI & ML'],
  hugging_face: ['AI & ML'],
  replicate: ['AI & ML'],
  stability_ai: ['AI & ML'],
  midjourney: ['AI & ML'],
  elevenlabs: ['AI & ML'],
  deepgram: ['AI & ML'],
  assemblyai: ['AI & ML'],
  pinecone: ['AI & ML', 'Databases & Data'],
  weaviate: ['AI & ML', 'Databases & Data'],
  qdrant: ['AI & ML', 'Databases & Data'],
  langchain: ['AI & ML', 'Developer Tools'],
  llamaindex: ['AI & ML', 'Developer Tools'],
  perplexity: ['AI & ML'],
  mistral: ['AI & ML'],
  mistral_ai: ['AI & ML'],
  groq: ['AI & ML'],
  together_ai: ['AI & ML'],
  anyscale: ['AI & ML'],
  wandb: ['AI & ML', 'Developer Tools'],
  weights_biases: ['AI & ML', 'Developer Tools'],
  google_gemini: ['AI & ML'],
  azure_openai: ['AI & ML', 'Cloud & DevOps'],
  // Analytics
  google_analytics: ['Analytics'],
  mixpanel: ['Analytics'],
  amplitude: ['Analytics'],
  segment: ['Analytics', 'Databases & Data'],
  posthog: ['Analytics', 'Developer Tools'],
  heap: ['Analytics'],
  hotjar: ['Analytics'],
  fullstory: ['Analytics'],
  pendo: ['Analytics', 'Productivity'],
  tableau: ['Analytics'],
  looker: ['Analytics'],
  metabase: ['Analytics'],
  power_bi: ['Analytics'],
  microsoft_power_bi: ['Analytics'],
  chartmogul: ['Analytics', 'Finance & Payments'],
  baremetrics: ['Analytics', 'Finance & Payments'],
  plausible: ['Analytics'],
  fathom: ['Analytics'],
  // Forms & Surveys
  typeform: ['Forms & Surveys'],
  google_forms: ['Forms & Surveys'],
  surveymonkey: ['Forms & Surveys'],
  jotform: ['Forms & Surveys'],
  tally: ['Forms & Surveys'],
  fillout: ['Forms & Surveys'],
  qualtrics: ['Forms & Surveys'],
  formspark: ['Forms & Surveys'],
  // Support
  helpscout: ['Support'],
  help_scout: ['Support'],
  crisp: ['Support', 'Communication'],
  tawk_to: ['Support', 'Communication'],
  livechat: ['Support', 'Communication'],
  drift: ['Support', 'CRM & Sales'],
  guru: ['Support', 'Productivity'],
  // HR & Recruiting
  greenhouse: ['HR & Recruiting'],
  lever: ['HR & Recruiting'],
  workday: ['HR & Recruiting'],
  bamboohr: ['HR & Recruiting'],
  gusto: ['HR & Recruiting', 'Finance & Payments'],
  rippling: ['HR & Recruiting'],
  deel: ['HR & Recruiting', 'Finance & Payments'],
  ashby: ['HR & Recruiting'],
  workable: ['HR & Recruiting'],
  jazzhr: ['HR & Recruiting'],
  breezy_hr: ['HR & Recruiting'],
  indeed: ['HR & Recruiting'],
  linkedin_talent: ['HR & Recruiting'],
  // Security
  okta: ['Security'],
  auth0: ['Security', 'Developer Tools'],
  onelogin: ['Security'],
  duo: ['Security'],
  crowdstrike: ['Security'],
  snyk: ['Security', 'Developer Tools'],
  _1password: ['Security'],
  lastpass: ['Security'],
  bitwarden: ['Security'],
  vault: ['Security'],
  hashicorp_vault: ['Security'],
  // IoT & Hardware
  particle: ['IoT & Hardware'],
  arduino: ['IoT & Hardware'],
  raspberry_pi: ['IoT & Hardware'],
  philips_hue: ['IoT & Hardware'],
  smartthings: ['IoT & Hardware'],
  ring: ['IoT & Hardware', 'Security'],
  nest: ['IoT & Hardware'],
  tuya: ['IoT & Hardware'],
  ifttt: ['IoT & Hardware', 'Productivity'],
  home_assistant: ['IoT & Hardware'],
  // Additional well-known long-tail apps
  gorgias: ['Support', 'E-Commerce'],
  chatwoot: ['Support', 'Communication'],
  groovehq: ['Support'],
  help_scout_api_keys: ['Support'],
  freshservice: ['Support', 'Cloud & DevOps'],
  discourse: ['Communication'],
  gitea: ['Developer Tools'],
  codeberg: ['Developer Tools'],
  algolia: ['Developer Tools', 'Databases & Data'],
  digital_ocean: ['Cloud & DevOps'],
  backblaze: ['File Storage', 'Cloud & DevOps'],
  cloudflare_r2: ['File Storage', 'Cloud & DevOps'],
  files_com: ['File Storage'],
  filestack: ['File Storage'],
  imagekit_io: ['File Storage', 'Marketing'],
  imgix: ['File Storage', 'Marketing'],
  deepl: ['AI & ML'],
  gladia: ['AI & ML'],
  amazon_polly: ['AI & ML'],
  clarifai: ['AI & ML'],
  datarobot: ['AI & ML'],
  bigml: ['AI & ML'],
  algorithmia: ['AI & ML'],
  ai_ml_api: ['AI & ML'],
  dhl_parcel: ['E-Commerce'],
  easypost: ['E-Commerce'],
  amazon_redshift: ['Databases & Data', 'Analytics'],
  hasura: ['Databases & Data', 'Developer Tools'],
  grafbase: ['Databases & Data', 'Developer Tools'],
  baserow: ['Databases & Data', 'Productivity'],
  directus: ['Databases & Data', 'Developer Tools'],
  bitly: ['Marketing', 'Analytics'],
  braze: ['Marketing', 'Communication'],
  attentive: ['Marketing', 'Communication'],
  iterable: ['Marketing', 'Communication'],
  onesignal: ['Marketing', 'Communication'],
  airship: ['Marketing', 'Communication'],
  gohighlevel: ['CRM & Sales', 'Marketing'],
  infusionsoft: ['CRM & Sales', 'Marketing'],
  bitrix24: ['CRM & Sales', 'Productivity'],
  highrise: ['CRM & Sales'],
  capsule: ['CRM & Sales'],
  affinity: ['CRM & Sales'],
  contactually: ['CRM & Sales'],
  follow_up_boss: ['CRM & Sales'],
  demandbase: ['CRM & Sales', 'Marketing'],
  helcim: ['Finance & Payments'],
  fiserv: ['Finance & Payments'],
  coinbase_commerce: ['Finance & Payments'],
  billplz: ['Finance & Payments'],
  bill: ['Finance & Payments'],
  chargeover: ['Finance & Payments'],
  donorbox: ['Finance & Payments'],
  browserstack: ['Developer Tools', 'Cloud & DevOps'],
  honeybadger: ['Developer Tools'],
  bugsnag: ['Developer Tools'],
  codacy: ['Developer Tools'],
  deepsource: ['Developer Tools'],
  codefresh: ['Developer Tools', 'Cloud & DevOps'],
  appveyor: ['Developer Tools', 'Cloud & DevOps'],
  deployhq: ['Developer Tools', 'Cloud & DevOps'],
  configcat: ['Developer Tools'],
  devcycle: ['Developer Tools'],
  doppler: ['Developer Tools', 'Security'],
  hookdeck: ['Developer Tools'],
  hasdata: ['Databases & Data'],
  bright_data: ['Databases & Data'],
  firecrawl: ['Developer Tools', 'AI & ML'],
  browserless: ['Developer Tools'],
  browserbase: ['Developer Tools', 'AI & ML'],
  adp: ['HR & Recruiting'],
  factorial_api_keys: ['HR & Recruiting'],
  darwinbox: ['HR & Recruiting'],
  applicantstack: ['HR & Recruiting'],
  easyhire: ['HR & Recruiting'],
  greenhouse_job_board_api: ['HR & Recruiting'],
  cyberark_certificate_manager: ['Security'],
  digicert: ['Security'],
  imperva_waf: ['Security'],
  have_i_been_pwned: ['Security'],
  huntress: ['Security'],
  alienvault: ['Security'],
  evervault: ['Security', 'Developer Tools'],
  goto_meeting: ['Communication', 'Calendar & Scheduling'],
  gotowebinar: ['Communication', 'Marketing'],
  clickmeeting: ['Communication', 'Calendar & Scheduling'],
  cisco_webex_custom_app: ['Communication'],
  demio: ['Communication', 'Marketing'],
  everwebinar: ['Marketing', 'Communication'],
  livestorm: ['Communication', 'Marketing'],
  dayschedule: ['Calendar & Scheduling'],
  oncehub: ['Calendar & Scheduling'],
  acuity_scheduling: ['Calendar & Scheduling'],
  simplybook_me: ['Calendar & Scheduling'],
  squarespace_scheduling: ['Calendar & Scheduling'],
  giphy: ['Social Media', 'Communication'],
  dribbble: ['Social Media'],
  goodreads: ['Social Media'],
  dev_to: ['Social Media', 'Developer Tools'],
  hashnode: ['Social Media', 'Developer Tools'],
  blogger: ['Social Media', 'Marketing'],
  ghost_org_admin_api: ['Marketing'],
  ghost_org_content_api: ['Marketing'],
  beehiiv: ['Marketing', 'Communication'],
  convertkit: ['Marketing', 'Communication'],
  kit: ['Marketing', 'Communication'],
  substack: ['Marketing', 'Communication'],
  google_maps_platform: ['Developer Tools'],
  geoapify: ['Developer Tools'],
  geocodio: ['Developer Tools'],
  here: ['Developer Tools'],
  graphhopper: ['Developer Tools'],
  akeneo: ['E-Commerce'],
  commercetools: ['E-Commerce'],
  commercehq: ['E-Commerce'],
  channable: ['E-Commerce', 'Marketing'],
  channeladvisor: ['E-Commerce'],
  dokan: ['E-Commerce'],
  foxy: ['E-Commerce'],
  erpnext: ['Finance & Payments', 'CRM & Sales'],
  frappe: ['Developer Tools', 'Productivity'],
  odoo: ['CRM & Sales', 'Finance & Payments'],
  countly: ['Analytics'],
  geckoboard: ['Analytics'],
  domo: ['Analytics'],
  cyfe: ['Analytics'],
  dashthis: ['Analytics'],
  funnelcockpit: ['Analytics', 'Marketing'],
  cometly: ['Analytics', 'Marketing'],
  alpha_vantage: ['Finance & Payments', 'Analytics'],
  finnhub: ['Finance & Payments', 'Analytics'],
  financial_modeling_prep: ['Finance & Payments', 'Analytics'],
  polygon: ['Finance & Payments', 'Analytics'],
  benzinga: ['Finance & Payments', 'Analytics'],
  google_classroom: ['Productivity'],
  canvas: ['Productivity'],
  d2l_brightspace: ['Productivity'],
  moodle: ['Productivity'],
  checkvist: ['Productivity'],
  habitica: ['Productivity'],
  amplenote: ['Productivity'],
  fibery: ['Productivity'],
  craftdocs: ['Productivity'],
};

/** Keyword rules: [regex (on app + component text), category]. Order = priority. */
const KEYWORD_RULES = [
  [/\b(openai|anthropic|llm|gpt|machine learning|deep learning|neural|ai model|text embedding|vector search|stable diffusion|speech to text|text to speech)\b/i, 'AI & ML'],
  [/\b(github|gitlab|bitbucket|git\b|repository|pull request|ci\/cd|jenkins|deployment|docker|kubernetes|api gateway|sdk|webhook|code review|npm|sonar)\b/i, 'Developer Tools'],
  [/\b(kubernetes|terraform|ansible|cloud|aws|azure|gcp|serverless|lambda|docker|container|infrastructure|devops|monitoring|uptime|status page|log(ging)?s?\b|datadog|grafana)\b/i, 'Cloud & DevOps'],
  [/\b(slack|discord|telegram|sms|email|mail|message|messaging|chat|whatsapp|twilio|sendgrid|newsletter|phone|voice call|fax|push notification)\b/i, 'Communication'],
  [/\b(payment|invoice|billing|stripe|paypal|subscription billing|bank|accounting|bookkeep|ledger|transaction|crypto|bitcoin|invoice|tax|payroll|expense|refund|checkout)\b/i, 'Finance & Payments'],
  [/\b(crm|salesforce|hubspot|lead|deal|pipeline|prospect|sales|contact enrichment|opportunit|quote)\b/i, 'CRM & Sales'],
  [/\b(marketing|campaign|seo|ads\b|advertis|newsletter|landing page|email marketing|conversion|audience|brand)\b/i, 'Marketing'],
  [/\b(database|sql|mysql|postgres|mongo|redis|warehouse|spreadsheet|airtable|etl|data pipeline|query|table|bigquery|snowflake|data sync|csv)\b/i, 'Databases & Data'],
  [/\b(analytics|metric|dashboard|report(ing)?\b|insight|tracking|funnel|chart|business intelligence|kpi)\b/i, 'Analytics'],
  [/\b(twitter|facebook|instagram|linkedin|tiktok|youtube|social media|pinterest|reddit|snapchat|mastodon|bluesky|twitch)\b/i, 'Social Media'],
  [/\b(e-?commerce|shopify|woocommerce|storefront|order|cart|inventory|sku|shipping|fulfillment|marketplace|merchant)\b/i, 'E-Commerce'],
  [/\b(form|survey|questionnaire|poll|quiz|submission|typeform)\b/i, 'Forms & Surveys'],
  [/\b(calendar|scheduling|appointment|booking|availability)\b/i, 'Calendar & Scheduling'],
  [/\b(file storage|cloud storage|drive|dropbox|box\b|s3\b|bucket|folder|document management|backup)\b/i, 'File Storage'],
  [/\b(support|ticket|helpdesk|help desk|customer service|live chat|knowledge base|sla)\b/i, 'Support'],
  [/\b(hr\b|human resources|recruit|hiring|candidate|employee|onboarding|payroll|ats|applicant|job posting|time off)\b/i, 'HR & Recruiting'],
  [/\b(security|vulnerab|threat|malware|phishing|sso|saml|oauth|authentication|identity|access control|encryption|compliance|audit|firewall|penetration|cve)\b/i, 'Security'],
  [/\b(iot|sensor|device|hardware|firmware|raspberry|arduino|smart home|bluetooth|zigbee|mqtt|telemetry)\b/i, 'IoT & Hardware'],
  [/\b(task|project management|note|todo|document|wiki|productivity|workflow|collaboration|whiteboard|mind ?map)\b/i, 'Productivity'],
];

async function readJson(file) {
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch {
    return undefined;
  }
}

/** Classify an app using overrides first, then keyword rules. Max 2 keyword hits. */
function categorize(app, text) {
  const override = OVERRIDES[app];
  if (override) return override;
  const hits = [];
  for (const [re, cat] of KEYWORD_RULES) {
    if (re.test(app.replace(/_/g, ' ')) || re.test(text)) {
      if (!hits.includes(cat)) hits.push(cat);
      if (hits.length >= 2) break;
    }
  }
  return hits.length > 0 ? hits : ['Other'];
}

async function main() {
  const started = Date.now();
  const dirents = await readdir(EXTERNAL, { withFileTypes: true });
  const appDirs = dirents
    // NOTE: do not filter out leading-underscore dirs here — ingest prefixes
    // upstream apps whose names start with a digit (e.g. `_0codekit`), and
    // those are real apps. Non-app entries (shims, index.json) are files or
    // lack a manifest.json and are skipped downstream.
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  const apps = [];
  let actions = 0;
  let sources = 0;

  // Process apps with bounded concurrency — sequential fs on slow mounts is glacial.
  const CONCURRENCY = 64;
  const processApp = async (app) => {
    const appDir = path.join(EXTERNAL, app);
    const manifest = await readJson(path.join(appDir, 'manifest.json'));
    if (!manifest) return undefined; // not an app dir (or unreadable manifest)

    // Component dirs: prefer manifest.components order, fall back to fs walk.
    const compDir = path.join(appDir, 'components');
    let slugs = [];
    try {
      slugs = (await readdir(compDir, { withFileTypes: true }))
        .filter((d) => d.isDirectory())
        .map((d) => d.name);
    } catch {
      /* no components dir */
    }
    if (slugs.length === 0 && Array.isArray(manifest.components)) {
      // Hand-written v1 apps (e.g. github) may list keys without a components/ tree.
      slugs = manifest.components.map((k) => k.replace(new RegExp(`^${app}-?`), ''));
    }

    const components = [];
    const textBlobs = [];
    for (const slug of slugs) {
      const cj = (await readJson(path.join(compDir, slug, 'component.json'))) ?? {};
      const key = cj.key ?? (Array.isArray(manifest.components)
        ? manifest.components.find((k) => k === slug || k.endsWith(`-${slug}`)) ?? slug
        : slug);
      const type = cj.type ?? (key.includes('new-') || key.includes('updated') ? 'source' : 'action');
      if (type === 'source') sources++;
      else actions++;
      if (cj.name) textBlobs.push(cj.name);
      if (cj.description) textBlobs.push(cj.description);
      components.push({
        key,
        slug,
        type,
        name: cj.name ?? key,
        description: cj.description ?? '',
        target: `external/${app}/${slug}`,
      });
    }

    const declared = Array.isArray(manifest.categories)
      ? manifest.categories.filter((c) => typeof c === 'string' && c.length > 0)
      : [];
    const categories = declared.length > 0
      ? declared
      : categorize(app, textBlobs.join(' ').slice(0, 4000));

    return {
      app,
      categories,
      auth: manifest.auth ?? {},
      components,
    };
  };

  let cursor = 0;
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    while (cursor < appDirs.length) {
      const app = appDirs[cursor++];
      const entry = await processApp(app);
      if (entry) apps.push(entry);
    }
  });
  await Promise.all(workers);
  apps.sort((a, b) => a.app.localeCompare(b.app));

  const categories = {};
  for (const cat of CATEGORIES) categories[cat] = [];
  for (const a of apps) {
    for (const cat of a.categories) {
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(a.app);
    }
  }
  for (const cat of Object.keys(categories)) categories[cat].sort();

  const index = {
    generatedAt: new Date().toISOString(),
    totals: { apps: apps.length, actions, sources },
    apps,
    categories,
  };

  await mkdir(path.dirname(OUT_FILE), { recursive: true });
  await writeFile(OUT_FILE, JSON.stringify(index), 'utf8');

  const size = (await stat(OUT_FILE)).size;
  console.log(`wrote ${path.relative(ROOT, OUT_FILE)} (${(size / 1024 / 1024).toFixed(2)} MB) in ${Date.now() - started}ms`);
  console.log(`totals: apps=${apps.length} actions=${actions} sources=${sources}`);
  const ranked = Object.entries(categories)
    .map(([c, list]) => [c, list.length])
    .sort((a, b) => b[1] - a[1]);
  console.log('top categories:');
  for (const [c, n] of ranked.slice(0, 10)) console.log(`  ${c}: ${n}`);
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isMain) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
