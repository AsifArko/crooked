import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'settings',
  title: 'Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Site Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Site Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Hero Title',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'subtitle',
          title: 'Hero Subtitle',
          type: 'text',
          rows: 2,
        },
        {
          name: 'ctaText',
          title: 'Call to Action Text',
          type: 'string',
        },
        {
          name: 'ctaLink',
          title: 'Call to Action Link',
          type: 'string',
        },
      ],
    }),
    defineField({
      name: 'profile',
      title: 'Profile Information',
      type: 'object',
      fields: [
        {
          name: 'name',
          title: 'Full Name',
          type: 'string',
        },
        {
          name: 'title',
          title: 'Professional Title',
          type: 'string',
        },
        {
          name: 'bio',
          title: 'Bio',
          type: 'text',
          rows: 4,
        },
        {
          name: 'profileImage',
          title: 'Profile Image',
          type: 'reference',
          to: [{type: 'image'}],
        },
      ],
    }),
    defineField({
      name: 'social',
      title: 'Social Links',
      type: 'object',
      fields: [
        {
          name: 'github',
          title: 'GitHub URL',
          type: 'url',
        },
        {
          name: 'linkedin',
          title: 'LinkedIn URL',
          type: 'url',
        },
        {
          name: 'twitter',
          title: 'Twitter URL',
          type: 'url',
        },
        {
          name: 'email',
          title: 'Email',
          type: 'string',
        },
      ],
    }),
    defineField({
      name: 'github',
      title: 'GitHub Configuration',
      type: 'object',
      fields: [
        {
          name: 'username',
          title: 'GitHub Username',
          type: 'string',
          description: 'Username for GitHub contribution graph',
        },
        {
          name: 'showContributions',
          title: 'Show Contribution Graph',
          type: 'boolean',
          initialValue: true,
        },
      ],
    }),
    defineField({
      name: 'stripe',
      title: 'Stripe Configuration',
      type: 'object',
      fields: [
        {
          name: 'publishableKey',
          title: 'Publishable Key',
          type: 'string',
        },
        {
          name: 'webhookSecret',
          title: 'Webhook Secret',
          type: 'string',
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare() {
      return {
        title: 'Site Settings',
      }
    },
  },
}) 