export type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

// Real community quotes. Add new ones here and they show up on the home
// page, the media kit and every event page slider.
export const testimonials: Testimonial[] = [
  {
    quote:
      "First educator I've followed who actually explains the why, not just the buy or sell.",
    name: "Kwabena A.",
    role: "Student, Accra",
  },
  {
    quote:
      "The seminar alone was worth more than three months of random YouTube videos.",
    name: "Efua O.",
    role: "Community member",
  },
  {
    quote: "Straightforward, no hype, no guaranteed-returns nonsense.",
    name: "Yaw B.",
    role: "Community member",
  },
];
