/**
 * Content for /careers.
 *
 * Only confirmed roles belong in `careerRoles`. Each listing reads its title,
 * metadata and detail copy from here, so edits to an opening stay in one place.
 */

export type CareerRole = {
  id: string;
  title: string;
  department?: string;
  employmentType?: string;
  workArrangement?: string;
  experience?: string;
  duration?: string;
  summary?: string;
  about?: string;
  responsibilities?: string[];
  requirements?: string[];
};

export const careerRoles: CareerRole[] = [
  {
    id: "graphic-design-intern",
    title: "Graphic Design Intern",
    department: "Creative & Design",
    employmentType: "Paid Internship",
    workArrangement: "Remote",
    experience: "0–1 Year (Freshers Welcome)",
    duration: "3 Months",
    summary:
      "We’re looking for a creative and enthusiastic Graphic Design Intern who is eager to learn, experiment with new tools, and grow alongside our design team.",
    about:
      "Skédio is a creative design studio focused on building meaningful brands and digital experiences. We work across brand identity, UI/UX design, website development, and creative communication.",
    responsibilities: [
      "Assist the Senior Designer with day-to-day design tasks.",
      "Create social media creatives and marketing materials.",
      "Explore AI tools to enhance creative workflows.",
      "Work on real-world branding and design projects.",
      "Implement feedback and continuously improve design skills.",
      "Collaborate with the creative team on ongoing projects.",
    ],
    requirements: [
      "0–1 year of experience in graphic design. Freshers are welcome.",
      "Basic to good knowledge of Canva and Figma.",
      "Familiarity with AI tools such as ChatGPT, Claude, or other AI-powered tools.",
      "Basic understanding of typography, colours, layouts, and visual composition.",
      "Ability to create social media posts, banners, and marketing creatives.",
      "Creative mindset with an eye for detail.",
      "Willingness to learn new tools, techniques, and design processes.",
      "Ability to work collaboratively with and take creative direction from a Senior Designer.",
      "Good communication skills and a proactive attitude.",
    ],
  },
];

export const openApplicationRole = "Open application";

export const hiringSteps = [
  {
    step: "01",
    title: "Send your work",
    body: "Share a portfolio or LinkedIn profile, choose the role you are interested in, and tell us what kind of work you want to make.",
  },
  {
    step: "02",
    title: "Talk it through",
    body: "We will set up a conversation about your experience, how you work, and what you are looking for next.",
  },
  {
    step: "03",
    title: "Meet the team",
    body: "Walk us through a project you are proud of and talk through a practical exercise related to the role.",
  },
];
