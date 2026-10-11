export type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

// Community quotes, shown on the home page, the media kit and event pages.
// Empty for now: add real, attributable quotes here and the sections reappear.
export const testimonials: Testimonial[] = [];
