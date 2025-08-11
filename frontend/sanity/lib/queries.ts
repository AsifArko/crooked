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

export const resumeQuery = defineQuery(`
  *[_type == "docFile" && category == "resume" && isPublic == true][0] {
    _id,
    name,
    description,
    "fileUrl": file.asset->url,
    uploadedAt
  }
`);
