export type Job = {
  id: string;
  universe_id: string | null;
  site: string;
  metro: string;
  vertical: "warehouse" | "retail" | "construction";
  stage:
    | "access"
    | "scheduled"
    | "capturing"
    | "ingest"
    | "slam"
    | "segment"
    | "qa"
    | "shipped";
  day: number;
  area_m2: number;
  operator: string;
};

export const JOBS: Job[] = [
  { id: "job_01", universe_id: "univ_wh_0001", site: "Meridian Fulfillment", metro: "Grove City, OH", vertical: "warehouse", stage: "shipped", day: 18, area_m2: 0, operator: "field-01" },
  { id: "job_02", universe_id: "univ_wh_0002", site: "Harbor Path DC", metro: "Newark, NJ", vertical: "warehouse", stage: "shipped", day: 22, area_m2: 0, operator: "field-01" },
  { id: "job_03", universe_id: "univ_wh_0003", site: "Coldline 4", metro: "Elk Grove, CA", vertical: "warehouse", stage: "shipped", day: 29, area_m2: 0, operator: "field-02" },
  { id: "job_04", universe_id: "univ_wh_0004", site: "Northline Crossdock", metro: "Joliet, IL", vertical: "warehouse", stage: "qa", day: 41, area_m2: 0, operator: "field-01" },
  { id: "job_05", universe_id: "univ_wh_0005", site: "Stackwell A", metro: "Fort Worth, TX", vertical: "warehouse", stage: "segment", day: 48, area_m2: 0, operator: "field-02" },
  { id: "job_06", universe_id: "univ_wh_0006", site: "Redwood Parcel", metro: "Kent, WA", vertical: "warehouse", stage: "slam", day: 55, area_m2: 0, operator: "field-01" },
  { id: "job_07", universe_id: "univ_rt_0007", site: "Eastgate Superfloor", metro: "Columbus, OH", vertical: "retail", stage: "capturing", day: 61, area_m2: 0, operator: "field-01" },
  { id: "job_08", universe_id: "univ_wh_0008", site: "Summit Robotics Lab DC", metro: "Hagerstown, MD", vertical: "warehouse", stage: "scheduled", day: 66, area_m2: 0, operator: "field-02" },
  { id: "job_09", universe_id: "univ_wh_0009", site: "Pinebelt Grocery DC", metro: "Lakeland, FL", vertical: "warehouse", stage: "scheduled", day: 70, area_m2: 0, operator: "field-01" },
  { id: "job_10", universe_id: "univ_wh_0010", site: "Iron Gate 2", metro: "Allentown, PA", vertical: "warehouse", stage: "access", day: 74, area_m2: 0, operator: "field-02" },
  { id: "job_11", universe_id: "univ_wh_0011", site: "Prairie Sort", metro: "Kansas City, MO", vertical: "warehouse", stage: "access", day: 78, area_m2: 0, operator: "field-01" },
  { id: "job_12", universe_id: "univ_wh_0012", site: "Cinder Dock", metro: "Phoenix, AZ", vertical: "warehouse", stage: "access", day: 82, area_m2: 0, operator: "field-02" },
  { id: "job_13", universe_id: "univ_wh_0013", site: "Blue Rail Logistics", metro: "Memphis, TN", vertical: "warehouse", stage: "access", day: 85, area_m2: 0, operator: "field-01" },
  { id: "job_14", universe_id: "univ_rt_0014", site: "Harbor Lights Market", metro: "Tampa, FL", vertical: "retail", stage: "access", day: 88, area_m2: 0, operator: "field-02" },
  { id: "job_15", universe_id: "univ_cn_0015", site: "Ridge Frame — Level 2", metro: "Denver, CO", vertical: "construction", stage: "access", day: 90, area_m2: 0, operator: "field-01" },
];

export const STAGE_LABEL: Record<Job["stage"], string> = {
  access: "Site access",
  scheduled: "Scheduled",
  capturing: "On the floor",
  ingest: "Ingest",
  slam: "SLAM",
  segment: "Segment",
  qa: "QA",
  shipped: "Shipped",
};
