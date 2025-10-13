export type Student = {
  id: number;
  firstname: string | null;
  gender: string | null;
  jdsn: string | null;
};

export type FruitStatusLabel = "CHATGUI" | "TTAGUI" | "COT" | "BB" | "DROP";

export type Fruit = {
  id: number;
  firstname: string | null;
  indo: number | null;
  status: number | null;
  location: string | null;
  tagui_point: string | null;
  studentFirstname?: string | null;
  statusLabel?: FruitStatusLabel | null;
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
