export interface Testimonial {
  id: string;
  name: string;
  title: string;
  company?: string;
  recommendation: string;
  linkedInUrl?: string;
  avatar?: string;
  date: string;
}

export interface Resume {
  _id: string;
  name: string;
  description?: string;
  fileUrl: string;
  uploadedAt: string;
}
