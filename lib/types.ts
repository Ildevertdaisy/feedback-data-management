export type Student = {
  id: number;
  firstname: string | null;
  gender: string | null;
  jdsn: string | null;
  classe?: string | null;
};

export type FruitStatusLabel =
  | "CHATGUI"
  | "TAGUI"
  | "BB"
  | "CENTRE"
  | "DROP";

export type FruitConversionStatus = Exclude<FruitStatusLabel, "CHATGUI">;

export type Fruit = {
  id: number;
  firstname: string | null;
  indo: number | null;
  status: number | string | null;
  location: string | null;
  tagui_point: string | null;
  studentFirstname?: string | null;
  statusLabel?: FruitStatusLabel | null;
  student_evangelisateur_id?: number | null;
  rentree_id?: number | null;
  date_evangelisation?: string | null;
  date_subae?: string | null;
  notes?: string | null;
};

export type Event = {
  id: number;
  type: string | null;
  date: string | null;
};

export type EventAppointment = {
  id: number;
  fruit_id: number;
  event_id: number;
  missing: boolean;
  missing_reason: string | null;
};

export type StudentAttendance = {
  id: number;
  student_id: number;
  is_missing: boolean;
  missing_justification: string | null;
  created_at: string | null;
};

export type StudentFollowup = {
  id: number;
  student_id: number;
  description: string | null;
  fruit_name: string | null;
  created_at: string | null;
  studentFirstname?: string | null;
};

export type FruitFollowup = {
  id: number;
  fruit_id: number;
  student_id: number;
  last_date: string | null;
  studentFirstname?: string | null;
  fruitFirstname?: string | null;
};

export type Rentree = {
  id: number;
  date_rentree: string;
  date_debut_chatgui: string;
  date_fin_chatgui: string;
  nom_rentree: string | null;
  description: string | null;
  created_at: string | null;
};

export type RentreeDashboard = {
  rentreeId: number;
  chatguiCount: number;
  conversionCounts: Record<FruitConversionStatus, number>;
  fruitsByStatus: { label: FruitConversionStatus; value: number }[];
};

export type RentreeDashboardOverview = RentreeDashboard & {
  rentree?: Rentree | null;
};
