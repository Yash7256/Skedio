export interface ProjectSummary {
  slug: string;
  name: string;
  line: string;
  tag: string;
  cover: string;
}

export const projects: ProjectSummary[] = [
  {
    slug: "haocabs",
    name: "HAO Cabs",
    line: "A Taxi Bidding Experience App",
    tag: "Product Design, UI/UX",
    cover: "/HaoCabs/cover.png",
  },
];
