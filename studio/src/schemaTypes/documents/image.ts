import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'imageFile',
  title: 'Image File',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Image Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'A friendly name to reference this image by',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      validation: (Rule) => Rule.required(),
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'alt',
      title: 'Alt Text',
      type: 'string',
      description: 'Alternative text for accessibility',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Profile Picture', value: 'profile'},
          {title: 'Portfolio', value: 'portfolio'},
          {title: 'Background', value: 'background'},
          {title: 'Icon', value: 'icon'},
          {title: 'Other', value: 'other'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'isPublic',
      title: 'Public',
      type: 'boolean',
      initialValue: true,
      description: 'Whether this image should be publicly accessible',
    }),
    defineField({
      name: 'uploadedAt',
      title: 'Uploaded At',
      type: 'datetime',
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      category: 'category',
      isPublic: 'isPublic',
      media: 'image',
    },
    prepare(selection) {
      const {title, category, isPublic, media} = selection
      return {
        title,
        subtitle: `${category} - ${isPublic ? 'Public' : 'Private'}`,
        media,
      }
    },
  },
})
