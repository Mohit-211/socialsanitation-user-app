// Shapes of the Social Sanitation API (v2, client side). Dates are "YYYY-MM-DD", times "HH:mm"
// in New York time, and timestamps ISO strings in UTC.

export type Paged<T> = {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
};

export type Named = { id: number; name: string };

// Account

export type SignInResult = {
  id: number;
  name: string | null;
  email: string;
  token: string;
  expires_at: string;
};

export type Profile = {
  id: number;
  email: string;
  name: string | null;
  mobile: string | null;
  image_url: string | null;
};

export type CodePurpose = 'email_varification' | 'forgot_password'; // the API's spelling

export type ProfileRequestKind =
  'change_name' | 'change_email' | 'change_phone' | 'delete_account' | 'other';

export type ProfileRequest = {
  id: number;
  kind: ProfileRequestKind;
  kind_name: string;
  details: string | null;
  status: 'open' | 'done' | 'declined';
  office_note: string | null;
  created_at: string;
};

// Addresses and places (the US and Canada only)

export type Place = { id: number; name: string; code?: string };

export type Address = {
  id: number;
  label: string | null;
  address: string;
  address_line_2: string | null;
  city: Place | null;
  state: Place | null;
  country: Place | null;
  postal_code: string | null;
  access_notes: string | null;
  is_primary: boolean;
  one_line: string;
};

export type AddressInput = {
  label: string | null;
  address: string;
  address_line_2: string | null;
  country_id: number;
  state_id: number;
  city_id: number;
  postal_code: string;
  access_notes: string | null;
  is_primary?: boolean;
};

// Notifications: the inbox holds unread ones only; reading one removes it.

export type AppNotification = {
  id: number;
  title: string;
  body: string;
  type: string;
  created_at: string;
};

// Enquiries: how a client asks for a service

export type Enquiry = {
  id: number;
  status: 'new' | 'contacted' | 'closed';
  services: Named[];
  needed_on: string | null;
  address: { id: number; label: string | null; one_line: string } | null;
  notes: string | null;
  quoted_price?: number;
  created_at: string;
};

export type EnquiryInput = {
  service_ids: number[];
  needed_on: string;
  address_id: number | null;
  notes: string | null;
};

// Visits (bookings)

export type VisitStatus =
  'PENDING' | 'ACCEPTED' | 'ONGOING' | 'SUCCESS' | 'REJECTED' | 'CANCELLED';

export type CancelRequest = {
  requested_at: string;
  reason: string | null;
  open: boolean;
};

type VisitBase = {
  id: number;
  number: string;
  title: string | null;
  type: 'one_time' | 'recurring';
  status: VisitStatus;
  date: string;
  start_time: string | null;
  end_time: string | null;
  services: Named[];
  employees: (Named & {
    job_type: 'SUPERVISOR' | 'QUALITY_INSPECTOR' | 'CLEANER';
  })[];
  cancel_request: CancelRequest | null;
};

/** A visit in a list: its address is one line of text. */
export type VisitRow = VisitBase & { address: string | null };

export type Visit = VisitBase & {
  address: Address | null;
  notes: string | null;
  started_at: string | null;
  finished_at: string | null;
  cancellation_reason: string | null;
  photos: { id: number; kind: 'before' | 'after'; url: string }[];
};

// Documents the office has shared

export type DocumentKind =
  | 'client_sheet'
  | 'scope_of_work'
  | 'estimate'
  | 'quote'
  | 'service_request'
  | 'contract'
  | 'invoice';

export type DocumentRow = {
  kind: DocumentKind;
  kind_name: string;
  id: number;
  title: string;
  status: string | null;
  file_url: string | null;
  shared_at: string;
};

type DocumentBase = {
  kind_name: string;
  id: number;
  title: string;
  status?: string | null;
  can_sign: boolean;
  shared_at: string;
  timeline: { step: string; at: string }[];
};

export type SheetArea = {
  id: number;
  service_area: string | null;
  flooring_type: string | null;
  special_requests: string | null;
  num_desks_trash_cans: number | null;
  stalls: number | null;
  sinks: number | null;
  restrooms: number | null;
};

export type ScopeSection = {
  id: number;
  title: string;
  items: {
    id: number;
    description: string;
    is_daily: boolean;
    is_weekly: boolean;
    is_monthly: boolean;
  }[];
};

export type DocumentDetail = DocumentBase &
  (
    | {
        kind: 'estimate';
        frequency: string | null;
        total_price: number | null;
        file_url: string | null;
        signed_file_url: string | null;
      }
    | {
        kind: 'quote';
        ref_no: string;
        service_dates: string | null;
        due_date: string | null;
        total_due: number | null;
        file_url: string | null;
      }
    | {
        kind: 'service_request';
        ref_no: string;
        service_days: string | null;
        due_date: string | null;
        total_due: number | null;
        signed_file_url: string | null;
      }
    | {
        kind: 'contract';
        contract_date: string | null;
        service_address: string | null;
        total_monthly_price: number | null;
        file_url: string | null;
        signed_file_url: string | null;
      }
    | {
        kind: 'invoice';
        ref_no: string;
        event_name: string | null;
        billing_date: string | null;
        due_date: string | null;
        service_dates: string | null;
        total_due: number;
        amount_due_now: number;
        file_url: string | null;
        pay_url: string | null;
      }
    | {
        kind: 'client_sheet';
        address: Address | null;
        estimated_sqft: string | null;
        walkaround_minutes: number | null;
        service_days: string | null;
        carpet_percentage: number | null;
        concrete_percentage: number | null;
        vct_lvt_percentage: number | null;
        tile_percentage: number | null;
        areas: SheetArea[];
      }
    | {
        kind: 'scope_of_work';
        visit_frequency: string | null;
        service_days: string | null;
        service_time: string | null;
        crew_size: number | null;
        hours_per_visit: number | null;
        notes: string | null;
        sections: ScopeSection[];
      }
  );

/** A DocuSign page to open, or `emailed` when DocuSign sent the link by email instead. */
export type SigningLink = { url: string | null; emailed: boolean };

// Public content

export type Service = {
  id: number;
  name: string;
  description: string | null;
  average_rating: number | null;
  /** The number of reviews, despite the name. */
  rating: number | null;
};

export type ServiceDetail = Service & {
  checklists: {
    heading_id: number;
    heading_title: string;
    tasks: { id: number; task: string }[];
  }[];
  reviews: {
    id: number;
    rating: string;
    review: string | null;
    created_at: string;
  }[];
};

export type ContentSection = {
  id: number;
  heading: string;
  description: string;
  images?: { id: number; url: string }[];
};

export type Faq = { id: number; question: string; answer: string };

export type ContactDetails = {
  id: number;
  email: string | null;
  contact_number: string | null;
  address: string | null;
};
