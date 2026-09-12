export const THESIS = {
  name: "Billion Universe",
  line: "A physical reality-capture network for training world models and robots.",
  does: "Billion Universe sends capture teams into real warehouses, retail floors, homes, streets, and job sites with LiDAR, multi-camera, and depth kits, and turns each space into a structured, reusable digital dataset: a 3D map with object segmentation, spatial relationships, and physics-relevant metadata. Each captured space becomes one universe in a growing library. Access to that library — and to custom captures — is sold to companies building AI that has to act in the physical world.",
  solves:
    "Language models had a data problem that got solved by scraping the internet. Robots and world models do not have that shortcut. There is no internet of physical space. A robot learning to navigate a warehouse, or a world model learning how objects fall, stack, or occlude, needs training data that captures real physical structure and dynamics — and almost nobody produces that data at scale as a business. Compute is abundant. Physical-world ground truth is the bottleneck. Billion Universe exists to turn real environments into training-ready data, systematically, instead of each robotics company building a one-off capture op.",
  possible: [
    {
      title: "Faster, cheaper robot training",
      body: "A delivery-robot or warehouse-automation company does not instrument every building itself. It licenses pre-captured, structured environments similar to the ones it will operate in.",
    },
    {
      title: "World models that understand physics, not just pixels",
      body: "Training on real spatial and material data instead of synthetic approximations or scraped video.",
    },
    {
      title: "A data moat independent of the compute war",
      body: "While labs fight over chips, the library of real-world environments grows. It becomes more valuable as it gets bigger, and harder to replicate later.",
    },
    {
      title: "A default step in embodied AI",
      body: "The way scraping the web became default for LLMs, capturing physical space becomes default for robots — with Billion Universe as the infrastructure layer that does it.",
    },
    {
      title: "Buyers beyond AI labs",
      body: "The same universes are useful for insurance risk, real-estate digital twins, retail analytics, and urban planning.",
    },
  ],
  firstProduct:
    "A mobile capture kit plus a processing pipeline that turns a walkthrough of any physical space into a structured dataset — point clouds, object segmentation, physics metadata — within 24 hours. First vertical: warehouse and logistics environments.",
  firstCustomer:
    "Not frontier labs first. Mid-size robotics and logistics companies who need environment data now and cannot build capture ops in-house. That revenue funds the dataset library, which is the long-term asset licensed to larger labs once it is large enough to matter.",
  first90:
    "Build one capture rig, capture 10–20 real spaces, package the output as a clean dataset, and sell it as a pilot to one robotics or world-model startup. That single deployable proof point is what makes the rest fundable.",
  crawl:
    "The physical-world equivalent of what Common Crawl was for text — except instead of scraping something that already exists, we build the thing that does not exist yet, and own it as it grows.",
} as const;
