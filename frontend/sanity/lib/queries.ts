import { defineQuery } from "next-sanity";

export const settingsQuery = defineQuery(`*[_type == "settings"][0]`);

export const sourceCodesQuery = defineQuery(`
  *[_type == "sourceCode" && isPublished == true] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    description,
    githubUrl,
    demoUrl,
    price,
    "mainImage": mainImage.asset->url,
    "images": images[].asset->url,
    technologies,
    features,
    readme,
    publishedAt
  }
`);
