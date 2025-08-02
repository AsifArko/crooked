import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'sourceCode',
  title: 'Source Code',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'githubUrl',
      title: 'GitHub Repository URL',
      type: 'url',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'demoUrl',
      title: 'Demo URL',
      type: 'url',
    }),
    defineField({
      name: 'price',
      title: 'Price (USD)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
      description:
        'Price in USD. Stripe checkout session will be created dynamically based on this price.',
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'images',
      title: 'Additional Images',
      type: 'array',
      of: [{type: 'image'}],
    }),
    defineField({
      name: 'technologies',
      title: 'Technologies Used',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'readme',
      title: 'README Content',
      type: 'text',
      rows: 10,
    }),
    defineField({
      name: 'isPublished',
      title: 'Published',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      price: 'price',
      isPublished: 'isPublished',
    },
    prepare(selection) {
      const {title, price, isPublished} = selection
      return {
        title,
        subtitle: `$${price} - ${isPublished ? 'Published' : 'Draft'}`,
      }
    },
  },
})
